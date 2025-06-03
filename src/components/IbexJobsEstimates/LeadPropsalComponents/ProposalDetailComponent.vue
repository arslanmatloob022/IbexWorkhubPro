<script setup lang="ts">
import axios from "axios";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { convertToFormData } from "/@src/composable/useSupportElement";
import { useProposalStore } from "/@src/stores/LeadEstimatesStore/proposalStore";
import { downloadProposalPdf, fileLoading } from "../proposalsComponents";
import { selectedColumnsToShow } from "../../CommonComponents/CostItemComponents/costItems";
import { useDropdown } from "/@src/composable/useDropdown";
import { useCostCodeStore } from "/@src/stores/LeadEstimatesStore/costCodeStore";

const dropdownElement = ref<HTMLElement>();
const dropdown = useDropdown(dropdownElement);
const editor = shallowRef<any>();
const useCostCodes = useCostCodeStore();
const useProposal = useProposalStore();
const notyf = useNotyf();
const api = useApi();
const route = useRoute();
const router = useRouter();
const openCreateTemplate = ref(false);
const openEstimatesModal = ref(false);
const selectedProposalsIds = ref([]);
const proposalData = ref({
  id: "6514840e-97e7-443c-b383-0b1368aee7ba",
  jobInfo: {
    id: "1be101da-7a93-43af-b3e3-d1ca908aa2c9",
    sales_people_info: [
      {
        id: "085f43b6-e869-495e-a712-781324ecc497",
        username: "Arslan",
        last_name: "Matloob",
        email: "raoarslan263@gmail.com",
        role: "admin",
        avatar: null,
      },
      {
        id: "709ef38f-b1e3-48f2-8cd9-5a8e3e0c9a1b",
        username: "APIs",
        last_name: "Dev",
        email: "api@dev.com",
        role: "admin",
        avatar: null,
      },
      {
        id: "0feda007-d8a0-4b96-acb7-d7763614854e",
        username: "Test &",
        last_name: "Dev",
        email: "test@dev.com",
        role: "admin",
        avatar:
          "https://ibex-documents.s3.us-east-2.amazonaws.com/public/static/users_avatars/Screenshot_from_2025-01-17_15-14-32.png",
      },
    ],
    clientInfo: {
      id: "5989539e-7914-47de-b29f-6009df3887da",
      username: "Client",
      last_name: "Test",
      email: "testclient@ibex.com",
      role: "client",
      avatar:
        "https://ibex-documents.s3.us-east-2.amazonaws.com/public/static/users_avatars/Untitled_design.png",
    },
    created_by_info: null,
    contractor_info: {
      id: "4a097ddf-49cd-4274-9db9-c17de02f7847",
      username: "Leighton Cash",
      last_name: "",
      email: "lc@ibex.com",
      role: "contractor",
      avatar: null,
    },
    managers_list: [
      {
        id: "0d8a9a08-b932-463c-8795-5bd290f88c1a",
        username: "Test",
        last_name: "Manager",
        email: "raoarslanmatloob@gmail.com",
        role: "manager",
        avatar:
          "https://ibex-documents.s3.us-east-2.amazonaws.com/public/static/users_avatars/not-available_j5Ubfud.png",
      },
    ],
    title: "HENNING (Test Arslan)",
    description: "",
    image:
      "https://ibex-documents.s3.us-east-2.amazonaws.com/public/static/projects_images/powerpoint.png",
    color: "#2c3e50",
    startDate: "2025-03-03",
    endDate: "2025-03-08",
    status: "completed",
    is_active: false,
    address: "Lahore, 54000, Pakistan",
    wifiAvaliabe: false,
    parkingAvaliable: false,
    property_features: null,
    created: "2025-02-20T14:42:53.915448-05:00",
    uploaded_files: [],
    leadStatus: "open",
    current_state: "job",
    city: "Lahore",
    state: "Punjab",
    zip_code: "54000",
    confidence: "0.00",
    sale_date: null,
    estimated_from: null,
    estimated_to: null,
    tags: ["Lead", "Floor Work", "Tile Work", "Carpenter"],
    sources: "Contact Form",
    project_type: null,
    notes:
      "<p>We’re excited to have you on board as our <strong>Marketing Expert and Social Media Manager</strong>. Looking forward to your <i>creativity</i>, <i>insights</i>, and the amazing work ahead. Here's to filling the gap with the perfect fit—we're glad you're here!</p>",
    attach_mail: null,
    latitude: 31.5440886,
    longitude: 74.3839007,
    client: "5989539e-7914-47de-b29f-6009df3887da",
    contractor: "4a097ddf-49cd-4274-9db9-c17de02f7847",
    created_by: null,
    managers: ["0d8a9a08-b932-463c-8795-5bd290f88c1a"],
    sales_people: [
      "085f43b6-e869-495e-a712-781324ecc497",
      "709ef38f-b1e3-48f2-8cd9-5a8e3e0c9a1b",
      "0feda007-d8a0-4b96-acb7-d7763614854e",
    ],
  },
  proposalAmount: 0,
  cost_items: 0,
  title: "Test propoosal",
  approval_deadline: "2025-04-30",
  internal_notes: "Internal notes",
  introductory_text: null,
  closing_text: null,
  payment_status: "Pending",
  type: "draft",
  status: "pending",
  columns_to_show: [
    "title",
    "cost_code",
    "description",
    "quantity",
    "unit_cost",
    "unit",
    "total_price",
  ],
  client_note: null,
  created_at: "2025-05-05T12:45:39.264071-04:00",
  updated_at: "2025-05-23T13:57:27.955954-04:00",
  is_task_created: false,
  is_template: false,
  job: null,
  project: "1be101da-7a93-43af-b3e3-d1ca908aa2c9",
});
const openCreateTasksModal = ref(false);
const selectedProposalId = ref("");
const loading = ref(false);
const fileLoading2 = ref(false);
const selectedStatus = ref("");
const selectedDeleteProposalId = ref("");
const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: null): void;
}>();

