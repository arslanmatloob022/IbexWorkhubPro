<script setup lang="ts">
import axios from "axios";
import myUpload from "vue-image-crop-upload";
import { useCompany } from "/@src/stores/company";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { markerColors } from "/@src/composable/useSupportElement";
import { convertToFormData } from "/@src/composable/useSupportElement";
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
const showExpiryDateInput = ref(false);
const Statvalue = ref(0);
// -------------1---------->
const logoUrl = ref<string>("");
const cropLogo = ref(false);
const vat = ref<string>("");
const editor = shallowRef<any>();
const aiDescription = ref<string>("");

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
  openCustomCompany?: boolean;
  id: {
    type: String;
    default: 0;
  };
}>();
const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: null): void;
}>();

const closeModalHandler = () => {
  emit("update:modalHandler", false);
  // emit("update:OnSuccess", null);
  console.log("modal closed");
  FormData.value = {
    name: "",
    trade_name: "",
    email: "",
    phone_number: "",
    postcode: "",
    latitude: "",
    longitude: "",
    logo: null as File | null,
    business_details: "",
    reg_no: "",
    business_type: "",
    covered_distance: "",
    vat_no: "",
    address: "",
    industry: "",
  };
};
const showContent = (contentNumber: number) => {
  currentContent.value = contentNumber;
};

const compnayIndustries = company.loggedCompany.industry
  ? company.loggedCompany.industry
  : [];
//   Form Data
const FormData = ref({
  id: "",
  name: "",
  trade_name: "",
  email: "",
  phone_number: "",
  postcode: "",
  latitude: "",
  longitude: "",
  logo: null as File | null,
  business_details: "",
  reg_no: "",
  business_type: "",
  covered_distance: "",
  vat_no: "",
  address: "",
  industry: "",
  company: company.loggedCompany.id,
  color: "#D875C7",
});

// -------Validation--------->
const validation = () => {
  if (!FormData.value.name) {
    return;
  }
  if (!FormData.value.email) {
    return;
  }
  if (FormData.value.id) {
    // addCompanyHandler()
  } else {
    currentContent.value = 2;
  }
};

// ------------Add New & Edit Company--------->

const addCompanyHandler = async () => {
  try {
    const formDataAPI = convertToFormData(FormData.value, ["logo"]);
    if (!FormData.value.company) {
      return notyf.error("Company is required!.");
    }

    let response = <any>{};

    if (FormData.value.id) {
      const response = await api.patch(
        `/v3/api/customer-company/${FormData.value.id}/`,
        formDataAPI
      );
      notyf.success("Data Added Succesfully.");

      emit("update:OnSuccess", null);
      if (currentContent.value == 4) {
        closeModalHandler();
      }
    } else {
      const response = await api.post("/v3/api/customer-company/", formDataAPI);
      closeModalHandler();
      notyf.dismissAll();
      notyf.success("New company added");
      emit("update:OnSuccess", null);
    }
    if (isCreateLink.value) {
      const baseURL = window.location.origin;
      supplierToken.value =
        baseURL + `/partner-signup?token=` + response.data.token;
      supplierPassword.value = response.data.password;
    } else {
      currentContent.value > 3
        ? closeModalHandler()
        : (currentContent.value += 1);
    }
    if (currentContent.value == 4) {
      closeModalHandler();
    }
  } catch (err: any) {
    notyf.error(err);
  }
};

// Get Prev Info Edit Company ()

const getCompany = async () => {
  const resp = await api.get(`/v3/api/customer-company/${props.id}/`);
  if (!resp.data.business_details) {
    resp.data.business_details = "";
  }
  FormData.value = resp.data;
  logoUrl.value = resp.data.logo;
  drawmap(resp.data.latitude, resp.data.longitude);
};

// ------Color Code Picker------->
const showColorsPellate = () => {
  showColorContainer.value = !showColorContainer.value;
};

const selecteColor = (color: any) => {
  currentColor.value = color;
  showColorContainer.value = false;
  FormData.value = { ...FormData.value, color: color.hexCode };
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
  console.log(FormData.value.latitude);
};

