<route lang="yaml">
meta:
  requiresAuth: true
  isPartnerAllowed: true
  isManagerAllowed: true
  isContractorAllowed: false
  isWorkerAllowed: false
  isClientAllowed: false
</route>

<script setup lang="ts">
import ProjectDetail from "/@src/components/IbexProjects/ProjectDetail.vue";
import { useViewWrapper } from "/@src/stores/viewWrapper";

const viewWrapper = useViewWrapper();
viewWrapper.setPageTitle("Projects");

useHead({
  title: "Projects",
});
</script>

<template>
  <div class="page-content-inner">
    <Teleport to="[data-teleport-bg]">
      <div class="lifestyle-dashboard-bg has-top-nav" />
    </Teleport>
    <ProjectDetail class="has-navbar-spacing" />
  </div>
</template>
