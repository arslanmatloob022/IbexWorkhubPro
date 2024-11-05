<script setup lang="ts">
import { useViewWrapper } from "/@src/stores/viewWrapper";

const viewWrapper = useViewWrapper();
viewWrapper.setPageTitle("Privacy policy");
const htmlContent = ref("");

useHead({
  title: "Ibex Privacy policy",
});
onMounted(async () => {
  try {
    const response = await fetch("/PrivacyPolicy.html");
    htmlContent.value = await response.text();
  } catch (error) {
    console.error("Error loading HTML file:", error);
    htmlContent.value = "<p>Could not load content.</p>";
  }
});
</script>

<template>
  <div class="page-content-inner">
    <!-- <Teleport to="[data-teleport-bg]">
      <div class="lifestyle-dashboard-bg has-top-nav" />
    </Teleport> -->
    <div v-html="htmlContent"></div>
  </div>
</template>
]
