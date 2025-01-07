<script setup lang="ts">
import axios from "axios";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { useCompany } from "/@src/stores/company";
import { convertToFormData } from "/@src/composable/useSupportElement";
import { useUserSession } from "/@src/stores/userSession";
const editor = shallowRef<any>();
const userSession = useUserSession();
const notyf = useNotyf();
const api = useApi();
const isLoading = ref(false);
const FormData = ref({});
const openAddContactModal = ref(false);

const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: null): void;
}>();
const props = defineProps<{
  costItemModal?: boolean;
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

const tagsSlotValue = ref([]);
const tagsSlotOptions = [
  {
    value: "javascript",
    name: "Javascript",
    image: "/images/icons/stacks/js.svg",
  },
  {
    value: "reactjs",
    name: "ReactJS",
    image: "/images/icons/stacks/reactjs.svg",
  },
  {
    value: "vuejs",
    name: "VueJS",
    image: "/images/icons/stacks/vuejs.svg",
  },
  {
    value: "angular",
    name: "Angular",
    image: "/images/icons/stacks/angular.svg",
  },
  {
    value: "android",
    name: "Android",
    image: "/images/icons/stacks/android.svg",
  },
  {
    value: "html5",
    name: "Html5",
    image: "/images/icons/stacks/html5.svg",
  },
  {
    value: "css3",
    name: "CSS3",
    image: "/images/icons/stacks/css3.svg",
  },
];

interface item {
  title: string;
  costType: string;
  description: string;
  quantity: number;
  unit: number;
  unitCost: number;
  markup: number;
  clientPrice: number;
  costCode: string;
  builderCost: string;
  margin: number;
  profit: number;
  internalNotes: string;
  includeInCatalog: boolean;
  markAs: string;
  group: string;
}

const workItem = ref<item>({
  title: "",
  description: "",
  quantity: 0,
  unit: 0,
  unitCost: 0,
  markup: 0,
  clientPrice: 0,
  costCode: "",
  costType: "",
  builderCost: "",
  margin: 0,
  profit: 0,
  internalNotes: "",
  includeInCatalog: false,
  markAs: "",
  group: "",
});

const costType = ref([
  { value: "labour", label: "Labour" },
  { value: "material", label: "Material" },
  { value: "equipment", label: "Equipment" },
  { value: "subcontractor", label: "Subcontractor" },
  { value: "other", label: "Others" },
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
    const formDataAPI = convertToFormData(workItem.value, ["profileImageURL"]);
    const response = await api.post("/v3/api/worker/", formDataAPI);
    closeModalHandler();
    notyf.dismissAll();
    notyf.success("New worker added, New Worker");
  } catch (error: any) {
    notyf.error(` ${error}, New Worker`);
  } finally {
    isLoading.value = false;
  }
};

const closeModalHandler = () => {
  emit("update:modalHandler", false);
};

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

onMounted(async () => {
  editor.value = await import("@ckeditor/ckeditor5-build-classic").then(
    (m) => m.default
  );
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
                  v-model="workItem.title"
                  required
                  class="input is-primary-focus is-primary-focus"
                  placeholder="Proposal Title"
                />
              </div>
            </div>

            <div class="field column is-6">
              <label for="">Cost Type</label>
              <VField>
                <VControl>
                  <VSelect v-model="workItem.costType">
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
            <div class="field column is-6">
              <label for="">Catalog</label>
              <VField class="is-flex">
                <VControl raw subcontrol>
                  <VCheckbox
                    v-model="workItem.includeInCatalog"
                    label="Include item in Catalog"
                  />
                </VControl>
              </VField>
            </div>
            <div class="field column is-6">
              <label for="">Mark As</label>
              <VField>
                <VControl>
                  <VSelect v-model="workItem.markAs">
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
              <label for="">Cost Code *</label>
              <VField>
                <VControl>
                  <VSelect v-model="workItem.costType">
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
            <div class="field column is-6">
              <label for="">Group</label>
              <VField>
                <VControl>
                  <VSelect v-model="workItem.costType">
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
            <div class="field column is-12 mb-0">
              <label for="" class="label">Description</label>

              <CKEditor
                v-if="editor"
                v-model="workItem.description"
                :editor="editor"
                :config="editorConfig"
              />
            </div>
            <div class="field column is-12 mb-0">
              <label for="" class="label">Internal Notes</label>
              <VField>
                <VControl>
                  <VTextarea
                    v-model="workItem.internalNotes"
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
                    v-model="workItem.unitCost"
                    type="number"
                    name="unitCost"
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
                    v-model="workItem.unitCost"
                    type="number"
                    name="quantity"
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
                    v-model="workItem.unit"
                    type="number"
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
                    v-model="workItem.unit"
                    type="number"
                    name="builderCost"
                    placeholder="Builder cost"
                  />
                </VControl>
              </VField>
            </div>
            <div class="field column is-6">
              <label>Markup</label>
              <VField>
                <VControl>
                  <VInput
                    v-model="workItem.markup"
                    type="number"
                    name="markup"
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
                    v-model="workItem.clientPrice"
                    type="number"
                    name="markup"
                    placeholder="Client Price"
                  />
                </VControl>
              </VField>
            </div>
            <div class="field column is-6">
              <label>Margin</label>
              <VField>
                <VControl>
                  <VInput
                    v-model="workItem.margin"
                    type="number"
                    name="markup"
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
        icon="fas fa-plus"
        raised
        >Add Item</VButton
      >
    </template>
  </VModal>
</template>
