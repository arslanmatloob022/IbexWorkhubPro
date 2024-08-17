<script setup lang="ts">
import ApexChart from "vue3-apexcharts";
import { useThemeColors } from "/@src/composable/useThemeColors";
import { ref } from "vue";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { CreateActivityLog } from "/@src/composable/useSupportElement";
import { sendWhatsappMessage } from "/@src/composable/useSupportElement";
const router = useRouter();
const themeColors = useThemeColors();
const route = useRoute();
const api = useApi();
const Loading = ref(false);
const DocLoading = ref(false);
const combinedArray = ref([]);
const notyf = useNotyf();
const pdfPreviewModal = ref(false);
const sanctionsDetailView = ref(false);
const currentPdfPreview = ref("");
const currentSelectedID = ref(0);
const fileInput = ref<HTMLInputElement | null>(null);
const selectedDocRow = ref<any>({});
const tab = ref<
  | "personal"
  | "licence"
  | "veriffTab"
  | "reference"
  | "questions"
  | "activity"
  | "warnings"
  | "comments"
  | "timeSheet"
  | "worker-rota"
>("personal");
const EditCompanyModalOpen = ref(false);
const isFirst = ref(true);
const EditWorkerID = ref(0);
const fileView = ref("");
const openDeleteAlert = ref(0);
const ProfileLink = ref("");
const UpdateProfileLink = ref("");
const isShowLink = ref(false);
const currentSelectedIndustry = ref(0);
const docExpiryDate = ref("");
const currentDocumentId = ref("");
const showExpiryDateInput = ref(false);
const currentSelectedIndustryName = ref("");
const deleteDocumentTitle = ref("");
const veriffModal = ref(false);
const openSanctionModal = ref(false);
const currentSeletedDoumentId = ref(0);
const showCertificate = ref(false);
const memberType = ref("worker");
const siaNumber = ref("");
const SweetAlertProps = ref({
  title: "",
  subtitle: "test",
  isSweetAlertOpen: false,
  btntext: "text",
});
const sanctionDetail = ref({
  id: 0,
  last_updated: "",
  date_designated: "",
  unique_id: "",
  ofsi_group_id: 0,
  un_reference_number: "",
  regime_name: "",
  individual_entity_ship: "",
  designation_source: "",
  sanctions_imposed: "",
  other_information: "",
  names: [],
  addresses: [],
});
const workerData = ref({
  id: 0,
  firstName: "",
  lastName: "",
  emailAddress: "",
  phoneNumber: "",
  lineManager: "",
  homeAddress: "",
  profileImageURL: null as File | null | string,
  externalID: " ",
  compnayIdCardNumber: " ",
  compnayIdCardExpiryDate: " ",
  signedDeclerationForm: " ",
  veriffStatus: "",
  sanctionStatus: false,
  warning: false,
  warningMessage: "",
  default_sia: <any>{
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
    updated_at: "",
    worker: 0,
  },
  industry: {
    id: 0,
    name: "",
    industryLogo: "",
  },
  arezCompany: "",
  status: false,
  postCode: "",
  rating: 0,
  activationCode: "",
  transport: "",
  archive: false,
  bs7858: false,
  profileStat: {
    percentage: "56",
  },
  pre_industries: [
    {
      id: 0,
      name: "",
      industryLogo: "",
    },
  ],
  bgColor: {
    id: 1,
    backgroundColor: "linear-gradient(to right, #1D2671, #C33764)",
  },
});

const columns = {
  documentTitle: {
    label: "Documents",
    grow: false,
    media: true,
  },
  status: {
    label: "Status",
    align: "center",
  },
  actions: {
    label: "Actions",
    align: "end",
  },
} as const;

