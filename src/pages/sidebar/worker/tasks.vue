<script setup lang="ts">
import { useViewWrapper } from "/@src/stores/viewWrapper";

const viewWrapper = useViewWrapper();
viewWrapper.setPageTitle("Tasks");

useHead({
  title: "Worker Tasks - Ibex",
});
</script>

<template>
  <div class="">
    <WorkerTasks />
  </div>
</template>
