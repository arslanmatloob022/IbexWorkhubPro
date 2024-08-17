<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Widgets Creative')

useHead({
  title: 'Widgets Creative - Sidebar - Arez',
})
</script>

<template>
  <div class="page-content-inner">
    <WidgetsCreative />
  </div>
</template>
