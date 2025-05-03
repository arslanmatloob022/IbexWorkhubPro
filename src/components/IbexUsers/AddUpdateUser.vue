<script setup lang="ts">
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import {
  convertToFormData,
  getAddressComponents,
} from "/@src/composable/useSupportElement";

const notyf = useNotyf();
const api = useApi();
const preview = ref<any>("");
const showPassword = ref(false);
const Loading = ref(false);
const selectSupplierSlotOptions = ref([
  {
    value: "javascript",
    name: "Javascript",
    icon: "/images/icons/stacks/js.svg",
  },
]);

const props = withDefaults(
  defineProps<{
    isModalOpen?: boolean;
    userRole?: string;
    userId?: string;
    supplierId?: string;
  }>(),
  {
    isModalOpen: false,
    userRole: "",
    userId: "",
    supplierId: "",
  }
);

const emits = defineEmits<{
  (e: "update:closeModalHandler", value: boolean): void;
  (e: "update:actionUpdateHandler", value: null): void;
}>();

const closeUserModalHandler = () => {
  emits("update:closeModalHandler", false);
};

const actionUpdateHandler = () => {
  emits("update:actionUpdateHandler", null);
};
const userFormData = ref<any>({
  username: "",
  last_name: "",
  email: "",
  password: "",
  is_sentMail: false,
  status: "",
  role: "",
  phoneNumber: "",
  avatar: "",
  supplier: "",
  address: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
  latitude: "",
  longitude: "",
  about: "",
});

const handleFileChange = (event) => {
  const input = event?.target;
  if (input && input.files && input.files.length > 0) {
    const file = input.files[0];
    userFormData.value.avatar = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      preview.value = e.target?.result;
    };
    reader.readAsDataURL(file);
  } else {
    console.error("No file selected");
  }
};

const handlePostCodeChange = async () => {
  if (!userFormData.value.postalCode) return;
  const response = await getAddressComponents(userFormData.value.postalCode);
  console.log("API Response:", response);
  if (response?.status && response.data) {
    userFormData.value.latitude = response.data.lat;
    userFormData.value.longitude = response.data.lng;
    userFormData.value.address = response.data.address;
    userFormData.value.city = response.data.city;
    userFormData.value.state = response.data.state;
    notyf.success("Address fetched successfully");
  } else {
    console.log("Address not found.");
  }
};

const onRemoveFile = () => {
  userFormData.value.avatar = null;
  preview.value = null;
};

const addUpdateUserHandler = async () => {
  try {
    Loading.value = true;
    if (props.supplierId) {
      userFormData.value.supplier = props.supplierId;
    }
    const formData = convertToFormData(userFormData.value, ["avatar"]);
    if (props.userId) {
      const resp = await api.patch(`/api/users/${props.userId}/`, formData);
      actionUpdateHandler();
      closeUserModalHandler();
      notyf.info("User updated successfully");
    } else {
      const resp = await api.post("/api/users/", formData);
      actionUpdateHandler();
      closeUserModalHandler();
      notyf.success("User added successfully");
    }
  } catch (err: any) {
    if (
      err.response?.data?.email &&
      err.response.data.email.includes("user with this email already exists.")
    ) {
      notyf.error("Email already exists. Please use a different email.");
    } else {
      notyf.error("An error occurred. Please try again.");
    }
  } finally {
    Loading.value = false;
  }
};
const avatarFile = ref(false);
const getUserDataHandler = async () => {
  try {
    Loading.value = true;
    const resp = await api.get(`/api/users/${props.userId}/`);
    preview.value = resp.data.avatar ? resp.data.avatar : "";
    avatarFile.value = resp.data.avatar ? resp.data.avatar : "";
    userFormData.value = resp.data;
  } catch (err) {
    console.error(err);
  } finally {
    Loading.value = false;
  }
};

const getSuppliers = async () => {
  try {
    const resp = await api.get(`/api/users/by-role-option/supplier/`);
    selectSupplierSlotOptions.value = resp.data.map((item) => {
      return {
        value: item.id,
        name: item.username,
        icon: item.avatar,
      };
    });
  } catch (err) {
    console.log(err);
  }
};

