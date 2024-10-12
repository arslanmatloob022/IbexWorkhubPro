<script setup lang="ts">
import { useViewWrapper } from "/@src/stores/viewWrapper";

const viewWrapper = useViewWrapper();
viewWrapper.setPageTitle("Profile");

useHead({
  title: "Worker Profile- Ibex",
});
</script>

<template>
  <div class="">
    <ManagerProfile />
  </div>
</template>
