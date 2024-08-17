<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Profile Edit 2')

useHead({
  title: 'Profile Edit 2 - Sidebar - Arez',
})
</script>

<template>
  <EditProfileExperience />
</template>
