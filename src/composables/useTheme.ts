import { STORAGE_KEYS, type Theme } from "@/utils/keys";
import { computed, ref } from "vue";

export const THEME_OPTIONS = [
  { value: "light", label: "Light", icon: "bi bi-sun-fill" },
  { value: "dark", label: "Dark", icon: "bi bi-moon-fill" },
  { value: "auto", label: "Auto", icon: "bi bi-circle-half" }
] as const satisfies ReadonlyArray<{ value: Theme; label: string; icon: string }>;

const CHANGE_EVENT = "changed.lte.color-mode";

const hasDom = typeof window !== "undefined" && typeof document !== "undefined";

const media = hasDom ? window.matchMedia("(prefers-color-scheme: dark)") : null;

const prefersDark = ref(media?.matches ?? false);

function readTheme(): Theme {
  if (!hasDom) return "auto";

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.appTheme);
    if (stored === "light" || stored === "dark" || stored === "auto") return stored;
  } catch {
    // localStorage may be unavailable (private mode, sandboxed iframe).
  }

  // The inline head script flags values it computed from the OS preference.
  if (document.documentElement.hasAttribute("data-appTheme-resolved")) return "auto";

  const authored = document.documentElement.getAttribute("data-bs-theme");
  if (authored === "light" || authored === "dark") return authored;
  return "auto";
}

const theme = ref<Theme>(readTheme());

const resolved = computed<"light" | "dark">(() => {
  if (theme.value === "auto") return prefersDark.value ? "dark" : "light";
  return theme.value;
});

function apply(): void {
  if (!hasDom) return;
  const root = document.documentElement;
  root.setAttribute("data-bs-theme", resolved.value);
  root.style.colorScheme = resolved.value;
}

// Register once for the lifetime of the module.
media?.addEventListener("change", (event) => {
  prefersDark.value = event.matches;
  if (theme.value === "auto") apply();
});

export function useTheme() {
  function setTheme(next: Theme): void {
    theme.value = next;
    try {
      localStorage.setItem(STORAGE_KEYS.appTheme, next);
    } catch {
      // Persisting is best-effort.
    }
    apply();
    document.dispatchEvent(
      new CustomEvent(CHANGE_EVENT, {
        detail: { theme: next, resolved: resolved.value }
      })
    );
  }

  return { theme, resolved, setTheme };
}
