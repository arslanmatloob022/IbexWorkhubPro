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
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const viewWrapper = useViewWrapper();
viewWrapper.setPageTitle("Payments");

useHead(() => ({
  title: "Payments",
}));
</script>

<template>
  <div class="page-content-inner">
    <IbexPaymentsList />
  </div>
</template>