onMounted(() => {
  if (props.userId) {
    getUserDataHandler();
  }
  userFormData.value.role = props.userRole;
  if (props.userRole == "worker") {
    getSuppliers();
  }
  if (props.supplierId) {
    userFormData.value.supplier = props.supplierId;
  }
});
</script>
<template>
  <VModal
    is="form"
    :open="props.isModalOpen"
    :title="props.userId ? `Update User` : `Add User`"
    size="big"
    actions="right"
    @submit.prevent="addUpdateUserHandler"
    @close="closeUserModalHandler"
  >
    <template #content>
      <div class="modal-form columns is-multiline">
        <div class="column is-6">
          <div class="columns is-multiline">
            <VField class="column is-12">
              <VLabel>First Name</VLabel>
              <VControl>
                <VInput
                  required
                  v-model="userFormData.username"
                  type="text"
                  placeholder="Enter name"
                />
              </VControl>
            </VField>
            <VField class="column is-12">
              <VLabel>Last Name</VLabel>
              <VControl>
                <VInput
                  v-model="userFormData.last_name"
                  type="text"
                  placeholder="Last name"
                />
              </VControl>
            </VField>
          </div>
        </div>
        <div class="column is-3">
          <VField>
            <VLabel>Picture</VLabel>
            <VControl>
              <VFilePond
                class="profile-filepond"
                name="profile_filepond"
                :chunk-retry-delays="[500, 1000, 3000]"
                label-idle="<i class='lnil lnil-cloud-upload'></i>"
                :accepted-file-types="['image/png', 'image/jpeg', 'image/gif']"
                :image-preview-height="180"
                :image-resize-target-width="180"
                :image-resize-target-height="180"
                image-crop-aspect-ratio="1:1"
                style-panel-layout="compact circle"
                style-load-indicator-position="center bottom"
                style-progress-indicator-position="right bottom"
                style-button-remove-item-position="left bottom"
                style-button-process-item-position="right bottom"
                @change="handleFileChange"
                @removefile="onRemoveFile"
              />
            </VControl>
          </VField>
        </div>
        <div v-if="preview" class="column is-3">
          <VField>
            <VLabel>Preview</VLabel>
            <VAvatar
              v-if="preview"
              :picture="preview"
              size="xl"
              alt="Avatar Preview"
            />
          </VField>
        </div>
        <VField class="column is-6">
          <VLabel>Phone</VLabel>
          <VControl>
            <VInput
              v-model="userFormData.phoneNumber"
              type="phone"
              placeholder="Enter phone number"
            />
          </VControl>
        </VField>
        <div class="column is-6 is-flex space-around">
          <VField class="mt-5">
            <VControl>
              <VSwitchBlock
                v-model="userFormData.is_sentMail"
                label="Send email"
                color="primary"
                thin
              />
            </VControl>
          </VField>
          <VField class="mt-5">
            <VControl>
              <VSwitchBlock
                v-model="userFormData.is_active"
                label="Active"
                color="primary"
                thin
              />
            </VControl>
          </VField>
        </div>

        <VField class="column is-6">
          <VLabel>Email</VLabel>
          <VControl>
            <VInput
              required
              v-model="userFormData.email"
              type="email"
              placeholder="Enter mail"
            />
          </VControl>
        </VField>

        <VField
          v-if="!props.userId"
          class="column is-6"
          label="Password"
          addons
        >
          <VControl expanded>
            <VInput
              v-model="userFormData.password"
              :type="showPassword ? 'text' : 'password'"
              class="input"
              placeholder="Enter Password"
            />
          </VControl>
          <VControl>
            <VButton color="primary" @click="showPassword = !showPassword">
              <VIcon v-if="showPassword" icon="lucide:eye-off" />
              <VIcon v-else icon="lucide:eye" />
            </VButton>
          </VControl>
        </VField>

        <VField
          v-if="props.userRole == 'worker'"
          class="column is-6"
          v-slot="{ id }"
        >
          <VControl>
            <Multiselect
              v-model="userFormData.supplier"
              :attrs="{ id }"
              placeholder="Select a sub-contractor"
              label="name"
              :options="selectSupplierSlotOptions"
              :searchable="true"
              track-by="name"
              :max-height="145"
            >
              <template #singlelabel="{ value }">
                <div class="multiselect-single-label">
                  <img class="select-label-icon" :src="value.icon" alt="" />
                  {{ value.name }}
                </div>
              </template>
              <template #option="{ option }">
                <img class="select-option-icon" :src="option.icon" alt="" />
                {{ option.name }}
              </template>
            </Multiselect>
          </VControl>
        </VField>

        <div class="column is-12">
          <VCard class="columns is-multiline mt-3">
            <div class="column is-12">
              <h3 class="title is-6 mb-2">Other Details</h3>
            </div>
            <div class="field column is-4 mb-0">
              <label>Postal Code </label>
              <div class="control">
                <input
                  type="text"
                  name="state"
                  @blur="handlePostCodeChange"
                  v-model="userFormData.postalCode"
                  class="input is-primary-focus is-primary-focus"
                  placeholder="Postal Code"
                />
              </div>
            </div>
            <div class="field column is-4 mb-0">
              <label>City </label>
              <div class="control">
                <input
                  type="text"
                  name="city"
                  v-model="userFormData.city"
                  class="input is-primary-focus is-primary-focus"
                  placeholder="City"
                />
              </div>
            </div>
            <div class="field column is-4 mb-0">
              <label>State </label>
              <div class="control">
                <input
                  type="text"
                  name="state"
                  v-model="userFormData.state"
                  class="input is-primary-focus is-primary-focus"
                  placeholder="State"
                />
              </div>
            </div>

            <div class="field column is-12 mb-0">
              <label>Street Address</label>
              <div class="control">
                <input
                  type="tel"
                  name="phone"
                  v-model="userFormData.address"
                  class="input is-primary-focus is-primary-focus"
                  placeholder="Street Address"
                />
              </div>
            </div>
            <div class="field column is-12 mb-0">
              <label>About </label>
              <VField>
                <VControl>
                  <VTextarea
                    v-model="userFormData.about"
                    rows="3"
                    placeholder="Enter about..."
                  />
                </VControl>
              </VField>
            </div>
          </VCard>
        </div>
      </div>
    </template>
    <template #action>
      <VButton :loading="Loading" type="submit" color="primary" raised>
        {{ props.userId ? "Update" : "Add" }}
      </VButton>
    </template>
    <template #cancel>
      <VButton
        type="cancel"
        :loading="Loading"
        @click="closeUserModalHandler"
        raised
      >
        Cancel
      </VButton>
    </template>
  </VModal>
</template>
<style lang="scss" scoped>
.select-option-icon {
  width: 30px;
  height: 30px;
  margin-right: 4px;
}
.select-label-icon {
  width: 30px;
  height: 30px;
  margin-right: 4px;
}
</style>
