import { deleteEntschuldigung } from "~/server/utils/EntschuldigungUtils";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { id } = body;
    
    if (!id) {
      throw createError({
        status: 400,
        message: "ID is required"
      });
    }
    
    await deleteEntschuldigung(id);
    
    return {
      success: true,
      message: "Entschuldigung erfolgreich gelöscht"
    };
  } catch (error: any) {
    console.error("Error deleting entschuldigung:", error);
    
    throw createError({
      status: 500,
      message: error.message || "Ein Fehler ist aufgetreten"
    });
  }
});
