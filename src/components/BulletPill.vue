<route lang="yaml">
    meta:
      requiresAuth: true
    </route>
    
    <script setup lang="ts">
import { useLayoutSwitcher } from "/@src/stores/layoutSwitcher";
import { useViewWrapper } from "/@src/stores/viewWrapper";
</script>  
<template>
  <span class="pill"></span>
</template>  
<style lang="scss" scoped>
.pill {
  background-color: var(--primary);
  padding: 2px 4px 2px 4px;
  border-radius: 10px;
  margin-right: 12px;
}
</style>