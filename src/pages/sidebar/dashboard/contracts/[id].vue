<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Contract Info')

useHead({
  title: 'Contract - Arez',
})
</script>

<template>
  <div class="">
    <CompaniesDetails/>
  </div>
</template>