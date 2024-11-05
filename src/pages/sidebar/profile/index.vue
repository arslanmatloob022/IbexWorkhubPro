<route lang="yaml">
meta:
  requiresAuth: true
</route>
<script setup lang="ts">
import { useViewWrapper } from "/@src/stores/viewWrapper";

const viewWrapper = useViewWrapper();
viewWrapper.setPageTitle("Profile");

useHead({
  title: "User Profile",
});
</script>

<template>
  <div class="page-content-inner">
    <Teleport to="[data-teleport-bg]">
      <div class="lifestyle-dashboard-bg has-top-nav" />
    </Teleport>
    <AdminProfile class="has-navbar-spacing" />
  </div>
</template>
