<script setup lang="ts">
import LeadProposalsList from "/@src/components/IbexJobsEstimates/LeadPropsalComponents/LeadProposalsList.vue";
import { useViewWrapper } from "/@src/stores/viewWrapper";
const viewWrapper = useViewWrapper();

viewWrapper.setPageTitle("Lead Proposals");
useHead({
  title: "Lead Proposals - Ibex",
});
</script>

<template>
  <div>
    <LeadProposalsList :allProposal="true" />
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
