<script setup lang="ts">
import axios from "axios";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { convertToFormData } from "/@src/composable/useSupportElement";
import { useUserSession } from "/@src/stores/userSession";
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

const tab = ref<"general" | "email">("general");
const tagsSlotValue = ref([]);
const tagsSlotOptions = [
  {
    value: "alice",
    name: "Alice Carasca",
    image: "https://media.cssninja.io/content/avatars/7.jpg",
  },
  {
    value: "erik",
    name: "Erik Kovalsky",
    image: "/images/avatars/svg/vuero-1.svg",
  },
  {
    value: "melany",
    name: "melany Wallace",
    image: "https://media.cssninja.io/content/avatars/25.jpg",
  },
  {
    value: "tara",
    name: "Tara Svenson",
    image: "https://media.cssninja.io/content/avatars/13.jpg",
  },
  {
    value: "mary",
    name: "Mary Lebowski",
    image: "https://media.cssninja.io/content/avatars/5.jpg",
  },
  {
    value: "irina",
    name: "Irina Vierbovsky",
    image: "https://media.cssninja.io/content/avatars/23.jpg",
  },
  {
    value: "jonathan",
    name: "Jonathan Krugger",
    image: "https://media.cssninja.io/content/avatars/32.jpg",
  },
];

interface ActivityDataModel {
  type: string;
  color: string;
  status: string;
  activityDate: string;
  startTime: string;
  endTime: string;
  reminderTime: string;
  assignedUser: string;
  attendees: string[];
  initiatedBy: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  description: string;
}

const activityFormData = ref<ActivityDataModel>({
  type: "",
  color: "",
  status: "",
  activityDate: "",
  startTime: "",
  endTime: "",
  reminderTime: "",
  assignedUser: "",
  attendees: [],
  initiatedBy: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  description: "",
});

interface InitiatedByOption {
  value: string;
  label: string;
}

const addUpdateContactHandler = async () => {
  try {
    isLoading.value = true;
    const formDataAPI = convertToFormData(FormData.value, ["profileImageURL"]);
    const response = await api.post("/v3/api/worker/", formDataAPI);
    closeModalHandler();
    notyf.dismissAll();
    notyf.success("New worker added, New Worker");
  } catch (error: any) {
    notyf.error(` ${error}, New Worker`);
  } finally {
    isLoading.value = false;
  }
};

const closeModalHandler = () => {
  emit("update:modalHandler", false);
};

const handlePostCodeChange = async () => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${FormData.value.postCode}&key=AIzaSyDWHedwkLGGa4_3XgPqYxIzMkFpOdKJRik`
    );
    if (response.data.status === "OK") {
      //   activityFormData.value.address =
      //     response.data.results[0].formatted_address;
      //   activityFormData.value.latitude =
      //     response.data.results[0].geometry.location.lat;
      //   activityFormData.value.longitude =
      //     response.data.results[0].geometry.location.lng;
      //   notyf.success("Address Added");
    } else if (response.data.status === "ZERO_RESULTS") {
      notyf.error("Invalid Post-Code");
    }
  } catch (error) {
    notyf.error("Invalid Post-Code");
    console.error(error);
  }
};

onMounted(() => {});
</script>

<template>
  <VModal
    is="form"
    :open="props.addUpdateContactModal"
    title="Lead Activity"
    size="large"
    actions="right"
    @submit.prevent="addUpdateContactHandler"
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
              <label>Activity Type *</label>
              <div class="control">
                <input
                  type="text"
                  name="firstName"
                  v-model="activityFormData.type"
                  required
                  class="input is-primary-focus is-primary-focus"
                  placeholder="Activity Type"
                />
              </div>
            </div>

            <div class="field column is-6 mb-0">
              <label>Color </label>
              <div class="control">
                <input
                  type="text"
                  name="color"
                  v-model="activityFormData.color"
                  class="input is-primary-focus is-primary-focus"
                  placeholder="Color"
                />
              </div>
            </div>
            <div class="field column is-6 mb-0">
              <label>Activity Date * </label>
              <div class="control">
                <input
                  required
                  type="date"
                  name="date"
                  v-model="activityFormData.activityDate"
                  class="input is-primary-focus is-primary-focus"
                  placeholder="Activity Date"
                />
              </div>
            </div>
            <div class="field column is-6 mb-0">
              <label>Reminder: </label>
              <VField>
                <VControl>
                  <VSelect v-model="activityFormData.reminder">
                    <VOption value=""> Select a time </VOption>
                    <VOption value="1"> 1 Hrs </VOption>
                    <VOption value="2"> 2 Hrs </VOption>
                    <VOption value="4"> 4 Hrs </VOption>
                    <VOption value="6"> 6 Hrs </VOption>
                    <VOption value="8"> 8 Hrs </VOption>
                    <VOption value="12">12 Hrs </VOption>
                  </VSelect>
                </VControl>
              </VField>
            </div>
            <div class="field column is-6 mb-0">
              <label>Start Time </label>
              <div class="control">
                <input
                  type="time"
                  name="starttime"
                  v-model="activityFormData.startTime"
                  class="input is-primary-focus is-primary-focus"
                  placeholder="Start Time"
                />
              </div>
            </div>

            <div class="field column is-6 mb-0">
              <label>End Time </label>
              <div class="control">
                <input
                  required
                  type="time"
                  name="endtime"
                  v-model="activityFormData.endTime"
                  class="input is-primary-focus is-primary-focus"
                  placeholder="End Time"
                />
              </div>
            </div>

            <div class="field column is-12 mb-0">
              <label>Assigned User * </label>
              <VField v-slot="{ id }" class="is-image-tags">
                <VControl>
                  <Multiselect
                    v-model="tagsSlotValue"
                    :attrs="{ id }"
                    mode="tags"
                    placeholder="Select a user"
                    track-by="name"
                    label="name"
                    :search="true"
                    :options="tagsSlotOptions"
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

            <div class="field column is-12 mb-0">
              <label>Attendees: </label>
              <div class="control">
                <!-- <input
                  type="tel"
                  name="zipCode"
                  @blur="handlePostCodeChange"
                  v-model="activityFormData.zipCode"
                  class="input is-primary-focus is-primary-focus"
                  placeholder="Zip code"
                /> -->
                <input
                  type="text"
                  name="phone"
                  v-model="activityFormData.attendees"
                  class="input is-primary-focus is-primary-focus"
                  placeholder="Activity attendees"
                />
              </div>
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
