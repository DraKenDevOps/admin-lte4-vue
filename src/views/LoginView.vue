<script setup lang="ts">
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";

const router = useRouter();
const email = ref("");
const password = ref("");
const remember = ref(false);

/** Demo sign-in: a real app would authenticate here before navigating. */
function signIn(): void {
  void router.push("/");
}
</script>

<template>
  <main class="login-box">
    <h1 class="login-logo">
      <RouterLink to="/"><b>Admin</b>LTE</RouterLink>
    </h1>
    <div class="card">
      <div class="card-body login-card-body">
        <p class="login-box-msg">Sign in to start your session</p>

        <form @submit.prevent="signIn">
          <label class="visually-hidden" for="loginEmail">Email</label>
          <div class="input-group mb-3">
            <input id="loginEmail" v-model="email" type="email" class="form-control" placeholder="Email" autocomplete="username" required />
            <div class="input-group-text">
              <span class="bi bi-envelope" aria-hidden="true" />
            </div>
          </div>

          <label class="visually-hidden" for="loginPassword">Password</label>
          <div class="input-group mb-3">
            <input id="loginPassword" v-model="password" type="password" class="form-control" placeholder="Password" autocomplete="current-password" required />
            <div class="input-group-text">
              <span class="bi bi-lock-fill" aria-hidden="true" />
            </div>
          </div>

          <div class="row">
            <div class="col-8">
              <div class="form-check">
                <input id="rememberMe" v-model="remember" class="form-check-input" type="checkbox" />
                <label class="form-check-label" for="rememberMe">Remember Me</label>
              </div>
            </div>
            <div class="col-4">
              <div class="d-grid gap-2">
                <button type="submit" class="btn btn-primary">Sign In</button>
              </div>
            </div>
          </div>
        </form>

        <p class="mt-3 mb-0">
          <RouterLink to="/">Back to the dashboard</RouterLink>
        </p>
      </div>
    </div>
  </main>
</template>
