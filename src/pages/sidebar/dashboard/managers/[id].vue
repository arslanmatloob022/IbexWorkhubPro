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

const viewWrapper = useViewWrapper();
viewWrapper.setPageTitle("Manager Info");

useHead({
  title: "Manager Info - Ibex",
});
</script>

<template>
  <div class="">
    <ManagerProfile />
  </div>
</template>