const triggerFileInput = (row: any): void => {
  selectedDocRow.value = row;
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const UploadWorkerDoc = async (row: any, document: File) => {
  try {
    let payload = {
      status: false,
      worker: route.params.id,
      companyDocument: row.id,
      document: document,
    };
    const formDataAPI = new window.FormData();
    for (const key in payload) {
      formDataAPI.append(key, payload[key]);
    }
    console.log(row);
    const response = await api.post(`/v3/api/worker/document/`, formDataAPI);
    CreateActivityLog({
      message: `added a document  <b>${row.documentTitle}</b>`,
      objectId: route.params.id,
      method: "post",
    });
    getWorkerDocuments();
  } catch (error) {
    notyf.error("Please reduce file size to upload");
  } finally {
    updateDocLoading(false);
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
    if ("status" in payload) {
      CreateActivityLog({
        message: `Updated the status of <b> ${payload.docTitle} </b> to <b>${
          payload.status == true ? "Approved" : "Disapproved"
        }.</b>`,
        objectId: route.params.id,
        method: "patch",
      });
    } else if ("expiryDate" in payload) {
      CreateActivityLog({
        message: `update the expiry date of <b>${payload.docTitle}</b> to <b>${payload.expiryDate}</b>`,
        objectId: route.params.id,
        method: "patch",
      });
    }
    notyf.dismissAll();
    notyf.success("worker document updated, Worker");
    getWorkerDocuments();
    updateDocLoading(false);
    currentSeletedDoumentId.value = 0;
  } catch (error) {
    console.error("ok", error);
  }
};

const UpdateWorkerSelectedData = async (
  id: any,
  payload: any,
  isReloadWorker: boolean = true
) => {
  try {
    const formDataAPI = new window.FormData();
    for (const key in payload) {
      formDataAPI.append(key, payload[key]);
    }
    const response = await api.patch(`/v3/api/worker/${id}/`, formDataAPI);

    notyf.dismissAll();
    notyf.success("Worker  updated successfuly");
    if (isReloadWorker) {
      getworker();
    }
  } catch (error) {
    console.error("ok", error);
  }
};

const updateWorkerRating = () => {
  const payload = { rating: workerData.value.rating };
  UpdateWorkerSelectedData(workerData.value.id, payload, false);
  CreateActivityLog({
    message: `updated rating to <b>${workerData.value.rating} </b> stars`,
    objectId: route.params.id,
    method: "patch",
  });
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
  const input = event.target as HTMLInputElement;
  const selectedFile = input.files?.[0];
  input.value = "";
  if (selectedFile) {
    updateDocLoading(true);
    selectedDocRow.value.worker
      ? UpdateWorkerDocData(selectedDocRow.value.id, { document: selectedFile })
      : UploadWorkerDoc(selectedDocRow.value, selectedFile);
    CreateActivityLog({
      message: `updated <b> ${selectedDocRow.value.documentTitle} </b> document.`,
      objectId: route.params.id,
      method: "patch",
    });
  }
};

const getworker = async () => {
  try {
    Loading.value = true;
    const response = await api.get(
      `/v3/api/worker/${route.params.id}/profile/`,
      {}
    );
    workerData.value = response.data;
    siaNumber.value = response.data.default_sia
      ? response.data.default_sia.licenceNumber
      : "";
    if (workerData.value.pre_industries.length == 0) {
      workerData.value.pre_industries.push(response.data.industry);
    }
    if (response.data.latitude) {
      drawMap(response.data.latitude, response.data.longitude);
    } else {
      drawMap(51.4497984, -0.3464489);
    }
    getWorkerDocuments();
    Loading.value = false;
  } catch (error) {
    console.error("ok", error);
  }
};

const getWorkerDocuments = async () => {
  try {
    if (isFirst) {
      DocLoading.value = true;
      isFirst.value = false;
    }
    const response = await api.get(
      `/v3/api/worker/document/${route.params.id}/get_documents_of_a_worker/`,
      {}
    );
    DocLoading.value = false;
    combinedArray.value = response.data;
  } catch (error) {
    DocLoading.value = false;
    console.error("ok", error);
  }
};

const copyToClipBoard = (link: string) => {
  navigator.clipboard.writeText(link);
  notyf.success("Activation code copied");
  CreateActivityLog({
    message: `shared profile using <b> share link </b>`,
    objectId: route.params.id,
    method: "patch",
  });
};

const DeleteSwitchHandler = () => {
  if (openDeleteAlert.value == 2) {
    switchWorkerIndustry();
  } else if (openDeleteAlert.value == 1) {
    DeleteDocumentHandler();
  } else if (openDeleteAlert.value == 3) {
    archivedWorker();
  }
};

const OpenDeleteSweetAlert = (row: any) => {
  openDeleteAlert.value = 1;
  currentSelectedID.value = row.id;
  deleteDocumentTitle.value = row.documentTitle;
  SweetAlertProps.value = {
    title: "Are you sure?",
    subtitle: "You will not be able to recover this Worker Document!",
    btntext: "Yes, Delete it",
    isSweetAlertOpen: true,
  };
};

const openSwitchIndustryAlert = (industry: any) => {
  openDeleteAlert.value = 2;
  currentSelectedIndustry.value = industry.id;
  currentSelectedIndustryName.value = industry.name;
  SweetAlertProps.value = {
    title: "Are you sure?",
    subtitle:
      "Your documents and other informations will be changed according to your industry.",
    btntext: "Yes, switch it",
    isSweetAlertOpen: true,
  };
};

const OpenArchiveSweetAlert = () => {
  openDeleteAlert.value = 3;
  let btn_text = `Yes, ${workerData.value.status ? "In-Active" : "Active"} it`;
  SweetAlertProps.value = {
    title: "Are you sure?",
    subtitle: `This worker will be ${
      workerData.value.status ? "In-Active" : "Active"
    }`,
    btntext: btn_text,
    isSweetAlertOpen: true,
  };
};

let map = {};
const drawMap = (lat, lng) => {
  let center = { lat: lat, lng: length };
  map = new google.maps.Map(document.getElementById("myMap"), {
    center: center,
    scrollwheel: false,
    mapTypeId: google.maps.MapTypeId.Satellite,
    zoom: 6,
  });

  // Create marker for each worker
  const marker = new google.maps.Marker({
    position: { lat: lat, lng: lng },
    map: map,
    title: "Worker", // Set a title for the marker if needed
  });
};

const updateWorkerBsStatus = () => {
  UpdateWorkerSelectedData(
    workerData.value.id,
    { bs7858: !workerData.value.bs7858 },
    false
  );
};

const DeleteDocumentHandler = async () => {
  try {
    SweetAlertProps.value.isSweetAlertOpen = false;
    const response = await api.delete(
      `/v3/api/worker/document/${currentSelectedID.value}/`,
      {}
    );
    getWorkerDocuments();
    CreateActivityLog({
      message: `deleted <b>${deleteDocumentTitle.value}</b> document`,
      objectId: route.params.id,
      method: "delete",
    });
    notyf.dismissAll();
    notyf.success("Delete worker document, Worker");
    openDeleteAlert.value = 0;
  } catch (error) {
    console.error("ok", error);
  }
};

const optionsCircle = shallowRef({
  series: [0],
  chart: {
    height: 160,
    type: "radialBar",
    toolbar: {
      show: false,
    },
  },
  colors: [themeColors.accent],
  plotOptions: {
    radialBar: {
      hollow: {
        size: "40%",
      },
      dataLabels: {
        show: true,
        name: {
          show: true,
          fontSize: "16px",
          fontWeight: 500,
          offsetY: -10,
          color: themeColors.lightText,
        },
        value: {
          show: true,
          fontWeight: 600,
          color: "#fff",
          fontSize: "16px",
          offsetY: -10,
        },
      },
    },
  },
  labels: [""],
});

const switchWorkerIndustry = () => {
  SweetAlertProps.value.isSweetAlertOpen = false;
  UpdateWorkerSelectedData(workerData.value.id, {
    industry: currentSelectedIndustry.value,
  });

  CreateActivityLog({
    message: `switched to the <b>${currentSelectedIndustryName.value}</b> industry`,
    objectId: route.params.id,
    method: "patch",
  });
  openDeleteAlert.value = 0;
};

const archivedWorker = () => {
  UpdateWorkerSelectedData(
    workerData.value.id,
    { status: workerData.value.status },
    false
  );
  CreateActivityLog({
    message: `change status to <b>${
      workerData.value.status ? "Active" : "In-Active"
    }</b>`,
    objectId: route.params.id,
    method: "patch",
  });
  SweetAlertProps.value.isSweetAlertOpen = false;
  openDeleteAlert.value = 0;
};

const setWarningOnWorker = () => {
  UpdateWorkerSelectedData(
    workerData.value.id,
    { warning: !workerData.value.warning },
    false
  );
  CreateActivityLog({
    message: `Set to <b>${workerData.value.warning ? "Clear" : "Warning"}</b>`,
    objectId: route.params.id,
    method: "patch",
  });
  tab.value = "warnings";
};

const setWarningNote = () => {
  UpdateWorkerSelectedData(
    workerData.value.id,
    { warningMessage: workerData.value.warningMessage },
    false
  );
};

const whatsAppLinkChat = (number: any) => {
  sendWhatsappMessage(number);
  CreateActivityLog({
    message: `started chat on <b>WhatsApp</b>`,
    objectId: route.params.id,
    method: "patch",
  });
};

const showDateInputField = (id: any, currentDocExpDate: any) => {
  (docExpiryDate.value = currentDocExpDate),
    (currentSeletedDoumentId.value = id);
};

const openSanctionModalFunction = () => {
  if (workerData.value.sanctionStatus) {
    openSanctionModal.value = !openSanctionModal.value;
  }
};

const openCertificate = () => {
  const name = encodeURIComponent(
    workerData.value.firstName + " " + workerData.value.lastName
  );
  window.open(`/worker-certificate?name=${name}`, "_blank");
};

const showCertificateModal = () => {
  const name = encodeURIComponent(
    workerData.value.firstName + "" + workerData.value.lastName
  );
  const routeParams = { name };
  router.push({ query: routeParams, replace: true });
  showCertificate.value = !showCertificate.value;
};

const statusColor = {
  Sessioncreated: "#343a40",
  declined: "#dc3545",
  approved: "#0bad3d",
  Noattempt: "#5bc0de",
};

const verifySIA = async () => {
  try {
    if (siaNumber.value.length < 16) {
      return notyf.error("Invalid Number");
    }
    const response = await api.post(
      `v3/api/worker/worker_sia/${route.params.id}/verify-sia-number/`,
      { siaNumber: siaNumber.value }
    );
    if (response.data) {
      notyf.success("Licence Verified, Verify");
    }
  } catch (error) {
    notyf.error("Licence Unverified");
  }
};

const shortWarningMessage = computed(() => {
  return workerData.value.warningMessage
    ? workerData.value.warningMessage.slice(0, 80)
    : workerData.value.warningMessage;
});

watch(
  () => route.params.id,
  async () => {
    getworker();
  }
);
onMounted(async () => {
  await getworker();
});
</script>

<template>
  <div class="lifestyle-dashboard lifestyle-dashboard-v1">
    <div
      class="dashboard-header-wrapper mb-6"
      :style="{
        backgroundImage: workerData.bgColor.backgroundColor,
      }"
    >
      <div class="row">
        <div class="wrapper-anim">
          <div class="box-anim">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
        <div class="dashboard-header">
          <div
            class="avatar-container"
            style="
              border-radius: 22px;
              min-width: 170px;
              border: 0px solid #fff;
            "
          >
            <img
              size="medium"
              style="border-radius: 15px"
              :src="
                workerData.profileImageURL
                  ? workerData.profileImageURL
                  : '/images/avatars/placeholder.jpg'
              "
            />
          </div>
          <div class="header-meta">
            <div class="username-wrap">
              <div class="username ml-6">
                <div class="user-rating is-block">
                  <div class="ratings">
                    <VField>
                      <VControl>
                        <VRangeRating
                          @click="updateWorkerRating()"
                          readonly:false
                          v-model="workerData.rating"
                        />
                      </VControl>
                    </VField>
                  </div>
                  <h3
                    style="
                      color: white !important;
                      font-size: 23px;
                      font-weight: 700 !important;
                      margin-top: 0px;
                    "
                  >
                    <span style="white-space: nowrap"
                      >{{ workerData.firstName }}
                      {{ workerData.lastName }}</span
                    >
                  </h3>
                </div>
                <div class="username-wrap">
                  <div class="switches mt-1">
                    <div class="username cu-align-cen\ter">
                      <!-- <span>
<img src="/images/icons/workerProfile/mail-48.png" style="width: 22px; height: 20px; margin-top:4px; margin-left:3px" />
</span> -->
                      <span class="" style="font-weight: 400; color: white">{{
                        workerData.emailAddress
                      }}</span>
                    </div>
                  </div>
                  <div class="switches mt-3">
                    <div
                      class="username cu-pointer cu-align-center"
                      @click="whatsAppLinkChat(workerData.phoneNumber)"
                    >
                      <!-- <img src="/images/icons/workerProfile/phone.png"
style="width: 26px; height: 22px; margin-right: 2px" /> -->
                      <span class="ml-0" style="font-weight: 400; color: white">
                        {{ workerData.phoneNumber }}</span
                      >
                      <img
                        v-if="workerData.phoneNumber"
                        src="/images/icons/workerProfile/whatsapp.webp"
                        style="width: 20px; height: 20px; margin-left: 14px"
                      />
                    </div>
                  </div>
                  <div class="switches mt-0">
                    <div class="username cu-align-center">
                      <!-- <span>
<img src="/images/icons/workerProfile/industry.png" style="width: 26px; height: 22px" />
</span> -->
                      <!-- <span class="ml-2" style="font-weight:500">Industry:</span>
<span>{{ workerData.industry.name }}</span> -->
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="is-divider-vertical"></div>
          <div class="header-meta" style="margin-inline-start: 27px">
            <div class="user-switch">
              <div class="username-wrap">
                <div class="switches mb-0">
                  <div class="username">
                    <!-- <span>
