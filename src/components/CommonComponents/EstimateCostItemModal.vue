<script setup lang="ts">
import axios from "axios";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { convertToFormData } from "/@src/composable/useSupportElement";
import { useUserSession } from "/@src/stores/userSession";
import { generalUnits } from "../IbexJobsEstimates/estimatesScripts";
import { CreateActivityLog } from "/@src/composable/useSupportElement";
import { useProposalStore } from "/@src/stores/LeadEstimatesStore/proposalStore";
import { useCostCodeStore } from "/@src/stores/LeadEstimatesStore/costCodeStore";
const editor = shallowRef<any>();
const useCostCodes = useCostCodeStore();
const useProposal = useProposalStore();
const userSession = useUserSession();
const notyf = useNotyf();
const api = useApi();
const isLoading = ref(false);
const selectedCataLog = ref("");
const assumeList = ref(<any>[]);
const catalogList = ref(<any>[]);

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
  group: string;
  worker_cost: number;
  proposal: string | undefined;
}

const costItem = ref<item>({
  previousItemIndex: 0,
  index: 0,
  id: "",
  type: "",
  total_price: 0,
  cost_code: "",
  cost_type: "",
  builder_cost: 0,
  internal_notes: "",
  mark_as: "",
  state: "",
  title: "",
  description: "",
  quantity: 0,
  unit: "",
  unit_cost: 0,
  markup: 0,
  margin: 0,
  profit: 0,
  worker_cost: 0.0,
  group: "",
  catalog: false,
  proposal: props.proposalId,
});

const costType = ref([
  { value: "labour", label: "Labour" },
  { value: "material", label: "Material" },
  { value: "equipment", label: "Equipment" },
  { value: "subcontractor", label: "Subcontractor" },
  { value: "other", label: "Others" },
]);

const costCodesList = ref([
  { value: "11011", label: "Labour" },
  { value: "11012", label: "Material" },
  { value: "11013", label: "Equipment" },
  { value: "11014", label: "Subcontractor" },
  { value: "11015", label: "Others" },
]);

const markAsOption = ref([
  { value: "bid", label: "Bid" },
  { value: "allowance", label: "Allowance" },
]);

