<template>
  <SidebarProvider>
    <SystemAppSidebar />
    <main class="flex-1">
      <SidebarTrigger />
      <NuxtLoadingIndicator />
      <NuxtPage />
    </main>
  </SidebarProvider>
</template>
