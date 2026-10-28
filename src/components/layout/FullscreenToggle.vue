<script setup lang="ts">
import { useFullscreen } from "@/composables/useFullscreen";

const { isFullscreen, toggle } = useFullscreen();
</script>

<template>
  <li class="nav-item">
    <a href="#" class="nav-link" data-lte-toggle="fullscreen" :aria-label="isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'" @click.prevent="toggle">
      <i class="bi" :class="isFullscreen ? 'bi-fullscreen-exit' : 'bi-arrows-fullscreen'" aria-hidden="true" />
    </a>
  </li>
</template>
