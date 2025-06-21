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
viewWrapper.setPageTitle("Ibex Managers ");

useHead({
  title: "Ibex Managers ",
});
</script>

<template>
  <div>
    <IbexManagers />
  </div>
</template>
