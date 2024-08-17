<script setup lang="ts">
import VueScrollTo from "vue-scrollto";
import { useNotyf } from "/@src/composable/useNotyf";
import sleep from "/@src/utils/sleep";
import { useApi } from "/@src/composable/useAPI";
import axios from "axios";
import { useUserSession } from "/@src/stores/userSession";
import { changeFavicon } from "/@src/composable/useSupportElement";
import { useDarkmode } from "/@src/stores/darkmode";
import { useLayoutSwitcher } from "/@src/stores/layoutSwitcher";
const userSession = useUserSession();
const api = useApi();
const router = useRouter();
const notyf = useNotyf();
const { scrollTo } = VueScrollTo;
const currentStep = ref(0);
const isLoading = ref(false);
const currentHelp = ref(-1);
const route = useRoute();
const siaNumber = ref("");
const currentWorkerId = ref(0);
const fileView = ref("");
const isEmptyPostCode = ref(true);
const privacyCheck = ref(false);
const documentTab = ref(false);
const tokenData = ref({
  id: "",
  token: "",
  industry: { id: "", name: "", industryLogo: "" },
  company: <any>{},
  supplier: <any>{},
});
const combinedArray = ref([]);
const selectedDocRow = ref({});
const fileInput = ref<HTMLInputElement | null>(null);
const pdfPreviewModal = ref(false);
const currentPdfPreview = ref("");
const currentSelectedID = ref(0);
const showSupllierInput = ref(false);
const layoutSwitcher = useLayoutSwitcher();
const darkmode = useDarkmode();
const SweetAlertProps = ref({
  title: "",
  subtitle: "test",
  isSweetAlertOpen: false,
  btntext: "text",
});

const ConfirmSweetAlertProps = ref({
  alertIcon: "fa fa-bell",
  title: "",
  subtitle: "",
  isConfirmSweetAlertOpen: false,
  btntext: "text",
});

const FormData = ref({
  id: "",
  firstName: "",
  lastName: "",
  emailAddress: "",
  phoneNumber: "",
  lineManager: "",
  homeAddress: "",
  profileImageURL: null as File | null,
  externalID: "",
  compnayIdCardNumber: "",
  compnayIdCardExpiryDate: "",
  industry: "",
  arezCompany: "",
  postCode: "",
  supplier: 0,
});
const SIAdata = ref({
  id: 0,
  firstName: "",
  surName: "",
  licenceNumber: "",
  role: "",
  licenceSector: "",
  expiryDate: "",
  status: false,
  statusExplanation: "",
  additionalLicenceConditions: "",
  isDefault: false,
  created_at: "",
  worker: "",
});
const columns = {
  documentTitle: {
    label: "",
    grow: "lg",
    media: true,
  },
  // document: {
  //   label: "Document",
  //   align: "center",
  // },
  actions: {
    label: "Actions",
    align: "end",
  },
} as const;
const inputChangeHandler = (event: any) => {
  console.log(FormData.value);
  if (event.name === "supplier") {
    FormData.value = { ...FormData.value, [event.name]: event.value };
    return;
  }
  FormData.value = {
    ...FormData.value,
    [event.target.name]: event.target.value,
  };
};

const addWorkerHandler = async () => {
  isLoading.value = true;
  try {
    const formDataAPI = new window.FormData();
    for (const key in FormData.value) {
      if (
        key !== "profileImageURL" ||
        FormData.value.profileImageURL !== null
      ) {
        formDataAPI.append(key, FormData.value[key]);
      }
    }
    if (!showSupllierInput.value) {
      formDataAPI.delete("supplier");
    }
    // formDataAPI.append("arezCompany", tokenData.value.company);
    formDataAPI.append("invitationToken", tokenData.value.token);

    const response = await api.post(
      "/v3/api/worker/add-worker-through-invitation/",
      formDataAPI
    );
    userSession.setCode(response.data.activationCode);
    currentWorkerId.value = response.data.id;
    tokenData.value.industry.name.toLowerCase() === "security"
      ? (currentStep.value += 1)
      : ((currentStep.value += 2), getWorkerDocuments());
    nextTick(() => {
      scrollTo(`#form-step-${currentStep.value}`, 1000);
      isLoading.value = false;
    });
  } catch (error: any) {
    let errorObj = error.response.data ?? {};
    Object.values(errorObj).forEach((values) => {
      values.forEach((value) => {
        console.log(value);
        notyf.error(` ${value}, New Worker`);
      });
    });
  } finally {
    isLoading.value = false;
  }
};

const handlePostCodeChange = async () => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${FormData.value.postCode}&key=AIzaSyDWHedwkLGGa4_3XgPqYxIzMkFpOdKJRik`
    );
    if (response.data.status === "OK") {
      FormData.value.homeAddress = response.data.results[0].formatted_address;
      notyf.success("Address Added");
    } else if (response.data.status === "ZERO_RESULTS") {
      isEmptyPostCode.value = true;
      notyf.error("Invalid Post-Code");
    }
  } catch (error) {
    console.error(error);
  }
};

const onAddFile = (error: any, fileInfo: any) => {
  const _file = fileInfo.file as File;
  if (_file) {
    FormData.value = { ...FormData.value, profileImageURL: _file };
  }
};

const onRemoveFile = (error: any, fileInfo: any) => {
  FormData.value = { ...FormData.value, profileImageURL: null };
};

const checkLinkToken = async () => {
  try {
    const response = await api.post(
      "v3/api/worker/worker_invitation/check-worker-invitation-token/",
      { token: route.params.token }
    );
    console.log(response.data);
    tokenData.value = response.data;
    changeFavicon(tokenData.value.company.favIcon);
  } catch {
    notyf.error("Invitation link is expired or invalid");
    router.push("/");
  }
};

const redirectToHome = async () => {
  router.push("/");
};

const validateStep = async () => {
  if (currentStep.value === 1) {
    getWorkerDocuments();
  }

  if (currentStep.value === 3) {
    if (isLoading.value) {
      return;
    }
    isLoading.value = true;
    notyf.success("Your information is successfully stored!");
    await sleep(1000);

    router.push("/");
    return;
  }

  isLoading.value = true;
  await sleep(400);

  currentStep.value += 1;
  nextTick(() => {
    scrollTo(`#form-step-${currentStep.value}`, 1000);
    isLoading.value = false;
  });
};
const OpenDeleteSweetAlert = (id: number) => {
  currentSelectedID.value = id;
  SweetAlertProps.value = {
    title: "Are you sure?",
    subtitle: "You will not be able to recover this Worker Document!",
    btntext: "Yes, Delete it",
    isSweetAlertOpen: true,
  };
};

const OpenConfirmSweetAlert = () => {
  ConfirmSweetAlertProps.value = {
    alertIcon: "fa fa-bell",
    title: "Confirm",
    subtitle: "Do you verify your profile information and accuracy?",
    btntext: "Verify & Go",
    isConfirmSweetAlertOpen: true,
  };
};
const AddLicence = async () => {
  try {
    if (siaNumber.value.length < 16) {
      notyf.error("Please enter valid SIA");
      return;
    }
    isLoading.value = true;

    const response = await api.post(
      `/v3/api/worker/worker_sia/${currentWorkerId.value}/add_sia_licence/`,
      {
        siaNumber: siaNumber.value,
      }
    );
    SIAdata.value = response.data;
    notyf.success("SIA valid, worker");
    isLoading.value = false;
    siaNumber.value = "";
  } catch (error) {
    isLoading.value = false;
    notyf.error("Invalid SIA or worker with this SIA already register");
  }
};

