<script lang="ts" setup>
import { useViewWrapper } from "/@src/stores/viewWrapper";
const viewWrapper = useViewWrapper();
viewWrapper.setPageTitle("Contractor Profile");
useHead({
  title: "Contractor - Ibex",
});
</script>
<template>
  <div class="page-content-inner">
    <ContractorProfile />
  </div>
</template>
<style lang="scss"></style>
