<script setup lang="ts">
import { useViewWrapper } from "/@src/stores/viewWrapper";

const viewWrapper = useViewWrapper();

viewWrapper.setPageTitle("Service Partners");
useHead({
  title: "Service Partners - Ibex",
});
</script>

<template>
  <div class="page-content-inner">
    <ServicePartners />
  </div>
</template>
