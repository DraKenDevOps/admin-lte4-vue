<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { slideDown, slideUp } from "@/lib/slide";
import type { NavItem } from "@/types/nav";

/** Matches AdminLTE's Treeview `animationSpeed`. */
const TREEVIEW_SPEED = 300;

const props = defineProps<{ item: NavItem }>();

const route = useRoute();

const children = computed(() => props.item.children ?? []);
const hasChildren = computed(() => children.value.length > 0);

function matchesPath(path: string): boolean {
  // The trailing slash prevents `/` from matching every route.
  return route.path === path || route.path.startsWith(`${path}/`);
}

function isActiveItem(item: NavItem): boolean {
  if (item.to && matchesPath(item.to)) return true;
  return item.children?.some(isActiveItem) ?? false;
}

/** Route-derived open state, overridable by an explicit click. */
const routeOpen = computed(() => children.value.some(isActiveItem));
const manualOpen = ref<boolean | null>(null);
const isOpen = computed(() => manualOpen.value ?? routeOpen.value);

// Reset manual state on navigation so route-derived state takes over again.
watch(
  () => route.path,
  () => {
    manualOpen.value = null;
  }
);

function toggleOpen(): void {
  manualOpen.value = !isOpen.value;
}

const tree = ref<HTMLElement | null>(null);

/*
 * AdminLTE slides the `.nav-treeview` with a 300 ms height animation. Watchers
 * run before Vue patches the DOM, so a closing treeview is still displayed
 * (and measurable) when `slideUp` starts; an opening one falls back to
 * `display: block` inside `slideDown`.
 */
watch(isOpen, (open) => {
  const element = tree.value;
  if (!element) return;
  if (open) slideDown(element, TREEVIEW_SPEED);
  else slideUp(element, TREEVIEW_SPEED);
});
</script>

<template>
  <li class="nav-item" :class="{ 'menu-open': isOpen }">
    <RouterLink
      v-if="!hasChildren"
      :to="item.to ?? '/'"
      class="nav-link"
      :class="{ active: isActiveItem(item) }"
      :aria-current="isActiveItem(item) ? 'page' : undefined"
      :aria-label="item.label"
    >
      <i v-if="item.icon" class="nav-icon" :class="item.icon" aria-hidden="true" />
      <p>
        {{ item.label }}
        <span v-if="item.badge" class="nav-badge badge text-bg-secondary me-3">
          {{ item.badge }}
        </span>
      </p>
    </RouterLink>

    <button v-else type="button" class="nav-link" :class="{ active: routeOpen }" :aria-expanded="isOpen" :aria-label="item.label" @click="toggleOpen">
      <i v-if="item.icon" class="nav-icon" :class="item.icon" aria-hidden="true" />
      <p>
        {{ item.label }}
        <span v-if="item.badge" class="nav-badge badge text-bg-secondary me-3">
          {{ item.badge }}
        </span>
        <i class="nav-arrow bi bi-chevron-right" aria-hidden="true" />
      </p>
    </button>

    <ul v-if="hasChildren" ref="tree" class="nav nav-treeview">
      <SidebarMenuItem v-for="child in children" :key="child.to ?? child.label" :item="child" />
    </ul>
  </li>
</template>