const UpdateWorkerDocData = async (id: any, payload: any) => {
  try {
    const formDataAPI = new window.FormData();
    for (const key in payload) {
      formDataAPI.append(key, payload[key]);
    }
    const response = await api.patch(
      `/v3/api/worker/document/${id}/`,
      formDataAPI
    );
    notyf.dismissAll();
    notyf.success("worker document updated, Worker");
    getWorkerDocuments();
    updateDocLoading(false);
  } catch (error) {
    console.error("ok", error);
  }
};

const updateDocLoading = (flag: boolean) => {
  let arr = combinedArray.value;
  const index = arr.findIndex((obj) => obj.id === selectedDocRow.value.id);
  if (index !== -1) {
    arr[index].loading = flag;
  }
  combinedArray.value = [...arr];
};
const handleFileChange = (event: Event) => {
  // Handle the file change event here
  const input = event.target as HTMLInputElement;
  const selectedFile = input.files?.[0];

  if (selectedFile) {
    updateDocLoading(true);
    selectedDocRow.value.worker
      ? UpdateWorkerDocData(selectedDocRow.value.id, { document: selectedFile })
      : UploadWorkerDoc(selectedDocRow.value, selectedFile);
  }
};
const DeleteDocumentHandler = async () => {
  try {
    SweetAlertProps.value.isSweetAlertOpen = false;
    const response = await api.delete(
      `/v3/api/worker/document/${currentSelectedID.value}/`,
      {}
    );
    getWorkerDocuments();
    notyf.dismissAll();
    notyf.success("Delete document, Worker");
  } catch (error) {
    console.error("ok", error);
  }
};
const UploadWorkerDoc = async (row: any, document: File) => {
  try {
    let payload = {
      status: false,
      worker: currentWorkerId.value,
      companyDocument: row.id,
      document: document,
    };
    const formDataAPI = new window.FormData();
    for (const key in payload) {
      formDataAPI.append(key, payload[key]);
    }
    const response = await api.post(`/v3/api/worker/document/`, formDataAPI);
    getWorkerDocuments();
    updateDocLoading(false);
  } catch (error) {
    console.error("ok", error);
  }
};
const getWorkerDocuments = async () => {
  try {
    const response = await api.get(
      `/v3/api/worker/document/${currentWorkerId.value}/get_documents_of_a_worker/?step=step_1`,
      {}
    );
    documentTab.value = true;
    combinedArray.value = response.data;
  } catch (error) {
    console.error("ok", error);
  }
};
const triggerFileInput = (row: any): void => {
  selectedDocRow.value = row;
  if (fileInput.value) {
    fileInput.value.click();
  }
};
watch(
  () => FormData.value.postCode,
  (newVal) => {
    console.log("postCode changed:", newVal);
  }
);

onMounted(async () => {
  checkLinkToken();
  changeFavicon(tokenData.value.company.favIcon);
});
onMounted(() => {
  layoutSwitcher.setDynamicLayoutId((darkmode.isDark = false));
});
</script>

