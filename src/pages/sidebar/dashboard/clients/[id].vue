<script setup lang="ts">
import { useViewWrapper } from "/@src/stores/viewWrapper";

const viewWrapper = useViewWrapper();
viewWrapper.setPageTitle("Client Info");

useHead({
  title: "Client - Ibex",
});
</script>

<template>
  <div class="">
    <ClientProfile />
  </div>
</template>
