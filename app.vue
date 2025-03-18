<template>
  <SidebarProvider :defaultOpen="defaultOpen">
    <SystemAppSidebar />
    <main class="flex-1">
      <SidebarTrigger />
      <NuxtLoadingIndicator />
      <NuxtPage />
    </main>
  </SidebarProvider>
</template>

<script lang="ts" setup>
const defaultOpen = useCookie<boolean>('sidebar_state')
</script>