<template>
  <form method="post" novalidate @submit.prevent="validateStep">
    <div class="mobile-steps is-active">
      <ul class="steps is-thin is-horizontal is-short">
        <li :class="[currentStep === 0 && 'is-active']" class="steps-segment">
          <span class="steps-marker" />
          <a
            href="#"
            class="steps-content"
            @click.prevent="
              currentStep >= 0 &&
                scrollTo('#form-step-0', 800, { offset: -150 })
            "
          >
            <p class="step-number">Step 1</p>
          </a>
        </li>

        <li :class="[currentStep === 1 && 'is-active']" class="steps-segment">
          <span class="steps-marker" />
          <a
            href="#"
            class="steps-content"
            @click.prevent="
              currentStep >= 1 &&
                scrollTo('#form-step-1', 800, { offset: -150 })
            "
          >
            <p class="step-number">Step 2</p>
          </a>
        </li>

        <li :class="[currentStep === 2 && 'is-active']" class="steps-segment">
          <span class="steps-marker" />
          <a
            href="#"
            class="steps-content"
            @click.prevent="
              currentStep >= 2 &&
                scrollTo('#form-step-2', 800, { offset: -150 })
            "
          >
            <p class="step-number">Step 3</p>
          </a>
        </li>

        <!-- <li :class="[currentStep === 3 && 'is-active']" class="steps-segment">
          <span class="steps-marker" />
          <a href="#" class="steps-content" @click.prevent="
            currentStep >= 3 &&
            scrollTo('#form-step-3', 800, { offset: -150 })
            ">
            <p class="step-number">Step 4</p>
          </a>
        </li> -->
      </ul>
    </div>
    <div
      style="
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
      "
    >
      <div
        v-if="tokenData.supplier"
        style="display: flex; flex-direction: column; justify-content: center"
      >
        <img style="width: 150px" :src="tokenData.supplier.partnerLogo" />
      </div>
      <div
        v-else
        style="display: flex; flex-direction: column; justify-content: center"
      >
        <img style="width: 150px" :src="tokenData.company.compnayLogo" />
      </div>
    </div>
    <div class="stepper-form" style="justify-content: center">
      <div class="form-sections">
        <div
          v-if="currentStep >= 0"
          id="form-step-0"
          class="form-section is-active"
        >
          <h3 class="form-section-title">
            <span> General Information </span>
            <span style="color: var(--light-text)">( 1 )</span>
            <!-- <button type="button" class="help-button" tabindex="0" @keydown.space.prevent="
              currentHelp === 0 ? (currentHelp = -1) : (currentHelp = 0)
              " @click="
    currentHelp === 0 ? (currentHelp = -1) : (currentHelp = 0)
    ">
              <i aria-hidden="true" class="iconify" data-icon="feather:help-circle" />
            </button> -->
          </h3>
          <form
            id="addWorkerForm"
            class="cu-all-input"
            @submit.prevent="addWorkerHandler"
          >
            <div class="form-section-inner">
              <div class="columns is-multiline">
                <VField class="column is-12">
                  <label>Profile Image *</label>
                  <VControl class="is-flex is-justify-content-center mt-5">
                    <VFilePond
                      class="profile-filepond"
                      name="profile_filepond"
                      :chunk-retry-delays="[500, 1000, 3000]"
                      label-idle="<i class='lnil lnil-cloud-upload'></i>"
                      :accepted-file-types="[
                        'image/png',
                        'image/jpeg',
                        'image/gif',
                      ]"
                      :image-preview-height="240"
                      :image-resize-target-width="240"
                      :image-resize-target-height="240"
                      image-crop-aspect-ratio="1:1"
                      style-panel-layout="compact circle"
                      style-load-indicator-position="center bottom"
                      style-progress-indicator-position="right bottom"
                      style-button-remove-item-position="left bottom"
                      style-button-process-item-position="right bottom"
                      @addfile="onAddFile"
                      @removefile="onRemoveFile"
                    />
                  </VControl>
                </VField>

                <div class="column is-6">
                  <VField>
                    <label>First name *</label>
                    <VControl>
                      <VInput
                        name="firstName"
                        v-model="FormData.firstName"
                        @change="(e) => inputChangeHandler(e)"
                        type="text"
                        required
                        placeholder="First name"
                      />
                    </VControl>
                  </VField>
                </div>

                <!-- last name -->
                <div class="column is-6">
                  <VField>
                    <label>Last name </label>
                    <VControl>
                      <VInput
                        name="lastName"
                        v-model="FormData.lastName"
                        @change="(e) => inputChangeHandler(e)"
                        type="text"
                        placeholder="Last name"
                      />
                    </VControl>
                  </VField>
                </div>

                <!-- email -->
                <div class="column is-6">
                  <VField>
                    <label>Email *</label>
                    <VControl>
                      <VInput
                        name="email"
                        v-model="FormData.emailAddress"
                        @change="(e) => inputChangeHandler(e)"
                        required
                        type="email"
                        placeholder="Email address"
                      />
                    </VControl>
                  </VField>
                </div>

                <!-- phone -->
                <div class="column is-6">
                  <VField>
                    <label>Phone number </label>
                    <VControl>
                      <VInput
                        name="phoneNumber"
                        v-model="FormData.phoneNumber"
                        @change="(e) => inputChangeHandler(e)"
                        type="tel"
                        placeholder="Phone number"
                      />
                    </VControl>
                  </VField>
                </div>

                <!-- post code -->
                <div class="column is-6">
                  <VField>
                    <label>Post code </label>
                    <VControl>
                      <VInput
                        name="postCode"
                        v-model="FormData.postCode"
                        @blur="handlePostCodeChange"
                        type="text"
                        placeholder="Post code"
                      />
                    </VControl>
                  </VField>
                </div>

                <!-- address -->
                <div class="column is-6">
                  <VField>
                    <label>Address </label>
                    <VControl>
                      <VInput
                        name="homeAddress"
                        v-model="FormData.homeAddress"
                        type="text"
                        placeholder="Address"
                      />
                    </VControl>
                  </VField>
                </div>
                <VControl raw subcontrol>
                  <VCheckbox
                    v-model="privacyCheck"
                    label="I have read and agree to the privacy policy, terms of service, and community"
                    color="primary"
                  />
                </VControl>
                <!-- <div class="column is-6">
                  <VField>
                    <label>Line manager </label>
                    <VControl>
                      <VInput name="lineManager" v-model="FormData.lineManager" @change="(e) => inputChangeHandler(e)"
                        type="text" placeholder="Manager name" />
                    </VControl>
                  </VField>
                </div> -->

                <!-- card number -->
                <!-- <div class="column is-6">
                  <VField>
                    <label>Card number </label>
                    <VControl>
                      <VInput name="compnayIdCardNumber" v-model="FormData.compnayIdCardNumber"
                        @change="(e) => inputChangeHandler(e)" type="number" placeholder="Card number" />
                    </VControl>
                  </VField>
                </div> -->

                <!-- card expiry -->
                <!-- <div class="column is-12">
                  <VField>
                    <label>Card expiry date </label>
                    <VControl>
                      <VInput name="compnayIdCardExpiryDate" v-model="FormData.compnayIdCardExpiryDate"
                        @change="(e) => inputChangeHandler(e)" type="date" placeholder="" />
                    </VControl>
                  </VField>
                </div> -->
              </div>
            </div>
          </form>
        </div>

        <Transition name="fade-slow">
          <div
            v-if="
              currentStep >= 1 &&
              tokenData.industry.name.toLowerCase() === 'security'
            "
            id="form-step-1"
            class="form-section is-active"
          >
            <h3 class="form-section-title">
              <span>SIA info </span
              ><span style="color: var(--light-text)">( 2 )</span>
              <!-- <button type="button" class="help-button" @keydown.space.prevent="
                currentHelp === 1 ? (currentHelp = -1) : (currentHelp = 1)
                " @click="
    currentHelp === 1 ? (currentHelp = -1) : (currentHelp = 1)
    ">
                <i aria-hidden="true" class="iconify" data-icon="feather:help-circle" />
              </button> -->
            </h3>

            <div class="form-section-inner">
              <VField addons v-slot="{ id }">
                <VControl expanded>
                  <VIMaskInput
                    :id="id"
                    v-model="siaNumber"
                    autocomplete="cc-csc"
                    required
                    class="input"
                    :options="{
                      mask: '0000000000000000',
                    }"
                    placeholder="SIA Number"
                  />
                </VControl>
                <VControl>
                  <VButton
                    color="primary"
                    :loading="isLoading"
                    @click="AddLicence"
                    rounded
                    >Verify</VButton
                  >
                </VControl>
              </VField>
              <div
                class="banking-dashboard banking-dashboard-v1"
                v-if="SIAdata.licenceNumber"
              >
                <div class="columns is-multiline">
                  <!--Credit Cards-->
                  <div class="column is-12">
                    <div class="dashboard-card is-credit-cards">
                      <div class="card-block">
                        <div class="columns is-multiline">
                          <div class="column is-12">
                            <div class="card-block-inner is-dark-bordered-12">
                              <div
                                class="credit-card is-theme-1"
                                :style="
                                  SIAdata.isDefault
                                    ? 'border: 2px solid forestgreen;'
                                    : ''
                                "
                              >
                                <div class="shape" />
                                <div class="top">
                                  <div class="card-number">
                                    <div>
                                      <span>{{ SIAdata.licenceNumber }}</span>
                                      <span style="font-size: 1.1rem"
                                        >{{ SIAdata.firstName }}
                                        {{ SIAdata.surName }}</span
                                      >
                                    </div>
                                    <img src="/images/photo/sia.png" alt="" />
                                  </div>
                                  <div class="card-number">
                                    <span>{{ SIAdata.licenceSector }}</span>
                                  </div>
                                  <div class="card-number">
                                    <span>{{ SIAdata.role }}</span>
                                  </div>
                                </div>
                                <div class="bottom">
                                  <span>SIA Licence</span>
                                </div>
                              </div>
                            </div>
                            <div class="info-block-inner">
                              <div class="info-block-line">
                                <h4 class="dark-inverted">Status</h4>
                                <span>
                                  <i
                                    aria-hidden="true"
                                    class="fas fa-circle text-success"
                                    style="color: var(--primary)"
                                  />
                                  {{ SIAdata.status ? "Active" : "InActive" }}
                                </span>
                              </div>
                              <div class="info-block-line">
                                <h4 class="dark-inverted">Expires in</h4>
                                <span>{{ SIAdata.expiryDate }}</span>
                              </div>
                              <div class="info-block-line">
                                <h4 class="dark-inverted">Type</h4>
                                <span class="has-image"> SIA card </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>

        <Transition name="fade-slow">
          <div
            v-if="currentStep >= 2"
            id="form-step-2"
            class="form-section is-active"
          >
            <h3 class="form-section-title">
              <span>Upload Documents </span>
              <span style="color: var(--light-text)"
                >(
                {{
                  tokenData.industry.name.toLowerCase() === "security"
                    ? "3"
                    : "2"
                }}
                )</span
              >
              <!-- <button type="button" class="help-button" @keydown.space.prevent="
                currentHelp === 2 ? (currentHelp = -1) : (currentHelp = 2)
                " @click="
    currentHelp === 2 ? (currentHelp = -1) : (currentHelp = 2)
    ">
                <i aria-hidden="true" class="iconify" data-icon="feather:help-circle" />
              </button> -->
            </h3>

            <div class="form-section-inner">
              <!--documents-->
              <div class="profile-card-section">
                <input
                  ref="fileInput"
                  type="file"
                  style="display: none"
                  @change="handleFileChange"
                  accept="image/*,application/pdf"
                />
                <div class="section-content">
                  <div class="column">
                    <div v-if="combinedArray.length > 0" class="incoming">
                      <VFlexTable
                        rounded
                        :data="combinedArray"
                        :columns="columns"
                      >
                        <template #body-cell="{ row, column, value }">
                          <template v-if="column.key === 'documentTitle'">
                            <VAvatar :picture="row.icon" :squared="true" />

                            <div style="max-width: 400px; white-space: normal">
                              <span class="item-name dark-inverted">{{
                                row.documentTitle
                              }}</span>
                              <span class="item-meta mb-4">
                                <span>{{ row.subTitle }}</span>
                              </span>
                            </div>
                            <div></div>
                          </template>
                          <!-- <template
                            v-else-if="
                              column.key === 'document' && row.document
                            "
                          >
                            <div v-if="row.document.includes('.pdf')">
                              <img
                                @click="
                                  () => {
                                    currentPdfPreview = row.document;
                                    pdfPreviewModal = true;
                                  }
                                "
                                class="image-icon"
                                src="/images/icons/files/pdf.svg"
                                alt=""
                                style="
                                  width: 50px;
                                  height: 50px;
                                  cursor: pointer;
                                "
                              />
                            </div>
                            <div v-else>
                              <img
                                @click="
                                  () => {
                                    currentPdfPreview = row.document;
                                    pdfPreviewModal = true;
                                  }
                                "
                                class="image-icon"
                                src="/images/icons/files/ai.svg"
                                alt=""
                                style="
                                  width: 50px;
                                  height: 50px;
                                  cursor: pointer;
                                "
                              />
                            </div>
                          </template> -->
                          <template v-else-if="column.key === 'actions'">
                            <div v-if="row.document">
                              <div v-if="row.document.includes('.pdf')">
                                <img
                                  @click="
                                    () => {
                                      currentPdfPreview = row.document;
                                      pdfPreviewModal = true;
                                      fileView = row.documentTitle;
                                    }
                                  "
                                  class="image-icon"
                                  src="/images/icons/files/pdf.svg"
                                  alt=""
                                  style="
                                    margin-right: 10px;
                                    width: 34px;
                                    height: 34px;
                                    cursor: pointer;
                                    border-radius: 50%;
                                    margin-top: 6px;
                                  "
                                />
                              </div>
                              <div v-else>
                                <div class="png-icon">
                                  <i
                                    @click="
                                      () => {
                                        currentPdfPreview = row.document;
                                        pdfPreviewModal = true;
                                        fileView = row.documentTitle;
                                      }
                                    "
                                    class="fas fa-file-image"
                                    style="
                                      font-size: 18px;
                                      cursor: pointer;
                                      color: var(--primary);
                                    "
                                  ></i>
                                </div>
                              </div>
                            </div>

                            <VIconBox
                              v-if="!row.document"
                              size="small"
                              style="
                                color: var(--primary-grey);
                                cursor: pointer;
                              "
                              v-tooltip.primary.rounded="
                                'Delete uploaded document to upload again.'
                              "
                              label="Info"
                              rounded
                            >
                              <i
                                class="iconify"
                                data-icon="feather:upload-cloud"
                                aria-hidden="true"
                              ></i>
                            </VIconBox>
                            <VIconBox
                              v-if="!row.loading && !row.document"
                              size="small"
                              :style="{
                                color: row.document
                                  ? 'var(--primary-grey)'
                                  : 'var(--primary)',
                                cursor: row.document
                                  ? 'not-allowed'
                                  : 'pointer',
                              }"
                              rounded
                              @click="() => triggerFileInput(row)"
                            >
                              <i
                                class="iconify"
                                data-icon="feather:upload-cloud"
                                aria-hidden="true"
                              ></i>
                            </VIconBox>
                            <VIconButton
                              v-if="row.loading"
                              color="primary"
                              outlined
                              loading
                              circle
                              icon="feather:plus"
                            />
                            <VIconBox
                              v-if="row.worker"
                              size="small"
                              color="danger"
                              class="ml-3"
                              style="cursor: pointer"
                              rounded
                              @click="OpenDeleteSweetAlert(row.id)"
                            >
                              <i
                                class="iconify"
                                data-icon="feather:trash-2"
                                aria-hidden="true"
                              ></i>
                            </VIconBox>
                          </template>
                        </template>
                      </VFlexTable>
                    </div>
                    <div v-else>
                      <p class="description">No documents are required</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>

        <!-- <Transition name="fade-slow">
          <div v-if="currentStep >= 3" id="form-step-3" class="form-section is-active">
            <h3 class="form-section-title">
              <span>Confirmation </span>
              <span style="color: var(--light-text)">(
                {{
                  tokenData.industry.name.toLowerCase() === "security"
                  ? "4"
                  : "3"
                }}
                )</span>
            </h3>
            <div class="form-section-inner">
              <div class="validation-box">
                <div class="box-content">
                  <h3>Excellent</h3>
                  <p>
                    Before submitting the form, make sure you've filled all the
                    required fields. Once submitted, you won't be able to change
                    the info for this .
                  </p>
                </div>
                <div class="box-illustration">
                  <img src="/@src/assets/illustrations/plants/1.svg" alt="" />
                </div>
              </div>
            </div>
          </div>
        </Transition> -->

        <div class="navigation-buttons">
          <div class="buttons is-right">
            <VButton
              v-if="currentStep === 0"
              type="submit"
              :disabled="privacyCheck ? false : true"
              form="addWorkerForm"
              color="primary"
              bold
              :loading="isLoading"
              tabindex="0"
            >
              Continue
            </VButton>
            <VButton
              v-if="currentStep != 0 && !documentTab"
              type="submit"
              color="primary"
              bold
              :loading="isLoading"
              tabindex="0"
            >
              Continue
            </VButton>

            <VButton
              v-if="documentTab"
              @click="OpenConfirmSweetAlert"
              color="primary"
              bold
              :loading="isLoading"
              tabindex="0"
            >
              Confirm
            </VButton>
          </div>
        </div>
      </div>

      <div class="form-stepper">
        <ul
          v-if="currentHelp === -1"
          class="steps is-vertical is-thin is-short"
        >
          <li
            id="step-segment-0"
            role="button"
            :class="[currentStep === 0 && 'is-active']"
            class="steps-segment"
            tabindex="0"
            @keydown.space.prevent="
              currentStep >= 0 && scrollTo('#form-step-0', 800, { offset: -20 })
            "
            @click.prevent="
              currentStep >= 0 && scrollTo('#form-step-0', 800, { offset: -20 })
            "
          >
            <a href="#" class="steps-marker" />
            <div class="steps-content">
              <p class="step-number">STEP 1</p>
              <p class="step-info">General Information</p>
            </div>
          </li>
          <li
            v-if="tokenData.industry.name.toLowerCase() === 'security'"
            id="step-segment-1"
            :class="[currentStep === 1 && 'is-active']"
            class="steps-segment"
            tabindex="0"
            role="button"
            @keydown.space.prevent="
              currentStep >= 1 && scrollTo('#form-step-1', 800, { offset: -20 })
            "
            @click.prevent="
              currentStep >= 1 && scrollTo('#form-step-1', 800, { offset: -20 })
            "
          >
            <a href="#" class="steps-marker" />
            <div class="steps-content">
              <p class="step-number">STEP 2</p>
              <p class="step-info">SIA info</p>
            </div>
          </li>
          <li
            id="step-segment-2"
            :class="[currentStep === 2 && 'is-active']"
            class="steps-segment"
            tabindex="0"
            role="button"
            @keydown.space.prevent="
              currentStep >= 2 && scrollTo('#form-step-2', 800, { offset: -20 })
            "
            @click.prevent="
              currentStep >= 2 && scrollTo('#form-step-2', 800, { offset: -20 })
            "
          >
            <a href="#" class="steps-marker" />
            <div class="steps-content">
              <p class="step-number">
                STEP
                {{
                  tokenData.industry.name.toLowerCase() === "security"
                    ? "3"
                    : "2"
                }}
              </p>
              <p class="step-info">Documents</p>
            </div>
          </li>

          <!-- <li id="step-segment-3" :class="[currentStep === 4 && 'is-active']" class="steps-segment" tabindex="0"
            role="button" @keydown.space.prevent="
              currentStep >= 4 && scrollTo('#form-step-3', 800, { offset: -20 })
              " @click.prevent="
    currentStep >= 3 && scrollTo('#form-step-3', 800, { offset: -20 })
    ">
            <a href="#" class="steps-marker" />
            <div class="steps-content">
              <p class="step-number">
                STEP
                {{
                  tokenData.industry.name.toLowerCase() === "security"
                  ? "4"
                  : "3"
                }}
              </p>
              <p class="step-info">Confirmation</p>
            </div>
          </li> -->
        </ul>
        <div v-else class="form-help">
          <div
            v-if="currentHelp === 0"
            id="help-section-0"
            class="form-help-inner is-active"
          >
            <button
              class="close-help-button"
              tabindex="0"
              @keydown.space.prevent="currentHelp = -1"
              @click="currentHelp = -1"
            >
              <i aria-hidden="true" class="iconify" data-icon="feather:x" />
            </button>
            <h3>General Information</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quod
              proximum fuit non vidit. Quantum Aristoxeni ingenium consumptum
              videmus in musicis? An eiusdem modi? Quae similitudo in genere
              etiam humano apparet.
            </p>
            <div class="list-wrap">
              <ul>
                <li>
                  <i
                    aria-hidden="true"
                    class="iconify"
                    data-icon="feather:check"
                  />
                  <span>Some nice list item</span>
                </li>
                <li>
                  <i
                    aria-hidden="true"
                    class="iconify"
                    data-icon="feather:check"
                  />
                  <span>Some nice list item</span>
                </li>
                <li>
                  <i
                    aria-hidden="true"
                    class="iconify"
                    data-icon="feather:check"
                  />
                  <span>Some nice list item</span>
                </li>
              </ul>
            </div>
          </div>
          <div
            v-if="currentHelp === 1"
            id="help-section-1"
            class="form-help-inner is-active"
          >
            <button
              class="close-help-button"
              tabindex="0"
              @keydown.space.prevent="currentHelp = -1"
              @click="currentHelp = -1"
            >
              <i aria-hidden="true" class="iconify" data-icon="feather:x" />
            </button>
            <h3>Shipment Owner</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quod
              proximum fuit non vidit. Quantum Aristoxeni ingenium consumptum
              videmus in musicis? An eiusdem modi? Quae similitudo in genere.
            </p>
            <div class="list-wrap">
              <ul>
                <li>
                  <i
                    aria-hidden="true"
                    class="iconify"
                    data-icon="feather:check"
                  />
                  <span>Some nice list item</span>
                </li>
                <li>
                  <i
                    aria-hidden="true"
                    class="iconify"
                    data-icon="feather:check"
                  />
                  <span>Some nice list item</span>
                </li>
              </ul>
            </div>
          </div>
          <div
            v-if="currentHelp === 2"
            id="help-section-2"
            class="form-help-inner is-active"
          >
            <button
              class="close-help-button"
              tabindex="0"
              @keydown.space.prevent="currentHelp = -1"
              @click="currentHelp = -1"
            >
              <i aria-hidden="true" class="iconify" data-icon="feather:x" />
            </button>
            <h3>Shipment Taxes</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quod
              proximum fuit non vidit. Quantum Aristoxeni ingenium consumptum
              videmus in musicis? An eiusdem modi? Quae similitudo in genere
              etiam humano apparet.
            </p>
            <div class="list-wrap">
              <ul>
                <li>
                  <i
                    aria-hidden="true"
                    class="iconify"
                    data-icon="feather:check"
                  />
                  <span>Some nice list item</span>
                </li>
                <li>
                  <i
                    aria-hidden="true"
                    class="iconify"
                    data-icon="feather:check"
                  />
                  <span>Some nice list item</span>
                </li>
                <li>
                  <i
                    aria-hidden="true"
                    class="iconify"
                    data-icon="feather:check"
                  />
                  <span>Some nice list item</span>
                </li>
              </ul>
            </div>
          </div>
          <div
            v-if="currentHelp === 3"
            id="help-section-3"
            class="form-help-inner is-active"
          >
            <button
              class="close-help-button"
              tabindex="0"
              @keydown.space.prevent="currentHelp = -1"
              @click="currentHelp = -1"
            >
              <i aria-hidden="true" class="iconify" data-icon="feather:x" />
            </button>
            <h3>Options</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quod
              proximum fuit non vidit. Quantum Aristoxeni ingenium consumptum
              videmus in musicis? An eiusdem modi? Quae similitudo in genere.
            </p>
            <div class="list-wrap">
              <ul>
                <li>
                  <i
                    aria-hidden="true"
                    class="iconify"
                    data-icon="feather:check"
                  />
                  <span>Some nice list item</span>
                </li>
                <li>
                  <i
                    aria-hidden="true"
                    class="iconify"
                    data-icon="feather:check"
                  />
                  <span>Some nice list item</span>
                </li>
              </ul>
            </div>
          </div>
          <div
            v-if="currentHelp === 4"
            id="help-section-4"
            class="form-help-inner is-active"
          >
            <button
              class="close-help-button"
              tabindex="0"
              @keydown.space.prevent="currentHelp = -1"
              @click="currentHelp = -1"
            >
              <i aria-hidden="true" class="iconify" data-icon="feather:x" />
            </button>
            <h3>Validation</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quod
              proximum fuit non vidit. Quantum Aristoxeni ingenium consumptum
              videmus in musicis? An eiusdem modi? Quae similitudo in genere.
            </p>
            <div class="list-wrap">
              <ul>
                <li>
                  <i
                    aria-hidden="true"
                    class="iconify"
                    data-icon="feather:check"
                  />
                  <span>Some nice list item</span>
                </li>
                <li>
                  <i
                    aria-hidden="true"
                    class="iconify"
                    data-icon="feather:check"
                  />
                  <span>Some nice list item</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </form>
  <VModal
    is="form"
    :open="pdfPreviewModal"
    :title="fileView"
    size="big"
    actions="right"
    @close="pdfPreviewModal = false"
  >
    <template #content>
      <div class="modal-form">
        <iframe
          v-if="currentPdfPreview.includes('.pdf')"
          :src="currentPdfPreview"
          style="width: 100%; height: 800px; border: none"
        >
          Oops! an error has occurred.
        </iframe>
        <img v-else :src="currentPdfPreview" alt="" />
      </div>
    </template>
    <template #action>
      <!-- <VButton type="submit" color="primary" raised>Publish</VButton> -->
    </template>
    <template #cancel>
      <VButton rounded @click="pdfPreviewModal = false" style="display: none">
        Close
      </VButton>
    </template>
  </VModal>
  <SweetAlert
    v-if="SweetAlertProps.isSweetAlertOpen"
    :isSweetAlertOpen="SweetAlertProps.isSweetAlertOpen"
    :title="SweetAlertProps.title"
    :subtitle="SweetAlertProps.subtitle"
    :btntext="SweetAlertProps.btntext"
    :onConfirm="DeleteDocumentHandler"
    :onCancel="() => (SweetAlertProps.isSweetAlertOpen = false)"
  />

  <SweetAlert
    v-if="ConfirmSweetAlertProps.isConfirmSweetAlertOpen"
    :isConfirmSweetAlertOpen="ConfirmSweetAlertProps.isConfirmSweetAlertOpen"
    :title="ConfirmSweetAlertProps.title"
    :subtitle="ConfirmSweetAlertProps.subtitle"
    :btntext="ConfirmSweetAlertProps.btntext"
    :onConfirm="redirectToHome"
    :onCancel="() => (ConfirmSweetAlertProps.isConfirmSweetAlertOpen = false)"
  />
