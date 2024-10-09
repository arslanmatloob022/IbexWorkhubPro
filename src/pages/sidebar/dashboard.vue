<route lang="yaml">
meta:
  requiresAuth: true
  isPartnerAllowed: false
  isManagerAllowed: false
  isContractorAllowed: false
  isWorkerAllowed: false
  isClientAllowed: false
</route>

<script setup lang="ts">
import { useLayoutSwitcher } from "/@src/stores/layoutSwitcher";
const layoutSwitcher = useLayoutSwitcher();
</script>

<template>
  <component
    :is="layoutSwitcher.dynamicLayoutComponent as any"
    v-bind="layoutSwitcher.dynamicLayoutProps"
    close-on-change
    default-sidebar="networks"
  >
    <!-- Content Wrapper -->
    <RouterView v-slot="{ Component }">
      <Transition name="fade-fast" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </component>
</template>
