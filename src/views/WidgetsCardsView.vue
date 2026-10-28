<script setup lang="ts">
import { ref } from "vue";
import AppCard from "@/components/ui/AppCard.vue";
import AppModal from "@/components/ui/AppModal.vue";

const modalOpen = ref(false);
</script>

<template>
  <div>
    <div class="row g-4">
      <div class="col-md-6 col-xl-3">
        <AppCard title="Expandable" variant="primary" collapsible default-collapsed> The body of the card. </AppCard>
      </div>
      <div class="col-md-6 col-xl-3">
        <AppCard title="Collapsible" variant="success" collapsible> The body of the card. </AppCard>
      </div>
      <div class="col-md-6 col-xl-3">
        <AppCard title="Removable" variant="warning" removable> The body of the card. </AppCard>
      </div>
      <div class="col-md-6 col-xl-3">
        <AppCard title="Maximizable" variant="danger" maximizable collapsible> The body of the card. </AppCard>
      </div>

      <div class="col-md-6">
        <AppCard title="Outline style" variant="info" outline>
          <p class="mb-0">
            Cards use Vue state and AdminLTE classes (<code>collapsed-card</code>,
            <code>maximized-card</code>) — no AdminLTE JavaScript.
          </p>
        </AppCard>
      </div>
      <div class="col-md-6">
        <AppCard title="With footer">
          <p class="mb-0">Card body content.</p>
          <template #footer>
            <span class="text-secondary">Card footer</span>
          </template>
        </AppCard>
      </div>

      <div class="col-md-6">
        <AppCard title="Modal">
          <p>Bootstrap's modal plugin is used programmatically through <code>AppModal</code>.</p>
          <button type="button" class="btn btn-primary" @click="modalOpen = true">Launch modal</button>
        </AppCard>
      </div>
    </div>

    <AppModal v-model="modalOpen" title="AdminLTE modal" size="lg">
      <p class="mb-0">
        This modal is teleported to <code>&lt;body&gt;</code>, closes with Escape or the backdrop, and resets its <code>v-model</code> when hidden.
      </p>
    </AppModal>
  </div>
</template>
