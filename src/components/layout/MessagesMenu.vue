<script setup lang="ts">
import { computed } from "vue";
import { headerMessages } from "@/data/ui";

const unread = computed(() => headerMessages.length);
</script>

<template>
  <li class="nav-item dropdown">
    <a class="nav-link" data-bs-toggle="dropdown" href="#" :aria-label="`Messages: ${unread} unread`">
      <i class="bi bi-chat-text" aria-hidden="true" />
      <span class="navbar-badge badge text-bg-danger">{{ unread }}</span>
    </a>
    <div class="dropdown-menu dropdown-menu-lg dropdown-menu-end">
      <template v-for="(message, index) in headerMessages" :key="message.id">
        <a href="#" class="dropdown-item">
          <div class="d-flex">
            <div class="flex-shrink-0">
              <img :src="message.avatar" alt="" class="img-size-50 rounded-circle me-3" />
            </div>
            <div class="flex-grow-1">
              <p class="dropdown-item-title">
                {{ message.author }}
                <span class="float-end fs-7" :class="message.starClass">
                  <i class="bi bi-star-fill" aria-hidden="true" />
                </span>
              </p>
              <p class="fs-7">{{ message.preview }}</p>
              <p class="fs-7 text-secondary"><i class="bi bi-clock-fill me-1" aria-hidden="true" /> {{ message.time }}</p>
            </div>
          </div>
        </a>
        <div v-if="index < headerMessages.length - 1" class="dropdown-divider" />
      </template>
      <div class="dropdown-divider" />
      <a href="#" class="dropdown-item dropdown-footer">See All Messages</a>
    </div>
  </li>
</template>
