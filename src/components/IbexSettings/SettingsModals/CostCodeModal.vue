<script setup lang="ts">
import { useNotyf } from "/@src/composable/useNotyf";
import { useApi } from "/@src/composable/useAPI";

const api = useApi();
const loading = ref(false);
const notyf = useNotyf();
const mailLoading = ref(false);

const props = defineProps<{
  addUpdateCostCodeModal?: boolean;
  costCodeId?: string;
}>();

const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: null): void;
}>();

const closeModalHandler = () => {
  emit("update:modalHandler", false);
};

interface costCode {
  id: string;
  title: string;
  category: string;
  child_of: string;
  is_hourly_cost: boolean;
  hourly_cost: number;
  description: string;
  unit_cost: number;
  is_active: boolean;
}
const costCodeFormData = ref<costCode>({
  id: "",
  title: "",
  category: ``,
  child_of: "",
  is_hourly_cost: false,
  hourly_cost: 0.0,
  description: "",
  unit_cost: 0.0,
  is_active: true,
});
const selectedParentCostCode = ref("");
const costCodesList = [
  { id: 1, value: "Lead", label: "Lead" },
  { id: 2, value: "Home", label: "Home" },
  { id: 3, value: "Floor Work", label: "Floor Work" },
  { id: 4, value: "Tile Work", label: "Tile Work" },
  { id: 5, value: "Carpenter", label: "Carpenter" },
  { id: 6, value: "Complete Renovation", label: "Complete Renovation" },
  { id: 7, value: "Painting", label: "Painting" },
  { id: 8, value: "Plumbing", label: "Plumbing" },
  { id: 9, value: "New Construction", label: "New Construction" },
  { id: 10, value: "Carpenter", label: "Carpenter" },
  { id: 11, value: "Carpenter", label: "Carpenter" },
  { id: 12, value: "Carpenter", label: "Carpenter" },
];
const createCostCodeHandler = async () => {
  try {
    mailLoading.value = true;
    const response = await api.post(`/api/`, {});
    notyf.success("Cost code created successfully");
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
    const response = await api.get(`/api/`, {});
    notyf.success("Cost code created successfully");
    closeModalHandler();
  } catch (err) {
    console.log(err);
  } finally {
    mailLoading.value = false;
  }
};

onMounted(() => {
  if (props.costCodeId) {
    getCostCodeInfoHandler();
  }
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
            <label class="label">Title *</label>
            <div class="control">
              <input
                type="text"
                required
                class="input"
                placeholder="Enter Title"
                v-model="costCodeFormData.title"
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
                    <VOption value="Superman"> Superman </VOption>
                    <VOption value="Batman"> Batman </VOption>
                    <VOption value="Spiderman"> Spiderman </VOption>
                    <VOption value="Deadpool"> Deadpool </VOption>
                    <VOption value="Spawn"> Spawn </VOption>
                    <VOption value="Galactus"> Galactus </VOption>
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
                  v-model="costCodeFormData.child_of"
                  :attrs="{ id }"
                  :searchable="true"
                  :options="costCodesList"
                  placeholder="Select a parent"
                />
              </VControl>
            </VField>
          </div>
        </div>
        <div class="field column is-6">
          <label class="label"></label>
          <VField class="is-flex">
            <VControl raw subcontrol>
              <VCheckbox
                v-model="costCodeFormData.is_hourly_cost"
                label="Hourly charged labour code"
              />
            </VControl>
          </VField>
        </div>
        <div v-if="costCodeFormData.is_hourly_cost" class="column is-6">
          <div class="field">
            <label class="label">Default labour cost ($)</label>
            <div class="control">
              <input
                type="number"
                required
                step="any"
                class="input"
                placeholder="Enter amount"
                v-model="costCodeFormData.hourly_cost"
              />
            </div>
          </div>
        </div>
        <div class="column is-12">
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
