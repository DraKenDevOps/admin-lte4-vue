import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { createMemoryHistory, createRouter } from "vue-router";
import SidebarMenu from "@/components/layout/SidebarMenu.vue";
import { navigation } from "@/data/navigation";

function makeRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: "/", component: { template: "<div>home</div>" } },
      { path: "/starter", component: { template: "<div>starter</div>" } },
      { path: "/widgets/cards", component: { template: "<div>cards</div>" } },
      { path: "/widgets/info-box", component: { template: "<div>info</div>" } }
    ]
  });
}

async function mountAt(path: string) {
  const router = makeRouter();
  await router.push(path);
  await router.isReady();

  const wrapper = mount(SidebarMenu, {
    props: { items: navigation },
    global: { plugins: [router] }
  });

  return { wrapper, router };
}

describe("SidebarMenu", () => {
  it("opens the parent group that contains the active route", async () => {
    const { wrapper } = await mountAt("/widgets/cards");

    const openItems = wrapper.findAll(".nav-item.menu-open");
    expect(openItems).toHaveLength(1);

    const toggle = wrapper.get("button.nav-link");
    expect(toggle.attributes("aria-expanded")).toBe("true");
    expect(toggle.classes()).toContain("active");
  });

  it("marks only the active leaf link", async () => {
    const { wrapper } = await mountAt("/widgets/cards");

    const activeLinks = wrapper.findAll("a.nav-link.active");
    expect(activeLinks).toHaveLength(1);
    expect(activeLinks[0]?.text()).toContain("Cards");
    expect(activeLinks[0]?.attributes("aria-current")).toBe("page");
  });

  it("does not mark the dashboard link active on other routes", async () => {
    const { wrapper } = await mountAt("/starter");

    const activeLinks = wrapper.findAll("a.nav-link.active");
    expect(activeLinks).toHaveLength(1);
    expect(activeLinks[0]?.text()).toContain("Starter Page");
  });

  it("closes an open group when its toggle is clicked", async () => {
    const { wrapper } = await mountAt("/widgets/cards");

    const toggle = wrapper.get("button.nav-link");
    await toggle.trigger("click");

    expect(toggle.attributes("aria-expanded")).toBe("false");
    expect(wrapper.find(".nav-item.menu-open").exists()).toBe(false);
  });
});
