<script setup lang="ts">
import axios from "axios";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { convertToFormData } from "/@src/composable/useSupportElement";
import { useUserSession } from "/@src/stores/userSession";
import { activityTypes } from "../../estimatesScripts";
import { getAddressComponents } from "/@src/composable/useSupportElement";
const fileInput = ref<HTMLInputElement | null>(null);
const userSession = useUserSession();
const notyf = useNotyf();
const api = useApi();
const isLoading = ref(false);

const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: null): void;
}>();

const props = defineProps<{
  addUpdateContactModal?: boolean;
  activityId?: string;
  objectId?: string;
}>();

const closeModalHandler = () => {
  emit("update:modalHandler", false);
};
const updateOnSuccessHandler = () => {
  emit("update:OnSuccess", null);
};
const companyUsersOptions = ref([
  {
    value: "",
    name: "",
    image: "",
  },
]);

interface ActivityDataModel {
  title: string;
  description: string;
  objectId: string;
  type: string;
  color: string;
  status: string;
  date: string;
  start_time: string;
  end_time: string;
  reminder_time: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  assignedUser: string;
  initiated_by: string;
  attendees: string[];
  latitude: number;
  longitude: number;
  file: null | File | string;
}

const activityFormData = ref<ActivityDataModel>({
  title: "",
  objectId: props.objectId ?? "",
  type: "",
  color: "",
  status: "",
  date: "",
  start_time: "",
  end_time: "",
  reminder_time: "",
  assignedUser: "",
  attendees: [],
  initiated_by: userSession.user.id,
  address: "",
  city: "",
  state: "",
  zip_code: "",
  description: "",
  latitude: 0.0,
  longitude: 0.0,
  file: "",
});

const addUpdateActivityHandler = async () => {
  try {
    isLoading.value = true;
    const formDataAPI = convertToFormData(activityFormData.value, ["file"]);
    if (props.activityId) {
      const response = await api.patch(
        `/api/activity/${props.activityId}/`,
        formDataAPI
      );
      notyf.success("Activity updated successfully");
    } else {
      const response = await api.post("/api/activity/", formDataAPI);
      notyf.success("Activity added successfully");
    }
    updateOnSuccessHandler();
    closeModalHandler();
  } catch (error: any) {
    notyf.error(` ${error}, Activity`);
  } finally {
    isLoading.value = false;
  }
};

const getActivityHandler = async () => {
  try {
    isLoading.value = true;
    const response = await api.get(`/api/activity/${props.activityId}/`);
    activityFormData.value = response.data;
  } catch (error: any) {
    notyf.error(` ${error}, Get Activity`);
  } finally {
    isLoading.value = false;
  }
};

const getAllUsersHandler = async () => {
  try {
    isLoading.value = true;
    const response = await api.get("/api/users/");
    companyUsersOptions.value = response.data.map((user: any) => {
      return {
        value: user.id,
        name: `${user.username ?? "N/A"} ${user.last_name ?? ""}`,
        icon: user.avatar,
      };
    });
  } catch (error: any) {
    notyf.error(`something get wrong`);
  } finally {
    isLoading.value = false;
  }
};

const handlePostCodeChange = async () => {
  if (!activityFormData.value.zip_code) return;
  const response = await getAddressComponents(activityFormData.value.zip_code);
  console.log("API Response:", response);
  if (response?.status && response.data) {
    activityFormData.value.latitude = response.data.lat;
    activityFormData.value.longitude = response.data.lng;
    activityFormData.value.address = response.data.address;
    activityFormData.value.city = response.data.city;
    activityFormData.value.state = response.data.state;
    notyf.success("Address fetched successfully");
  } else {
    console.log("Address not found.");
  }
};

const fileName = ref("");
const fileSize = ref(0);

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const selectedFile = input.files?.[0];
  input.value = "";
  if (selectedFile) {
    activityFormData.value.file = selectedFile;
    fileName.value = selectedFile.name;
    fileSize.value = selectedFile.size;
  }
};

onMounted(() => {
  getAllUsersHandler();
  if (props.activityId) {
    getActivityHandler();
  }
});
</script>

