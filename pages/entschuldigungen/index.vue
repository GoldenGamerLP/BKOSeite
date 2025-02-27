<template>
    <div class="max-w-4xl mx-auto p-4">
        <form class="grid grid-cols-1 gap-4" @submit.prevent="submit">
            <Label for="name">Name</Label>
            <Input id="name" type="text" v-model="name" autocomplete="family-name" />

            <Label for="vorname">Vorname</Label>
            <Input id="vorname" type="text" v-model="vorname" autocomplete="name" />

            <Label for="klassenleiter">Klassenleiter</Label>
            <Input id="klassenleiter" type="text" v-model="klassenleiter" />

            <Label for="klasse">Klasse</Label>
            <Combobox by="label">
                <ComboboxAnchor>
                    <div class="relative w-full items-center">
                        <ComboboxInput class="pl-9" :display-value="(val) => val?.label ?? ''"
                            placeholder="Wähle deine Klasse..." />
                        <span class="absolute start-0 inset-y-0 flex items-center justify-center px-3">
                            <Search class="size-4 text-muted-foreground" />
                        </span>
                    </div>
                </ComboboxAnchor>

                <ComboboxList>
                    <ComboboxEmpty>
                        Keine Klasse gefunden
                    </ComboboxEmpty>

                    <ComboboxGroup>
                        <ComboboxItem v-for="klasse in klasseOptions" :key="klasse.value" :value="klasse">
                            {{ klasse.label }}

                            <ComboboxItemIndicator>
                                <Check :class="cn('ml-auto h-4 w-4')" />
                            </ComboboxItemIndicator>
                        </ComboboxItem>
                    </ComboboxGroup>
                </ComboboxList>
            </Combobox>

            <Label for="zeitraum">Zeitraum</Label>
            <RangeCalendar id="zeitraum" v-model="zeitraum" />

            <Label for="begruendung">Begründung</Label>
            <Select>
                <SelectTrigger class="w-full">
                    <SelectValue placeholder="Wähle eine Begründung..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Begründungen</SelectLabel>
                        <SelectItem value="Krankmeldung">
                            Krankmeldung
                        </SelectItem>
                        <SelectItem value="Vorstellungsgespräch">
                            Vorstellungsgespräch
                        </SelectItem>
                        <SelectItem value="Sonstige">
                            Sonstige
                        </SelectItem>
                        <SelectItem value="grapes">
                            Grapes
                        </SelectItem>
                        <SelectItem value="pineapple">
                            Pineapple
                        </SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>

            <Label for="zusatzlicherKommentar">Zusätzlicher Kommentar</Label>
            <Textarea id="zusatzlicherKommentar" v-model="zusatzlicherKommentar" placeholder="Dein Kommentar" />

            <Label for="anlagen">Anlagen</Label>
            <Input id="anlagen" type="file" @update:model-value="files" multiple />

            <Label for="ortDatum">Ort & Datum</Label>
            <Input id="ortDatum" type="text" v-model="ortDatum" autocomplete="off" />

            <Label for="unterschrift">Unterschrift</Label>
            <SystemUnterschrift id="unterschrift" />

            <Button type="submit">Absenden</Button>
        </form>
    </div>
</template>

<script lang="ts" setup>
import { cn } from '@/lib/utils';
import { Check, Search } from 'lucide-vue-next';

const name = ref('');
const vorname = ref('');
const klassenleiter = ref('');
const klasse = ref('');
const zeitraum = ref('');
const begruendung = ref('');
const zusatzlicherKommentar = ref('');
const ortDatum = ref('');
const unterschrift = ref('');

const klasseOptions = ref([
    { value: '5a', label: '5a' },
    { value: '5b', label: '5b' },
    { value: '5c', label: '5c' },
    { value: '6a', label: '6a' },
    { value: '6b', label: '6b' },
    { value: '6c', label: '6c' },
    { value: '7a', label: '7a' },
    { value: '7b', label: '7b' },
    { value: '7c', label: '7c' },
    { value: '8a', label: '8a' },
    { value: '8b', label: '8b' },
    { value: '8c', label: '8c' },
    { value: '9a', label: '9a' },
    { value: '9b', label: '9b' },
    { value: '9c', label: '9c' },
    { value: '10a', label: '10a' },
    { value: '10b', label: '10b' },
    { value: '10c', label: '10c' },
    { value: '11a', label: '11a' },
    { value: '11b', label: '11b' },
    { value: '11c', label: '11c' },
    { value: '12a', label: '12a' },
    { value: '12b', label: '12b' },
    { value: '12c', label: '12c' },
]);

const begruendungOptions = ref([
    { value: 'Krankheit', label: 'Krankheit' },
    { value: 'Familie', label: 'Familie' },
    { value: 'Sonstiges', label: 'Sonstiges' },
]);

const submit = () => {
    console.log("Abgeschickt");
}


// Define a schema for the form: Name, Vorname, Klassenleiter, Klasse, Zeitraum (RangeCalender), Begründung (Selector), Zusätzlicher Kommentar (Textarea), Anlagen (FileUpload), Ort & Datum (Text), Unterschrift (Signature/Canvas)
</script>