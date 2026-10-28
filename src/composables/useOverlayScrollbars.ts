import { onBeforeUnmount, onMounted, watch } from "vue";
import type { Ref } from "vue";
import { OverlayScrollbars } from "overlayscrollbars";

type Instance = ReturnType<typeof OverlayScrollbars>;

/** Same cutoff AdminLTE uses before enabling OverlayScrollbars on the sidebar. */
const DESKTOP_MIN = 992;

/**
 * Initialise OverlayScrollbars on the target element, desktop only.
 * Re-creates the instance when crossing the breakpoint and destroys it on unmount.
 */
export function useOverlayScrollbars(target: Ref<HTMLElement | null>) {
  let instance: Instance | null = null;

  function isDesktop(): boolean {
    return window.innerWidth > DESKTOP_MIN;
  }

  function create(): void {
    if (!isDesktop() || instance || !target.value) return;
    instance = OverlayScrollbars(target.value, {
      scrollbars: {
        theme: "os-theme-light",
        autoHide: "leave",
        clickScroll: true
      }
    });
  }

  function destroy(): void {
    instance?.destroy();
    instance = null;
  }

  function sync(): void {
    if (isDesktop()) create();
    else destroy();
  }

  onMounted(() => {
    sync();
    window.addEventListener("resize", sync, { passive: true });
  });

  onBeforeUnmount(() => {
    window.removeEventListener("resize", sync);
    destroy();
  });

  watch(target, () => {
    destroy();
    create();
  });

  return { destroy };
}
