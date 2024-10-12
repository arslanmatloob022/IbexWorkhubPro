<script setup lang="ts">
import { useViewWrapper } from "/@src/stores/viewWrapper";

const viewWrapper = useViewWrapper();
viewWrapper.setPageTitle("Calendar View");

useHead({
  title: "Tasks Calendar- Ibex",
});
</script>

<template>
  <div class="">
    <WorkerCalendar />
  </div>
</template>
