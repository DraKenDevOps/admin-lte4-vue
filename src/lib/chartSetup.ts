import { CategoryScale, Chart, Filler, Legend, LineController, LineElement, LinearScale, PointElement, Tooltip } from "chart.js";

// Register only what the app's line charts need. `chart.js/auto` would pull every
// controller and element into the bundle.
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, LineController, Filler, Legend, Tooltip);

export { Chart };
