<script setup lang="ts">
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { convertToFormData } from "/@src/composable/useSupportElement";
const notyf = useNotyf();
const api = useApi();
const selectedRole = ref("admin");
const Loading = ref(false);
const isUploading = ref(false);
const user_action = ref("update");
// const EditMemberModalOpen =ref(false)
const FormData = ref({
  first_name: "",
  last_name: "",
  email: "",
  role: "",
  profileImage: null as File | null,
  jobPosition: "",
  mobileNo: "",
  phoneNo: "",
  password: "testpass12",
  department: "",
});

const emit = defineEmits<{
  (e: "update:handleUpdateEditMemberModalOpen", value: boolean): void;
  (e: "update:getTeamMembers", value: null): void;
}>();
const props = defineProps({
  EditMemberModalOpen: {
    type: Boolean,
    default: false,
  },
  id: {
    type: Number,
    default: 0,
  },
});

const updateMemberHandler = async () => {
  try {
    Loading.value = true;
    FormData.value = { ...FormData.value, role: selectedRole.value };
    const formDataAPI = convertToFormData(FormData.value, ["profileImage"]);

    const response = await api.patch(
      `/v3/api/account/user/${props.id}/`,
      formDataAPI
    );
    closeModalHandler();
    notyf.dismissAll();
    notyf.success("New member added, New Member");
    emit("update:getTeamMembers", null); // Emit an event to update the prop
    Loading.value = false;
  } catch (error: any) {
    Loading.value = false;
    console.error(error.response.data);
    let errorObj = error.response.data ?? {};
    Object.values(errorObj).forEach((values) => {
      values.forEach((value) => {
        console.log(value);
        notyf.error(` ${value}, New Member`);
      });
    });
  }
};
const inputChangeHandler = (event: Event) => {
  FormData.value = {
    ...FormData.value,
    [event.target.name]: event.target.value,
  };
};

const closeModalHandler = () => {
  emit("update:handleUpdateEditMemberModalOpen", false); // Emit an event to update the prop
  FormData.value = {
    first_name: "",
    last_name: "",
    email: "",
    role: "",
    profileImage: null,
    jobPosition: "",
    mobileNo: "",
    phoneNo: "",
    password: "testpass12",
    department: "",
  };
};
const onAddFile = (error: any, fileInfo: any) => {
  const _file = fileInfo.file as File;
  if (_file) {
    console.log(_file);
    FormData.value = { ...FormData.value, profileImage: _file };
  }
};

const onRemoveFile = (error: any, fileInfo: any) => {
  if (error) {
    console.error(error);
    return;
  }

  FormData.value = { ...FormData.value, profileImage: null };
};

const getTeamMeamber = async () => {
  try {
    Loading.value = true;
    const response = await api.get(`/v3/api/account/user/${props.id}/`, {});
    selectedRole.value = response.data.role;
    let responseJson = {};
    for (const key in FormData.value) {
      if (response.data.hasOwnProperty(key)) {
        responseJson[key] = response.data[key];
      }
    }
    Loading.value = false;
    FormData.value = responseJson;
  } catch (error) {
    Loading.value = false;
    console.error("ok", error);
  }
};

onMounted(() => {
  getTeamMeamber();
});
</script>

