<script setup lang="ts">
import { ref } from "vue";
const selected = ref("list");
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import FullCalendar from "@fullcalendar/vue3";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import VButton from "../base/button/VButton.vue";
import { useDarkmode } from "/@src/stores/darkmode";
import { useLayoutSwitcher } from "/@src/stores/layoutSwitcher";
const layoutSwitcher = useLayoutSwitcher();
const darkmode = useDarkmode();
const RequestSweetAlertProps = ref({
  title: "",
  subtitle: "test",
  isRequestSweetAlertOpen: false,
  btntext: "text",
});

const notyf = useNotyf();
const api = useApi();
const router = useRouter();
const tokenData = ref("");
const route = useRoute();
const linkResponse = ref<any>({});
const isLoading = ref(false);
const isFinal = ref(false);
const NewReferenceForm = ref({
  refereeEmail: "",
  employedFrom: "",
  employedTo: "",
  refereeName: "",
  companyName: "",
  jobTitle: "",
  worker: "",
  refereeContact: "",
  type: "Employment",
  token: "",
  id: "",
});

interface Reference {
  id: string;
  employedFrom: string;
  employedTo: string;
  companyName: string;
  worker: string;
  refereeEmail: string;
  refereeName: string;
  jobTitle: string;
  refereeContact: string;
  type: string;
}
const evenColors = {
  Pending: "#FAAD42",
  Approved: "#05D69E",
  Rejected: "#E62864",
};
const currentDate = new Date();
currentDate.setFullYear(currentDate.getFullYear() - 5);
const formattedDate = currentDate.toISOString().slice(0, 10);
const currentYear = currentDate.getFullYear();
const startYear = currentYear - 5;

const calendarOptions = ref<any>({
  plugins: [resourceTimelinePlugin],
  schedulerLicenseKey: "0965592368-fcs-1694657447",
  initialView: "resourceTimeline5Year",
  height: "auto",
  resourceAreaWidth: "10%",
  selectable: true,
  now: formattedDate,
  headerToolbar: {
    left: "",
    center: "",
    right: "",
  },
  droppable: true,
  editable: true,
  views: {
    resourceTimeline5Year: {
      type: "resourceTimeline",
      duration: { years: 6 },
      slotDuration: { months: 2 },
      slotWidth: 10,
    },
  },
  resourceAreaHeaderContent: "Companies",
  eventClick: (info) => {
    // Using arrow function
    console.log("event", info.event.id);
    console.log("clicked");
    const element = document.getElementById(`ref-${info.event.id}`);

    // Scroll to the element's position
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  },
});

const renderCalender = () => {
  console.log("references", references);
  const events = references.value.map((reference, index) => ({
    id: reference.id,
    resourceId: reference.id,
    start: reference.employedFrom,
    end: reference.employedTo,
    title: reference.companyName,
    jobTitle: reference.jobTitle,
    status: reference.status,
    color: evenColors[reference.status],
  }));

  const resources = references.value.map((reference, index) => ({
    id: reference.id,
    title: reference.companyName,
    jobTitle: reference.jobTitle,
    status: reference.status,
    color: evenColors[reference.status],
  }));
  calendarOptions.value.resources = resources;
  console.log("options", calendarOptions.value);
  calendarOptions.value.events = events;
};

const references = ref<Reference[]>([]);

const checkLinkToken = async () => {
  try {
    const response = await api.get(
      `v3/api/worker/reference/check-reference/${route.params.token}`
    );
    linkResponse.value = response.data;
  } catch {
    notyf.error("Reference link is expired or invalid");
    router.push("/");
  }
};
const inputChangeHandler = (event: any) => {
  console.log(NewReferenceForm.value);
  NewReferenceForm.value = {
    ...NewReferenceForm.value,
    [event.target.name]: event.target.value,
  };
};
const CleanFields = () => {
  NewReferenceForm.value = {
    refereeEmail: "",
    refereeName: "",
    employedFrom: "",
    jobTitle: "",
    employedTo: "",
    companyName: "",
    worker: "",
    refereeContact: "",
    type: "Employment",
    id: "",
  };
};
const addEmployeeRef = async () => {
  console.log(NewReferenceForm.value);
  NewReferenceForm.value = {
    ...NewReferenceForm.value,
    worker: linkResponse.value.worker.id,
    token: linkResponse.value.token,
  };
  try {
    isLoading.value = true;
    const response = await api.post(
      "/v3/api/worker/reference/",
      NewReferenceForm.value
    );
    notyf.success("New reference added");
    getAllReferences();
    if (isFinal.value) {
      router.push("/");
    }
    isLoading.value = false;
    console.log("Post Data:", response.data);

    CleanFields();
  } catch (err) {
    console.log(err);
    isLoading.value = false;
    notyf.error("Error accured");
  }
};

