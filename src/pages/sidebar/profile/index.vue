


<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Profile')

useHead({
  title: 'Companies - Arez',
})
</script>

<template>
   <div class="page-content-inner">
    <Teleport to="[data-teleport-bg]">
      <div class="lifestyle-dashboard-bg has-top-nav" />
    </Teleport>

    <PersonalProfileNew class="has-navbar-spacing" />

  </div>
</template>