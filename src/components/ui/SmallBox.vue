<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import type { RouteLocationRaw } from "vue-router";
import type { AdminVariant } from "@/types/ui";

const props = withDefaults(
  defineProps<{
    label: string;
    value?: string | number;
    variant?: AdminVariant;
    icon?: string;
    /** Link target for the footer. */
    to?: RouteLocationRaw;
    href?: string;
    linkLabel?: string;
  }>(),
  {
    variant: "primary",
    linkLabel: "More info"
  }
);

const footerLinkClass = computed(() => (props.variant === "warning" || props.variant === "light" ? "link-dark" : "link-light"));
</script>

<template>
  <div class="small-box" :class="`text-bg-${variant}`">
    <div class="inner">
      <h2 class="h3">
        <slot name="value">{{ value }}</slot>
      </h2>
      <p>{{ label }}</p>
    </div>
    <i v-if="icon" class="small-box-icon" :class="icon" aria-hidden="true" />

    <RouterLink v-if="to" :to="to" class="small-box-footer" :class="[footerLinkClass, 'link-underline-opacity-0', 'link-underline-opacity-50-hover']">
      {{ linkLabel }} <span class="visually-hidden">about {{ label }}</span>
      <i class="bi bi-link-45deg" aria-hidden="true" />
    </RouterLink>
    <a v-else-if="href" :href="href" class="small-box-footer" :class="[footerLinkClass, 'link-underline-opacity-0', 'link-underline-opacity-50-hover']">
      {{ linkLabel }} <span class="visually-hidden">about {{ label }}</span>
      <i class="bi bi-link-45deg" aria-hidden="true" />
    </a>
  </div>
</template>
