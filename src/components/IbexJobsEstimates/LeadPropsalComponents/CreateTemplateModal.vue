<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";

const api = useApi();
const notyf = useNotyf();
const templateList = ref<any[]>([]);
const selectedTemplateId = ref<string | null>(null);
const isLoading = ref(false);
const templateTitle = ref("");

const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: string | null): void;
}>();

const props = defineProps<{
  openCreateTemplate?: boolean;
  proposalId?: string;
  leadId?: string;
}>();

const closeModalHandler = () => {
  emit("update:modalHandler", false);
};

const handleTemplateSelection = async () => {
  console.log(selectedTemplateId);
  try {
    const response = await api.post(
      `/api/lead-proposal/${props.proposalId}/create-template/`,
      {
        title: templateTitle.value,
      }
    );

    notyf.success("Template Create successfully!");
    closeModalHandler();
  } catch (err) {
    console.error("Error importing template:", err);
    notyf.error("Something went wrong, try again");
  }
};

onMounted(() => {});
</script>

<template>
  <VModal
    :open="props.openCreateTemplate"
    size="small"
    is="form"
    title="Create Template"
    actions="right"
    @submit.prevent="handleTemplateSelection"
    @close="closeModalHandler"
  >
    <template #content>
      <VField label="Enter title to identify your saved template">
        <VControl>
          <VInput
            required
            v-model="templateTitle"
            type="text"
            placeholder=" Template Title"
          />
        </VControl>
      </VField>
    </template>
    <template #action>
      <VButton color="primary" type="submit" raised>Confirm</VButton>
    </template>
    <template #cancel>
      <VButton color="primary" style="display: none" raised>Close</VButton>
    </template>
  </VModal>
</template>

<style scoped>
th,
td {
  text-align: left;
}
</style>