<img v-if="workerData.status" src="/images/icons/workerProfile/active.png"
style="width: 22px; height: 22px" />
<img v-else-if="!workerData.status" src="/images/icons/workerProfile/inactive.png"
style="width: 22px; height: 22px" /></span> -->
                    <span
                      style="font-weight: 500; margin-left: 4px; color: white"
                    >
                      Account Status:</span
                    >
                    <VField horizontal style="margin-top: -3px">
                      <VControl>
                        <VSwitchSegment
                          @click="OpenArchiveSweetAlert"
                          v-model="workerData.status"
                          label-true=""
                          color="primary"
                          style="color: #f1f1f1"
                        />
                      </VControl>
                    </VField>
                  </div>
                </div>
                <div class="switches mb-0 mt-0">
                  <div class="username cu-align-center">
                    <span
                      style="font-weight: 500; margin-left: 4px; color: white"
                      >Activation Code:</span
                    >
                    <span style="letter-spacing: 1px; color: white"
                      >{{
                        workerData.activationCode
                          ? workerData.activationCode
                          : "-----"
                      }}
                      <i
                        @click="copyToClipBoard(workerData.activationCode)"
                        class="fas fa-copy mr-1 cus-onhover"
                        aria-hidden="true"
                      ></i
                    ></span>
                  </div>
                </div>

                <div class="switches mb-0 mt-1">
                  <div class="username cu-align-center">
                    <span
                      style="
                        white-space: nowrap;
                        font-weight: 500;
                        margin-left: 4px;
                        color: white;
                      "
                      >Veriff Status:
                    </span>
                    <span
                      :style="{
                        fontSize: '15px',
                        marginLeft: '2px',
                        color: 'white',
                      }"
                    >
                      {{
                        workerData.veriffStatus.charAt(0).toUpperCase() +
                        workerData.veriffStatus.slice(1)
                      }}</span
                    >
                    <VTag
                      v-if="workerData.veriffStatus == 'No attempt'"
                      style="cursor: pointer"
                      color="warning"
                      outlined
                      label="Create link"
                      curved
                      elevated
                      @click="
                        () => {
                          veriffModal = !veriffModal;
                        }
                      "
                    />
                  </div>
                </div>

                <div class="switches mb-0 mt-1">
                  <div class="username cu-pointer cu-align-center">
                    <span
                      style="color: white; font-weight: 500; margin-left: 4px"
                      >UK sanctions:</span
                    >
                    <span
                      class="ml-1 cu-pointer"
                      @click="openSanctionModalFunction"
                      :style="{
                        fontWeight: '400',
                        textDecoration: workerData.sanctionStatus
                          ? 'underline'
                          : '',
                        color: workerData.sanctionStatus ? '#fff' : '#fff',
                      }"
                    >
                      {{
                        workerData.sanctionStatus ? "Not Cleared" : "Cleared"
                      }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="is-divider-vertical"></div>
          <div class="header-meta">
            <div class="user-switch space-between">
              <div class="username-wrap">
                <div class="switches mb-0 is-flex">
                  <div class="username">
                    <!-- updateWorkerBsStatus -->
                    <span
                      style="font-weight: 500; margin-left: 4px; color: white"
                      >BS7858:</span
                    >
                    <VField horizontal style="margin-top: -3px">
                      <VControl>
                        <VSwitchBlock
                          @click="updateWorkerBsStatus"
                          v-model="workerData.bs7858"
                          label-true=""
                          color="primary"
                          style="color: #f1f1f1"
                        />
                      </VControl>
                    </VField>
                    <!-- openCertificate
                  showCertificate -->
                    <span v-if="workerData.bs7858">
                      <img
                        @click="showCertificateModal"
                        class="cu-pointer"
                        style="height: 24px; width: auto"
                        src="/images/view-48.png"
                      />
                    </span>
                  </div>
                </div>

                <div class="switches">
                  <div class="username">
                    <span style="font-weight: 500; color: white"
                      >Current Industries:</span
                    >
                  </div>
                </div>
                <div class="switches">
                  <div class="username" style="gap: 20px">
                    <span
                      v-for="(industry, index) in workerData.pre_industries"
                      :key="index"
                      v-tooltip.primary.top.rounded="'Switch industry'"
                      :class="
                        workerData.industry.name != industry.name
                          ? ''
                          : 'cus-default'
                      "
                      @click="openSwitchIndustryAlert(industry)"
                      style="
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        color: white;
                      "
                    >
                      <img
                        v-if="industry.id"
                        :src="industry.industryLogo"
                        style="
                          width: 42px;
                          height: 42px;
                          padding: 1px;
                          border-radius: 6px;
                        "
                      />
                      <span
                        class="active-industry"
                        :style="{
                          backgroundColor:
                            workerData.industry.name == industry.name
                              ? ''
                              : '#F5F5F5',
                          color:
                            workerData.industry.name == industry.name
                              ? ''
                              : 'black',
                        }"
                      >
                        {{ industry.name }}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="header-meta" style="margin-top: -12px">
            <div class="user-switch space-between">
              <div class="username-wrap">
                <div class="switches mb-4 is-flex">
                  <div class="username">
                    <VField>
                      <VControl>
                        <VSwitchBlock
                          @click="setWarningOnWorker"
                          color="warning"
                          v-model="workerData.warning"
                          label="Set warning"
                        />
                      </VControl>
                    </VField>
                  </div>
                </div>
                <!-- <div class="switches mb-4 is-flex">
                <img
                  style="height: 82px; width: auto"
                  v-if="workerData.warning"
                  src="/images/warning-96.png"
                />
              </div> -->
              </div>
            </div>
          </div>
          <div class="header-meta">
            <div class="user-switch">
              <div class="cus-justify-center">
                <ApexChart
                  id="radial-circle"
                  class="circle-chart-wrapper"
                  :height="optionsCircle.chart.height"
                  :type="optionsCircle.chart.type"
                  :series="[
                    workerData.profileStat
                      ? workerData.profileStat.percentage
                      : 0,
                  ]"
                  :options="optionsCircle"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          @click="
            () => {
              ProfileLink = `https://vms.arez.io/worker-profile/share/?id=${workerData.id}&code=${workerData.activationCode}`;
              isShowLink = true;
              UpdateProfileLink = `https://vms.arez.io/worker-profile/?code=${workerData.activationCode}`;
            }
          "
          rounded
          color="solid"
          label="Error"
          class="share-btn"
          style="color: #fff"
        >
          <i class="fas fa-share" aria-hidden="true"></i>
          Share
        </button>

        <button
          v-tooltip.success.bottom.rounded="'Edit Woker Profile'"
          @click="
            () => {
              EditWorkerID = workerData.id;
              EditCompanyModalOpen = true;
            }
          "
          class="edit-btn tooltip-custom-class"
          style="color: #fff"
        >
          <i class="fas fa-edit" aria-hidden="true"></i>
          Edit
        </button>

        <!-- message link profile-->
        <div class="link-message">
          <div v-if="isShowLink" class="mb-3 list-flex-toolbar is-reversed">
            <VMessage
              color="primary"
              class="is-flex copyLinkStyle"
              closable
              @close="isShowLink = false"
            >
              {{ ProfileLink }}
              <VTag
                v-tooltip.rounded.info="'Copy Link'"
                style="background-color: transparent"
                @click="copyToClipBoard(ProfileLink)"
              >
                <i
                  class="fas fa-copy mr-1 cus-onhover"
                  style="cursor: pointer; color: var(--info); font-size: large"
                  aria-hidden="true"
                ></i>
              </VTag>
              <br />
              {{ UpdateProfileLink }}
              <VTag
                v-tooltip.rounded.info="'Copy Link'"
                style="background-color: transparent"
                @click="copyToClipBoard(UpdateProfileLink)"
              >
                <i
                  class="fas fa-copy mr-1 cus-onhover"
                  style="cursor: pointer; color: var(--info); font-size: large"
                  aria-hidden="true"
                ></i>
              </VTag>
            </VMessage>
          </div>
        </div>
        <VBlock
          title="Warning Note"
          v-if="workerData.warning"
          class="cus-warning-block mt-1 column dark-text col-12"
          :subtitle="shortWarningMessage"
        >
          <template #icon>
            <VIconBox color="warning" rounded>
              <i
                class="iconify"
                data-icon="feather:alert-triangle"
                aria-hidden="true"
              ></i>
            </VIconBox>
          </template>
        </VBlock>
      </div>
    </div>

    <div class="profile-wrapper mt-0" style="width: 100%">
      <div class="profile-body">
        <div class="tabs-wrapper">
          <div class="tabs-inner mt-4">
            <div class="tabs is-toggle">
              <ul>
                <li :class="[tab === 'personal' ? 'is-active' : 'not-active']">
                  <a
                    tabindex="0"
                    role="button"
                    @keydown.space.prevent="tab = 'personal'"
                    @click="tab = 'personal'"
                    ><span>Profile</span></a
                  >
                </li>
                <li :class="[tab === 'licence' ? 'is-active' : 'not-active']">
                  <a
                    tabindex="0"
                    role="button"
                    @keydown.space.prevent="tab = 'licence'"
                    @click="tab = 'licence'"
                    ><span>Licence</span></a
                  >
                </li>
                <li :class="[tab === 'reference' ? 'is-active' : 'not-active']">
                  <a
                    tabindex="0"
                    role="button"
                    @keydown.space.prevent="tab = 'reference'"
                    @click="tab = 'reference'"
                    ><span>References</span></a
                  >
                </li>
                <li :class="[tab === 'veriffTab' ? 'is-active' : 'not-active']">
                  <a
                    tabindex="0"
                    role="button"
                    @keydown.space.prevent="tab = 'veriffTab'"
                    @click="tab = 'veriffTab'"
                    ><span>Identity Verification</span></a
                  >
                </li>
                <li :class="[tab === 'comments' ? 'is-active' : 'not-active']">
                  <a
                    tabindex="0"
                    role="button"
                    @keydown.space.prevent="tab = 'comments'"
                    @click="tab = 'comments'"
                    ><span>Comments</span></a
                  >
                </li>
                <li :class="[tab === 'questions' ? 'is-active' : 'not-active']">
                  <a
                    tabindex="0"
                    role="button"
                    @keydown.space.prevent="tab = 'questions'"
                    @click="tab = 'questions'"
                    ><span>Questions</span></a
                  >
                </li>
                <li :class="[tab === 'warnings' ? 'is-active' : 'not-active']">
                  <a
                    tabindex="0"
                    role="button"
                    @keydown.space.prevent="tab = 'warnings'"
                    @click="tab = 'warnings'"
                    ><span>Warnings</span></a
                  >
                </li>
                <li :class="[tab === 'activity' ? 'is-active' : 'not-active']">
                  <a
                    tabindex="0"
                    role="button"
                    @keydown.space.prevent="tab = 'activity'"
                    @click="tab = 'activity'"
                    ><span>Logs</span></a
                  >
                </li>
                <li :class="[tab === 'timeSheet' ? 'is-active' : 'not-active']">
                  <a
                    tabindex="0"
                    role="button"
                    @keydown.space.prevent="tab = 'timeSheet'"
                    @click="tab = 'timeSheet'"
                    ><span>Timesheet</span></a
                  >
                </li>
                <li
                  :class="[tab === 'worker-rota' ? 'is-active' : 'not-active']"
                >
                  <a tabindex="0" role="button" @click="tab = 'worker-rota'"
                    ><span>Worker Rota</span></a
                  >
                </li>
              </ul>
            </div>
          </div>
          <div v-show="tab === 'personal'" class="tab-content is-active">
            <div class="columns">
              <div class="column is-8">
                <!--documents -->
                <div class="profile-card">
                  <div class="profile-card-section">
                    <PlaceloadV1 v-if="Loading" />
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
                            class="noborder"
                            id="doc-table"
                          >
                            <template #body-cell="{ row, column, value }">
                              <template v-if="column.key === 'documentTitle'">
                                <VAvatar :picture="row.icon" :squared="true" />
                                <div class="cus-docTitles">
                                  <div id="titles">
                                    <span class="item-name mb-1 dark-inverted"
                                      >{{ row.documentTitle }}
                                      <img
                                        v-if="row.step == 'step_1'"
                                        style="width: 12px; height: 12px"
                                        src="/images/docmandatory.png"
                                      />
                                    </span>
                                    <span class="item-meta">
                                      <span
                                        style="
                                          color: var(--light-text);
                                          font-weight: 500;
                                        "
                                        v-if="row.expiryDateRequired"
                                        v-show="!row.expiryDate"
                                        class="cu-pointer"
                                      >
                                        Date required</span
                                      >
                                    </span>
                                    <span class="item-meta">
                                      <span class="cu-pointer cus-sub-title"
                                        >{{
                                          row.subTitle &&
                                          row.subTitle.length > 60
                                            ? row.subTitle.slice(0, 69)
                                            : "Not Added"
                                        }}...</span
                                      >
                                    </span>
                                    <span
                                      v-if="
                                        row.expiryDateRequired && row.document
                                      "
                                      class="item-meta"
                                    >
                                      <span
                                        :style="{
                                          color: row.expiryDate
                                            ? 'var(--primary)'
                                            : 'var(--danger)',
                                        }"
                                        class="cu-pointer"
                                        >Expiry date: {{ row.expiryDate }}</span
                                      >
                                      <i
                                        @click="
                                          showDateInputField(
                                            row.id,
                                            row.expiryDate
                                          )
                                        "
                                        class="lnil lnil-pencil ml-2 cu-pointer"
                                        style="
                                          color: var(--primary);
                                          font-size: 10px;
                                        "
                                        aria-hidden="true"
                                      ></i>
                                    </span>
                                  </div>
                                </div>
                                <div
                                  v-if="currentSeletedDoumentId == row.id"
                                  style="
                                    position: absolute;
                                    background-color: #fff;
                                    padding: 6px;
                                    width: 220px;
                                  "
                                >
                                  <VField>
                                    <i
                                      class="lnil lnil-close cu-pointer"
                                      @click="
                                        () => {
                                          currentSeletedDoumentId = 0;
                                        }
                                      "
                                      style="float: right"
                                      aria-hidden="true"
                                    ></i>
                                    <VLabel>Enter expiry date :</VLabel>
                                    <VControl>
                                      <VInput
                                        v-model="docExpiryDate"
                                        @change="
                                          UpdateWorkerDocData(row.id, {
                                            expiryDate: docExpiryDate,
                                            docTitle: fileView,
                                          })
                                        "
                                        type="Date"
                                        placeholder="Document expiry date"
                                      />
                                    </VControl>
                                  </VField>
                                </div>
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
                                        fileView = row.documentTitle;
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
                                        font-size: 26px;
                                        cursor: pointer;
                                        color: var(--primary);
                                      "
                                    ></i>
                                  </div>
                                </div>
                              </template> -->

                              <template v-else-if="column.key === 'status'">
                                <div
                                  id="cus-toggle-center"
                                  class="navbar-item is-theme-toggle cell-end"
                                  v-if="row.worker"
                                >
                                  <label class="theme-toggle">
                                    <input
                                      id="navbar-night-toggle--daynight"
                                      v-model="row.status"
                                      @click="
                                        UpdateWorkerDocData(row.id, {
                                          status: !row.status,
                                          docTitle: row.documentTitle,
                                        })
                                      "
                                      data-cy="dark-mode-toggle"
                                      type="checkbox"
                                    />
                                    <span class="toggler">
                                      <span class="dark">
                                        <i
                                          class="iconify"
                                          data-icon="feather:check"
                                          aria-hidden="true"
                                        ></i>
                                      </span>
                                      <span class="light">
                                        <i
                                          class="iconify"
                                          data-icon="feather:x"
                                          aria-hidden="true"
                                        ></i>
                                      </span>
                                    </span>
                                  </label>
                                </div>
                                <div
                                  id="cus-toggle-center"
                                  class="navbar-item is-theme-toggle"
                                  v-else
                                >
                                  <label class="theme-toggle">
                                    <input
                                      style="
                                        background-color: var(info) !important;
                                      "
                                      disabled
                                      v-model="row.status"
                                      @click="
                                        UpdateWorkerDocData(row.id, {
                                          status: !row.status,
                                          docTitle: row.documentTitle,
                                        })
                                      "
                                      data-cy="dark-mode-toggle"
                                      type="checkbox"
                                    />
                                    <span
                                      class="toggler"
                                      style="
                                        border-color: var(
                                          --primary-grey
                                        ) !important;
                                      "
                                    >
                                      <span class="cus-dark">
                                        <i
                                          color="info"
                                          class="iconify"
                                          data-icon="feather:check"
                                          aria-hidden="true"
                                        ></i>
                                      </span>
                                      <span
                                        class="light"
                                        style="
                                          background-color: var(
                                            --primary-grey
                                          ) !important;
                                        "
                                      >
                                        <i
                                          color="info"
                                          class="iconify"
                                          data-icon="feather:x"
                                          aria-hidden="true"
                                        ></i>
                                      </span>
                                    </span>
                                  </label>
                                </div>
                              </template>

                              <template v-else-if="column.key === 'actions'">
                                <div v-if="row.document">
                                  <div v-if="row.document.includes('.pdf')">
                                    <img
                                      @click="
                                        () => {
                                          currentPdfPreview = row.document;
                                          currentDocumentId = row.id;
                                          showExpiryDateInput =
                                            row.expiryDateRequired;
                                          pdfPreviewModal = true;
                                          fileView = row.documentTitle;
                                          docExpiryDate = row.expiryDate;
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
                                            currentDocumentId = row.id;
                                            showExpiryDateInput =
                                              row.expiryDateRequired;
                                            fileView = row.documentTitle;
                                            docExpiryDate = row.expiryDate;
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
                                  v-if="!row.loading"
                                  size="small"
                                  color="info"
                                  style="cursor: pointer"
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
                                  @click="OpenDeleteSweetAlert(row)"
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
                          <VTag
                            color="solid"
                            label="No Documents Are Available!"
                            rounded
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="column is-4">
                <!-- <div class="profile-card is-relative">
                  <div class="profile-card-section no-padding">
                    <div class="section-title">
                      <h4>Warning</h4>
                    </div>
                  </div>
                </div> -->
                <!--Notifications-->
                <div class="profile-card is-relative">
                  <!-- expand -->
                  <i
                    class="fas fa-expand-arrows-alt expand-arrow"
                    style="
                      color: var(--primary-light-12);
                      cursor: pointer;
                      position: absolute;
                      top: 10px;
                      right: 10px;
                    "
                    aria-hidden="true"
                    @click="tab = 'comments'"
                  ></i>
                  <div class="profile-card-section no-padding cus-comment">
                    <WorkerComments :id="route.params.id" />
                  </div>
                </div>

                <div class="profile-card is-relative">
                  <div class="profile-card-section no-padding">
                    <div class="section-title">
                      <h4>Location</h4>
                    </div>

                    <div class="section-content no-padding">
                      <div
                        id="myMap"
                        style="height: 300px; width: 100%; border-radius: 10px"
                      ></div>
                    </div>
                  </div>
                </div>

                <!--Licence Section-->
                <div class="profile-card is-relative">
                  <i
                    class="fas fa-expand-arrows-alt expand-arrow"
                    style="
                      color: var(--primary-light-12);
                      cursor: pointer;
                      position: absolute;
                      top: 10px;
                      right: 10px;
                    "
                    aria-hidden="true"
                    @click="tab = 'licence'"
                  ></i>
                  <div class="profile-card-section no-padding">
                    <div class="section-title">
                      <h4>License</h4>
                    </div>

                    <div class="section-content no-padding">
                      <div class="tools-wrapper">
                        <div class="banking-dashboard banking-dashboard-v1">
                          <div class="columns is-multiline">
                            <div
                              class="column is-12"
                              style="width: max-content"
                            >
                              <WorkerSiaCard
                                style="width: max-content"
                                :siaCard="workerData.default_sia"
                              />
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

          <div v-show="tab == 'licence'" class="tab-content is-active">
            <WorkerLicences :id="route.params.id" />
          </div>

          <div v-if="tab === 'veriffTab'">
            <div class="list-flex-toolbar mb-3 mt-2">
              <h6 class="cus-main-heading ml-1">Veriff Requests</h6>
              <div class="buttons">
                <span>
                  <img
                    src="/images/veriff-logo-round.svg"
                    style="
                      width: auto;
                      height: 20px;
                      margin-top: 4px;
                      margin-right: 6px;
                      border-radius: 6px;
                    "
                  />
                </span>
                <h5 class="light-text mr-4" style="font-weight: 500">
                  Send Veriff link
                </h5>
                <VButton
                  color="info"
                  @click="
                    () => {
                      veriffModal = !veriffModal;
                    }
                  "
                  icon="fas fa-link"
                  elevated
                >
                  Create link
                </VButton>
              </div>
            </div>

            <VeriffResponse :id="route.params.id" />
          </div>

          <div v-if="tab === 'reference'" class="tab-content is-active">
            <WorkerRefrence :id="route.params.id" :worker="workerData" />
          </div>
          <div v-if="tab === 'activity'" class="tab-content is-active">
            <WorkerActivityLogs :id="route.params.id" :worker="workerData" />
          </div>

          <div v-if="tab === 'comments'" class="tab-content is-active">
            <!-- <i @click="tab = 'personal'" class="fas fa-arrow-left" aria-hidden="true"
              style="color: var(--primary-light-12); margin-bottom:16px; cursor:pointer"></i> -->
            <WorkerComments :id="route.params.id" />
          </div>
          <div v-if="tab === 'questions'" class="tab-content is-active">
            <!-- <i @click="tab = 'personal'" class="fas fa-arrow-left" aria-hidden="true"
              style="color: var(--primary-light-12); margin-bottom:16px; cursor:pointer"></i> -->
            <QuestionsOfMembers
              :type="memberType"
              :memberId="route.params.id"
            />
          </div>
          <div v-if="tab === 'warnings'" class="tab-content is-active">
            <!-- <i @click="tab = 'personal'" class="fas fa-arrow-left" aria-hidden="true"
              style="color: var(--primary-light-12); margin-bottom:16px; cursor:pointer"></i> -->
            <VField>
              <VControl>
                <VTextarea
                  style="
                    border-radius: 15px !important;
                    background-color: #f5f5f5 !important;
                    border: none !important;
                    padding: 16px 20px !important;
                  "
                  @blur="setWarningNote"
                  v-model="workerData.warningMessage"
                  class="textarea is-warning-focus"
                  rows="2"
                  placeholder="Enter warning note..."
                />
              </VControl>
            </VField>
          </div>
          <div v-if="tab === 'timeSheet'" class="tab-content is-active">
            <WorkerTimeSheet :id="route.params.id" :worker="workerData" />
          </div>
          <div v-if="tab === 'worker-rota'" class="tab-content is-active">
            <RotaView :workerId="route.params.id" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <VModal
    is="form"
    :open="showCertificate"
    :title="fileView"
    size="big"
    actions="right"
    @close="showCertificate = false"
  >
    <template #content>
      <BScertificate />
    </template>
    <template #action>
      <VButton color="primary" @click="openCertificate" raised>Print</VButton>
    </template>
  </VModal>

  <SanctionList
    v-if="openSanctionModal"
    :firstName="workerData.firstName"
    :lastName="workerData.lastName"
    :openSanctionModal="openSanctionModal"
    @update:openSanctionModal="(value: boolean) => (openSanctionModal = value)"
  >
  </SanctionList>
  <!--  -->
  <VModal
    is="form"
    :open="pdfPreviewModal"
    :title="fileView"
    size="big"
    actions="right"
    @close="pdfPreviewModal = false"
  >
    <template #content>
      <div class="columns is-multiline">
        <VField
          :class="fileView == 'SIA Card' ? 'column is-6' : 'column is-12'"
          v-if="showExpiryDateInput"
        >
          <VLabel>Document expiry date :</VLabel>
          <VControl>
            <VInput
              v-model="docExpiryDate"
              @change="
                UpdateWorkerDocData(currentDocumentId, {
                  expiryDate: docExpiryDate,
                  docTitle: fileView,
                })
              "
              type="Date"
              placeholder="Document expiry date"
            />
          </VControl>
        </VField>

        <div class="column is-6" v-if="fileView == 'SIA Card'">
          <label class="light-text mb-2">SIA Number :</label>
          <VField addons class="mt-1">
            <VControl expanded>
              <VIMaskInput
                v-model="siaNumber"
                required
                class="input"
                id="siacard"
                :options="{
                  mask: '0000000000000000',
                }"
                placeholder="SIA Number"
              />
            </VControl>
            <VControl>
              <VButton @click="verifySIA" color="primary" rounded>
                Verify
              </VButton>
            </VControl>
          </VField>
          <label
            :class="
              workerData.default_sia && workerData.default_sia.status
                ? 'light-text'
                : 'danger-text'
            "
            class="mb-2"
            >Status:
            {{
              workerData.default_sia && workerData.default_sia.status
                ? "Approved"
                : "Un-approved"
            }}</label
          >
        </div>
      </div>
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

    <template #cancel>
      <VButton type="submit" style="display: none" color="primary" raised
        >Close</VButton
      >
    </template>
  </VModal>

  <VeriffLink
    v-if="veriffModal"
    :veriffModal="veriffModal"
    :id="workerData.id"
    :email="workerData.emailAddress"
    :phone="workerData.phoneNumber"
    @update:modalHandler="(value: boolean) => (veriffModal = value)"
  />

  <EditWorker
    v-if="EditCompanyModalOpen"
    :EditCompanyModalOpen="EditCompanyModalOpen"
    :id="EditWorkerID"
    @update:modalHandler="(value: boolean) => (EditCompanyModalOpen = value)"
    @update:OnSuccess="getworker"
  />

  <SweetAlert
    v-if="SweetAlertProps.isSweetAlertOpen"
    :isSweetAlertOpen="SweetAlertProps.isSweetAlertOpen"
    :title="SweetAlertProps.title"
    :subtitle="SweetAlertProps.subtitle"
    :btntext="SweetAlertProps.btntext"
    :onConfirm="DeleteSwitchHandler"
    :onCancel="() => (SweetAlertProps.isSweetAlertOpen = false)"
  />
