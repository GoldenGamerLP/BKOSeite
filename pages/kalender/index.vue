<template>
  <div class="max-w-4xl mx-auto p-4">
    <h2 class="text-semibold text-3xl">{{ currentTime }}</h2>
    <h3 class="text-semibold text-2xl">
      {{ dateFormatter.format(new Date()) }}
    </h3>
    <Separator orientation="horizontal" class="my-4" />
    <div class="flex justify-between items-center mb-4">
      <p class="text-semibold">
        {{ dateFormatter.format(date.toDate(getLocalTimeZone())) }}
      </p>
      <div class="flex items-center space-x-4">
        <Button
          @click="date = date.copy().subtract({ months: 1 })"
          variant="link"
        >
          <ChevronDown />
          <span class="sr-only">Previous</span>
        </Button>
        <Button @click="date = date.copy().add({ months: 1 })" variant="link">
          <ChevronUp />
          <span class="sr-only">Next</span>
        </Button>
      </div>
    </div>
    <div class="grid grid-cols-7">
      <div
        v-for="(day, index) in days"
        :key="day"
        class="text-center font-semibold bg-primary border-border border-t border-b"
        :class="{
          'text-muted-foreground': index > 4,
          'rounded-tl-lg border-l': index === 0,
          'rounded-tr-lg border-r': index === 6,
        }"
      >
        {{ day }}
      </div>
      <template v-for="(date, index) in computedDays" :key="index">
        <Button
          :id="`date-${index}`"
          :class="{
            'text-muted-foreground': date.isPast,
            'text-foreground': !date.isPast,
            'text-primary font-bold': date.today,
            'border border-border border-b-0 rounded-bl-none rounded-br-none shadow': index === currentSelected,
          }"
          class="text-center border-border"
          variant="link"
          @click="selectDate(index)"
        >
          {{ date.day }}
        </Button>

        <div
          v-if="isInLine(index + 1) || index === computedDays.length - 1"
          :id="`row-end-${index}`"
          class="contents"
        />
      </template>
    </div>
    <Teleport
      v-if="currentSelected !== null"
      :to="`#row-end-${getRowEndIndex(currentSelected)}`"
    >
      <Card class="col-span-7 w-full">
        <CardHeader class="relative">
          <CardTitle>Termine für den</CardTitle>
          <CardDescription>{{ computedDays[currentSelected].formattedDate }}</CardDescription>
          <Button class="absolute top-2 right-2" variant="outline" size="icon" @click="currentSelected = null">
            <X />
          </Button>
        </CardHeader>
        <CardContent>
          <p class="font-semibold text-xl">Termine</p>
          <ol class="list-disc list-inside">
            <li>Termin 1</li>
            <li>Termin 2</li>
            <li>Termin 3</li>
          </ol>
        </CardContent>
      </Card>
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
import {
  type DateValue,
  getLocalTimeZone,
  today,
  DateFormatter,
  createCalendar,
  startOfMonth,
  getDayOfWeek,
} from "@internationalized/date";
import { useIntervalFn } from "@vueuse/core";
import { ChevronDown, ChevronUp, X } from "lucide-vue-next";

const currentTime = ref("");
const date = ref<DateValue>(today(getLocalTimeZone()));
const days = ref<string[]>([]);
interface SelectedDate {
  day: string;
  formattedDate: string;
  isPast: boolean;
  today: boolean;
}

const currentSelected = ref<number | null>(null);
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
    });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const crrDate = currentMonth.set({ day: i });
    shortDays.push({
      day: crrDate.day.toString(),
      formattedDate: dateFormatter.format(crrDate.toDate(getLocalTimeZone())),
      isPast: false,
      today: crrDate.compare(crrDay) === 0,
    });
  }

  return shortDays;
});

const isInLine = (index: number | null) => {
  return index !== null && index % 7 === 0;
};

const getRowEndIndex = (index: number) => {
  const currentRow = Math.floor(index / 7);
  const rowEndIndex = Math.min(
    currentRow * 7 + 6,
    computedDays.value.length - 1
  );
  return rowEndIndex;
};

function selectDate(index: number | null) {
  if (currentSelected.value === index) {
    currentSelected.value = null;
  } else {
    currentSelected.value = index;
  }
}
</script>

<style>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.5s ease;
}
.expand-enter,
.expand-leave-to {
  height: 0;
  opacity: 0;
}
</style>
