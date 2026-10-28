import type { NavItem } from "@/types/nav";

/**
 * Recursively filter the navigation model by label.
 *
 * - A matching parent keeps its full child list, so the whole group stays visible.
 * - A non-matching parent is kept only when at least one descendant matches.
 * - An empty query returns the input array unchanged.
 */
export function filterNavigation(items: NavItem[], query: string): NavItem[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return items;

  const result: NavItem[] = [];

  for (const item of items) {
    if (item.label.toLowerCase().includes(needle)) {
      result.push(item);
      continue;
    }

    if (item.children?.length) {
      const children = filterNavigation(item.children, needle);
      if (children.length > 0) {
        result.push({ ...item, children });
      }
    }
  }

  return result;
}
