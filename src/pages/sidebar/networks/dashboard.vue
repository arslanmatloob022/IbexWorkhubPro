<script setup lang="ts">
import { useViewWrapper } from "/@src/stores/viewWrapper";
import { useUserSession } from "/@src/stores/userSession";
const userSession = useUserSession();
const viewWrapper = useViewWrapper();
viewWrapper.setPageTitle("Dashboard");

useHead({
  title: "Dashboard - Arez",
});
</script>

<template>
  <div class="page-content-inner">
    <SuperAdminDashboard
      v-if="userSession.user && userSession.user.is_superuser"
    />
    <AdminDashboard
      v-else-if="userSession.user && userSession.user.is_active"
    />
  </div>
</template>
