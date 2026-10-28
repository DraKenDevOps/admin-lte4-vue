<script setup lang="ts">
import { RouterLink } from "vue-router";
import logo from "@/assets/adminlte/img/AdminLTELogo.png";
</script>

<template>
  <div class="sidebar-brand">
    <RouterLink to="/" class="brand-link">
      <img :src="logo" alt="AdminLTE Logo" class="brand-image opacity-75 shadow" />
      <span class="brand-text fw-light">AdminLTE 4</span>
    </RouterLink>
  </div>
</template>