<template>
  <VModal
    is="form"
    :open="props.addUpdateContactModal"
    title="Activity Details"
    size="large"
    actions="right"
    @submit.prevent="addUpdateActivityHandler"
    @close="closeModalHandler"
  >
    <template #content>
      <div class="modal-form columns is-multiline">
        <div class="column is-12">
          <VCard class="columns is-multiline">
            <div class="column is-12">
              <h3 class="title is-6 mb-2">Activity Information</h3>
            </div>
            <div class="field column is-6 mb-0">
              <label>Title *</label>
              <div class="control">
                <input
                  type="text"
                  name="title"
                  v-model="activityFormData.title"
                  required
                  class="input is-primary-focus is-primary-focus"
                  placeholder="Activity Title"
                />
              </div>
            </div>

            <div class="field column is-6 mb-0">
              <label>Activity Type *</label>
              <VField>
                <VControl>
                  <VSelect v-model="activityFormData.type" required>
                    <VOption v-for="item in activityTypes" :value="item.value">
                      {{ item.label }}
                    </VOption>
                  </VSelect>
                </VControl>
              </VField>
            </div>

            <!-- Date -->
            <div class="field column is-6 mb-0">
              <label>Date </label>
              <input
                type="date"
                name="date"
                v-model="activityFormData.date"
                required
                class="input is-primary-focus is-primary-focus"
                placeholder="Activity Type"
              />
            </div>

            <div class="field column is-3 mb-0">
              <label>Start Time </label>
              <input
                type="time"
                name="date"
                v-model="activityFormData.start_time"
                class="input is-primary-focus is-primary-focus"
                placeholder="Activity Type"
              />
            </div>
            <div class="field column is-3 mb-0">
              <label>End Time </label>
              <input
                type="time"
                name="date"
                v-model="activityFormData.end_time"
                class="input is-primary-focus is-primary-focus"
                placeholder="Activity Type"
              />
            </div>
            <div class="field column is-3 mb-0">
              <label>Color </label>
              <VField>
                <VControl>
                  <VInput
                    v-model="activityFormData.color"
                    list="colors-list"
                    type="color"
                    placeholder="Pick a color"
                  />
                  <datalist id="colors-list">
                    <option value="#84cc16" />
                    <option value="#22c55e" />
                    <option value="#0ea5e9" />
                    <option value="#6366f1" />
                    <option value="#8b5cf6" />
                    <option value="#d946ef" />
                    <option value="#f43f5e" />
                    <option value="#facc15" />
                    <option value="#fb923c" />
                    <option value="#9ca3af" />
                  </datalist>
                </VControl>
              </VField>
            </div>
            <div class="field column is-3 mb-0">
              <label>Reminder time: </label>
              <input
                type="time"
                name="date"
                v-model="activityFormData.reminder_time"
                class="input is-primary-focus is-primary-focus"
                placeholder="Activity Type"
              />
            </div>
            <div class="field column is-3 mb-0">
              <!-- <input
                ref="fileInput"
                type="file"
                style="display: none"
                @change="handleFileChange"
                accept="image/*,application/pdf"
              /> -->
              <label>Attachment </label>
              <VField grouped>
                <VControl>
                  <div class="file">
                    <label class="file-label">
                      <input
                        @change="handleFileChange"
                        class="file-input"
                        type="file"
                        name="resume"
                      />
                      <span class="file-cta">
                        <span class="file-icon">
                          <i class="fas fa-cloud-upload-alt" />
                        </span>
                        <span class="file-label">
                          {{ fileName ? fileName : "Choose a file…" }}
                        </span>
                      </span>
                    </label>
                  </div>
                </VControl>
              </VField>
            </div>

            <div class="field column is-12 mb-0">
              <label>Assigned * </label>
              <VField v-slot="{ id }">
                <VControl>
                  <Multiselect
                    required
                    v-model="activityFormData.attendees"
                    :attrs="{ id }"
                    mode="tags"
                    placeholder="Select a user"
                    track-by="name"
                    label="name"
                    :search="true"
                    :searchable="true"
                    :options="companyUsersOptions"
                    :max-height="145"
                  >
                    <template #tag="{ option, remove, disabled }">
                      <div class="multiselect-tag is-user">
                        <img :src="option.image" alt="" />
                        {{ option.name }}
                        <i
                          v-if="!disabled"
                          role="button"
                          tabindex="0"
                          @click.prevent
                          @mousedown.prevent.stop="remove(option)"
                        />
                      </div>
                    </template>
                  </Multiselect>
                </VControl>
              </VField>
            </div>
          </VCard>

          <VCard class="columns is-multiline mt-3">
            <div class="column is-12">
              <h3 class="title is-6 mb-2">Location</h3>
            </div>
            <div class="field column is-4 mb-0">
              <label>Zip Code </label>
              <div class="control">
                <input
                  type="text"
                  name="state"
                  @blur="handlePostCodeChange"
                  v-model="activityFormData.zip_code"
                  class="input is-primary-focus is-primary-focus"
                  placeholder="Zip Code"
                />
              </div>
            </div>
            <div class="field column is-4 mb-0">
              <label>City </label>
              <div class="control">
                <input
                  type="text"
                  name="city"
                  v-model="activityFormData.city"
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
                  v-model="activityFormData.state"
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
                  v-model="activityFormData.address"
                  class="input is-primary-focus is-primary-focus"
                  placeholder="Street Address"
                />
              </div>
            </div>
            <div class="field column is-12 mb-0">
              <label>Description </label>
              <VField>
                <VControl>
                  <VTextarea
                    v-model="activityFormData.description"
                    rows="3"
                    placeholder="Enter description..."
                  />
                </VControl>
              </VField>
            </div>
          </VCard>
        </div>
      </div>
    </template>
    <template #action>
      <VButton :loading="isLoading" type="submit" color="primary" raised
        >{{ props.activityId ? "Update" : "Create" }} Activity</VButton
      >
    </template>
  </VModal>
</template>
