<script setup lang="ts">
import { computed, ref } from "vue";
import { useNavSearch } from "@/composables/useNavSearch";
import { useOverlayScrollbars } from "@/composables/useOverlayScrollbars";
import { filterNavigation } from "@/lib/filterNavigation";
import { navigation } from "@/data/navigation";
import SidebarBrand from "@/components/layout/SidebarBrand.vue";
import SidebarMenu from "@/components/layout/SidebarMenu.vue";
import SidebarSearch from "@/components/layout/SidebarSearch.vue";

const { query, isFiltering } = useNavSearch();

const sidebarWrapper = ref<HTMLElement | null>(null);
useOverlayScrollbars(sidebarWrapper);

const filteredItems = computed(() => filterNavigation(navigation, query.value));
const hasResults = computed(() => !isFiltering.value || filteredItems.value.length > 0);
</script>

<template>
  <aside class="app-sidebar bg-body-secondary shadow" data-bs-theme="dark">
    <SidebarBrand />
    <SidebarSearch :has-results="hasResults" />
    <div ref="sidebarWrapper" class="sidebar-wrapper">
      <nav id="navigation" class="mt-2" aria-label="Main navigation">
        <SidebarMenu :items="filteredItems" />
      </nav>
    </div>
  </aside>
</template>
