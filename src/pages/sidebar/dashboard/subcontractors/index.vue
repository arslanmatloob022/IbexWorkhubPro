<script setup lang="ts">
import { useViewWrapper } from "/@src/stores/viewWrapper";

const viewWrapper = useViewWrapper();
viewWrapper.setPageTitle("Sub Contractors");

useHead({
  title: "Ibex Sub Contractors",
});
</script>
<template>
  <div>
    <!-- <IbexSupplier /> -->
    <!-- the -->
    <IbexSubContractors />
  </div>
</template>
