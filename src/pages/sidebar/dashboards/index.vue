<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle(() => t('Dashboard'))

useHead(() => ({
  title: `${t('pages.dashboard-personnal-1.page-title')} - Sidebar - Arez`,
}))
</script>

<template>
  <div class="page-content-inner">
    <CompanyDashboard />
  </div>
</template>
