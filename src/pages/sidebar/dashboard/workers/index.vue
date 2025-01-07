<route lang="yaml">
meta:
  requiresAuth: true
  isAdminAllowed: true
  isManagerAllowed: true
  isContractorAllowed: false
  isPartnerAllowed: false
  isWorkerAllowed: false
  isClientAllowed: false
</route>

<script setup lang="ts">
import { useViewWrapper } from "/@src/stores/viewWrapper";
const route = useRoute();

const viewWrapper = useViewWrapper();
let title = "Workers";

viewWrapper.setPageTitle(title);
useHead({
  title: "Workers - Ibex",
});
</script>

<template>
  <div class="page-content-inner">
    <IbexWorkers />
  </div>
</template>
