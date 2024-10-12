<script setup lang="ts">
import { useViewWrapper } from "/@src/stores/viewWrapper";

const viewWrapper = useViewWrapper();
viewWrapper.setPageTitle("My Projects");

useHead({
  title: "Manager Projects - Ibex",
});
</script>

<template>
  <div class="">
    <ProjectManagerCalendar />
  </div>
</template>
