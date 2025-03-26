<template>
  <div>
    <ClientOnly>
      <Toaster />
    </ClientOnly>
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script lang="ts" setup>
useHead({
  bodyAttrs: {
    class: "black"
  }
})
</script>
