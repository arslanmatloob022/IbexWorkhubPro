<script setup lang="ts">
import ClientProjects from "./ClientProjects.vue";
import { useViewWrapper } from "/@src/stores/viewWrapper";
import { useUserSession } from "/@src/stores/userSession";
const viewWrapper = useViewWrapper();
viewWrapper.setPageTitle("Projects");
const userSession = useUserSession();
useHead({
  title: "Client Projects - Ibex",
});
</script>

<template>
  <div class="">
    <ClientProjects :clientId="userSession.user.id" />
  </div>
</template>
