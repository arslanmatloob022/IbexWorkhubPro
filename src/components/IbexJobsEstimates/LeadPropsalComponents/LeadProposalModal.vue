<script setup lang="ts">
import axios from "axios";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { convertToFormData } from "/@src/composable/useSupportElement";
import { useUserSession } from "/@src/stores/userSession";
import { useProposalStore } from "/@src/stores/LeadEstimatesStore/proposalStore";

const useProposal = useProposalStore();
const editor = shallowRef<any>();
const userSession = useUserSession();
const notyf = useNotyf();
const api = useApi();
const isLoading = ref(false);
const FormData = ref({});
const tab = ref("general");
const openAddContactModal = ref(false);

const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: null): void;
  (e: "clearProposalId", value: null): void;
}>();
const props = defineProps<{
  leadProposalModal?: boolean;
  proposalId?: string;
  leadId?: string;
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
  approval_deadline: string;
  internal_notes: string;
  introductory_text: any;
  closing_text: any;
  attachments: [];
  payment_status: string;
  worksheetItems: item[];
  type: string;
  job: "";
  status: string;
  created_at: string;
  updated_at: string;
}

const leadProposalFormData = ref<leadProposalData>({
  title: "",
  approval_deadline: "",
  internal_notes: "",
  introductory_text: null,
  closing_text: null,
  payment_status: "",
  worksheetItems: [],
  type: "proposal",
  job: "",
  attachments: [],
  status: "",
  created_at: "",
  updated_at: "",
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

// scheduleEmailDateTime: string;
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

const newCreatedLead = ref("");

const addUpdateProposalHandler = async () => {
  try {
    isLoading.value = true;
    if (props.leadId) {
      leadProposalFormData.value.job = props.leadId;
    }
    const formDataAPI = convertToFormData(leadProposalFormData.value, []);
    if (props.proposalId) {
      const response = await api.patch(
        `/api/lead-proposal/${props.proposalId}/`,
        formDataAPI
      );
    } else {
      const response = await api.post("/api/lead-proposal/", formDataAPI);
      newCreatedLead.value = response.data.id;
      leadProposalFormData.value = response.data;
    }
    updateOnSuccess();
    notyf.dismissAll();
    notyf.success(
      `Proposal ${props.proposalId ? "updated" : "created"} successfully`
    );
  } catch (error: any) {
    notyf.error(` ${error}, New Worker`);
  } finally {
    isLoading.value = false;
  }
};

const getProposalDetail = async () => {
  try {
    const response = await api.get(`/api/lead-proposal/${props.proposalId}/`);
    leadProposalFormData.value = response.data;
  } catch (err) {
    console.log(err);
  } finally {
  }
};

const closeModalHandler = () => {
  emit("update:modalHandler", false);
};

const updateOnSuccess = () => {
  emit("update:OnSuccess", null);
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
  if (props.proposalId) {
    getProposalDetail();
    // useProposal.getProposalCostItems(props.proposalId);
  }
});
onUnmounted(() => {
  emit("clearProposalId", null);
  leadProposalFormData.value = {};
});
</script>

<template>
  <VModal
    is="form"
    :open="props.leadProposalModal"
    title="Lead Proposal"
    size="xl"
    actions="right"
    @submit.prevent="addUpdateProposalHandler"
    @close="closeModalHandler"
  >
    <template #content>
      <div class="modal-form columns is-multiline">
        <div class="tabs-wrapper column is-12 m-0">
          <div class="tabs-inner">
            <div class="tabs is-boxed">
              <ul>
                <li :class="[tab === 'general' ? 'is-active' : 'not-active']">
                  <a
                    tabindex="0"
                    role="button"
                    @keydown.space.prevent="tab = 'general'"
                    @click="tab = 'general'"
                    ><span>Proposal</span></a
                  >
                </li>
                <li
                  :class="[
                    tab === 'CostWorksheet' ? 'is-active' : 'not-active',
                  ]"
                >
                  <a
                    tabindex="0"
                    role="button"
                    @keydown.space.prevent="tab = 'CostWorksheet'"
                    @click="tab = 'CostWorksheet'"
                    ><span>Worksheet</span></a
                  >
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div v-if="tab == 'general'" class="columns is-multiline">
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
          <div class="field column is-6">
            <label>Approval Deadline *</label>
            <div class="control">
              <input
                type="date"
                name="firstName"
                v-model="leadProposalFormData.approval_deadline"
                required
                class="input is-primary-focus is-primary-focus"
                placeholder="Proposal Approval deadline"
              />
            </div>
          </div>
          <div class="field column is-6">
            <label>Attachments</label>
            <VField grouped>
              <VControl>
                <div class="file">
                  <label class="file-label">
                    <input class="file-input" type="file" name="resume" />
                    <span class="file-cta">
                      <span class="file-icon">
                        <i class="fas fa-cloud-upload-alt" />
                      </span>
                      <span class="file-label"> Choose a file… </span>
                    </span>
                  </label>
                </div>
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
                          v-model="leadProposalFormData.internal_notes"
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
                      v-model="leadProposalFormData.introductory_text"
                      :editor="editor"
                      :config="editorConfig"
                    />
                  </div>
                  <div class="field column is-12 mb-0">
                    <label for="" class="label">Closing Text</label>

                    <CKEditor
                      v-if="editor"
                      v-model="leadProposalFormData.closing_text"
                      :editor="editor"
                      :config="editorConfig"
                    />
                  </div>
                </div>
              </div>
            </template>
          </VCollapse>
        </div>
        <div v-if="tab == 'CostWorksheet'" class="columns is-multiline">
          <WorksheetItems
            :proposalId="
              leadProposalFormData.id
                ? leadProposalFormData.id
                : props.proposalId
            "
            :proposalData="leadProposalFormData"
          />
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
