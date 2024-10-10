<route lang="yaml">
meta:
  requiresAuth: true
  isManagerAllowed: false
  # isPartnerAllowed: false
  # isContractorAllowed: false
  # isWorkerAllowed: false
  # isClientAllowed: false
</route>
<script setup lang="ts">
import { useViewWrapper } from "/@src/stores/viewWrapper";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const viewWrapper = useViewWrapper();
viewWrapper.setPageTitle("Payment Detail");

useHead(() => ({
  title: "Payments Detail",
}));
</script>

<template>
  <div class="page-content-inner">
    <PaymentDetails />
  </div>
</template>
