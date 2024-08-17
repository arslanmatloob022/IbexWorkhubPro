<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('HR Dashboard')

useHead({
  title: 'HR Dashboard - Sidebar - Arez',
})
</script>

<template>
  <div class="page-content-inner">
    <HumanRessourcesDashboard />
  </div>
</template>
