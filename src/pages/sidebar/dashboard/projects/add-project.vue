<script setup lang="ts">
import { useViewWrapper } from "/@src/stores/viewWrapper";

const viewWrapper = useViewWrapper();
viewWrapper.setPageTitle("Add New Project");

useHead({
  title: "Add project - Ibex",
});
</script>

<template>
  <div class="page-content-inner">
    <Teleport to="[data-teleport-bg]">
      <div class="lifestyle-dashboard-bg has-top-nav" />
    </Teleport>
    <AddNewProject class="has-navbar-spacing" />
  </div>
</template>