</template>

<style lang="scss">
.png-icon {
  display: flex;
  margin-right: 10px;
  justify-content: center;
  align-items: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background-color: #09787823;
}

.has-top-nav {
  .stepper-form {
    max-width: 880px;
    margin: 0 auto;
  }
}

.stepper-form {
  position: relative;
  display: flex;
  align-items: flex-start;
  padding-top: 3rem;
  margin-bottom: 5rem;

  .form-sections {
    flex-grow: 2;
    max-width: 640px;
    padding-inline-end: 4rem;

    .form-section {
      display: none;

      &.is-active {
        display: block;
      }

      + .form-section {
        margin-top: 4rem;
      }

      .form-section-title {
        font-family: var(--font-alt);
        font-weight: 600;
        color: var(--dark-text);
        margin-bottom: 1rem;

        button {
          position: relative;
          top: 4px;
          padding: 0;
          height: 18px;
          width: 18px;
          border: none;
          background: none;
          cursor: pointer;
          margin-inline-start: 0.25rem;

          svg {
            height: 18px;
            width: 18px;
            pointer-events: none;
          }
        }
      }

      .fieldset {
        padding: 0.75rem;
        border-radius: 0.5rem;
        border: 1px solid var(--border);
        background: var(--widget-grey-dark-3);

        .fieldset-separator {
          margin: 1.5rem 0;
          border-top: 1px solid var(--border);
        }
      }

      .field {
        > label {
          margin-bottom: 0.25rem;
          display: inline-block;
        }

        > .buttons {
          padding: 2rem 0;
        }
      }

      .flex-label {
        display: flex;
        align-items: center;
        height: 100%;

        h4 {
          font-family: var(--font);
          font-weight: 500;
          color: var(--dark-text);
        }
      }

      .subcontrol {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        min-width: 175px;
        padding-inline-end: 1rem;

        .checkbox {
          padding: 0;
        }
      }

      .input-button {
        height: 44px;
        width: 100%;
        border: 2px dashed var(--border);
        border-radius: 0.65rem;
        background: var(--widget-grey-dark-3);
        display: flex;
        align-items: center;
        padding-inline-start: calc(0.75em - 1px);
        padding-inline-end: calc(0.75em - 1px);
        padding-top: 0;
        padding-bottom: 0;
        color: var(--dark-text);
        cursor: pointer;
        transition:
          color 0.3s,
          background-color 0.3s,
          border 0.3s,
          box-shadow 0.3s;

        &:focus-visible {
          outline-offset: var(--accessibility-focus-outline-offset);
          outline-width: var(--accessibility-focus-outline-width);
          outline-style: var(--accessibility-focus-outline-style);
          outline-color: var(--accessibility-focus-outline-color);
        }

        &:hover {
          background: var(--white);
          border: 2px solid var(--primary);
          color: var(--primary);
          box-shadow: var(--light-box-shadow);
        }

        svg {
          height: 18px;
          width: 16px;
        }

        span {
          font-family: var(--font);
          margin-inline-start: 0.75rem;
        }
      }

      .options {
        display: flex;
        flex-wrap: wrap;
        margin-inline-start: -0.5rem;
        margin-inline-end: -0.5rem;

        .option {
          position: relative;
          width: calc(33.3% - 1rem);
          margin: 0.5rem;

          &:focus-within {
            border-radius: 4px;
            outline-offset: var(--accessibility-focus-outline-offset);
            outline-width: var(--accessibility-focus-outline-width);
            outline-style: var(--accessibility-focus-outline-style);
            outline-color: var(--accessibility-focus-outline-color);
          }

          input {
            position: absolute;
            top: 0;
            inset-inline-start: 0;
            height: 100%;
            width: 100%;
            z-index: 1;
            opacity: 0;
            cursor: pointer;

            &:checked {
              ~ .indicator {
                transform: scale(1);
              }

              ~ .option-inner {
                border-color: var(--primary);
                box-shadow: var(--light-box-shadow);

                i {
                  color: var(--primary);
                }
              }
            }
          }

          .indicator {
            position: absolute;
            top: 1rem;
            inset-inline-end: 1rem;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 20px;
            width: 20px;
            color: var(--white);
            background: var(--primary);
            border-radius: 50%;
            transform: scale(0);
            transition: transform 0.3s;

            svg {
              height: 14px;
              width: 14px;
              stroke-width: 3px;
            }
          }

          .option-inner {
            padding: 1.5rem;
            background: var(--white);
            border: 1px solid var(--border);
            border-radius: 0.5rem;
            transition:
              border 0.3s,
              box-shadow 0.3s;

            h4 {
              color: var(--dark-text);
              font-weight: 600;
              font-family: var(--font-alt);
            }

            p {
              font-size: 0.9rem;
            }

            i {
              font-size: 2.25rem;
              color: var(--light-text);
              margin-bottom: 0.25rem;
            }
          }
        }
      }

      .validation-box {
        display: flex;
        padding: 2rem;
        background: var(--white);
        border: 1px solid var(--border);
        border-radius: 0.5rem;
        transition:
          border 0.3s,
          box-shadow 0.3s;

        .box-content {
          h3 {
            font-family: var(--font-alt);
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 0.75rem;
          }

          p {
            font-size: 1rem;
          }
        }

        .box-illustration {
          position: relative;
          height: 100px;
          min-width: 40%;

          img {
            position: absolute;
            inset-inline-end: 0;
            bottom: 0;
            max-height: 180px;
          }
        }
      }

      .form-section-output {
        margin-top: 1.5rem;

        .output {
          height: 52px;
          width: 100%;
          border: 1px solid var(--border);
          border-radius: 0.65rem;
          background: var(--white);
          display: flex;
          align-items: center;
          padding-inline-start: calc(1em - 1px);
          padding-inline-end: calc(1em - 1px);
          padding-top: 0;
          padding-bottom: 0;
          color: var(--dark-text);
          cursor: pointer;
          transition:
            color 0.3s,
            background-color 0.3s,
            border 0.3s,
            box-shadow 0.3s;

          &:not(:last-child) {
            margin-bottom: 1rem;
          }

          > svg {
            height: 18px;
            width: 18px;
            margin-inline-end: 0.75rem;
            color: var(--light-text);
          }

          > span {
            font-weight: 500;
            font-family: var(--font);
            color: var(--dark-text);
          }

          .action {
            margin-inline-start: auto;

            button {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 38px;
              width: 38px;
              min-width: 38px;
              background: none;
              border: none;
              padding: 0;
              cursor: pointer;
              border-radius: 0.5rem;
              transition: background-color 0.3s;

              &:hover,
              &:focus {
                background: var(--widget-grey-dark-1);
              }

              svg {
                height: 18px;
                width: 18px;
                stroke-width: 1.5px;
              }
            }
          }
        }
      }
    }

    .navigation-buttons {
      padding: 2rem 0;

      .button {
        min-height: 52px;
        min-width: 160px;
      }
    }
  }

  .form-stepper {
    position: sticky;
    top: -30px;
    padding-top: 50px;

    .form-help {
      position: relative;
      max-width: 300px;
      padding: 1.75rem;
      border: 1px solid var(--border);
      border-radius: 0.65rem;
      background: var(--white);

      .form-help-inner {
        display: none;

        &.is-active {
          display: block;
        }
      }

      h3 {
        font-family: var(--font-alt);
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 1rem;
      }

      button {
        position: absolute;
        top: 1rem;
        inset-inline-end: 1rem;
        padding: 0;
        height: 18px;
        width: 18px;
        border: none;
        background: none;
        cursor: pointer;
        margin-inline-start: 0.25rem;

        svg {
          height: 18px;
          width: 18px;
          pointer-events: none;
        }
      }

      .list-wrap {
        padding: 0.75rem 0;

        li {
          display: flex;
          align-items: center;
          margin-bottom: 0.15rem;

          span {
            font-family: var(--font);
            color: var(--light-text);
            font-weight: 300;
          }

          svg {
            height: 14px;
            width: 14px;
            stroke-width: 3px;
            margin-inline-end: 0.45rem;
            color: var(--primary);
          }
        }
      }
    }

    .step-number {
      font-family: var(--font);
      font-weight: 500;
      font-size: 0.75rem !important;
    }

    .steps:not(.is-hollow) .steps-segment.is-active ~ .steps-segment {
      cursor: default !important;
    }

    .steps:not(.is-hollow) .steps-segment {
      cursor: pointer !important;
    }

    .steps-segment {
      &.is-active {
        .step-info {
          color: var(--dark-text);
          font-weight: 600;
        }
      }
    }
  }
}

