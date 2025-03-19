<template>
    <div>
        <div class="flex justify-between items-center p-2">
            <div>
                <h1 class="text-3xl font-bold">Entschuldigungen</h1>
                <p class="text-lg text-muted-foreground mb-8">Hier kannst du alle Entschuldigungen sehen. <span
                        class="text-muted-foreground">({{ data?.length }})</span></p>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <Select class="col-span-1" v-model="searchType" id="searchType">
                    <SelectTrigger>
                        <SelectValue placeholder="Suchen nach" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Such Kriterium</SelectLabel>
                            <SelectItem value="vorname">
                                Vorname
                            </SelectItem>
                            <SelectItem value="nachname">
                                Nachname
                            </SelectItem>
                            <SelectItem value="klasse">
                                Klasse
                            </SelectItem>
                            <SelectItem value="zeitraum">
                                Zeitraum
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <label for="search" class="sr-only">Search</label>
                <Input id="search" v-model="searchValue" type="search" placeholder="Suchen" class="col-span-1" />
                <div class="col-span-2 w-full">
                    <Select class="w-full" v-model="sortType" id="sortType">
                        <SelectTrigger>
                            <SelectValue placeholder="Sortieren nach" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Sortier Optionen</SelectLabel>
                                <SelectItem value="nachname">
                                    A-Z Nachname
                                </SelectItem>
                                <SelectItem value="klasse">
                                    A-Z Klasse
                                </SelectItem>
                                <SelectItem value="zeitraum">
                                    Neuste zu älteste Zeitraum
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
                <Card class="mb-4" :class="entry.status === 'gelesen' ? 'bg-green-50' : ''">
                    <CardHeader>
                        <CardTitle class="text-xl">{{ entry.nachname }} - {{ entry.vorname }}</CardTitle>
                        <CardDescription class="text-base">Erstellt am {{ formatDate(entry.erstelltAm) }}</CardDescription>
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
                        <div v-if="entry.anlagen">
                            <p class="font-medium mb-2">Anlagen:</p>
                            <ol class="flex flex-wrap gap-2">
                                <li v-for="file in entry.anlagen" :key="file.filename" alt="Anlage">
                                    <a class="border border-dashed rounded-lg flex flex-col items-center justify-center p-2" :href="`/api/v1/files/${file.fileId}`" target="_blank" download>
                                        <File class="text-muted-foreground" />
                                        <p class="text-sm text-muted-foreground">{{ file.filename }}</p>
                                        <p class="text-sm text-muted-foreground">{{ formatSize(file.length) }}</p>
                                        <p class="text-sm text-muted-foreground">{{ file.contentType }}</p>
                                    </a>
                                </li>
                            </ol>
                        </div>
                    </CardContent>
                    <CardFooter class="flex flex-wrap gap-2 justify-center sm:justify-start">
                        <Button variant="default" class="flex-grow sm:flex-grow-0" @click="markAsRead(entry)">
                            <template v-if="loading === entry.id + 'read'">
                                <span class="animate-spin mr-1">⌛</span> Verarbeite...
                            </template>
                            <template v-else-if="!entry.status">Als gelesen Markieren</template>
                            <template v-else>
                                <CheckCheck />
                                Gelesen
                            </template>
                        </Button>
                        <Button variant="secondary" class="flex-grow sm:flex-grow-0" @click="markAsInvalid(entry)">
                            <template v-if="loading === entry.id + 'invalid'">
                                <span class="animate-spin mr-1">⌛</span> Verarbeite...
                            </template>
                            <template v-else>Als invalide Markieren</template>
                        </Button>
                        <Button variant="secondary" class="flex-grow sm:flex-grow-0" @click="deleteEntry(entry)">
                            <template v-if="loading === entry.id + 'delete'">
                                <span class="animate-spin mr-1">⌛</span> Lösche...
                            </template>
                            <template v-else>Löschen</template>
                        </Button>
                    </CardFooter>
                </Card>
            </li>
        </ol>
    </div>
</template>

<script lang="ts" setup>
import { File, CheckCheck } from 'lucide-vue-next';
import { refDebounced } from '@vueuse/core'

const searchType = shallowRef("vorname");
const sortType = shallowRef("nachname");
const searchValue = shallowRef("");
const loading = ref("");

const debSearchType = refDebounced(searchType, 300);
const debSortType = refDebounced(sortType, 300);
const debSearchValue = refDebounced(searchValue, 300);

const { data, status, refresh } = useLazyFetch("/api/v1/entschuldigung/get", {
    method: "GET",
    query: {
        searchType: debSearchType,
        searchValue: debSearchValue,
        sortType: debSortType,
    },
    watch: [debSearchType, debSortType, debSearchValue],
});

const markAsRead = async (entry) => {
    try {
        loading.value = entry.id + "read";
        await $fetch('/api/v1/entschuldigung/updateStatus', {
            method: 'POST',
            body: {
                id: entry.id,
                status: 'gelesen'
            }
        });
        refresh();
        // Optional: show success message
    } catch (error) {
        console.error('Fehler beim Markieren als gelesen:', error);
        // Optional: show error message
    } finally {
        loading.value = "";
    }
};

const markAsInvalid = async (entry) => {
    try {
        loading.value = entry.id + "invalid";
        await $fetch('/api/v1/entschuldigung/updateStatus', {
            method: 'POST',
            body: {
                id: entry.id,
                status: 'invalide'
            }
        });
        refresh();
        // Optional: show success message
    } catch (error) {
        console.error('Fehler beim Markieren als invalide:', error);
        // Optional: show error message
    } finally {
        loading.value = "";
    }
};

const deleteEntry = async (entry) => {
    if (!confirm("Möchtest du die Entschuldigung wirklich löschen?")) {
        return;
    }
    
    try {
        loading.value = entry.id + "delete";
        await $fetch('/api/v1/entschuldigung/delete', {
            method: 'POST',
            body: {
                id: entry.id
            }
        });
        refresh();
        // Optional: show success message
    } catch (error) {
        console.error('Fehler beim Löschen:', error);
        // Optional: show error message
    } finally {
        loading.value = "";
    }
};

const formatDate = (date: string) => {
    const d = new Date(date);
    return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
};

const formatSize = (size: number) => {
    const units = ["B", "KB", "MB", "GB", "TB"];
    let unitIndex = 0;
    while (size > 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }
    return `${size.toFixed(2)} ${units[unitIndex]}`;
};
</script>