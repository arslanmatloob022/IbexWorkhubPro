<script setup lang="ts">
import LeadProposalsList from "/@src/components/IbexJobsEstimates/LeadPropsalComponents/LeadProposalsList.vue";
import { useViewWrapper } from "/@src/stores/viewWrapper";
const viewWrapper = useViewWrapper();
const templatesTab = ref<"proposalsTemplates" | "catalog" | "calculations">(
  "proposalsTemplates"
);
viewWrapper.setPageTitle("Templates & Catalogs");
useHead({
  title: "Templates & Catalogs - Ibex",
});
</script>

<template>
  <div>
    <!-- <LeadProposalsList :allProposal="true" /> -->
    <div class="tabs-wrapper">
      <div class="tabs-inner">
        <div class="tabs is-boxed">
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
                ><span>Proposal Templates</span></a
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
                ><span>Cost Catalogs</span></a
              >
            </li>
            <li
              :class="[
                templatesTab === 'calculations' ? 'is-active' : 'not-active',
              ]"
            >
              <a
                tabindex="0"
                role="button"
                @keydown.space.prevent="templatesTab = 'calculations'"
                @click="templatesTab = 'calculations'"
                ><span>Calculations Template</span></a
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
    <div class="" v-if="templatesTab === 'calculations'">
      <CalculationsTemplates />
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
