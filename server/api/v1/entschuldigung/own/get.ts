import * as z from 'zod';
import { getEntschuldigungenByUserId } from '~/server/utils/EntschuldigungUtils';

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

    const { userId } = data;

    // Fetch entschuldigungen for the user
    return await getEntschuldigungenByUserId(userId);
});

const validation = z.object({
    userId: z.string().min(1, "User ID ist erforderlich"),
});