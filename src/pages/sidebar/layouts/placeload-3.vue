<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Placeload Grid')

useHead({
  title: 'Placeload Grid - Sidebar - Arez',
})
</script>

<template>
  <div class="page-content-inner">
    <PlaceloadV3 />
  </div>
</template>
