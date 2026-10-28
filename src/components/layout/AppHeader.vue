<script setup lang="ts">
import { computed } from "vue";
// import { computed, nextTick } from "vue";
import { RouterLink } from "vue-router";
import FullscreenToggle from "@/components/layout/FullscreenToggle.vue";
import ThemeToggle from "@/components/layout/ThemeToggle.vue";
import UserMenu from "@/components/layout/UserMenu.vue";
// import { useNavSearch } from "@/composables/useNavSearch";
import { useSidebar } from "@/composables/useSidebar";

const { collapsed, mobileOpen, isMobile, toggle } = useSidebar();
// const { query, focus } = useNavSearch();

const sidebarExpanded = computed(() => (isMobile.value ? mobileOpen.value : !collapsed.value));

/** Header search filters the sidebar menu, opening it first when necessary. */
// function onSearch(): void {
//   if (isMobile.value) {
//     if (!mobileOpen.value) toggle();
//   } else if (collapsed.value) {
//     toggle();
//   }
//   void nextTick(focus);
// }
</script>

<template>
  <nav class="app-header navbar navbar-expand bg-body">
    <div class="container-fluid">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a
            href="#"
            class="nav-link"
            data-lte-toggle="sidebar"
            role="button"
            aria-label="Toggle sidebar"
            aria-controls="navigation"
            :aria-expanded="sidebarExpanded"
            @click.prevent="toggle"
          >
            <i class="bi bi-list" aria-hidden="true" />
          </a>
        </li>

        <li class="nav-item d-none d-md-block">
          <RouterLink to="/" class="nav-link">
            <i class="bi bi-grid-1x2 me-1" aria-hidden="true" />
            Dashboard
          </RouterLink>
        </li>
      </ul>

      <!-- <form class="navbar-search d-none d-xl-block ms-3" role="search" @submit.prevent="onSearch">
        <label for="navbar-search-input" class="visually-hidden">Search</label>
        <div class="navbar-search-field">
          <input id="navbar-search-input" v-model="query" type="search" name="q" class="form-control" placeholder="Search…" autocomplete="off" />
          <button class="navbar-search-submit" type="submit" aria-label="Submit search">
            <i class="bi bi-search" aria-hidden="true" />
          </button>
        </div>
      </form> -->

      <ul class="navbar-nav ms-auto">
        <!-- <li class="nav-item d-xl-none">
          <a class="nav-link" href="#" aria-label="Search" @click.prevent="onSearch">
            <i class="bi bi-search" aria-hidden="true" />
          </a>
        </li> -->
        <FullscreenToggle />
        <ThemeToggle />
        <UserMenu />
      </ul>
    </div>
  </nav>
</template>
