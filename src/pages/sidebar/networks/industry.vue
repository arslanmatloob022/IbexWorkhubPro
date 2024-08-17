<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Industries')

useHead({
  title: 'Industry - Arez',
})
</script>

<template>
  <div class="page-content-inner">
    
    <Industries/>
  </div>
</template>