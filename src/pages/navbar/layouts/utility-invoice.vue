<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Utility Invoice')

useHead({
  title: 'Utility Invoice - Navbar - Arez',
})
</script>

<template>
  <div class="page-content-inner">
    <Invoice class="is-navbar" />
  </div>
</template>
