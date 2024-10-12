<!-- <route lang="yaml">
meta:
  requiresAuth: true
  isPartnerAllowed: true
</route> -->

<script setup lang="ts">
import WorkerSidebar from "/@src/layouts/WorkerSidebar.vue";
import { useLayoutSwitcher } from "/@src/stores/layoutSwitcher";

const layoutSwitcher = useLayoutSwitcher();
</script>

<template>
  <!-- Content Wrapper -->
  <WorkerSidebar
    v-bind="layoutSwitcher.dynamicLayoutProps"
    close-on-change
    default-sidebar="layout"
  >
    <RouterView v-slot="{ Component }">
      <Transition name="fade-fast" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </WorkerSidebar>
</template>
