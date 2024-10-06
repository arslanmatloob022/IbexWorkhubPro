<script lang="ts" setup>
import { useViewWrapper } from "/@src/stores/viewWrapper";
const viewWrapper = useViewWrapper();
viewWrapper.setPageTitle("Ibex Payment");
useHead({
  title: "Ibex Payment",
});
</script>
<template>
  <div class="page-content-inner">
    <Teleport to="[data-teleport-bg]">
      <div class="lifestyle-dashboard-bg has-top-nav" />
    </Teleport>
    <IbexPaymentModule class="has-navbar-spacing" />
  </div>
</template>
