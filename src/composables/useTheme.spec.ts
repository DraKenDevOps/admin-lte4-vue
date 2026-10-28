import { describe, expect, it, vi } from "vitest";
import { THEME_OPTIONS, useTheme } from "@/composables/useTheme";

describe("useTheme", () => {
  const { theme, resolved, setTheme } = useTheme();

  it("exposes the three AdminLTE modes", () => {
    expect(THEME_OPTIONS.map((option) => option.value)).toEqual(["light", "dark", "auto"]);
  });

  it("applies, persists, and announces a concrete theme", () => {
    const listener = vi.fn();
    document.addEventListener("changed.lte.color-mode", listener);

    setTheme("dark");

    expect(theme.value).toBe("dark");
    expect(resolved.value).toBe("dark");
    expect(document.documentElement.getAttribute("data-bs-theme")).toBe("dark");
    expect(document.documentElement.style.colorScheme).toBe("dark");
    expect(localStorage.getItem("appTheme")).toBe("dark");
    expect(listener).toHaveBeenCalledTimes(1);

    const event = listener.mock.calls[0]?.[0] as CustomEvent;
    expect(event.detail).toEqual({ theme: "dark", resolved: "dark" });

    document.removeEventListener("changed.lte.color-mode", listener);
  });

  it("resolves auto from the OS preference", () => {
    setTheme("auto");

    expect(theme.value).toBe("auto");
    expect(document.documentElement.getAttribute("data-bs-theme")).toBe(resolved.value);
    expect(localStorage.getItem("appTheme")).toBe("auto");
  });
});
