
<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Add Reference')

useHead({
  title: 'Reference - Arez',
})
</script>

<template>
   <div class="landing-page-wrapper">
      <div class="hero-body ">
        <div class="container">
      <AddReference/>
      </div>
    </div>
  </div>
</template>