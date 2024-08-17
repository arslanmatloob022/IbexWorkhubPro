<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Kanban Board')

useHead({
  title: 'Kanban Board - Sidebar - Arez',
})
</script>

<template>
  <div class="page-content-inner">
    <KanbanApp />
  </div>
</template>
