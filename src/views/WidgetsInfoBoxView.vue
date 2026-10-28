<script setup lang="ts">
import InfoBox from "@/components/ui/InfoBox.vue";
</script>

<template>
  <div>
    <div class="row">
      <div class="col-12 col-sm-6 col-md-3">
        <InfoBox label="CPU Traffic" variant="primary" icon="bi bi-gear-fill"> 10 <small>%</small> </InfoBox>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <InfoBox label="Sales" value="760" variant="success" icon="bi bi-cart-fill" />
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <InfoBox label="New Members" value="2,000" variant="warning" icon="bi bi-people-fill" />
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <InfoBox label="Likes" value="41,410" variant="danger" icon="bi bi-hand-thumbs-up-fill" />
      </div>
    </div>

    <div class="row">
      <div class="col-12 col-sm-6 col-md-3">
        <InfoBox label="Bookmarks" value="41,410" variant="secondary" icon="bi bi-bookmark-fill" />
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <InfoBox label="Direct Messages" value="128" variant="info" icon="bi bi-chat-fill" />
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <InfoBox label="Downloads" value="9,102" variant="dark" icon="bi bi-download" />
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <InfoBox label="Uploads" value="374" variant="light" icon="bi bi-upload" />
      </div>
    </div>
  </div>
</template>
