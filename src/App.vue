<script setup lang="ts">
import { computed } from "vue";
import { RouterView, useRoute } from "vue-router";
import AdminLayout from "@/layouts/AdminLayout.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import BlankLayout from "@/layouts/BlankLayout.vue";

const route = useRoute();

const layout = computed(() => {
  switch (route.meta.layout) {
    case "auth":
      return AuthLayout;
    case "blank":
      return BlankLayout;
    default:
      return AdminLayout;
  }
});
</script>

<template>
  <component :is="layout">
    <RouterView />
  </component>
</template>