const props = defineProps<{
  proposalId?: string;
  leadId?: string;
}>();

const DeleteSweetAlertProps = ref({
  title: "",
  subtitle: "test",
  isSweetAlertOpen: false,
  btntext: "text",
});

const openSendProposalModal = ref(false);
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

const data = [
  {
    title: "More Details",
    content: "Add additional information about rota, rate or worker",
  },
];

const SweetAlertProps = ref({
  title: "",
  subtitle: "test",
  isSweetAlertOpen: false,
  btntext: "text",
});

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

interface leadProposalData {
  title: string;
  approval_deadline: string;
  approvalDeadline: string;
  internalNotes: string;
  introductoryText: string;
  closingText: string;
  client_note: string;
  attachments: [];
  paymentStatus: string;
  worksheetItems: item[];
  type: string;
}
// <leadProposalData>
const leadProposalFormData = ref({
  id: "",
  title: "",
  approval_deadline: "",
  attachments: [],
  approvalDeadline: "",
  internalNotes: "",
  introductoryText: "",
  closingText: "",
  paymentStatus: "",
  is_task_created: "",
  client_note: "",
  worksheetItems: [],
  columns_to_show: [],
  type: "proposal",
});

const getProposalDetail = async () => {
  try {
    const response = await api.get(
      `/api/lead-proposal/${route.params.id}/detail/`
    );
    leadProposalFormData.value = response.data;
    useProposal.getProposalCostItems(route.params.id);
  } catch (err) {
    console.log(err);
  } finally {
  }
};

const openProposalDeleteAlert = (id: any) => {
  selectedDeleteProposalId.value = id;
  DeleteSweetAlertProps.value = {
    title: "Delete Proposal?",
    subtitle:
      "Are you sure to delete this proposal? After delete you will not be able to recover it again.",
    btntext: "Yes delete",
    isSweetAlertOpen: true,
  };
};

const DeleteProposalHandler = async () => {
  try {
    loading.value = true;
    const response = await api.delete(
      `/api/lead-proposal/${selectedDeleteProposalId.value}/`
    );
    SweetAlertProps.value.isSweetAlertOpen = false;
    notyf.success("Proposal delete successfully");
    router.go(-1);
  } catch (error: any) {
    notyf.error(` ${error}, Proposal`);
    notyf.error("Something went wrong please try later");
  } finally {
    loading.value = false;
  }
};
const openProposalAlert = (status: any) => {
  selectedStatus.value = status;
  SweetAlertProps.value = {
    title: `${selectedStatus.value.toLocaleUpperCase()} proposal ?`,
    subtitle: `${
      selectedStatus.value == "approved"
        ? "You are going to approve this proposal and as you do so Ibex Team will start working on mentioned work."
        : "You are about to Disapprove the proposal that will identify us that you are not going to have done the mentioned work at your site."
    }`,
    btntext: `${selectedStatus.value == "approved" ? "Approve" : "Disapprove"}`,
    isSweetAlertOpen: true,
  };
};

