<script setup lang="ts">
import { THEME_OPTIONS, useTheme } from "@/composables/useTheme";

const { theme, setTheme } = useTheme();
</script>

<template>
  <li class="nav-item dropdown">
    <a href="#" id="bd-theme" class="nav-link" aria-label="Toggle color scheme" data-bs-toggle="dropdown" aria-expanded="false">
      <i
        v-for="option in THEME_OPTIONS"
        :key="option.value"
        :class="[option.icon, { 'd-none': theme !== option.value }]"
        :data-appTheme-icon="option.value"
        aria-hidden="true"
      />
    </a>
    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="bd-theme" style="--bs-dropdown-min-width: 8rem">
      <li v-for="option in THEME_OPTIONS" :key="option.value">
        <button
          type="button"
          class="dropdown-item d-flex align-items-center"
          :class="{ active: theme === option.value }"
          :data-bs-theme-value="option.value"
          :aria-pressed="theme === option.value"
          @click="setTheme(option.value)"
        >
          <i :class="[option.icon, 'me-2']" aria-hidden="true" />
          {{ option.label }}
          <i class="bi bi-check-lg ms-auto" :class="{ 'd-none': theme !== option.value }" aria-hidden="true" />
        </button>
      </li>
    </ul>
  </li>
</template>