const goHome = () => {
  router.push("/");
};

const deleteId: any = ref("");

// -------------Sweet Alert For Confirmation
const OpenRequestDeleteSweetAlert = (id: any) => {
  deleteId.value = id;
  RequestSweetAlertProps.value = {
    title: "Are you sure?",
    subtitle: "You want to delete this Request permanently?",
    btntext: "Yes, Delete it",
    isRequestSweetAlertOpen: true,
  };
};

//----------- Delete Reference---------->
const deleteReference = async () => {
  let references2 = references.value;
  references.value = references2.filter((item) => item.id !== deleteId.value);

  const response = await api.delete(
    `/v3/api/worker/reference/${deleteId.value}`
  );
  renderCalender();
  notyf.warning("reference deleted");
};

const workerFirstName = ref<string>("");
const workerLastName = ref<string>("");

onMounted(async () => {
  await checkLinkToken();
  getAllReferences();
  workerFirstName.value = linkResponse?.value?.worker?.firstName || "";
  workerLastName.value = linkResponse?.value?.worker?.lastName || "";
});

// -------------------Me-------------------------->

// Get All Reference
const getAllReferences = async () => {
  try {
    const { data } = await api.get(
      `/v3/api/worker/reference/worker-references/${linkResponse.value.worker.id}/`
    );
    console.log("All_References:", data);
    references.value = data;
    renderCalender();
  } catch (error) {
    console.log(error);
  }
};

const acitve: Ref<string> = ref("timeline");

// <--------------->Calculate Time Difference<--------------->

const calculateDifference = (employedFrom: any, employedTo: any) => {
  const fromDate: any = new Date(employedFrom);
  const toDate: any = new Date(employedTo);

  let yearsDiff = toDate.getFullYear() - fromDate.getFullYear();
  let monthsDiff = toDate.getMonth() - fromDate.getMonth();
  let daysDiff = toDate.getDate() - fromDate.getDate();

  if (monthsDiff < 0 || (monthsDiff === 0 && daysDiff > 30)) {
    yearsDiff--;
    monthsDiff += 12;
  }

  if (daysDiff < 0) {
    const tempFromDate: any = new Date(fromDate);
    tempFromDate.setMonth(tempFromDate.getMonth() + 1);
    daysDiff = Math.floor((tempFromDate - fromDate) / (1000 * 60 * 60 * 24));
    monthsDiff--;
  }

  if (yearsDiff > 0) {
    return `${yearsDiff} year${yearsDiff !== 1 ? "s" : ""}`;
  } else if (monthsDiff > 0) {
    return `${monthsDiff} month${monthsDiff !== 1 ? "s" : ""}`;
  } else {
    return `${daysDiff} day${daysDiff !== 1 ? "s" : ""}`;
  }
};

// Get Update Reference

const getUpdateReference = async (id: string) => {
  try {
    const { data } = await api.get(`/v3/api/worker/reference/${id}/`);
    NewReferenceForm.value.refereeEmail = data.refereeEmail;
    NewReferenceForm.value.refereeName = data.refereeName;
    NewReferenceForm.value.employedFrom = data.employedFrom;
    NewReferenceForm.value.jobTitle = data.jobTitle;
    NewReferenceForm.value.employedTo = data.employedTo;
    NewReferenceForm.value.companyName = data.companyName;
    NewReferenceForm.value.worker = data.worker;
    NewReferenceForm.value.refereeContact = data.refereeContact;
    NewReferenceForm.value.type = data.type;
    NewReferenceForm.value.id = data.id;
  } catch (error) {
    console.error(error);
  }
};

const updateShow: Ref<boolean> = ref(false);

