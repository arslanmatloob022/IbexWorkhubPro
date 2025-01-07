<route lang="yaml">
meta:
  requiresAuth: true
</route>

<script setup lang="ts">
import { useLayoutSwitcher } from "/@src/stores/layoutSwitcher";
import { useViewWrapper } from "/@src/stores/viewWrapper";

const layoutSwitcher = useLayoutSwitcher();
const viewWrapper = useViewWrapper();
viewWrapper.setPageTitle("Leads");

useHead(() => ({
  title: "Leads",
}));
</script>

<template>
  <div>This is the leads view</div>
</template>
