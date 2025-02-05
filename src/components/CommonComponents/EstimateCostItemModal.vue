<script setup lang="ts">
import axios from "axios";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { convertToFormData } from "/@src/composable/useSupportElement";
import { useUserSession } from "/@src/stores/userSession";
const editor = shallowRef<any>();
const userSession = useUserSession();
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
}>();

const tagsValue = ref([]);
const tagsOptions = [
  { value: "batman", label: "Batman" },
  { value: "robin", label: "Robin" },
  { value: "joker", label: "Joker" },
];

const sourcesValue = ref([]);
const sourcesOptions = [
  { value: "all", label: "All" },
  { value: "contact", label: "Contact Form" },
  { value: "google", label: "Google" },
  { value: "referral", label: "Referral" },
];

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
  group: string;
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
  group: "",
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

const itemGroup = ref([
  { value: "Tiling", label: "Tiling" },
  { value: "Material", label: "Material" },
  { value: "Paint", label: "Paint" },
  { value: "Carpenter", label: "Carpenter" },
]);

const markAsOption = ref([
  { value: "bid", label: "Bid" },
  { value: "allowance", label: "Allowance" },
]);

const status = ref([
  { value: "open", label: "Open" },
  { value: "inProgress", label: "In Progress" },
  { value: "onHold", label: "On Hold" },
  { value: "pending", label: "Pending" },
  { value: "lost", label: "Lost" },
  { value: "sold", label: "sold" },
  { value: "noOpportunity", label: "No Opportunity" },
]);

const addUpdateLeadHandler = async () => {
  try {
    isLoading.value = true;
    const formDataAPI = convertToFormData(costItem.value, []);

    if (props.costItemId) {
      const response = await api.patch(
        `/api/cost/${props.costItemId}/`,
        formDataAPI
      );
    } else {
      const response = await api.post("/api/cost/", formDataAPI);
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

const unitCost = ref(0); // Unit cost per item
const quantity = ref(0); // Quantity of items
const builderPrice = computed(
  () => costItem.value.unit_cost * costItem.value.quantity
); // Builder price calculation

const markup = ref(0); // Markup percentage
const margin = ref(0); // Margin percentage

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
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const Loading = ref(false);
const getCostCodesHandler = async () => {
  try {
    Loading.value = true;
    const response = await api.get(`/api/cost-code/`);
    costCodesList.value = response.data.map((item: any) => {
      return {
        value: item.id,
        label: item.name,
      };
    });
  } catch (err) {
    console.log(err);
  } finally {
    Loading.value = false;
  }
};
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
  getCostCodesHandler();
});
</script>

<template>
  <VModal
    is="form"
    :open="props.costItemModal"
    title="Cost Item "
    size="xl"
    actions="right"
    @submit.prevent="addUpdateLeadHandler"
    @close="closeModalHandler"
  >
    <template #content>
      <div class="modal-form columns is-multiline">
        <VCard class="column is-12">
          <div class="columns is-multiline">
            <div class="field column is-12 mb-0">
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

            <div class="field column is-6">
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
            <div class="field column is-3">
              <label for="">Catalog</label>
              <div>
                <VButton color="info" light raised size="small"
                  >Add in Catalog</VButton
                >
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
                    :options="costCodesList"
                    placeholder="Select a cost code"
                  />
                </VControl>
              </VField>
            </div>
            <div class="field column is-6">
              <label for="">Group Cost</label>
              <VField>
                <VControl>
                  <VSelect
                    v-model="costItem.group"
                    :disabled="props.previewCostItems"
                  >
                    <VOption
                      v-for="(item, index) in itemGroup"
                      :value="item.value"
                    >
                      {{ item.label }}
                    </VOption>
                  </VSelect>
                </VControl>
              </VField>
            </div>
            <div class="field column is-12 mb-0">
              <label for="" class="label">Description</label>

              <CKEditor
                v-if="editor"
                :disabled="props.previewCostItems"
                v-model="costItem.description"
                :editor="editor"
                :config="editorConfig"
              />
            </div>
            <div class="field column is-12 mb-0">
              <label for="" class="label">Internal Notes</label>
              <VField>
                <VControl>
                  <VTextarea
                    v-model="costItem.internal_notes"
                    :disabled="props.previewCostItems"
                    rows="4"
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
                  <VInput
                    v-model="costItem.unit"
                    :disabled="props.previewCostItems"
                    type="text"
                    name="unit"
                    placeholder="Unit"
                  />
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
              <label>Client Price</label>
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
