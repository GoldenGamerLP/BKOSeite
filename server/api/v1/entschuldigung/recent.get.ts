import * as z from "zod";
import { getRecentEntschuldigungen } from "~/server/utils/EntschuldigungUtils";

export default defineEventHandler(async (event) => {
  const { success, data, error } = await getValidatedQuery(
    event,
    validation.safeParseAsync
  );

  if (error) {
    throw createError({
      status: 400,
      statusMessage: "Error while Validation",
    });
  }

  return await getRecentEntschuldigungen(data.userId);
});

const validation = z.object({
  userId: z.string().min(1),
});
