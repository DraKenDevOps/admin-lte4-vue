import { onBeforeUnmount, onMounted, ref } from "vue";

/** Fullscreen API wrapper used by the header toggle. */
export function useFullscreen() {
  const isFullscreen = ref(false);

  function sync(): void {
    isFullscreen.value = Boolean(document.fullscreenElement);
  }

  async function toggle(): Promise<void> {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      // The browser may reject the request (permissions, iframe policy).
    }
  }

  onMounted(() => {
    sync();
    document.addEventListener("fullscreenchange", sync);
  });

  onBeforeUnmount(() => {
    document.removeEventListener("fullscreenchange", sync);
  });

  return { isFullscreen, toggle };
}
