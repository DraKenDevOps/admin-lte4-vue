import { mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import AppCard from "@/components/ui/AppCard.vue";

/** Advance the animation timers and let Vue apply the resulting state. */
async function flush(ms: number): Promise<void> {
  vi.advanceTimersByTime(ms);
  await nextTick();
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  document.documentElement.classList.remove("maximized-card");
});

describe("AppCard", () => {
  it("collapses and expands with accessible labels", async () => {
    const wrapper = mount(AppCard, {
      props: { title: "Collapsible", collapsible: true },
      slots: { default: "Body" }
    });

    expect(wrapper.classes()).not.toContain("collapsed-card");

    await wrapper.get('button[aria-label="Collapse card"]').trigger("click");
    expect(wrapper.classes()).toContain("collapsing-card");
    expect(wrapper.classes()).not.toContain("collapsed-card");

    await flush(500);
    expect(wrapper.classes()).toContain("collapsed-card");
    expect(wrapper.classes()).not.toContain("collapsing-card");

    const expand = wrapper.get('button[aria-label="Expand card"]');
    expect(expand.attributes("aria-expanded")).toBe("false");

    await expand.trigger("click");
    expect(wrapper.classes()).toContain("expanding-card");
    expect(wrapper.classes()).not.toContain("collapsed-card");

    await flush(500);
    expect(wrapper.classes()).not.toContain("expanding-card");
  });

  it("starts collapsed when requested", () => {
    const wrapper = mount(AppCard, {
      props: { title: "Expandable", collapsible: true, defaultCollapsed: true }
    });

    expect(wrapper.classes()).toContain("collapsed-card");
  });

  it("maximizes and restores, preserving the collapsed state", async () => {
    const wrapper = mount(AppCard, {
      props: { title: "Maximizable", maximizable: true, collapsible: true, defaultCollapsed: true }
    });

    await wrapper.get('button[aria-label="Maximize card"]').trigger("click");
    expect(wrapper.classes()).not.toContain("maximized-card");

    await flush(150);
    expect(wrapper.classes()).toContain("maximized-card");
    expect(wrapper.classes()).toContain("was-collapsed");
    expect(wrapper.classes()).toContain("collapsed-card");
    expect(document.documentElement.classList.contains("maximized-card")).toBe(true);

    await wrapper.get('button[aria-label="Restore card"]').trigger("click");
    await flush(10);

    expect(wrapper.classes()).not.toContain("maximized-card");
    expect(wrapper.classes()).not.toContain("was-collapsed");
    expect(wrapper.classes()).toContain("collapsed-card");
    expect(document.documentElement.classList.contains("maximized-card")).toBe(false);
  });

  it("removes itself after the slide animation and emits", async () => {
    const wrapper = mount(AppCard, {
      props: { title: "Removable", removable: true }
    });

    await wrapper.get('button[aria-label="Remove card"]').trigger("click");
    expect(wrapper.find(".card").exists()).toBe(true);

    await flush(500);
    expect(wrapper.find(".card").exists()).toBe(false);
    expect(wrapper.emitted("removed")).toHaveLength(1);
  });
});
