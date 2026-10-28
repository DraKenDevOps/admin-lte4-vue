import type { NavItem } from "@/types/nav";

/**
 * Sidebar model. Only routes that actually ship are listed here; add entries as
 * pages are migrated. `satisfies` keeps route typos visible in the editor.
 */
export const navigation = [
  {
    label: "Home",
    to: "/",
    icon: "bi bi-house"
  },
  {
    label: "Starter Page",
    to: "/starter",
    icon: "bi bi-file-earmark"
  },
  {
    label: "Widgets",
    icon: "bi bi-box-seam",
    children: [
      { label: "Cards", to: "/widgets/cards", icon: "bi bi-card-text" },
      { label: "Info Box", to: "/widgets/info-box", icon: "bi bi-info-square" }
    ]
  }
] satisfies NavItem[];