.mobile-steps {
  display: none;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 60px;
  inset-inline-start: 0;
  height: 65px;
  width: 100%;
  background: var(--white);
  border-bottom: 1px solid var(--border);
  z-index: 25;
  transform: translateY(-100%);
  transition: transform 0.3s;

  &.is-active {
    transform: translateY(0);
  }

  .steps {
    position: relative;
    top: 10px;
  }

  .steps-segment {
    &.is-active {
      .steps-content {
        opacity: 1 !important;
      }
    }

    .steps-content {
      opacity: 0 !important;
      display: block;
    }
  }
}

.is-dark {
  .stepper-form {
    .form-sections {
      .form-section {
        .form-section-title {
          span {
            color: var(--dark-dark-text);
          }

          svg {
            color: var(--dark-dark-text);
          }
        }

        .input-button {
          background-color: var(--dark-sidebar-light-2) !important;
          border-color: var(--dark-sidebar-light-12) !important;
          color: var(--dark-dark-text);

          &:hover,
          &:focus {
            color: var(--primary);
            border: 2px solid var(--primary) !important;
          }
        }

        .fieldset {
          background: var(--dark-sidebar-dark-2);
          border-color: var(--dark-sidebar-light-12);
        }

        .fieldset-separator {
          border-color: var(--dark-sidebar-light-12);
        }

        .flex-label h4 {
          color: var(--dark-dark-text);
        }

        .options {
          .option {
            .indicator {
              background: var(--primary);
            }

            input {
              &:checked {
                ~ .indicator {
                  transform: scale(1);
                }

                ~ .option-inner {
                  border-color: var(--primary) !important;

                  i {
                    color: var(--primary);
                  }
                }
              }
            }

            .option-inner {
              background-color: var(--dark-sidebar-light-2) !important;
              border-color: var(--dark-sidebar-light-12) !important;

              h4 {
                color: var(--dark-dark-text);
              }
            }
          }
        }

        .validation-box {
          background-color: var(--dark-sidebar-light-2) !important;
          border-color: var(--dark-sidebar-light-12) !important;

          .box-content h3 {
            color: var(--dark-dark-text);
          }
        }

        .form-section-output {
          .output {
            background-color: var(--dark-sidebar-light-2) !important;
            border-color: var(--dark-sidebar-light-12) !important;
            color: var(--dark-dark-text);

            > span {
              color: var(--dark-dark-text);
            }

            .action {
              button {
                &:hover {
                  background: var(--dark-sidebar-light-5);
                }

                svg {
                  color: var(--light-text);
                }
              }
            }
          }
        }
      }
    }

    .form-stepper {
      .steps {
        &:not(.is-hollow) {
          .steps-marker:not(.is-hollow) {
            background-color: var(--primary);
          }
        }

        .steps-segment {
          &.is-active {
            ~ .steps-segment::after {
              background: var(--dark-sidebar-dark-5);
            }

            ~ .steps-segment {
              .steps-marker:not(.is-hollow) {
                background: var(--dark-sidebar-dark-5);
              }
            }

            &::after {
              background: var(--dark-sidebar-dark-5);
            }

            .steps-content {
              .step-info {
                color: var(--dark-dark-text);
              }
            }
          }

          &::after {
            background-color: var(--primary);
          }
        }
      }
    }
  }
}

