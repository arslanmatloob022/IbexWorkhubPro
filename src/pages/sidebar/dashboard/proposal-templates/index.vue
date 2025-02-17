<script setup lang="ts">
import LeadProposalsList from "/@src/components/IbexJobsEstimates/LeadPropsalComponents/LeadProposalsList.vue";
import { useViewWrapper } from "/@src/stores/viewWrapper";
const viewWrapper = useViewWrapper();
const templatesTab = ref<"proposalsTemplates" | "catalog">(
  "proposalsTemplates"
);
viewWrapper.setPageTitle("Proposals Templates");
useHead({
  title: "Proposals Templates - Ibex",
});
</script>

<template>
  <div>
    <!-- <LeadProposalsList :allProposal="true" /> -->
    <div class="tabs-wrapper">
      <div class="tabs-inner">
        <div class="tabs">
          <ul>
            <li
              :class="[
                templatesTab === 'proposalsTemplates'
                  ? 'is-active'
                  : 'not-active',
              ]"
            >
              <a
                tabindex="0"
                role="button"
                @keydown.space.prevent="templatesTab = 'proposalsTemplates'"
                @click="templatesTab = 'proposalsTemplates'"
                ><span>Templates</span></a
              >
            </li>
            <li
              :class="[templatesTab === 'catalog' ? 'is-active' : 'not-active']"
            >
              <a
                tabindex="0"
                role="button"
                @keydown.space.prevent="templatesTab = 'catalog'"
                @click="templatesTab = 'catalog'"
                ><span>Catalog</span></a
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="" v-if="templatesTab === 'proposalsTemplates'">
      <TemplatePropsalsList />
    </div>
    <div class="" v-if="templatesTab === 'catalog'">
      <CataLogList />
    </div>
  </div>
</template>

<style lang="scss">
.has-top-nav {
  .flex-list-wrapper,
  .list-flex-toolbar {
    max-width: 880px;
    margin-inline-end: auto;
    margin-inline-start: auto;
  }
}
</style>
