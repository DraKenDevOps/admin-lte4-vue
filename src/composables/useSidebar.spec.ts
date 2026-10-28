import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { defineComponent, h } from "vue";
import { __resetSidebarStateForTests, useSidebar } from "@/composables/useSidebar";

function setWidth(width: number): void {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    writable: true,
    value: width
  });
}

let sidebar!: ReturnType<typeof useSidebar>;

const Harness = defineComponent({
  setup() {
    sidebar = useSidebar();
    return () => h("div");
  }
});

beforeEach(() => {
  __resetSidebarStateForTests();
  localStorage.clear();
  setWidth(1440);
});

describe("useSidebar", () => {
  it("starts collapsed and toggles/persists the desktop state", () => {
    const wrapper = mount(Harness);

    expect(sidebar.isMobile.value).toBe(false);
    expect(document.body.classList.contains("sidebar-collapse")).toBe(true);

    sidebar.toggle();
    expect(document.body.classList.contains("sidebar-collapse")).toBe(false);
    expect(localStorage.getItem("appSidebarState")).toBe("sidebar-open");

    sidebar.toggle();
    expect(document.body.classList.contains("sidebar-collapse")).toBe(true);
    expect(localStorage.getItem("appSidebarState")).toBe("sidebar-collapse");

    wrapper.unmount();
  });

  it("restores a persisted collapse state on mount", () => {
    localStorage.setItem("appSidebarState", "sidebar-collapse");

    const wrapper = mount(Harness);

    expect(sidebar.collapsed.value).toBe(true);
    expect(document.body.classList.contains("sidebar-collapse")).toBe(true);

    wrapper.unmount();
  });

  it("restores an explicit open state on mount", () => {
    localStorage.setItem("appSidebarState", "sidebar-open");

    const wrapper = mount(Harness);

    expect(sidebar.collapsed.value).toBe(false);
    expect(document.body.classList.contains("sidebar-collapse")).toBe(false);

    wrapper.unmount();
  });

  it("uses the overlay state on mobile and closes on Escape", () => {
    setWidth(375);
    const wrapper = mount(Harness);

    expect(sidebar.isMobile.value).toBe(true);

    sidebar.toggle();
    expect(document.body.classList.contains("sidebar-open")).toBe(true);
    expect(document.body.classList.contains("sidebar-collapse")).toBe(false);

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(document.body.classList.contains("sidebar-open")).toBe(false);

    wrapper.unmount();
  });

  it("moves between mobile and desktop states on resize", () => {
    const wrapper = mount(Harness);

    expect(document.body.classList.contains("sidebar-collapse")).toBe(true);

    setWidth(375);
    window.dispatchEvent(new Event("resize"));
    expect(sidebar.isMobile.value).toBe(true);
    expect(document.body.classList.contains("sidebar-collapse")).toBe(false);

    sidebar.toggle(); // mobile: open
    expect(document.body.classList.contains("sidebar-open")).toBe(true);

    setWidth(1440);
    window.dispatchEvent(new Event("resize"));
    expect(sidebar.isMobile.value).toBe(false);
    expect(document.body.classList.contains("sidebar-open")).toBe(false);
    expect(document.body.classList.contains("sidebar-collapse")).toBe(true);

    wrapper.unmount();
  });
});
