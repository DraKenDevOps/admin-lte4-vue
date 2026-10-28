import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "dashboard",
    component: () => import("@/views/DashboardView.vue"),
    meta: { title: "Dashboard", layout: "admin", breadcrumb: ["Dashboard"] }
  },
  {
    path: "/starter",
    name: "starter",
    component: () => import("@/views/StarterView.vue"),
    meta: { title: "Starter Page", layout: "admin", breadcrumb: ["Starter Page"] }
  },
  {
    path: "/widgets/cards",
    name: "widgets-cards",
    component: () => import("@/views/WidgetsCardsView.vue"),
    meta: { title: "Cards", layout: "admin", breadcrumb: ["Widgets", "Cards"] }
  },
  {
    path: "/widgets/info-box",
    name: "widgets-info-box",
    component: () => import("@/views/WidgetsInfoBoxView.vue"),
    meta: { title: "Info Box", layout: "admin", breadcrumb: ["Widgets", "Info Box"] }
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/LoginView.vue"),
    meta: { title: "Sign in", layout: "auth" }
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("@/views/NotFoundView.vue"),
    meta: { title: "Page not found", layout: "blank" }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) return { el: to.hash, behavior: "smooth" };
    return { top: 0 };
  }
});

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} | AdminLTE 4` : "AdminLTE 4";
});

export default router;
