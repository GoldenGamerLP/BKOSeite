import { getAllEntschuldigungen } from "~/server/utils/EntschuldigungUtils";
import * as z from "zod";

export default defineEventHandler(async (event) => {
  const { success, data, error } = await getValidatedQuery(
    event,
    validation.safeParseAsync
  );

  if (error) {
    throw createError({
      status: 400,
      statusMessage: "Not enough arguments",
    });
  }

  const { searchType, searchValue, sortType } = data;

  const entschuldigung = await getAllEntschuldigungen(
    searchType,
    searchValue,
    sortType
  );
  return entschuldigung;
});

const validation = z.object({
  searchType: z.enum(["vorname", "nachname", "klasse", "zeitraum"]),
  searchValue: z.string().trim(),
  sortType: z.enum(["nachname", "klasse", "zeitraum"]),
});
