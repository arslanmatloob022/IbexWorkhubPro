<script setup lang="ts">
import { useViewWrapper } from "/@src/stores/viewWrapper";

const viewWrapper = useViewWrapper();
viewWrapper.setPageTitle("Rota - Ibex");

useHead({
  title: "Rota - Ibex",
});
</script>

<template>
  <div class="page-content-inner">
    <RotaDetails />
  </div>
</template>
