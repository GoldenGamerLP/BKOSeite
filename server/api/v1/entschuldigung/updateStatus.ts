import { markEntschuldigungAsRead, markEntschuldigungAsInvalid } from "~/server/utils/EntschuldigungUtils";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { id, status } = body;
    
    if (!id) {
      throw createError({
        status: 400,
        message: "ID is required"
      });
    }
    
    if (status === "gelesen") {
      await markEntschuldigungAsRead(id);
      return { success: true, message: "Entschuldigung als gelesen markiert" };
    } else if (status === "invalide") {
      await markEntschuldigungAsInvalid(id);
      return { success: true, message: "Entschuldigung als invalide markiert" };
    } else {
      throw createError({
        status: 400,
        message: "Ungültiger Status"
      });
    }
  } catch (error: any) {
    console.error("Error updating entschuldigung status:", error);
    
    throw createError({
      status: 500,
      message: error.message || "Ein Fehler ist aufgetreten"
    });
  }
});
