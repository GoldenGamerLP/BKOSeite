import { getAllEntschuldigungen } from "~/server/utils/EntschuldigungUtils";
import * as z from "zod";

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

  const { searchValue, searchType, sortType } = data;

  return await getAllEntschuldigungen(searchType, searchValue, sortType);
});

const validation = z.object({
  searchValue: z.string().optional().default(""),
  searchType: z
    .enum(["vorname", "nachname", "klasse", "zeitraum"])
    .optional()
    .default("vorname"),
  sortType: z
    .enum(["nachname", "klasse", "zeitraum"])
    .optional()
    .default("zeitraum"),
});
