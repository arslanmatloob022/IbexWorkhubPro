<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Projects Project 3')

useHead({
  title: 'Projects Projects 3 - Navbar - Arez',
})
</script>

<template>
  <div class="is-navbar-lg page-content-inner">
    <ProjectsViewV3 />
  </div>
</template>
