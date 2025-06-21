<script setup lang="ts">
import ProposalDetailComponent from "/@src/components/IbexJobsEstimates/LeadPropsalComponents/ProposalDetailComponent.vue";
import { useViewWrapper } from "/@src/stores/viewWrapper";
const viewWrapper = useViewWrapper();

viewWrapper.setPageTitle("Proposal Details");

useHead({
  title: "Proposal Details - Ibex",
});
</script>

<template>
  <div>
    <ProposalDetailComponent />
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
