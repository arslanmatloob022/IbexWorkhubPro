<script setup lang="ts">
import { useMarkdownToc } from '/@src/composable/useMarkdownToc'
import { useViewWrapper } from '/@src/stores/viewWrapper'

const markdownContainer = ref<HTMLElement>()
const toc = useMarkdownToc(markdownContainer)

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('VProgress')

useHead({
  title: 'VProgress - Elements - Arez',
})
</script>

<template>
  <div class="page-content-inner">
    <VBreadcrumb
      with-icons
      separator="bullet"
      :items="[
        {
          label: 'Arez',
          hideLabel: true,
          icon: 'feather:home',
          to: '/',
        },
        {
          label: 'Elements',
          to: '/elements/',
        },
        {
          label: 'VProgess',
          to: '/elements/progress',
        },
      ]"
    />

    <div class="columns">
      <div
        ref="markdownContainer"
        :class="[toc.length > 0 ? 'is-9' : 'is-12']"
        class="column doc-column stay-focus-container"
      >
        <!--VProgress-->
        <VProgressBaseDocumentation />

        <!--VProgress colors-->
        <VProgressColorsDocumentation />

        <!--VProgress undeterminate-->
        <VProgressUndeterminateDocumentation />

        <!--Props-->
        <VProgressPropsDocumentation />
      </div>
      <div
        v-if="toc.length"
        class="column is-3 toc-column"
      >
        <DocumentationToc :toc="toc" />
      </div>
    </div>
  </div>
</template>
