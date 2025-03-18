<script setup lang="ts">
import { Calendar, ActivityIcon, Inbox, Cable } from "lucide-vue-next"

// Menu items.
const items = [
  {
    title: "Kalender",
    url: "/kalender",
    icon: Calendar,
  },
  {
    title: "Entschuldigungen",
    url: "/entschuldigungen",
    icon: ActivityIcon,
  },
  {
    title: "Lehrer",
    url: "/entschuldigungen/test",
    icon: Inbox,
  },
];
</script>

<template>
  <Sidebar variant="sidebar">
    <SidebarHeader class="!flex-row items-center">
      <Cable class="w-8 h-8 text-primary" />
      <div class="grid ml-2">
        <h1 class="text-lg font-semibold">Berufskolleg Ost-Vest</h1>
        <p class="text-sm text-muted-foreground">Managment Seite</p>
      </div>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Bereiche</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
              <SidebarMenuItem v-for="item in items" :key="item.title">
                <SidebarMenuButton asChild>
                    <NuxtLink :to="item.url" class="flex items-center gap-2" activeClass="bg-primary/10 text-primary">
                      <component :is="item.icon" />
                      <span>{{item.title}}</span>
                    </NuxtLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>
      <SystemColorMode />
    </SidebarFooter>
  </Sidebar>
</template>