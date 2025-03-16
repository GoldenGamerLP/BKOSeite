<template>
  <div class="max-w-4xl mx-auto p-4">
    <div class="grid grid-cols-[auto_1fr] gap-x-2">
      <template v-for="index in length" :key="index">
        <div class="flex flex-col items-center w-fit">
          <div
            v-if="index > 1"
            class="w-1 rounded-t-lg bg-primary/80 rounded-b-lg"
            :class="{ 'h-10': index < length, 'h-4': index >= length }"
          ></div>
          <div
            class="w-2 h-2 bg-primary rounded-full flex-none my-2 shadow-lg ring-4 ring-border"
            :class="{ 'mt-7': index < 2 }"
          ></div>
          <div
            v-if="index < length"
            class="h-full w-1 rounded-t-lg bg-primary/80"
          ></div>
        </div>

        <div class="bg-primary/80 w-full p-2 rounded-lg mb-2 shadow">
          <h2 class="text-base font-bold">Eine überschrift {{ index }}</h2>
          <p class="text-sm font-semibold">Ein Text</p>
        </div>
      </template>
    </div>
    <Button @click="length++">Add</Button>
    <Button @click="length--">Remove</Button>
  </div>
</template>

<script lang="ts" setup>
const length = ref(5);

useHead({
  bodyAttrs: {
    class: 'dark',
  },
})
</script>
