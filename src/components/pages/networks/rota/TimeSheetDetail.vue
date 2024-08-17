<script setup lang="ts">
import { ref, onMounted, shallowRef, watch } from "vue";
import { useApi, useDeviceApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { useThemeColors } from "/@src/composable/useThemeColors";

const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
}>();
const props = defineProps<{
  timeSheetDetailModal: boolean;
  timesheetId: string | number;
}>();

const closeModalHandler = () => {
  emit("update:modalHandler", false); // Emit an event to update the prop
};

onMounted(() => {});
</script>

<template>
  <VModal
    :open="props.timeSheetDetailModal"
    title="Worker Activity"
    size="xl"
    actions="right"
    @close="closeModalHandler"
  >
    <template #content>
      <TimeSheetComponent :timesheetId="props.timesheetId" />
    </template>
    <template #action> </template>
    <template #cancel>
      <button style="display: none">close</button>
    </template>
  </VModal>
</template>
