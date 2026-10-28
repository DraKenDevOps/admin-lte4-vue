<script setup lang="ts">
import SidebarMenuItem from "@/components/layout/SidebarMenuItem.vue";
import type { NavItem } from "@/types/nav";

defineProps<{ items: NavItem[] }>();
</script>

<template>
  <ul class="nav sidebar-menu flex-column">
    <SidebarMenuItem v-for="item in items" :key="item.to ?? item.label" :item="item" />
  </ul>
</template>
