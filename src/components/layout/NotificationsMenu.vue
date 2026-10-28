<script setup lang="ts">
import { headerNotifications } from "@/data/ui";

const count = 15;
</script>

<template>
  <li class="nav-item dropdown">
    <a class="nav-link" data-bs-toggle="dropdown" href="#" :aria-label="`Notifications: ${count} unread`">
      <i class="bi bi-bell-fill" aria-hidden="true" />
      <span class="navbar-badge badge text-bg-warning">{{ count }}</span>
    </a>
    <div class="dropdown-menu dropdown-menu-lg dropdown-menu-end">
      <span class="dropdown-item dropdown-header">{{ count }} Notifications</span>
      <template v-for="notification in headerNotifications" :key="notification.id">
        <div class="dropdown-divider" />
        <a href="#" class="dropdown-item">
          <i :class="[notification.icon, 'me-2']" aria-hidden="true" />
          {{ notification.text }}
          <span class="float-end text-secondary fs-7">{{ notification.time }}</span>
        </a>
      </template>
      <div class="dropdown-divider" />
      <a href="#" class="dropdown-item dropdown-footer">See All Notifications</a>
    </div>
  </li>
</template>
