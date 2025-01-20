<script setup lang="ts">
import axios from "axios";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { useCompany } from "/@src/stores/company";
import { convertToFormData } from "/@src/composable/useSupportElement";
import { useUserSession } from "/@src/stores/userSession";
import LeadActivityModal from "./LeadActivityModal.vue";
import ContractorsDropDown from "/@src/components/CommonComponents/DropDowns/ContractorsDropDown.vue";
const editor = shallowRef<any>();
const userSession = useUserSession();
const notyf = useNotyf();
const api = useApi();
const loading = ref(false);
const FormData = ref({});
const openAddContactModal = ref(false);
const openLeadProposalModal = ref(false);
const showAddUpdateContactModal = ref(false);
const showMailSenderModal = ref(false);

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

const tagsValue = ref([]);
const tagsOptions = [
  { value: "batman", label: "Batman" },
  { value: "robin", label: "Robin" },
  { value: "joker", label: "Joker" },
];

const sourcesValue = ref([]);
const sourcesOptions = [
  { value: "all", label: "All" },
  { value: "contact", label: "Contact Form" },
  { value: "google", label: "Google" },
  { value: "referral", label: "Referral" },
];

const tagsSlotValue = ref([]);
const tagsSlotOptions = [
  {
    value: "javascript",
    name: "Javascript",
    image: "/images/icons/stacks/js.svg",
  },
  {
    value: "reactjs",
    name: "ReactJS",
    image: "/images/icons/stacks/reactjs.svg",
  },
  {
    value: "vuejs",
    name: "VueJS",
    image: "/images/icons/stacks/vuejs.svg",
  },
  {
    value: "angular",
    name: "Angular",
    image: "/images/icons/stacks/angular.svg",
  },
  {
    value: "android",
    name: "Android",
    image: "/images/icons/stacks/android.svg",
  },
  {
    value: "html5",
    name: "Html5",
    image: "/images/icons/stacks/html5.svg",
  },
  {
    value: "css3",
    name: "CSS3",
    image: "/images/icons/stacks/css3.svg",
  },
];

interface tag {
  value: string;
  label: string;
}
interface leadData {
  id: string;
  title: string;
  address: string;
  current_state: string;
  city: string;
  state: string;
  status: string;
  zip_code: string;
  confidence: number;
  sale_date: string;
  salesPeople: [];
  tags: tag[];
  estimated_from: string;
  estimated_to: string;
  sources: string;
  projectType: string;
  notes: string;
  attachments: [];
  attach_mail: string;
  created_by: string;
  manager: string;
  client: string;
}

const leadFormData = ref<leadData>({
  id: "",
  title: "",
  address: "",
  current_state: "",
  city: "",
  state: "",
  status: "",
  zip_code: "",
  confidence: 0,
  sale_date: "",
  salesPeople: [],
  tags: [],
  estimated_from: "",
  estimated_to: "",
  sources: "",
  projectType: "",
  notes: "",
  attachments: [],
  attach_mail: "",
  created_by: userSession.user.id,
  manager: "",
  client: "",
});

interface ActivityModel {
  type: string;
  color: string;
  activityDate: string;
  startTime: string;
  endTime: string;
  reminder: string;
  assignedUser: string;
  attendees: string[];
  initiatedBy: InitiatedByOption;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  description: string;
}

interface InitiatedByOption {
  value: string;
  label: string;
}

const initiatedBy: InitiatedByOption[] = [
  { value: "salesPerson", label: "Salesperson" },
  { value: "lead", label: "Lead" },
  { value: "other", label: "Other" },
];

const sources = ref([
  { value: "all", label: "All" },
  { value: "contact", label: "Contact Form" },
  { value: "google", label: "Google" },
  { value: "referral", label: "Referral" },
]);

const status = ref([
  { value: "open", label: "Open" },
  { value: "onHold", label: "On Hold" },
  { value: "lost", label: "Lost" },
  { value: "sold", label: "sold" },
  // { value: "inProgress", label: "In Progress" },
  // { value: "pending", label: "Pending" },
  // { value: "noOpportunity", label: "No Opportunity" },
]);

const activityType = ref([
  { value: "phone", label: "Phone call" },
  { value: "followUp", label: "Follow Up" },
  { value: "email", label: "Email" },
  { value: "siteVisit", label: "Site Visit" },
  { value: "webForm", label: "Website Form" },
]);

interface contactPerson {
  firstName: string;
  lastName: string;
  displayName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  cellPhone: string;
  loginAllowed: boolean;
}

const addUpdateLeadHandler = async () => {
  try {
    loading.value = true;
    const formDataAPI = convertToFormData(leadFormData.value, [""]);
    const response = await api.post("/api/job/", formDataAPI);
    leadFormData.value = response.data;
    updateOnSuccess();
    notyf.success("Lead created successfully");
  } catch (error: any) {
    notyf.error(` ${error}, Lead`);
  } finally {
    loading.value = false;
  }
};

