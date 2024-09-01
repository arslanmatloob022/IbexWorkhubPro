<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Partner Info')

useHead({
  title: 'Partners - Arez',
})
</script>

<template>
  <div class="">
    <SupplierProfile/>
  </div>
</template>