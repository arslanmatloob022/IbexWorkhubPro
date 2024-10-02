<script setup lang="ts">
import { useViewWrapper } from "/@src/stores/viewWrapper";

const viewWrapper = useViewWrapper();
viewWrapper.setPageTitle("Sub-Contractor Info");

useHead({
  title: "Sub-Contractor info - Ibex",
});
</script>

<template>
  <div class="">
    <IbexWorkerProfile />
  </div>
</template>