const getLeadDetailHandler = async () => {
  try {
    loading.value = true;
    const response = await api.get(`/api/job/${props.leadId}/`);
    leadFormData.value = response.data;
  } catch (error: any) {
    notyf.error(` ${error}, Lead`);
  } finally {
    loading.value = false;
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
      notyf.success("Address Added");
    } else if (response.data.status === "ZERO_RESULTS") {
      notyf.error("Invalid Post-Code");
    }
  } catch (error) {
    notyf.error("Invalid Post-Code");
    console.error(error);
  }
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
const tab = ref<"general" | "activities" | "proposals">("general");
const CKEditor = defineAsyncComponent(() =>
  import("@ckeditor/ckeditor5-vue").then((m) => m.default.component)
);

const editorConfig = {
  fontFamily: {
    options: ['"Montserrat", sans-serif', '"Roboto", sans-serif'],
  },
  height: "400px",
  minHeight: "400px",
};

onMounted(async () => {
  editor.value = await import("@ckeditor/ckeditor5-build-classic").then(
    (m) => m.default
  );
  if (props.leadId) {
    getLeadDetailHandler();
  }
});
</script>

<template>
  <VModal
    is="form"
    :open="props.addUpdateLeadModal"
    title="Lead Information"
    size="xl"
    actions="right"
    @submit.prevent="addUpdateLeadHandler"
    @close="closeModalHandler"
  >
    <template #content>
      <div class="modal-form columns is-multiline">
        <div class="tabs-wrapper column is-12 m-0">
          <div class="tabs-inner mt-4">
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

              <div class="field column is-3 mb-0">
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

              <div class="field column is-3 mb-0">
                <label>Zip Code: </label>
                <div class="control">
                  <input
                    type="text"
                    name="zipCode"
                    v-model="leadFormData.zip_code"
                    class="input is-primary-focus is-primary-focus"
                    placeholder="Zip code"
                  />
                  <!-- @blur="handlePostCodeChange" -->
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
                    <VSelect v-model="leadFormData.projectType">
                      <VOption
                        v-for="(item, index) in status"
                        :key="index"
                        :value="item.value"
                      >
                        {{ item.label }}
                      </VOption>
                    </VSelect>
                  </VControl>
                </VField>
              </div>
            </div>

            <!-- Salespeople -->
            <div class="field column is-12 mb-0">
              <label>Sales people:</label>
              <VField v-slot="{ id }" class="is-image-tags">
                <VControl>
                  <Multiselect
                    v-model="tagsSlotValue"
                    :attrs="{ id }"
                    mode="tags"
                    placeholder="Select language"
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

            <div class="field column is-6 mb-0">
              <ContractorsDropDown
                v-if="props.addUpdateLeadModal"
                :selectedContractor="leadFormData.manager"
                @update:OnSelectContractor="
                  (id: any) => {
                    leadFormData.client = id;
                  }
                "
              />
            </div>

            <div class="field column is-6 mb-0">
              <ManagersDropDown
                v-if="props.addUpdateLeadModal"
                :selectedManager="leadFormData.manager"
                @update:OnSelectManager="
                  (id: any) => {
                    leadFormData.manager = id;
                  }
                "
              />
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
                    v-model="sourcesValue"
                    :attrs="{ id }"
                    mode="tags"
                    :searchable="true"
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
                  <VSelect v-model="leadFormData.status">
                    <VOption
                      v-for="(item, index) in status"
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
                v-if="editor"
                v-model="leadFormData.notes"
                :editor="editor"
                :config="editorConfig"
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
                class="p-6"
                icon="fas fa-plus"
                fullwidth
                bold
              >
                Add New
              </VButton>
            </div>
            <div class="column is-6">
              <VButton
                class="p-6"
                color="primary"
                icon="fas fa-sign-in-alt"
                fullwidth
                bold
              >
                Import existing one
              </VButton>
            </div>
          </VCard>
          <VCard class="columns is-multiline">
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
                icon="fas fa-exchange-alt"
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
          <LeadActivityModal
            v-if="showAddUpdateContactModal"
            :addUpdateContactModal="showAddUpdateContactModal"
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
              <LeadProposalsList :leadId="leadFormData.id" />
            </div>
          </VCard>
          <!-- <LeadProposalModal
            v-if="openLeadProposalModal"
            :leadId="leadFormData.id"
            :leadProposalModal="openLeadProposalModal"
            @update:modal-handler="openLeadProposalModal = false"
          /> -->
        </div>
      </div>
    </template>
    <template #action>
      <VButton
        :loading="loading"
        type="submit"
        color="primary"
        icon="fas fa-plus"
        raised
        >Create Lead</VButton
      >
    </template>
  </VModal>
</template>
