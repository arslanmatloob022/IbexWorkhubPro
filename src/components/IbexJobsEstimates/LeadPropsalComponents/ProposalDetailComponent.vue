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
interface UserInfo {
  id: string;
  username: string;
  last_name: string;
  email: string;
  role: string;
  avatar: string | null;
}

interface ClientInfo extends UserInfo {}
interface ContractorInfo extends UserInfo {}
interface ManagerInfo extends UserInfo {}

interface JobInfo {
  id: string;
  sales_people_info: UserInfo[];
  clientInfo: ClientInfo;
  created_by_info: UserInfo | null;
  contractor_info: ContractorInfo;
  managers_list: ManagerInfo[];
  title: string;
  description: string;
  image: string;
  color: string;
  startDate: string;
  endDate: string;
  status: string;
  is_active: boolean;
  address: string;
  wifiAvaliabe: boolean;
  parkingAvaliable: boolean;
  property_features: any;
  created: string;
  uploaded_files: any[];
  leadStatus: string;
  current_state: string;
  city: string;
  state: string;
  zip_code: string;
  confidence: string;
  sale_date: string | null;
  estimated_from: string | null;
  estimated_to: string | null;
  tags: string[];
  sources: string | null;
  project_type: string | null;
  notes: string;
  attach_mail: string | null;
  latitude: number;
  longitude: number;
  client: string;
  contractor: string;
  created_by: string | null;
  managers: string[];
  sales_people: string[];
}

interface ProposalData {
  id: string;
  jobInfo: JobInfo;
  proposalAmount: number;
  cost_items: number;
  title: string;
  approval_deadline: string;
  internal_notes: string;
  introductory_text: string | null;
  closing_text: string | null;
  payment_status: string;
  type: string;
  status: string;
  columns_to_show: string[];
  client_note: string | null;
  created_at: string;
  updated_at: string;
  is_task_created: boolean;
  is_template: boolean;
  job: string | null;
  project: string;
}

const proposalData = ref<ProposalData>({
  id: "",
  jobInfo: {
    id: "",
    sales_people_info: [],
    clientInfo: {
      id: "",
      username: "",
      last_name: "",
      email: "",
      role: "",
      avatar: null,
    },
    created_by_info: null,
    contractor_info: {
      id: "",
      username: "",
      last_name: "",
      email: "",
      role: "",
      avatar: null,
    },
    managers_list: [],
    title: "",
    description: "",
    image: "",
    color: "",
    startDate: "",
    endDate: "",
    status: "",
    is_active: false,
    address: "",
    wifiAvaliabe: false,
    parkingAvaliable: false,
    property_features: null,
    created: "",
    uploaded_files: [],
    leadStatus: "",
    current_state: "",
    city: "",
    state: "",
    zip_code: "",
    confidence: "",
    sale_date: null,
    estimated_from: null,
    estimated_to: null,
    tags: [],
    sources: "",
    project_type: null,
    notes: "",
    attach_mail: null,
    latitude: 0.0,
    longitude: 0.0,
    client: "",
    contractor: "",
    created_by: null,
    managers: [],
    sales_people: [],
  },
  proposalAmount: 0,
  cost_items: 0,
  title: "",
  approval_deadline: "",
  internal_notes: "",
  introductory_text: null,
  closing_text: null,
  payment_status: "",
  type: "",
  status: "",
  columns_to_show: [],
  client_note: null,
  created_at: "",
  updated_at: "",
  is_task_created: false,
  is_template: false,
  job: null,
  project: "",
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
    // notyf.blue("calling in detail");
    const response = await api.get(
      `/api/lead-proposal/${route.params.id}/detail/`
    );
    leadProposalFormData.value = response.data;
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
    // useProposal.getProposalDetail(props.proposalId || route.params.id);
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
  <div>
    <div class="modal-form columns is-multiline">
      <div
        class="column is-12 is-flex space-between align-items-center bg-transparent mx-3"
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

          <!-- <VButton
            size="small"
            class="mr-2"
            v-tooltip.rounded.dark.bottom="`Update Proposal`"
            outlined
            color="info"
            raised
            @click="openLeadProposalModal = true"
          >
            <i class="fas fa-pen" aria-hidden="true"></i>
          </VButton> -->

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
            v-tooltip.rounded.primary.bottom="
              `Create Template Of This Proposal`
            "
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
            @keyup.prevent.enter="
              updateProposal({ title: leadProposalFormData.title })
            "
            v-model="leadProposalFormData.title"
            required
            class="input is-primary-focus is-primary-focus"
            placeholder="Proposal Title"
          />
          <!-- @blur="updateProposal({ title: leadProposalFormData.title })" -->
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
            @change="
              updateProposal({
                approval_deadline: leadProposalFormData.approval_deadline,
              })
            "
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
      <div class="field column is-12 m-3">
        <VCollapse :items="data" with-chevron>
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
          v-if="leadProposalFormData"
          :proposalData="leadProposalFormData"
          :proposalId="route.params.id"
          @update:OnSuccess="getProposalDetail"
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
  </div>
</template>
