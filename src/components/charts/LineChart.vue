<script setup lang="ts">
import { Chart } from "@/lib/chartSetup";
import type { ChartConfiguration } from "chart.js";
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useTheme } from "@/composables/useTheme";
import { alpha, applyChartTheme, areaFill } from "@/lib/chartTheme";
import type { LineChartDataset } from "@/types/charts";

const props = withDefaults(
  defineProps<{
    labels: string[];
    datasets: LineChartDataset[];
    ariaLabel?: string;
    height?: number;
    showLegend?: boolean;
  }>(),
  {
    ariaLabel: "Line chart",
    height: 300,
    showLegend: false
  }
);

const canvas = ref<HTMLCanvasElement | null>(null);
const { resolved } = useTheme();

let chart: Chart<"line"> | null = null;

function buildConfig(): ChartConfiguration<"line"> {
  return {
    type: "line",
    data: {
      labels: props.labels,
      datasets: props.datasets.map((dataset) => ({
        label: dataset.label,
        data: dataset.data,
        borderColor: dataset.color,
        backgroundColor: dataset.fill ? areaFill(dataset.color) : alpha(dataset.color, 0.1),
        pointBackgroundColor: dataset.color,
        fill: dataset.fill ?? false,
        tension: 0.4
      }))
    },
    options: {
      plugins: {
        legend: { display: props.showLegend },
        tooltip: {
          callbacks: {
            title: (items) => (items.length > 0 ? String(items[0]?.label ?? "") : "")
          }
        }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  };
}

onMounted(() => {
  applyChartTheme();
  if (!canvas.value) return;
  chart = new Chart(canvas.value, buildConfig());
});

watch(
  () => [props.labels, props.datasets] as const,
  () => {
    if (!chart) return;
    chart.data.labels = props.labels;
    chart.data.datasets = buildConfig().data.datasets;
    chart.update();
  },
  { deep: true }
);

// Chart.js caches resolved theme colours in each chart's config, so re-apply
// the defaults and redraw when the resolved theme changes.
watch(resolved, () => {
  applyChartTheme();
  chart?.update("none");
});

onBeforeUnmount(() => {
  chart?.destroy();
  chart = null;
});
</script>

<template>
  <div class="position-relative" :style="{ height: `${height}px` }">
    <canvas ref="canvas" role="img" :aria-label="ariaLabel" />
  </div>
</template>
