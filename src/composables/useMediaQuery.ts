import { onBeforeUnmount, onMounted, ref } from "vue";

/** Reactive `matchMedia` wrapper. Cleans up its listener on unmount. */
export function useMediaQuery(query: string) {
  const matches = ref(false);
  let mediaQuery: MediaQueryList | null = null;

  function update(event?: MediaQueryListEvent): void {
    matches.value = event ? event.matches : Boolean(mediaQuery?.matches);
  }

  onMounted(() => {
    mediaQuery = window.matchMedia(query);
    matches.value = mediaQuery.matches;
    mediaQuery.addEventListener("change", update);
  });

  onBeforeUnmount(() => {
    mediaQuery?.removeEventListener("change", update);
    mediaQuery = null;
  });

  return matches;
}
