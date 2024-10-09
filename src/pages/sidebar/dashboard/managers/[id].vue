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
viewWrapper.setPageTitle("Manager Info");

useHead({
  title: "Manager - Ibex",
});
</script>

<template>
  <div class="">
    <ContractorProfile />
  </div>
</template>
