<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Video Dashboard')

useHead({
  title: 'Video Dashboard - Sidebar - Arez',
})
</script>

<template>
  <div class="page-content-inner">
    <LifestyleDashboardV5 />
  </div>
</template>
