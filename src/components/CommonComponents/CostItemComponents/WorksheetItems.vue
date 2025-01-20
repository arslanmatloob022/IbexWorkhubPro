<script setup lang="ts">
import { useProposalStore } from "/@src/stores/LeadEstimatesStore/proposalStore";
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
const FormData = ref({});
const proposalStore = useProposalStore();
const openAddContactModal = ref(false);

const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: null): void;
}>();
const props = defineProps<{
  leadProposalModal?: boolean;
  proposalId?: string;
}>();

const tagsValue = ref([
  "CostCode",
  "Description",
  "Quantity",
  "Unit",
  "UnitCost",
  "TotalPrice",
]);

const tagsOptions = [
  { value: "ItemNumber", label: "Item Number" },
  { value: "Title", label: "Title" },
  { value: "Unit", label: "Unit" },
  { value: "Description", label: "Description" },
  { value: "CostType", label: "Cost Type" },
  { value: "Quantity", label: "Quantity" },
  { value: "UnitCost", label: "Unit Cost" },
  { value: "BuilderCost", label: "Builder Cost" },
  { value: "Markup", label: "Markup" },
  { value: "MarkupAmount", label: "Markup Amount" },
  { value: "UnitPrice", label: "Unit Price" },
  { value: "Price", label: "Price" },
  { value: "TotalPrice", label: "Total Price" },
  { value: "GroupPrice", label: "Group Price" },
  { value: "TotalCost", label: "Total Cost" },
  { value: "TotalMarkup", label: "Total Markup" },
  { value: "ClientPrice", label: "Client Price" },
  { value: "Profit", label: "Profit" },
  { value: "Notes", label: "Notes" },
];

interface item {
  title: string;
  description: string;
  quantity: number;
  unit: number;
  unitCost: number;
  markup: number;
  clientPrice: number;
  costCode: string;
  costType: string;
  builderCost: string;
  margin: number;
  profit: number;
  internalNotes: string;
}

const workItem = ref({
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
});

interface leadProposalData {
  title: string;
  approvalDeadline: string;
  internalNotes: string;
  introductoryText: string;
  closingText: string;
  attachments: [];
  paymentStatus: string;
  worksheetItems: item[];
}

const leadProposalFormData = ref<leadProposalData>({
  title: "",
  attachments: [],
  approvalDeadline: "",
  internalNotes: "",
  introductoryText: "",
  closingText: "",
  paymentStatus: "",
  worksheetItems: [],
});

interface ActivityModel {
  type: string;
  color: string;
  activityDate: string;
  startTime: string;
  endTime: string;
  reminder: string;
  assignedUser: string;
  attendees: string[];
  initiatedBy: InitiatedByOption;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  description: string;
}

interface InitiatedByOption {
  value: string;
  label: string;
}

