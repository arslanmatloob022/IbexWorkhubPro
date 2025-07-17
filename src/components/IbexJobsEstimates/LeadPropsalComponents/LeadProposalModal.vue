<script setup lang="ts">
import axios from "axios";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import {
  convertToFormData,
  CreateActivityLog,
} from "/@src/composable/useSupportElement";
import { useUserSession } from "/@src/stores/userSession";
import { useProposalStore } from "/@src/stores/LeadEstimatesStore/proposalStore";
import { selectedColumnsToShow } from "../../CommonComponents/CostItemComponents/costItems";
import ckeditor from "/@src/pages/elements/addons/ckeditor.vue";
import CKE from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const useProposal = useProposalStore();
const editor = shallowRef<any>();
const userSession = useUserSession();
const notyf = useNotyf();
const api = useApi();
const isLoading = ref(false);
const Loading = ref(false);

const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: null): void;
  (e: "clearProposalId", value: null): void;
}>();

const props = defineProps<{
  leadProposalModal?: boolean;
  proposalId?: string;
  leadId?: string;
  createTemplate?: boolean;
  getLeadsList?: boolean;
}>();

const selectSlotValue = ref("");
const selectSlotOptions = ref(<any>[]);

const getLeadsList = async () => {
  try {
    const response = await api.get(`/api/project/projects-short-info/`);

    selectSlotOptions.value = response.data.map((item) => {
      return {
        value: item.id.toString(),
        name: item.title,
      };
    });
    selectSlotValue.value = props.leadId || "";
  } catch {
    notyf.error("Invalid data");
  } finally {
    Loading.value = false;
  }
};

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
  is_template: boolean;
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
  is_template: false,
  attachments: [],
  columns_to_show: <any>[],
  status: "",
  created_at: "",
  updated_at: "",
});
const closeLoading = ref(false);
const addUpdateProposalHandler = async (closeModal: boolean = false) => {
  try {
    if (closeModal == true) {
      closeLoading.value = true;
    } else {
      isLoading.value = true;
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
      CreateActivityLog({
        object_type: "proposal",
        action: "UPDATE",
        performedOnName: "proposal",
        object_id: props.leadId || leadProposalFormData.value.project,
        message: `updated proposal titled <a>${leadProposalFormData.value.title}</a> information.`,
      });
    } else {
      const response = await api.post("/api/lead-proposal/", formDataAPI);
      leadProposalFormData.value = response.data;
      CreateActivityLog({
        object_type: "proposal",
        action: "CREATE",
        performedOnName: "proposal",
        object_id: props.leadId || leadProposalFormData.value.project,
        message: `created new proposal titled <a>${leadProposalFormData.value.title}</a> information.`,
      });
      scrollToItemsDiv(100);
    }
    // updateOnSuccess();
    if (closeModal == true) {
      closeModalHandler();
    }
    notyf.success(
      `Proposal ${
        props.proposalId || leadProposalFormData.value.id
          ? "updated"
          : "created"
      } successfully`
    );
  } catch (error: any) {
    notyf.error(`Something went wrong, try again`);
  } finally {
    isLoading.value = false;
    closeLoading.value = false;
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

const scrollToItemsDiv = (extraOffset: number = 0) => {
  const element = document.getElementById("items-div");
  if (element) {
    const topPosition = element.offsetTop - extraOffset; // Subtracting extra offset
    window.scrollTo({ top: topPosition, behavior: "smooth" });
  }
};

const closeModalHandler = () => {
  emit("update:modalHandler", false);
};

const updateOnSuccess = () => {
  emit("update:OnSuccess", null);
};

// const CKEditor = defineAsyncComponent(() =>
//   import("@ckeditor/ckeditor5-vue").then((m) => m.default.component)
// );

// const editorConfig = {
//   fontFamily: {
//     options: ['"Montserrat", sans-serif', '"Roboto", sans-serif'],
//   },
//   height: "400px",
//   minHeight: "400px",
// };

const openTemplate = ref(false);
const loadTemplateSelection = (selectedTemplate: any) => {
  leadProposalFormData.value = selectedTemplate;
  console.log("test12");
};

// const CKEditor = CKE.component;
// const config = {
//   fontFamily: {
//     options: [
//       '"Montserrat Variable", sans-serif',
//       '"Roboto Flex Variable", sans-serif',
//     ],
//   },
// };

onMounted(async () => {
  // editor.value = await import("@ckeditor/ckeditor5-build-classic").then(
  //   (m) => m.default
  // );
  if (props.proposalId) {
    getProposalDetail();
  }
  if (props.getLeadsList) {
    getLeadsList();
  }
  if (props.createTemplate) {
    leadProposalFormData.value.is_template = true;
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
    :title="props.createTemplate ? 'Proposal Template' : 'Lead Proposal'"
    size="xl"
    actions="right"
    @submit.prevent="addUpdateProposalHandler"
    @close="closeModalHandler"
  >
    <template #content>
      <div class="modal-form columns is-multiline">
        <!-- <div class="tabs-wrapper column is-12 m-0">
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
        </div> -->
        <!-- <div v-if="tab == 'general'" class="column is-12"> -->
        <div class="column is-12">
          <div class="columns is-multiline">
            <div
              class="field mb-0"
              :class="props.leadId ? 'column is-12' : 'column is-6'"
            >
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

            <VField
              class="is-image-select has-curved-images column is-6"
              v-if="!props.leadId && !props.createTemplate"
            >
              <label>Select Lead *</label>
              <VControl>
                <Multiselect
                  v-model="leadProposalFormData.project"
                  placeholder="Select a lead"
                  label="name"
                  :searchable="true"
                  :max-height="145"
                  :options="selectSlotOptions"
                >
                  <template #singlelabel="{ value }">
                    <div class="multiselect-single-label">
                      <span class="select-label-text">
                        {{ value.name }}
                      </span>
                    </div>
                  </template>
                  <template #option="{ option }">
                    <span class="select-label-text">
                      {{ option.name }}
                    </span>
                  </template>
                </Multiselect>
              </VControl>
            </VField>

            <div class="column is-4">
              <VField class="m-0 p-0" label="Type">
                <VControl class="m-0 p-0">
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

            <div
              class="field"
              :class="
                props.leadId || props.createTemplate
                  ? 'column is-2'
                  : 'column is-2'
              "
            >
              <label>Approval Deadline *</label>
              <div class="control">
                <input
                  type="date"
                  name="firstName"
                  v-model="leadProposalFormData.approval_deadline"
                  class="input is-primary-focus is-primary-focus"
                  placeholder="Proposal Approval deadline"
                />
              </div>
            </div>

            <div class="field column is-2">
              <label>Attachments</label>
              <VField grouped class="">
                <VControl>
                  <div class="file">
                    <label class="file-label">
                      <input
                        class="file-input"
                        type="file"
                        name="resume"
                        style="width: 100%"
                      />
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

            <div
              v-if="
                !props.createTemplate &&
                !leadProposalFormData.id &&
                !props.proposalId
              "
              class="column is-2"
            >
              <VButton
                color="primary"
                class="mt-5"
                icon="fas fa-file-import"
                @click="
                  () => {
                    if (leadProposalFormData.project || props.leadId) {
                      openTemplate = !openTemplate;
                    } else {
                      notyf.error('Please select a lead first');
                    }
                  }
                "
                style="width: 100%"
                >Templates</VButton
              >
            </div>
            <div class="field column is-2">
              <VField class="is-flex mt-3">
                <VControl raw subcontrol>
                  <VCheckbox
                    v-model="leadProposalFormData.is_template"
                    label="Create Template"
                    color="primary"
                  />
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

                  <VField>
                    <VControl>
                      <VTextarea
                        v-model="leadProposalFormData.introductory_text"
                        rows="3"
                        placeholder="Introductory Notes..."
                      />
                    </VControl>
                  </VField>
                  <!-- <div class="content">
                    <CKEditor
                      v-model="leadProposalFormData.introductory_text"
                      :editor="ClassicEditor"
                      :config="config"
                    />
                  </div> -->
                  <!-- <CKEditor
                    v-if="editor"
                    v-model="leadProposalFormData.introductory_text"
                    :editor="editor"
                    :config="editorConfig"
                  /> -->
                </div>
                <div class="field column is-12 mb-0">
                  <label for="" class="label">Closing Text</label>
                  <VField>
                    <VControl>
                      <VTextarea
                        v-model="leadProposalFormData.closing_text"
                        rows="2"
                        placeholder="Closing Text..."
                      />
                    </VControl>
                  </VField>

                  <!-- <CKEditor
                    v-model="leadProposalFormData.closing_text"
                    :editor="ClassicEditor"
                    :config="config"
                  /> -->
                  <!-- <CKEditor
                    v-if="editor"
                    v-model="leadProposalFormData.closing_text"
                    :editor="editor"
                    :config="editorConfig"
                  /> -->
                </div>
              </div>
              <!-- </template>
              </VCollapse> -->
            </div>
          </div>
        </div>
        <!-- </div> -->
        <!-- <div class="column is-12"> -->
        <!-- <div v-if="tab == 'CostWorksheet'" class="columns is-multiline"> -->
        <div class="column is-12" id="items-div">
          <div v-if="leadProposalFormData.id || props.proposalId">
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
        <!-- </div> -->
        <!-- </div> -->
      </div>
      <OpenTempalteModal
        v-if="openTemplate"
        :leadId="props.leadId || leadProposalFormData.project"
        :proposalId="props.proposalId"
        :openTemplate="openTemplate"
        @update:OnSuccess="loadTemplateSelection"
        @update:modalHandler="openTemplate = false"
      ></OpenTempalteModal>
    </template>
    <template #action>
      <VButton
        v-if="props.createTemplate"
        :loading="isLoading"
        type="submit"
        color="primary"
        raised
        >{{
          props.proposalId || leadProposalFormData.id
            ? "Update Template"
            : "Create Template"
        }}</VButton
      >

      <VButton
        v-else
        :loading="isLoading"
        type="submit"
        color="primary"
        raised
        >{{
          props.proposalId || leadProposalFormData.id
            ? "Update Proposal"
            : "Create Proposal"
        }}</VButton
      >

      <VButton
        :loading="closeLoading"
        @click="addUpdateProposalHandler(true)"
        color="info"
        raised
        >{{
          props.proposalId || leadProposalFormData.id
            ? "Update & Close"
            : "Create & Close"
        }}</VButton
      >
    </template>
    <template #cancel>
      <VButton @click="closeModalHandler()" raised>Close</VButton>
    </template>
  </VModal>
</template>
