<script setup lang="ts">
import axios from "axios";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { convertToFormData } from "/@src/composable/useSupportElement";
import { useUserSession } from "/@src/stores/userSession";
import { activityTypes } from "../../estimatesScripts";

const editor = shallowRef<any>();
const userSession = useUserSession();
const notyf = useNotyf();
const api = useApi();
const isLoading = ref(false);
const FormData = ref({});

const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: null): void;
}>();

const props = defineProps<{
  addUpdateContactModal?: boolean;
  userId?: string;
}>();

const closeModalHandler = () => {
  emit("update:modalHandler", false);
};
const updateOnSuccessHandler = () => {
  emit("update:OnSuccess", null);
};

const selectedUsers = ref([]);
const companyUsersOptions = ref([
  {
    value: "",
    name: "",
    image: "",
  },
]);

interface ActivityDataModel {
  title: string;
  objectId: string;
  description: string;
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
  zipCode: string;
  assignedUser: string;
  initiated_by: string;
  attendees: string[];
}

const activityFormData = ref<ActivityDataModel>({
  title: "",
  objectId: "",
  type: "",
  color: "",
  status: "",
  date: "",
  start_time: "",
  end_time: "",
  reminder_time: "",
  assignedUser: "",
  attendees: [],
  initiated_by: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  description: "",
});

const addUpdateActivityHandler = async () => {
  try {
    isLoading.value = true;
    const formDataAPI = convertToFormData(activityFormData.value, []);
    const response = await api.post("/api/activity/", formDataAPI);
    updateOnSuccessHandler();
    closeModalHandler();
    notyf.dismissAll();
    notyf.success("Activity added successfully");
  } catch (error: any) {
    notyf.error(` ${error}, New Worker`);
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
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${FormData.value.postCode}&key=AIzaSyDWHedwkLGGa4_3XgPqYxIzMkFpOdKJRik`
    );
    if (response.data.status === "OK") {
      activityFormData.value.address =
        response.data.results[0].formatted_address;
      // activityFormData.value.latitude =
      //   response.data.results[0].geometry.location.lat;
      // activityFormData.value.longitude =
      //   response.data.results[0].geometry.location.lng;
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
  getAllUsersHandler();
});
</script>

<template>
  <VModal
    is="form"
    :open="props.addUpdateContactModal"
    title="Lead Activity"
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

            <div class="field column is-6 mb-0">
              <label>Start Time </label>
              <input
                type="time"
                name="date"
                v-model="activityFormData.start_time"
                class="input is-primary-focus is-primary-focus"
                placeholder="Activity Type"
              />
            </div>
            <div class="field column is-6 mb-0">
              <label>End Time </label>
              <input
                type="time"
                name="date"
                v-model="activityFormData.end_time"
                class="input is-primary-focus is-primary-focus"
                placeholder="Activity Type"
              />
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
            <div class="field column is-4 mb-0">
              <label>Zip Code </label>
              <div class="control">
                <input
                  type="text"
                  name="state"
                  v-model="activityFormData.state"
                  class="input is-primary-focus is-primary-focus"
                  placeholder="Zip Code"
                />
              </div>
            </div>
            <div class="field column is-12 mb-0">
              <label>Description </label>
              <div class="control">
                <input
                  type="text"
                  name="state"
                  v-model="activityFormData.description"
                  class="input is-primary-focus is-primary-focus"
                  placeholder="Description"
                />
              </div>
            </div>
          </VCard>
        </div>
      </div>
    </template>
    <template #action>
      <VButton :loading="isLoading" type="submit" color="primary" raised
        >Create Activity</VButton
      >
    </template>
  </VModal>
</template>
