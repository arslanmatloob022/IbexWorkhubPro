<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Rota')

useHead({
  title: 'Rota - Arez',
})
</script>

<template>
  <div class="page-content-inner">
    <RotaDetails />
  </div>
</template>