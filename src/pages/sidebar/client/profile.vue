<script setup lang="ts">
import { useViewWrapper } from "/@src/stores/viewWrapper";

const viewWrapper = useViewWrapper();
viewWrapper.setPageTitle("Profile");

useHead({
  title: "Client Profile- Ibex",
});
</script>

<template>
  <div class="">
    <ClientProfile />
  </div>
</template>
