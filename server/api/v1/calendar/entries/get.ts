import { getTestCalendarEntries } from "~/server/utils/CalendarUtils";
import { CalendarEntry } from "~/types/Calendar";
import * as z from "zod";

export default defineEventHandler(() => {
    return getTestCalendarEntries() as CalendarEntry[];
});

const validation = z.object({
    from: z.coerce.date(),
    to: z.coerce.date().optional(),
})


