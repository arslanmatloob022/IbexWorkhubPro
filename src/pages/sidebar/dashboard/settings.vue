<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Company Settings')

useHead({
  title: 'Company Settings - Arez',
})
</script>

<template>
  <div class="page-content-inner">
    <CompanyProfile />
  </div>
</template>