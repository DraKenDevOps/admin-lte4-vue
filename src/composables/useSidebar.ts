import { STORAGE_KEYS } from "@/utils/keys";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

/** Matches AdminLTE's `sidebar-expand-lg` breakpoint. */
export const MOBILE_MAX = 991.98;

const SIDEBAR_TOGGLE_SELECTOR = '[data-lte-toggle="sidebar"]';

const collapsed = ref(false);
const mobileOpen = ref(false);
const isMobile = ref(typeof window === "undefined" ? false : window.innerWidth <= MOBILE_MAX);

let consumers = 0;
let appLoadedTimer: number | undefined;
let holdTransitionTimer: number | undefined;

function hasDom(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function readStoredCollapsed(): boolean {
  try {
    // The mini sidebar is collapsed by default; only an explicit open choice
    // expands it.
    return localStorage.getItem(STORAGE_KEYS.appSidebarState) !== "sidebar-open";
  } catch {
    // localStorage may be unavailable (private mode, sandboxed iframe).
    return true;
  }
}

function persist(): void {
  try {
    localStorage.setItem(STORAGE_KEYS.appSidebarState, collapsed.value ? "sidebar-collapse" : "sidebar-open");
  } catch {
    // Persisting is best-effort.
  }
}

function apply(): void {
  if (!hasDom() || !document.body) return;
  const body = document.body;
  body.classList.toggle("sidebar-collapse", collapsed.value && !isMobile.value);
  body.classList.toggle("sidebar-open", mobileOpen.value && isMobile.value);
}

function syncViewport(): void {
  if (!hasDom()) return;
  isMobile.value = window.innerWidth <= MOBILE_MAX;
  // A desktop resize must never leave the mobile overlay active.
  if (!isMobile.value) mobileOpen.value = false;
  apply();
}

/**
 * AdminLTE suppresses shell transitions while the viewport is being resized so
 * the sidebar does not lag behind the pointer. Mirrored here for parity.
 */
function holdTransition(time = 200): void {
  if (!hasDom()) return;
  if (holdTransitionTimer !== undefined) window.clearTimeout(holdTransitionTimer);
  document.body.classList.add("hold-transition");
  holdTransitionTimer = window.setTimeout(() => {
    holdTransitionTimer = undefined;
    document.body.classList.remove("hold-transition");
  }, time);
}

function onResize(): void {
  syncViewport();
  holdTransition();
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === "Escape" && mobileOpen.value) {
    closeMobile({ restoreFocus: true });
  }
}

function toggle(): void {
  if (isMobile.value) {
    mobileOpen.value = !mobileOpen.value;
  } else {
    collapsed.value = !collapsed.value;
    persist();
  }
  apply();
}

function closeMobile(options: { restoreFocus?: boolean } = {}): void {
  if (!mobileOpen.value) return;
  mobileOpen.value = false;
  apply();
  if (options.restoreFocus) {
    document.querySelector<HTMLElement>(SIDEBAR_TOGGLE_SELECTOR)?.focus();
  }
}

function start(): void {
  consumers += 1;
  if (consumers > 1) return;

  collapsed.value = readStoredCollapsed();
  syncViewport();
  window.addEventListener("resize", onResize, { passive: true });
  document.addEventListener("keydown", onKeydown);

  // AdminLTE adds `app-loaded` shortly after first paint; until then its CSS
  // disables shell transitions to avoid animating the initial layout.
  appLoadedTimer = window.setTimeout(() => {
    appLoadedTimer = undefined;
    document.body.classList.add("app-loaded");
  }, 400);
}

function stop(): void {
  consumers = Math.max(0, consumers - 1);
  if (consumers > 0) return;

  window.removeEventListener("resize", onResize);
  document.removeEventListener("keydown", onKeydown);
  mobileOpen.value = false;
  apply();

  if (appLoadedTimer !== undefined) {
    window.clearTimeout(appLoadedTimer);
    appLoadedTimer = undefined;
  }
  if (holdTransitionTimer !== undefined) {
    window.clearTimeout(holdTransitionTimer);
    holdTransitionTimer = undefined;
    document.body.classList.remove("hold-transition");
  }
}

export function useSidebar() {
  onMounted(start);
  onBeforeUnmount(stop);

  return {
    collapsed: computed(() => collapsed.value),
    mobileOpen: computed(() => mobileOpen.value),
    isMobile: computed(() => isMobile.value),
    toggle,
    closeMobile
  };
}

/** For unit tests: reset module-level state without mounting a component. */
export function __resetSidebarStateForTests(): void {
  consumers = 0;
  collapsed.value = false;
  mobileOpen.value = false;
  isMobile.value = false;
  if (appLoadedTimer !== undefined) {
    window.clearTimeout(appLoadedTimer);
    appLoadedTimer = undefined;
  }
  if (holdTransitionTimer !== undefined) {
    window.clearTimeout(holdTransitionTimer);
    holdTransitionTimer = undefined;
  }
  document.body.classList.remove("hold-transition");
  apply();
}
