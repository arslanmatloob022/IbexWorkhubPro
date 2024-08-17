<script lang="ts" setup>
import { useViewWrapper } from "/@src/stores/viewWrapper";
const viewWrapper = useViewWrapper();
viewWrapper.setPageTitle("Partner Profile");
useHead({
  title: "Partner - Arez",
});
</script>
<template>
  <div class="page-content-inner">
    <SupplierProfile />
  </div>
</template>
<style lang="scss"></style>
