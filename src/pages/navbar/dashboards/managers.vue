<script setup lang="ts">
import { useViewWrapper } from "/@src/stores/viewWrapper";

const viewWrapper = useViewWrapper();
viewWrapper.setPageTitle("Managers");

useHead({
  title: "Managers - Ibex",
});
</script>

<template>
  <div class="page-content-inner">
    <p>Managers</p>
  </div>
</template>
