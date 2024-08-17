
<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Partner Signup')

useHead({
  title: 'Service Partner - Arez',
})
</script>

<template>
   <div class="landing-page-wrapper">
      <div class="hero-body ">
        <div class="container">
      <PartnerSignup/>
      </div>
    </div>
  </div>
</template>