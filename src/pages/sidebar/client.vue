<script setup lang="ts">
import { useLayoutSwitcher } from "/@src/stores/layoutSwitcher";

const layoutSwitcher = useLayoutSwitcher();
</script>

<template>
  <!-- Content Wrapper -->
  <ClientSidebar
    v-bind="layoutSwitcher.dynamicLayoutProps"
    close-on-change
    default-sidebar="layout"
  >
    <RouterView v-slot="{ Component }">
      <Transition name="fade-fast" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </ClientSidebar>
</template>
