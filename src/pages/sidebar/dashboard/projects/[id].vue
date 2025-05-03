<route lang="yaml">
meta:
  requiresAuth: true
  isAdminAllowed: true
  isManagerAllowed: true
  isContractorAllowed: false
  isPartnerAllowed: false
  isWorkerAllowed: false
  isClientAllowed: true
</route>

<script setup lang="ts">
import { useViewWrapper } from "/@src/stores/viewWrapper";

const viewWrapper = useViewWrapper();
viewWrapper.setPageTitle("Completed Project");

useHead({
  title: "Completed Project",
});
</script>

<template>
  <div class="page-content-inner">
    <Teleport to="[data-teleport-bg]">
      <div class="lifestyle-dashboard-bg has-top-nav" />
    </Teleport>
    <JobDetails class="has-navbar-spacing" />
  </div>
</template>
