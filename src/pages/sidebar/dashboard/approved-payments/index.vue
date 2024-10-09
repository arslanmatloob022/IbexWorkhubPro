<route lang="yaml">
meta:
  requiresAuth: true
  isPartnerAllowed: false
  isManagerAllowed: false
  isContractorAllowed: false
  isWorkerAllowed: false
  isClientAllowed: false
</route>
<script setup lang="ts">
import { useViewWrapper } from "/@src/stores/viewWrapper";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const viewWrapper = useViewWrapper();
viewWrapper.setPageTitle("Approved Payments");

useHead(() => ({
  title: " Approved Payments",
}));
</script>

<template>
  <div class="page-content-inner">
    <ApprovedPayments />
  </div>
</template>