</template>
<style lang="scss" scoped>
.media-flex {
  .flex-meta {
    span:first-child {
      font-family: var(--font-alt);
      color: #fff;
      font-weight: 600;
    }

    span:nth-child(2) {
      font-family: var(--font);
      color: #fff;
      font-size: 0.9rem;
    }
  }
}
</style>

<style lang="scss">
.v-tooltip {
  background-color: #2aac8e !important;
}
.tooltip-custom-class .v-tooltip {
  background-color: #2aac8e;
}

.media-flex .flex-meta span:nth-child(2),
.media-flex .flex-meta > a:nth-child(2) {
  font-family: var(--font);
  color: hsl(0deg 0% 100%);
  font-size: 0.9rem;
}
</style>

<style lang="scss" scoped>
@import "/@src/scss/abstracts/all";
@import "/@src/scss/components/profile-stats";

.v-tooltip {
  background-color: #2aac8e !important;
}

.search-job,
.search-salary {
  display: flex;
  align-items: center;
  width: 50%;
  font-size: 14px;
  font-weight: 500;
  padding: 0 25px;
  height: 100%;
  font-family: var(--font);

  input {
    width: 100%;
    height: 100%;
    display: block;
    font-family: var(--font);
    color: var(--input-color);
    background-color: transparent;
    border: none;
  }

  svg {
    margin-inline-end: 0.5rem;
    width: 18px;
    color: var(--primary);
    flex-shrink: 0;
  }
}

