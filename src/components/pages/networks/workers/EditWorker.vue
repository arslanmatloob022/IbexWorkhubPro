<script setup lang="ts">
import axios from "axios";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { useCompany } from "/@src/stores/company";
import myUpload from "vue-image-crop-upload";
import { convertToFormData } from "/@src/composable/useSupportElement";
import { useUserSession } from "/@src/stores/userSession";

const userSession = useUserSession();
const route = useRoute();
const router = useRouter();
const company = useCompany();
const notyf = useNotyf();
const api = useApi();
const Loading = ref(false);
const isUploading = ref(false);
const user_action = ref("update");
const actionVerificationModalOpen = ref(false);
const showColorContainer = ref(false);

const cropLogo = ref(false);
const logoUrl = ref<string>("");

const currentColor = ref({
  id: 0,
  backgroundColor: "",
  created_at: "",
});

const ProfileColorGradients = ref([
  {
    id: 0,
    backgroundColor: "",
    created_at: "",
  },
]);

const actionModalProps = ref({
  message:
    "You are deleting this worker, after this action the worker will be removed permanently from the system.",
  captionText: "Delete this worker",
});

const FormData = ref({
  id: "",
  firstName: "",
  lastName: "",
  emailAddress: "",
  phoneNumber: "",
  lineManager: "",
  homeAddress: "",
  archive: false,
  profileImageURL: null as File | null,
  externalID: " ",
  compnayIdCardNumber: " ",
  compnayIdCardExpiryDate: " ",
  industry: "",
  arezCompany: "",
  activatiactivationCodeonCode: "",
  status: false,
  postCode: "",
  latitude: 0,
  longitude: 0,
  transport: "",
  bgColor: "",
  activationCode: "",
});
const formDataEdit = ref({});
const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: null): void;
}>();
const props = defineProps({
  EditCompanyModalOpen: {
    type: Boolean,
    default: false,
  },
  id: {
    type: Number,
    default: 0,
  },
  getAllWorkers:Function
});
const companySuppliers = company.suppliers ? company.suppliers : [];
const compnayIndustries = company.loggedCompany.industry
  ? company.loggedCompany.industry
  : [];

const editworkerHandler = async () => {
  try {
    Loading.value = true;
    console.log(FormData.value.status);
    const formDataAPI = convertToFormData(FormData.value, ["profileImageURL"]);
    formDataAPI.append("archive", FormData.value.archive);
    const response = await api.patch(
      `/v3/api/worker/${props.id}/`,
      formDataAPI
    );
    closeModalHandler();
    notyf.dismissAll();
    Loading.value = false;
    notyf.success("worker updated, worker");
    // CreateActivityLog({ message: `edited worker <b>information</b>`, objectId: route.params.id, method: "patch" });
    emit("update:OnSuccess", null); // Emit an event to update the prop
  } catch (error: any) {
    console.error(error);
    let errorObj = error.response.data ?? {};
    Object.values(errorObj).forEach((values) => {
      values.forEach((value) => {
        console.log(value);
        notyf.error(` ${value}, New worker`);
      });
    });
  } finally {
    Loading.value = false;
  }
};
const inputChangeHandler = (event: any) => {
  if (event.name === "industry") {
    formDataEdit.value = { ...formDataEdit.value, [event.name]: event.value };
    return;
  }

  if (event.name === "transport") {
    formDataEdit.value = { ...formDataEdit.value, [event.name]: event.value };
    return;
  }

  if (event.name === "supplier") {
    formDataEdit.value = { ...formDataEdit.value, [event.name]: event.value };
    return;
  }

  formDataEdit.value = {
    ...formDataEdit.value,
    [event.target.name]: event.target.value,
  };
};

const closeModalHandler = () => {
  emit("update:modalHandler", false); // Emit an event to update the prop
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
    compnayIdCardNumber: " ",
    compnayIdCardExpiryDate: " ",
    industry: "",
    arezCompany: "",
    supplier: 0,
  };
};