// Update Reference
const UpdateReferencehandler = async (id: string) => {
  try {
    await api.patch(`/v3/api/worker/reference/${id}/`, NewReferenceForm.value);
    getAllReferences();
    NewReferenceForm.value.refereeEmail = "";
    NewReferenceForm.value.refereeName = "";
    NewReferenceForm.value.employedFrom = "";
    NewReferenceForm.value.jobTitle = "";
    NewReferenceForm.value.employedTo = "";
    NewReferenceForm.value.companyName = "";
    NewReferenceForm.value.worker = "";
    NewReferenceForm.value.refereeContact = "";
    NewReferenceForm.value.type = "";
    NewReferenceForm.value.id = "";
    notyf.warning("Reference updated");

    updateShow.value = false;
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  layoutSwitcher.setDynamicLayoutId((darkmode.isDark = false));
});
</script>

<template>
  <div>
    <!-- <h6 style="font-weight:500; font-size:20px; text-align:left; margin-bottom:0; margin-top:6px; padding-left:2px">
      Timeline</h6> -->
    <div class="form-layout is-separate mb-2 mt-0">
      <div class="form-outer">
        <div class="form-body">
          <div class="form-section p-4">
            <div class="form-section-inner">
              <div
                class="columns is-multiline"
                style="
                  display: flex;
                  align-items: start;
                  justify-content: space-between;
                  gap: 2rem;
                "
              >
                <!-- 1 -->
                <div
                  class="referenceHeader"
                  style="display: flex; flex-direction: column; gap: 0.5rem"
                >
                  <span class="Employement-Referenc" style=""
                    >Employement Reference</span
                  >
                  <span class="Add-empoyement-refer" style=""
                    >Add empoyement references by providing required
                    details.</span
                  >
                </div>
                <!-- 2 -->
                <div class="is-flex">
                  <img
                    style="width: auto; height: 60px"
                    src="/images/logos/favicon_512x512.png"
                  />
                  <div>
                    <h3
                      style="font-size: 22px; color: var(--primary)"
                      class="cus-stat-heading ml-4 mt-0"
                    >
                      Arez
                    </h3>
                    <h3
                      style="font-size: 14px"
                      class="cus-stat-heading ml-4 mt-0"
                    >
                      The Compliance Manager
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- -------------------------Buttons-------------- -->
    <div class="referenceBtns" style="">
      <span style="font-size: 23px; font-weight: 500; color: #4d4d4d">
        {{ workerFirstName }} {{ workerLastName }}
      </span>
      <div
        class=""
        style="
          display: flex;
          align-items: center;
          height: 2.8rem;
          border-radius: 1.4rem;
          overflow: hidden;
        "
      >
        <button
          style="
            width: 100%;
            height: 100%;
            border: none;
            outline: none;
            cursor: pointer;
            border-right: 1px solid #ddd;
            padding: 0px 0.5rem;
            width: 7.5rem;
          "
          @click="acitve = 'timeline'"
          :class="acitve === 'timeline' && 'active'"
        >
          Timeline View
        </button>
        <button
          style="
            width: 100%;
            height: 100%;
            border: none;
            outline: none;
            cursor: pointer;
            padding: 0px 0.5rem;
            width: 7rem;
          "
          @click="acitve = 'list'"
          :class="acitve === 'list' && 'active'"
        >
          List View
        </button>
      </div>
    </div>

    <!-- -----------------------Clinder View----------------------- -->
    <div class="form-layout is-separate mb-1 mt-0" v-if="acitve === 'timeline'">
      <div class="form-outer">
        <div class="form-body">
          <div class="form-section p-4">
            <div class="form-section-inner">
              <FullCalendar :options="calendarOptions">
                <template v-slot:eventContent="arg">
                  <div class="p-2" style="">
                    <p
                      style="
                        font-weight: 600;
                        margin-bottom: 0px;
                        padding-left: 10px;
                        color: white;
                      "
                    >
                      {{ arg.event.extendedProps.jobTitle }}
                    </p>
                  </div>
                </template>
              </FullCalendar>
            </div>
          </div>
        </div>
      </div>

      <!-- -------------------------Add Reference Form----------------- -->
    </div>

    <!-- -------------------------List View------------- -->
    <div
      class=""
      v-if="acitve === 'list'"
      style="display: flex; flex-direction: column; gap: 2rem"
    >
      <div class="form-layout is-separate" style="width: 89%">
        <div
          class="form-section-inner"
          style="
            width: 100%;
            display: flex;
            flex-direction: row;
            gap: 2rem;
            overflow-x: auto;
          "
        >
          <div v-for="(item, index) in references" class="mb-4 cu-all-input">
            <div
              class="is-raised s-card"
              v-if="item.id"
              style="
                min-width: 26rem;
                display: flex;
                flex-direction: column;
                gap: 0.6rem;
                border-radius: 1.5rem;
              "
            >
              <!-- 1 -->
              <div
                class=""
                style="
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  margin-bottom: 0.8rem;
                "
              >
                <div class="" style="display: flex; flex-direction: column">
                  <h3
                    class=""
                    style="font-size: 15px; font-weight: 500; color: #000"
                  >
                    Reference Number : {{ index + 1 }}
                  </h3>
                  <span style="font-size: 0.9rem; font-weight: 500"
                    >{{ item.employedFrom }} - {{ item.employedTo }} ({{
                      calculateDifference(item.employedFrom, item.employedTo)
                    }})</span
                  >
                </div>
                <div
                  class=""
                  style="display: flex; align-items: center; gap: 1rem"
                >
                  <span
                    style="
                      padding: 0.2rem 0.5rem;
                      border-radius: 0.8rem;
                      background: #eee;
                      cursor: pointer;
                    "
                    @click="getUpdateReference(item.id), (updateShow = true)"
                    ><i class="fas fa-pen" aria-hidden="true"></i
                  ></span>
                  <span
                    style="
                      padding: 0.2rem 0.5rem;
                      border-radius: 0.8rem;
                      background: #eee;
                      cursor: pointer;
                    "
                    @click="OpenRequestDeleteSweetAlert(item.id)"
                    ><i class="fas fa-trash" aria-hidden="true"></i
                  ></span>
                </div>
              </div>

              <div
                class=""
                style="display: flex; flex-direction: column; gap: 1.2rem"
              >
                <div
                  class=""
                  style="
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                  "
                >
                  <div class="" style="display: flex; flex-direction: column">
                    <span
                      class="Reference-Type"
                      style="font-size: 12px; color: #808080"
                    >
                      Reference Type</span
                    >
                    <span
                      class="Employement"
                      style="font-size: 14px; font-weight: 500; color: #808080"
                      >{{ item.type }}</span
                    >
                  </div>
                  <!-- 2 -->
                  <div class="" style="display: flex; flex-direction: column">
                    <span
                      class="Reference-Type"
                      style="font-size: 12px; color: #808080"
                    >
                      Company</span
                    >
                    <span
                      class="Employement"
                      style="font-size: 14px; font-weight: 500; color: #808080"
                      >{{ item.companyName }}</span
                    >
                  </div>
                </div>
                <!-- row 2 -->
                <div
                  class=""
                  style="
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                  "
                >
                  <div class="" style="display: flex; flex-direction: column">
                    <span
                      class="Reference-Type"
                      style="font-size: 12px; color: #808080"
                    >
                      Referee Name</span
                    >
                    <span
                      class="Employement"
                      style="font-size: 14px; font-weight: 500; color: #808080"
                      >{{ item.refereeName }}</span
                    >
                  </div>
                  <!-- 2 -->
                  <div class="" style="display: flex; flex-direction: column">
                    <span
                      class="Reference-Type"
                      style="font-size: 12px; color: #808080"
                    >
                      Job Title</span
                    >
                    <span
                      class="Employement"
                      style="font-size: 14px; font-weight: 500; color: #808080"
                      >{{ item.jobTitle }}</span
                    >
                  </div>
                </div>
                <!-- row 3 -->
                <div
                  class=""
                  style="
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                  "
                >
                  <div class="" style="display: flex; flex-direction: column">
                    <span
                      class="Reference-Type"
                      style="font-size: 12px; color: #808080; width: 150px"
                    >
                      Referee Phone Number</span
                    >
                    <span
                      class="Employement"
                      style="font-size: 14px; font-weight: 500; color: #808080"
                      >{{ item.refereeContact }}</span
                    >
                  </div>
                  <!-- 2 -->
                  <div class="" style="display: flex; flex-direction: column">
                    <span
                      class="Reference-Type"
                      style="font-size: 12px; color: #808080"
                      >Referee Email</span
                    >
                    <span
                      class="Employement"
                      style="font-size: 14px; font-weight: 500; color: #808080"
                      >{{ item.refereeEmail }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
            <!-- Show Data (s) -->
            <div
              class=""
              style="
                display: flex;
                align-items: center;
                flex-direction: row;
                gap: 1.5rem;
              "
            >
              <div class="" v-for="item in references"></div>
            </div>
          </div>
          <div class="is-raised s-card" v-if="!references.length">
            <p>No References added yet !</p>
          </div>
        </div>
        <VButton
          color="info"
          v-if="references.length"
          style="float: right; margin-top: 10px"
          :loading="isLoading"
          @click="goHome"
        >
          Save & Go</VButton
        >

        <div class="form-section-outer"></div>
      </div>

      <!-- -------------------------Add Reference Form----------------- -->

      <!-- Update Ref Form -->
      <form
        class="form-layout is-separate cu-all-input"
        style=""
        @submit.prevent="UpdateReferencehandler(NewReferenceForm.id)"
        v-if="updateShow === true"
      >
        <div class="form-outer">
          <div class="form-body">
            <div class="form-section" style="height: min-content">
              <div class="form-section-inner has-padding-bottom">
                <h3
                  class="has-text-centered"
                  style="
                    font-size: 1.5rem;
                    font-weight: 500;
                    color: #111;
                    margin-bottom: 0.6rem;
                  "
                >
                  Update Reference
                </h3>
                <div class="columns is-multiline">
                  <div class="column is-6">
                    <VField>
                      <VLabel>Company *</VLabel>
                      <VControl>
                        <VInput
                          type="text"
                          required
                          name="companyName"
                          v-model="NewReferenceForm.companyName"
                          @change="(e: string) => inputChangeHandler(e)"
                          class="input"
                          placeholder="Company Name"
                          style="border-radius: 1rem"
                        />
                      </VControl>
                    </VField>
                  </div>
                  <div class="column is-6">
                    <VField v-slot="{ id }" class="is-image-select">
                      <VLabel>Type</VLabel>
                      <VControl>
                        <Multiselect
                          v-model="NewReferenceForm.type"
                          :attrs="{ id }"
                          placeholder="Select a type"
                          autocomplete="type"
                          label="name"
                          :options="[
                            {
                              value: 'Employment',
                              name: 'Employement',
                            },
                            {
                              value: 'Acdamin',
                              name: 'Academia',
                            },
                            {
                              value: 'Activity',
                              name: 'Activity',
                            },
                          ]"
                          style="border-radius: 1rem; padding-left: 0.5rem"
                        >
                          <template #singlelabel="{ value }">
                            <div class="multiselect-single-label">
                              <span class="select-label-text">
                                {{ value.name }}
                              </span>
                            </div>
                          </template>

                          <template #option="{ option }">
                            <span class="select-label-text">
                              {{ option.name }}
                            </span>
                          </template>
                        </Multiselect>
                      </VControl>
                    </VField>
                  </div>
                  <div class="column is-6">
                    <VField>
                      <VLabel>Referee Name *</VLabel>
                      <VControl>
                        <input
                          type="text"
                          class="input"
                          name="refereeName"
                          @change="(e) => inputChangeHandler(e)"
                          v-model="NewReferenceForm.refereeName"
                          placeholder="Referee Name"
                          style="border-radius: 1rem"
                        />
                      </VControl>
                    </VField>
                  </div>
                  <div class="column is-6">
                    <VField>
                      <VLabel> Referee Email *</VLabel>
                      <VControl>
                        <input
                          type="email"
                          class="input"
                          name="refereeEmail"
                          @change="(e) => inputChangeHandler(e)"
                          v-model="NewReferenceForm.refereeEmail"
                          placeholder="Referee Email"
                          style="border-radius: 1rem"
                        />
                      </VControl>
                    </VField>
                  </div>
                  <div class="column is-6">
                    <VField>
                      <VLabel>Referee Phone</VLabel>
                      <VControl>
                        <VInput
                          type="phone"
                          class="input"
                          name="employedTo"
                          @change="(e: any) => inputChangeHandler(e)"
                          v-model="NewReferenceForm.refereeContact"
                          placeholder="Referee phone"
                          style="border-radius: 1rem"
                        />
                      </VControl>
                    </VField>
                  </div>
                  <div class="column is-6">
                    <VField>
                      <VLabel>Job Title *</VLabel>
                      <VControl>
                        <input
                          type="text"
                          class="input"
                          name="jobTitle"
                          @change="(e) => inputChangeHandler(e)"
                          v-model="NewReferenceForm.jobTitle"
                          placeholder="Job Title"
                          style="border-radius: 1rem"
                        />
                      </VControl>
                    </VField>
                  </div>
                  <div class="column is-6">
                    <VField>
                      <VLabel>Start date*</VLabel>
                      <VControl>
                        <input
                          type="date"
                          required
                          class="input"
                          name="employedFrom"
                          @change="(e) => inputChangeHandler(e)"
                          v-model="NewReferenceForm.employedFrom"
                          placeholder="Employee Name"
                          style="border-radius: 1rem"
                        />
                      </VControl>
                    </VField>
                  </div>
                  <div class="column is-6">
                    <VField>
                      <VLabel>End Date *</VLabel>
                      <VControl>
                        <input
                          type="date"
                          required
                          class="input"
                          name="employedTo"
                          @change="(e) => inputChangeHandler(e)"
                          v-model="NewReferenceForm.employedTo"
                          placeholder="Referee Email"
                          style="border-radius: 1rem"
                        />
                      </VControl>
                    </VField>
                  </div>

                  <div class="column is-12 mt-6 space-between">
                    <p></p>
                    <VButton
                      color="primary"
                      type="submit"
                      style="margin-right: 10px"
                      :loading="isLoading"
                    >
                      Update
                    </VButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
    <form
      class="form-layout is-separate"
      style=""
      @submit.prevent="addEmployeeRef"
      v-if="updateShow === false"
    >
      <div class="form-outer cu-all-input">
        <div class="form-body">
          <div class="form-section" style="height: min-content">
            <div class="form-section-inner has-padding-bottom">
              <h3
                class="has-text-centered"
                style="font-size: 1.5rem; font-weight: 500; color: #111"
              >
                Add New Reference
              </h3>
              <h3
                class=""
                style="
                  font-size: 1.2rem;
                  margin-bottom: 0.5rem;
                  font-weight: 500;
                  color: #111;
                "
              >
                Reference Number : {{ references.length + 1 }}
              </h3>
              <div class="columns is-multiline">
                <div class="column is-6">
                  <VField>
                    <VLabel>Company *</VLabel>
                    <VControl>
                      <VInput
                        type="text"
                        required
                        name="companyName"
                        v-model="NewReferenceForm.companyName"
                        @change="(e: string) => inputChangeHandler(e)"
                        class="input"
                        placeholder="Company Name"
                        style="border-radius: 1rem"
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-6">
                  <VField v-slot="{ id }" class="is-image-select">
                    <VLabel>Type</VLabel>
                    <VControl>
                      <Multiselect
                        v-model="NewReferenceForm.type"
                        :attrs="{ id }"
                        placeholder="Select a type"
                        autocomplete="type"
                        label="name"
                        :options="[
                          {
                            value: 'Employment',
                            name: 'Employement',
                          },
                          {
                            value: 'Acdamin',
                            name: 'Academia',
                          },
                          {
                            value: 'Activity',
                            name: 'Activity',
                          },
                        ]"
                        style="border-radius: 1rem; padding-left: 0.5rem"
                      >
                        <template #singlelabel="{ value }">
                          <div class="multiselect-single-label">
                            <span class="select-label-text">
                              {{ value.name }}
                            </span>
                          </div>
                        </template>

                        <template #option="{ option }">
                          <span class="select-label-text">
                            {{ option.name }}
                          </span>
                        </template>
                      </Multiselect>
                    </VControl>
                  </VField>
                </div>
                <div class="column is-6">
                  <VField>
                    <VLabel>Referee Name *</VLabel>
                    <VControl>
                      <input
                        type="text"
                        class="input"
                        name="refereeName"
                        @change="(e) => inputChangeHandler(e)"
                        v-model="NewReferenceForm.refereeName"
                        placeholder="Referee Name"
                        style="border-radius: 1rem"
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-6">
                  <VField>
                    <VLabel> Referee Email *</VLabel>
                    <VControl>
                      <input
                        type="email"
                        class="input"
                        name="refereeEmail"
                        @change="(e) => inputChangeHandler(e)"
                        v-model="NewReferenceForm.refereeEmail"
                        placeholder="Referee Email"
                        style="border-radius: 1rem"
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-6">
                  <VField>
                    <VLabel>Referee Phone</VLabel>
                    <VControl>
                      <VInput
                        type="phone"
                        class="input"
                        name="employedTo"
                        @change="(e: any) => inputChangeHandler(e)"
                        v-model="NewReferenceForm.refereeContact"
                        placeholder="Referee phone"
                        style="border-radius: 1rem"
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-6">
                  <VField>
                    <VLabel>Job Title *</VLabel>
                    <VControl>
                      <input
                        type="text"
                        class="input"
                        name="jobTitle"
                        @change="(e) => inputChangeHandler(e)"
                        v-model="NewReferenceForm.jobTitle"
                        placeholder="Job Title"
                        style="border-radius: 1rem"
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-6">
                  <VField>
                    <VLabel>Start date*</VLabel>
                    <VControl>
                      <input
                        type="date"
                        required
                        class="input"
                        name="employedFrom"
                        @change="(e) => inputChangeHandler(e)"
                        v-model="NewReferenceForm.employedFrom"
                        placeholder="Employee Name"
                        style="border-radius: 1rem"
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-6">
                  <VField>
                    <VLabel>End Date *</VLabel>
                    <VControl>
                      <input
                        type="date"
                        required
                        class="input"
                        name="employedTo"
                        @change="(e) => inputChangeHandler(e)"
                        v-model="NewReferenceForm.employedTo"
                        placeholder="Referee Email"
                        style="border-radius: 1rem"
                      />
                    </VControl>
                  </VField>
                </div>

                <div class="column is-12 mt-6 space-between">
                  <p></p>
                  <VButton
                    color="primary"
                    type="submit"
                    icon="fas fa-plus"
                    style="margin-right: 10px"
                    :loading="isLoading"
                    @click="isFinal = false"
                  >
                    Save & Add More
                  </VButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
    <!--  -->
    <SweetAlert
      v-if="RequestSweetAlertProps.isRequestSweetAlertOpen"
      :isRequestSweetAlertOpen="RequestSweetAlertProps.isRequestSweetAlertOpen"
      :title="RequestSweetAlertProps.title"
      :subtitle="RequestSweetAlertProps.subtitle"
      :btntext="RequestSweetAlertProps.btntext"
      :onConfirm="
        () => {
          deleteReference(),
            (RequestSweetAlertProps.isRequestSweetAlertOpen = false);
        }
      "
      :onCancel="() => (RequestSweetAlertProps.isRequestSweetAlertOpen = false)"
    />
  </div>
