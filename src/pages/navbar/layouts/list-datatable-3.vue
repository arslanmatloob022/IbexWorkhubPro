<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Table List 3')

useHead({
  title: 'Table List 3 - Navbar - Arez',
})
</script>

<template>
  <div class="page-content-inner">
    <TableListV3 />
  </div>
</template>
