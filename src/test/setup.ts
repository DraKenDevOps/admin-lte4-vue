import { afterEach } from "vitest";

// happy-dom implements matchMedia, but keep the suite resilient if that changes.
if (typeof window !== "undefined" && typeof window.matchMedia !== "function") {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: (query: string): MediaQueryList =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        addListener: () => undefined,
        removeListener: () => undefined,
        dispatchEvent: () => false
      }) as unknown as MediaQueryList
  });
}

afterEach(() => {
  document.body.className = "";
  document.documentElement.removeAttribute("data-bs-theme");
  document.documentElement.removeAttribute("data-appTheme-resolved");
  document.documentElement.style.colorScheme = "";
  localStorage.clear();
});
