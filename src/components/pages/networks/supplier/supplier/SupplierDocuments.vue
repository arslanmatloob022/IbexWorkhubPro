<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useCompany } from "/@src/stores/company";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { useUserSession } from "/@src/stores/userSession";

const userSession = useUserSession();
const api = useApi();
const notyf = useNotyf();
const company = useCompany();
const DocLoading = ref(false);
const memberType = ref("partner");
const pdfPreviewModal = ref(false);
const currentPdfPreview = ref("");
const fileInput = ref<HTMLInputElement | null>(null);
const selectedDocRow = ref<any>({});
const isFirst = ref(true);
const fileView = ref("");
const docExpiryDate = ref("");
const combinedArray = ref([]);
const currentDocumentId = ref("");
const showExpiryDateInput = ref(false);
const currentSelectedID = ref(0);
const deleteDocumentTitle = ref("");
const SweetAlertProps = ref({
  title: "",
  subtitle: "test",
  isSweetAlertOpen: false,
  btntext: "text",
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

const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: null): void;
}>();

const props = defineProps<{
  id: {
    type: String;
    default: 0;
  };
}>();

const compnayIndustries = company.loggedCompany.industry
  ? company.loggedCompany.industry
  : [];
const supplierData = <any>ref({
  id: 0,
  latitude: "",
  longitude: "",
  supplierName: "",
  country: "United Kingdom",
  partnerLogo: null as File | null,
  noOfEmployees: "",
  supplierPhoneNumber: "",
  address: "",
  registrationNumber: "",
  postCode: "",
  color: "",
  registeredName: "",
  supplierEmailAddress: "",
  approved_till: "",
  vatNumber: "",
  taxReference: "",
  bankCountry: "",
  bankName: "",
  accountName: "",
  sortCode: "",
  accountNumber: "",
  accountReference: "",
  website: "",
  contactEmail: "",
  contactPhoneNumber: "",
  postalAddress: "",
  status: false,
  businessArea: "",
  contactPerson: "",
  tradingName: "",
  relationShip: "",
  industry: "",
  expiredIn: 7,
  company: 0,
});

const getSupplier = async () => {
  const resp = await api.get(`/v3/api/supplier/${props.id}/`);
  console.log(resp.data);
  supplierData.value = resp.data;
  drawmap(resp.data.latitude, resp.data.longitude);
};
// Complete address functions

const getWorkerDocuments = async () => {
  try {
    if (isFirst) {
      DocLoading.value = true;
      isFirst.value = false;
    }
    const response = await api.get(
      `/v3/api/partner/document/${props.id}/get_documents_of_a_partner/`,
      {}
    );
    DocLoading.value = false;

    combinedArray.value = response.data;
  } catch (error) {
    DocLoading.value = false;
    console.error("ok", error);
  }
};

const UpdateWorkerDocData = async (id: any, payload: any) => {
  try {
    const formDataAPI = new window.FormData();
    for (const key in payload) {
      formDataAPI.append(key, payload[key]);
    }
    const response = await api.patch(
      `/v3/api/partner/document/${id}/`,
      formDataAPI
    );
    notyf.dismissAll();
    notyf.success("worker document updated, Worker");
    getWorkerDocuments();
    updateDocLoading(false);
    currentSeletedDoumentId.value = 0;
    emit("update:OnSuccess", null);
  } catch (error) {
    console.error("ok", error);
  }
};

