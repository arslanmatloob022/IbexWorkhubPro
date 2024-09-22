<script setup lang="ts">
import { useViewWrapper } from "/@src/stores/viewWrapper";

const viewWrapper = useViewWrapper();
viewWrapper.setPageTitle("Worker Info");

useHead({
  title: "Worker info - Ibex",
});
</script>

<template>
  <div class="">
    <IbexWorkerProfile />
  </div>
</template>