</template>

<style lang="scss">
@import "/@src/scss/abstracts/all";

.is-navbar {
  .form-layout {
    margin-top: 30px;
  }
}

.form-layout {
  max-width: 740px;
  margin: 0 auto;

  &.is-separate {
    max-width: 1040px;

    .form-outer {
      background: none;
      border: none;

      .form-body {
        display: flex;

        .form-section {
          flex-grow: 2;
          padding: 10px;
          width: 50%;

          .form-section-inner {
            @include vuero-s-card;

            padding: 40px;

            &.has-padding-bottom {
              padding-bottom: 60px;
              height: 100%;
            }

            > h3 {
              font-family: var(--font-alt);
              font-size: 1.2rem;
              font-weight: 600;
              color: var(--dark-text);
              margin-bottom: 30px;
            }

            .columns {
              .column {
                padding-top: 0.25rem;
                padding-bottom: 0.25rem;
              }
            }

            .radio-boxes {
              display: flex;
              justify-content: space-between;
              margin-inline-start: -8px;
              margin-inline-end: -8px;

              .radio-box {
                position: relative;
                width: calc(50% - 16px);
                margin: 8px;

                &:focus-within {
                  border-radius: 3px;
                  outline-offset: var(--accessibility-focus-outline-offset);
                  outline-width: var(--accessibility-focus-outline-width);
                  outline-style: var(--accessibility-focus-outline-style);
                  outline-color: var(--primary);
                }

                input {
                  position: absolute;
                  top: 0;
                  inset-inline-start: 0;
                  height: 100%;
                  width: 100%;
                  opacity: 0;
                  cursor: pointer;

                  &:checked {
                    + .radio-box-inner {
                      background: var(--primary);
                      border-color: var(--primary);
                      box-shadow: var(--primary-box-shadow);

                      .fee,
                      p {
                        color: var(--smoke-white);
                      }
                    }
                  }
                }

                .radio-box-inner {
                  background: var(--white);
                  border: 1px solid var(--fade-grey-dark-3);
                  text-align: center;
                  border-radius: var(--radius);
                  font-family: var(--font);
                  font-weight: 600;
                  font-size: 0.9rem;
                  transition:
                    color 0.3s,
                    background-color 0.3s,
                    border-color 0.3s,
                    height 0.3s,
                    width 0.3s;
                  padding: 30px 20px;

                  .fee {
                    font-family: var(--font);
                    font-weight: 700;
                    color: var(--dark-text);
                    font-size: 2.4rem;
                    line-height: 1;

                    span {
                      &::after {
                        content: "$";
                        position: relative;
                        top: -10px;
                        font-size: 1.5rem;
                      }
                    }
                  }

                  p {
                    font-family: var(--font-alt);
                  }
                }
              }
            }

            .control {
              > p {
                padding-top: 12px;

                > span {
                  display: block;
                  font-size: 0.9rem;

                  span {
                    font-weight: 500;
                    color: var(--dark-text);
                  }
                }
              }
            }
          }

          .form-section-outer {
            .checkboxes {
              padding: 16px 0;

              .checkbox {
                padding: 0;
                font-size: 0.9rem;
              }
            }

            .button-wrap {
              .button {
                min-height: 60px;
                font-size: 1.05rem;
                font-weight: 600;
                font-family: var(--font-alt);
              }
            }
          }
        }
      }
    }
  }
}

