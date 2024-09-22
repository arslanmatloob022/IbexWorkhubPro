<script setup lang="ts">
import { useViewWrapper } from "/@src/stores/viewWrapper";

const viewWrapper = useViewWrapper();

viewWrapper.setPageTitle("Contractors");
useHead({
  title: "Contractors - Ibex",
});
</script>

<template>
  <div class="page-content-inner">
    <ServicePartners />
  </div>
</template>
