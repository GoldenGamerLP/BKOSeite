<template>
  <SidebarProvider class="scrollbar">
    <SystemAppSidebar />
    <main class="flex-1 scrollbar">
      <SidebarTrigger />
      <slot />
    </main>
  </SidebarProvider>
</template>
