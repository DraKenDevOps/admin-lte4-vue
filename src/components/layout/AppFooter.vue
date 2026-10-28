<script setup lang="ts">
const year = new Date().getFullYear();
</script>

<template>
  <footer class="app-footer">
    <div class="float-end d-none d-sm-inline">Anything you want</div>
    <strong>
      Copyright &copy; 2014-{{ year }}&nbsp;
      <a href="https://adminlte.io" class="text-decoration-none" target="_blank" rel="noopener"> AdminLTE.io </a>
      .
    </strong>
    All rights reserved.
  </footer>
</template>
