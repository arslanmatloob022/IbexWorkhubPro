<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Profile Edit 4')

useHead({
  title: 'Profile Edit 4 - Sidebar - Arez',
})
</script>

<template>
  <EditProfileSettings />
</template>
