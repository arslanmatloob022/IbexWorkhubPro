<script setup lang="ts">
import { useNotyf } from "/@src/composable/useNotyf";
import { useApi } from "/@src/composable/useAPI";

const api = useApi();
const loading = ref(false);
const notyf = useNotyf();
const mailLoading = ref(false);

const props = defineProps<{
  addUpdateCategoryModal?: boolean;
  categoryId?: string;
}>();

const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: null): void;
}>();

const closeModalHandler = () => {
  emit("update:modalHandler", false);
};

const onSuccessUpdateHandler = () => {
  emit("update:OnSuccess", null);
};

interface category {
  id: string;
  name: string;
  trade: string;
  description: string;
  created_at: string;
  updated_at: string;
}

const categoryFormData = ref<category>({
  id: "",
  name: "",
  trade: "",
  description: "",
  created_at: ``,
  updated_at: "",
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
    if (props.categoryId) {
      const response = await api.patch(
        `/api/cost-category/${props.categoryId}/`,
        categoryFormData.value
      );
    } else {
      const response = await api.post(
        `/api/cost-category/`,
        categoryFormData.value
      );
    }
    onSuccessUpdateHandler();
    notyf.success(
      `Category  ${props.categoryId ? "updated" : "created"} successfully`
    );
    closeModalHandler();
  } catch (err) {
    console.log(err);
  } finally {
    mailLoading.value = false;
  }
};

const getCategoryInfoHandler = async () => {
  try {
    mailLoading.value = true;
    const response = await api.get(`/api/cost-category/${props.categoryId}/`);
    categoryFormData.value = response.data;
  } catch (err) {
    console.log(err);
  } finally {
    mailLoading.value = false;
  }
};

const tardeList = ref([
  {
    id: "",
    name: "",
    description: "",
    created_at: "",
    updated_at: "",
  },
]);
const getCostTradesHandler = async () => {
  try {
    mailLoading.value = true;
    const response = await api.get(`/api/cost-trade/`);
    tardeList.value = response.data;
  } catch (err) {
    console.log(err);
  } finally {
    mailLoading.value = false;
  }
};

onMounted(() => {
  if (props.categoryId) {
    getCategoryInfoHandler();
  }
  getCostTradesHandler();
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
                v-model="categoryFormData.name"
              />
            </div>
          </div>
        </div>

        <!-- <div class="column is-6">
          <div class="field">
            <label class="label">Category </label>
            <VControl>
              <VSelect v-model="categoryFormData">
                <VOption value=""> Select a category </VOption>
                <VOption value="Superman"> Superman </VOption>
                <VOption value="Batman"> Batman </VOption>
                <VOption value="Spiderman"> Spiderman </VOption>
                <VOption value="Deadpool"> Deadpool </VOption>
                <VOption value="Spawn"> Spawn </VOption>
                <VOption value="Galactus"> Galactus </VOption>
              </VSelect>
            </VControl>
          </div>
        </div> -->

        <div class="column is-6">
          <div class="field">
            <label class="label">Trade *</label>
            <VControl>
              <VSelect v-model="categoryFormData.trade" required>
                <VOption v-for="item in tardeList" :value="item.id"
                  >{{ item.name }}
                </VOption>
              </VSelect>
            </VControl>
          </div>
        </div>

        <div class="column is-12">
          <div class="field">
            <label class="label">Description</label>
            <VField>
              <VControl>
                <VTextarea
                  v-model="categoryFormData.description"
                  rows="3"
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
        {{ props.categoryId ? "Update Category" : "Add Category" }}
      </VButton>
    </template>
    <template #cancel>
      <VButton color="light" @click="closeModalHandler" raised>Close </VButton>
    </template>
  </VModal>
</template>

<style lang="scss" scoped></style>
