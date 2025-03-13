<script setup lang="ts">
import { useNotyf } from "/@src/composable/useNotyf";
import { useApi } from "/@src/composable/useAPI";
import { generalUnits } from "../../IbexJobsEstimates/estimatesScripts";
const api = useApi();
const loading = ref(false);
const notyf = useNotyf();
const mailLoading = ref(false);

const props = defineProps<{
  addUpdateCostUnitModal?: boolean;
  unitId?: string;
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
const costUnitFormData = ref({
  id: "",
  title: "",
  value: "",
  description: "",
  is_active: true,
  created_at: "",
  updated_at: "",
});

const createCostUnitHandler = async () => {
  try {
    mailLoading.value = true;
    if (props.unitId) {
      const response = await api.patch(
        `/api/units/${props.unitId}/`,
        costUnitFormData.value
      );
      notyf.info("Cost code updated successfully");
    } else {
      const response = await api.post(`/api/units/`, costUnitFormData.value);
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
    const response = await api.get(`/api/units/${props.unitId}/`);
    costUnitFormData.value = response.data;
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
  if (props.unitId) {
    getCostCodeInfoHandler();
  }
});
</script>
<template>
  <VModal
    is="form"
    :open="props.addUpdateCostUnitModal"
    title="Unit"
    size="medium"
    actions="right"
    @submit.prevent="createCostUnitHandler"
    @close="closeModalHandler"
  >
    <template #content>
      <div class="modal-form columns is-multiline">
        <div class="column is-12">
          <div class="field">
            <label class="label">Title * </label>
            <div class="control">
              <input
                type="text"
                required
                class="input"
                placeholder="Title e.g Square Feet"
                v-model="costUnitFormData.title"
              />
            </div>
          </div>
        </div>

        <div class="column is-12">
          <div class="field">
            <label class="label">Value *</label>
            <div class="control">
              <input
                type="text"
                required
                class="input"
                placeholder="e.g Sq Ft"
                v-model="costUnitFormData.value"
              />
            </div>
          </div>
        </div>

        <hr />
        <div class="column is-12">
          <div class="field">
            <label class="label">Description</label>
            <VField>
              <VControl>
                <VTextarea
                  v-model="costUnitFormData.description"
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
