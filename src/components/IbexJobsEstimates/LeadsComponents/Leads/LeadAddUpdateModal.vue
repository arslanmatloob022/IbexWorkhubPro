<script setup lang="ts">
import axios from "axios";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { convertToFormData } from "/@src/composable/useSupportElement";
import { useUserSession } from "/@src/stores/userSession";
import CKE from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const userSession = useUserSession();
const notyf = useNotyf();
const api = useApi();
const isLoading = ref(0);
const openAddContactModal = ref(false);
const showAddUpdateContactModal = ref(false);
const showMailSenderModal = ref(false);
const selectedAdminsIds = ref<string[]>([]);
const companyAdminsList = ref<{ value: string; name: string; icon: string }[]>(
  []
);
const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: null): void;
}>();

const props = defineProps<{
  addUpdateLeadModal?: boolean;
  leadId?: string;
}>();

const closeModalHandler = () => {
  emit("update:modalHandler", false);
};

const updateOnSuccess = () => {
  emit("update:OnSuccess", null);
};

const selectedManagerId = ref("");
const tab = ref("general");
const tagsValue = ref([]);
const tagsOptions = [
  { id: 1, value: "Lead", label: "Lead" },
  { id: 2, value: "Home", label: "Home" },
  { id: 3, value: "Floor Work", label: "Floor Work" },
  { id: 4, value: "Tile Work", label: "Tile Work" },
  { id: 5, value: "Carpenter", label: "Carpenter" },
  { id: 6, value: "Complete Renovation", label: "Complete Renovation" },
  { id: 7, value: "Painting", label: "Painting" },
  { id: 8, value: "Plumbing", label: "Plumbing" },
  { id: 9, value: "New Construction", label: "New Construction" },
  { id: 10, value: "Carpenter", label: "Carpenter" },
  { id: 11, value: "Carpenter", label: "Carpenter" },
  { id: 12, value: "Carpenter", label: "Carpenter" },
];

const sourcesOptions = [
  { value: "all", label: "All" },
  { value: "Contact Form", label: "Contact Form" },
  { value: "Social Media", label: "Social Media" },
  { value: "Referral", label: "Referral" },
  { value: "Company Website", label: "Company Website" },
];
const companyContractorsList = ref([
  {
    value: "",
    name: "",
    icon: "",
  },
]);
const companyClientsList = ref([
  {
    value: "",
    name: "",
    icon: "",
  },
]);
const companyManagersList = ref([
  {
    value: "",
    name: "",
    icon: "",
  },
]);
const CKEditor = CKE.component;
const config = {
  fontFamily: {
    options: [
      '"Montserrat Variable", sans-serif',
      '"Roboto Flex Variable", sans-serif',
    ],
  },
};

interface clientInfo {
  id: string;
  username: string;
  last_name: string;
  email: string;
}

interface leadData {
  id: string;
  title: string;
  address: string;
  current_state: string;
  city: string;
  state: string;
  status: string;
  is_active: boolean;
  wifiAvaliabe: boolean;
  parkingAvaliable: boolean;
  property_features: boolean;
  zip_code: string;
  confidence: number;
  sale_date: string;
  sales_people: [];
  tags: [];
  estimated_from: string;
  estimated_to: string;
  sources: string;
  project_type: string;
  notes: string;
  attachments: [];
  attach_mail: string;
  created_by: string;
  startDate: string;
  endDate: string;
  description: string;
  image: string;
  color: string;
  managers: [];
  client: string;
  leadStatus: string;
  contractor: string;
  latitude: number;
  longitude: number;
}

const leadFormData = ref<leadData>({
  id: "",
  title: "",
  address: "",
  leadStatus: "",
  current_state: "",
  city: "",
  state: "",
  status: "",
  zip_code: "",
  contractor: "",
  confidence: 0,
  sale_date: "",
  sales_people: [],
  tags: [],
  estimated_from: "",
  estimated_to: "",
  sources: "",
  project_type: "",
  notes: "",
  attachments: [],
  attach_mail: "",
  created_by: userSession.user.id,
  managers: [],
  client: "",
  latitude: 0,
  longitude: 0,
  startDate: "",
  endDate: "",
  description: "",
  image: "",
  color: "",
  is_active: true,
  wifiAvaliabe: false,
  parkingAvaliable: false,
  property_features: false,
});

