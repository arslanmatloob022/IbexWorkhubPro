<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Jobs')

useHead({
  title: 'Jobs Dashboard - Sidebar - Arez',
})
</script>

<template>
  <div class="page-content-inner">
    <JobsDashboard />
  </div>
</template>
