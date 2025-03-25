<template>
    <div>
        <div class="flex flex-col gap-4 p-6">
            <h1 class="text-2xl font-bold">Meine Entschuldigung</h1>
            <p class="text-gray-500">Hier kannst du deine Entschuldigung sehen.</p>
        </div>
        <Separator class="my-4" />
        <div v-if="eigeneEntschuldigungen" class="mt-4">
            <ol class="list-none p-2">
                <li v-for="entschuldigung in eigeneEntschuldigungen" :key="entschuldigung.id" class="mb-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Entschuldigung vom {{ formatDate(entschuldigung.zeitraumVon) }} - {{
                                formatDate(entschuldigung.zeitraumBis) }}</CardTitle>
                            <CardDescription>Erstellt am {{ formatDate(entschuldigung.erstelltAm) }}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Begründung: {{ entschuldigung.begruendung }}</p>
                            <p>Kommentar: {{ entschuldigung.zusatzlicherKommentar }}</p>
                        </CardContent>
                        <CardFooter>
                            <p> Status: <Badge :variant="entschuldigung?.status === 'gueltig' ? 'default' : 'secondary'">{{ entschuldigung.status || "Offen" }}</Badge>
                            </p>
                        </CardFooter>
                    </Card>
                </li>
            </ol>
        </div>

        <div v-else-if="status === 'pending'">
            <Loader2Icon class="animate-spin" />
        </div>

        <div v-else-if="status === 'error'">
            <p>Fehler beim Laden der Daten.</p>
        </div>
        <div v-else>
            <p>Keine Entschuldigungen gefunden.</p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useUser } from '~/composable/auth';
import { Loader2Icon } from 'lucide-vue-next';

definePageMeta({
    layout: "sidebar",
});

useHead({
    title: "Meine Entschuldigung",
})

const user = useUser();

const { data: eigeneEntschuldigungen, status } = useLazyFetch("/api/v1/entschuldigung/own/get", {
    method: "GET",
    query: {
        userId: user.value?._id,
    },
});

const formatDate = (date: string) => {
    const d = new Date(date);
    return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
};
</script>