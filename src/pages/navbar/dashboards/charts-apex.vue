<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Charts Apex')

useHead({
  title: 'Charts Apex - Navbar - Arez',
})
</script>

<template>
  <div class="page-content-inner">
    <ApexDashboard />
  </div>
</template>
