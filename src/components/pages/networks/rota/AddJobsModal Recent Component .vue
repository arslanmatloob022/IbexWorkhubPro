<script setup lang="ts">
import axios from "axios";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { useCompany } from "/@src/stores/company";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { indexOf } from "cypress/types/lodash";

const isOpen = ref(true);
const company = useCompany();
const Loading = ref(false);
const siteChange = ref(false);
const notyf = useNotyf();
const api = useApi();
const selectSiteSlotValue = ref("");
let selectSupplierSlotOptions = ref<any[]>([]);
const selectSupplierSlotValue = ref("");
let selectSupplierWorkerSlotOptions = ref<any[]>([]);
const selectSupplierWorkerSlotValue = ref("");
const selectContractSlotValue = ref("");
let selectContarctSlotOptions = ref<any[]>([]);
let selectSlotOptions = ref<any[]>([]);
const selectCompanySiteValue = ref("");
let selectWorkerSlotOptions = ref<any[]>([]);
let companySitesSlotOptions = ref<any[]>([]);
let selectSiteSlotOptions = ref<any[]>([]);
const selectCustomerSlotValue = ref("");
const selectWorkerSlotValue = ref("");
const cureentSelectedSite = ref({});
const companyAllSites = ref([]);

const siteData = ref({
  name: "",
  address: "",
  postcode: "",
  latitude: 0,
  longitude: 0,
  city: "",
  inchargeName: "",
  inchargePhoneNo: "",
  inchargeEmail: "",
  comments: "",
  geofence: {},
  color: "",
  contract: 0,
});

const data = [
  {
    title: "2. select/create job site and client",
  },
];

const secData = [
  {
    title: "3. allocate worker- self serve or through a contractor",
  },
];

const thrdData = [
  {
    title: "4. create job quote and enter PO details (optional)",
  },
];

const getCurrentDate = () => {
  let currentDate = new Date();
  let year = currentDate.getFullYear();
  let month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  let day = String(currentDate.getDate()).padStart(2, "0");

  // Format the date as YYYY-MM-DD
  let formattedDate = `${year}-${month}-${day}`;
  jobData.value.title = formatDate(formattedDate);
  //  formattedDate;
};

const formatDate = (dateStrng: any) => {
  const date = new Date(dateString);
  const options = {
    weekday: "long",
    day: "2-digit",
    month: "long",
  };
  const dateFormatter = new Intl.DateTimeFormat("en-US", options);
  return dateFormatter.format(date);
};

const rotaData = ref({
  dates: <any>[
    {
      start: "08:00",
      end: "16:00",
      date: getCurrentDate(),
    },
  ],
  title: `job -- ${formatDate(getCurrentDate())}`,
  externalId: "",
  start: "08:00",
  end: "16:00",
});

const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
}>();

const closeModalHandler = () => {
  emit("update:modalHandler", false);
};

const props = defineProps<{
  AddJobModalOpen?: boolean;
}>();

const calendarOptions = ref<any>({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: "dayGridMonth",

  height: "auto",
  selectable: true,
  eventColor: "transparent",
  themeSystem: "bootstrap5",
  customButtons: {
    myCustomButton: {
      text: "clear selections",
      click: function () {
        clearDatesSelection();
      },
    },
  },
  headerToolbar: {
    left: "prev",
    center: "title",
    right: "myCustomButton next",
  },
  // dayGridMonth,dayGridWeek,dayGridDay
  views: {
    dayGridMonth: {
      eventLimit: 3,
    },
  },
  eventLimitClick: "popover",
  droppable: true,
  editable: true,
  events: [],
  dateClick: function (info) {
    dateClickHandler(info);
  },
});

const addJob = async () => {
  Loading.value = true;
  try {
    rotaData.value.dates = JSON.stringify(rotaData.value.dates);
    const response = await api.post(
      "/v3/api/rota/create-jobs/",
      rotaData.value
    );
    notyf.success("Job Added Successfuly");
    clearDatesSelection();
    Loading.value = false;
  } catch (err) {
    console.log(err);
    notyf.error("Error while adding a job");
    Loading.value = false;
  }
};

