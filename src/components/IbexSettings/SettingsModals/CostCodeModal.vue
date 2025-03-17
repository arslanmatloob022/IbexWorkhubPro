<script setup lang="ts">
import { useNotyf } from "/@src/composable/useNotyf";
import { useApi } from "/@src/composable/useAPI";
import { generalUnits } from "../../IbexJobsEstimates/estimatesScripts";
const api = useApi();
const loading = ref(false);
const notyf = useNotyf();
const mailLoading = ref(false);

const props = defineProps<{
  addUpdateCostCodeModal?: boolean;
  costCodeId?: string;
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

interface costCode {
  id: string;
  name: string;
  category: string;
  parent_code: string;
  is_labour_code: boolean;
  labour_cost: number;
  description: string;
  unit_cost: number;
  unit: string;
  worker_cost: number;
  is_active: boolean;
}
const costCodeFormData = ref<costCode>({
  id: "",
  name: "",
  category: props.codeCategoryId || "",
  parent_code: props.parentCodeId || "",
  is_labour_code: false,
  labour_cost: 0.0,
  description: "",
  worker_cost: 0.0,
  unit: "--",
  unit_cost: 0.0,
  is_active: true,
});

const createCostCodeHandler = async () => {
  try {
    mailLoading.value = true;
    if (props.costCodeId) {
      const response = await api.patch(
        `/api/cost-code/${props.costCodeId}/`,
        costCodeFormData.value
      );
      notyf.info("Cost code updated successfully");
    } else {
      const response = await api.post(
        `/api/cost-code/`,
        costCodeFormData.value
      );
      notyf.success("Cost code created successfully");
    }
    closeModalHandler();
    updateOnSuccessHandler();
  } catch (err) {
    console.log(err);
  } finally {
    mailLoading.value = false;
  }
};

const getCostCodeInfoHandler = async () => {
  try {
    mailLoading.value = true;
    const response = await api.get(`/api/cost-code/${props.costCodeId}/`);
    costCodeFormData.value = response.data;
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
const getCostCategoriesHandler = async () => {
  try {
    mailLoading.value = true;
    const response = await api.get(`/api/cost-category/`);
    categoriesList.value = response.data;
  } catch (err) {
    console.log(err);
  } finally {
    mailLoading.value = false;
  }
};

const costCodesList = ref([]);
const getCostCodesHandler = async (category: any = "") => {
  try {
    mailLoading.value = true;
    const response = await api.get(`/api/cost-code/?category=${category}`);
    costCodesList.value = response.data.map((item: any) => {
      return {
        ...item,
        value: item.id,
        label: item.name,
      };
    });
  } catch (err) {
    console.log(err);
  } finally {
    mailLoading.value = false;
  }
};

watch(
  () => costCodeFormData.value.category,
  (newCategory) => {
    getCostCodesHandler(newCategory);
  }
);

const costUnitsList = ref([
  {
    id: "",
    title: "",
    value: "",
    description: "",
    is_active: true,
    created_at: "",
    updated_at: "",
  },
]);
const getUnits = async () => {
  try {
    loading.value = true;
    const response = await api.get(`/api/units/`);
    costUnitsList.value = response.data;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  console.log(props.codeCategoryId);
  if (props.costCodeId) {
    getCostCodeInfoHandler();
  }
  getUnits();
  getCostCategoriesHandler();
  getCostCodesHandler();
});
</script>
<template>
  <VModal
    is="form"
    :open="props.addUpdateCostCodeModal"
    title="Cost Code"
    size="large"
    actions="right"
    @submit.prevent="createCostCodeHandler"
    @close="closeModalHandler"
  >
    <template #content>
      <div class="modal-form columns is-multiline">
        <div class="column is-6">
          <div class="field">
            <label class="label">Title * </label>
            <div class="control">
              <input
                type="text"
                required
                class="input"
                placeholder="Enter Title"
                v-model="costCodeFormData.name"
              />
            </div>
          </div>
        </div>

        <div class="column is-6">
          <div class="field">
            <label class="label">Category *</label>
            <div class="control">
              <VField>
                <VControl>
                  <VSelect v-model="costCodeFormData.category" required>
                    <VOption value=""> Select a category </VOption>
                    <VOption v-for="item in categoriesList" :value="item.id">{{
                      item.name
                    }}</VOption>
                  </VSelect>
                </VControl>
              </VField>
            </div>
          </div>
        </div>
        <div class="field column is-12">
          <label class="label">Sub code of </label>
          <div class="control">
            <VField v-slot="{ id }">
              <VControl>
                <Multiselect
                  :disabled="CategoryMode ? true : false"
                  v-model="costCodeFormData.parent_code"
                  :attrs="{ id }"
                  :searchable="true"
                  :options="costCodesList"
                  placeholder="Select a parent"
                />
              </VControl>
            </VField>
          </div>
        </div>
        <div class="column is-12">
          <div class="columns is-multiline">
            <div class="field column is-6">
              <label class="label"></label>
              <VField class="is-flex">
                <VControl raw subcontrol>
                  <VCheckbox
                    v-model="costCodeFormData.is_labour_code"
                    label="Hourly charged labour code"
                  />
                </VControl>
              </VField>
            </div>
            <div v-if="costCodeFormData.is_labour_code" class="column is-6">
              <div class="field">
                <label class="label">Default labour cost ($)</label>
                <div class="control">
                  <input
                    type="number"
                    required
                    step="any"
                    class="input"
                    placeholder="Enter amount"
                    v-model="costCodeFormData.labour_cost"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="column is-4">
          <div class="field">
            <label class="label">Unit cost ($)</label>
            <div class="control">
              <input
                type="number"
                step="any"
                class="input"
                placeholder="Unit Cost"
                v-model="costCodeFormData.unit_cost"
              />
            </div>
          </div>
        </div>
        <div class="column is-4">
          <div class="field">
            <label class="label">Worker cost ($)</label>
            <div class="control">
              <input
                type="number"
                step="any"
                class="input"
                placeholder="Worker Cost"
                v-model="costCodeFormData.worker_cost"
              />
            </div>
          </div>
        </div>
        <div class="column is-4">
          <div class="field">
            <label class="label">Unit</label>
            <VControl>
              <VSelect v-model="costCodeFormData.unit">
                <VOption value=""> Select Unit </VOption>
                <VOption v-for="item in costUnitsList" :value="item.value">
                  {{ item.title }} ({{ item.value ?? "" }})
                </VOption>
              </VSelect>
            </VControl>
          </div>
        </div>
        <hr />
        <div class="column is-12">
          <div class="field">
            <label class="label">Description</label>
            <VField>
              <VControl>
                <VTextarea
                  v-model="costCodeFormData.description"
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
        Add Cost Code
      </VButton>
    </template>
    <template #cancel>
      <VButton color="light" @click="closeModalHandler" raised>Close </VButton>
    </template>
  </VModal>
</template>

<style lang="scss" scoped></style>
