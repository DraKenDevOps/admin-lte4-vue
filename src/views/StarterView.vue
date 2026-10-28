<script setup lang="ts">
import AppCard from "@/components/ui/AppCard.vue";
</script>

<template>
  <AppCard title="Starter Page">
    <p class="mb-3">
      This is a starter page. Everything outside this card — header, sidebar, breadcrumb, and footer — comes from <code>AdminLayout.vue</code>.
    </p>
    <p class="mb-0 text-secondary">
      Add routes in <code>src/router/index.ts</code>, entries in <code>src/data/navigation.ts</code>, and views in <code>src/views/</code>.
    </p>
  </AppCard>
</template>