const addSite = async () => {
  try {
    const resp = await api.post("/v3/api/site/", siteData.value);
    console.log("assigned props", resp.data);
  } catch (err) {
    console.log(err);
  }
};

const handlePostCodeChange = async () => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${siteData.value.postcode}&key=AIzaSyDWHedwkLGGa4_3XgPqYxIzMkFpOdKJRik`
    );
    if (response.data.status === "OK") {
      siteData.value.address = response.data.results[0].formatted_address;
      siteData.value.latitude = response.data.results[0].geometry.location.lat;
      siteData.value.longitude = response.data.results[0].geometry.location.lng;
      notyf.success("Address Added");
    } else if (response.data.status === "ZERO_RESULTS") {
      notyf.error("Invalid Post-Code");
    }
  } catch (error) {
    notyf.error("Invalid Post-Code");
    console.error(error);
  }
};

const dateClickHandler = (info: any) => {
  // let found = rotaData.value.dates.some((obj) => obj.date === info.dateStr);

  // if (found) {
  //   rotaData.value.dates = rotaData.value.dates.filter(
  //     (obj) => obj.date !== info.dateStr
  //   );

  //   info.dayEl.style.backgroundColor = "#fff";
  // } else {

  rotaData.value.dates.push({
    start: "08:00",
    end: "16:00",
    date: info.dateStr,
  });
  info.dayEl.style.backgroundColor = "#C0DEFF";
};

const removeDate = (selecteddateIndex: number) => {
  console.log("selected date index", selecteddateIndex);

  const indexToRemove = rotaData.value.dates.findIndex(
    (date) => date.index === selecteddateIndex
  );

  if (indexToRemove !== -1) {
    rotaData.value.dates.splice(indexToRemove, 1);
    indexToRemove.dayEl.style.backgroundColor = "#fff";
  }
};

const clearDatesSelection = () => {
  rotaData.value.dates = [];
  const calendarDiv = document.querySelector("#rota-celender-two");
  if (calendarDiv) {
    calendarDiv.querySelectorAll("td").forEach(function (element) {
      element.removeAttribute("style");
    });
  }
};

const getAllCompanies = async () => {
  Loading.value = true;
  const resp = await api.get(
    `/v3/api/customer-company/company/${company.loggedCompany.id}`
  );
  //   Companies
  selectSlotOptions.value = resp.data.map((item) => {
    return {
      value: item.id.toString(),
      name: item.name,
      icon: item.logo ? item.logo : "/default/icon.png",
    };
  });
  if (resp.data) {
    selectCustomerSlotValue.value = resp.data[0].id;
  }
  Loading.value = false;
};

const getAllSites = async () => {
  try {
    const resp = await api.get(`/v3/api/site/`);
    console.log("sitee", resp.data);
    selectSiteSlotOptions.value = resp.data.map((site) => {
      return {
        value: site.id.toString(),
        name: `${site.name}`,
      };
    });
    if (resp.data) {
      selectSiteSlotValue.value = resp.data[0].id;
    }
  } catch (err) {
    console.log(err);
  }
};

const getAllJobsSites = async () => {
  Loading.value = true;

  try {
    const resp = await api.get(
      `v3/api/site/company/${company.loggedCompany.id}/`
    );
    companySitesSlotOptions.value = [];
    companyAllSites.value = resp.data;
    companySitesSlotOptions.value = resp.data.map((item: any) => {
      return {
        value: item.id.toString(),
        id: item.id,
        name: item.name,
        postcode: item.postcode,
        city: item.city,
        contractSiteId: item.contractInfo.id,
        inchargeName: item.inchargeName,
      };
    });
    if (resp.data) {
      selectCompanySiteValue.value = resp.data[0].id;
    }
    Loading.value = false;
  } catch (error) {
    console.log(error);
    notyf.error("Something went wrong (Sites)!");
    Loading.value = false;
  }
};

const getWorkers = async () => {
  try {
    const response = await api.get(
      `/v3/api/worker/${company.loggedCompany.id}/worker-short-info/`
    );

    selectWorkerSlotOptions.value = response.data.map((worker: any) => {
      return {
        value: worker.id.toString(),
        name: `${worker.firstName} ${worker.lastName}`,
        icon: worker.profileImageURL,
      };
    });
    if (response.data) {
      selectWorkerSlotValue.value = response.data[0].id;
    }
  } catch {
    notyf.error("Invalid data");
  } finally {
    Loading.value = false;
  }
};

const getAllSupplier = async () => {
  try {
    const response = await api.get(
      `/v3/api/supplier/get_company_suppliers/${company.loggedCompany.id}/`
    );
    selectSupplierSlotOptions.value = response.data.map((supplier: any) => {
      return {
        value: supplier.id.toString(),
        name: `${supplier.supplierName}`,
        icon: supplier.partnerLogo,
      };
    });
    console.log("partners", selectSupplierSlotOptions.value);
    if (response.data) {
      selectSupplierSlotValue.value = response.data[0].id;
    } else {
      selectSupplierSlotValue.value = "";
    }
  } catch {
    notyf.error("Invalid data");
  } finally {
    Loading.value = false;
  }
};

const getWorkersBySupplier = async () => {
  try {
    const response = await api.get(
      `/v3/api/worker/company-workers/${company.loggedCompany.id}/?&partner=${selectSupplierSlotValue.value}`,
      {}
    );
    selectSupplierWorkerSlotOptions.value = response.data.results.map(
      (worker: any) => {
        return {
          value: worker.id.toString(),
          name: `${worker.firstName} ${worker.lastName}`,
          icon: worker.profileImageURL,
        };
      }
    );
    console.log("partners", selectSupplierWorkerSlotOptions.value);
    if (response.data) {
      selectSupplierWorkerSlotValue.value = response.data.results[0].id;
    } else {
      selectSupplierWorkerSlotValue.value = "";
    }
  } catch (err) {
    console.log(err);
  }
};

const getContractsOfCompany = async () => {
  try {
    const response = await api.get(
      `/v3/api/contract/company/${company.loggedCompany.id}/`,
      {}
    );
    console.log("company contracts", response.data);
    selectContarctSlotOptions.value = response.data.map((contract: any) => {
      return {
        value: contract.id.toString(),
        name: contract.name,
      };
    });
    if (response.data) {
      selectContractSlotValue.value = response.data.results[0].id;
    } else {
      selectContractSlotValue.value = "";
    }
  } catch (err) {
    console.log(err);
  }
};

watch(selectCompanySiteValue, (newValue, oldValue) => {
  siteChange.value = false;
  const selectedSite = companyAllSites.value.find(
    (site) => site.id == newValue
  );
  if (selectedSite) {
    cureentSelectedSite.value = selectedSite;
    siteChange.value = true;
  }
});

watch(selectSupplierSlotValue, (newVal, oldVal) => {
  getWorkersBySupplier();
});

watch(
  [() => rotaData.value.start, () => rotaData.value.end],
  ([newStart, newEnd], [oldStart, oldEnd]) => {}
);

onMounted(() => {
  getAllSites();
  getAllCompanies();
  getWorkers();
  getAllJobsSites();
  getAllSupplier();
  getWorkersBySupplier();
  getContractsOfCompany();
});
</script>

<template>
  <VModal
    is="form"
    size="xl"
    :open="props.AddJobModalOpen"
    title="Add Job"
    actions="right"
    @close="closeModalHandler"
  >
    <template #content>
      <div class="modal-form columns is-multiline" id="addJob">
        <div class="field column is-12 mb-0" id="rota-celender-two">
          <div class="columns is-multiline mb-3">
            <div class="column is-5">
              <div class="columns is-multiline">
                <div class="column is-6">
                  <VField>
                    <VLabel>Title</VLabel>
                    <VControl>
                      <VInput
                        v-model="rotaData.title"
                        type="text"
                        placeholder="Title"
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-6">
                  <VField>
                    <VLabel>External Id</VLabel>
                    <VControl>
                      <VInput
                        v-model="rotaData.externalId"
                        type="text"
                        placeholder="External id"
                      />
                    </VControl>
                  </VField>
                </div>
              </div>
              <div>
                <FullCalendar :options="calendarOptions">
                  <template v-slot:eventContent="arg"> </template>
                </FullCalendar>
              </div>
              <div>
                <VButton @click="addJob" color="warning">
                  Create job schedule
                </VButton>
              </div>
            </div>
            <div class="field column is-7 mb-0 mt-5">
              <div class="columns is-multiline">
                <div class="column is-12">
                  <div class="columns is-multiline">
                    <div class="column is-7">
                      <p class="mr-2 is-bold">Jobs Rota</p>
                    </div>
                    <div class="column is-5 is-flex">
                      <p class="ml-4 mr-5 is-bold">Start Time</p>
                      <p class="ml-6 is-bold">End Time</p>
                    </div>
                  </div>
                </div>
                <div
                  class="column is-12 mt-4 is-flex space-between cus-light-border"
                  v-for="(date, index) in rotaData.dates"
                  :key="index"
                >
                  <p class="is-bold">{{ formatDate(date.date) }}</p>
                  <div class="is-flex" style="position: relative">
                    <VControl class="mr-4">
                      <VInput v-model="date.start" type="time" />
                    </VControl>
                    <VControl>
                      <VInput v-model="date.end" type="time" />
                    </VControl>
                    <div @click="removeDate(date.index)">
                      <i
                        class="iconify cu-pointer mt-3 ml-2 danger-text"
                        data-icon="feather:trash-2"
                      ></i>
                    </div>
                  </div>
                </div>
                <div
                  v-if="!rotaData.dates.length"
                  style="
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  "
                  class="mt-5"
                >
                  <p class="is-bold is-h3">No Date selected</p>
                </div>
              </div>
            </div>

            <!-- dropdowns -->
            <div class="column is-12" id="toggleCoolapseDetail">
              <VCollapse
                :items="data"
                :itemOpen="isOpen"
                with-chevron
                style="border-radius: 14px"
              >
                <template #collapse-item-head="item">
                  <div class="head-info">
                    <div class="head-progress"></div>
                  </div>
                </template>

                <template #collapse-item-content="item">
                  <div class="body-inner-content">
                    <div class="field columns is-multiline mb-0 space-between">
                      <div class="field column is-5 mb-0">
                        <label
                          >Select Site ({{
                            companySitesSlotOptions.length > 10
                              ? companySitesSlotOptions.length
                              : "0" + companySitesSlotOptions.length
                          }})*</label
                        >
                        <VField v-slot="{ id }">
                          <VControl>
                            <Multiselect
                              v-model="selectCompanySiteValue"
                              :attrs="{ id }"
                              placeholder="Select Contract"
                              label="name"
                              :options="companySitesSlotOptions"
                              :searchable="true"
                              track-by="name"
                              :height="300"
                              class="lg-multiselect"
                            >
                              <template
                                #singlelabel="{ value }"
                                style="background-color: transparent"
                              >
                                <div
                                  class="multiselect-single-label"
                                  style="background-color: transparent"
                                >
                                  {{ value.name }}
                                </div>
                              </template>

                              <template #option="{ option }">
                                <div
                                  style="
                                    display: flex;
                                    flex-direction: column;
                                    gap: 0.5rem;
                                  "
                                >
                                  <div
                                    class=""
                                    style="
                                      display: flex;
                                      flex-direction: column;
                                      align-items: start;
                                    "
                                  >
                                    <span style="color: #666; font-size: 1rem"
                                      >Site_ID: #00{{ option.id }}</span
                                    >
                                    <span
                                      style="
                                        font-weight: 500;
                                        font-size: 1.2rem;
                                      "
                                      >{{ option.name }}
                                    </span>
                                    <div
                                      style="
                                        display: flex;
                                        flex-direction: row;
                                        gap: 0.2rem;
                                        align-items: start;
                                      "
                                    >
                                      <span
                                        style="color: #666; font-size: 0.9rem"
                                        >Post Code:
                                        {{
                                          option.postcode
                                            ? option.postcode
                                            : " ---"
                                        }}</span
                                      >
                                      <span
                                        style="
                                          background-color: #ccc;
                                          height: 0.8rem;
                                          width: 2px;
                                        "
                                      ></span>
                                      <span
                                        style="color: #666; font-size: 0.9rem"
                                        >City: {{ option.city }}</span
                                      >
                                      <span
                                        style="
                                          background-color: #ccc;
                                          height: 0.8rem;
                                          width: 2px;
                                        "
                                      ></span>
                                      <span
                                        style="color: #666; font-size: 0.9rem"
                                        >Incharge:
                                        {{ option.inchargeName }}</span
                                      >
                                    </div>
                                  </div>
                                  <span
                                    style="
                                      background-color: #eee;
                                      height: 2px;
                                      width: 100%;
                                    "
                                  ></span>
                                </div>
                              </template>
                            </Multiselect>
                          </VControl>
                        </VField>
                        <h1 class="text-align-center">Or create</h1>
                        <div class="field mb-1">
                          <label>Select Contract </label>
                          <VField v-slot="{ id }" class="">
                            <VControl>
                              <Multiselect
                                v-model="selectContractSlotValue"
                                :attrs="{ id }"
                                placeholder="Select a contract"
                                label="name"
                                :options="selectContarctSlotOptions"
                                :searchable="true"
                                track-by="name"
                                :height="40"
                              >
                                <template #singlelabel="{ value }">
                                  <div class="multiselect-single-label">
                                    {{ value.name }}
                                  </div>
                                </template>

                                <template #option="{ option }">
                                  {{ option.name }}
                                </template>
                              </Multiselect>
                            </VControl>
                          </VField>
                        </div>
                        <div class="field mb-2">
                          <VField>
                            <VLabel>Site name</VLabel>
                            <VControl>
                              <VInput
                                v-model="siteData.name"
                                type="text"
                                placeholder="Site name"
                              />
                            </VControl>
                          </VField>
                        </div>
                        <div class="field mb-2">
                          <VField>
                            <VLabel>Post code</VLabel>
                            <VControl>
                              <VInput
                                @blur="handlePostCodeChange"
                                v-model="siteData.postcode"
                                type="text"
                                placeholder="Post code"
                              />
                            </VControl>
                          </VField>
                        </div>
                        <div class="field mb-2">
                          <VField>
                            <VLabel>Address</VLabel>
                            <VControl>
                              <VInput
                                v-model="siteData.address"
                                type="text"
                                placeholder="Address"
                              />
                            </VControl>
                          </VField>
                        </div>
                        <VButton @click="addSite" color="warning">
                          Create & Assign
                        </VButton>
                      </div>
                      <div class="field column is-6 mb-0">
                        <div class="mb-2 columns is-multiline">
                          <div class="column is-4">
                            <h1>Site Id</h1>
                            <p class="is-bold">
                              00{{
                                cureentSelectedSite.id
                                  ? cureentSelectedSite.id
                                  : "0"
                              }}
                            </p>
                          </div>
                          <div class="column is-5">
                            <h1>Site Name</h1>
                            <p class="is-bold">
                              {{
                                cureentSelectedSite.name
                                  ? cureentSelectedSite.name
                                  : "0"
                              }}
                            </p>
                          </div>
                          <div class="column is-4">
                            <h1>Post Code</h1>
                            <p class="is-bold">
                              {{
                                cureentSelectedSite.postcode
                                  ? cureentSelectedSite.postcode
                                  : "--- --- "
                              }}
                            </p>
                          </div>
                          <div class="column is-5">
                            <h1>Address</h1>
                            <p class="is-bold">
                              {{
                                cureentSelectedSite.address
                                  ? cureentSelectedSite.address
                                  : "-----"
                              }}
                            </p>
                          </div>
                          <div class="column is-4">
                            <h1>Company Name</h1>
                            <p class="is-bold">
                              {{
                                cureentSelectedSite.companyName
                                  ? cureentSelectedSite.companyName
                                  : "--- --- "
                              }}
                            </p>
                          </div>
                          <div class="column is-5">
                            <h1>Company Logo</h1>
                            <p class="is-bold">
                              {{
                                cureentSelectedSite.companyLogo
                                  ? cureentSelectedSite.companyLogo
                                  : "-----"
                              }}
                            </p>
                          </div>
                        </div>
                        <PolygonMap
                          v-if="siteChange"
                          style="width: 100%; height: 300px"
                          :siteData="cureentSelectedSite"
                        />
                      </div>
                    </div>
                  </div>
                </template>
              </VCollapse>
              <!-- select worker / service partners -->
              <VCollapse
                :items="secData"
                with-chevron
                style="border-radius: 14px"
              >
                <template #collapse-item-head="item">
                  <div class="head-info">
                    <div class="head-progress"></div>
                  </div>
                </template>
                <template #collapse-item-content="item">
                  <div class="body-inner-content">
                    <div class="field columns is-multiline mb-0 space-between">
                      <div class="field column is-5 mb-0">
                        <label>Select Worker </label>
                        <VField v-slot="{ id }" class="pl-2">
                          <VControl>
                            <Multiselect
                              v-model="selectWorkerSlotValue"
                              :attrs="{ id }"
                              placeholder="Select a worker"
                              label="name"
                              :options="selectWorkerSlotOptions"
                              :searchable="true"
                              track-by="name"
                              :height="40"
                            >
                              <template #singlelabel="{ value }">
                                <div class="multiselect-single-label">
                                  <img
                                    style="width: 30px"
                                    class="select-label-icon mr-2"
                                    :src="value.icon"
                                    alt=""
                                  />
                                  {{ value.name }}
                                </div>
                              </template>

                              <template #option="{ option }">
                                <img
                                  style="width: 30px"
                                  class="select-label-icon mr-2"
                                  :src="option.icon"
                                  alt=""
                                />
                                {{ option.name }}
                              </template>
                            </Multiselect>
                          </VControl>
                        </VField>
                      </div>
                      <div class="column is-12 text-align-center">
                        <h1>Or select Contractor worker</h1>
                      </div>
                      <div class="field column is-5 mb-0">
                        <label>Select service partner</label>
                        <VField v-slot="{ id }" class="pl-2">
                          <VControl>
                            <Multiselect
                              v-model="selectSupplierSlotValue"
                              :attrs="{ id }"
                              placeholder="Select service partner"
                              label="name"
                              :options="selectSupplierSlotOptions"
                              :searchable="true"
                              track-by="name"
                              :height="300"
                              class="lg-multiselect"
                            >
                              <template #singlelabel="{ value }">
                                <div class="multiselect-single-label">
                                  <img
                                    style="width: 30px"
                                    class="select-label-icon mr-2"
                                    :src="value.icon"
                                    alt=""
                                  />
                                  {{ value.name }}
                                </div>
                              </template>

                              <template #option="{ option }">
                                <img
                                  style="width: 40px; padding-right: 6px"
                                  class="select-option-icon mr-2"
                                  :src="option.icon"
                                  alt=""
                                />
                                {{ option.name }}
                              </template>
                            </Multiselect>
                          </VControl>
                        </VField>
                      </div>
                      <div class="field column is-5 mb-0">
                        <label>Select Supplier Worker </label>
                        <VField v-slot="{ id }" class="pl-2">
                          <VControl>
                            <Multiselect
                              v-model="selectSupplierWorkerSlotValue"
                              :attrs="{ id }"
                              placeholder="Select a worker"
                              label="name"
                              :options="selectSupplierWorkerSlotOptions"
                              :searchable="true"
                              track-by="name"
                              :height="40"
                            >
                              <template #singlelabel="{ value }">
                                <div class="multiselect-single-label">
                                  <img
                                    style="width: 30px"
                                    class="select-label-icon mr-2"
                                    :src="value.icon"
                                    alt=""
                                  />
                                  {{ value.name }}
                                </div>
                              </template>

                              <template #option="{ option }">
                                <img
                                  style="width: 30px"
                                  class="select-label-icon mr-2"
                                  :src="option.icon"
                                  alt=""
                                />
                                {{ option.name }}
                              </template>
                            </Multiselect>
                          </VControl>
                        </VField>
                      </div>
                    </div>
                  </div>
                </template>
              </VCollapse>
              <VCollapse
                :items="thrdData"
                with-chevron
                style="border-radius: 14px"
              >
                <template #collapse-item-head="item">
                  <div class="head-info">
                    <div class="head-progress"></div>
                  </div>
                </template>
                <template #collapse-item-content="item">
                  <div class="body-inner-content">
                    <div class="field columns is-multiline mb-0">
                      <div class="column is-12">
                        <div class="columns is-multiline">
                          <div class="field column is-12 mb-0">
                            <label>Upload PO</label>
                            <VField grouped>
                              <VControl>
                                <div class="file">
                                  <label class="file-label">
                                    <input
                                      class="file-input"
                                      type="file"
                                      name="resume"
                                    />
                                    <span class="file-cta">
                                      <span class="file-icon">
                                        <i class="fas fa-cloud-upload-alt" />
                                      </span>
                                      <span class="file-label">
                                        Choose a file…
                                      </span>
                                    </span>
                                  </label>
                                </div>
                              </VControl>
                            </VField>
                          </div>

                          <div class="field column is-11 mb-0">
                            <label>Notes</label>
                            <VField>
                              <VControl>
                                <VTextarea
                                  v-model="textarea"
                                  rows="4"
                                  placeholder="Job Qoute..."
                                />
                              </VControl>
                            </VField>
                          </div>
                          <VButton @click="closeModalHandler" color="warning"
                            >Save & Close</VButton
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </VCollapse>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #cancel>
      <VButton
        style="display: none"
        type="cancel"
        color="primary"
        :loading="Loading"
        raised
        >Create job schedule</VButton
      >
      <VButton
        style="display: none"
        type="submit"
        color="primary"
        :loading="Loading"
        raised
        >Create job schedule</VButton
      >
    </template>
    <template #action>
      <VButton
        style="display: none"
        type="cancel"
        color="primary"
        :loading="Loading"
        raised
        >Create job schedule</VButton
      >
    </template>
  </VModal>
</template>

<style lang="scss">
#rota-celender-two {
  td {
    border: 1px solid white !important;
  }

  tr {
    border: 1px solid white !important;
  }

  th {
    border: 1px solid white !important;
  }

  table {
    border: 1px solid white !important;
  }

  // date css
  .fc .fc-daygrid-day-top {
    display: flex !important;
    font-size: 18px;
    font-weight: bold;
  }
  .fc .fc-daygrid-body-natural .fc-daygrid-day-events {
    margin-bottom: 0.7rem;
    min-height: 0rem;
  }

  // days css
  .fc .fc-col-header-cell-cushion {
    display: inline-block;
    padding: 6px 8px;
    color: var(--primary) !important;
  }

  .fc-direction-ltr {
    background-color: white;
    padding: 20px;
    border-radius: 31px;
  }
}
</style>
<style lang="scss">
.close {
  color: #fff;
  z-index: 99999;
}
.close:hover {
  color: red;
}

#addJob {
  .multiselect-dropdown {
    max-height: 100px !important;
  }
}

.tags:last-child {
  margin-bottom: 1rem;
}
</style>
<style scoped lang="scss">
.cus-icon {
  color: var(--primary);
  display: flex;
  width: 20px;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: #ffffff;

  &.active {
    color: #ffffffec;
    background-color: var(--primary);
  }
}

.colorContainer {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  border-radius: 12px;
  padding: 10px 4px;
  padding-top: 40px;
  border: 3px solid var(--primary);

  .colorDiv {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;

    color: #ffffff;
    cursor: pointer;
    width: 22.5%;
    box-sizing: border-box;
    border-radius: 5px;
    margin: 4px;
  }

  .cus-selected {
    height: 40px;
    border: 3px solid var(--primary);
    cursor: pointer;
    width: 22.5%;
    box-sizing: border-box;
    border-radius: 12px;
    margin: 4px;
  }

  .close-btn {
    position: absolute;
    right: 16px;
    top: 10px;

    height: 20px;
    color: var(--primary-light);
    cursor: pointer;
    width: 20px;
  }
}

.color-pellate {
  display: flex;

  i {
    color: var(--primary);
    cursor: pointer;
  }

  .current-color-div {
    height: 36px;
    border: 1px solid #f1f1f1;
    cursor: pointer;
    width: 5rem;
    border-radius: 8px;
  }
}
.current-color-div {
  height: 36px;
  border: 1px solid #f1f1f1;
  cursor: pointer;
  width: 5rem;
  border-radius: 8px;
}
</style>
