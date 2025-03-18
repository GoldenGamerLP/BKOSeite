import * as z from "zod";
import { createEntschuldigung } from "~/server/utils/EntschuldigungUtils";

export default defineEventHandler(async (event) => {
    const { success, error, data} = await readValidatedBody(event, schema.safeParseAsync);

    if(!success) {
        throw createError({
            status: 400,
            message: error.message,
        })
    }

    if(!data) {
        throw createError({
            status: 400,
            message: "Invalid body"
        })
    }

    const currentData = {...data, id: "entschuldigung_" + Date.now().toString()};

    await createEntschuldigung(currentData);
});

const schema = z.object({
    vorname: z.string(),
    klassenleiter: z.string(),
    klasse: z.string(),
    zeitraumVon: z.coerce.date(),
    zeitraumBis: z.coerce.date(),
    begruendung: z.string(),
    zusatzlicherKommentar: z.string(),
    ortDatum: z.string(),
    unterschrift: z.string(),
});