const addUpdateLeadHandler = async () => {
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
      // CreateActivityLog({
      //   message: `Cost item Update `,
      //   action: "UPDATE",
      //   performedOnName: "Cost",
      //   object_id: props.costItemId,
      // });
    } else {
      const response = await api.post("/api/cost/", formDataAPI);
      if (costItem.value.catalog) {
        const result = await api.post(
          `/api/cost/${response.data.id}/create-catalog/`
        );
        // CreateActivityLog({
        //   message: `CataLog Create`,
        //   action: "CREATE",
        //   performedOnName: "Cost",
        //   object_id: response.data[0],
        // });
      }
      // CreateActivityLog({
      //   message: `Cost Item Create`,
      //   action: "CREATE",
      //   performedOnName: "Cost",
      //   object_id: response.data[0],
      // });
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

const unitCost = ref(0);
const quantity = ref(0);
const builderPrice = computed(
  () => costItem.value.unit_cost * costItem.value.quantity
);

const markup = ref(0);
const margin = ref(0);

const totalPrice = computed(() => {
  if (costItem.value.markup > 0) {
    return (
      builderPrice.value + (builderPrice.value * costItem.value.markup) / 100
    );
  } else if (costItem.value.margin > 0) {
    return builderPrice.value / (1 - costItem.value.margin / 100);
  }
  return builderPrice.value;
});

// Extract markup and margin dynamically
const calculatedMarkup = computed(() => {
  return ((totalPrice.value - builderPrice.value) / builderPrice.value) * 100;
});

const calculatedMargin = computed(() => {
  return ((totalPrice.value - builderPrice.value) / totalPrice.value) * 100;
});
const CKEditor = defineAsyncComponent(() =>
  import("@ckeditor/ckeditor5-vue").then((m) => m.default.component)
);

const editorConfig = {
  fontFamily: {
    options: ['"Montserrat", sans-serif', '"Roboto", sans-serif'],
  },
  height: "400px",
  minHeight: "400px",
};
const loading = ref(false);
const getCostItemDetail = async () => {
  try {
    loading.value = true;
    const response = await api.get(`/api/cost/${props.costItemId}/`);
    costItem.value = response.data;
    getMatchingCostCode();
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};
const costCodesWholeList = ref([]);
const Loading = ref(false);
const getCostCodesHandler = async () => {
  try {
    Loading.value = true;
    const response = await api.get(`/api/cost-code/`);
    costCodesWholeList.value = response.data;
    costCodesList.value = response.data.map((item: any) => {
      return {
        value: item.id,
        label: item.name,
        labour_cost: item.labour_cost,
        unit_cost: item.unit_cost ?? 0.0,
        worker_cost: item.worker_cost ?? 0.0,
        unit: item.unit ?? "--",
      };
    });
    // getMatchingCostCode();
  } catch (err) {
    console.log(err);
  } finally {
    Loading.value = false;
  }
};

watch(
  () => costItem.value.cost_code,
  (newVal, oldVal) => {
    if (newVal) {
      const selectedItem = costCodesWholeList.value.find(
        (item) => item.id === newVal
      );
      if (selectedItem) {
        costItem.value.unit_cost = selectedItem.unit_cost;
        costItem.value.worker_cost = selectedItem.worker_cost;
        costItem.value.unit = selectedItem.unit;
      } else {
        console.warn("No matching item found for cost_code:", newVal);
      }
    }
  }
);

const getMatchingCostCode = () => {
  if (costItem.value.internal_notes) {
    // console.log("iteer", useCostCodes.costCodesList[0]);
    const matchedCostCode = useCostCodes.costCodesList.find((item) => {
      return item.label?.match(costItem.value.internal_notes);
    });
    if (matchedCostCode) {
      console.log("matched", matchedCostCode.value);
      costItem.value.cost_code = matchedCostCode.value;
      if (costItem.value.internal_notes.includes("...")) {
        costItem.value.internal_notes = "";
        costItem.value.internal_notes = "...";
      } else {
        costItem.value.internal_notes = "";
      }
    }
    if (!costItem.value.title) {
      costItem.value.title = "...";
    }
  }
};

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

const getCataLogItemDetail = async () => {
  try {
    loading.value = true;
    const response = await api.get(`/api/cost/catalogs/`);
    assumeList.value = response.data;
    catalogList.value = response.data.map((item: any) => {
      return {
        value: item.id,
        name: item.title,
      };
    });
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};
watch(selectedCataLog, (oldVal, newVal) => {
  let list = assumeList.value;
  const matchedItem = list.find((item) => item.id == selectedCataLog.value);

  if (matchedItem) {
    const { id, proposal_id, ...newObj } = matchedItem;
    costItem.value = newObj;
  }
});
onMounted(async () => {
  editor.value = await import("@ckeditor/ckeditor5-build-classic").then(
    (m) => m.default
  );
  if (props.previousItemIndex) {
    costItem.value.previousItemIndex = props.previousItemIndex;
  }
  if (props.costItemId) {
    getCostItemDetail();
  }
  getUnits();
  getCostCodesHandler();
  // useCostCodes.getCostCodesHandler();
  getCataLogItemDetail();
  // if () {
  // getMatchingCostCode();
  // }
});
</script>

<template>
  <VModal
    is="form"
    :open="props.costItemModal"
    :title="props.costMode == 'catalog' ? 'Update Catalog' : 'Cost Item '"
    size="xl"
    actions="right"
    @submit.prevent="addUpdateLeadHandler"
    @close="closeModalHandler"
  >
    <template #content>
      <div class="modal-form columns is-multiline">
        <VCard class="column is-12">
          <div class="columns is-multiline">
            <div class="field column is-6 mb-0">
              <label>Title: </label>
              <div class="control">
                <input
                  type="text"
                  name="firstName"
                  v-model="costItem.title"
                  required
                  :disabled="props.previewCostItems"
                  class="input is-primary-focus is-primary-focus"
                  placeholder="Proposal Title"
                />
              </div>
            </div>
            <VField
              v-if="props.costMode !== 'catalog'"
              v-slot="{ id }"
              class="column is-6 m-0"
              label="Import cost code from catalogue"
            >
              <VControl>
                <Multiselect
                  v-model="selectedCataLog"
                  :attrs="{ id }"
                  placeholder="Import from cost code"
                  label="name"
                  :options="catalogList"
                >
                  <template #singlelabel="{ value }">
                    <div class="multiselect-single-label">
                      <span class="select-label-text">
                        {{ value.name }}
                      </span>
                    </div>
                  </template>
                  <template #option="{ option }">
                    <span class="select-label-text">
                      {{ option.name }}
                    </span>
                  </template>
                </Multiselect>
              </VControl>
            </VField>

            <div class="field column is-6" v-if="props.costMode !== 'catalog'">
              <label for="">Cost Type</label>
              <VField>
                <VControl>
                  <VSelect
                    v-model="costItem.cost_type"
                    :disabled="props.previewCostItems"
                  >
                    <VOption
                      v-for="(item, index) in costType"
                      :value="item.value"
                    >
                      {{ item.label }}
                    </VOption>
                  </VSelect>
                </VControl>
              </VField>
            </div>
            <div class="field column is-3" v-if="!props.costItemId">
              <label for="">Add to catalogue</label>
              <div>
                <VControl raw subcontrol>
                  <VCheckbox
                    v-model="costItem.catalog"
                    label="Create template"
                    color="info"
                  />
                </VControl>
              </div>
            </div>
            <div class="field column is-3">
              <label for="">Mark As</label>
              <VField>
                <VControl>
                  <VSelect
                    v-model="costItem.mark_as"
                    :disabled="props.previewCostItems"
                  >
                    <VOption
                      v-for="(item, index) in markAsOption"
                      :value="item.value"
                    >
                      {{ item.label }}
                    </VOption>
                  </VSelect>
                </VControl>
              </VField>
            </div>
            <div class="field column is-6">
              <label>Cost Code *</label>
              <VField v-slot="{ id }">
                <VControl>
                  <Multiselect
                    required
                    v-model="costItem.cost_code"
                    :disabled="props.previewCostItems"
                    :attrs="{ id }"
                    :searchable="true"
                    :options="useCostCodes.costCodesList"
                    placeholder="Select a cost code"
                  />
                </VControl>
              </VField>
            </div>
            <div class="field column is-6">
              <label for="">Group Cost</label>
              <VField>
                <VControl>
                  <VInput
                    v-model="costItem.group"
                    name="gcost"
                    placeholder="Group Cost"
                  />
                </VControl>
              </VField>
            </div>
            <div class="field column is-12 mb-0">
              <label for="" class="label">Description</label>

              <VField>
                <VControl>
                  <VTextarea
                    v-model="costItem.description"
                    :disabled="props.previewCostItems"
                    rows="4"
                    placeholder="Description..."
                  />
                </VControl>
              </VField>
              <!-- <CKEditor
                v-if="editor"
                :disabled="props.previewCostItems"
                v-model="costItem.description"
                :editor="editor"
                :config="editorConfig"
              /> -->
            </div>
            <div class="field column is-12 mb-0">
              <label for="" class="label">Internal Notes</label>
              <VField>
                <VControl>
                  <VTextarea
                    v-model="costItem.internal_notes"
                    :disabled="props.previewCostItems"
                    rows="3"
                    placeholder="Internal notes..."
                  />
                </VControl>
              </VField>
            </div>
          </div>
        </VCard>
        <VCard class="column is-12 mt-3">
          <div class="columns is-multiline">
            <div class="field column is-6">
              <label>Unit Cost</label>
              <VField>
                <VControl>
                  <VInput
                    v-model="costItem.unit_cost"
                    :disabled="props.previewCostItems"
                    type="number"
                    name="unitCost"
                    step="any"
                    placeholder="Unit cost"
                  />
                </VControl>
              </VField>
            </div>
            <div class="field column is-6">
              <label>Quantity</label>
              <VField>
                <VControl>
                  <VInput
                    v-model="costItem.quantity"
                    :disabled="props.previewCostItems"
                    type="number"
                    name="quantity"
                    step="any"
                    placeholder="Quantity"
                  />
                </VControl>
              </VField>
            </div>
            <div class="field column is-6">
              <label>Unit</label>
              <VField>
                <VControl>
                  <VSelect
                    :disabled="props.previewCostItems"
                    v-model="costItem.unit"
                  >
                    <VOption value=""> Select Unit </VOption>
                    <VOption v-for="item in costUnitsList" :value="item.value">
                      {{ item.title }} ({{ item.value }})
                    </VOption>
                  </VSelect>
                </VControl>
              </VField>
            </div>
            <div class="field column is-6">
              <label>Builder Cost</label>
              <VField>
                <VControl>
                  <VInput
                    v-model="builderPrice"
                    :disabled="props.previewCostItems"
                    type="number"
                    step="any"
                    name="builderCost"
                    placeholder="Builder cost"
                  />
                </VControl>
              </VField>
            </div>
            <div class="field column is-6">
              <label>Markup (%)</label>
              <VField>
                <VControl>
                  <VInput
                    v-model="costItem.markup"
                    :disabled="props.previewCostItems"
                    type="number"
                    name="markup"
                    step="any"
                    placeholder="Markup"
                  />
                </VControl>
              </VField>
            </div>
            <div class="field column is-6">
              <label>Total Price</label>
              <VField>
                <VControl>
                  <VInput
                    v-model="totalPrice"
                    :disabled="props.previewCostItems"
                    type="number"
                    name="markup"
                    step="any"
                    placeholder="Total Price"
                  />
                </VControl>
              </VField>
            </div>
            <div class="field column is-6">
              <label>Margin (%)</label>
              <VField>
                <VControl>
                  <VInput
                    v-model="costItem.margin"
                    :disabled="props.previewCostItems"
                    type="number"
                    name="markup"
                    step="any"
                    placeholder="Margin"
                  />
                </VControl>
              </VField>
            </div>
            <div class="field column is-6">
              <label>Worker Cost</label>
              <VField>
                <VControl>
                  <VInput
                    v-model="costItem.worker_cost"
                    type="number"
                    name="workerCost"
                    step="any"
                    placeholder="Worker Cost"
                  />
                </VControl>
              </VField>
            </div>
          </div>
        </VCard>
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
