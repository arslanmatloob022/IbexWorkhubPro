<route lang="yaml">
meta:
  requiresAuth: true
</route>
<script setup lang="ts">
import { useLayoutSwitcher } from "/@src/stores/layoutSwitcher";
import { useViewWrapper } from "/@src/stores/viewWrapper";
const layoutSwitcher = useLayoutSwitcher();
const viewWrapper = useViewWrapper();
viewWrapper.setPageTitle("Company Settings");

useHead(() => ({
  title: "Company Settings",
}));
</script>

<template>
  <div>
    <CompanySettingsComponent></CompanySettingsComponent>
  </div>
</template>

<style scoped lang="scss"></style>
