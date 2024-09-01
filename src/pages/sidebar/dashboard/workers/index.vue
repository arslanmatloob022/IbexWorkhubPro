<script setup lang="ts">
import { useViewWrapper } from "/@src/stores/viewWrapper";
const route = useRoute();

const viewWrapper = useViewWrapper();
let title = "Workers";

// watch(
//   () => route.fullPath,
//   async (newFullPath, oldFullPath) => {
//     title = 'Workers'; // Reset title
//     if (route.query.type) {
//       title = `Workers (${route.query.type})`;
//     } else if (route.query.archive) {
//       title = 'Workers (Archived)';
//     }
//     viewWrapper.setPageTitle(title);
//   }
// );

// Initial title setting
if (route.query.type) {
  title = `Workers (${route.query.type})`;
} else if (route.query.archive) {
  title = "Workers (In-Active)";
}
viewWrapper.setPageTitle(title);
useHead({
  title: "Workers - Ibex",
});
</script>

<template>
  <div class="page-content-inner">
    <IbexWorkers />
  </div>
</template>
