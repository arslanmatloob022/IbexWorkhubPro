<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Grid Tiles 1')

useHead({
  title: 'Grid Tiles 1 - Navbar - Arez',
})
</script>

<template>
  <div class="page-content-inner">
    <TilesGridV1 />
  </div>
</template>
