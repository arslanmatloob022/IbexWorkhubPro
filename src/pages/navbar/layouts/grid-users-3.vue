<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

type TabId = 'all' | 'team'
const activeTab = ref<TabId>('all')

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Grid Users 3')

useHead({
  title: 'Grid Users 3 - Navbar - Arez',
})
</script>

<template>
  <div class="page-content-inner">
    <UsersGridV3 :active-tab="activeTab" />
  </div>
</template>
