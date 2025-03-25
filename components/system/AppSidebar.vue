<script setup lang="ts">
import { Calendar, ActivityIcon, ChevronRight, Cable, LucidePaperclip, ListChecks, PencilLine, CalendarClockIcon, LucideCalendarHeart } from "lucide-vue-next"

// Menu items.
const items = [
  {
    title: "Kalender",
    icon: Calendar,
    submenu: [
      {
        title: "Mein Kalender",
        url: "/authenticated/kalender",
        icon: CalendarClockIcon,
      },
      {
        title: "Zusätzlicher Kalender",
        url: "/authenticated/kalender",
        icon: LucideCalendarHeart,
      },
    ]
  },
  {
    title: "Entschuldigungen",
    icon: LucidePaperclip,
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
    ]
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
          <Collapsible v-for="(item, index) in items" :key="item.title" :default-open="index === 1"
            class="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger as-child>
                <SidebarMenuButton>
                  {{ item.title }}
                  <ChevronRight class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent v-if="item.submenu">
                <SidebarMenuSub>
                  <SidebarMenuSubItem v-for="childItem in item.submenu" :key="childItem.title">
                    <SidebarMenuSubButton as-child>
                      <NuxtLink :to="childItem.url" class="flex items-center gap-2 truncate" :active-class="'bg-primary/10 !text-primary font-semibold'">
                        <component :is="childItem.icon" class="w-4 h-4" />
                        {{ childItem.title }}
                      </NuxtLink>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
    <SidebarRail />
    <SidebarFooter>
      <SystemColorMode />
    </SidebarFooter>
  </Sidebar>
</template>