<script setup lang="ts">
import { watch } from "vue";
import { useRoute } from "vue-router";
import AppBreadcrumb from "@/components/layout/AppBreadcrumb.vue";
import AppFooter from "@/components/layout/AppFooter.vue";
import AppHeader from "@/components/layout/AppHeader.vue";
import AppSidebar from "@/components/layout/AppSidebar.vue";
import SkipLinks from "@/components/layout/SkipLinks.vue";
import { useSidebar } from "@/composables/useSidebar";

const route = useRoute();
const { closeMobile } = useSidebar();

// Navigating on mobile should reveal the new page, not leave the overlay open.
watch(
  () => route.fullPath,
  () => closeMobile()
);
</script>

<template>
  <div class="app-wrapper">
    <SkipLinks />
    <AppHeader />
    <AppSidebar />
    <div class="sidebar-overlay" aria-hidden="true" @click="closeMobile()" />

    <main id="main" class="app-main" tabindex="-1">
      <div class="app-content-header">
        <div class="container-fluid">
          <AppBreadcrumb />
        </div>
      </div>
      <div class="app-content">
        <div class="container-fluid">
          <slot />
        </div>
      </div>
    </main>

    <AppFooter />

    <p class="visually-hidden" aria-live="polite">{{ route.meta.title }}</p>
  </div>
</template>
