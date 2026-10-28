<script setup lang="ts">
import { RouterLink } from "vue-router";
import { currentUser } from "@/data/ui";
</script>

<template>
  <li class="nav-item dropdown user-menu">
    <a href="#" class="nav-link dropdown-toggle" data-bs-toggle="dropdown">
      <img :src="currentUser.avatar" class="user-image rounded-circle shadow" :alt="currentUser.name" />
    </a>
    <ul class="dropdown-menu dropdown-menu-lg dropdown-menu-end">
      <li class="user-header text-bg-secondary">
        <img :src="currentUser.avatar" class="rounded-circle shadow" :alt="currentUser.name" />
        <p>
          {{ currentUser.name }} - {{ currentUser.role }}
        </p>
      </li>
      <li class="user-footer">
        <RouterLink to="/login" class="btn btn-outline-danger">Log out</RouterLink>
      </li>
    </ul>
  </li>
</template>
