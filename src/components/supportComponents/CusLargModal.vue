<script setup lang="ts">
import axios from "axios";
import myUpload from "vue-image-crop-upload";
import { useCompany } from "/@src/stores/company";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { markerColors } from "/@src/composable/useSupportElement";
import { convertToFormData } from "/@src/composable/useSupportElement";
import { useUserSession } from "/@src/stores/userSession";


const userSession = useUserSession();
const api = useApi();
const notyf = useNotyf();
const company = useCompany();
const currentContent = ref(1);
const VATRegistration = ref(false);
const supplierToken = ref("");
const supplierPassword = ref("");
const isCreateLink = ref(false);
const showColorContainer = ref(false);
const isLoading = ref(false);
const showAddressList = ref(false);
const isUploading = ref(false);
const user_action = ref("update");
const pdfPreviewModal = ref(false);
const currentPdfPreview = ref("");
const fileView = ref("");
const chartColor = ref("#fff");
const docExpiryDate = ref("");
const currentDocumentId = ref("");
const showExpiryDateInput = ref(false);
const Statvalue = ref(0);
// -------------1---------->
const logoUrl = ref<string>("");
const cropLogo = ref(false);

// ----------------------->
const SweetAlertProps = ref({
  title: "",
  subtitle: "test",
  isSweetAlertOpen: false,
  btntext: "text",
});
const currentColor = ref({
  id: 0,
  hexCode: "",
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

const props = defineProps<{
  OpenCusLargModal?: boolean;
  id: {
    type: String;
    default: 0;
  };
}>();
const emit = defineEmits<{
  (e: "update:cusModalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: null): void;
}>();

const closeModalHandler = () => {
  emit("update:cusModalHandler", false);
  emit("update:OnSuccess", null);
};
const showContent = (contentNumber: number) => {
  currentContent.value = contentNumber;
};

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
  color: "#D875C7",
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
  website: "https://",
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
  profileStats: {
    percentage: 0,
  },
});

const addNewSupplier = async () => {
  try {
    const formDataAPI = convertToFormData(supplierData.value, ["partnerLogo"]);

    let response = <any>{};

    formDataAPI.append("company", company.loggedCompany.id);
    if (supplierData.value.id) {
      response = await api.patch(
        `/v3/api/supplier/${supplierData.value.id}/`,
        formDataAPI
      );
      notyf.success("Data Added Succesfully.");
      company.loadSuppliers(company.loggedCompany.id)
    } else {
      response = await api.post("/v3/api/supplier/", formDataAPI);
      supplierData.value.id = response.data.id;
      notyf.success("New Partner Added Succesfully.");
      company.loadSuppliers(company.loggedCompany.id)
    }
    if (isCreateLink.value) {
      const baseURL = window.location.origin;
      supplierToken.value =
        baseURL + `/partner-signup?token=` + response.data.token;
      supplierPassword.value = response.data.password;
    } else {
      currentContent.value == 4
        ? closeModalHandler()
        : (currentContent.value += 1);
    }

    if (currentContent.value == 5) {
      closeModalHandler();
    }
  } catch (err: any) {
    notyf.error(err);
  }
};

const baseURL = window.location.origin + `/partner-signup?token=`;

const createUrlLink = () => {
  isCreateLink.value = true;
  if (supplierData.value.supplierName && supplierData.value.contactEmail) {
    addNewSupplier();
  } else {
    notyf.error("Please enter the name and email first");
  }
};

const copyToClipBoard = (link: string) => {
  navigator.clipboard.writeText(link);
  notyf.success("Link Copied");
};

const showColorsPellate = () => {
  showColorContainer.value = !showColorContainer.value;
};

const selecteColor = (color: any) => {
  currentColor.value = color;
  showColorContainer.value = false;
  supplierData.value = { ...supplierData.value, color: color.hexCode };
};

// google map
const drawmap = (lat: any, lng: any) => {
  let map = new google.maps.Map(document.getElementById("partnerMap"), {
    center: { lat: lat, lng: lng },
    scrollwheel: false,
    mapTypeId: google.maps.MapTypeId.Satellite,
    zoom: 7,
  });
  const marker = new google.maps.Marker({
    position: { lat: lat, lng: lng },
    map: map,
    title: "Supplier Location",
  });
  console.log(supplierData.value.latitude);
};

const getSupplier = async () => {
  const resp = await api.get(`/v3/api/supplier/${props.id}/detail/`);
  supplierPassword.value = resp.data.password;
  supplierData.value = resp.data;
  Statvalue.value = resp.data.profileStats.percentage;
  logoUrl.value = resp.data.partnerLogo;
  drawmap(resp.data.latitude, resp.data.longitude);
};

const handlePostCodeChange = async () => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${supplierData.value.postCode}&key=AIzaSyDWHedwkLGGa4_3XgPqYxIzMkFpOdKJRik`
    );
    if (response.data.status === "OK") {
      supplierData.value.address = response.data.results[0].formatted_address;

      const lat = response.data.results[0].geometry.location.lat;
      supplierData.value.latitude = lat;
      const lng = response.data.results[0].geometry.location.lng;
      supplierData.value.longitude = lng;

      drawmap(lat, lng);

      notyf.success("Address Added");
    } else if (response.data.status === "ZERO_RESULTS") {
      notyf.error("Invalid Post-Code");
    }
  } catch (error) {
    notyf.error("Invalid Post-Code");
    console.error(error);
  }
};

const handleClickOutside = () => {
  showAddressList.value = false;
};

onMounted(async () => {
  if (props.id) {
    await getSupplier();
  }
});

// ---------------------Cropy Logo------------------>
const cropSuccessLogo = (imgDataUrl: any) => {
  const file = DataURIToBlob(imgDataUrl);
  supplierData.value.partnerLogo = file;
  logoUrl.value = imgDataUrl;
  console.log("Image URl:", imgDataUrl);
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
</script>
<template>
  <div
    class="parent-div"
    v-if="props.OpenCusLargModal"
    @close="closeModalHandler"
  >
    <i
      class="lnir lnir-close close-icon"
      aria-hidden="true"
      @click="closeModalHandler"
      color="primary"
      elevated
    >
    </i>
    <div class="cus-sidebar">
      <ul>
        <li>
          <div
            @click="showContent(1)"
            :class="{ active: currentContent === 1 }"
            class="cus-single-link cu-pointer"
          >
            <span class="cus-icon" :class="{ active: currentContent === 1 }">
              1
            </span>
            Partner Infomation
          </div>
        </li>
        <li>
          <div
            @click="showContent(2)"
            :class="{ active: currentContent === 2 }"
            class="cus-single-link cu-pointer"
          >
            <span class="cus-icon" :class="{ active: currentContent === 2 }">
              2
            </span>
            Partner Documents
          </div>
        </li>
        <li>
          <div
            @click="showContent(3)"
            :class="{ active: currentContent === 3 }"
            class="cus-single-link cu-pointer"
          >
            <span class="cus-icon" :class="{ active: currentContent === 3 }">
              3
            </span>
            Bank / Tax Details
          </div>
        </li>
        <li>
          <div
            @click="showContent(4)"
            :class="{ active: currentContent === 4 }"
            class="cus-single-link cu-pointer"
          >
            <span class="cus-icon" :class="{ active: currentContent === 4 }">
              4
            </span>
            Contact Details
          </div>
        </li>
        <li></li>
      </ul>
      <div>
        <ApexChart :Statvalue="Statvalue" :color="chartColor" />
      </div>
    </div>

    <div class="form-content">
      <!-- --------------1------------- -->
      <div
        class="content-box"
        @click="handleClickOutside"
        v-show="currentContent === 1"
      >
        <div class="modal-form columns is-multiline">
          <div class="column is-12 mb-6">
            <h2 class="section-heading">
              <i
                style="margin-right: 10px"
                class="fas fa-building"
                aria-hidden="true"
              ></i>
              Partner Infomation
            </h2>
          </div>
          <form @submit.prevent="addNewSupplier">
            <div class="column is-12">
              <div class="">
                <div class="columns mb-4 p-0">
                  <div class="column is-8">
                    <div class="field columns mb-4 p-0">
                      <div class="column is-6 pb-4 cus-input-label">
                        Company Name
                      </div>
                      <div class="column is-8 pb-4">
                        <VField>
                          <input
                            type="text"
                            required
                            name="supplierName"
                            v-model="supplierData.supplierName"
                            class="mb-2 input is-primary-focus is-primary-focus"
                            placeholder="Company Name"
                          />
                        </VField>
                      </div>
                    </div>

                    <div class="columns mb-4 p-0">
                      <div class="column is-6 pb-4 cus-input-label">Email</div>
                      <div class="column is-8 pb-4">
                        <VField>
                          <input
                            required
                            v-model="supplierData.contactEmail"
                            type="email"
                            class="mb-2 input is-primary-focus is-primary-focus"
                            placeholder="Email
"
                          />
                        </VField>
                      </div>
                    </div>

                    <div class="columns mb-4 p-0">
                      <div class="column is-6 pb-4 cus-input-label">
                        Company Registration
                      </div>
                      <div class="column is-8 pb-4">
                        <VField>
                          <input
                            v-model="supplierData.registrationNumber"
                            name="registrationNumber"
                            type="text"
                            class="mb-2 input is-primary-focus is-primary-focus"
                            placeholder="Registration Number"
                          />
                        </VField>
                      </div>
                    </div>

                    <!-- phone number -->
                    <!-- <div class="columns mb-2 p-0">
                      <div class="column is-6 pb-4 cus-input-label">
                        Phone Number
                      </div>
                      <div class="column is-8 pb-4">
                        <VField>
                          <VControl expanded>
                            <VInput
                              v-model="supplierData.supplierPhoneNumber"
                              name="contactPhoneNumber"
                              type="phone"
                              placeholder="Phone number"
                            />
                          </VControl>
                        </VField>
                      </div>
                    </div> -->
                  </div>
                  <!-- Company logo -->
                  <VField class="column is-8">
                    <VControl class="is-flex is-justify-content-center mt-0">
                      <VAvatar size="xl" class="profile-v-avatar mt-0">
                        <template #avatar>
                          <img
                            v-if="!isUploading"
                            class="avatar"
                            :src="
                              !logoUrl ? '/images/logoplaceholder.png' : logoUrl
                            "
                          />

                          <!-- Upload & Edit btn -->
                          <span v-if="user_action == 'update'">
                            <VIconButton
                              style="position: absolute; top: 60%; right: -3%"
                              v-if="!isUploading"
                              icon="feather:edit-2"
                              class="edit-button is-edit"
                              circle
                              tabindex="0"
                              @keydown.space.prevent="isUploading = true"
                              @click="
                                () => {
                                  cropLogo = !cropLogo;
                                }
                              "
                            />

                            <VIconButton
                              style="position: absolute; top: 60%; right: -3%"
                              v-else
                              icon="feather:arrow-left"
                              class="edit-button is-back"
                              circle
                              tabindex="0"
                              @keydown.space.prevent="isUploading = false"
                              @click="isUploading = false"
                            />
                          </span>
                        </template>
                      </VAvatar>
                    </VControl>
                    <label style="display: flex; justify-content: center"
                      >Company logo</label
                    >
                  </VField>
                </div>
                <!-- ----------Cropy Logo------------>
                <my-upload
                  field="img"
                  @crop-success="cropSuccessLogo"
                  v-model="cropLogo"
                  :noRotate="false"
                  :noSquare="false"
                  langType="en"
                  img-format="png/jpg"
                ></my-upload>
              </div>

              <div
                v-if="userSession.user.role != 'partner'"
                class="columns mb-4 p-0"
              >
                <div class="column is-4 pb-4 cus-input-label">Link Expiry</div>
                <div class="column is-4 pb-4">
                  <VField>
                    <VControl>
                      <VSelect
                        v-model="supplierData.expiredIn"
                        class="is-rounded"
                      >
                        <VOption selected disabled value=""
                          >Link expired in</VOption
                        >
                        <VOption value="1">1 Day</VOption>
                        <VOption value="3">3 Days</VOption>
                        <VOption value="7">7 Days</VOption>
                        <VOption value="14">14 Days</VOption>
                      </VSelect>
                    </VControl>

                    <p
                      style="font-size: 12px; margin-top: 12px"
                      class="cus-set-optional"
                    >
                      URL:{{
                        supplierToken
                          ? supplierToken.slice(0, 30)
                          : supplierData.token
                          ? (baseURL + supplierData.token).slice(0, 30)
                          : "-------------------------------------------------------"
                      }}<i
                        @click="
                          copyToClipBoard(
                            supplierToken || baseURL + supplierData.token
                          )
                        "
                        v-if="supplierData.token || supplierToken"
                        class="fas fa-copy"
                        style="
                          font-size: 10px;
                          color: var(--primary);
                          margin-left: 10px;
                          cursor: pointer;
                        "
                        aria-hidden="true"
                      ></i>
                    </p>
                  </VField>
                </div>
                <div class="column is-4 pb-2">
                  <VTag
                    v-if="!supplierData.token"
                    type="info"
                    rounded
                    @click="createUrlLink"
                    style="
                      padding: 6px 10px !important;
                      height: max-content;
                      cursor: pointer;
                    "
                  >
                    Create customer URL
                  </VTag>

                  <p
                    style="font-size: 12px; margin-top: 2px"
                    class="cus-set-optional column"
                  >
                    Password:{{ supplierPassword ? supplierPassword : "******"
                    }}<i
                      @click="copyToClipBoard(supplierPassword)"
                      class="fas fa-copy"
                      v-if="supplierData.token || supplierPassword"
                      style="
                        font-size: 10px;
                        color: var(--primary);
                        margin-left: 6px;
                        cursor: pointer;
                      "
                      aria-hidden="true"
                    ></i>
                  </p>
                </div>
              </div>

              <div class="">
                <div class="columns mb-0 p-0">
                  <div class="column is-8">
                    <!-- link expiry -->
                    <div class="columns mb-4 p-0">
                      <div class="column is-6 pb-4 cus-input-label">
                        Country
                      </div>

                      <!-- country here -->
                      <VField class="column is-6 pb-4">
                        <VControl>
                          <VSelect
                            v-model="supplierData.country"
                            class="is-rounded"
                          >
                            <VOption selected disabled value=""
                              >Select country</VOption
                            >
                            <VOption value="United Kingdom"
                              >United Kingdom</VOption
                            >
                            <VOption value="United States"
                              >United States</VOption
                            >
                          </VSelect>
                        </VControl>
                      </VField>
                    </div>
                    <!-- industry -->
                    <div class="columns mb-4 p-0">
                      <div class="column is-6 pb-4 cus-input-label">
                        Industry
                      </div>
                      <VField required class="column is-6 pb-4">
                        <VControl>
                          <VSelect
                            required
                            v-model="supplierData.industry"
                            class="is-rounded"
                          >
                            <VOption selected disabled value=""
                              >Select industry</VOption
                            >
                            <VOption
                              v-for="(item, index) in compnayIndustries"
                              :key="index"
                              :value="item.id"
                              >{{ item.name }}
                            </VOption>
                          </VSelect>
                        </VControl>
                      </VField>
                    </div>

                    <!-- employees -->
                    <div class="columns mb-8 p-0">
                      <div class="column is-6 pb-4 cus-input-label">
                        Number of employees
                      </div>
                      <VField class="column is-6 pb-4">
                        <VControl>
                          <VSelect
                            v-model="supplierData.noOfEmployees"
                            class="is-rounded"
                          >
                            <VOption selected disabled value=""
                              >No of employees</VOption
                            >
                            <VOption value="50">0 - 50</VOption>
                            <VOption value="100">50 - 100</VOption>
                            <VOption value="200">100 - 200</VOption>
                            <VOption value="300">200 - 300</VOption>
                            <VOption value="500">300 - 500</VOption>
                            <VOption value="1000">500 - 1000</VOption>
                          </VSelect>
                        </VControl>
                      </VField>
                    </div>
                  </div>
                  <!--  -->
                  <div class="column is-4 pb-2">
                    <div class="revenue-stat">
                      <div
                        id="partnerMap"
                        style="height: 180px; width: 300px; border-radius: 10px"
                      ></div>
                    </div>
                  </div>
                  <!--  -->
                </div>
              </div>
              <!-- postcode -->
              <div class="columns mb-4 p-0">
                <div class="column is-4 pb-4 cus-input-label">Post Code</div>
                <div class="column is-8 pb-4">
                  <VField addons>
                    <VControl icon="lnir lnir-search-alt">
                      <VInput
                        type="text"
                        name="postCode"
                        autocomplete="off"
                        :loading="isLoading"
                        v-model="supplierData.postCode"
                        class="mb-2 input is-primary-focus is-primary-focus"
                        placeholder="Post code"
                      />
                    </VControl>
                    <VControl>
                      <VButton
                        @click="handlePostCodeChange"
                        color="primary"
                        rounded
                      >
                        Search
                      </VButton>
                    </VControl>
                  </VField>
                </div>
              </div>

              <div class="columns mb-4 p-0">
                <div class="column is-4 pb-4 cus-input-label">Address</div>
                <div class="column is-7 pb-4">
                  <VField>
                    <VControl>
                      <VTextarea
                        v-model="supplierData.address"
                        type="text"
                        name="address"
                        class="is-primary-focus"
                        rows="2"
                        placeholder="Full Address"
                      >
                      </VTextarea>
                    </VControl>
                  </VField>
                </div>
              </div>

              <div class="columns mb-4 p-0" style="position: relative">
                <div class="column is-4 pb-4 cus-input-label">
                  Color
                  <i
                    style="color: var(--primary); margin-left: 10px"
                    @click="showColorsPellate"
                    class="fas fa-paint-brush"
                    aria-hidden="true"
                  ></i>
                </div>
                <div class="column is-4 pb-4">
                  <div>
                    <div @click="showColorsPellate" class="color-pellate">
                      <div
                        class="current-color-div"
                        :style="{ backgroundColor: supplierData.color }"
                      ></div>
                    </div>
                  </div>
                </div>
                <!--  -->
                <div
                  v-if="showColorContainer"
                  style="
                    position: absolute;
                    bottom: 80px;
                    background-color: white;
                    width: 350px;
                  "
                >
                  <div class="colorContainer">
                    <div class="close-btn">
                      <i
                        @click="showColorsPellate"
                        class="lnir lnir-close"
                        aria-hidden="true"
                      ></i>
                    </div>

                    <div
                      v-for="(color, index) in markerColors"
                      :key="color.id"
                      @click="selecteColor(color)"
                      :style="{ backgroundColor: color.hexCode }"
                      class="colorDiv"
                    >
                      <i
                        v-if="currentColor == color"
                        class="fas fa-check"
                        aria-hidden="true"
                      ></i>
                    </div>
                  </div>
                </div>

                <div class="column is-4 pb-4">
                  <VButton type="submit" class="next-tag" rounded>
                    Save & Continue
                  </VButton>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <!-- Section2  -->
      <div class="content-box" v-show="currentContent == 2">
        <SupplierDocuments
          @update:OnSuccess="getSupplier"
          :id="supplierData.id"
          v-if="currentContent == 2"
        />
        <QuestionsOfMembers
          v-if="supplierData.id"
          type="partner"
          :memberId="supplierData.id"
        />
        <VButton
          @click="
            () => {
              addNewSupplier();
            }
          "
          style="float: right"
          rounded
          class="next-tag"
        >
          Continue
        </VButton>
      </div>

      <!-- section 3 documents -->

      <div class="content-box" v-show="currentContent === 3">
        <div class="column is-12 mb-6">
          <h2 class="section-heading">
            <i
              style="margin-right: 10px"
              class="lnir lnir-graph-increase"
              aria-hidden="true"
            ></i>
            Bank / Tax Details
          </h2>
        </div>
        <form @submit.prevent="addNewSupplier" style="overflow: hidden">
          <div class="modal-form columns is-multiline" style="overflow: hidden">
            <div class="column is-12">
              <div class="columns mb-2 p-0">
                <div class="column is-4 pb-4 cus-input-label">
                  VAT Registered
                </div>
                <div class="column is-6 pb-4">
                  <VField>
                    <VControl>
                      <VSwitchBlock
                        @click="supplierData.vatNumber = ''"
                        v-model="VATRegistration"
                        label="Yes"
                      />
                    </VControl>
                  </VField>
                </div>
              </div>
              <div v-if="VATRegistration" class="columns mb-2 p-0">
                <div class="column is-4 pb-4 cus-input-label">VAT Number</div>
                <div class="column is-4 pb-4">
                  <VField>
                    <input
                      v-model="supplierData.vatNumber"
                      type="text"
                      class="mb-2 input is-primary-focus is-primary-focus"
                      placeholder="VAT number"
                    />
                  </VField>
                </div>
              </div>

              <div class="columns mb-2 p-0">
                <div class="column is-4 pb-4 cus-input-label">
                  Unique Tax Reference
                </div>
                <div class="column is-5 pb-4">
                  <VField>
                    <input
                      v-model="supplierData.taxReference"
                      type="text"
                      class="mb-2 input is-primary-focus is-primary-focus"
                      placeholder="Tax Reference"
                    />
                  </VField>
                </div>
              </div>
              <!--  Bank Details  -->
              <!-- 1 -->
              <div class="columns mb-2 p-0">
                <div class="column is-4 pb-4 cus-input-label">Country</div>
                <VField class="column is-5 pb-4">
                  <VControl>
                    <VSelect
                      v-model="supplierData.bankCountry"
                      class="is-rounded"
                    >
                      <VOption selected disabled value=""
                        >Select country</VOption
                      >
                      <VOption value="United Kingdom">United Kingdom</VOption>
                      <VOption value="United States">United States</VOption>
                    </VSelect>
                  </VControl>
                </VField>
              </div>
              <!-- 2 -->
              <div class="columns mb-2 p-0">
                <div class="column is-4 pb-4 cus-input-label">Bank Name</div>
                <div class="column is-5 pb-4">
                  <VField>
                    <input
                      v-model="supplierData.bankName"
                      type="text"
                      class="mb-2 input is-primary-focus is-primary-focus"
                      placeholder="Bank Name"
                    />
                  </VField>
                </div>
              </div>
              <!-- 3 -->
              <div class="columns mb-2 p-0">
                <div class="column is-4 pb-4 cus-input-label">Account Name</div>
                <div class="column is-5 pb-4">
                  <VField>
                    <input
                      type="text"
                      v-model="supplierData.accountName"
                      class="mb-2 input is-primary-focus is-primary-focus"
                      placeholder="Account name
"
                    />
                  </VField>
                </div>
              </div>
              <div class="columns mb-2 p-0">
                <div class="column is-4 pb-4 cus-input-label">Sort Code</div>
                <div class="column is-5 pb-4">
                  <VField>
                    <input
                      v-model="supplierData.sortCode"
                      type="text"
                      class="mb-2 input is-primary-focus is-primary-focus"
                      placeholder="Sort code"
                    />
                  </VField>
                </div>
              </div>
              <div class="columns mb-2 p-0">
                <div class="column is-4 pb-4 cus-input-label">
                  Account Number
                </div>
                <div class="column is-5 pb-4">
                  <VField>
                    <input
                      type="text"
                      v-model="supplierData.accountNumber"
                      class="mb-2 input is-primary-focus is-primary-focus"
                      placeholder="Account number"
                    />
                  </VField>
                </div>
              </div>
              <div class="columns mb-2 p-0">
                <div class="column is-4 pb-4 cus-input-label">
                  Account Reference
                </div>
                <div class="column is-5 pb-4">
                  <VField>
                    <input
                      v-model="supplierData.accountReference"
                      type="text"
                      class="mb-2 input is-primary-focus is-primary-focus"
                      placeholder="Account reference"
                    />
                  </VField>
                </div>
                <!-- addNewSupplier(), -->
                <div class="column is-6 pb-4">
                  <VButton
                    rounded
                    class="next-tag"
                    @click="
                      () => {
                        addNewSupplier();
                      }
                    "
                  >
                    Save & Continue
                  </VButton>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <!-- section 4 -->
      <div class="content-box" v-show="currentContent === 4">
        <div class="modal-form columns is-multiline">
          <div class="column is-12 mb-6">
            <h2 class="section-heading">
              <i
                style="margin-right: 10px"
                class="lnir lnir-phone"
                aria-hidden="true"
              ></i>
              Contact Details
            </h2>
          </div>
          <form @submit.prevent="addNewSupplier">
            <div class="column is-12">
              <div class="columns mb-4 p-0">
                <div class="column is-6 pb-4 cus-input-label">Website</div>
                <div class="column is-8 pb-4">
                  <VField>
                    <input
                      v-model="supplierData.website"
                      type="url"
                      class="mb-2 input is-primary-focus is-primary-focus"
                      placeholder="Website"
                    />
                  </VField>
                </div>
              </div>

              <div class="columns mb-4 p-0">
                <div class="column is-6 pb-4 cus-input-label">Phone Number</div>
                <div class="column is-8 pb-4">
                  <VField>
                    <input
                      v-model="supplierData.contactPhoneNumber"
                      type="phone"
                      class="mb-2 input is-primary-focus is-primary-focus"
                      placeholder="Phone number"
                    />
                  </VField>
                </div>
                <div class="column is-4 pb-4">
                  <VButton type="submit" class="next-tag" rounded>
                    Save & Close
                  </VButton>
                </div>
              </div>
            </div>
          </form>
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
<style lang="scss" scoped>
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
  height: 20px;
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