.active-industry {
  background: black;
  margin-top: 9px;
  padding: 1px 9px 1px 9px;
  border-radius: 10px;
  color: white;
  font-size: 12px;
}

.wrapper-anim {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -1;
}

.active-code {
  // background-color: var(--dark);
  border-radius: 4px;
  padding: 2px 6px 2px 6px;
  letter-spacing: 1px;
}

.box-anim div {
  position: absolute;
  width: 30px;
  height: 30px;
  background-color: transparent;
  border: 3px solid rgba(151, 179, 161, 0.5);
}

.box-anim div:nth-child(1) {
  top: 12%;
  left: 42%;
  animation: animate 10s linear infinite;
}

.box-anim div:nth-child(2) {
  top: 70%;
  left: 50%;
  animation: animate 7s linear infinite;
}

.box-anim div:nth-child(3) {
  top: 17%;
  left: 6%;
  animation: animate 9s linear infinite;
}

.box-anim div:nth-child(4) {
  top: 20%;
  left: 60%;
  animation: animate 10s linear infinite;
}

.box-anim div:nth-child(5) {
  top: 67%;
  left: 10%;
  animation: animate 6s linear infinite;
}

.box-anim div:nth-child(6) {
  top: 80%;
  left: 70%;
  animation: animate 12s linear infinite;
}

