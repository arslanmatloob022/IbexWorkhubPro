<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Stock Dashboard')

useHead({
  title: 'Stock Dashboard - Sidebar - Arez',
})
</script>

<template>
  <div class="page-content-inner">
    <StockDashboard />
  </div>
</template>
