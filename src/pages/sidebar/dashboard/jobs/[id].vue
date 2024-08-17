<script setup lang="ts">
import { useViewWrapper } from "/@src/stores/viewWrapper";

const viewWrapper = useViewWrapper();
viewWrapper.setPageTitle("Job Info");

useHead({
  title: "Jobs - Arez",
});
</script>

<template>
  <div>
    <JobsForms />
  </div>
</template>
