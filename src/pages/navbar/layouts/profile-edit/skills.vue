<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Profile Edit 3')

useHead({
  title: 'Profile Edit 3 - Sidebar - Arez',
})
</script>

<template>
  <EditProfileSkills />
</template>