const UploadWorkerDoc = async (row: any, document: File) => {
  try {
    let payload = {
      status: false,
      partner: props.id,
      companyDocument: row.id,
      document: document,
    };
    const formDataAPI = new window.FormData();
    for (const key in payload) {
      formDataAPI.append(key, payload[key]);
    }
    console.log(row);
    const response = await api.post(`/v3/api/partner/document/`, formDataAPI);
    getWorkerDocuments();
    emit("update:OnSuccess", null);
  } catch (error) {
    notyf.error("Please reduce file size to upload");
  } finally {
    updateDocLoading(false);
  }
};

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const selectedFile = input.files?.[0];
  input.value = "";
  if (selectedFile) {
    updateDocLoading(true);
    selectedDocRow.value.partner
      ? UpdateWorkerDocData(selectedDocRow.value.id, { document: selectedFile })
      : UploadWorkerDoc(selectedDocRow.value, selectedFile);
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

const currentSeletedDoumentId = ref(0);
const showDateInputField = (id: any, currentDocExpDate: any) => {
  (docExpiryDate.value = currentDocExpDate),
    (currentSeletedDoumentId.value = id);
};

const triggerFileInput = (row: any): void => {
  selectedDocRow.value = row;
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const DeleteDocumentHandler = async () => {
  try {
    SweetAlertProps.value.isSweetAlertOpen = false;
    const response = await api.delete(
      `/v3/api/partner/document/${currentSelectedID.value}/`,
      {}
    );
    getWorkerDocuments();
    notyf.dismissAll();
    notyf.success("Delete worker document, Worker");
    emit("update:OnSuccess", null);
  } catch (error) {
    console.error("ok", error);
  }
};
const OpenDeleteSweetAlert = (row: any) => {
  currentSelectedID.value = row.id;
  deleteDocumentTitle.value = row.documentTitle;
  SweetAlertProps.value = {
    title: "Are you sure?",
    subtitle: "You will not be able to recover this Worker Document!",
    btntext: "Yes, Delete it",
    isSweetAlertOpen: true,
  };
};
onMounted(async () => {
  getWorkerDocuments();
});
</script>
<template>
  <div class="modal-form columns is-multiline">
    <div class="column is-12 mb-6">
      <h2 class="section-heading">
        <!-- <i
              style="margin-right: 10px"
              class="lnir lnir-envelope"
              aria-hidden="true"
            ></i> -->
      </h2>
    </div>
    <!-- cus-scrollbar -->
    <div
      class="profile-card column is-10"
      style="max-height: 820px; overflow-y: auto"
    >
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
          <div class="column is-12">
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
                            style="color: var(--light-text); font-weight: 500"
                            v-if="row.expiryDateRequired && !row.expiryDate"
                            class="cu-pointer"
                          >
                            Date required</span
                          >
                        </span>
                        <span class="item-meta">
                          <span class="cu-pointer cus-sub-title">{{
                            row.subTitle
                          }}</span>
                        </span>
                        <span
                          v-if="row.expiryDateRequired && row.document"
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
                            @click="showDateInputField(row.id, row.expiryDate)"
                            class="lnil lnil-pencil ml-2 cu-pointer"
                            style="color: var(--primary); font-size: 10px"
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

                  <template v-else-if="column.key === 'status'">
                    <div
                      id="cus-toggle-center"
                      class="navbar-item is-theme-toggle cell-end"
                      v-if="row.partner"
                    >
                      <label class="theme-toggle">
                        <input
                          :disabled="userSession.user.role == 'partner'"
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
                          style="background-color: var(info) !important"
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
                          style="border-color: var(--primary-grey) !important"
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
                              background-color: var(--primary-grey) !important;
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
                              showExpiryDateInput = row.expiryDateRequired;
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
                                showExpiryDateInput = row.expiryDateRequired;
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
                      v-if="row.partner"
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
              <VTag color="solid" label="No Documents Are Available!" rounded />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <VModal
    is="form"
    :open="pdfPreviewModal"
    :title="fileView"
    size="big"
    actions="right"
    @close="pdfPreviewModal = false"
  >
    <template #content>
      <VField v-if="showExpiryDateInput">
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
  <SweetAlert
    v-if="SweetAlertProps.isSweetAlertOpen"
    :isSweetAlertOpen="SweetAlertProps.isSweetAlertOpen"
    :title="SweetAlertProps.title"
    :subtitle="SweetAlertProps.subtitle"
    :btntext="SweetAlertProps.btntext"
    :onConfirm="DeleteDocumentHandler"
    :onCancel="() => (SweetAlertProps.isSweetAlertOpen = false)"
  />
</template>
<style scoped lang="scss">
::-webkit-scrollbar {
  display: none;
}

.parent-div {
  display: flex;
  position: fixed;
  left: 10%;
  top: 5%;
  width: 80%;
  height: 90dvh;
  z-index: 99;
  border-radius: 8px;
  background-color: #fafafa;
  box-shadow: 0px 1px 6px 1px #898989;
}

.cus-sidebar {
  height: auto;
  width: 25%;
  padding: 20px;
  border-radius: 8px 0 0 8px;
  background: #2aac8e;
  background: -webkit-linear-gradient(to top, #129769, #2aac8e);
  background: linear-gradient(to top, #1d976c, #2aac8e);

  .cus-single-link {
    color: #f1f1f1;
    margin: 16px;
    display: flex;
    gap: 16px;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid #e9e9e952;

    &:hover {
      color: var(--primary);
      background-color: #ffffffb7;
    }

    &.active {
      color: var(--primary);
      background-color: #fffffffb;
    }
  }
}

.form-content {
  height: 100%;
  width: 72%;
  padding: 3% 2%;
  border-radius: 0 8px 8px 0;
  overflow-y: auto;
  box-sizing: border-box;
  background-color: #fafafa;

  .section-heading {
    margin-left: 24px;
    font-size: 24px;
    color: #888888;
  }
}

.next-tag {
  padding: 10px 14px !important;
  color: #ffffff;
  height: max-content;
  cursor: pointer;
  background-color: var(--primary);
}

.close-icon {
  position: absolute;
  right: 10px;
  top: 10px;
  font-size: 16px;
  color: var(--primary);
  cursor: pointer;
}

.cus-input-label {
  padding-left: 36px;
  font-size: 18px;
  color: #777777;
}

.cus-set-optional {
  font-size: 10px;
  color: #777777;
}

.cus-icon {
  color: var(--primary);
  display: flex;
  width: 20px;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: #ffffff;

  &.active {
    color: #ffffffec;
    background-color: var(--primary);
  }
}

.colorContainer {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  border-radius: 12px;
  padding: 10px 4px;
  padding-top: 40px;
  border: 3px solid var(--primary);

  .colorDiv {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;

    color: #ffffff;
    cursor: pointer;
    width: 22.5%;
    box-sizing: border-box;
    border-radius: 5px;
    margin: 4px;
  }

  .cus-selected {
    height: 40px;
    border: 3px solid var(--primary);
    cursor: pointer;
    width: 22.5%;
    box-sizing: border-box;
    border-radius: 12px;
    margin: 4px;
  }

  .close-btn {
    position: absolute;
    right: 16px;
    top: 10px;

    height: 20px;
    color: var(--primary-light);
    cursor: pointer;
    width: 20px;
  }
}

.color-pellate {
  display: flex;

  i {
    color: var(--primary);
    cursor: pointer;
  }

  .current-color-div {
    height: 36px;
    border: 1px solid #f1f1f1;
    cursor: pointer;
    width: 100%;
    border-radius: 8px;
  }
}

@import "/@src/scss/abstracts/all";
@import "/@src/scss/components/profile-stats";

.wrapper-anim {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -1;
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
  scrollbar-color: #0a8367 #32a7768f;

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

.is-dark {
  .banking-dashboard-v1 {
    .dashboard-card {
      @include vuero-card--dark;
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

.list-widget {
  .image-icon {
    cursor: pointer;
    height: 40px;
    width: 40px;
  }
}
</style>