const handlePostCodeChange = async () => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${FormData.value.postcode}&key=AIzaSyDWHedwkLGGa4_3XgPqYxIzMkFpOdKJRik`
    );
    if (response.data.status === "OK") {
      FormData.value.address = response.data.results[0].formatted_address;

      const lat = response.data.results[0].geometry.location.lat;
      FormData.value.latitude = lat;
      const lng = response.data.results[0].geometry.location.lng;
      FormData.value.longitude = lng;

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

// --------Format AI Response Into correct format------->
const formatDescription = (description: any) => {
  const sections = description.split("**");
  const formattedSections = [];

  for (let i = 0; i < sections.length; i++) {
    if (sections[i] !== "") {
      if (i % 2 === 0) {
        formattedSections.push({ type: "title", content: sections[i].trim() });
      } else {
        formattedSections.push({
          type: "content",
          content: sections[i].trim(),
        });
      }
    }
  }

  return formattedSections;
};

const convertToString = (formattedSections: any[]) => {
  let result = "";

  for (const section of formattedSections) {
    if (section.type === "content") {
      result += `<h3>${section.content}</h3>\n`;
    } else {
      result += `<p>${section.content}</p>\n`;
    }
  }

  return result;
};

// --------Get Description from ai----->

const addAiDescription = async () => {
  isLoading.value = true;
  try {
    const { data } = await api.post(`v3/api/scripts/generate-content/`, {
      prompt: `Write description in correct format related to this company ${FormData.value.name}. Which business type is ${FormData.value.business_type}.  `,
    });

    const formattedSections = formatDescription(data);
    const formattedString = convertToString(formattedSections);
    console.log("formattedDescription:", formattedSections);

    FormData.value.business_details = formattedString;
    isLoading.value = false;
    console.log("AI Response:", aiDescription.value);
  } catch (error) {
    console.log(error);
    notyf.error("Something went wrong!");
    isLoading.value = false;
  }
};

onMounted(async () => {
  if (props.id) {
    await getCompany();
  }
});

// ---------------------Cropy Logo------------------>
const cropSuccessLogo = (imgDataUrl: any) => {
  const file = DataURIToBlob(imgDataUrl);
  FormData.value.logo = file;
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

// Business Type:
const businessType = [
  "Self-employed / Sole Trader",
  "Limited Company",
  "Public Limited Company",
  "Ordinary Partnership",
  "Limited Partnership",
];

const maxDistance = [5, 10, 15, 20, 25, 50, 75, 100];

// -----------Test Editor------------->

const CKEditor = defineAsyncComponent(() =>
  import("@ckeditor/ckeditor5-vue").then((m) => m.default.component)
);

const editorConfig = {
  fontFamily: {
    options: ['"Montserrat", sans-serif', '"Roboto", sans-serif'],
  },
  height: "400px",
  minHeight: "400px",
  maxHeight: "600px",
};

onMounted(async () => {
  // lazy load the editor when the component is mounted
  editor.value = await import("@ckeditor/ckeditor5-build-classic").then(
    (m) => m.default
  );
});
</script>
<template>
  <form
    class="parent-div"
    v-if="props.openCustomCompany"
    @submit.prevent="addCompanyHandler"
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
            Contact Infomation
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
            Businesss Information
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
            Location Information
          </div>
        </li>
        <li></li>
      </ul>
      <div>
        <!-- <ApexChart :Statvalue="Statvalue" :color="chartColor" /> -->
      </div>
    </div>

    <div class="form-content">
      <!-- -------------- Section 1 (Contact Information)------------- -->
      <div
        class="content-box"
        @click="handleClickOutside"
        v-show="currentContent === 1"
      >
        <div class="" v-show="currentContent === 1">
          <div class="modal-form columns cu-all-input is-multiline">
            <div class="column is-12 mb-6">
              <h2 class="section-heading">
                <i
                  style="margin-right: 10px"
                  class="fas fa-building"
                  aria-hidden="true"
                ></i>
                Contact Infomation
              </h2>
            </div>
            <div class="column is-12">
              <div class="columns mb-0 p-0">
                <!-- Content -->
                <div class="column is-6 mb-0 p-0">
                  <div class="field column is-12 mb-0">
                    <label>Registered Company Name: *</label>
                    <div class="control">
                      <input
                        type="text"
                        name="registeredCompanyName"
                        v-model="FormData.name"
                        required
                        class="input is-primary-focus is-primary-focus"
                        placeholder="Registered Company Name"
                      />
                    </div>
                  </div>
                  <!-- @change="(e) => inputChangeHandler(e)" -->

                  <!-- Company Registration Number -->
                  <div class="field column is-12 mb-0">
                    <label>Company Registration Number:</label>
                    <div class="control">
                      <input
                        type="text"
                        name="companyRegistrationNumber"
                        v-model="FormData.reg_no"
                        class="input is-primary-focus is-primary-focus"
                        placeholder="Company Registration Number"
                      />
                    </div>
                  </div>

                  <div class="field column is-12 mb-0">
                    <label>Trade Name: </label>
                    <div class="control">
                      <input
                        type="text"
                        name="tradename"
                        v-model="FormData.trade_name"
                        class="input is-primary-focus is-primary-focus"
                        placeholder="Trade Name"
                      />
                    </div>
                  </div>
                </div>
                <!-- Logo -->
                <VField class="column is-6">
                  <label>Company Logo:</label>
                  <VControl class="is-flex is-justify-content-center mt-5">
                    <VAvatar size="xl" class="profile-v-avatar mt-4">
                      <template #avatar>
                        <img
                          v-if="!isUploading"
                          class="avatar"
                          :src="
                            !logoUrl
                              ? '/images/avatars/placeholder.jpg'
                              : logoUrl
                          "
                          alt=""
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
                  <my-upload
                    field="img"
                    @crop-success="cropSuccessLogo"
                    v-model="cropLogo"
                    :noRotate="false"
                    :noSquare="false"
                    langType="en"
                    img-format="png/jpg"
                  ></my-upload>
                </VField>
              </div>
            </div>

            <!-- email -->
            <div class="field column is-6 mb-0">
              <label>Email Address: *</label>
              <div class="control">
                <input
                  type="email"
                  name="emailAddress"
                  v-model="FormData.email"
                  required
                  class="input is-primary-focus is-primary-focus"
                  placeholder="Email Address"
                />
              </div>
            </div>

            <!-- phone number -->
            <div class="field column is-6 mb-0">
              <label>Phone Number:</label>
              <div class="control">
                <input
                  type="tel"
                  name="phoneNumber"
                  v-model="FormData.phone_number"
                  class="input is-primary-focus is-primary-focus"
                  placeholder="Phone Number"
                />
              </div>
            </div>
            <!-- Button -->
            <div
              class="column is-12 pb-4"
              style="
                display: flex;
                align-items: center;
                justify-content: flex-end;
                margin-top: 2rem;
              "
            >
              <VButton
                type="submit"
                @click="validation"
                class="next-tag"
                style="width: 6rem"
              >
                Next
              </VButton>
            </div>
          </div>
        </div>
      </div>

      <!-- -----------------Section2----------------------  -->
      <div class="" v-show="currentContent === 2">
        <div class="modal-form columns cu-all-input is-multiline">
          <div class="column is-12 mb-6">
            <h2 class="section-heading">
              <i class="lnil lnil-graph-alt-3" aria-hidden="true"></i>
              Business Information
            </h2>
          </div>
          <!-- Business Type -->
          <div
            class="field column is-4 mb-0"
            style="display: flex; flex-direction: column; gap: 0.2rem"
          >
            <label>Business Type: </label>
            <VField>
              <VControl>
                <VSelect
                  v-model="FormData.business_type"
                  name="business_type"
                  class="is-rounded"
                >
                  <VOption value="">Please select</VOption>
                  <VOption
                    v-for="(business, index) in businessType"
                    :value="business"
                    :key="index"
                    >{{ business }}
                  </VOption>
                </VSelect>
              </VControl>
            </VField>
            <VField id="interests" class="pb-4" label=""> </VField>
          </div>

          <!-- Work Distance -->
          <div
            class="field column is-4 mb-0"
            style="display: flex; flex-direction: column; gap: 0.2rem"
          >
            <label>Max Working Distance: </label>
            <VField>
              <VControl>
                <VSelect
                  v-model="FormData.covered_distance"
                  name="covered_distance"
                  class="is-rounded"
                >
                  <VOption value="">Please select</VOption>
                  <VOption
                    v-for="(distance, index) in maxDistance"
                    :value="distance"
                    :key="index"
                    >{{ distance }} miles
                  </VOption>
                </VSelect>
              </VControl>
            </VField>
            <VField id="interests" class="pb-4" label=""> </VField>
          </div>

          <!-- post code -->
          <div class="field column is-6 mb-0">
            <label>Are you VAT registered?: </label>
            <div
              class="control"
              style="
                display: flex;
                align-items: center;
                gap: 0.7rem;
                margin-top: 1rem;
              "
            >
              <label
                for="notVatRegistered"
                style="display: flex; align-items: center; gap: 0.5rem"
              >
                <input
                  id="notVatRegistered"
                  type="radio"
                  name="vat"
                  v-model="vat"
                  value="No"
                  style=""
                  placeholder="VAT number"
                />
                <b>No</b> I'm not VAT registered
              </label>
              <label
                for="vatRegistered"
                style="display: flex; align-items: center; gap: 0.5rem"
              >
                <input
                  id="vatRegistered"
                  type="radio"
                  name="vat"
                  v-model="vat"
                  value="Yes"
                  style=""
                  placeholder="VAT number"
                />
                <b>Yes</b> I'm VAT registered
              </label>
            </div>
          </div>
          <!-- VAT Number -->
          <div class="field column is-6 mb-0" v-if="vat === 'Yes'">
            <label>Your VAT Number: </label>
            <div class="control">
              <input
                type="text"
                name="vatnumber"
                v-model="FormData.vat_no"
                class="input is-primary-focus is-primary-focus"
                placeholder="VAT Number"
              />
            </div>
          </div>
        </div>
        <!-- -----Text Editor-- -->
        <div class="field column is-12 mb-0">
          <label style="margin-bottom: 0.5rem">Business Details</label>
          <div class="page-content-inner">
            <div class="columns is-multiline">
              <div class="column is-12">
                <div class="columns">
                  <div class="column is-12 content" style="position: relative">
                    <VButton
                      color="primary"
                      raised
                      :loading="isLoading"
                      style="
                        position: absolute;
                        z-index: 50;
                        top: 0.9rem;
                        right: 2rem;
                        width: 2rem;
                      "
                      title="Write description with AI."
                      @click="addAiDescription"
                      ><i
                        class="fas fa-robot"
                        aria-hidden="true"
                        style="font-size: 1.5rem; cursor: pointer"
                      ></i
                    ></VButton>
                    <!-- min-height: 400px; max-height: 600px; -->
                    <CKEditor
                      v-if="editor"
                      v-model="FormData.business_details"
                      :editor="editor"
                      :config="editorConfig"
                    />
                    <VPlaceload v-else height="500px" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Button -->
        <div
          class="column is-12 pb-4"
          style="
            display: flex;
            align-items: center;
            justify-content: flex-end;
            margin-top: 2rem;
          "
        >
          <VButton
            type="button"
            @click="
              () => {
                FormData.id ? addCompanyHandler() : (currentContent = 3);
              }
            "
            class="next-tag"
            style="width: 6rem"
          >
            Next
          </VButton>
        </div>
      </div>

      <!--------------- Section 3 (Location Info) ------------- -->

      <div class="content-box" v-show="currentContent === 3">
        <div class="column is-12 mb-6">
          <h2 class="section-heading">
            <i
              class="iconify"
              data-icon="feather:map-pin"
              aria-hidden="true"
            ></i>
            Location Information
          </h2>
        </div>

        <div class="">
          <div class="modal-form columns cu-all-input is-multiline">
            <!-- Post Code  -->
            <div class="field column is-6 mb-0">
              <label>Postcode: *</label>
              <div class="control" style="position: relative">
                <VButton
                  color="primary"
                  light
                  style="
                    position: absolute;
                    right: 0.2rem;
                    top: 0.3rem;
                    z-index: 10;
                    width: 3rem;
                    border-radius: 2rem;
                  "
                  @click="handlePostCodeChange"
                  ><i
                    class="iconify"
                    data-icon="feather:search"
                    aria-hidden="true"
                    style="font-size: 1.5rem"
                  ></i
                ></VButton>
                <input
                  type="text"
                  name="postCode"
                  autocomplete="off"
                  required
                  :loading="isLoading"
                  v-model="FormData.postcode"
                  class="mb-2 input is-primary-focus is-primary-focus"
                  placeholder="Enter post code "
                />
              </div>
              <!--  @blur="handlePostCodeChange" -->
            </div>

            <!-- phone number -->
            <div class="field column is-6 mb-0">
              <label>Business Address: </label>
              <div class="control">
                <input
                  type="text"
                  name="businessAdress"
                  v-model="FormData.address"
                  class="input is-primary-focus is-primary-focus"
                  placeholder="Business Address"
                />
              </div>
            </div>
            <!-- --------------Color Picker--------- -->
            <div
              class="columns mb-4 p-0"
              style="position: relative; margin-left: -2rem; cursor: pointer"
            >
              <div
                class="column is-6 pb-4 cus-input-label"
                style="
                  display: flex;
                  align-items: center;
                  gap: 0.5rem;
                  color: #bbb;
                  font-weight: 500;
                  width: 100%;
                "
                @click="showColorsPellate"
              >
                Color
                <i
                  style="color: var(--primary); margin-left: 10px; size: 3rem"
                  class="fas fa-paint-brush"
                  aria-hidden="true"
                ></i>
              </div>
              <div class="column is-6 pb-4">
                <div>
                  <div @click="showColorsPellate" class="color-pellate">
                    <div
                      class="current-color-div"
                      :style="{ backgroundColor: FormData.color }"
                    ></div>
                  </div>
                </div>
              </div>
              <!--  -->
              <div
                v-if="showColorContainer"
                style="
                  position: absolute;
                  bottom: -2rem;
                  background-color: white;
                  width: 350px;
                  left: 6rem;
                  z-index: 999;
                "
              >
                <div class="colorContainer">
                  <div class="close-btn">
                    <i
                      @click="showColorContainer = false"
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
            </div>

            <!--  Map View -->
            <div class="column is-12 pb-2" style="margin-top: 0.3rem">
              <div class="revenue-stat">
                <div
                  id="partnerMap"
                  style="
                    height: 250px;
                    width: 100%;
                    border-radius: 10px;
                    border-radius: 1rem;
                  "
                ></div>
              </div>
            </div>
          </div>
          <VButton
            :loading="isLoading"
            type="submit"
            color="primary"
            raised
            :style="{ float: 'right' }"
            >Save & close</VButton
          >
        </div>
      </div>
    </div>
  </form>

  <SweetAlert
    v-if="SweetAlertProps.isSweetAlertOpen"
    :isSweetAlertOpen="SweetAlertProps.isSweetAlertOpen"
    :title="SweetAlertProps.title"
    :subtitle="SweetAlertProps.subtitle"
    :btntext="SweetAlertProps.btntext"
    :onCancel="() => (SweetAlertProps.isSweetAlertOpen = false)"
  />
  <!--     :onConfirm="DeleteDocumentHandler" -->
</template>

<style lang="scss">
.ck .ck-content {
  min-height: 20rem !important;
  max-height: 25rem !important;
}
.ck-editor__editable_inline {
  min-height: 400px !important;
  max-height: 460px !important;
}
</style>
<style lang="scss" scoped>
// --------------->
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
ck-editor__editable
  ck-rounded-corners
  ck-editor__editable_inline
  ck-blurred
  .ck-content {
  background: red;
  height: 20rem !important ;
}
</style>
