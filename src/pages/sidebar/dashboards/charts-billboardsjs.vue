<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Charts BillboardJS')

useHead({
  title: 'Charts BillboardJS - Sidebar - Arez',
})
</script>

<template>
  <div class="page-content-inner">
    <BillboardJsDashboard />
  </div>
</template>
