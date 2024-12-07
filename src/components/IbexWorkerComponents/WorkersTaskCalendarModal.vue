<script lang="ts" setup>
const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: null): void;
}>();

const props = defineProps<{
  workerTasksModal?: boolean;
  workerId?: string;
}>();

const closeModalHandler = () => {
  emit("update:modalHandler", true);
};
</script>
<template>
  <VModal
    v-if="props.workerTasksModal"
    :open="props.workerTasksModal"
    title="Task Info"
    actions="right"
    size="xl"
    @close="closeModalHandler"
  >
    <template #content>
      <WorkerCalendar :workerId="props.workerId" />
    </template>
    <template #action>
      <VButton style="display: none" color="primary" raised> Confirm </VButton>
    </template>
    <template #cancel>
      <VButton @click="closeModalHandler" raised> Close </VButton>
    </template>
  </VModal>
</template>
