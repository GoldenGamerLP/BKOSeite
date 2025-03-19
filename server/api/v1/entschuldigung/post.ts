import * as z from "zod";
import { createEntschuldigung } from "~/server/utils/EntschuldigungUtils";
import { uploadFile } from "~/server/utils/FileUtils";
import type { FileAttachment } from "~/types/Entschuldigungen";

// Validation schema for files
const fileSchema = z.object({
  filename: z.string().min(1),
  data: z.instanceof(Buffer),
  type: z.string().min(1),
  size: z.number().max(10 * 1024 * 1024) // Max 10MB
});

// Main schema for form data
const formSchema = z.object({
  vorname: z.string().min(1, "Vorname ist erforderlich"),
  nachname: z.string().min(1, "Nachname ist erforderlich"),
  klassenleiter: z.string().min(1, "Klassenleiter ist erforderlich"),
  klasse: z.string().min(1, "Klasse ist erforderlich"),
  zeitraumVon: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Ungültiges Startdatum"
  }),
  zeitraumBis: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Ungültiges Enddatum"
  }),
  begruendung: z.string().min(1, "Begründung ist erforderlich"),
  zusatzlicherKommentar: z.string().optional(),
  ortDatum: z.string().min(1, "Ort und Datum sind erforderlich"),
  unterschrift: z.string().min(1, "Unterschrift ist erforderlich"),
});

export default defineEventHandler(async (event) => {
  try {
    // Read multipart form data
    const formData = await readMultipartFormData(event);
    if (!formData) {
      throw createError({
        status: 400,
        message: "Invalid form data"
      });
    }

    // Extract form fields
    const formFields: Record<string, string> = {};
    const fileFields: { name: string, file: any }[] = [];

    // Process form fields
    formData.forEach(part => {
      if (part.name && part.data) {
        if (part.filename) {
          // This is a file
          fileFields.push({
            name: part.name,
            file: {
              filename: part.filename,
              data: part.data,
              type: part.type || 'application/octet-stream',
              size: part.data.length
            }
          });
        } else {
          // This is a regular form field
          formFields[part.name] = part.data.toString();
        }
      }
    });

    // Validate form fields
    const validatedData = formSchema.parse(formFields);

    // Upload files to GridFS
    const fileAttachments: FileAttachment[] = [];
    for (const fileField of fileFields) {
      try {
        // Validate file
        const validatedFile = fileSchema.parse(fileField.file);
        
        // Upload file to GridFS
        const fileDoc = await uploadFile(
          validatedFile.data,
          validatedFile.filename,
          validatedFile.type
        );
        
        // Store file reference
        fileAttachments.push({
          fileId: fileDoc.id,
          filename: fileDoc.filename,
          contentType: fileDoc.contentType,
          length: fileDoc.length
        });
      } catch (fileError) {
        console.error(`Error uploading file: ${fileField.file.filename}`, fileError);
        // We continue processing other files despite errors
      }
    }

    // Create the document with all data
    const entschuldigungData = {
      id: `entschuldigung_${Date.now()}`,
      vorname: validatedData.vorname,
      nachname: validatedData.nachname,
      klassenleiter: validatedData.klassenleiter,
      klasse: validatedData.klasse,
      zeitraumVon: new Date(validatedData.zeitraumVon),
      zeitraumBis: new Date(validatedData.zeitraumBis),
      erstelltAm: new Date(),
      begruendung: validatedData.begruendung,
      zusatzlicherKommentar: validatedData.zusatzlicherKommentar || "",
      ortDatum: validatedData.ortDatum,
      unterschrift: validatedData.unterschrift,
      anlagen: fileAttachments.length > 0 ? fileAttachments : undefined
    };

    // Save to database
    await createEntschuldigung(entschuldigungData);

    return {
      success: true,
      message: "Entschuldigung erfolgreich eingereicht",
      id: entschuldigungData.id
    };
  } catch (error: any) {
    console.error("Error processing entschuldigung form:", error);
    
    throw createError({
      status: 400,
      message: error.message || "Ein Fehler ist aufgetreten"
    });
  }
});