<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'


const viewWrapper = useViewWrapper()



viewWrapper.setPageTitle('Customer Companies');
useHead({
  title: 'Customer Companies - Arez',
})
</script>

<template>
  <div class="page-content-inner">
    <CustomerCompanies />
  </div>
</template>