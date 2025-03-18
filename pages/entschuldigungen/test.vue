<template>
    <div>
        <div class="flex justify-between items-center p-2">
            <div>
                <h1 class="text-3xl font-bold">Entschuldigungen</h1>
                <p class="text-lg text-muted-foreground mb-8">Hier kannst du alle Entschuldigungen sehen. <span
                        class="text-muted-foreground">({{ data?.length }})</span></p>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <Select class="col-span-1">
                    <SelectTrigger>
                        <SelectValue placeholder="Select a fruit" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Fruits</SelectLabel>
                            <SelectItem value="apple">
                                Apple
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <label for="search" class="sr-only">Search</label>
                <Input id="search" type="search" placeholder="Suchen" class="col-span-1" />
                <div class="col-span-2 w-full">
                    <Select class="w-full">
                        <SelectTrigger>
                            <SelectValue placeholder="Sortieren nach" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Fruits</SelectLabel>
                                <SelectItem value="apple">
                                    Apple
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
        <Separator class="my-4" />
        <ol class="p-2">
            <li v-for="entry in data" :key="entry.id">
                <Card class="mb-4">
                    <CardHeader>
                        <CardTitle class="text-xl">{{ entry.nachname }}</CardTitle>
                        <CardDescription class="text-base">{{ entry.vorname }}</CardDescription>
                    </CardHeader>
                    <CardContent class="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                            <p class="font-medium">Klasse:</p>
                            <p class="text-muted-foreground">{{ entry.klasse }}</p>
                        </div>
                        <div>
                            <p class="font-medium">Zeitraum:</p>
                            <p class="text-muted-foreground">{{ formatDate(entry.zeitraumVon) }} bis zum {{
                                formatDate(entry.zeitraumBis) }}</p>
                        </div>
                        <div v-if="entry.klassenleiter">
                            <p class="font-medium">Klassenleiter:</p>
                            <p class="text-muted-foreground">{{ entry.klassenleiter }}</p>
                        </div>
                        <div>
                            <p class="font-medium">Begründung:</p>
                            <p class="break-words text-muted-foreground">{{ entry.begruendung }}</p>
                        </div>
                        <div v-if="entry.zusatzlicherKommentar">
                            <p class="font-medium">Kommentar:</p>
                            <p class="break-words text-muted-foreground">{{ entry.zusatzlicherKommentar }}</p>
                        </div>
                        <div>
                            <p class="font-medium">Ort & Datum:</p>
                            <p class="text-muted-foreground">{{ entry.ortDatum }}</p>
                        </div>
                        <div v-if="entry.unterschrift" class="mt-2 max-w-full">
                            <p class="font-medium">Unterschrift:</p>
                            <img :src="entry.unterschrift" alt="Unterschrift"
                                class="max-w-[200px] bg-slate-300 object-contain rounded-lg" />
                        </div>
                    </CardContent>
                    <CardFooter class="flex flex-wrap gap-2 justify-center sm:justify-start">
                        <Button variant="default" class="flex-grow sm:flex-grow-0">Als gelesen Markieren</Button>
                        <Button variant="secondary" class="flex-grow sm:flex-grow-0">Als invalide Markieren</Button>
                        <Button variant="secondary" class="flex-grow sm:flex-grow-0">Löschen</Button>
                    </CardFooter>
                </Card>
            </li>
        </ol>
    </div>
</template>

<script lang="ts" setup>
const { data, status } = useLazyFetch("/api/v1/entschuldigung/get");

const formatDate = (date: string) => {
    const d = new Date(date);
    return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
};
</script>