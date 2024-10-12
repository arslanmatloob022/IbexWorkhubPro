<script setup lang="ts">
import ContractorProjectsCalendar from "./projects/ContractorProjectsCalendar.vue";
import { useViewWrapper } from "/@src/stores/viewWrapper";

const viewWrapper = useViewWrapper();
viewWrapper.setPageTitle("My Projects");

useHead({
  title: "Manager Projects - Ibex",
});
</script>

<template>
  <div class="">
    <ContractorProjectsCalendar />
  </div>
</template>
