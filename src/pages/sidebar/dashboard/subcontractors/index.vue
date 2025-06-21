<script setup lang="ts">
import { useViewWrapper } from "/@src/stores/viewWrapper";

const viewWrapper = useViewWrapper();
viewWrapper.setPageTitle("Company Subcontractors");

useHead({
  title: "Ibex Subcontractors",
});
</script>
<template>
  <div>
    <IbexSubContractors />
  </div>
</template>