const lead_status = ref([
  { value: "open", label: "Open" },
  { value: "onHold", label: "On Hold" },
  { value: "lost", label: "Lost" },
  { value: "sold", label: "Sold" },
]);

const projectTypes = ref([
  { value: "Residential", label: "Residential" },
  { value: "Commercial", label: "Commercial" },
  { value: "Government", label: "Government" },
  { value: "Business Site", label: "Business Site" },
  { value: "Company/Factories", label: "Company/Factories" },
]);

const addUpdateLeadHandler = async (loading: number = 0) => {
  try {
    isLoading.value = loading;
    leadFormData.value.tags = JSON.stringify(tagsValue.value);
    const formDataAPI = convertToFormData(leadFormData.value, ["image"]);
    if (!leadFormData.value.client) {
      formDataAPI.append("client", "");
    }
    if (!leadFormData.value.contractor) {
      formDataAPI.append("contractor", "");
    }
    if (props.leadId || leadFormData.value.id) {
      const response = await api.patch(
        `/api/project/${props.leadId ? props.leadId : leadFormData.value.id}/`,
        formDataAPI
      );
      leadFormData.value = response.data;
    } else {
      const response = await api.post("/api/project/", formDataAPI);
      leadFormData.value = response.data;
    }
    notyf.success(
      `Lead ${
        props.leadId || leadFormData.value.id ? "updated" : "created"
      } successfully`
    );
    updateOnSuccess();
    if (loading == 3) {
      closeModalHandler();
    }
  } catch (error: any) {
    notyf.error(`${error}, Lead`);
  } finally {
    isLoading.value = 0;
  }
};

const getLeadDetailHandler = async () => {
  try {
    isLoading.value = 1;
    const response = await api.get(
      `/api/project/${props.leadId}/single-project/`
    );
    leadFormData.value = response.data;
    tagsValue.value = response.data.tags;
  } catch (error: any) {
    notyf.error(` ${error}, Lead`);
  } finally {
    isLoading.value = 0;
  }
};

const getAdminsHandler = async () => {
  try {
    isLoading.value = 1;
    const response = await api.get("/api/users/by-role/admin/");
    if (response && response.data) {
      companyAdminsList.value = response.data.map((admin: any) => ({
        value: admin.id,
        name: `${admin.username || ""} ${admin.lastName || ""}`.trim(),
        icon: admin.avatar || "",
      }));
      if (leadFormData.value?.sales_people?.length) {
        selectedAdminsIds.value = leadFormData.value?.sales_people;
      }
    } else {
      notyf.error("Failed to fetch admin data.");
    }
  } catch (err) {
    console.error("Error fetching admin data:", err);
    notyf.error("An error occurred while fetching admins.");
  } finally {
    isLoading.value = 0;
  }
};

const getContractorsHandler = async () => {
  try {
    isLoading.value = 1;
    const response = await api.get("/api/users/by-role/contractor/", {});
    companyContractorsList.value = response.data.map((Contractor: any) => {
      return {
        value: Contractor.id,
        name: `${
          Contractor.username
            ? Contractor.username
            : "" + Contractor.lastName
            ? Contractor.lastName
            : ""
        }`,
        icon: Contractor.avatar,
      };
    });
  } catch (err) {
    console.log(err);
  } finally {
    isLoading.value = 0;
  }
};

const getClientsHandler = async () => {
  try {
    isLoading.value = 1;
    const response = await api.get("/api/users/by-role/client/", {});
    companyClientsList.value = response.data.map((client) => {
      return {
        value: client.id,
        name: `${
          client.username
            ? client.username
            : "" + client.lastName
            ? client.lastName
            : ""
        }`,
        icon: client.avatar,
      };
    });
  } catch (err) {
    console.log(err);
  } finally {
    isLoading.value = 0;
  }
};

const getManagersHandler = async () => {
  try {
    isLoading.value = 1;
    const response = await api.get("/api/users/by-role/manager/", {});
    companyManagersList.value = response.data.map((manager) => {
      return {
        value: manager.id,
        name: `${
          manager.username
            ? manager.username
            : "" + manager.lastName
            ? manager.lastName
            : ""
        }`,
        icon: manager.avatar,
      };
    });
    selectedManagerId.value = leadFormData.value.manager;
  } catch (err) {
    console.log(err);
  } finally {
    isLoading.value = 0;
  }
};

