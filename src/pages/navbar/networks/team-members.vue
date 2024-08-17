<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Team Members')

useHead({
  title: 'Team Members - Arez',
})
</script>

<template>
  <div class="page-content-inner">
    
    <TeamMembaresDashboard/>
  </div>
</template>