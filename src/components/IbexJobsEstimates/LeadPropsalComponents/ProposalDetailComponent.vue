<script setup lang="ts">
import axios from "axios";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { convertToFormData } from "/@src/composable/useSupportElement";
import { useUserSession } from "/@src/stores/userSession";
import { useProposalStore } from "/@src/stores/LeadEstimatesStore/proposalStore";
import { I } from "@fullcalendar/resource/internal-common";
import { downloadProposalPdf } from "../proposalsComponents";
import { selectedColumnsToShow } from "../../CommonComponents/CostItemComponents/costItems";
const editor = shallowRef<any>();
const useProposal = useProposalStore();
const notyf = useNotyf();
const api = useApi();
const route = useRoute();
const router = useRouter();
const loading = ref(false);
const selectedStatus = ref("");
const selectedDeleteProposalId = ref("");
const DeleteSweetAlertProps = ref({
  title: "",
  subtitle: "test",
  isSweetAlertOpen: false,
  btntext: "text",
});
const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: null): void;
}>();
const props = defineProps<{
  proposalId?: string;
  leadId?: string;
}>();

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

const updateProposalHandler = async () => {
  try {
    loading.value = true;
    leadProposalFormData.value.columns_to_show = JSON.stringify(
      selectedColumnsToShow.value
    );
    const formDataAPI = convertToFormData(leadProposalFormData.value, []);
    if (props.proposalId || leadProposalFormData.value.id) {
      const response = await api.patch(
        `/api/lead-proposal/${
          props.proposalId ? props.proposalId : leadProposalFormData.value.id
        }/`,
        formDataAPI
      );
      leadProposalFormData.value = response.data;
    }

    notyf.success(`Proposal updated successfully`);
    getProposalDetail();
  } catch (error: any) {
    notyf.error(`Something went wrong, try again`);
  } finally {
    loading.value = false;
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

const openCreateTasksModal = ref(false);
const selectedProposalId = ref("");
const openCreateTasksModalHandler = (id: any) => {
  selectedProposalId.value = id;
  openCreateTasksModal.value = true;
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

const openCreateTemplate = ref(false);

const selectedProposalsIds = ref([]);
const proposalData = ref({});
const openSendProposalModal = ref(false);
const openSendProposalModalHandler = () => {
  proposalData.value = useProposal.leadProposalFormData;
  selectedProposalsIds.value.push(useProposal.leadProposalFormData);
  openSendProposalModal.value = !openSendProposalModal.value;
};

onMounted(async () => {
  editor.value = await import("@ckeditor/ckeditor5-build-classic").then(
    (m) => m.default
  );
  if (props.proposalId || route.params.id) {
    getProposalDetail();
    useProposal.getProposalDetail(props.proposalId || route.params.id);
  }
});
</script>

<template>
  <div class="modal-form columns is-multiline">
    <div class="column is-12 is-flex space-between align-items-center card">
      <div>
        <VButton
          size="xsmall"
          light
          outlined
          raised
          color="warning"
          icon="fa fa-cloud-download-alt"
          @click="downloadProposalPdf(useProposal.leadProposalFormData)"
        >
          Download
        </VButton>
        <VButton
          size="xsmall"
          light
          raised
          @click="openSendProposalModalHandler"
          class="ml-1"
          outlined
          color="success"
          icon="fas fa-envelope"
        >
          Send
        </VButton>
        <VButton
          @click="openProposalAlert('approved')"
          size="xsmall"
          v-if="leadProposalFormData.status != 'approved'"
          class="mr-2 ml-1"
          light
          outlined
          color="info"
          raised
        >
          Approved
        </VButton>
        <VButton
          v-else
          light
          size="xsmall"
          color="primary"
          class="ml-1"
          icon="fas fa-check-circle"
        >
          Approved
        </VButton>
        <VSnack
          v-if="leadProposalFormData.is_task_created"
          title="Calendar Tasks Created "
          white
          class="ml-2"
          color="info"
          icon="fas fa-calendar-check"
        >
        </VSnack>
      </div>
      <div>
        <VButton
          @click="openCreateTemplate = !openCreateTemplate"
          size="xsmall"
          class="mr-2"
          light
          outlined
          color="success"
          raised
        >
          Create Template
        </VButton>

        <VButton
          @click="openCreateTasksModalHandler(route.params.id)"
          size="xsmall"
          class="mr-2"
          light
          outlined
          color="success"
          raised
          v-if="
            !leadProposalFormData.is_task_created &&
            leadProposalFormData.status == 'approved'
          "
        >
          Generate Tasks
        </VButton>
        <VButton
          @click="updateProposalHandler"
          size="xsmall"
          class="mr-2"
          light
          outlined
          color="primary"
          raised
        >
          Update
        </VButton>
        <VButton
          size="xsmall"
          @click="openProposalDeleteAlert(leadProposalFormData.id)"
          light
          outlined
          icon="fas fa-trash"
          color="danger"
          raised
        >
          <i class="fas fa-"></i>
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
      @update:OnSuccess=""
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
</template>
