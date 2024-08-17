<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Company Info')

useHead({
  title: 'Companies - Arez',
})
</script>

<template>
  <div class="page-content-inner">
    
    <CompanyProfile/>
  </div>
</template>