.is-dark {
  .form-layout {
    &.is-separate {
      .form-outer {
        background: none !important;

        .form-body {
          .form-section {
            .form-section-inner {
              @include vuero-card--dark;

              > h3 {
                color: var(--dark-dark-text);
              }

              .radio-boxes {
                .radio-box {
                  input:checked + .radio-box-inner {
                    background: var(--primary);
                    border-color: var(--primary);
                    box-shadow: var(--primary-box-shadow);

                    .fee,
                    p {
                      color: var(--smoke-white);
                    }
                  }

                  .radio-box-inner {
                    background: var(--dark-sidebar-light-2);
                    border-color: var(--dark-sidebar-light-12);

                    .fee {
                      color: var(--dark-dark-text);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

@media only screen and (width <=767px) {
  .form-layout {
    &.is-separate {
      .form-outer {
        .form-body {
          padding-inline-start: 0;
          padding-inline-end: 0;
          flex-direction: column;

          .form-section {
            width: 100%;

            .form-section-inner {
              padding: 30px;
            }
          }
        }
      }
    }
  }
}

@media only screen and (width >=768px) and (width <=1024px) and (orientation: portrait) {
  .form-layout {
    &.is-separate {
      .form-outer {
        .form-body {
          padding-inline-start: 0;
          padding-inline-end: 0;

          // flex-direction: column;

          .form-section {
            // width: 100%;

            .form-section-inner {
              padding: 30px;
            }
          }
        }
      }
    }
  }
}

// ---------------------Me---------->
.active {
  background: #e4f6f5;
  color: #179e9b;
  font-weight: 500;
}

.referenceHeader span:nth-child(1) {
  font-size: 32px;
  color: #1a1a1a;
}
.referenceHeader span:nth-child(2) {
  font-size: 16px;
  font-weight: #666;
  width: 420px;
}

.referenceBtns {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding: 0rem 5rem;
  gap: 1.5rem;
}

.formLayout {
  background: #fff;
  padding: 1rem 0.8rem;
  border-radius: 1rem;
  box-shadow: 0.1rem 0.1rem 0rem rgba(0, 0, 0, 0.1);
}

// Responsive
@media (max-width: 600px) {
  .referenceHeader span:nth-child(1) {
    font-size: 26px;
  }
  .referenceHeader span:nth-child(2) {
    font-size: 15px;
    width: 300px;
  }
  .referenceBtns {
    width: 100%;
    display: flex;
    align-items: start;
    flex-direction: column;
    margin-bottom: 2rem;
    padding: 0rem 1.4rem;
  }
}
</style>
