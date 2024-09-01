<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Companies Info')

useHead({
  title: 'Companies - Arez',
})
</script>

<template>
  <div class="">
    <CompaniesDetails/>
  </div>
</template>