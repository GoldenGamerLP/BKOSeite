<template>
    <div class="max-w-4xl mx-auto p-4">
        <h1 class="text-3xl font-bold">Entschuldigungs Formular</h1>
        <p class="text-lg text-muted-foreground mb-8">
            Bitte fülle das Formular aus, um dich zu entschuldigen.
        </p>
        <form class="grid grid-cols-1 gap-4" @submit.prevent.stop="submit">
            <Label for="name">Name</Label>
            <Input id="name" type="text" v-model="name" autocomplete="off" required disabled />

            <Label for="vorname">Vorname</Label>
            <Input id="vorname" type="text" v-model="vorname" autocomplete="off" required disabled />

            <Label for="klassenleiter">Klassenleiter</Label>
            <Input id="klassenleiter" type="text" v-model="klassenleiter" required />

            <Label for="klasse">Klasse</Label>
            <Select v-model="klasse" id="klasse">
                <SelectTrigger class="w-full">
                    <SelectValue placeholder="Wähle eine Klasse..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Begründungen</SelectLabel>
                        <SelectItem v-for="option in klasseOptions" :key="option.value" :value="option.value">
                            {{ option.label }}
                        </SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>

            <Label for="zeitraum">Zeitraum</Label>
            <RangeCalendar id="zeitraum" v-model="zeitraum" />

            <Label for="begruendung">Begründung</Label>
            <Select v-model="begruendung" id="begruendung">
                <SelectTrigger class="w-full">
                    <SelectValue placeholder="Wähle eine Begründung..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Begründungen</SelectLabel>
                        <SelectItem v-for="option in begruendungOptions" :key="option.value" :value="option.value">
                            {{ option.label }}
                        </SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>

            <Label for="zusatzlicherKommentar">Zusätzlicher Kommentar</Label>
            <Textarea id="zusatzlicherKommentar" v-model="zusatzlicherKommentar" placeholder="Dein Kommentar" />

            <SystemAnlagen ref="systemAnlagen" />

            <Label for="ortDatum">Ort & Datum</Label>
            <Input id="ortDatum" type="text" v-model="ortDatum" autocomplete="street-address" required />

            <Label for="unterschrift">Unterschrift</Label>
            <SystemUnterschrift id="unterschrift" ref="unterschrift" />

            <Button type="submit">
                <template v-if="isLoading">
                    <Loader2Icon class="w-5 h-5 animate-spin" /> Lade...
                </template>
                <template v-else>Senden</template>
            </Button>
        </form>
    </div>
</template>

<script lang="ts" setup>
import { getLocalTimeZone, today } from "@internationalized/date";
import type { DateRange } from "reka-ui";
import Unterschrift from "~/components/system/Unterschrift.vue";
import Anlagen from "~/components/system/Anlagen.vue";
import { Loader2Icon } from "lucide-vue-next";
import { useUser } from "~/composable/auth";

const user = useUser();

definePageMeta({
    layout: "sidebar",
});

useHead({
    title: "Neue Entschuldigung",
});

onMounted(() => {
    if(!user.value) return;

    name.value = user.value?.lastname || "";
    vorname.value = user.value?.name || "";
});

const isLoading = ref(false);
const unterschrift = ref<typeof Unterschrift>();
const systemAnlagen = ref<typeof Anlagen>();
const name = ref("");
const vorname = ref("");
const klassenleiter = ref("");
const klasse = ref("");
const zeitraum = ref({
    start: today(getLocalTimeZone()),
    end: today(getLocalTimeZone()),
} as DateRange) as Ref<DateRange>;
const begruendung = ref("");
const zusatzlicherKommentar = ref("");
const ortDatum = ref("");

const klasseOptions = ref([
    { value: "DIT11A", label: "DIT11A" },
    { value: "DIT12A", label: "DIT12A" },
    { value: "DIT13A", label: "DIT13A" },
]);

const begruendungOptions = ref([
    { value: "Krankheit", label: "Krankheit" },
    { value: "Familie", label: "Familie" },
    { value: "Sonstiges", label: "Sonstiges" },
]);

const submit = async () => {
    isLoading.value = true;
    const formData = new FormData();

    formData.append('userId', user.value?._id || '');
    formData.append('nachname', name.value);
    formData.append('vorname', vorname.value);
    formData.append('klassenleiter', klassenleiter.value);
    formData.append('klasse', klasse.value);
    formData.append('zeitraumVon', zeitraum.value.start?.toString() || '');
    formData.append('zeitraumBis', zeitraum.value.end?.toString() || '');
    formData.append('begruendung', begruendung.value);
    formData.append('zusatzlicherKommentar', zusatzlicherKommentar.value);
    formData.append('ortDatum', ortDatum.value);
    formData.append('unterschrift', unterschrift.value?.getSignature());

    // Append multiple files if any
    const files: FileList = systemAnlagen.value?.getFiles();
    if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            formData.append('anlagen', files[i], files[i].name);
        }
    }

    try {
        await $fetch('/api/v1/entschuldigung/post', {
            method: 'POST',
            body: formData,
            headers: {
                "cache-control": "no-cache",
            },
        });
        // Show success message to user
        alert('Entschuldigung erfolgreich eingereicht');
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('Fehler beim Senden des Formulars');
    } finally {
        isLoading.value = false;
    }
};

// Define a schema for the form: Name, Vorname, Klassenleiter, Klasse, Zeitraum (RangeCalender), Begründung (Selector), Zusätzlicher Kommentar (Textarea), Anlagen (FileUpload), Ort & Datum (Text), Unterschrift (Signature/Canvas)
</script>
