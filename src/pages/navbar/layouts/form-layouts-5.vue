<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Form Layouts 5')

useHead({
  title: 'Form Layouts 5 - Navbar - Arez',
})
</script>

<template>
  <div class="page-content-inner">
    <FormLayoutStepper class="is-navbar" />
  </div>
</template>