const getworker = async () => {
  try {
    Loading.value = true;
    const response = await api.get(`/v3/api/worker/${props.id}/`, {});
    FormData.value = response.data;
    logoUrl.value = response.data.profileImageURL;
    Loading.value = false;
    getAllColors();
  } catch (error) {
    Loading.value = false;
    console.error("ok", error);
  }
};
const selecteColor = (color: any) => {
  currentColor.value = color;
  formDataEdit.value = { ...formDataEdit.value, bgColor: color.id };
};
const getAllColors = async () => {
  try {
    const response = await api.get(`/v3/api/worker/bgcolor/`, {});
    ProfileColorGradients.value = response.data;
    let color = response.data.find(
      (obj: any) => obj.id === FormData.value.bgColor
    );
    console.log(color);
    if (color) {
      currentColor.value = color;
    }
  } catch (error) {}
};
const showColorsPellate = () => {
  showColorContainer.value = !showColorContainer.value;
};

const deleteWorker = async () => {
  try {
    const response = await api.delete(`/v3/api/worker/${props.id}/`);
    actionVerificationModalOpen.value = false;
    closeModalHandler();
    if (props.getAllWorkers) {
      props.getAllWorkers();
    }
    router.push("/sidebar/company/workers?type=All");
    notyf.dismissAll();
    notyf.error("Worker deleted permanently.");

  } catch (err) {
    return err;
  }
};

// ---------------------->
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

onMounted(() => {
  getworker();
});
</script>

