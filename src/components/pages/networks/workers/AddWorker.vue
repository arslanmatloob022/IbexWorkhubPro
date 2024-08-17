<script setup lang="ts">
import axios from "axios";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { useCompany } from "/@src/stores/company";
import myUpload from "vue-image-crop-upload";
import { convertToFormData } from "/@src/composable/useSupportElement";
import { useUserSession } from "/@src/stores/userSession";

const userSession = useUserSession();
const notyf = useNotyf();
const api = useApi();
const isLoading = ref(false);
const company = useCompany();
// ----------->
const isUploading = ref(false);
const user_action = ref("update");
const cropLogo = ref(false);
const logoUrl = ref<string>("");
// ------------>
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
  industry: "",
  arezCompany: "",
  postCode: "",
  latitude: 0,
  longitude: 0,
  supplier: "",
});

const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: null): void;
}>();
const props = defineProps<{
  AddCompanyModalOpen?: boolean;
}>();

const companySuppliers = company.suppliers ? company.suppliers : [];
const compnayIndustries = company.loggedCompany.industry
  ? company.loggedCompany.industry
  : [];

const addWorkerHandler = async () => {
  try {
    isLoading.value = true;
    const formDataAPI = convertToFormData(FormData.value, ["profileImageURL"]);
    formDataAPI.append("arezCompany", company.loggedCompany.id);
    const response = await api.post("/v3/api/worker/", formDataAPI);
    closeModalHandler();
    notyf.dismissAll();
    notyf.success("New worker added, New Worker");

    emit("update:OnSuccess", null); // Emit an event to update the prop
  } catch (error: any) {
    let errorObj = error.response.data ?? {};
    Object.values(errorObj).forEach((values) => {
      values.forEach((value) => {
        notyf.error(` ${value}, New Worker`);
      });
    });
  } finally {
    isLoading.value = false;
  }
};
const inputChangeHandler = (event: any) => {
  console.log(event.target.name);
  FormData.value = {
    ...FormData.value,
    [event.target.name]: event.target.value,
  };
};
const closeModalHandler = () => {
  emit("update:modalHandler", false); // Emit an event to update the prop
  console.log("modal closed");
  FormData.value = {
    id: "",
    firstName: "",
    lastName: "",
    emailAddress: "",
    phoneNumber: "",
    lineManager: "",
    homeAddress: "",
    profileImageURL: null as File | null,
    externalID: " ",
    industry: "",

    latitude: 0,
    longitude: 0,
    arezCompany: "",
  };
};

