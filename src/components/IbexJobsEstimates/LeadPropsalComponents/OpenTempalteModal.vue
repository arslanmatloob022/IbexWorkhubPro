<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";

const api = useApi();
const notyf = useNotyf();
const templateList = ref<any[]>([]);
const selectedTemplateId = ref<string | null>(null);
const isLoading = ref(false);

const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: any): void;
}>();

const props = defineProps<{
  openTemplate?: boolean;
  proposalId?: string;
  leadId?: string;
}>();

const getTemplateList = async () => {
  isLoading.value = true;
  try {
    const response = await api.get(`/api/lead-proposal/templates/`);
    templateList.value = response.data;
  } catch (err) {
    notyf.error("Failed to fetch templates");
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

const closeModalHandler = () => {
  emit("update:modalHandler", false);
};

const confirmSelection = async () => {
  if (!selectedTemplateId.value) {
    notyf.error("Please select a template");
    return;
  }

  await handleTemplateSelection(selectedTemplateId.value);
};

const handleTemplateSelection = async (selectedTemplateId: string) => {
  try {
    const response = await api.post(
      `/api/lead-proposal/${selectedTemplateId}/import-template/`,
      {
        existing_proposal: props.proposalId || "",
        lead: props.leadId,
      }
    );

    // Emit only the relevant data
    emit("update:OnSuccess", response.data);
    console.log("test123");
    notyf.success("Template imported successfully!");
    closeModalHandler();
  } catch (err) {
    console.error("Error importing template:", err);
    notyf.error("Something went wrong, try again");
  }
};

onMounted(() => {
  getTemplateList();
});
</script>

<template>
  <VModal
    :open="props.openTemplate"
    size="big"
    title="Template List"
    actions="right"
    @close="closeModalHandler"
  >
    <template #content>
      <div v-if="isLoading" class="text-center py-4">Loading...</div>
      <div v-else>
        <table class="table is-striped is-fullwidth">
          <thead>
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Amount</th>
              <th scope="col">Cost Items</th>
              <th scope="col">Approval Deadline</th>
              <th scope="col">Status</th>
              <th scope="col" class="is-end">
                <div class="dark-inverted is-flex is-justify-content-flex-end">
                  Select
                </div>
              </th>
            </tr>
          </thead>
          <tbody v-if="templateList.length">
            <tr v-for="template in templateList" :key="template.id">
              <td>{{ template.title }}</td>
              <td>{{ template.proposalAmount }}</td>
              <td>{{ template.cost_items }}</td>
              <td>{{ template.approval_deadline }}</td>
              <td class="capitalize">{{ template.status }}</td>
              <td class="is-end">
                <div class="is-flex is-justify-content-flex-end">
                  <VControl raw subcontrol>
                    <VRadio
                      v-model="selectedTemplateId"
                      :value="template.id"
                      name="templateSelection"
                    />
                  </VControl>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
    <template #action>
      <VButton color="primary" raised @click="confirmSelection"
        >Confirm</VButton
      >
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
