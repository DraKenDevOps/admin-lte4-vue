<script setup lang="ts">
import Modal from "bootstrap/js/dist/modal";
import { onBeforeUnmount, onMounted, ref, useId, watch } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    title: string;
    /** Optional explicit id; one is generated when omitted. */
    id?: string;
    size?: "sm" | "lg" | "xl";
    /** Set to `false` for a modal that cannot be dismissed by backdrop/Escape. */
    dismissible?: boolean;
  }>(),
  {
    dismissible: true
  }
);

const emit = defineEmits<{ "update:modelValue": [value: boolean] }>();

const uid = useId();
const modalId = props.id ?? `app-modal-${uid}`;
const element = ref<HTMLElement | null>(null);

let modal: Modal | null = null;

function onHidden(): void {
  emit("update:modelValue", false);
}

function ensureInstance(): Modal | null {
  if (!element.value) return null;
  if (!modal) {
    modal = new Modal(element.value, {
      backdrop: props.dismissible ? true : "static",
      keyboard: props.dismissible
    });
    element.value.addEventListener("hidden.bs.modal", onHidden);
  }
  return modal;
}

function hide(): void {
  modal?.hide();
}

watch(
  () => props.modelValue,
  (open) => {
    const instance = ensureInstance();
    if (!instance) return;
    if (open) instance.show();
    else instance.hide();
  }
);

onMounted(() => {
  if (props.modelValue) ensureInstance()?.show();
});

onBeforeUnmount(() => {
  element.value?.removeEventListener("hidden.bs.modal", onHidden);
  modal?.dispose();
  modal = null;
});

defineExpose({ hide });
</script>

<template>
  <Teleport to="body">
    <div :id="modalId" ref="element" class="modal fade" tabindex="-1" :aria-labelledby="`${modalId}-label`" aria-hidden="true">
      <div class="modal-dialog" :class="{ [`modal-${size}`]: size }">
        <div class="modal-content">
          <div class="modal-header">
            <h2 :id="`${modalId}-label`" class="modal-title fs-5">{{ title }}</h2>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
          </div>
          <div class="modal-body">
            <slot />
          </div>
          <div class="modal-footer">
            <slot name="footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
