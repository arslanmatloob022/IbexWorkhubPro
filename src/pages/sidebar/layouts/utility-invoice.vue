<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Utility Invoice')

useHead({
  title: 'Utility Invoice - Sidebar - Arez',
})
</script>

<template>
  <div class="page-content-inner">
    <Invoice />
  </div>
</template>
