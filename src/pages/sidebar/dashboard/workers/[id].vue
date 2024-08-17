<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Worker Info')

useHead({
  title: 'Workers - Arez',
})
</script>

<template>
  <div class="">
    <Teleport to="[data-teleport-bg]">
      <div class="lifestyle-dashboard-bg" />
    </Teleport>
    <WorkerProfile/>
  </div>
</template>