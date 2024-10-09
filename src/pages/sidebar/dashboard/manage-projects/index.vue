<route lang="yaml">
meta:
  requiresAuth: true
  isPartnerAllowed: false
  isManagerAllowed: true
  isContractorAllowed: true
  isWorkerAllowed: false
  isClientAllowed: false
</route>

<script setup lang="ts">
import { useViewWrapper } from "/@src/stores/viewWrapper";

const viewWrapper = useViewWrapper();
viewWrapper.setPageTitle("Manage Projects");

useHead({
  title: "Manage Projects",
});
</script>

<template>
  <div class="page-content-inner">
    <Teleport to="[data-teleport-bg]">
      <div class="lifestyle-dashboard-bg has-top-nav" />
    </Teleport>

    <ProjectManagerCalendar />
  </div>
</template>
