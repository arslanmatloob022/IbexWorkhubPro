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

interface contactPerson {
  firstName: string;
  lastName: string;
  displayName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  cellPhone: string;
  loginAllowed: boolean;
  inviteLogin: boolean;
  latitude: string;
  longitude: string;
}
const contactPersonData = ref<contactPerson>({
  firstName: "",
  lastName: "",
  displayName: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  phone: "",
  cellPhone: "",
  email: "",
  latitude: "",
  longitude: "",
  loginAllowed: false,
  inviteLogin: false,
});

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
      contactPersonData.value.address =
        response.data.results[0].formatted_address;
      contactPersonData.value.latitude =
        response.data.results[0].geometry.location.lat;
      contactPersonData.value.longitude =
        response.data.results[0].geometry.location.lng;
      notyf.success("Address Added");
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
    title="Contact Person"
    size="big"
    actions="right"
    @submit.prevent="addUpdateContactHandler"
    @close="closeModalHandler"
  >
    <template #content>
      <div class="modal-form columns is-multiline">
        <div class="column is-12 m-0">
          <VCard class="columns is-multiline">
            <div class="column is-12">
              <h3 class="title is-6 mb-2">Contact Information</h3>
            </div>

            <div class="field column is-6 mb-0">
              <label>First Name *</label>
              <div class="control">
                <input
                  type="text"
                  name="firstName"
                  v-model="contactPersonData.firstName"
                  required
                  class="input is-primary-focus is-primary-focus"
                  placeholder="First Name"
                />
              </div>
            </div>

            <div class="field column is-6 mb-0">
              <label>Last Name </label>
              <div class="control">
                <input
                  type="text"
                  name="lastName"
                  v-model="contactPersonData.lastName"
                  class="input is-primary-focus is-primary-focus"
                  placeholder="Last Name"
                />
              </div>
            </div>
            <div class="field column is-6 mb-0">
              <label>Display Name * </label>
              <div class="control">
                <input
                  required
                  type="text"
                  name="disName"
                  v-model="contactPersonData.lastName"
                  class="input is-primary-focus is-primary-focus"
                  placeholder="Display Name"
                />
              </div>
            </div>
            <div class="field column is-6 mb-0">
              <label>Primary Email </label>
              <div class="control">
                <input
                  type="email"
                  name="email"
                  v-model="contactPersonData.email"
                  class="input is-primary-focus is-primary-focus"
                  placeholder="Contact email"
                />
              </div>
            </div>
            <div class="field column is-12 mb-0">
              <label>Street Address </label>
              <div class="control">
                <input
                  required
                  type="text"
                  name="address"
                  v-model="contactPersonData.lastName"
                  class="input is-primary-focus is-primary-focus"
                  placeholder="Street Address"
                />
              </div>
            </div>

            <div class="field column is-6 mb-0">
              <label>City: </label>
              <div class="control">
                <input
                  type="text"
                  name="city"
                  v-model="contactPersonData.city"
                  class="input is-primary-focus is-primary-focus"
                  placeholder="City"
                />
              </div>
            </div>

            <div class="field column is-3 mb-0">
              <label>State: </label>
              <div class="control">
                <input
                  type="text"
                  name="state"
                  v-model="contactPersonData.state"
                  class="input is-primary-focus is-primary-focus"
                  placeholder="State"
                />
              </div>
            </div>

            <div class="field column is-3 mb-0">
              <label>Zip Code: </label>
              <div class="control">
                <input
                  type="tel"
                  name="zipCode"
                  @blur="handlePostCodeChange"
                  v-model="contactPersonData.zipCode"
                  class="input is-primary-focus is-primary-focus"
                  placeholder="Zip code"
                />
              </div>
            </div>

            <div class="field column is-6 mb-0">
              <label>Phone </label>
              <div class="control">
                <input
                  type="tel"
                  name="phone"
                  v-model="contactPersonData.phone"
                  class="input is-primary-focus is-primary-focus"
                  placeholder="Phone Number"
                />
              </div>
            </div>

            <div class="field column is-6 mb-0">
              <label>Cell Phone </label>
              <div class="control">
                <input
                  type="tel"
                  name="phone"
                  v-model="contactPersonData.cellPhone"
                  class="input is-primary-focus is-primary-focus"
                  placeholder="Cell Phone"
                />
              </div>
            </div>
          </VCard>

          <VCard class="columns is-multiline mt-3">
            <div class="column is-12">
              <h3 class="title is-6 mb-2">Security & Login</h3>
            </div>
            <div class="field column is-3 mb-0">
              <VControl subcontrol>
                <VSwitchBlock
                  thin
                  color="primary"
                  v-model="contactPersonData.loginAllowed"
                  label="Allow login"
                />
              </VControl>
            </div>
            <div class="field column is-3 mb-0">
              <VControl subcontrol>
                <VSwitchBlock
                  thin
                  color="primary"
                  v-model="contactPersonData.inviteLogin"
                  label="Send invite"
                />
              </VControl>
            </div>
          </VCard>
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
        >Add Contact</VButton
      >
    </template>
  </VModal>
</template>
