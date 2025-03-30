<template>
  <div>
    <div class="p-4">
      <h1 class="text-2xl font-bold">Dashboard</h1>
      <p class="text-xl text-muted-foreground">
        Willkommen zurück {{ user?.name }}!
      </p>
    </div>
    <Separator class="my-1"></Separator>
    <div class="p-4">
      <h2 class="text-lg">Letzte Entschuldigungen</h2>
      <p class="text-muted-foreground mb-4">
        Die letzten 3. Entschuldigen aus diesem Monat
      </p>
      <ol class="space-y-2">
        <li
          v-for="(entry, index) in entries"
          :class="
            cn(
              'p-4 flex justify-between items-center rounded-lg bg-card',
              entry.status === 'gueltig'
                ? 'from-card to-emerald-900 bg-gradient-to-r'
                : '',
              entry.status === 'ungueltig'
                ? 'from-card to-purple-900 bg-gradient-to-r'
                : ''
            )
          "
          :key="index"
        >
          <div class="flex flex-col">
            <span>{{ entry.begruendung }}</span>
            <span class="text-sm text-muted-foreground"
              >Von {{ formatDate(entry.zeitraumVon) }} bis
              {{ formatDate(entry.zeitraumBis) }}</span
            >
          </div>
          <div class="capitalize">{{ entry.status || "Offen" }}</div>
        </li>
      </ol>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { cn } from "@/lib/utils";
import { useUser } from "~/composable/auth";

const user = useUser();

const { data: entries, status } = useLazyFetch(
  "/api/v1/entschuldigung/recent",
  {
    query: {
      userId: user.value?._id,
    },
  }
);

definePageMeta({
  layout: "sidebar",
  keepalive: true,
});

const formatDate = (date: string) => {
  const d = new Date(date);
  return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
};
</script>
