<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import { slideDown, slideUp } from "@/lib/slide";
import type { AdminVariant } from "@/types/ui";

/** Matches AdminLTE's CardWidget defaults. */
const ANIMATION_SPEED = 500;
const MAXIMIZE_SPEED = 150;

const props = withDefaults(
  defineProps<{
    title?: string;
    variant?: AdminVariant;
    /** Render the AdminLTE `card-outline` style (coloured top border only). */
    outline?: boolean;
    collapsible?: boolean;
    maximizable?: boolean;
    removable?: boolean;
    defaultCollapsed?: boolean;
  }>(),
  {
    collapsible: false,
    maximizable: false,
    removable: false,
    defaultCollapsed: false
  }
);

const emit = defineEmits<{ removed: [] }>();

const card = ref<HTMLElement | null>(null);

const collapsed = ref(props.defaultCollapsed);
const maximized = ref(false);
const visible = ref(true);
/** AdminLTE only sets `was-collapsed` while a collapsed card is maximized. */
const wasCollapsed = ref(false);
const collapsing = ref(false);
const expanding = ref(false);

const timers = new Set<number>();

function schedule(callback: () => void, delay: number): void {
  const id = window.setTimeout(() => {
    timers.delete(id);
    callback();
  }, delay);
  timers.add(id);
}

function clearTimers(): void {
  for (const id of timers) window.clearTimeout(id);
  timers.clear();
}

/** The card's own body/footer, excluding any nested cards. */
function cardContent(): HTMLElement[] {
  const element = card.value;
  if (!element) return [];
  return Array.from(element.children).filter(
    (child): child is HTMLElement => child instanceof HTMLElement && (child.classList.contains("card-body") || child.classList.contains("card-footer"))
  );
}

const cardClass = computed(() => [
  props.variant ? `card-${props.variant}` : undefined,
  {
    "card-outline": props.outline,
    "collapsed-card": collapsed.value,
    "collapsing-card": collapsing.value,
    "expanding-card": expanding.value,
    "maximized-card": maximized.value,
    "was-collapsed": wasCollapsed.value
  }
]);

const hasTools = computed(() => Boolean(props.collapsible || props.maximizable || props.removable));

function collapse(): void {
  if (!card.value) return;
  collapsing.value = true;
  expanding.value = false;
  for (const content of cardContent()) slideUp(content, ANIMATION_SPEED);
  schedule(() => {
    if (!collapsing.value) return;
    collapsed.value = true;
    collapsing.value = false;
  }, ANIMATION_SPEED);
}

function expand(): void {
  if (!card.value) return;
  expanding.value = true;
  collapsing.value = false;
  collapsed.value = false;
  for (const content of cardContent()) slideDown(content, ANIMATION_SPEED);
  schedule(() => {
    if (!expanding.value) return;
    expanding.value = false;
  }, ANIMATION_SPEED);
}

function toggleCollapse(): void {
  if (collapsed.value || collapsing.value) expand();
  else collapse();
}

function maximize(): void {
  const element = card.value;
  if (!element) return;

  element.style.height = `${element.offsetHeight}px`;
  element.style.width = `${element.offsetWidth}px`;
  element.style.transition = "all .15s";

  schedule(() => {
    document.documentElement.classList.add("maximized-card");
    maximized.value = true;
    if (collapsed.value) wasCollapsed.value = true;
  }, MAXIMIZE_SPEED);
}

function minimize(): void {
  const element = card.value;
  if (!element) return;

  element.style.height = "auto";
  element.style.width = "auto";
  element.style.transition = "all .15s";

  schedule(() => {
    document.documentElement.classList.remove("maximized-card");
    maximized.value = false;
    if (wasCollapsed.value) wasCollapsed.value = false;

    schedule(() => {
      element.style.removeProperty("height");
      element.style.removeProperty("width");
      element.style.removeProperty("transition");
    }, MAXIMIZE_SPEED);
  }, 10);
}

function toggleMaximize(): void {
  if (maximized.value) minimize();
  else maximize();
}

function remove(): void {
  const element = card.value;
  if (!element) return;

  // Cancel any pending collapse/expand/maximize commit so it cannot resurrect
  // state after the card has been hidden.
  clearTimers();
  document.documentElement.classList.remove("maximized-card");

  slideUp(element, ANIMATION_SPEED);
  schedule(() => {
    visible.value = false;
    emit("removed");
  }, ANIMATION_SPEED);
}

onBeforeUnmount(() => {
  clearTimers();
  document.documentElement.classList.remove("maximized-card");
});
</script>

<template>
  <div v-if="visible" ref="card" class="card" :class="cardClass">
    <div class="card-header">
      <h2 class="card-title">{{ title }}</h2>
      <div v-if="hasTools || $slots.tools" class="card-tools">
        <slot name="tools" />
        <button
          v-if="collapsible"
          type="button"
          class="btn btn-tool"
          data-lte-toggle="card-collapse"
          :aria-label="collapsed ? 'Expand card' : 'Collapse card'"
          :aria-expanded="!collapsed"
          @click="toggleCollapse"
        >
          <i data-lte-icon="expand" class="bi bi-plus-lg" aria-hidden="true" />
          <i data-lte-icon="collapse" class="bi bi-dash-lg" aria-hidden="true" />
        </button>
        <button
          v-if="maximizable"
          type="button"
          class="btn btn-tool"
          data-lte-toggle="card-maximize"
          :aria-label="maximized ? 'Restore card' : 'Maximize card'"
          :aria-pressed="maximized"
          @click="toggleMaximize"
        >
          <i data-lte-icon="maximize" class="bi bi-arrows-fullscreen" aria-hidden="true" />
          <i data-lte-icon="minimize" class="bi bi-fullscreen-exit" aria-hidden="true" />
        </button>
        <button v-if="removable" type="button" class="btn btn-tool" data-lte-toggle="card-remove" aria-label="Remove card" @click="remove">
          <i class="bi bi-x-lg" aria-hidden="true" />
        </button>
      </div>
    </div>

    <div class="card-body">
      <slot />
    </div>
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>