const updateProposalStatus = async () => {
  try {
    loading.value = true;
    const resp = await api.patch(`/api/lead-proposal/${route.params.id}/`, {
      status: selectedStatus.value,
    });
    getProposalDetail();
    notyf.success(`You have ${selectedStatus.value} this proposal.`);
    SweetAlertProps.value.isSweetAlertOpen = false;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const updateProposal = async (payload: any) => {
  try {
    loading.value = true;
    const resp = await api.patch(
      `/api/lead-proposal/${route.params.id}/`,
      payload
    );
    notyf.success("Proposal updated successfully");
    getProposalDetail();
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};
const openLeadProposalModal = ref(false);
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

const openSendProposalModalHandler = () => {
  proposalData.value = useProposal.leadProposalFormData;
  selectedProposalsIds.value.push(useProposal.leadProposalFormData);
  openSendProposalModal.value = !openSendProposalModal.value;
};

const openCreateTasksModalHandler = (id: any) => {
  selectedProposalId.value = id;
  openCreateTasksModal.value = true;
};

const openEstimateFileModalHandler = () => {
  openEstimatesModal.value = true;
};

const getProposalDetailItem = () => {
  if (props.proposalId || route.params.id) {
    getProposalDetail();
    useProposal.getProposalDetail(props.proposalId || route.params.id);
  }
};

onMounted(async () => {
  editor.value = await import("@ckeditor/ckeditor5-build-classic").then(
    (m) => m.default
  );
  getProposalDetailItem();
  useCostCodes.getCostCodesHandler();
});
</script>

<template>
  <div class="modal-form columns is-multiline">
    <div
      class="column is-12 is-flex space-between align-items-center bg-grey mx-3"
    >
      <div class="is-flex">
        <VSnack
          v-if="leadProposalFormData.is_task_created"
          title="Calendar Tasks Created "
          white
          class="ml-2"
          color="info"
          icon="fas fa-calendar-check"
        >
        </VSnack>
        <VButton
          @click="openProposalAlert('approved')"
          size="small"
          v-if="leadProposalFormData.status != 'approved'"
          class="ml-2"
          light
          outlined
          color="info"
          raised
        >
          Approve Proposal
        </VButton>
        <VButton
          v-else
          light
          size="small"
          color="primary"
          class="ml-1 mt-1"
          icon="fas fa-check-circle"
        >
          Approved
        </VButton>
        <VButton
          size="small"
          class="mr-2"
          light
          outlined
          color="success"
          raised
          @click="openCreateTasksModalHandler(route.params.id)"
          v-if="
            !leadProposalFormData.is_task_created &&
            leadProposalFormData.status == 'approved'
          "
        >
          Generate Tasks
        </VButton>
      </div>
      <div class="is-flex">
        <div
          v-if="fileLoading2 || fileLoading == 3"
          class="rounded-loader mr-2"
        ></div>

        <VButton
          size="small"
          class="mr-2"
          v-tooltip.rounded.dark.bottom="`Update Proposal`"
          outlined
          color="info"
          raised
          @click="openLeadProposalModal = true"
        >
          <i class="fas fa-pen" aria-hidden="true"></i>
        </VButton>

        <VButton
          size="small"
          class="mr-2"
          v-tooltip.rounded.dark.bottom="`Upload File To Create Estimates`"
          outlined
          color="dark"
          raised
          @click="openEstimateFileModalHandler"
        >
          <i class="fas fa-cloud-upload-alt" aria-hidden="true"></i>
        </VButton>

        <VButton
          size="small"
          class="mr-2"
          light
          v-tooltip.rounded.primary.bottom="`Create Template Of This Proposal`"
          outlined
          @click="openCreateTemplate = !openCreateTemplate"
          color="primary"
          raised
        >
          <i class="fas fa-copy"> </i>
        </VButton>

        <VButton
          size="small"
          class="mr-2"
          light
          v-tooltip.rounded.warning.bottom="`Attach in email`"
          outlined
          @click="openSendProposalModalHandler"
          color="warning"
          raised
        >
          <i class="fas fa-envelope"> </i>
        </VButton>
        <VButton
          size="small"
          outlined
          light
          class="mr-2"
          v-tooltip.rounded.info.bottom="`Download Proposal As PDF`"
          @click="downloadProposalPdf(leadProposalFormData)"
          color="info"
          raised
        >
          <i class="fas fa-cloud-download-alt" aria-hidden="true"></i>
        </VButton>
        <VButton
          size="small"
          class="mr-2"
          light
          v-tooltip.rounded.danger.bottom="`Delete Proposal`"
          outlined
          @click="openProposalDeleteAlert(leadProposalFormData.id)"
          color="danger"
          raised
        >
          <i class="fas fa-trash" />
        </VButton>
      </div>
    </div>
    <div
      v-if="
        leadProposalFormData.client_note &&
        leadProposalFormData.status == 'review'
      "
      class="column is-12"
    >
      <VMessage color="warning">
        {{ leadProposalFormData.client_note }}</VMessage
      >
    </div>
    <div class="field column is-6 mb-0">
      <label>Title: *</label>
      <div class="control">
        <input
          type="text"
          name="firstName"
          v-model="leadProposalFormData.title"
          required
          disabled
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
            @update:model-value="updateProposal({ type: 'proposal' })"
            solid
          />

          <VRadio
            v-model="leadProposalFormData.type"
            value="change_order"
            @update:model-value="updateProposal({ type: 'change_order' })"
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
            @update:model-value="updateProposal({ type: 'draft' })"
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
          disabled
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
    <div class="field column is-12">
      <VCollapse
        :items="data"
        with-chevron
        style="border-radius: 14px"
        class="m-3"
      >
        <template #collapse-item-content="item">
          <div class="body-inner-content">
            <div class="field columns is-multiline mb-0">
              <div class="field column is-11 mb-0">
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
              <div class="field column is-11 mb-0">
                <label for="" class="label">Introductory Text</label>

                <CKEditor
                  v-if="editor"
                  v-model="leadProposalFormData.introductoryText"
                  :editor="editor"
                  :config="editorConfig"
                />
              </div>
              <div class="field column is-11 mb-0">
                <label for="" class="label">Closing Text</label>
                <CKEditor
                  v-if="editor"
                  v-model="leadProposalFormData.closingText"
                  :editor="editor"
                  :config="editorConfig"
                />
              </div>
            </div>
          </div>
        </template>
      </VCollapse>
    </div>
    <div class="column is-12">
      <WorksheetItems
        :proposalData="leadProposalFormData"
        :proposalId="leadProposalFormData.id"
      />
    </div>

    <SweetAlert
      v-if="SweetAlertProps.isSweetAlertOpen"
      :isSweetAlertOpen="SweetAlertProps.isSweetAlertOpen"
      :title="SweetAlertProps.title"
      :subtitle="SweetAlertProps.subtitle"
      :btntext="SweetAlertProps.btntext"
      :onConfirm="updateProposalStatus"
      :onCancel="() => (SweetAlertProps.isSweetAlertOpen = false)"
    />
    <SweetAlert
      v-if="DeleteSweetAlertProps.isSweetAlertOpen"
      :isSweetAlertOpen="DeleteSweetAlertProps.isSweetAlertOpen"
      :title="DeleteSweetAlertProps.title"
      :subtitle="DeleteSweetAlertProps.subtitle"
      :btntext="DeleteSweetAlertProps.btntext"
      :onConfirm="DeleteProposalHandler"
      :onCancel="() => (DeleteSweetAlertProps.isSweetAlertOpen = false)"
    />
    <CreateProposalTasksModal
      v-if="openCreateTasksModal"
      :createProposalTasksModal="openCreateTasksModal"
      :proposalId="selectedProposalId"
      @closeModalHandler="openCreateTasksModal = false"
    />
    <SendProposalEmailModal
      v-if="openSendProposalModal"
      :proposalSenderModal="openSendProposalModal"
      :selectedProposalsIds="selectedProposalsIds"
      :proposalData="proposalData"
      @update:modalHandler="
        openSendProposalModal = false;
        selectedProposalsIds = [];
      "
    />
  </div>
  <UploadEstimateFileModal
    v-if="openEstimatesModal"
    :openEstimatesModal="openEstimatesModal"
    :proposalId="route.params.id"
    @close:ModalHandler="openEstimatesModal = false"
    @update:OnSuccess="getProposalDetailItem"
  />
  <CreateTemplateModal
    v-if="openCreateTemplate"
    :proposalId="route.params.id"
    :openCreateTemplate="openCreateTemplate"
    @update:OnSuccess="
      () => {
        props.proposalId || route.params.id ? getProposalDetail() : '';
      }
    "
    @update:modalHandler="openCreateTemplate = false"
  ></CreateTemplateModal>
  <LeadProposalModal
    v-if="openLeadProposalModal"
    :leadId="proposalData.project"
    :proposalId="route.params.id"
    :leadProposalModal="openLeadProposalModal"
    :getLeadsList="false"
    @update:modalHandler="
      () => {
        getProposalDetailItem();
        openLeadProposalModal = false;
      }
    "
    @clearProposalId="selectedProposalId = ''"
  />
</template>
