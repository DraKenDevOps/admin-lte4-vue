<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
  <main class="d-flex align-items-center min-vh-100 py-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6 text-center">
          <div class="display-1 fw-bold text-primary lh-1 mb-3">404</div>
          <h1 class="h3 mb-3">Oops! Page not found.</h1>
          <p class="text-secondary mb-4">We could not find the page you were looking for. Meanwhile, you may return to the dashboard.</p>
          <RouterLink to="/" class="btn btn-outline-secondary">
            <i class="bi bi-arrow-left me-1" aria-hidden="true" />
            Back to dashboard
          </RouterLink>
        </div>
      </div>
    </div>
  </main>
</template>
