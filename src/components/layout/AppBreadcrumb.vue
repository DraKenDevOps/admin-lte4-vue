<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, useRoute } from "vue-router";

const route = useRoute();

const title = computed(() => route.meta.title ?? "");
const breadcrumbs = computed(() => route.meta.breadcrumb ?? (title.value ? [title.value] : []));
</script>

<template>
  <div class="row">
    <div class="col-sm-6">
      <h1 class="mb-0 fs-3">{{ title }}</h1>
    </div>
    <div class="col-sm-6">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb float-sm-end">
          <li class="breadcrumb-item"><RouterLink to="/">Home</RouterLink></li>
          <li
            v-for="(crumb, index) in breadcrumbs"
            :key="`${crumb}-${index}`"
            class="breadcrumb-item"
            :class="{ active: index === breadcrumbs.length - 1 }"
            :aria-current="index === breadcrumbs.length - 1 ? 'page' : undefined"
          >
            {{ crumb }}
          </li>
        </ol>
      </nav>
    </div>
  </div>
</template>
