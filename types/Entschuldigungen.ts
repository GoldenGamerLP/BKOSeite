import { ObjectId } from "mongodb";

type FileAttachment = {
  fileId: ObjectId; // GridFS file ID
  filename: string;
  contentType: string;
  length: number;
};

type Entschuldigungen = {
  userId: string; // ID of the user who created the entschuldigung
  id: string;
  vorname: string;
  nachname: string;
  klassenleiter: string;
  klasse: string;
  zeitraumVon: Date;
  zeitraumBis: Date;
  erstelltAm: Date;
  begruendung: string;
  zusatzlicherKommentar: string;
  ortDatum: string;
  unterschrift: string;
  anlagen?: FileAttachment[]; // Optional array of file attachments
  status?: "gueltig" | "ungueltig" | undefined; // Added status field
};

export type { Entschuldigungen, FileAttachment };
