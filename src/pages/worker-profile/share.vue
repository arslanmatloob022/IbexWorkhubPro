
<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Worker profile')

useHead({
  title: 'Worker Profile - Arez',
})
</script>

<template>
   <div class="landing-page-wrapper">
      <div class="hero-body ">
        <div class="container">
      <ShareWorkerProfile/>
      </div>
    </div>
  </div>
</template>