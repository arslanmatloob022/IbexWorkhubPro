<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Projects projects 3')

useHead({
  title: 'Projects projects 3 - Sidebar - Arez',
})
</script>

<template>
  <div class="page-content-inner">
    <ProjectsViewV3 />
  </div>
</template>
