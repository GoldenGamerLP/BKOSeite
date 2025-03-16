import type { CalendarEntry } from "~/types/Calendar";
import {
  today,
  DateFormatter,
  type DateValue,
  getLocalTimeZone,
  startOfMonth,
  getDayOfWeek,
} from "@internationalized/date";

export const useCalendarStore = defineStore("calendar", () => {
  const currentDate = ref<DateValue>();
  const calendarEntries = ref<CalendarEntry[]>([]);

  const fetchEntries = async () => {
    if (!currentDate.value) currentDate.value = today(getLocalTimeZone());
    try {
      const res = await $fetch("/api/v1/calendar/entries/get", {
        method: "GET",
        query: {
          date: currentDate.value.toString(),
        },
      });

      //Convert the date strings to Date objects
      calendarEntries.value = res.map((entry) => ({
        ...entry,
        from: new Date(entry.from),
        to: entry.to ? new Date(entry.to) : null,
      }));
    } catch (e) {
      console.error(e);
    }
  };

  const dateFormatter = new DateFormatter("de-DE", {
    weekday: "short",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const computedDays = computed(() => {
    if (!currentDate.value) return [];
    const crrDay = today(getLocalTimeZone());
    const currentMonth = startOfMonth(currentDate.value.copy());
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
        datevalue: crrDate,
        today: false,
        isPast: true,
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const crrDate = currentMonth.set({ day: i });
      shortDays.push({
        day: crrDate.day.toString(),
        datevalue: crrDate,
        today: crrDate.compare(crrDay) === 0,
        isPast: false,
      });
    }

    return shortDays;
  });

  const computedEntries = computed(() => {
    return (
      calendarEntries.value?.map((entry) => ({
        ...entry,
        from: new Date(entry.from),
        to: entry.to ? new Date(entry.to) : null,
      })) ?? ([] as CalendarEntry[])
    );
  });

  function getCalendarEntriesByIndex(index: number): CalendarEntry[] {
    const dayInfo = computedDays.value[index];
    if (!dayInfo) return [];
    return getCalendarEntriesByDate(dayInfo.datevalue);
  }

  function getCalendarEntriesByDate(dateVal: DateValue): CalendarEntry[] {
    if (!dateVal) return [];
    const checkDate = dateVal.toDate(getLocalTimeZone());
    return computedEntries.value.filter((entry) => {
      const entryDate = entry.from;
      return (
        entryDate.getDate() === checkDate.getDate() &&
        entryDate.getMonth() === checkDate.getMonth() &&
        entryDate.getFullYear() === checkDate.getFullYear()
      );
    });
  }

  function isCurrentDay(index: number): boolean {
    const dowToday = getDayOfWeek(today(getLocalTimeZone()), "de-DE");
    return dowToday === index;
  }

  const goOneMonthBack = () => {
    currentDate.value = currentDate.value.copy().subtract({ months: 1 });
  };

  const goOneMonthForward = () => {
    currentDate.value = currentDate.value.copy().add({ months: 1 });
  };

  return {
    currentDate,
    goOneMonthBack,
    goOneMonthForward,
    dateFormatter,
    computedDays,
    computedEntries,
    getCalendarEntriesByIndex,
    getCalendarEntriesByDate,
    isCurrentDay,
    fetchEntries,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCalendarStore, import.meta.hot));
}
