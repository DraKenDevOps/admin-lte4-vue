import { Chart } from "@/lib/chartSetup";
import type { ScriptableContext } from "chart.js";

/** Read a CSS custom property from `<html>`, with a fallback for tests/SSR. */
export function cssVar(name: string, fallback = ""): string {
  if (typeof document === "undefined") return fallback;
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

/** `#0d6efd` (or `#06f`) + 0.3 -> `rgba(13, 110, 253, 0.3)`. Other formats pass through. */
export function alpha(color: string, opacity: number): string {
  let hex = String(color).trim().replace(/^#/, "");
  if (!/^[\da-f]{3}([\da-f]{3})?$/i.test(hex)) return color;

  if (hex.length === 3) {
    hex = [...hex].map((c) => c + c).join("");
  }

  const [r, g, b] = [0, 2, 4].map((i) => Number.parseInt(hex.slice(i, i + 2), 16));
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/** Scriptable backgroundColor for area charts: the line colour fading to transparent. */
export function areaFill(color: string, from = 0.35, to = 0) {
  return (context: ScriptableContext<"line">) => {
    const { ctx, chartArea } = context.chart;
    if (!chartArea) return alpha(color, from);

    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    gradient.addColorStop(0, alpha(color, from));
    gradient.addColorStop(1, alpha(color, to));
    return gradient;
  };
}

/**
 * Style every Chart.js chart from AdminLTE's CSS variables. Canvas cannot read
 * CSS, so values are resolved here; call `applyChartTheme()` whenever the theme
 * changes and then update the chart instances.
 *
 * Adapted from the inline chart preset in AdminLTE 4.10.1 `index.html`.
 */
export function applyChartTheme(): void {
  const text = cssVar("--bs-secondary-color", "#6c757d");
  const body = cssVar("--bs-body-color", "#212529");
  const surface = cssVar("--bs-body-bg", "#fff");
  const grid = `rgba(${cssVar("--bs-emphasis-color-rgb", "0, 0, 0")}, 0.08)`;
  const rtl = document.documentElement.getAttribute("dir") === "rtl";
  const d = Chart.defaults;

  d.font.family = cssVar("--bs-body-font-family", d.font.family);
  d.font.size = 12;
  d.color = text;
  d.borderColor = grid;
  d.maintainAspectRatio = false;

  d.scale.grid.color = grid;
  // `defaults.scale` is a union of every scale type; the shared core fields are safe here.
  const coreScale = d.scale as unknown as {
    border: { color: string };
    ticks: { padding: number };
  };
  coreScale.border.color = grid;
  coreScale.ticks.padding = 8;
  d.set("scales.linear", { border: { display: false } });
  d.set("scales.category", { grid: { display: false } });

  d.elements.line.borderWidth = 2;
  d.elements.point.radius = 0;
  d.elements.point.hoverRadius = 5;
  d.elements.point.hitRadius = 8;
  d.elements.point.hoverBorderWidth = 2;
  d.elements.point.borderColor = surface;

  const { legend, tooltip } = d.plugins;
  legend.position = "bottom";
  legend.rtl = rtl;
  Object.assign(legend.labels, {
    color: body,
    usePointStyle: true,
    pointStyle: "circle",
    boxWidth: 8,
    boxHeight: 8,
    padding: 16
  });

  Object.assign(tooltip, {
    rtl,
    backgroundColor: surface,
    borderColor: cssVar("--bs-border-color", "#dee2e6"),
    borderWidth: 1,
    titleColor: cssVar("--bs-emphasis-color", "#000"),
    bodyColor: body,
    titleFont: { weight: "600" },
    padding: 10,
    cornerRadius: 6,
    caretSize: 5,
    boxPadding: 4,
    usePointStyle: true
  });

  // Line charts share one tooltip per x value, like a dashboard should.
  if (Chart.overrides.line) {
    Chart.overrides.line.interaction = {
      mode: "index",
      intersect: false,
      axis: "x",
      includeInvisible: false
    };
  }
}
