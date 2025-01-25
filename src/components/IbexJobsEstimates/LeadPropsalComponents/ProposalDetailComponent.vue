<script setup lang="ts">
import axios from "axios";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { useCompany } from "/@src/stores/company";
import { convertToFormData } from "/@src/composable/useSupportElement";
import { useUserSession } from "/@src/stores/userSession";
import { useProposalStore } from "/@src/stores/LeadEstimatesStore/proposalStore";
import { I } from "@fullcalendar/resource/internal-common";
const editor = shallowRef<any>();
const useProposal = useProposalStore();
const userSession = useUserSession();
const notyf = useNotyf();
const api = useApi();
const route = useRoute();
const router = useRouter();
const FormData = ref({});
const loading = ref(false);
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
  approvalDeadline: string;
  internalNotes: string;
  introductoryText: string;
  closingText: string;
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
  worksheetItems: [],
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
  if (props.proposalId || route.params.id) {
    getProposalDetail();
  }
});
</script>

<template>
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
                v-model="leadProposalFormData.closingText"
                :editor="editor"
                :config="editorConfig"
              />
            </div>
          </div>
        </div>
      </template>
    </VCollapse>
    <WorksheetItems
      :proposalData="leadProposalFormData"
      :proposalId="leadProposalFormData.id"
    />
  </div>
</template>
