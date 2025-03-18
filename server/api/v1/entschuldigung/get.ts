import { getAllEntschuldigungen } from "~/server/utils/EntschuldigungUtils";

export default defineEventHandler(async (event) => {
    const entschuldigung = await getAllEntschuldigungen();
    return entschuldigung;
});