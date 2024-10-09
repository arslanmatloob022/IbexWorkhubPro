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

viewWrapper.setPageTitle("Clients Ibex");
useHead({
  title: "Clients - Ibex",
});
</script>

<template>
  <div class="page-content-inner">
    <ClientsList />
  </div>
</template>
