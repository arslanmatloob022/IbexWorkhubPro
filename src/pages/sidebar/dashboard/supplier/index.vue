<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'


const viewWrapper = useViewWrapper()



viewWrapper.setPageTitle('Service Partners');
useHead({
  title: 'Service Partners - Arez',
})
</script>

<template>
  <div class="page-content-inner">
    <CompanySupplier/>
  </div>
</template>