.box-anim div:nth-child(7) {
  top: 60%;
  left: 80%;
  animation: animate 15s linear infinite;
}

.box-anim div:nth-child(8) {
  top: 32%;
  left: 25%;
  animation: animate 16s linear infinite;
}

.box-anim div:nth-child(9) {
  top: 90%;
  left: 25%;
  animation: animate 9s linear infinite;
}

.box-anim div:nth-child(10) {
  top: 20%;
  left: 80%;
  animation: animate 5s linear infinite;
}

.box-anim div:nth-child(11) {
  top: 50%;
  left: 60%;
  animation: animate 5s linear infinite;
}

@keyframes animate {
  0% {
    transform: scale(0) translateY(-90px) rotate(360deg);
    opacity: 1;
  }

  100% {
    transform: scale(1.3) translateY(-90px) rotate(-180deg);
    border-radius: 50%;
    opacity: 0;
  }
}

.cus-comment {
  max-height: 300px;
  overflow-y: scroll;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: #2aac8e #32a7768f;

  &.cus-comment::-webkit-scrollbar {
    width: 5px;
    border-radius: 8px;
  }

  &.cus-comment::-webkit-scrollbar-thumb {
    background-color: #2aac8e;
    border-radius: 8px;
  }
}

// profile CSS
.cus-default {
  cursor: not-allowed;
  pointer-events: none;
}

.cus-blur {
  filter: brightness(80%);
}

#cus-toggler {
  position: relative;
  display: block;
  height: 31px;
  width: 53px;
  border: 2px solid var(--info);
  border-radius: 100px;
  transition:
    color 0.3s,
    background-color 0.3s,
    border-color 0.3s,
    height 0.3s,
    width 0.3s;
}

#cus-toggle-center {
  width: 100% !important;
  display: flex !important;
  justify-content: center !important;
}

.link-message {
  position: absolute;
  top: 30px;
  right: 12px;
  padding: 0;
}

.copyLinkStyle {
  height: 100% !important;
  border: 1px solid var(--primary) !important;
  padding: 0 !important;
}

.user-rating {
  display: flex;
  align-items: center;
  gap: 16px;

  .ratings {
    margin-top: 13px;
  }
}

.not-active {
  a {
    span {
      color: #818181;
    }
  }
}

.userIndustry {
  display: flex;
  gap: 10px;
  margin-top: 12px;
}

.user-info {
  margin-top: 10px;

  .username {
    display: flex;
    align-items: center;
  }

  span {
    margin-top: 4px;
  }
}

.activation {
  margin-top: 14px;
}

.user-switch {
  display: flex;
  margin-top: 12px;
  gap: 10px;

  .switches {
    width: max-content;
    display: flex;
    gap: 4px;
    margin-bottom: 4px;
    padding-right: 12px;

    .username {
      display: flex;
      gap: 5px;
      margin-top: 4px;
      color: #f1f1f1;
    }
  }
}

.margin {
  margin-top: 10px;
}

.user-status {
  display: flex;
  margin-right: 6px;
}

.DelBtn {
  height: min-content;
  padding: 4px;
  border: none;
  background-color: transparent;
  margin-top: 4px;
  cursor: pointer;
}

.edit-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  border: none;
  color: #fff;
  background-color: transparent;
  height: min-content;
}

.share-btn {
  position: absolute;
  top: 10px;
  right: 58px;
  cursor: pointer;
  border: none;
  color: #fff;
  background-color: transparent;
  height: min-content;
}

.add-btn {
  cursor: pointer;
  border: none;
  color: var(--primary-light-10);
  background-color: transparent;
  height: min-content;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.cus-docTitles {
  width: 250px !important;
  text-wrap: pretty !important;
}

.flex-table-cell {
  white-space: wrap !important;
}

.png-icon {
  display: flex;
  margin-right: 10px;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;

  border-radius: 50%;
  background-color: #09787823;
}

.flex-table-cell {
  white-space: wrap !important;
}

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
            height: 180px;
            width: 100%;
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
  border: 2px solid var(--primary);
  // box-shadow: var(--info-box-shadow);
}

/*================================*/
/* page styling*/
/*================================*/
.is-navbar {
  .profile-wrapper {
    margin-top: 30px;
  }
}

#doc-table > .flex-table-item {
  border: none !important;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 4px !important;
  transition: all ease-in-out 0.4s;
  transition: all ease-in-out 0.4s;

  &:hover {
    box-shadow: rgba(0, 0, 0, 0.24) 0px 5px 8px !important;
    transform: scaleZ(1.06);
    transform: scale(1.01);
  }
}

