<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Hobbies')

useHead({
  title: 'Hobbies - Sidebar - Arez',
})
</script>

<template>
  <div class="page-content-inner">
    <LifestyleDashboardV2 />
  </div>
</template>
