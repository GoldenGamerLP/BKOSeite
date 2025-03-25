import * as z from "zod";
import { getEntschuldigungenByUserId } from "~/server/utils/EntschuldigungUtils";

export default defineEventHandler(async (event) => {
  const { success, data, error } = await getValidatedQuery(
    event,
    validation.safeParseAsync
  );

  if (error) {
    throw createError({
      statusCode: 400,
      message: "Invalid query parameters",
    });
  }

  const { userId, showOnlyInvalid, sortType } = data;

  // Fetch entschuldigungen for the user
  return await getEntschuldigungenByUserId(userId, showOnlyInvalid, sortType);
});

const validation = z.object({
  userId: z.string().min(1, "User ID ist erforderlich"),
  sortType: z.enum(["seven", "fourteen", "thirty", "ninety", "yearly"]),
  showOnlyInvalid: z.coerce.boolean(),
});