.profile-wrapper {
  margin: 0 auto;

  .profile-header {
    text-align: center;

    > img {
      display: block;
      margin: 0 auto;
      max-width: 300px;
    }

    .v-avatar {
      margin: 0 auto 12px;
    }

    .anim-icon {
      margin-bottom: 12px;
    }

    .title {
      margin-bottom: 6px;
    }

    p {
      font-size: 1rem;
      max-width: 540px;
      margin: 0 auto;
      line-height: 1.3;
    }
  }

  .profile-body {
    padding: 10px 0 20px;

    .profile-card {
      @include vuero-s-card;

      padding: 30px;

      &:not(:last-child) {
        margin-bottom: 20px;
      }

      .profile-card-section {
        padding-bottom: 20px;

        &:not(:last-child) {
          margin-bottom: 20px;
          border-bottom: 1px solid var(--fade-grey-dark-4);
        }

        &.no-padding {
          padding-bottom: 0;
        }

        .section-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;

          h4 {
            font-family: var(--font-alt);
            font-weight: 600;
            font-size: 0.8rem;
            text-transform: uppercase;
            color: var(--dark-text);
            margin-inline-end: 6px;
          }

          i {
            color: var(--primary);
          }

          .action-link {
            position: relative;
            top: -2px;
            margin-inline-start: auto;
            text-transform: uppercase;
            font-size: 0.8rem;
          }

          .control {
            margin-inline-start: auto;

            .form-switch {
              transform: scale(0.8);
            }
          }
        }

        .section-content {
          .description {
            font-size: 0.95rem;
          }

          .experience-wrapper {
            display: flex;
            flex-wrap: wrap;
            margin-inline-start: -8px;
            margin-inline-end: -8px;

            .experience-item {
              display: flex;
              align-items: center;
              width: calc(50% - 16px);
              margin: 8px;

              img {
                display: block;
                width: 50px;
                min-width: 50px;
                height: 50px;
                border-radius: var(--radius-rounded);
                border: 1px solid var(--fade-grey-dark-4);
              }

              .meta {
                margin-inline-start: 10px;

                > span {
                  font-family: var(--font);
                  display: block;

                  &:first-child {
                    font-family: var(--font-alt);
                    font-weight: 600;
                    color: var(--dark-text);
                    font-size: 0.85rem;
                  }

                  &:nth-child(2),
                  &:nth-child(3) {
                    font-size: 0.85rem;
                    color: var(--light-text);

                    i {
                      position: relative;
                      top: -2px;
                      font-size: 4px;
                      margin: 0 6px;
                    }
                  }

                  &:nth-child(3) {
                    color: var(--primary);
                  }

                  span {
                    display: inline-block;
                  }
                }
              }
            }
          }

          .languages-wrapper {
            display: flex;
            flex-wrap: wrap;
            margin-inline-start: -8px;
            margin-inline-end: -8px;

            .languages-item {
              display: flex;
              align-items: center;
              width: calc(50% - 16px);
              margin: 8px;

              .icon-wrap {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 50px;
                min-width: 50px;
                height: 50px;

                img {
                  position: absolute;
                  top: 50%;
                  inset-inline-start: 50%;
                  transform: translate(-50%, -50%);
                  display: block;
                  width: 32px;
                  min-width: 32px;
                  height: 32px;
                  border-radius: var(--radius-rounded);
                  border: 1px solid var(--fade-grey-dark-4);
                }
              }

              .meta {
                margin-inline-start: 10px;

                > span {
                  display: block;
                  font-family: var(--font);

                  &:first-child {
                    font-family: var(--font-alt);
                    font-weight: 600;
                    color: var(--dark-text);
                    font-size: 0.9rem;
                  }

                  &:nth-child(2) {
                    font-size: 0.85rem;
                    color: var(--light-text);
                  }

                  span {
                    display: inline-block;
                  }
                }
              }
            }
          }

          .skills-wrapper {
            .skills-item {
              display: flex;
              align-items: center;

              &:not(:last-child) {
                margin-bottom: 16px;
              }

              .icon-wrap {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 42px;
                min-width: 42px;
                height: 42px;
                border-radius: var(--radius-rounded);
                border: 1px solid var(--primary);

                &.has-icon {
                  background: var(--fade-grey-light-2);
                  border: 1px solid var(--fade-grey-dark-3);
                  color: var(--light-text);

                  i {
                    font-size: 1.4rem;
                  }
                }

                img {
                  display: block;
                  width: 34px;
                  min-width: 34px;
                  height: 34px;
                  border-radius: var(--radius-rounded);
                  border: 1px solid var(--fade-grey-dark-4);
                }

                .count {
                  position: absolute;
                  bottom: 0;
                  inset-inline-end: -4px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  width: 22px;
                  height: 22px;
                  border-radius: var(--radius-rounded);
                  background: var(--white);
                  border: 1px solid var(--primary);

                  span {
                    font-family: var(--font);
                    font-weight: 500;
                    font-size: 0.75rem;
                  }
                }
              }

              .skill-info {
                font-family: var(--font);
                margin-inline-start: 12px;
                line-height: 1.3;

                span {
                  display: block;

                  &:first-child {
                    font-family: var(--font-alt);
                    font-weight: 600;
                    color: var(--dark-text);
                    font-size: 0.9rem;
                  }

                  &:nth-child(2) {
                    font-size: 0.9rem;
                    color: var(--light-text);
                  }
                }
              }

              .people {
                margin-inline-start: auto;
                display: flex;
                justify-content: flex-end;

                .v-avatar {
                  margin: 0 4px;
                }
              }
            }
          }

          .recommendations-wrapper {
            display: flex;
            flex-wrap: wrap;
            margin-inline-start: -8px;
            margin-inline-end: -8px;

            .recommendations-item {
              width: calc(50% - 16px);
              margin: 8px;
              background: var(--fade-grey-light-3);
              text-align: center;
              padding: 30px 20px;
              border-radius: var(--radius);

              > .v-avatar {
                display: block;
                margin: 0 auto 8px;
              }

              h3 {
                font-size: 1rem;
                font-family: var(--font-alt);
                font-weight: 600;
                color: var(--dark-text);
                margin-bottom: 8px;
              }

              p {
                font-size: 0.85rem;
                margin-bottom: 16px;
              }

              .meta {
                span {
                  display: block;

                  &:first-child {
                    font-weight: 600;
                    font-family: var(--font-alt);
                    font-size: 0.95rem;
                    color: var(--primary);
                  }

                  &:nth-child(2) {
                    font-size: 0.9rem;
                    color: var(--light-text);
                  }
                }
              }
            }
          }

          .network-notifications {
            h3 {
              font-family: var(--font-alt);
              font-size: 0.9rem;
              margin-bottom: 6px;
            }

            p {
              font-size: 0.9rem;
              max-width: 480px;
            }
          }

          .tools-wrapper {
            padding-top: 12px;

            .tools-item {
              display: flex;
              align-items: center;
              margin-bottom: 16px;

              &:last-child {
                margin-bottom: 0;
              }

              .icon-wrap {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 50px;
                min-width: 50px;
                height: 50px;

                img {
                  position: absolute;
                  top: 50%;
                  inset-inline-start: 50%;
                  transform: translate(
                    calc(var(--transform-direction) * -50%),
                    -50%
                  );
                  display: block;
                  width: 32px;
                  min-width: 32px;
                  height: 32px;
                  border-radius: var(--radius-rounded);
                  border: 1px solid transparent;
                }
              }

              .meta {
                margin-inline-start: 10px;

                > span {
                  display: block;
                  font-family: var(--font);

                  &:first-child {
                    font-family: var(--font-alt);
                    font-weight: 600;
                    color: var(--dark-text);
                    font-size: 0.9rem;
                  }

                  &:nth-child(2) {
                    font-size: 0.85rem;
                    color: var(--light-text);
                  }

                  span {
                    display: inline-block;
                  }
                }
              }
            }
          }

          .people-wrapper {
            padding-top: 12px;

            .people-item {
              display: flex;
              align-items: center;
              margin-bottom: 16px;

              &:last-child {
                margin-bottom: 0;
              }

              .meta {
                margin-inline-start: 10px;

                > span {
                  display: block;
                  font-family: var(--font);

                  &:first-child {
                    font-family: var(--font-alt);
                    font-weight: 600;
                    color: var(--dark-text);
                    font-size: 0.9rem;
                  }

                  &:nth-child(2) {
                    font-size: 0.85rem;
                    color: var(--light-text);
                  }

                  span {
                    display: inline-block;
                  }
                }
              }
            }
          }

          .more-button {
            padding-top: 16px;

            .button {
              min-width: 180px;
              font-family: var(--font);
              text-transform: uppercase;
              font-size: 0.8rem;
              font-weight: 500;
              margin: 0 auto;
              color: var(--light-text);
            }
          }
        }
      }
    }
  }
}

.is-dark {
  .profile-wrapper {
    width: 100% !important;

    .profile-header {
      .v-avatar {
        .badge {
          border-color: var(--dark-sidebar-light-6);
        }
      }
    }

    .profile-body {
      .profile-card {
        @include vuero-card--dark;

        .profile-card-section {
          border-color: var(--dark-sidebar-light-12);

          .section-title {
            h4 {
              color: var(--dark-dark-text);
            }

            i {
              color: var(--primary);
            }
          }

          .section-content {
            .icon-wrap {
              > img {
                border-color: var(--dark-sidebar-light-12) !important;
              }
            }

            .experience-wrapper {
              .experience-item {
                > img {
                  border-color: var(--dark-sidebar-light-12);
                }

                .meta {
                  > span {
                    &:nth-child(3) {
                      color: var(--primary);
                    }
                  }
                }
              }
            }

            .skills-wrapper {
              .skills-item {
                .icon-wrap {
                  border-color: var(--primary) !important;

                  &.has-icon,
                  &.has-img {
                    background: var(--dark-sidebar-light-2) !important;
                    border-color: var(--dark-sidebar-light-12) !important;
                  }
                }

                .people {
                  .v-avatar {
                    &:last-child {
                      .is-fake {
                        background: var(--dark-sidebar-light-2);
                        border: 1px solid var(--dark-sidebar-light-12);
                      }
                    }
                  }
                }
              }
            }

            .recommendations-wrapper {
              .recommendations-item {
                background: var(--dark-sidebar-light-2);
                border-color: var(--dark-sidebar-light-12);

                .meta {
                  span {
                    &:first-child {
                      color: var(--primary);
                    }
                  }
                }
              }
            }

            .more-button {
              .button {
                background: var(--dark-sidebar-light-2);
                border-color: var(--dark-sidebar-light-12);
              }
            }
          }
        }
      }
    }
  }

  .icon-wrap,
  .icon-wrap.is-placeholder {
    background: var(--dark-sidebar-light-2) !important;
    border-color: var(--dark-sidebar-light-12) !important;
  }
}