const sources = ref([
  { value: "all", label: "All" },
  { value: "contact", label: "Contact Form" },
  { value: "google", label: "Google" },
  { value: "referral", label: "Referral" },
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
    const formDataAPI = convertToFormData(leadProposalFormData.value, [
      "profileImageURL",
    ]);
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

const handlePostCodeChange = async () => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${FormData.value.postCode}&key=AIzaSyDWHedwkLGGa4_3XgPqYxIzMkFpOdKJRik`
    );
    if (response.data.status === "OK") {
      //   FormData.value.homeAddress = response.data.results[0].formatted_address;
      //   FormData.value.latitude = response.data.results[0].geometry.location.lat;
      //   FormData.value.longitude = response.data.results[0].geometry.location.lng;
      notyf.success("Address Added");
    } else if (response.data.status === "ZERO_RESULTS") {
      notyf.error("Invalid Post-Code");
    }
  } catch (error) {
    notyf.error("Invalid Post-Code");
    console.error(error);
  }
};

function DataURIToBlob(dataURI: string) {
  const splitDataURI = dataURI.split(",");
  const byteString =
    splitDataURI[0].indexOf("base64") >= 0
      ? atob(splitDataURI[1])
      : decodeURI(splitDataURI[1]);
  const mimeString = splitDataURI[0].split(":")[1].split(";")[0];
  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
  return new Blob([ia], { type: mimeString });
}
const tab = ref<"worksheet" | "format" | "preview">("worksheet");
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
const addCostItemModal = ref(false);
const showDropdown = ref(false);
const costItemsList = ref({
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
  costType: "",
  description: "",
  quantity: 0,
  unit: 0,
  unit_cost: 0,
  markup: 0,
  clientPrice: 0,
  costCode: "",
  builderCost: "",
  margin: 0,
  profit: 0,
  internalNotes: "",
  includeInCatalog: false,
  markAs: "",
  group: "",
  proposal: "",
});
const getProposalCostItems = async () => {
  try {
    proposalStore.getProposalCostItems(props.proposalId);
    // const resp = await api.get(`/api/cost/by-proposal/${props.proposalId}/`);
    // costItemsList.value = resp.data;
  } catch (err) {
    console.log(err);
  } finally {
    costItemsList.value = proposalStore.proposalCostItems;
  }
};
onMounted(async () => {
  editor.value = await import("@ckeditor/ckeditor5-build-classic").then(
    (m) => m.default
  );
  if (props.proposalId) {
    getProposalCostItems();
  }
});
</script>

<template>
  <div>
    <div class="columns is-multiline">
      <div class="column is-12 is-flex space-between">
        <div>
          <h1 class="title is-4">Proposal Worksheet</h1>
        </div>
        <div>
          <VButton
            size="small"
            light
            outlined
            icon="fas fa-cog"
            class="mr-2"
            :color="showDropdown ? 'danger' : 'success'"
            @click="showDropdown = !showDropdown"
            >Table</VButton
          >
          <VButton
            size="small"
            light
            outlined
            class="mr-2"
            color="info"
            @click="addCostItemModal = !addCostItemModal"
            >Import</VButton
          >
          <VButton
            size="small"
            light
            outlined
            class="mr-2"
            color="primary"
            @click="addCostItemModal = !addCostItemModal"
            >Add From</VButton
          >
          <VButton
            size="small"
            light
            outlined
            color="warning"
            @click="addCostItemModal = !addCostItemModal"
            >Add Item</VButton
          >
        </div>
      </div>
      <TransitionGroup class="fade-slow" name="fade-slow">
        <div v-if="showDropdown" class="column is-12">
          <VField
            v-slot="{ id }"
            label="Choose what to show to lead"
            class="column is-12"
          >
            <VControl>
              <Multiselect
                v-model="tagsValue"
                :attrs="{ id }"
                mode="tags"
                :searchable="true"
                :create-tag="true"
                :options="tagsOptions"
                placeholder="Add tags"
              />
            </VControl>
          </VField>
        </div>
      </TransitionGroup>
      <div class="tabs-wrapper column is-12 m-0">
        <div class="tabs-inner mt-4">
          <div class="tabs is-boxed">
            <ul>
              <li :class="[tab === 'worksheet' ? 'is-active' : 'not-active']">
                <a
                  tabindex="0"
                  role="button"
                  @keydown.space.prevent="tab = 'worksheet'"
                  @click="tab = 'worksheet'"
                  ><span>Worksheet</span></a
                >
              </li>
              <li :class="[tab === 'format' ? 'is-active' : 'not-active']">
                <a
                  tabindex="0"
                  role="button"
                  @keydown.space.prevent="tab = 'format'"
                  @click="tab = 'format'"
                  ><span>Format</span></a
                >
              </li>
              <li :class="[tab === 'preview' ? 'is-active' : 'not-active']">
                <a
                  tabindex="0"
                  role="button"
                  @keydown.space.prevent="tab = 'preview'"
                  @click="tab = 'preview'"
                  ><span>Preview</span></a
                >
              </li>
            </ul>
          </div>
        </div>
      </div>

      <TransitionGroup class="fade-slow" name="slide-x">
        <div v-if="tab === 'worksheet'" class="column is-12">
          <CostItemsTable
            :columnsToShow="tagsValue"
            :proposalId="props.proposalId"
          />
        </div>
      </TransitionGroup>

      <TransitionGroup class="fade-slow" name="slide-x">
        <div v-if="tab === 'format'" class="column is-12">
          <div class="columns is-multiline">
            <VField
              v-slot="{ id }"
              label="Choose what to show to lead"
              class="column is-12"
            >
              <VControl>
                <Multiselect
                  v-model="tagsValue"
                  :attrs="{ id }"
                  mode="tags"
                  :searchable="true"
                  :create-tag="true"
                  :options="tagsOptions"
                  placeholder="Add tags"
                />
              </VControl>
            </VField>
          </div>
          <VCard class="columns is-multiline m-0">
            <div class="column is-12" style="text-align: center">
              <h1 class="title is-4">Connect your clients to their projects</h1>
              <h1 class="title is-5">
                Create a client contact and assign them to jobs and lead
                opportunities effortlessly.
              </h1>
            </div>
            <div class="column is-12">
              <CostItemsTable :columnsToShow="tagsValue" />
            </div>
          </VCard>
        </div>
      </TransitionGroup>

      <TransitionGroup class="fade-slow" name="slide-x">
        <div v-if="tab === 'preview'" class="column is-12">
          <ProposalPreview :columnsToShow="tagsValue" />
        </div>
      </TransitionGroup>
    </div>
    <EstimateCostItemModal
      v-if="addCostItemModal"
      :costItemModal="addCostItemModal"
      :proposalId="props.proposalId"
      @update:modalHandler="addCostItemModal = false"
      @update:OnSuccess="getProposalCostItems"
    >
    </EstimateCostItemModal>
  </div>
</template>
