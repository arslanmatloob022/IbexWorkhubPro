<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'


const viewWrapper = useViewWrapper()



viewWrapper.setPageTitle('Job Placements');
useHead({
  title: 'Job Placements - Arez',
})
</script>

<template>
  <div class="page-content-inner">
    <jobPlacement />
  </div>
</template>