<script setup lang="ts">
import { useNotyf } from "/@src/composable/useNotyf";
import { useApi } from "/@src/composable/useAPI";
import { generalUnits } from "../../IbexJobsEstimates/estimatesScripts";
const api = useApi();
const loading = ref(false);
const notyf = useNotyf();
const mailLoading = ref(false);

const props = defineProps<{
  addUpdateCostType?: boolean;
  typeId?: string;
  codeCategoryId?: string;
  parentCodeId?: string;
  CategoryMode?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: null): void;
}>();

const closeModalHandler = () => {
  emit("update:modalHandler", false);
};

const updateOnSuccessHandler = () => {
  emit("update:OnSuccess", null);
};
const costTypeFormData = ref({
  id: "",
  title: "",
  value: "",
  description: "",
  is_active: true,
  created_at: "",
  updated_at: "",
});

const addUpdateCostTypeHandler = async () => {
  try {
    mailLoading.value = true;
    costTypeFormData.value.value = costTypeFormData.value.title?.toLowerCase();
    if (props.typeId) {
      const response = await api.patch(
        `/api/cost-types/${props.typeId}/`,
        costTypeFormData.value
      );
      notyf.info("Cost code updated successfully");
    } else {
      const response = await api.post(
        `/api/cost-types/`,
        costTypeFormData.value
      );
      notyf.success("Cost code created successfully");
    }
    updateOnSuccessHandler();
    closeModalHandler();
  } catch (err) {
    console.log(err);
  } finally {
    mailLoading.value = false;
  }
};

const getCostCodeInfoHandler = async () => {
  try {
    mailLoading.value = true;
    const response = await api.get(`/api/cost-types/${props.typeId}/`);
    costTypeFormData.value = response.data;
  } catch (err) {
    console.log(err);
  } finally {
    mailLoading.value = false;
  }
};
const categoriesList = ref([
  {
    id: "",
    name: "",
    description: "",
    created_at: "",
    updated_at: "",
    trade: "",
  },
]);

onMounted(() => {
  if (props.typeId) {
    getCostCodeInfoHandler();
  }
});
</script>
<template>
  <VModal
    is="form"
    :open="props.addUpdateCostType"
    title="Cost Type"
    size="small"
    actions="right"
    @submit.prevent="addUpdateCostTypeHandler"
    @close="closeModalHandler"
  >
    <template #content>
      <div class="modal-form columns is-multiline">
        <div class="column is-8">
          <div class="field">
            <label class="label">Cost Type </label>
            <div class="control">
              <input
                type="text"
                required
                class="input"
                placeholder="Type e.g Labor"
                v-model="costTypeFormData.title"
              />
            </div>
          </div>
        </div>
        <div class="column is-4">
          <VControl class="mt-5" raw subcontrol>
            <VCheckbox
              v-model="costTypeFormData.is_active"
              label="Active"
              color="info"
            />
          </VControl>
        </div>
        <hr />
        <div class="column is-12">
          <div class="field">
            <label class="label">Description (Optional)</label>
            <VField>
              <VControl>
                <VTextarea
                  v-model="costTypeFormData.description"
                  rows="2"
                  placeholder="Enter Description"
                />
              </VControl>
            </VField>
          </div>
        </div>
      </div>
    </template>
    <template #action>
      <VButton type="submit" color="primary" :loading="loading" raised>
        Save
      </VButton>
    </template>
    <template #cancel>
      <VButton color="light" @click="closeModalHandler" raised>Close </VButton>
    </template>
  </VModal>
</template>

<style lang="scss" scoped></style>
