
<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Worker Info')

useHead({
  title: 'Workers - Arez',
})
</script>

<template>
   <div class="landing-page-wrapper">
      <div class="hero-body ">
        <div class="container">
      <WorkerMainSignup/>
      </div>
    </div>
  </div>
</template>