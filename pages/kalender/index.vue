<template>
  <div>
    <Tabs default-value="month" class="w-full">
      <header class="flex flex-col gap-4 p-2">
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-bold">Kalender</h1>
          <div class="flex flex-col text-right">
            <span class="text-sm font-normal text-muted-foreground">
              {{ currentTime }}
            </span>
            <span class="text-sm font-normal text-muted-foreground">
              {{
                new Date().toLocaleDateString("de-DE", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              }}
            </span>
          </div>
        </div>

        <TabsList class="md:w-fit w-full">
          <TabsTrigger value="day">
            <Calendar class="h-4 w-4 mr-2" />
            Tag
          </TabsTrigger>
          <TabsTrigger value="week">
            <CalendarDays class="h-4 w-4 mr-2" />
            Woche
          </TabsTrigger>
          <TabsTrigger value="month">
            <CalendarRange class="h-4 w-4 mr-2" />
            Monat
          </TabsTrigger>
        </TabsList>

        <div class="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            @click="date = date.copy().subtract({ months: 1 })"
          >
            <ChevronLeft class="h-5 w-5" />
          </Button>
          <span class="text-sm font-medium">
            {{ dateFormatter.format(date.toDate(getLocalTimeZone())) }}
          </span>
          <Button
            variant="ghost"
            size="icon"
            @click="date = date.copy().add({ months: 1 })"
          >
            <ChevronRight class="h-5 w-5" />
          </Button>
        </div>
      </header>
      <Separator />

      <TabsContent value="day">
        <div class="p-4">
          <h3 class="text-lg font-medium">Tagesansicht</h3>
          <p class="text-muted-foreground">
            Tagesansicht wird noch implementiert...
          </p>
        </div>
      </TabsContent>

      <TabsContent value="week">
        <div class="p-4">
          <h3 class="text-lg font-medium">Wochenansicht</h3>
          <p class="text-muted-foreground">
            Wochenansicht wird noch implementiert...
          </p>
        </div>
      </TabsContent>

      <TabsContent value="month">
        <div class="grid grid-cols-7 p-2 gap-1 sm:gap-2">
          <div
            v-for="(day, index) in days"
            :key="day"
            class="text-center font-semibold text-xs sm:text-sm lg:text-base"
            :class="{
              'text-primary font-semibold': isCurrentDay(index),
            }"
          >
            {{ day }}
          </div>
          <template v-for="(date, index) in computedDays" :key="index">
            <div
              class="p-1 sm:p-2 hover:shadow-muted cursor-pointer rounded-lg min-h-[50px] sm:min-h-[100px] lg:min-h-[150px] w-full flex flex-col relative border transition-all duration-200 ease-in-out"
              :class="{
                'bg-primary/20': date.today,
                'border-r': index % 7 !== 6,
                'shadow-sm hover:shadow-md': !date.isPast,
              }"
              @click="openCreateDialog(date.datevalue)"
            >
              <ol
                class="hidden sm:flex flex-col space-y-1 lg:space-y-2 mb-1 flex-grow"
              >
                <template
                  v-for="termine in getCalendarEntries(index).slice(0, 2)"
                  :key="termine"
                >
                  <li
                    class="text-xs lg:text-sm rounded-lg bg-primary/50 p-1 line-clamp-1"
                  >
                    {{ termine.title }}
                  </li>
                </template>
                <li v-if="getCalendarEntries(index).length > 2">
                  <span class="text-xs lg:text-sm text-muted-foreground">
                    +{{ getCalendarEntries(index).length - 2 }} mehr
                  </span>
                </li>
              </ol>

              <div class="flex sm:hidden gap-0.5 absolute top-1 left-1">
                <div
                  v-for="(_, i) in getCalendarEntries(index).slice(0, 3)"
                  :key="i"
                  class="w-1.5 h-1.5 rounded-full bg-primary"
                ></div>
                <div
                  v-if="getCalendarEntries(index).length > 3"
                  class="w-1.5 h-1.5 rounded-full bg-primary opacity-50"
                ></div>
              </div>

              <div class="flex mt-auto items-center">
                <span
                  class="font-semibold text-right ml-auto text-xs sm:text-sm lg:text-base"
                  :class="{ 'text-muted-foreground': date.isPast }"
                >
                  {{ date.day }}
                </span>
              </div>
            </div>
          </template>
        </div>
      </TabsContent>
    </Tabs>
    <SystemCalendarCreateDialoag ref="sccd" />
  </div>
