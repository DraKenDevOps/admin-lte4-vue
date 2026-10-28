<script setup lang="ts">
import { SIDEBAR_SEARCH_INPUT_ID, useNavSearch } from "@/composables/useNavSearch";

defineProps<{ hasResults: boolean }>();

const { query } = useNavSearch();
</script>

<template>
  <div class="sidebar-search" role="search">
    <label :for="SIDEBAR_SEARCH_INPUT_ID" class="visually-hidden">Filter menu</label>
    <input
      :id="SIDEBAR_SEARCH_INPUT_ID"
      v-model="query"
      type="search"
      class="form-control form-control-sm"
      placeholder="Filter menu…"
      autocomplete="off"
      aria-describedby="sidebar-search-status"
    />
    <p v-if="!hasResults" id="sidebar-search-status" class="fs-7 text-secondary mt-2 mb-0" role="status">No matching pages.</p>
  </div>
</template>
