<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('List View 4')

useHead({
  title: 'List View 4 - Navbar - Arez',
})
</script>

<template>
  <div
    class="page-content is-relative tabs-wrapper is-slider is-squared is-inverted is-navbar-lg"
  >
    <div class="page-content-inner">
      <ViewListV4 />
    </div>
  </div>
</template>
