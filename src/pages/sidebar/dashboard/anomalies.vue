<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Compliance Anomalies ( Workers )')

useHead({
  title: 'Worker Anomalies - Arez',
})

</script>

<template>
  <div class="page-content-inner">
    <WorkerAnomalies />
  </div>
</template>