@media only screen and (width <=767px) {
  .profile-wrapper {
    width: 100% !important;

    .profile-body {
      .profile-card {
        padding: 20px;

        .profile-card-section {
          .section-content {
            .experience-wrapper,
            .languages-wrapper,
            .recommendations-wrapper {
              .experience-item,
              .languages-item,
              .recommendations-item {
                width: calc(100% - 16px);
              }
            }

            .skills-wrapper {
              .skills-item {
                .people {
                  .v-avatar {
                    &:not(:last-child) {
                      display: none !important;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

.navbar-item {
  &.is-theme-toggle {
    opacity: 1;
    pointer-events: all;
  }

  .nav-link {
    position: relative;
    font-family: var(--font-alt);
    font-size: 0.9rem;
    color: var(--light-text);
    text-transform: capitalize;

    &::before {
      content: "";
      position: absolute;
      top: -4px;
      inset-inline-start: 2px;
      width: 50%;
      transform-origin: right center;
      height: 3px;
      border-radius: 50px;
      background: var(--primary);
      transform: scale(0, 1);
      transition: -webkit-transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      transition:
        transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
        -webkit-transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    // Hover state
    &:hover,
    &.is-active {
      color: var(--dark-text);

      &::before {
        transform-origin: left center;
        transform: scale(1, 1);
      }
    }

    &.active {
      &::before {
        background: var(--primary);
      }
    }
  }

  .theme-toggle {
    width: 54px;
    display: block;
    position: relative;
    cursor: pointer;
    font-size: 22px;
    user-select: none;
    transform: scale(0.9);

    &:focus-within {
      border-radius: 50px;
      outline-offset: var(--accessibility-focus-outline-offset);
      outline-width: var(--accessibility-focus-outline-width);
      outline-style: var(--accessibility-focus-outline-style);
      outline-color: var(--accessibility-focus-outline-color);
    }

    input {
      position: absolute;
      opacity: 0;
      cursor: pointer;

      &:checked ~ .toggler {
        border-color: var(--primary);

        .dark,
        .light {
          transform: translateX(calc(var(--transform-direction) * 100%))
            rotate(360deg);
        }

        .dark {
          opacity: 1 !important;
        }

        .light {
          opacity: 0 !important;
        }
      }
    }

    .toggler {
      position: relative;
      display: block;
      height: 31px;
      width: 53px;
      border: 2px solid var(--danger);
      border-radius: 100px;
      transition:
        color 0.3s,
        background-color 0.3s,
        border-color 0.3s,
        height 0.3s,
        width 0.3s;

      .dark,
      .light {
        position: absolute;
        top: 2px;
        inset-inline-start: 2px;
        height: 22px;
        width: 22px;
        border-radius: var(--radius-rounded);
        background: black;
        display: flex;
        justify-content: center;
        align-items: center;
        transform: translateX(calc(var(--transform-direction) * 0))
          rotate(calc(var(--transform-direction) * 0));
        transition: all 0.3s ease;

        svg {
          color: var(--white) !important;
          height: 14px !important;
          width: 14px !important;
          opacity: 1 !important;
        }
      }

      .light {
        background: var(--danger);
        border-color: var(--danger);
        opacity: 1;
        z-index: 1;
      }

      .dark {
        background: var(--primary);
        border-color: var(--primary);
        opacity: 0;
        z-index: 0;

        svg {
          color: var(--white) !important;
        }
      }
    }
  }

  .button {
    font-weight: 400 !important;
    height: 44px;
    min-width: 110px;
  }
}

/*
@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
  1st :  #ee7752
  2nd: #e73c7e,
}*/

.list-widget {
  .image-icon {
    cursor: pointer;
    height: 40px;
    width: 40px;
  }
}

.dashboard-header-wrapper {
  position: relative;
  display: flex;
  background-color: #f1f1f1;
  align-items: center;
  height: max-content;
  z-index: 1;
  border-radius: 22px;
  padding: 30px 40px;
  background-size: 150% 150%;
  animation: gradient 8s ease infinite;

  .dashboard-header {
    display: flex;
    width: 100%;

    .avatar-container {
      position: relative;
      height: 156px;
      width: 156px;
      padding: 6px;
      background-color: transparent;
      border: 4px solid #ffffff;
      border-radius: var(--radius-rounded);
      display: flex;
      justify-content: center;
      align-items: center;
      background-size: cover;
      overflow: hidden;

      img {
        object-fit: cover;
        height: 100%;
        width: 100%;
        min-width: 140px;
        border-radius: var(--radius-rounded);
      }

      .button {
        position: absolute;
        bottom: 5px;
        inset-inline-end: 5px;
      }
    }

    .header-meta {
      font-family: var(--font);
      margin-inline-start: 16px;

      .username-wrap {
        display: flex;
        flex-direction: column;

        .username {
          h3 {
            font-family: var(--font-alt);
            color: #ffffff;
            font-size: 1.2rem;
            font-weight: 700;
            margin-top: 10px;

            i {
              font-size: 1.2rem;
              margin-inline-start: 5px;
              color: var(--yellow);
            }
          }

          > span {
            margin-right: 4px;
            color: #f2f2f2;
          }
        }

        .badges {
          margin-inline-start: 16px;

          .tag {
            margin-inline-end: 0.5rem;
          }
        }
      }

      .meta-stats {
        display: flex;
        padding: 16px 0;

        .meta-stat {
          margin-inline-end: 30px;

          span {
            &:first-child {
              color: var(--dark-text);
              font-size: 1.3rem;
              font-weight: 600;
              margin-inline-end: 0.25rem;
            }

            &:nth-child(2) {
              color: var(--light-text);
            }
          }
        }
      }

      .meta-description {
        max-width: 640px;

        p {
          color: var(--light-text-dark-5);
        }
      }

      .meta-achievements {
        display: flex;
        padding-top: 16px;

        .meta-achievement {
          height: 36px;
          width: 36px;
          min-width: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid var(--white);
          background: var(--fade-grey);
          border-radius: var(--radius-rounded);
          margin-inline-end: 10px;
          box-shadow: var(--light-box-shadow);

          &.is-primary {
            color: var(--primary);
            background: var(--primary-light-45);
          }

          &.is-yellow {
            color: var(--yellow);
            background: var(--yellow-light-22);
          }

          &.is-danger {
            color: var(--danger);
            background: var(--danger-light-40);
          }
        }
      }
    }

    .end {
      margin-inline-start: auto;
    }
  }
}

.is-dark {
  .dashboard-header-wrapper {
    .dashboard-header {
      .header-meta {
        .username-wrap {
          .username {
            h3 {
              color: var(--dark-dark-text);
            }
          }
        }

        .meta-stats {
          .meta-stat {
            span {
              &:first-child {
                color: var(--dark-dark-text);
              }
            }
          }
        }
      }
    }
  }
}

@media only screen and (width <=767px) {
  .dashboard-header-wrapper {
    height: 418px;

    .dashboard-header {
      flex-direction: column;

      .avatar-container {
        margin: 0 auto 10px;
      }

      .header-meta {
        margin-inline-start: 0;
        text-align: center;

        .username-wrap {
          flex-direction: column;

          .badges {
            margin: 10px auto;
          }
        }

        .meta-stats {
          justify-content: center;

          .meta-stat {
            margin: 0 10px;
          }
        }

        .meta-achievements {
          justify-content: center;
          padding-bottom: 16px;
        }
      }

      .end {
        position: absolute;
        inset-inline-end: 0;
      }
    }
  }
}

.lifestyle-dashboard-bg {
  position: absolute;
  top: 0;
  inset-inline-start: 0;
  width: 100%;
  height: 355px;
  background: var(--white);
  z-index: 1;

  &.has-top-nav {
    height: 368px;
  }
}

.lifestyle-dashboard-v1 {
  .tabs-wrapper {
    .tabs-inner {
      .tabs {
        margin-bottom: 16px;
        z-index: 10;

        ul {
          border: none;

          li {
            z-index: 10;

            a {
              /* border-bottom-width: 4px;*/
            }
          }
        }
      }
    }
  }

  .body-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: var(--font);
    margin-bottom: 20px;

    h3 {
      font-family: var(--font-alt);
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--dark-text);
    }

    .field {
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

  .stat-widget {
    &:not(:last-child) {
      margin-bottom: 1.5rem;
    }
  }

  .post-stats {
    padding: 16px;
    text-align: center;
    width: 100%;
    font-family: var(--font);
    font-size: 0.9rem;

    span {
      color: var(--light-text);
    }

    .post-stat {
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1.2;

      i {
        font-size: 1.2rem;
        margin-inline-end: 6px;
      }

      .count {
        font-size: 2.2rem;
        font-weight: 700;
        color: var(--dark-text);
      }
    }
  }

  .post-group-wrap {
    padding: 4px 10px;

    .post-group {
      display: flex;
      margin-inline-start: -6px;
      margin-inline-end: -6px;

      a {
        display: block;
        width: calc(25% - 12px);
        margin: 6px;

        img {
          display: block;
          width: 100%;
          min-height: 65px;
          max-height: 85px;
          object-fit: cover;
          border-radius: var(--radius-large);
          margin: 0;
        }
      }
    }
  }
}

.is-dark {
  .lifestyle-dashboard-bg {
    background: var(--dark-sidebar-light-6);
  }

  .lifestyle-dashboard-v1 {
    .body-title {
      h3 {
        color: var(--dark-dark-text);
      }
    }
  }
}

@media only screen and (width <=767px) {
  .lifestyle-dashboard-bg {
    &:not(.has-top-nav) {
      height: 614px;
    }

    &.has-top-nav {
      height: 625px;
    }
  }

  .lifestyle-dashboard-v1 {
    .tabs-wrapper {
      .tabs-inner {
        .tabs {
          ul {
            text-align: center;
            justify-content: center;
          }
        }
      }
    }
  }
}

@media only screen and (width >=768px) and (width <=1024px) and (orientation: portrait) {
  .lifestyle-dashboard-bg {
    &.has-top-nav {
      height: 428px;
    }

    &:not(.has-top-nav) {
      height: 415px;
    }
  }

  .lifestyle-dashboard-v1 {
    .is-flex-tablet-p {
      flex-wrap: wrap;

      .is-half-tablet-p {
        min-width: 50%;
      }

      .is-full-tablet-p {
        min-width: 100%;
      }

      .column.is-3 {
        min-width: 50%;
      }
    }
  }
}
</style>
