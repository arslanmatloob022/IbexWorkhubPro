<script setup lang="ts">
import { useApi } from "/@src/composable/useAPI";
import { convertToFormData } from "/@src/composable/useSupportElement";
import { useNotyf } from "/@src/composable/useNotyf";
import myUpload from "vue-image-crop-upload";
const notyf = useNotyf();
const api = useApi();
const Loading = ref(false);
const isUploading = ref(false);
const router = useRouter();
const logoUrl = ref<string>("");
const cropLogo = ref(false);
const user_action = ref("update");

const profileData = <any>ref({
  id: 0,
  first_name: "",
  last_name: "",
  email: "",
  role: "partner",
  phoneNo: "",
  profileImage: null as File | null,
  password: "",
  partner: 0,
});

const emit = defineEmits<{
  (e: "update:getUserProfileData", value: null): void;
  (e: "update:handleChangeProlileModalOpen", value: boolean): void;
}>();
const props = defineProps({
  ChangePasswordModalOpen: {
    type: Boolean,
    default: false,
  },
  id: {
    type: Number,
    default: 0,
  },
  getUserProfile: Function,
  partnerId: Number,
});

//  Get Profile Data
const getUserProfileData = async () => {
  Loading.value = true;
  try {
    const { data } = await api.get(`/v3/api/account/user/member/${props.id}/`);
    profileData.value = data;
    logoUrl.value = data.profileImage;
    console.log("User Profile Data:", profileData.value);
    Loading.value = false;
  } catch (error) {
    console.log(error);
    notyf.error("Something went wrong!");
    Loading.value = false;
  }
};

// Update Profile
const handleUpdateProfile = async () => {
  profileData.value.partner = props.partnerId;
  Loading.value = true;
  const formDataAPI = convertToFormData(profileData.value, ["profileLogo"]);

  try {
    if (props.id) {
      const response = await api.patch(
        `/v3/api/account/user/${profileData.value.id}/`,
        formDataAPI
      );
      onSuccess();
    } else {
      if (profileData.value.password.length < 8) {
        return (
          notyf.error("Password must be at least 8 characters."),
          (Loading.value = false)
        );
      }
      // formDataAPI.role == 'partner'
      const response = await api.post(`/v3/api/account/user/`, formDataAPI);
      Loading.value = false;
      notyf.dismissAll();
      notyf.success("Profile created");
      closeModalHandler();
    }
    props.getUserProfile();
  } catch (error) {
    Loading.value = false;
    notyf.dismissAll();
    notyf.error("User already exist with this email!");
  }
};

const onSuccess = () => {
  Loading.value = false;
  notyf.dismissAll();
  notyf.success("Profile updated successfully");
  closeModalHandler();
  // router.push("/sidebar/company/team-members")
};

const closeModalHandler = () => {
  emit("update:handleChangeProlileModalOpen", false);
};

// ---------------------Cropy Logo------------------>

const cropSuccessLogo = (imgDataUrl: any) => {
  const file = DataURIToBlob(imgDataUrl);
  profileData.value.profileImage = file;
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

const toggleCropLogo = () => {
  cropLogo.value = !cropLogo.value;
};

onMounted(() => {
  if (props.id) {
    getUserProfileData();
  }
});
</script>

<template>
  <VModal
    is="form"
    :open="props.ChangePasswordModalOpen"
    :title="props.id ? 'Edit Profile' : 'Create Profile'"
    size="medium"
    actions="right"
    @submit.prevent="handleUpdateProfile"
    @close="closeModalHandler"
    noclose
  >
    <template #content>
      <div class="modal-form columns is-multiline cu-all-input">
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
                        @click="toggleCropLogo"
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
        <!--  -->
        <div class="column is-12">
          <div class="field">
            <label style="">First Name:*</label>
            <div class="control">
              <input
                type="text"
                name="firstname"
                v-model="profileData.first_name"
                required
                class="input"
                placeholder="First name"
              />
            </div>
          </div>
        </div>
        <div class="column is-12">
          <div class="field">
            <label>Last Name:</label>
            <div class="control">
              <input
                type="text"
                name="lastname"
                v-model="profileData.last_name"
                class="input"
                placeholder="Last name"
              />
            </div>
          </div>
        </div>
        <div class="column is-12">
          <div class="field">
            <label>Email:*</label>
            <div class="control">
              <input
                type="email"
                name="email"
                v-model="profileData.email"
                required
                class="input"
                placeholder="Email"
              />
            </div>
          </div>
        </div>
        <div class="column is-12" v-if="!props.id">
          <div class="field">
            <label>Password:*</label>
            <div class="control">
              <input
                type="password"
                name="password"
                v-model="profileData.password"
                required
                minlength="8"
                maxlength="10"
                class="input"
                placeholder="Password"
              />
            </div>
          </div>
        </div>
        <div class="column is-12">
          <div class="field">
            <label>Phone:</label>
            <div class="control">
              <input
                type="tel"
                name="phone"
                v-model="profileData.phoneNo"
                class="input"
                placeholder="Phone"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #action>
      <VButton type="submit" :loading="Loading" color="primary" raised>{{
        props.id ? "Update Profile" : "Create Profile"
      }}</VButton>
    </template>
  </VModal>
</template>