@media (width <=767px) {
  .mobile-steps {
    display: flex;
  }

  .stepper-form {
    padding-top: 0;

    .form-sections {
      padding-inline-end: 0;
      overflow: hidden;

      .form-section {
        .form-section-title {
          button {
            display: none;
          }
        }

        .subcontrol {
          min-width: 138px;
        }

        .options {
          .option {
            width: calc(50% - 1rem);
          }
        }

        .validation-box {
          .box-illustration {
            min-width: 30%;

            img {
              inset-inline-end: -34px;
              bottom: -28px;
            }
          }
        }
      }
    }

    .form-stepper {
      display: none;
    }
  }
}

@media only screen and (width >=768px) and (width <=1024px) and (orientation: portrait) {
  .stepper-form {
    padding-top: 0;

    .form-sections {
      max-width: 500px;
    }

    .form-stepper {
      top: 40px;
    }
  }
}

@media only screen and (width >=768px) and (width <=1024px) and (orientation: landscape) {
  .stepper-form {
    padding-top: 0;

    .form-stepper {
      .form-help {
        inset-inline-end: 2rem;
      }
    }
  }
}

@import "/@src/scss/abstracts/all";

.banking-dashboard-v1 {
  .columns {
    .column {
      height: fit-content;
    }
  }

  .dashboard-card {
    @include vuero-s-card;

    &:not(:last-child) {
      margin-bottom: 1.5rem;
    }

    &.is-credit-cards {
      padding: 0;

      .title-wrap {
        padding: 20px 20px 10px;
        margin-bottom: 0;
      }

      .card-block {
        .card-block-inner {
          display: flex;
          align-items: flex-start;
          padding: 20px;

          &:not(:first-child) {
            border-top: 1.6px dashed var(--fade-grey-dark-4);
          }

          .credit-card {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 140px;
            width: 280px;
            min-width: 120px;
            background: var(--fade-grey);
            border-radius: 10px;
            padding: 6px 10px 8px;
            overflow: hidden;

            &.is-theme-1 {
              background: var(--primary);
              box-shadow: var(--primary-box-shadow);
            }

            &.is-theme-2 {
              background: var(--info);
              box-shadow: var(--info-box-shadow);
            }

            .top {
              .card-number {
                display: flex;
                justify-content: space-between;
                align-items: center;

                span {
                  font-family: var(--font);
                  font-size: 0.8rem;
                  font-weight: 500;
                  color: var(--smoke-white);
                  display: block;
                }

                img {
                  display: block;
                  width: 100%;
                  max-width: 50px;
                }
              }
            }

            .bottom {
              font-family: var(--font);
              font-size: 0.7rem;
              font-weight: 500;
              color: var(--smoke-white);
            }

            .shape {
              position: absolute;
              bottom: -10px;
              inset-inline-end: -10px;
              height: 46px;
              width: 46px;
              background: var(--white);
              border-radius: var(--radius-rounded);
              opacity: 0.15;
            }
          }

          .credit-card-meta {
            margin-inline-start: 16px;

            span {
              display: block;
              font-family: var(--font);

              &:first-child {
                font-size: 0.9rem;
                color: var(--light-text);
              }

              &:nth-child(2) {
                color: var(--dark-text);
                font-size: 1.6rem;
                font-weight: 600;
                line-height: 1.2;
              }
            }
          }

          .credit-card-end {
            margin-inline-start: auto;
          }
        }

        .info-block-inner {
          padding: 10px 20px 20px;

          .title-wrap {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0;
            margin-bottom: 12px;

            h3 {
              font-size: 1rem;
              color: var(--dark-text);
              font-weight: 500;
            }

            .action-link {
              font-size: 0.9rem;
            }
          }

          .info-block-line {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1px 0;

            h4 {
              font-family: var(--font);
              font-weight: 500;
              color: var(--dark-text);
              font-size: 0.9rem;
              line-height: 2;
            }

            span {
              color: var(--light-text);
              font-size: 0.9rem;

              &.has-image {
                display: flex;
                justify-content: flex-end;
                align-items: center;
                flex-grow: 2;

                img {
                  max-width: 28px;
                  margin-inline-end: 6px;
                }
              }

              i {
                position: relative;
                top: 0;
                font-size: 10px;
                margin-inline-end: 8px;
              }
            }
          }
        }
      }
    }

    &.is-contacts {
      display: flex;
      flex-direction: column;
      height: 372px;

      .people-wrap {
        .people {
          display: flex;
          padding: 10px 0;

          .v-avatar {
            margin: 0 4px;
          }
        }

        .actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: var(--font);
          padding: 0 4px;

          span {
            font-size: 0.9rem;
            color: var(--light-text);
          }

          a {
            color: var(--light-text);

            &:hover,
            &:focus {
              color: var(--primary);
            }

            svg {
              height: 16px;
              width: 16px;
            }
          }
        }
      }

      .transfer-form {
        margin-top: auto;
      }
    }

    &.is-transactions {
      .transactions {
        padding: 10px 0;

        .media-flex-center {
          .flex-meta {
            span {
              &:nth-child(2) {
                font-size: 0.85rem;
              }
            }
          }

          .flex-end {
            font-family: var(--font);
            font-size: 1rem;
            font-weight: 500;
            color: var(--dark-text);
          }
        }
      }
    }

    &.is-income {
      position: relative;

      .field {
        position: absolute;
        top: 12px;
        inset-inline-end: 16px;
        z-index: 5;
        min-width: 160px;

        .multiselect {
          .multiselect-input {
            .multiselect-single-label {
              color: var(--light-text);
            }
          }

          .multiselect-options {
            inset-inline-start: unset !important;
            min-width: 180px;
          }
        }
      }
    }

    > .title-wrap {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
      font-family: var(--font);

      h3 {
        font-family: var(--font-alt);
        font-size: 1rem;
        font-weight: 600;
        color: var(--dark-text);
      }

      .title-meta {
        font-size: 1rem;
        font-weight: 500;
        color: var(--dark-text);
      }

      .action-link {
        font-size: 0.9rem;
      }
    }

    .context-text {
      font-size: 0.9rem;
      margin-bottom: 10px;
    }
  }
}

