<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Form Layouts 3')

useHead({
  title: 'Form Layouts 3 - Navbar - Arez',
})
</script>

<template>
  <div class="page-content-inner">
    <FormLayoutSeparate />
  </div>
</template>