<template>
  <VModal
    is="form"
    :open="props.EditMemberModalOpen"
    title="Edit Team Member"
    size="large"
    actions="right"
    @submit.prevent="updateMemberHandler"
    @close="closeModalHandler"
    noclose
  >
    <template #content>
      <div class="modal-form columns is-multiline">
        <div class="field column is-6 mb-0">
          <label>Fist name: *</label>
          <div class="control">
            <input
              type="text"
              name="first_name"
              v-model="FormData.first_name"
              @change="(e) => inputChangeHandler(e)"
              required
              class="input"
              placeholder="first name"
            />
          </div>
        </div>
        <div class="field column is-6 mb-0">
          <label>Last name: </label>
          <div class="control">
            <input
              type="text"
              name="last_name"
              v-model="FormData.last_name"
              @change="(e) => inputChangeHandler(e)"
              class="input"
              placeholder="last name"
            />
          </div>
        </div>
        <div class="field column is-6 mb-0">
          <label>Email: *</label>
          <div class="control">
            <input
              type="text"
              name="email"
              v-model="FormData.email"
              @change="(e) => inputChangeHandler(e)"
              required
              class="input"
              placeholder="Email Address"
            />
          </div>
        </div>
        <div class="field column is-6 mb-0">
          <label>Job title: </label>
          <div class="control">
            <input
              type="text"
              name="jobPosition"
              v-model="FormData.jobPosition"
              @change="(e) => inputChangeHandler(e)"
              class="input"
              placeholder="job title"
            />
          </div>
        </div>

        <div class="field column is-6 mb-0">
          <label>Department:</label>
          <div class="control">
            <input
              type="text"
              name="department"
              v-model="FormData.department"
              @change="(e) => inputChangeHandler(e)"
              class="input"
              placeholder="Department"
            />
          </div>
        </div>
        <div class="field column is-6 mb-0">
          <label>Phone no:</label>
          <div class="control">
            <input
              type="tel"
              name="mobileNo"
              v-model="FormData.phoneNo"
              @change="(e) => inputChangeHandler(e)"
              class="input"
              placeholder="Phone no"
            />
          </div>
        </div>

        <VField v-if="FormData.role != 'partner'" class="column is-6">
          <label>Role:</label>
          <VControl>
            <div>
              <VRadio
                v-model="selectedRole"
                value="admin"
                label="Administrator"
                name="outlined_radio"
                color="success"
              />
            </div>
            <div>
              <VRadio
                v-model="selectedRole"
                value="consultant"
                label="Consultant"
                name="outlined_radio"
                color="success"
              />
            </div>
            <div>
              <VRadio
                v-model="selectedRole"
                value="manager"
                label=" Project Manager"
                name="outlined_radio"
                color="success"
              />
            </div>
            <div>
              <VRadio
                v-model="selectedRole"
                value="finance"
                label="Finance"
                name="outlined_radio"
                color="success"
              />
            </div>
            <div>
              <VRadio
                v-model="selectedRole"
                value="sales"
                label="Sales"
                name="outlined_radio"
                color="success"
              />
            </div>
          </VControl>
        </VField>
        <div class="column is-6">
          <!-- <div class="field">
            <label>Phone no:</label>
            <div class="control">
              <input type="tel" name="phoneNo" v-model="FormData.phoneNo" @change="(e) => inputChangeHandler(e)"
                class="input " placeholder="Phone no" />
            </div>
          </div> -->
          <VAvatar size="xl" class="profile-v-avatar mt-4">
            <template #avatar>
              <div class="field">
                <label>Profile Image:</label>
              </div>
              <!-- src="/images/avatars/placeholder.jpg" -->
              <img
                v-if="!isUploading"
                class="avatar"
                :src="
                  FormData.profileImage == null
                    ? '/images/avatars/placeholder.jpg'
                    : FormData.profileImage
                "
                alt=""
              />

              <VFilePond
                v-else
                class="profile-filepond"
                name="profile_filepond"
                :chunk-retry-delays="[500, 1000, 3000]"
                label-idle="<i class='fas fa-cloud-upload-alt' style='font-size:27px'></i>"
                :accepted-file-types="['image/png', 'image/jpeg', 'image/gif']"
                :image-preview-height="140"
                :image-resize-target-width="140"
                :image-resize-target-height="140"
                image-crop-aspect-ratio="1:1"
                style-panel-layout="compact circle"
                style-load-indicator-position="center bottom"
                style-progress-indicator-position="right bottom"
                style-button-remove-item-position="left bottom"
                style-button-process-item-position="right bottom"
                @addfile="onAddFile"
                @removefile="onRemoveFile"
              />

              <span v-if="user_action == 'update'">
                <VIconButton
                  style="position: absolute; top: 70%; right: -20%"
                  v-if="!isUploading"
                  icon="feather:edit-2"
                  class="edit-button is-edit"
                  circle
                  tabindex="0"
                  @keydown.space.prevent="isUploading = true"
                  @click="isUploading = true"
                />

                <VIconButton
                  style="position: absolute; top: 70%; right: -20%"
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
        </div>
      </div>
    </template>
    <template #action>
      <VButton type="submit" :loading="Loading" color="primary" raised
        >Update</VButton
      >
    </template>
  </VModal>
</template>
