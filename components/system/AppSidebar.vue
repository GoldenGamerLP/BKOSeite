<script setup lang="ts">
import {
  Calendar,
  ActivityIcon,
  ChevronRight,
  Cable,
  LucidePaperclip,
  ListChecks,
  PencilLine,
  CalendarClockIcon,
  LucideCalendarHeart,
  LayoutDashboard
} from "lucide-vue-next";
import { useUser } from "~/composable/auth";

const user = useUser();

// Menu items.
const items = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/authenticated/dashboard",
    submenu: []
  },
  {
    title: "Entschuldigungen",
    icon: LucidePaperclip,
    url: "#",
    submenu: [
      {
        title: "Erstellen",
        url: "/authenticated/entschuldigungen",
        icon: ActivityIcon,
      },
      {
        title: "Eigene",
        url: "/authenticated/entschuldigungen/eigene",
        icon: ListChecks,
      },
      {
        title: "Verwalten",
        url: "/authenticated/entschuldigungen/verwalten",
        icon: PencilLine,
      },
    ],
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
        <SidebarMenu>
          <SidebarMenuItem v-for="item in items" :key="item.title">
            <SidebarMenuButton as-child>
              <a :href="item.url" class="font-medium">
                {{ item.title }}
              </a>
            </SidebarMenuButton>
            <SidebarMenuSub v-if="item.submenu.length">
              <template v-for="childItem in item.submenu" :key="childItem.title">
                <SidebarMenuSubItem
                  v-if="childItem.title !== 'Verwalten' || user?.roles.includes('admin')"
                >
                  <SidebarMenuSubButton as-child>
                    <NuxtLink :to="childItem.url" :active-class="'bg-sidebar-accent text-sidebar-accent-foreground'">
                      <component :is="childItem.icon" class="text-muted-foreground size-5" />
                      {{ childItem.title }}
                    </NuxtLink>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </template>
            </SidebarMenuSub>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
    <SidebarRail />
    <SidebarFooter>
      <SystemColorMode />
    </SidebarFooter>
  </Sidebar>
</template>
