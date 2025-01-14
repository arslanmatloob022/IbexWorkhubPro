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
  leadProposalModal?: boolean;
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

const data = [
  {
    title: "More Details",
    content: "Add additional information about rota, rate or worker",
  },
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
  type: string;
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
  type: "proposal",
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

onMounted(async () => {
  editor.value = await import("@ckeditor/ckeditor5-build-classic").then(
    (m) => m.default
  );
});
</script>

<template>
  <VModal
    is="form"
    :open="props.leadProposalModal"
    title="Lead Proposal"
    size="xl"
    actions="right"
    @submit.prevent="addUpdateLeadHandler"
    @close="closeModalHandler"
  >
    <template #content>
      <div class="modal-form columns is-multiline">
        <div class="field column is-6 mb-0">
          <label>Title: *</label>
          <div class="control">
            <input
              type="text"
              name="firstName"
              v-model="leadProposalFormData.title"
              required
              class="input is-primary-focus is-primary-focus"
              placeholder="Proposal Title"
            />
          </div>
        </div>
        <div class="column is-6">
          <VField class="m-0 p-0" label="Type">
            <VControl>
              <VRadio
                v-model="leadProposalFormData.type"
                value="proposal"
                label="Proposal"
                name="solid_squared_radio"
                color="primary"
                square
                solid
              />

              <VRadio
                v-model="leadProposalFormData.type"
                value="change_order"
                label="Change Order"
                name="solid_squared_radio"
                color="info"
                square
                solid
              />

              <VRadio
                v-model="leadProposalFormData.type"
                value="draft"
                label="Draft"
                name="solid_squared_radio"
                color="warning"
                square
                solid
              />
            </VControl>
          </VField>
        </div>
        <VCollapse
          :items="data"
          with-chevron
          style="border-radius: 14px"
          class="m-3"
        >
          <template #collapse-item-content="item">
            <div class="body-inner-content">
              <div class="field columns is-multiline mb-0">
                <div class="field column is-12 mb-0">
                  <label for="" class="label">Internal Notes</label>
                  <VField>
                    <VControl>
                      <VTextarea
                        v-model="leadProposalFormData.internalNotes"
                        rows="4"
                        placeholder="Internal notes..."
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="field column is-12 mb-0">
                  <label for="" class="label">Introductory Text</label>

                  <CKEditor
                    v-if="editor"
                    v-model="leadProposalFormData.introductoryText"
                    :editor="editor"
                    :config="editorConfig"
                  />
                </div>
                <div class="field column is-12 mb-0">
                  <label for="" class="label">Closing Text</label>

                  <CKEditor
                    v-if="editor"
                    v-model="leadProposalFormData.introductoryText"
                    :editor="editor"
                    :config="editorConfig"
                  />
                </div>
              </div>
            </div>
          </template>
        </VCollapse>

        <div v-if="tab === 'worksheet'" class="column is-12">
          <WorksheetItems />
        </div>

        <div v-if="tab === 'format'" class="column is-12">
          <VCard class="columns is-multiline m-0">
            <div class="column is-12" style="text-align: center">
              <h1 class="title is-4">Connect your clients to their projects</h1>
              <h1 class="title is-5">
                Create a client contact and assign them to jobs and lead
                opportunities effortlessly.
              </h1>
            </div>
            <CostItemsTable />
          </VCard>
        </div>
        <div v-if="tab === 'preview'">
          <p>preview</p>
        </div>
      </div>
    </template>
    <template #action>
      <VButton
        :loading="isLoading"
        type="submit"
        color="primary"
        icon="fas fa-plus"
        raised
        >Create</VButton
      >
    </template>
  </VModal>
</template>