<template>
  <VModal
    is="form"
    :open="props.EditCompanyModalOpen"
    title="Edit worker"
    size="big"
    actions="right"
    @submit.prevent="editworkerHandler"
    @close="closeModalHandler"
    noclose
  >
    <template #content>
      <div class="modal-form columns cu-all-input is-multiline">
        <div class="column is-12 mb-0">
          <div class="columns mb-0 p-0">
            <VField class="column is-6">
              <label>Profile :</label>
              <div class="control is-flex is-justify-content-center">
                <VAvatar size="xl" class="profile-v-avatar mt-4">
                  <template #avatar>
                    <img
                      v-if="!isUploading"
                      class="avatar"
                      :src="
                        !logoUrl ? '/images/avatars/placeholder.jpg' : logoUrl
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
            </VField>

            <div class="column is-6 mb-0 p-0">
              <!-- F NAme -->
              <div class="field column is-12 mb-0 pt-0">
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

              <!-- l name -->
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

        <!-- number -->
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

        <!-- Industry -->
        <div class="field column is-6 mb-0">
          <label>Industry: * </label>
          <VField>
            <VControl>
              <VSelect
                v-model="FormData.industry"
                @input="
                  (e) =>
                    inputChangeHandler({
                      name: 'industry',
                      value: e.target.value,
                    })
                "
                name="industry"
                required
                class="is-rounded"
              >
                <VOption value="">Select Industry</VOption>
                <VOption
                  v-for="(item, index) in compnayIndustries"
                  :value="item.id"
                  :key="index"
                  >{{ item.name }}
                </VOption>
              </VSelect>
            </VControl>
          </VField>
          <VField id="interests" class="pb-4" label=""> </VField>
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

        <!-- status -->
        <div class="field column is-6 mb-0">
          <label>Archive: </label>
          <span>
            <VField horizontal>
              <VControl>
                <VSwitchSegment
                  v-model="FormData.archive"
                  color="success"
                  label-true="Archive"
                  label-false="Un-Archive"
                />
              </VControl>
            </VField>
          </span>
        </div>

        <!-- Activation code -->
        <div class="field column is-6 mb-0">
          <label>Activation Code: </label>
          <div class="control">
            <input
              type="text"
              name="activationCode"
              v-model="FormData.activationCode"
              @change="(e) => inputChangeHandler(e)"
              class="input is-primary-focus is-primary-focus"
              placeholder="Activation Code"
            />
          </div>
        </div>

        <!-- post code -->
        <div class="field column is-6 mb-0">
          <label>Post Code:</label>
          <div class="control">
            <input
              type="text"
              name="postCode"
              v-model="FormData.postCode"
              @blur="handlePostCodeChange"
              @change="(e) => inputChangeHandler(e)"
              class="input is-primary-focus is-primary-focus"
              placeholder="Post Code"
            />
          </div>
        </div>

        <!-- home address -->
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

        <!-- Transport -->
        <div class="field column is-6 mb-0">
          <label>Transport: </label>
          <VField>
            <VControl>
              <VSelect
                v-model="FormData.transport"
                @input="
                  (e) =>
                    inputChangeHandler({
                      name: 'transport',
                      value: e.target.value,
                    })
                "
                name="transport"
                class="is-rounded"
              >
                <VOption v-model="FormData.transport">Transport ?</VOption>
                <VOption value="Car">Car</VOption>
                <VOption value="Public">Public</VOption>
                <VOption value="Commercial">Commercial</VOption>
                <VOption value="Bicycle">Bicycle</VOption>
                <VOption value="Bike">Bike</VOption>
              </VSelect>
            </VControl>
          </VField>
          <VField id="interests" class="pb-4" label=""> </VField>
        </div>

        <!-- line manager -->
        <div class="field column is-6 mb-0">
          <label>Line Manager: </label>
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

        <!-- External id -->
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

        <!-- company id number -->
        <div class="field column is-6 mb-0">
          <label>Company ID Card Number: </label>
          <div class="control">
            <input
              type="text"
              name="compnayIdCardNumber"
              v-model="FormData.compnayIdCardNumber"
              @change="(e) => inputChangeHandler(e)"
              class="input is-primary-focus is-primary-focus"
              placeholder="Company ID Card Number"
            />
          </div>
        </div>

        <!-- profile background -->
        <div class="field column is-6 mb-0" style="position: relative">
          <label
            >Select Profile Background Color:
            <i
              style="color: var(--primary); margin-left: 20px"
              @click="showColorsPellate"
              class="fas fa-paint-brush"
              aria-hidden="true"
            ></i>
          </label>
          <div class="control">
            <div>
              <div @click="showColorsPellate" class="color-pellate">
                <div
                  class="current-color-div"
                  :style="{ backgroundImage: currentColor.backgroundColor }"
                ></div>
              </div>
            </div>
          </div>
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
                v-for="(color, index) in ProfileColorGradients"
                :key="color.id"
                @click="selecteColor(color)"
                :style="{ backgroundImage: color.backgroundColor }"
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
      </div>
    </template>

    <template #cancel>
      <a
        style="
          margin-right: 480px;
          text-decoration: underline;
          font-weight: 500;
          color: red;
        "
        @click="
          () => {
            actionVerificationModalOpen = !actionVerificationModalOpen;
          }
        "
        :loading="Loading"
        color="danger"
        raised
        >Delete</a
      >
    </template>

    <template #action>
      <VButton type="submit" :loading="Loading" color="primary" raised
        >Update</VButton
      >
    </template>
  </VModal>
  <ActionsVerificationModal
    v-if="actionVerificationModalOpen"
    :actionVerificationModal="actionVerificationModalOpen"
    :message="actionModalProps.message"
    :captionText="actionModalProps.captionText"
    @update:OnSuccess="deleteWorker"
  />
</template>
<style lang="scss">
.vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop .vicp-crop-left .vicp-range .vicp-icon5, .vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop .vicp-crop-left .vicp-range .vicp-icon6{
  background: #2AAC8E !important;
}
.vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop .vicp-crop-left .vicp-rotate i{
  background: #2AAC8E !important;
}
</style>
<style lang="scss" scoped>
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
</style>
