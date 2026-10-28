import { computed, ref } from "vue";

const query = ref("");

export const SIDEBAR_SEARCH_INPUT_ID = "sidebar-search-input";

/**
 * Shared sidebar filter state. The header search and the sidebar search field
 * both write to the same query, so a header search visibly filters the menu.
 */
export function useNavSearch() {
  const isFiltering = computed(() => query.value.trim().length > 0);

  function focus(): void {
    const input = document.getElementById(SIDEBAR_SEARCH_INPUT_ID);
    if (input instanceof HTMLInputElement) {
      input.focus();
      input.select();
    }
  }

  function clear(): void {
    query.value = "";
  }

  return { query, isFiltering, focus, clear };
}
