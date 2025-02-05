<template>
  <div class="cost-codes">
    <!-- Add New Cost Code Button -->
    <div class="is-flex" style="justify-content: end">
      <VButton color="primary" rounded @click="openModal(null)">
        + New Cost Code
      </VButton>
    </div>

    <!-- Table -->
    <table class="table mt-5 is-hoverable is-striped is-fullwidth">
      <thead>
        <tr>
          <th class="p-3">Title</th>
          <th class="p-3">Category</th>
          <th class="p-3" style="text-align: center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(costCode, index) in costCodes" :key="costCode.id">
          <!-- Parent Row -->
          <tr>
            <td class="p-4 cursor-pointer" @click="toggleCollapse(index)">
              <strong>{{ costCode.title }}</strong>
            </td>
            <td class="p-4">{{ costCode.category }}</td>
            <td class="p-4" style="text-align: center">
              <VButton
                color="primary"
                size="small"
                rounded
                class="btn btn-sm btn-secondary"
                @click="openModal(costCode)"
              >
                <i class="fas fa-pen"></i>
                Edit
              </VButton>
              <VButton
                class="ml-2"
                color="danger"
                size="small"
                rounded
                @click="deleteCostCode(costCode.id)"
              >
                <i class="fas fa-trash"></i>
                Delete
              </VButton>
            </td>
          </tr>
          <!-- Collapsible Row -->
          <tr v-show="expandedRow === index">
            <td colspan="3" class="bg-light">
              <p><strong>Details:</strong> {{ costCode.details }}</p>
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <VModal
      :open="isModalOpen"
      :title="selectedCostCode ? 'Edit Cost Code' : 'Add New Cost Code'"
      actions="right"
      is="form"
      @submit.prevent="handleSave"
      size="medium"
      @close="isModalOpen = false"
    >
      <template #content>
        <div class="columns is-multiline p-4">
          <VField class="column is-6">
            <VLabel>Title</VLabel>
            <VControl>
              <VInput
                v-model="formData.title"
                type="text"
                required
                placeholder="Enter Title"
              />
            </VControl>
          </VField>
          <VField class="column is-6">
            <VLabel>Category</VLabel>
            <VControl>
              <VInput
                v-model="formData.category"
                type="text"
                required
                placeholder="Category Name"
              />
            </VControl>
          </VField>
          <VField class="column is-12">
            <VControl>
              <VTextarea
                v-model="formData.details"
                class="is-primary-focus"
                rows="2"
                placeholder="Type here"
              />
            </VControl>
          </VField>
        </div>
      </template>
      <template #action>
        <VButton color="primary" type="submit" raised> Confirm </VButton>
      </template>
    </VModal>
  </div>
</template>
  
  <script lang="ts" setup>
import { ref } from "vue";

const costCodes = ref([
  {
    id: 1,
    title: "0100 Design Services",
    category: "Design Services",
    details: "Details about design services.",
  },
  {
    id: 2,
    title: "0200 Architectural Services",
    category: "Architectural Services",
    details: "Details about architectural services.",
  },
]);

const expandedRow = ref<number | null>(null);
const isModalOpen = ref(false);
const selectedCostCode = ref<any>(null);
const formData = ref({ title: "", category: "", details: "" });

const toggleCollapse = (index: number) => {
  expandedRow.value = expandedRow.value === index ? null : index;
};

const openModal = (costCode: any) => {
  selectedCostCode.value = costCode;
  formData.value = costCode
    ? { ...costCode }
    : { title: "", category: "", details: "" };
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedCostCode.value = null;
  formData.value = { title: "", category: "", details: "" };
};

const handleSave = () => {
  if (selectedCostCode.value) {
    // Update existing
    const index = costCodes.value.findIndex(
      (c) => c.id === selectedCostCode.value.id
    );
    if (index !== -1) costCodes.value[index] = { ...formData.value };
  } else {
    // Add new
    costCodes.value.push({ ...formData.value, id: Date.now() });
  }
  closeModal();
};

const deleteCostCode = (id: number) => {
  costCodes.value = costCodes.value.filter((c) => c.id !== id);
};
</script>
  
  <style scoped lang="scss">
/* Table Styles */

/* Modal Styles */
</style>
  