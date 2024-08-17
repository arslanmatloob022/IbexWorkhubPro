<script lang="ts" setup>
import { useViewWrapper } from "/@src/stores/viewWrapper";

const viewWrapper = useViewWrapper();
viewWrapper.setPageTitle("Dashboard");
useHead({
  title: "Partner - Arez",
});
</script>
<template>
  <div class="page-content-inner">
    <SupplierDashboardTwo></SupplierDashboardTwo>
  </div>
</template>
<style lang="scss"></style>
