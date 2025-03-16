<template>
  <UseTemplate>
    <form class="grid items-start gap-4 md:mx-0 mx-4">
      <Popover>
        <PopoverTrigger as-child>
          <Button
            variant="outline"
            :class="
              cn(
                'w-full justify-start text-left font-normal',
                !value && 'text-muted-foreground'
              )
            "
          >
            <CalendarIcon class="mr-2 h-4 w-4" />
            {{
              value
                ? df.format(value.toDate(getLocalTimeZone()))
                : "Datum auswählen"
            }}
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-auto p-0">
          <Calendar v-model="value" initial-focus />
        </PopoverContent>
      </Popover>
      <div
        class="grid grid-cols-[auto_1fr] gap-x-2 max-h-[calc(100vh-16rem)] overflow-y-auto"
        v-if="relevantEntries.length"
      >
        <template v-for="(entry, index) in relevantEntries" :key="index">
          <div class="flex flex-col items-center w-fit">
            <div
              v-if="index + 1 > 1"
              class="w-1 bg-primary/80 rounded-b-lg h-4"
              :class="{
                '!h-10': index + 1 < relevantEntries.length,
                'rounded-t-lg': index + 1 >= relevantEntries.length,
              }"
            ></div>
            <div
              class="w-2 h-2 bg-primary rounded-full flex-none my-2 shadow-lg ring-4 ring-border"
              :class="{ 'mt-7': index + 1 < 2 }"
            ></div>
            <div
              v-if="index + 1 < relevantEntries.length"
              class="h-full w-1 rounded-t-lg bg-primary/80"
            ></div>
          </div>

          <div
            class="bg-primary/80 w-full p-2 rounded-lg mb-2 shadow flex justify-between items-center"
          >
            <div>
              <h2 class="text-base font-bold">Termin</h2>
              <p class="text-sm font-semibold">{{ entry.title }}</p>
            </div>
            <div>
              <div>
                <Button variant="ghost" size="icon">
                  <Edit2 class="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Trash2 class="h-4 w-4" />
                </Button>
              </div>
              <div class="flex -space-x-1 overflow-hidden">
                <div
                  v-for="(tag, index) in [...entry.attendees, entry.organizer]"
                  :key="index"
                  class="bg-primary text-white text-xs px-2 py-1 rounded-full"
                >
                  {{ tag.slice(0, 2).toUpperCase() }}
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </form>
  </UseTemplate>

  <Dialog v-if="isDesktop" v-model:open="isOpen">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Termine Bearbeiten</DialogTitle>
        <DialogDescription>
          {{ computedTitle }}
        </DialogDescription>
      </DialogHeader>
      <GridForm />
    </DialogContent>
  </Dialog>

  <Drawer v-else v-model:open="isOpen">
    <DrawerContent>
      <DrawerHeader class="text-left">
        <DrawerTitle>Editiere Termine</DrawerTitle>
        <DrawerDescription>
          {{ computedTitle }}
        </DrawerDescription>
      </DrawerHeader>
      <GridForm />
      <DrawerFooter class="pt-2">
        <DrawerClose as-child>
          <Button variant="outline"> Cancel </Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
</template>

<script lang="ts" setup>
import { createReusableTemplate, useMediaQuery } from "@vueuse/core";
import {
  DateFormatter,
  type DateValue,
  getLocalTimeZone,
} from "@internationalized/date";
import { Calendar as CalendarIcon, Edit2, Trash2 } from "lucide-vue-next";
import { cn } from "@/lib/utils";

const df = new DateFormatter("de-DE", {
  dateStyle: "long",
});

const value = ref<DateValue>();
const [UseTemplate, GridForm] = createReusableTemplate();
const isDesktop = useMediaQuery("(min-width: 768px)");

const isOpen = ref(false);

const {
  data: entries,
  status,
  error,
} = useLazyFetch("/api/v1/calendar/entries/get", {
  method: "GET",
  query: { from: value.value?.toDate(getLocalTimeZone()) || null },
  watch: [value],
});

const openDialog = (currentDate: DateValue | undefined) => {
  if (currentDate) value.value = currentDate;
  isOpen.value = true;
};

// Retrieve relevant entries from the store
const relevantEntries = computed(() => {
  return entries.value ?? [];
});

const computedTitle = computed(() => {
  const dateString = value.value
    ? df.format(value.value.toDate(getLocalTimeZone()))
    : "";
  return `Editiere Termine für ${dateString}`;
});

defineExpose({ openDialog });
</script>
