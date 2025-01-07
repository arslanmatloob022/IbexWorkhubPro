<route lang="yaml">
meta:
  requiresAuth: true
</route>

<script setup lang="ts">
import { useLayoutSwitcher } from "/@src/stores/layoutSwitcher";
import { useViewWrapper } from "/@src/stores/viewWrapper";

const layoutSwitcher = useLayoutSwitcher();
const viewWrapper = useViewWrapper();
viewWrapper.setPageTitle("Settings");

useHead(() => ({
  title: "Settings",
}));
</script>

<template>
  <div>This is the settings view</div>
</template>
