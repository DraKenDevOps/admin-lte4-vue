import { createApp } from "vue";

// 1. Fonts and icons
import "@fontsource/source-sans-3/index.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// 2. Optional scrollbar styling
import "overlayscrollbars/overlayscrollbars.css";

// 3. AdminLTE last — it bundles Bootstrap 5.3.8 CSS.
// Never import 'bootstrap/dist/css/bootstrap.css' as well.
import "@/styles/adminlte.min.css";
import "@/styles/app.css";

// 4. Bootstrap JS data API only (CSS already came with AdminLTE).
// Import only the plugins the app uses, not the whole bundle.
import "bootstrap/js/dist/dropdown";
import "bootstrap/js/dist/collapse";
import "bootstrap/js/dist/modal";
import "bootstrap/js/dist/tooltip";

import App from "./App.vue";
import router from "./router";

createApp(App).use(router).mount("#app");
