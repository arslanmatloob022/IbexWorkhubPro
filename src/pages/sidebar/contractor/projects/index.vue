<script setup lang="ts">
import { useUserSession } from "/@src/stores/userSession";
import { useViewWrapper } from "/@src/stores/viewWrapper";

const userSession = useUserSession();
const viewWrapper = useViewWrapper();
viewWrapper.setPageTitle("My Projects");

useHead({
  title: "Manager Projects - Ibex",
});
</script>

<template>
  <div class="">
    <ContractorProjects :contractor-id="userSession.user.id" />
  </div>
</template>
