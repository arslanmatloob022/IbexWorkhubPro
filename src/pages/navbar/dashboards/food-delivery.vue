<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Apps 1')

useHead({
  title: 'Apps 1 - Navbar - Arez',
})
</script>

<template>
  <div class="page-content-inner">
    <FoodDeliveryApp />
  </div>
</template>
