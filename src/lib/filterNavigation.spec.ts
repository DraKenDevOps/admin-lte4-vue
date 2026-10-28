import { describe, expect, it } from "vitest";
import type { NavItem } from "@/types/nav";
import { filterNavigation } from "@/lib/filterNavigation";

const navigation: NavItem[] = [
  { label: "Dashboard", to: "/" },
  {
    label: "Widgets",
    children: [
      { label: "Cards", to: "/widgets/cards" },
      { label: "Info Box", to: "/widgets/info-box" }
    ]
  },
  { label: "Starter Page", to: "/starter" }
];

describe("filterNavigation", () => {
  it("returns the input unchanged for an empty query", () => {
    expect(filterNavigation(navigation, "")).toBe(navigation);
    expect(filterNavigation(navigation, "   ")).toBe(navigation);
  });

  it("matches labels case-insensitively", () => {
    const result = filterNavigation(navigation, "CARDS");
    expect(result).toHaveLength(1);
    expect(result[0]?.label).toBe("Widgets");
    expect(result[0]?.children?.map((child) => child.label)).toEqual(["Cards"]);
  });

  it("keeps the whole child list when the parent matches", () => {
    const result = filterNavigation(navigation, "widget");
    expect(result).toHaveLength(1);
    expect(result[0]?.children?.map((child) => child.label)).toEqual(["Cards", "Info Box"]);
  });

  it("drops branches without matches", () => {
    const result = filterNavigation(navigation, "starter");
    expect(result.map((item) => item.label)).toEqual(["Starter Page"]);
  });

  it("returns an empty array when nothing matches", () => {
    expect(filterNavigation(navigation, "nope")).toEqual([]);
  });
});