.is-dark {
  .banking-dashboard-v1 {
    .dashboard-card {
      @include vuero-card--dark;
    }
  }
}

.dashboard-card {
  @include vuero-l-card;

  font-family: var(--font);

  &:not(:last-child) {
    margin-bottom: 1.5rem;
  }

  &.is-welcome {
    background: var(--widget-grey);
    border: none;
    padding: 40px;

    .welcome-title {
      h3 {
        font-family: var(--font-alt);
        font-weight: 700;
        font-size: 2rem;
        color: var(--dark-text);
      }
    }

    .welcome-progress {
      display: flex;
      align-items: center;
      padding: 10px 0;

      .meta {
        margin-inline-start: 16px;

        span {
          display: block;

          &:first-child {
            color: var(--light-text);
            font-size: 0.95rem;
          }

          &:nth-child(2) {
            font-family: var(--font-alt);
            font-size: 1.1rem;
            font-weight: 600;
            color: var(--dark-text);
          }
        }
      }
    }

    .button-wrap {
      .v-button {
        height: 44px;
        border-radius: 10px;
      }
    }
  }

  &.is-interview {
    &:not(:last-child) {
      margin-bottom: 0.75rem;
    }

    .flex-end {
      svg {
        height: 18px;
        width: 18px;
        color: var(--light-text);
      }
    }
  }
}

.active-licence {
  background-color: ghostwhite;
  border: 2px solid var(--primary); // box-shadow: var(--info-box-shadow);
}
</style>
