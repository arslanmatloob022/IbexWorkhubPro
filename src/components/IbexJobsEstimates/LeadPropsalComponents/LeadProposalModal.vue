<script setup lang="ts">
import axios from "axios";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { convertToFormData } from "/@src/composable/useSupportElement";
import { useUserSession } from "/@src/stores/userSession";
import { useProposalStore } from "/@src/stores/LeadEstimatesStore/proposalStore";
import { selectedColumnsToShow } from "../../CommonComponents/CostItemComponents/costItems";

const useProposal = useProposalStore();
const editor = shallowRef<any>();
const userSession = useUserSession();
const notyf = useNotyf();
const api = useApi();
const isLoading = ref(false);
const FormData = ref({});
const newCreatedLead = ref("");
const tab = ref("general");

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

interface leadProposalData {
  id: string;
  title: string;
  approval_deadline: string;
  internal_notes: string;
  introductory_text: any;
  closing_text: any;
  attachments: [];
  columns_to_show: [];
  payment_status: string;
  worksheetItems: item[];
  type: string;
  project: "";
  status: string;
  created_at: string;
  updated_at: string;
}

const leadProposalFormData = ref<leadProposalData>({
  id: "",
  title: "",
  approval_deadline: "",
  internal_notes: "",
  introductory_text: null,
  closing_text: null,
  payment_status: "",
  worksheetItems: [],
  type: "proposal",
  project: "",
  attachments: [],
  columns_to_show: <any>[],
  status: "",
  created_at: "",
  updated_at: "",
});

const addUpdateProposalHandler = async (showNotyf: any = true) => {
  try {
    isLoading.value = true;
    if (!leadProposalFormData.value.title && !showNotyf) {
      return;
    }
    if (props.leadId) {
      leadProposalFormData.value.project = props.leadId;
    }
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
    } else {
      const response = await api.post("/api/lead-proposal/", formDataAPI);
      leadProposalFormData.value = response.data;
    }
    updateOnSuccess();
    if (showNotyf) {
      notyf.success(
        `Proposal ${
          props.proposalId || leadProposalFormData.value.id
            ? "updated"
            : "created"
        } successfully`
      );
    }
  } catch (error: any) {
    notyf.error(`Something went wrong, try again`);
  } finally {
    isLoading.value = false;
  }
};

const getProposalDetail = async () => {
  try {
    const response = await api.get(`/api/lead-proposal/${props.proposalId}/`);
    leadProposalFormData.value = response.data;
    selectedColumnsToShow.value = response.data.columns_to_show;
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
                    :disabled="leadProposalFormData.title ? true : false"
                    @keydown.space.prevent="tab = 'CostWorksheet'"
                    @click="
                      () => {
                        tab = 'CostWorksheet';
                        addUpdateProposalHandler(false);
                      }
                    "
                    ><span>Worksheet</span></a
                  >
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div v-if="tab == 'general'" class="column is-12">
          <div class="columns is-multiline">
            <div class="field column is-6 mb-0">
              <label>Title: *</label>
              <div class="control">
                <input
                  type="text"
                  name="title"
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
            <div class="column is-12">
              <!-- <VCollapse :items="data" with-chevron>
                <template #collapse-item-content="item"> -->
              <div class="body-inner-content columns is-multiline">
                <div class="field column is-12">
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
              <!-- </template>
              </VCollapse> -->
            </div>
          </div>
        </div>
        <div class="column is-12">
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
      </div>
    </template>
    <template #action>
      <VButton :loading="isLoading" type="submit" color="primary" raised>{{
        props.proposalId ? "Update Proposal" : "Create Proposal"
      }}</VButton>
    </template>
    <template #cancel>
      <VButton @click="closeModalHandler()" raised>Close</VButton>
    </template>
  </VModal>
</template>
