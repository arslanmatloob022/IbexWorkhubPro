<route lang="yaml">
meta:
  requiresAuth: true
  # isPartnerAllowed: true
  # isManagerAllowed: true
  # isContractorAllowed: false
  # isWorkerAllowed: false
  # isClientAllowed: false
</route>
<script setup lang="ts">
import { useViewWrapper } from "/@src/stores/viewWrapper";

const viewWrapper = useViewWrapper();
viewWrapper.setPageTitle("Completed Projects");

useHead({
  title: "Completed Projects - Ibex",
});
</script>

<template>
  <div class="page-content-inner">
    <Teleport to="[data-teleport-bg]">
      <div class="lifestyle-dashboard-bg has-top-nav" />
    </Teleport>
    <CompletedProjects class="has-navbar-spacing" />
  </div>
</template>
