<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Action Page')

useHead({
  title: 'Action Page - Sidebar - Arez',
})
</script>

<template>
  <div class="page-content-inner">
    <ActionPageV1 />
  </div>
</template>
