<script setup lang="ts">
import { useNotyf } from "/@src/composable/useNotyf";
import { useApi } from "/@src/composable/useAPI";

const api = useApi();
const loading = ref(false);
const notyf = useNotyf();
const mailLoading = ref(false);

const props = defineProps<{
  addUpdateCategoryModal?: boolean;
  costCodeId?: string;
}>();

const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: null): void;
}>();

const closeModalHandler = () => {
  emit("update:modalHandler", false);
};

interface category {
  id: string;
  title: string;
  category: string;
  trade: string;
  description: string;
}

const categoryFormData = ref<category>({
  id: "",
  title: "",
  category: ``,
  trade: "",
  description: "",
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
const createCategoryHandler = async () => {
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
    :open="props.addUpdateCategoryModal"
    title="Category"
    size="large"
    actions="right"
    @submit.prevent="createCategoryHandler"
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
                v-model="categoryFormData.title"
              />
            </div>
          </div>
        </div>

        <div class="column is-6">
          <div class="field">
            <label class="label">Category </label>
            <div class="control">
              <VField>
                <VControl>
                  <VSelect v-model="categoryFormData.category" required>
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

        <div class="column is-6">
          <div class="field">
            <label class="label">Trade Type</label>
            <div class="control">
              <input
                type="text"
                required
                class="input"
                placeholder="Enter trade type"
                v-model="categoryFormData.trade"
              />
            </div>
          </div>
        </div>

        <div class="column is-12">
          <div class="field">
            <label class="label">Description</label>
            <VField>
              <VControl>
                <VTextarea
                  v-model="categoryFormData.description"
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
        Add Category
      </VButton>
    </template>
    <template #cancel>
      <VButton color="light" @click="closeModalHandler" raised>Close </VButton>
    </template>
  </VModal>
</template>

<style lang="scss" scoped></style>
