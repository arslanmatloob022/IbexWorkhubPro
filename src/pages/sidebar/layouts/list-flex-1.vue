<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('List Flex 1')

useHead({
  title: 'List Flex 1 - Sidebar - Arez',
})
</script>

<template>
  <div class="page-content-inner">
    <FlexListV1 />
  </div>
</template>
