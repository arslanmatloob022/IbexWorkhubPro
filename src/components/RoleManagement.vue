<script setup lang="ts">
const data = [
  {
    title: "Full Admin",
    content: "Access to perform all actions on every item in Buildertrend.",
  },
  {
    title: "Project Manager",
    content:
      "Access to add and edit all job-related items except for Owner Invoicing and Internal Users and Subs. User will not have access to Sales items.",
  },
  {
    title: "Office Manager",
    content:
      "Access to add and edit most items in Buildertrend. User will not have access to Estimates or Warranty.",
  },
  {
    title: "Bookkeeper",
    content:
      "Access to all financials and accounting integrations as well as most job-related items. User will not have access to Sales, RFIs, Daily Logs, or Warranty.",
  },
  {
    title: "Selections Coordinator",
    content:
      "Access to cost and price information on Selections, POs, and COs. User will not have access to Owner Invoicing, Sales, Warranty, or Estimates.",
  },
  {
    title: "Warranty Coordinator",
    content:
      "Access to Warranty, To-Dos, and most communication items. User will not have access to Customer, Job, or Sub information.",
  },
  {
    title: "Architect",
    content:
      "Access to view COs and Selections without cost or price information as well as full access to most job-related items. User will not have access to Sales, Owner Invoicing, Warranty, or Estimates.",
  },
];
</script>

<template>
  <div class="column is-12">
    <VCollapse :items="data" with-chevron />
  </div>
</template>
