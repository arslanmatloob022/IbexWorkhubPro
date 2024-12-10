<script lang="ts" setup>
const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: null): void;
}>();

const props = defineProps<{
  workerTasksModal?: boolean;
  workerId?: string;
  workerName?: string;
}>();

const closeModalHandler = () => {
  emit("update:modalHandler", true);
};
</script>
<template>
  <VModal
    :open="props.workerTasksModal"
    :title="`${props.workerName} Tasks`"
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
