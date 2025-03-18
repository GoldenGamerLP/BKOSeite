<template>
    <div class="max-w-4xl mx-auto p-4">
        <h1 class="text-3xl font-bold">Entschuldigungs Formular</h1>
        <p class="text-lg text-muted-foreground mb-8">
            Bitte fülle das Formular aus, um dich zu entschuldigen.
        </p>
        <form class="grid grid-cols-1 gap-4" @submit.prevent.stop="submit">
            <Label for="name">Name</Label>
            <Input id="name" type="text" v-model="name" autocomplete="family-name" required />

            <Label for="vorname">Vorname</Label>
            <Input id="vorname" type="text" v-model="vorname" autocomplete="name" required />

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

            <SystemAnlagen />

            <Label for="ortDatum">Ort & Datum</Label>
            <Input id="ortDatum" type="text" v-model="ortDatum" autocomplete="off" required />

            <Label for="unterschrift">Unterschrift</Label>
            <SystemUnterschrift id="unterschrift" ref="unterschrift" />

            <Button type="submit">Absenden</Button>
        </form>
    </div>
</template>

<script lang="ts" setup>
import { cn } from "@/lib/utils";
import { Check, Search } from "lucide-vue-next";
import { getLocalTimeZone, today } from "@internationalized/date";
import type { DateRange } from "reka-ui";
import Unterschrift from "~/components/system/Unterschrift.vue";

const unterschrift = ref<typeof Unterschrift>();
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

const submit = () => {
    const data = {
        name: name.value,
        vorname: vorname.value,
        klassenleiter: klassenleiter.value,
        klasse: klasse.value,
        zeitraumVon: zeitraum.value.start?.toString(),
        zeitraumBis: zeitraum.value.end?.toString(),
        begruendung: begruendung.value,
        zusatzlicherKommentar: zusatzlicherKommentar.value,
        ortDatum: ortDatum.value,
        unterschrift: unterschrift.value?.getSignature(),
    };

    console.log(JSON.stringify(data));

    try {
        $fetch("/api/v1/entschuldigung/post", {
            method: "POST",
            body: JSON.stringify(data),
        });
    } catch (error) {
        console.error(error);
    }

    // Reset the form by reloading the page
    //window.location.reload();
};

// Define a schema for the form: Name, Vorname, Klassenleiter, Klasse, Zeitraum (RangeCalender), Begründung (Selector), Zusätzlicher Kommentar (Textarea), Anlagen (FileUpload), Ort & Datum (Text), Unterschrift (Signature/Canvas)
</script>
