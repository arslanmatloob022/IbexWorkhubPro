<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

type TabId = 'all' | 'saved'
const activeTab = ref<TabId>('all')

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('List View 4')

useHead({
  title: 'List View 4 - Sidebar - Arez',
})
</script>

<template>
  <div class="tabs-wrapper is-slider is-squared is-inverted">
    <div class="page-content-inner">
      <ViewListV4 :active-tab="activeTab" />
    </div>
  </div>
</template>