</template>

<script lang="ts" setup>
import type { SystemCalendarCreateDialoag } from "#components";
import {
  type DateValue,
  getLocalTimeZone,
  today,
  DateFormatter,
  startOfMonth,
  getDayOfWeek,
} from "@internationalized/date";
import { useIntervalFn } from "@vueuse/core";
import {
  ChevronRight,
  ChevronLeft,
  Calendar,
  CalendarRange,
  CalendarDays,
  RefreshCw,
} from "lucide-vue-next";

import type { CalendarEntry } from "~/types/Calendar";

const sccd = ref<InstanceType<typeof SystemCalendarCreateDialoag> | null>();
const currentTime = ref("");
const date = ref<DateValue>(today(getLocalTimeZone()));
const days = ref<string[]>([]);

const {
  data: entries,
  status,
  error,
} = useLazyFetch("/api/v1/calendar/entries/get", {
  method: "GET",
  query: { from: date.value?.toDate(getLocalTimeZone()) || null },
  watch: [date],
});

const computedEntries = computed(() => {
  return (
    entries.value?.map((entry) => ({
      ...entry,
      from: new Date(entry.from),
      to: entry.to ? new Date(entry.to) : null,
    })) ?? ([] as CalendarEntry[])
  );
});

const isCurrentDay = (index: number) => {
  const dow = getDayOfWeek(today(getLocalTimeZone()), "de-DE");
  return dow === index;
};

const getCalendarEntries = (date: number): CalendarEntry[] => {
  const formattedDate = computedDays.value[date].datevalue.toDate(
    getLocalTimeZone()
  );
  return computedEntries.value.filter((entry) => {
    const entryDate = entry.from;
    return (
      entryDate.getDate() === formattedDate.getDate() &&
      entryDate.getMonth() === formattedDate.getMonth() &&
      entryDate.getFullYear() === formattedDate.getFullYear()
    );
  });
};

const dateTimeformatter = Intl.DateTimeFormat("de-DE", {
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
});
const dateFormatter = new DateFormatter("de-DE", {
  weekday: "short",
  day: "2-digit",
  month: "long",
  year: "numeric",
});

useIntervalFn(
  () => {
    currentTime.value = dateTimeformatter.format(new Date());
  },
  1000,
  { immediate: true, immediateCallback: true }
);

onMounted(() => {
  days.value = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
});

const computedDays = computed(() => {
  const crrDay = today(getLocalTimeZone());
  const currentMonth = startOfMonth(date.value.copy());
  const calendarDaysBackTillMonday = getDayOfWeek(
    currentMonth.subtract({ weeks: 1 }),
    "de-DE"
  );

  const daysInMonth = currentMonth.calendar.getDaysInMonth(currentMonth);
  const shortDays = [];

  for (let i = 0; i < calendarDaysBackTillMonday; i++) {
    const crrDate = currentMonth.subtract({
      days: calendarDaysBackTillMonday - i,
    });
    shortDays.push({
      day: crrDate.day.toString(),
      formattedDate: dateFormatter.format(crrDate.toDate(getLocalTimeZone())),
      isPast: true,
      today: false,
      timestamp: crrDate.toDate(getLocalTimeZone()).toISOString(),
      datevalue: crrDate,
    });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const crrDate = currentMonth.set({ day: i });
    shortDays.push({
      day: crrDate.day.toString(),
      formattedDate: dateFormatter.format(crrDate.toDate(getLocalTimeZone())),
      isPast: false,
      today: crrDate.compare(crrDay) === 0,
      timestamp: crrDate.toDate(getLocalTimeZone()).toISOString(),
      datevalue: crrDate,
    });
  }

  return shortDays;
});

const openCreateDialog = (currentDate: DateValue | undefined) => {
  console.log(currentDate);
  sccd.value?.openDialog(currentDate);
};
</script>
