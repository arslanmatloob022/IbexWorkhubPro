<script setup lang="ts">
import { useViewWrapper } from "/@src/stores/viewWrapper";
import { useUserSession } from "/@src/stores/userSession";

const userSession = useUserSession();
const viewWrapper = useViewWrapper();
viewWrapper.setPageTitle("Tasks");

useHead({
  title: "Worker Tasks - Ibex",
});
</script>

<template>
  <div class="">
    <VTabs
      selected="tasks"
      :tabs="[
        { label: 'Tasks View', value: 'tasks' },
        { label: 'Chronic view', value: 'chronic' },
      ]"
    >
      <template #tab="{ activeValue }">
        <div v-if="activeValue === 'chronic'">
          <ChronicTasksView :userId="userSession.user.id" />
        </div>
        <div v-else-if="activeValue === 'tasks'">
          <WorkerTasks />
        </div>
      </template>
    </VTabs>
  </div>
</template>
