<script setup lang="ts">
import axios from "axios";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { convertToFormData } from "/@src/composable/useSupportElement";
import { useUserSession } from "/@src/stores/userSession";
import { generalUnits } from "../IbexJobsEstimates/estimatesScripts";
import { CreateActivityLog } from "/@src/composable/useSupportElement";
import { useProposalStore } from "/@src/stores/LeadEstimatesStore/proposalStore";

const useProposal = useProposalStore();
const notyf = useNotyf();
const api = useApi();
const isLoading = ref(false);

const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: null): void;
}>();

const props = defineProps<{
  costItemModal?: boolean;
  proposalId?: string;
  previousItemIndex?: number;
  costItemId?: string;
  previewCostItems?: boolean;
  costMode?: string;
}>();

interface item {
  previousItemIndex: number;
  index: number;
  id: string;
  title: string;
  description: string;
  type: string;
  quantity: number;
  unit: string;
  unit_cost: number;
  markup: number;
  total_price: number;
  cost_code: string;
  cost_type: string;
  builder_cost: number;
  margin: number;
  profit: number;
  internal_notes: string;
  mark_as: string;
  state: string;
  catalog: boolean;
  is_empty: boolean;
  group: string;
  worker_cost: number;
  proposal: string | undefined;
}

const costItem = ref({
  previousItemIndex: 0,
  index: 0,
  title: "",
  description: "",
  catalog: false,
  is_empty: true,
  proposal: props.proposalId,
});

const addUpdateCostItemHandler = async () => {
  try {
    isLoading.value = true;
    const formDataAPI = convertToFormData(costItem.value, []);
    if (props.proposalId !== null && props.proposalId !== undefined) {
      formDataAPI.append("proposal", props.proposalId.toString());
    }
    if (props.costItemId) {
      const response = await api.patch(
        `/api/cost/${props.costItemId}/`,
        formDataAPI
      );
    } else {
      const response = await api.post("/api/cost/", formDataAPI);
      if (costItem.value.catalog) {
        const result = await api.post(
          `/api/cost/${response.data.id}/create-catalog/`
        );
      }

      useProposal.getProposalDetail(props.proposalId);
    }
    closeModalHandler();
    updateOnSuccess();

    notyf.success("Item added successfully.");
  } catch (error: any) {
    notyf.error(` ${error}, New Worker`);
  } finally {
    isLoading.value = false;
  }
};

const closeModalHandler = () => {
  emit("update:modalHandler", false);
};

const updateOnSuccess = () => {
  emit("update:OnSuccess", null);
};

const builderPrice = computed(() => {
  const value = costItem.value.unit_cost * costItem.value.quantity;
  return Number.isFinite(value) ? Number(value.toFixed(2)) : 0;
});

const totalPrice = computed(() => {
  let value = builderPrice.value;
  if (costItem.value.markup > 0) {
    value = value + (value * costItem.value.markup) / 100;
  } else if (costItem.value.margin > 0) {
    value = value / (1 - costItem.value.margin / 100);
  }
  return Number.isFinite(value) ? Number(value.toFixed(2)) : 0;
});

const loading = ref(false);
const getCostItemDetail = async () => {
  try {
    loading.value = true;
    const response = await api.get(`/api/cost/${props.costItemId}/`);
    costItem.value = response.data;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  if (props.previousItemIndex) {
    costItem.value.previousItemIndex = props.previousItemIndex;
  }
  if (props.costItemId) {
    getCostItemDetail();
  }
});
</script>

<template>
  <VModal
    is="form"
    :open="props.costItemModal"
    :title="props.costMode == 'catalog' ? 'Update Catalog' : 'Add Section'"
    size="medium"
    actions="right"
    @submit.prevent="addUpdateCostItemHandler"
    @close="closeModalHandler"
  >
    <template #content>
      <div class="modal-form columns is-multiline">
        <div class="field column is-12 mb-0">
          <label>Section Title: </label>
          <div class="control">
            <input
              type="text"
              name="firstName"
              v-model="costItem.description"
              required
              class="input is-primary-focus is-primary-focus"
              placeholder="Section Title"
            />
          </div>
        </div>
      </div>
    </template>
    <template #action>
      <VButton
        :loading="isLoading"
        type="submit"
        color="primary"
        :icon="props.costItemId ? '' : 'fas fa-plus'"
        raised
        >{{ props.costItemId ? "Update" : "Add" }}</VButton
      >
    </template>
  </VModal>
</template>