const handlePostCodeChange = async () => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${FormData.value.postCode}&key=AIzaSyDWHedwkLGGa4_3XgPqYxIzMkFpOdKJRik`
    );
    if (response.data.status === "OK") {
      FormData.value.homeAddress = response.data.results[0].formatted_address;
      FormData.value.latitude = response.data.results[0].geometry.location.lat;
      FormData.value.longitude = response.data.results[0].geometry.location.lng;
      notyf.success("Address Added");
    } else if (response.data.status === "ZERO_RESULTS") {
      notyf.error("Invalid Post-Code");
    }
  } catch (error) {
    notyf.error("Invalid Post-Code");
    console.error(error);
  }
};

const cropSuccessLogo = (imgDataUrl: any) => {
  const file = DataURIToBlob(imgDataUrl);
  FormData.value.profileImageURL = file;
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

onMounted(() => {
  if (userSession.user.role == "partner") {
    FormData.value.supplier = userSession.user.partner;
  }
});

</script>

<template>
  <VModal
    is="form"
    :open="props.AddCompanyModalOpen"
    title="New Worker"
    size="big"
    actions="right"
    @submit.prevent="addWorkerHandler"
    @close="closeModalHandler"
    noclose
  >
    <template #content>
      <div class="modal-form columns cu-all-input is-multiline">
        <div class="column is-12">
          <div class="columns mb-0 p-0">
            <VField class="column is-6">
              <label>Profile Image:</label>
              <VControl class="is-flex is-justify-content-center mt-5">
                <VAvatar size="xl" class="profile-v-avatar mt-4">
                  <template #avatar>
                    <img
                      v-if="!isUploading"
                      class="avatar"
                      :src="
                        !logoUrl ? '/images/avatars/placeholder.jpg' : logoUrl
                      "
                      alt=""
                      style="border: 1px solid #111;"
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
            <div class="column is-6 mb-0 p-0">
              <div class="field column is-12 mb-0">
                <label>First Name: *</label>
                <div class="control">
                  <input
                    type="text"
                    name="firstName"
                    v-model="FormData.firstName"
                    @change="(e) => inputChangeHandler(e)"
                    required
                    class="input is-primary-focus is-primary-focus"
                    placeholder="First Name"
                  />
                </div>
              </div>

              <div class="field column is-12 mb-0">
                <label>Last Name: </label>
                <div class="control">
                  <input
                    type="text"
                    name="lastName"
                    v-model="FormData.lastName"
                    @change="(e) => inputChangeHandler(e)"
                    class="input is-primary-focus is-primary-focus"
                    placeholder="Last Name"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- email -->
        <div class="field column is-6 mb-0">
          <label>Email Address: *</label>
          <div class="control">
            <input
              type="email"
              name="emailAddress"
              v-model="FormData.emailAddress"
              @change="(e) => inputChangeHandler(e)"
              required
              class="input is-primary-focus is-primary-focus"
              placeholder="Email Address"
            />
          </div>
        </div>

        <!-- phone number -->
        <div class="field column is-6 mb-0">
          <label>Phone Number: </label>
          <div class="control">
            <input
              type="tel"
              name="phoneNumber"
              v-model="FormData.phoneNumber"
              @change="(e) => inputChangeHandler(e)"
              class="input is-primary-focus is-primary-focus"
              placeholder="Phone Number"
            />
          </div>
        </div>

        <!-- post code -->
        <div class="field column is-6 mb-0">
          <label>Post Code: </label>
          <div class="control">
            <input
              type="text"
              name="postCode"
              v-model="FormData.postCode"
              @blur="handlePostCodeChange"
              @change="(e) => inputChangeHandler(e)"
              class="input is-primary-focus is-primary-focus"
              placeholder="Post code"
            />
          </div>
        </div>

        <!-- address -->
        <div class="field column is-6 mb-0">
          <label>Home Address: </label>
          <div class="control">
            <input
              type="text"
              name="homeAddress"
              v-model="FormData.homeAddress"
              @change="(e) => inputChangeHandler(e)"
              class="input is-primary-focus is-primary-focus"
              placeholder="Home Address"
            />
          </div>
        </div>

        <!-- lin manger -->
        <div class="field column is-6 mb-0">
          <label>Line Manager:</label>
          <div class="control">
            <input
              type="text"
              name="lineManager"
              v-model="FormData.lineManager"
              @change="(e) => inputChangeHandler(e)"
              class="input is-primary-focus is-primary-focus"
              placeholder="Line Manager"
            />
          </div>
        </div>

        <!-- supplier -->
        <div class="field column is-6 mb-0">
          <label>Supplier: </label>
          <VField>
            <VControl>
              <VSelect
                :disabled="userSession.user.role == 'partner'"
                v-model="FormData.supplier"
                @input="
                  (e) =>
                    inputChangeHandler({
                      name: 'supplier',
                      value: e.target.value,
                    })
                "
                name="industry"
                class="is-rounded"
              >
                <VOption value="">Select Supplier</VOption>
                <VOption
                  v-for="(supplier, index) in companySuppliers"
                  :value="supplier.id"
                  :key="index"
                  >{{ supplier.supplierName }}
                </VOption>
              </VSelect>
            </VControl>
          </VField>
          <VField id="interests" class="pb-4" label=""> </VField>
        </div>

        <!-- external id -->
        <div class="field column is-6 mb-0">
          <label>External ID: </label>
          <div class="control">
            <input
              type="text"
              name="externalID"
              v-model="FormData.externalID"
              @change="(e) => inputChangeHandler(e)"
              class="input is-primary-focus is-primary-focus"
              placeholder="External ID"
            />
          </div>
        </div>

        <!-- Industry -->
        <div class="field column is-6 mb-0">
          <label>Industry: * </label>
          <VField>
            <VControl>
              <VSelect
                v-model="FormData.industry"
                name="industry"
                required
                class="is-rounded"
              >
                <VOption value="">Select Industry</VOption>
                <VOption
                  v-for="(item, index) in compnayIndustries"
                  :key="index"
                  :value="item.id"
                  >{{ item.name }}
                </VOption>
              </VSelect>
            </VControl>
          </VField>
          <VField id="interests" class="p-0" label=""> </VField>
        </div>
      </div>
    </template>
    <template #action>
      <VButton
        :loading="isLoading"
        type="submit"
        color="primary"
        icon="fas fa-plus"
        raised
        >Create</VButton
      >
    </template>
  </VModal>
</template>
