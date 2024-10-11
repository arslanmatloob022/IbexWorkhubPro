<!-- <route lang="yaml">
meta:
  requiresAuth: true
  isManagerAllowed: true
  # isPartnerAllowed: false
  # isContractorAllowed: false
  # isWorkerAllowed: false
  # isClientAllowed: false
</route> -->

<script setup lang="ts">
import { useViewWrapper } from "/@src/stores/viewWrapper";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const viewWrapper = useViewWrapper();
viewWrapper.setPageTitle("Ibex Builders Studios");

useHead(() => ({
  title: "Ibex Builders Studios",
}));
</script>

<template>
  <div class="page-content-inner">
    <IbexDashboard />
  </div>
</template>