const handlePostCodeChange = async () => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${leadFormData.value.zip_code}&key=AIzaSyDWHedwkLGGa4_3XgPqYxIzMkFpOdKJRik`
    );
    if (response.data.status === "OK") {
      leadFormData.value.address = response.data.results[0].formatted_address;
      leadFormData.value.latitude =
        response.data.results[0].geometry.location.lat;
      leadFormData.value.longitude =
        response.data.results[0].geometry.location.lng;

      leadFormData.value.city =
        response.data.results[0].address_components[1].long_name;
      leadFormData.value.state =
        response.data.results[0].address_components[3].long_name;

      notyf.success("Address Added");
    } else if (response.data.status === "ZERO_RESULTS") {
      notyf.error("Invalid Post-Code");
    }
  } catch (error) {
    notyf.error("Invalid Post-Code");
    console.error(error);
  }
};

onMounted(async () => {
  if (props.leadId) {
    getLeadDetailHandler();
  }
  getManagersHandler();
  getAdminsHandler();
  getContractorsHandler();
  getClientsHandler();
});
</script>

<template>
  <VModal
    is="form"
    :open="props.addUpdateLeadModal"
    title="Lead Information"
    size="xl"
    actions="right"
    @submit.prevent="addUpdateLeadHandler(1)"
    @close="closeModalHandler"
  >
    <template #content>
      <div class="modal-form columns is-multiline" style="height: 80dvh">
        <div class="tabs-wrapper column is-12 m-0">
          <div class="tabs-inner">
            <div class="tabs is-boxed">
              <ul>
                <li :class="[tab === 'general' ? 'is-active' : 'not-active']">
                  <a
                    tabindex="0"
                    role="button"
                    @keydown.space.prevent="tab = 'general'"
                    @click="tab = 'general'"
                    ><span>General</span></a
                  >
                </li>
                <li
                  :class="[tab === 'activities' ? 'is-active' : 'not-active']"
                >
                  <a
                    tabindex="0"
                    role="button"
                    @keydown.space.prevent="tab = 'activities'"
                    @click="tab = 'activities'"
                    ><span>Activities</span></a
                  >
                </li>
                <li :class="[tab === 'proposals' ? 'is-active' : 'not-active']">
                  <a
                    tabindex="0"
                    role="button"
                    @keydown.space.prevent="tab = 'proposals'"
                    @click="tab = 'proposals'"
                    ><span>Proposals</span></a
                  >
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div v-if="tab === 'general'" class="column is-12">
          <VCard class="columns is-multiline">
            <h3 class="title is-6 mb-2">General Information</h3>
            <div class="columns is-multiline">
              <div class="field column is-12 mb-0">
                <label>Opportunity Title: *</label>
                <div class="control">
                  <input
                    type="text"
                    name="title"
                    v-model="leadFormData.title"
                    required
                    class="input is-primary-focus is-primary-focus"
                    placeholder="Opportunity Title"
                  />
                </div>
              </div>

              <div class="field column is-3 mb-0">
                <label>Zip Code: without slash </label>
                <div class="control">
                  <input
                    @blur="handlePostCodeChange"
                    type="text"
                    name="zipCode"
                    v-model="leadFormData.zip_code"
                    class="input is-primary-focus is-primary-focus"
                    placeholder="Zip code"
                  />
                </div>
              </div>

              <div class="field column is-3 mb-0">
                <label>City: </label>
                <div class="control">
                  <input
                    type="text"
                    name="city"
                    v-model="leadFormData.city"
                    class="input is-primary-focus is-primary-focus"
                    placeholder="City"
                  />
                </div>
              </div>

              <div class="field column is-6 mb-0">
                <label>State: </label>
                <div class="control">
                  <input
                    type="text"
                    name="state"
                    v-model="leadFormData.state"
                    class="input is-primary-focus is-primary-focus"
                    placeholder="State"
                  />
                </div>
              </div>
              <div class="field column is-6 mb-0">
                <label>Address: </label>
                <div class="control">
                  <input
                    type="text"
                    name="address"
                    v-model="leadFormData.address"
                    class="input is-primary-focus is-primary-focus"
                    placeholder="Street Address"
                  />
                </div>
              </div>

              <div class="field column is-6 mb-0">
                <label>Confidence </label>
                <div class="control">
                  <VField
                    v-slot="{ id }"
                    class="has-rounded-tooltip is-slider-info"
                  >
                    <VControl>
                      <Slider :id="id" v-model="leadFormData.confidence" />
                    </VControl>
                  </VField>
                </div>
              </div>

              <div class="field column is-6 mb-0">
                <label>Projected Sale Date: </label>
                <div class="control">
                  <input
                    type="date"
                    name="saleDate"
                    v-model="leadFormData.sale_date"
                    class="input is-primary-focus is-primary-focus"
                    placeholder="Post code"
                  />
                </div>
              </div>
              <!-- Project type -->
              <div class="field column is-6 mb-0">
                <label>Project Type </label>
                <VField>
                  <VControl>
                    <VSelect v-model="leadFormData.project_type">
                      <VOption
                        v-for="(item, index) in projectTypes"
                        :key="index"
                        :value="item.value"
                      >
                        {{ item.label }}
                      </VOption>
                    </VSelect>
                  </VControl>
                </VField>
              </div>
              <div class="field column is-6 mb-0">
                <label>Start Date: </label>
                <div class="control">
                  <input
                    type="date"
                    name="saleDate"
                    v-model="leadFormData.startDate"
                    class="input is-primary-focus is-primary-focus"
                    placeholder="Post code"
                  />
                </div>
              </div>
              <div class="field column is-6 mb-0">
                <label>End Date: </label>
                <div class="control">
                  <input
                    type="date"
                    name="saleDate"
                    v-model="leadFormData.endDate"
                    class="input is-primary-focus is-primary-focus"
                    placeholder="Post code"
                  />
                </div>
              </div>
            </div>

            <!-- Salespeople -->
            <div class="field column is-12 mb-0">
              <VField
                v-slot="{ id }"
                class="is-image-select"
                label="Sales people"
              >
                <VControl>
                  <Multiselect
                    v-model="leadFormData.sales_people"
                    :attrs="{ id }"
                    placeholder="Sales people"
                    label="name"
                    track="value"
                    mode="tags"
                    :options="companyAdminsList"
                  >
                    <template #singlelabel="{ value }">
                      <div class="multiselect-single-label">
                        <img
                          class="select-label-icon"
                          :src="value.icon"
                          alt=""
                        />
                        <span class="select-label-text">
                          {{ value.name }}
                        </span>
                      </div>
                    </template>
                    <template #option="{ option }">
                      <img
                        class="select-option-icon"
                        :src="option.icon"
                        alt=""
                      />
                      <span class="select-label-text">
                        {{ option.name }}
                      </span>
                    </template>
                  </Multiselect>
                </VControl>
              </VField>
            </div>

            <!-- contractor -->
            <div class="field column is-3 mb-0">
              <VField
                v-slot="{ id }"
                class="is-image-select"
                label="Contractors"
              >
                <VControl>
                  <Multiselect
                    v-model="leadFormData.contractor"
                    :attrs="{ id }"
                    placeholder="Select a contractor"
                    label="name"
                    :options="companyContractorsList"
                  >
                    <template #singlelabel="{ value }">
                      <div class="multiselect-single-label">
                        <img
                          class="select-label-icon"
                          :src="value.icon"
                          alt=""
                        />
                        <span class="select-label-text">
                          {{ value.name }}
                        </span>
                      </div>
                    </template>
                    <template #option="{ option }">
                      <img
                        class="select-option-icon"
                        :src="option.icon"
                        alt=""
                      />
                      <span class="select-label-text">
                        {{ option.name }}
                      </span>
                    </template>
                  </Multiselect>
                </VControl>
              </VField>

              <!-- <ContractorsDropDown
                v-if="props.addUpdateLeadModal"
                :selectedContractor="leadFormData.client"
                @update:OnSelectContractor="
                  (id: any) => {
                    leadFormData.client = id;
                  }
                "
              /> -->
            </div>

            <!-- Client -->
            <div class="field column is-3 mb-0">
              <VField v-slot="{ id }" class="is-image-select" label="Client">
                <VControl>
                  <Multiselect
                    v-model="leadFormData.client"
                    :attrs="{ id }"
                    placeholder="Select a client"
                    label="name"
                    :options="companyClientsList"
                  >
                    <template #singlelabel="{ value }">
                      <div class="multiselect-single-label">
                        <img class="select-label-icon" :src="value.icon" />
                        <span class="select-label-text">
                          {{ value.name }}
                        </span>
                      </div>
                    </template>
                    <template #option="{ option }">
                      <img class="select-option-icon" :src="option.icon" />
                      <span class="select-label-text">
                        {{ option.name }}
                      </span>
                    </template>
                  </Multiselect>
                </VControl>
              </VField>

              <!-- <ClientsDropdown
                v-if="props.addUpdateLeadModal"
                :selectedContractor="leadFormData.client"
                @update:OnSelectContractor="
                  (id: any) => {
                    leadFormData.client = id;
                  }
                "
              /> -->
            </div>

            <!-- manager -->
            <div class="field column is-6 mb-0">
              <VField v-slot="{ id }" class="is-image-select" label="Manager">
                <VControl>
                  <Multiselect
                    v-model="leadFormData.managers"
                    :attrs="{ id }"
                    placeholder="Select managers"
                    label="name"
                    track="value"
                    mode="tags"
                    :options="companyManagersList"
                  >
                    <template #singlelabel="{ value }">
                      <div class="multiselect-single-label">
                        <img
                          class="select-label-icon"
                          :src="value.icon"
                          alt=""
                        />
                        <span class="select-label-text">
                          {{ value.name }}
                        </span>
                      </div>
                    </template>
                    <template #option="{ option }">
                      <img
                        class="select-option-icon"
                        :src="option.icon"
                        alt=""
                      />
                      <span class="select-label-text">
                        {{ option.name }}
                      </span>
                    </template>
                  </Multiselect>
                </VControl>
              </VField>

              <!-- <ManagersDropDown
                v-if="props.addUpdateLeadModal"
                :selectedManager="leadFormData.manager"
                @update:OnSelectManager="
                  (id: any) => {
                    leadFormData.manager = id;
                  }
                "
              /> -->
            </div>

            <!-- estimated revenue -->
            <div class="field column is-3 mb-0">
              <label>Estimated Revenue: </label>
              <div class="control">
                <input
                  type="text"
                  name="externalID"
                  v-model="leadFormData.estimated_from"
                  class="input is-primary-focus is-primary-focus"
                  placeholder="From"
                />
              </div>
            </div>

            <div class="field column is-3 mb-0">
              <label>To</label>
              <div class="control">
                <input
                  type="text"
                  name="externalID"
                  v-model="leadFormData.estimated_to"
                  class="input is-primary-focus is-primary-focus"
                  placeholder="To"
                />
              </div>
            </div>

            <!-- Tags -->
            <div class="field column is-6 mb-0">
              <label>Tags </label>
              <VField v-slot="{ id }">
                <VControl>
                  <Multiselect
                    v-model="tagsValue"
                    :attrs="{ id }"
                    mode="tags"
                    :searchable="true"
                    :create-tag="true"
                    :options="tagsOptions"
                    placeholder="Add tags"
                  />
                </VControl>
              </VField>
            </div>

            <!-- Source -->
            <div class="field column is-6 mb-0">
              <label>Sources </label>
              <VField v-slot="{ id }">
                <VControl>
                  <Multiselect
                    v-model="leadFormData.sources"
                    :attrs="{ id }"
                    :create-tag="true"
                    :options="sourcesOptions"
                    placeholder="Sources"
                  />
                </VControl>
              </VField>
            </div>

            <!-- Status -->
            <div class="field column is-6 mb-0">
              <label>Status </label>
              <VField>
                <VControl>
                  <VSelect v-model="leadFormData.leadStatus">
                    <VOption
                      v-for="(item, index) in lead_status"
                      :key="index"
                      :value="item.value"
                    >
                      {{ item.label }}
                    </VOption>
                  </VSelect>
                </VControl>
              </VField>
            </div>
          </VCard>

          <VCard class="columns is-multiline mt-3">
            <h3 class="title is-6 mb-2">Notes</h3>
            <div class="field column is-12 mb-0">
              <CKEditor
                v-model="leadFormData.notes"
                :editor="ClassicEditor"
                :config="config"
              />
            </div>
          </VCard>
          <VCard class="columns is-multiline mt-3">
            <h3 class="title is-6 mb-2">Attach Documents</h3>
            <div class="field column is-12 mb-0">
              <label>Attachments </label>
              <VField grouped>
                <VControl>
                  <div class="file">
                    <label class="file-label">
                      <input class="file-input" type="file" name="resume" />
                      <span class="file-cta">
                        <span class="file-icon">
                          <i class="fas fa-cloud-upload-alt" />
                        </span>
                        <span class="file-label"> Choose a file… </span>
                      </span>
                    </label>
                  </div>
                </VControl>
              </VField>
            </div>
          </VCard>
        </div>
        <div v-if="tab === 'activities'" class="column is-12">
          <VCard class="columns is-multiline">
            <div class="column is-12" style="text-align: center">
              <h1 class="title is-4">Connect your clients to their projects</h1>
              <h1 class="title is-5">
                Create a client contact and assign them to jobs and lead
                opportunities effortlessly.
              </h1>
            </div>

            <div class="column is-6">
              <VButton
                @click="openAddContactModal = !openAddContactModal"
                color="info"
                class="p-5"
                icon="fas fa-plus"
                fullwidth
                bold
              >
                Add New
              </VButton>
            </div>
            <div class="column is-6">
              <VButton
                class="p-5"
                color="primary"
                icon="fas fa-sign-in-alt"
                fullwidth
                bold
              >
                Import existing one
              </VButton>
            </div>
          </VCard>
          <VCard class="columns is-multiline mt-1">
            <div class="column is-3"></div>
            <div class="column is-6 text-align-center">
              <i
                class="fas fa-phone-alt fa-5x primary-text text-primary mb-3"
                aria-hidden="true"
              ></i>
              <h1 class="title is-4">Engage your leads with activities</h1>
              <h1 class="title is-6">
                Track calls, emails, and meeting notes for leads in one place.
              </h1>
            </div>
            <div class="column is-3"></div>
            <div class="column is-3"></div>
            <div class="column is-6 text-align-center">
              <VButton
                @click="showAddUpdateContactModal = !showAddUpdateContactModal"
                color="warning"
                icon="lnir lnir-alarm"
              >
                Create Activity
              </VButton>
              <VButton
                @click="showMailSenderModal = !showMailSenderModal"
                color="success"
                class="ml-2"
                icon="fas fa-envelope"
              >
                Schedule Email
              </VButton>
            </div>
            <div class="column is-3"></div>
          </VCard>
          <ScheduleEmailModal
            v-if="showAddUpdateContactModal"
            :mailSchedulerModal="showAddUpdateContactModal"
            @update:modal-handler="showAddUpdateContactModal = false"
          />
          <GenericEmailSender
            v-if="showMailSenderModal"
            :mailSenderModal="showMailSenderModal"
            @update:modal-handler="showMailSenderModal = false"
          />
          <AddUpdateContactModal
            v-if="openAddContactModal"
            :add-update-contact-modal="openAddContactModal"
            @update:modal-handler="openAddContactModal = false"
          />
        </div>
        <div v-if="tab === 'proposals'" class="column is-12">
          <VCard class="columns is-multiline">
            <div class="column is-12">
              <LeadProposalsList
                :leadId="leadFormData.id ? leadFormData.id : props.leadId"
              />
            </div>
          </VCard>
        </div>
      </div>
    </template>
    <template #action>
      <VButton
        :loading="isLoading == 1"
        type="submit"
        :color="props.leadId ? 'info' : 'primary'"
        raised
        >{{ props.leadId ? "Update" : "Create" }} Lead</VButton
      >

      <VButton
        :loading="isLoading == 3"
        @click="addUpdateLeadHandler(3)"
        color="warning"
        raised
        >{{ props.leadId ? "Update & Close" : "Create & Close" }}</VButton
      >
    </template>
  </VModal>
</template>

<style lang="scss">
.ck-editor__editable {
  color: black !important;
  p {
    color: black !important;
  }
}
</style>
