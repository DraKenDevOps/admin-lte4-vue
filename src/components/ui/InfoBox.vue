<script setup lang="ts">
import type { AdminVariant } from "@/types/ui";

withDefaults(
  defineProps<{
    label: string;
    value?: string | number;
    variant?: AdminVariant;
    icon?: string;
  }>(),
  {
    variant: "primary"
  }
);
</script>

<template>
  <div class="info-box">
    <span class="info-box-icon shadow-sm" :class="`text-bg-${variant}`">
      <i v-if="icon" :class="icon" aria-hidden="true" />
    </span>
    <div class="info-box-content">
      <span class="info-box-text">{{ label }}</span>
      <span class="info-box-number"
        ><slot>{{ value }}</slot></span
      >
    </div>
  </div>
</template>
