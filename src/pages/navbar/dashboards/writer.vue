<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Lifestyle 4')

useHead({
  title: 'Lifestyle 4 - Navbar - Arez',
})
</script>

<template>
  <div class="page-content-inner">
    <LifestyleDashboardV4 />
  </div>
</template>
