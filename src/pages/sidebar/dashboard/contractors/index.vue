<route lang="yaml">
meta:
  requiresAuth: true
  isAdminAllowed: true
  isManagerAllowed: false
  isContractorAllowed: false
  isPartnerAllowed: false
  isWorkerAllowed: false
  isClientAllowed: false
</route>

<script setup lang="ts">
import { useViewWrapper } from "/@src/stores/viewWrapper";

const viewWrapper = useViewWrapper();

viewWrapper.setPageTitle("Contractors");
useHead({
  title: "Contractors - Ibex",
});
</script>

<template>
  <div class="page-content-inner">
    <ContractorsList />
  </div>
</template>
