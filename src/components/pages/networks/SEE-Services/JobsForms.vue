<script setup lang="ts">
import axios from "axios";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { useCompany } from "/@src/stores/company";
import ApexChart from "vue3-apexcharts";
import { useThemeColors } from "/@src/composable/useThemeColors";

const router = useRouter();
const themeColors = useThemeColors();
const route = useRoute();
const selectedJobId = ref(0);
const company = useCompany();
const Loading = ref(false);
const notyf = useNotyf();
const api = useApi();
const EditJobModalOpen = ref(false);
const siteChange = ref(false);
const currentJobId = ref(0);
const openAddSiteModal = ref(false);
const currentTab = ref("site");
const progressView = ref("rotaView");
const selectContractSlotValue = ref("");
const selectSiteSlotValue = ref("");
const selectWorkerSlotValue = ref("");
const selectManagerSlotValue = ref("");
let selectManagersSlotOptions = ref<any[]>([]);
let selectContarctSlotOptions = ref<any[]>([]);
let selectSiteSlotOptions = ref<any[]>([]);
const companyAllSites = ref([]);
const selectWorkerSlotOptions = ref([]);
const allWorkers = ref([]);
const selectedWorkers = ref([]);
const jobWorkersWithAnomalies = ref<any>([]);
const cureentSelectedSite = ref({});
const currentselectedWorker = ref({});
const textarea = ref("");
const jobProgress = ref([0]);
const parentActiveTab = ref("");
const option1 = ref(false);
const option2 = ref(false);
const option3 = ref(false);
const option4 = ref(false);
const jobStateArray = ref([
  "created",
  "waitingRAMS",
  "readyToStart",
  "started",
  "completed",
]);

const checkIsStateValid = (state: any) => {
  const btnStateIndex = jobStateArray.value.indexOf(state);
  const readyToStartIndex = jobStateArray.value.indexOf(jobData.value.state);
  return btnStateIndex <= readyToStartIndex;
};

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

const jobData = ref({
  id: 1,
  managerInfo: {
    company: 0,
    email: "",
    first_name: "",
    id: 0,
    last_name: "",
    partner: null,
    phoneNo: "",
    profileImage: "",
    role: "",
  },
  assignedWorkers: [
    {
      id: 0,
      firstName: "",
      lastName: "",
      latitude: 0.0,
      longitude: 0.0,
      postCode: "",
      phoneNumber: "",
      emailAddress: "",
      profileImageURL: "",
      profileStat: {
        percentage: 5.9,
        emptyFields: [
          {
            doc: "",
            status: false,
            is_uploaded: false,
          },
        ],
        anomalieStats: {
          expired: 0,
          required_not_uploaded: 0,
          optional_not_uploaded: 0,
        },
      },
      readyToGo: false,
    },
  ],
  siteInfo: {
    id: 0,
    name: "",
    address: "",
    postcode: "",
    latitude: 0.0,
    longitude: 0.0,
    city: "",
    inchargeName: "",
    inchargePhoneNo: "",
    inchargeEmail: null,
    comments: null,
    geofence: [
      {
        lat: 0.0,
        lng: 0.0,
      },
    ],
    created_at: "2024-05-03T11:39:57.787398Z",
    updated_at: "2024-05-03T11:39:57.968769Z",
    color: "#D875C7",
    regionFormat: "Convenience Central",
    areaManager: "Mark Pannell ",
    managingDirector: "Kevin Tindall ",
    contract: 60,
    contractInfo: {
      id: 0,
      name: " ",
      company: 0,
      customer_company: 0,
      incharge_name: "",
      color: "",
      charge_rate: 0,
      cuCompanyInfo: {
        id: 0,
        name: "",
        email: "",
        logo: "",
        phone_number: "",
      },
    },
  },
  workersList: [],
  title: "",
  description: "",
  externalId: "",
  isWorkWithContractor: true,
  status: "",
  createdAt: "",
  updatedAt: "",
  manager: null,
  workers: [],
  state: "",
  file: "",
});

const optionsCircle = shallowRef({
  series: [0],
  chart: {
    height: 240,
    type: "radialBar",
    toolbar: {
      show: false,
    },
  },
  colors: [themeColors.success],
  plotOptions: {
    radialBar: {
      hollow: {
        size: "40%",
      },
      dataLabels: {
        show: true,
        name: {
          show: true,
          fontSize: "16px",
          fontWeight: 500,
          offsetY: -10,
          color: themeColors.success,
        },
        value: {
          show: true,
          fontWeight: 600,
          color: themeColors.success,
          fontSize: "16px",
          offsetY: -10,
        },
      },
    },
  },
  labels: [""],
});

const data = [
  {
    title: "Additional Information",
    content: "Add additional information about job",
  },
];

const getJobById = async () => {
  try {
    Loading.value = true;
    const response = await api.get(`/v3/api/vixen-job/${route.params.id}/`);
    jobData.value = response.data;
    parentActiveTab.value = response.data.state;
    Loading.value = false;
  } catch (err) {
    console.log(err);
  }
};

const getWorkersForDropdown = async () => {
  try {
    const response = await api.get(
      `/v3/api/worker/${company.loggedCompany.id}/worker-short-info/`
    );
    allWorkers.value = response.data;
    selectWorkerSlotOptions.value = response.data.map((worker: any) => {
      return {
        value: worker.id.toString(),
        name: `${worker.firstName} ${worker.lastName}`,
        icon: worker.profileImageURL,
      };
    });
  } catch {
    notyf.error("Invalid data");
  } finally {
    Loading.value = false;
  }
};

const getContractsOfCompany = async () => {
  try {
    const response = await api.get(
      `/v3/api/contract/company/${company.loggedCompany.id}/`,
      {}
    );
    selectContarctSlotOptions.value = response.data.map((contract: any) => {
      return {
        value: contract.id.toString(),
        name: contract.name,
      };
    });
    if (response.data) {
      selectContractSlotValue.value = response.data[0].id;
    } else {
      selectContractSlotValue.value = "";
    }
  } catch (err) {
    console.log(err);
  }
};

const getAllSites = async () => {
  try {
    Loading.value = true;
    const resp = await api.get(
      `/v3/api/site/option/${company.loggedCompany.id}/`
    );
    selectSiteSlotOptions.value = resp.data.map((site) => {
      return {
        value: site.id.toString(),
        name: `${site.name}`,
        postcode: site.postcode,
        incharge: site.inchargeName,
      };
    });
    if (resp.data) {
      companyAllSites.value = resp.data;
      // console.log("current sitess", companyAllSites.value);
    }
    Loading.value = false;
  } catch (err) {
    console.log(err);
  }
};

const addJob = async () => {
  Loading.value = true;
  try {
    if (props.jobId != 0 && currentJobId.value) {
      const response = await api.patch(
        `/v3/api/vixen-job/${props.jobId}/`,
        jobData.value
      );
    } else {
      const response = await api.post("/v3/api/vixen-job/", jobData.value);
      currentJobId.value = response.data.id;
    }
    notyf.success("Job Added Successfuly");
    closeModalHandler();
    Loading.value = false;
  } catch (err) {
    console.log(err);
    notyf.error("Error while adding a job");
    Loading.value = false;
  }
};

const getManagers = async () => {
  try {
    const response = await api.get(
      `/v3/api/account/user/company-managers/${company.loggedCompany.id}/`,
      {}
    );
    selectManagersSlotOptions.value = response.data.map((manager: any) => {
      return {
        value: manager.id.toString(),
        name: `${manager.first_name} ${manager.last_name}`,
        icon: manager.profileImage,
        email: manager.email,
      };
    });
    if (response.data) {
      selectManagerSlotValue.value = response.data[0].id;
    }
  } catch {
    notyf.error("Invalid data");
  } finally {
    Loading.value = false;
  }
};

const sendRAMSemail = async () => {
  await addJob();
  RAMSemail();
};

const RAMSemail = async () => {
  try {
    const response = await api.post("/v3/api/vixen-job/rams-mail/", {
      job: currentJobId.value,
    });
    notyf.green("Email sent sucessfuly");
  } catch (err) {
    console.log(err);
  }
};

const activeTab = (tab: any) => {
  currentTab.value = tab;
};

const getCurrentDate = () => {
  let currentDate = new Date();
  let year = currentDate.getFullYear();
  let month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  let day = String(currentDate.getDate()).padStart(2, "0");

  // Format the date as YYYY-MM-DD
  let formattedDate = `${year}-${month}-${day}`;
  formatDate(formattedDate);
};

const formatDate = (dateString: any) => {
  const date = new Date(dateString);
  const options = {
    weekday: "long",
    day: "2-digit",
    month: "long",
  };
  const dateFormatter = new Intl.DateTimeFormat("en-US", options);
  jobData.value.title = `Job at ${dateFormatter.format(date)}`;
};

const openJobEditModal = (jobId: any) => {
  selectedJobId.value = jobId;
  EditJobModalOpen.value = true;
};

const getSiteDetail = async (id: any) => {
  try {
    const response = await api.get(`/v3/api/site/${id}/detail/`);
    jobData.value.siteInfo = response.data;
    console.log("current selected site", response.data);
  } catch (err) {
    console.log(err);
  }
};

const assignSiteToJob = async () => {
  try {
    Loading.value = true;
    if (selectSiteSlotValue.value) {
      const response = await api.patch(
        `/v3/api/vixen-job/${route.params.id}/`,
        {
          site: selectSiteSlotValue.value,
        }
      );
      notyf.success("Site assigned to job");
    } else {
      notyf.error("Please select a site first");
    }
    Loading.value = false;
  } catch (err) {
    console.log(err);
  }
};

const assignWorkerToJob = async (workerId: any) => {
  try {
    const response = await api.post(
      `/v3/api/vixen-job/${route.params.id}/assign/${workerId}/`
    );
    notyf.success("worker assigned");
    getJobWorkersWithAnomalies();
  } catch (err) {
    console.log(err);
  }
};

const removeWorkerFromJob = async (workerId: any) => {
  try {
    const response = await api.delete(
      `/v3/api/vixen-job/${route.params.id}/remove/${workerId}/`
    );
    notyf.error("Worker removed from the site");
    getJobWorkersWithAnomalies();
  } catch (err) {
    console.log(err);
  }
};

const getJobWorkersWithAnomalies = async () => {
  try {
    const response = await api.get(
      `/v3/api/vixen-job/${route.params.id}/assigned-workers/`
    );
    jobData.value.assignedWorkers = response.data;
    jobWorkersWithAnomalies.value = response.data;
  } catch (err) {
    console.log(err);
  }
};

const gotoWorkerProfile = (workerID: any) => {
  router.push({
    name: "/sidebar/company/workers/[id]",
    params: { id: workerID },
  });
};

const markJobDone = async () => {
  try {
    const response = await api.patch(`/v3/api/vixen-job/${route.params.id}/`, {
      state: "completed",
    });
    notyf.success("Job mark as completed successfully");
    router.push("/sidebar/company/jobs");
  } catch (err) {
    console.log(err);
  }
};

watch(selectSiteSlotValue, (newVal, oldVal) => {
  getSiteDetail(newVal);
});

watch(selectManagerSlotValue, (newVal, oldValue) => {
  jobData.value.manager = newVal;
});

watch(selectSiteSlotValue, (newValue, oldValue) => {
  siteChange.value = false;
  const selectedSite = companyAllSites.value.find(
    (site) => site.id == newValue
  );
  if (selectedSite) {
    cureentSelectedSite.value = selectedSite;
    console.log("current sellected site", cureentSelectedSite.value);
    siteChange.value = true;
  }
});

watch(selectWorkerSlotValue, (newValue, oldValue) => {
  siteChange.value = false;
  assignWorkerToJob(newValue);
  const selectedWorker = allWorkers.value.find((site) => site.id == newValue);
  if (selectedWorker) {
    selectedWorkers.value.push(selectedWorker);
    currentselectedWorker.value = selectedWorker;
    console.log("current sellected worker", currentselectedWorker.value);
    siteChange.value = true;
  }
});

watch([option1, option2, option3, option4], ([opt1, opt2, opt3, opt4]) => {
  let count = 0;
  if (opt1) count++;
  if (opt2) count++;
  if (opt3) count++;
  if (opt4) count++;

  jobProgress.value = count * 25;
});

onMounted(() => {
  getJobById();
  getWorkersForDropdown();
  getManagers();
  getCurrentDate();
  getContractsOfCompany();
  getAllSites();
  getJobWorkersWithAnomalies();
});
</script>

<template>
  <div>
    <div
      class="card columns is-multiline mb-3"
      style="
        border-radius: 24px;
        width: 100%;
        padding: 20px 20px;
        background-image: linear-gradient(180deg, white 85%, #faad4225);
      "
    >
      <div class="column is-12 mt-0">
        <VButtons>
          <VButton
            light
            style="background-color: transparent; padding: 5px; margin: 2px"
            @click="
              () => {
                parentActiveTab = 'created';
              }
            "
            :class="[
              checkIsStateValid('created') ? 'parentActiveState' : '',
              parentActiveTab === 'created' ? 'parentActiveTab' : '',
            ]"
          >
            <i
              class="lnir lnir-pencil-alt"
              style="font-weight: 800"
              aria-hidden="true"
            ></i>
            Created
            <i class="fas fa-arrow-right ml-1" aria-hidden="true"></i>
          </VButton>

          <VButton
            light
            style="background-color: transparent; padding: 5px; margin: 2px"
            @click="
              () => {
                parentActiveTab = 'waitingRAMS';
              }
            "
            :class="[
              checkIsStateValid('waitingRAMS') ? 'parentActiveState' : '',
              parentActiveTab === 'waitingRAMS' ? 'parentActiveTab' : '',
            ]"
          >
            <i class="fas fa-clipboard" aria-hidden="true"></i>

            Pending for Checks
            <i class="fas fa-arrow-right ml-1" aria-hidden="true"></i>
          </VButton>

          <VButton
            light
            style="background-color: transparent; padding: 5px; margin: 2px"
            @click="
              () => {
                parentActiveTab = 'readyToStart';
              }
            "
            :class="[
              checkIsStateValid('readyToStart') ? 'parentActiveState' : '',
              parentActiveTab === 'readyToStart' ? 'parentActiveTab' : '',
            ]"
          >
            <i class="fas fa-clipboard-check" aria-hidden="true"></i>
            Ready to start
            <i class="fas fa-arrow-right ml-1" aria-hidden="true"></i>
          </VButton>

          <VButton
            light
            style="background-color: transparent; padding: 5px; margin: 2px"
            @click="
              () => {
                parentActiveTab = 'started';
              }
            "
            :class="[
              checkIsStateValid('started') ? 'parentActiveState' : '',
              parentActiveTab === 'started' ? 'parentActiveTab' : '',
            ]"
          >
            <i class="fas fa-clock" aria-hidden="true"></i>
            In Progress
            <i class="fas fa-arrow-right ml-1" aria-hidden="true"></i>
          </VButton>

          <VButton
            light
            style="background-color: transparent; padding: 5px; margin: 2px"
            @click="
              () => {
                parentActiveTab = 'completed';
              }
            "
            :class="[
              checkIsStateValid('completed') ? 'parentActiveState' : '',
              parentActiveTab === 'completed' ? 'parentActiveTab' : '',
            ]"
          >
            <i class="fas fa-child" aria-hidden="true"></i>
            Completed
            <i class="fas fa-check-circle ml-1" aria-hidden="true"></i>
          </VButton>
        </VButtons>
      </div>

      <div class="column is-6">
        <div class="row">
          <div class="columns is-multiline">
            <p class="column is-12 is-md-bold dark-text">
              {{ jobData.title ? jobData.title : "-----" }}
            </p>
            <div class="column is-3">
              <p class="is-small-bold">
                Id:
                <span style="font-size: 13px; color: #bbb">{{
                  jobData.externalId ? jobData.externalId : "-----"
                }}</span>
              </p>
              <p class="is-small-bold">
                Workers:
                <span style="font-size: 13px; color: #bbb">
                  {{ jobData.workers ? jobData.workers.length : "0" }}</span
                >
              </p>
            </div>
            <div class="column is-3">
              <p class="is-small-bold mb-1">
                Type:
                <span style="font-size: 13px; color: #bbb">
                  {{
                    jobData.isWorkWithContractor
                      ? "Work with contractor"
                      : "Self Serve"
                  }}</span
                >
              </p>

              <p class="is-small-bold dark-text">
                Created At:
                <span style="font-size: 13px; color: #bbb">
                  {{
                    jobData.createdAt ? jobData.createdAt.slice(0, 10) : "-----"
                  }}</span
                >
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="column is-4">
        <h1 class="title">Manager</h1>
        <div class="is-flex">
          <VAvatar
            :picture="
              jobData.managerInfo && jobData.managerInfo.profileImage
                ? jobData.managerInfo.profileImage
                : ''
            "
            size="medium"
            squared
          >
          </VAvatar>
          <div class="manager-info ml-2">
            <p class="is-bold mb-2">
              {{
                jobData.managerInfo && jobData.managerInfo.first_name
                  ? jobData.managerInfo.first_name
                  : "------"
              }}
              {{
                jobData.managerInfo && jobData.managerInfo.last_name
                  ? jobData.managerInfo.last_name
                  : ""
              }}
            </p>
            <p class="is-bold mb-2">
              {{
                jobData.managerInfo && jobData.managerInfo.email
                  ? jobData.managerInfo.email
                  : "------"
              }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- created / job description -->
    <div
      v-if="parentActiveTab == 'created'"
      class="modal-form columns is-multiline cu-all-input mt-6"
    >
      <div class="field column is-12 mb-0" id="rota-celender-two">
        <div class="columns is-multiline mb-3 cu-all-input">
          <div class="column is-12">
            <div
              class="field columns is-multiline mb-0 cu-all-input space-between lengthy-smart-search-dropdown"
            >
              <div class="field column is-6 mb-0 is-relative">
                <i
                  @click="openJobEditModal(jobData.id)"
                  class="fas fa-pen cu-pointer"
                  aria-hidden="true"
                  style="position: absolute; right: 14px; top: 10px"
                ></i>
                <div class="mb-2 columns is-multiline">
                  <div class="column is-4">
                    <img
                      class="small-img"
                      v-if="
                        jobData.siteInfo &&
                        jobData.siteInfo.contractInfo &&
                        jobData.siteInfo.contractInfo.cuCompanyInfo &&
                        !Loading
                      "
                      :src="
                        jobData.siteInfo.contractInfo.cuCompanyInfo &&
                        jobData.siteInfo.contractInfo.cuCompanyInfo.logo
                          ? jobData.siteInfo.contractInfo.cuCompanyInfo.logo
                          : ''
                      "
                      size="medium"
                    />
                  </div>
                  <div class="column is-5">
                    <h1
                      v-if="
                        jobData.siteInfo &&
                        jobData.siteInfo.contractInfo &&
                        jobData.siteInfo.contractInfo.cuCompanyInfo &&
                        !Loading
                      "
                    >
                      {{
                        jobData.siteInfo.contractInfo.cuCompanyInfo &&
                        jobData.siteInfo.contractInfo.cuCompanyInfo.name
                          ? jobData.siteInfo.contractInfo.cuCompanyInfo.name
                          : "Not added yet"
                      }}
                    </h1>
                    <p
                      v-if="
                        jobData.siteInfo &&
                        jobData.siteInfo.contractInfo &&
                        jobData.siteInfo.contractInfo.cuCompanyInfo &&
                        !Loading
                      "
                      class="is-bold"
                    >
                      {{
                        jobData.siteInfo.contractInfo.cuCompanyInfo &&
                        jobData.siteInfo.contractInfo.cuCompanyInfo.email
                          ? jobData.siteInfo.contractInfo.cuCompanyInfo.email
                          : "------"
                      }}
                    </p>
                  </div>
                  <div class="column is-12">
                    <h1>Job</h1>
                    <p class="is-bold">
                      {{ jobData && jobData.title ? jobData.title : "0" }}
                    </p>
                  </div>
                  <div class="column is-5">
                    <h1>Id</h1>
                    <p class="is-bold">
                      {{
                        jobData.externalId && jobData.externalId
                          ? jobData.externalId
                          : "-----"
                      }}
                    </p>
                  </div>

                  <div class="column is-4">
                    <h1>Type</h1>
                    <p class="is-bold">
                      {{
                        jobData.isWorkWithContractor &&
                        jobData.isWorkWithContractor
                          ? "Work with contractor"
                          : " Self Serve"
                      }}
                    </p>
                  </div>
                  <div class="column is-5">
                    <h1>Created At</h1>
                    <p class="is-bold">
                      {{
                        jobData.createdAt && jobData.createdAt
                          ? jobData.createdAt.slice(0, 10)
                          : "0"
                      }}
                    </p>
                  </div>
                  <div class="column is-4">
                    <h1>Manager</h1>
                    <p class="is-bold">
                      {{
                        jobData.managerInfo && jobData.managerInfo.first_name
                          ? jobData.managerInfo.first_name
                          : "--- --- "
                      }}
                    </p>
                  </div>
                  <div class="column is-12">
                    <h1>Description</h1>
                    <p class="is-bold">
                      {{
                        jobData.description && jobData.description
                          ? jobData.description
                          : "-----"
                      }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- waiting RAMS -->
    <div
      v-if="parentActiveTab == 'waitingRAMS'"
      class="modal-form columns is-multiline cu-all-input mt-1"
    >
      <div class="field column is-12 mb-0" id="rota-celender-two">
        <div class="columns is-multiline mb-3 cu-all-input">
          <div class="column is-12 mt-5">
            <VButtons>
              <VButton
                rounded
                @click="activeTab('waitingRAMS')"
                :color="currentTab === 'waitingRAMS' ? 'primary' : ''"
                >1 - Manage RAMS
              </VButton>
              <VButton
                rounded
                @click="activeTab('site')"
                :color="currentTab === 'site' ? 'primary' : ''"
                >2 - Job Site (optional)
              </VButton>
              <VButton
                rounded
                @click="activeTab('worker')"
                :color="currentTab === 'worker' ? 'primary' : ''"
                >3 - Allocate Worker (optional)
              </VButton>
            </VButtons>
          </div>

          <div v-if="currentTab == 'site'" class="column is-12">
            <div
              class="field columns is-multiline mb-0 cu-all-input space-between lengthy-smart-search-dropdown"
            >
              <div class="field column is-5 mb-0">
                <label
                  >Select Site ({{
                    selectSiteSlotOptions.length > 10
                      ? selectSiteSlotOptions.length
                      : "0" + selectSiteSlotOptions.length
                  }})*</label
                >
                <VField v-slot="{ id }">
                  <VControl class="placement-wrapper">
                    <Multiselect
                      class="multi-select lg-multiselect"
                      v-model="selectSiteSlotValue"
                      :attrs="{ id }"
                      placeholder="Select site"
                      label="name"
                      :options="selectSiteSlotOptions"
                      :searchable="true"
                      track-by="name"
                      :height="300"
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
                              >ID: 00{{ option.value }}</span
                            >
                            <span style="font-weight: 500; font-size: 1.2rem"
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
                              <span style="color: #666; font-size: 0.9rem"
                                >Post Code:
                                {{
                                  option.postcode ? option.postcode : " ---"
                                }}</span
                              >
                              |

                              <span style="color: #666; font-size: 0.9rem"
                                >Incharge: {{ option.incharge }}</span
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
                <div class="mt-5 is-flex space-between cus-align-center">
                  <VButton @click="assignSiteToJob" elevated color="warning">
                    Assign Site
                  </VButton>
                  <h1>Or</h1>
                  <VButton
                    @click="
                      () => {
                        openAddSiteModal = !openAddSiteModal;
                      }
                    "
                    elevated
                    color="warning"
                  >
                    Create new Site
                  </VButton>
                </div>
              </div>
              <div class="field column is-6 mb-0">
                <div class="mb-2 columns is-multiline">
                  <div class="column is-4">
                    <img
                      class="small-img"
                      v-if="
                        jobData.siteInfo &&
                        jobData.siteInfo.contractInfo &&
                        jobData.siteInfo.contractInfo.cuCompanyInfo &&
                        !Loading
                      "
                      :src="
                        jobData.siteInfo.contractInfo.cuCompanyInfo &&
                        jobData.siteInfo.contractInfo.cuCompanyInfo.logo
                          ? jobData.siteInfo.contractInfo.cuCompanyInfo.logo
                          : ''
                      "
                      size="medium"
                    />
                  </div>
                  <div class="column is-5">
                    <h1
                      v-if="
                        jobData.siteInfo &&
                        jobData.siteInfo.contractInfo &&
                        jobData.siteInfo.contractInfo.cuCompanyInfo &&
                        !Loading
                      "
                    >
                      {{
                        jobData.siteInfo.contractInfo.cuCompanyInfo &&
                        jobData.siteInfo.contractInfo.cuCompanyInfo.name
                          ? jobData.siteInfo.contractInfo.cuCompanyInfo.name
                          : "Not added yet"
                      }}
                    </h1>
                    <p
                      v-if="
                        jobData.siteInfo &&
                        jobData.siteInfo.contractInfo &&
                        jobData.siteInfo.contractInfo.cuCompanyInfo &&
                        !Loading
                      "
                      class="is-bold"
                    >
                      {{
                        jobData.siteInfo.contractInfo.cuCompanyInfo &&
                        jobData.siteInfo.contractInfo.cuCompanyInfo.email
                          ? jobData.siteInfo.contractInfo.cuCompanyInfo.email
                          : "------"
                      }}
                    </p>
                  </div>
                  <div class="column is-4">
                    <h1>Site Id</h1>
                    <p class="is-bold">
                      00{{
                        jobData.siteInfo && jobData.siteInfo.id
                          ? jobData.siteInfo.id
                          : "0"
                      }}
                    </p>
                  </div>
                  <div class="column is-5">
                    <h1>Site Name</h1>
                    <p class="is-bold">
                      {{
                        jobData.siteInfo && jobData.siteInfo.name
                          ? jobData.siteInfo.name
                          : "0"
                      }}
                    </p>
                  </div>
                  <div class="column is-4">
                    <h1>Post Code</h1>
                    <p class="is-bold">
                      {{
                        jobData.siteInfo && jobData.siteInfo.postcode
                          ? jobData.siteInfo.postcode
                          : "--- --- "
                      }}
                    </p>
                  </div>
                  <div class="column is-5">
                    <h1>Address</h1>
                    <p class="is-bold">
                      {{
                        jobData.siteInfo && jobData.siteInfo.address
                          ? jobData.siteInfo.address
                          : "-----"
                      }}
                    </p>
                  </div>
                  <div class="column is-4">
                    <h1>Incharge Name</h1>
                    <p class="is-bold">
                      {{
                        jobData.siteInfo && jobData.siteInfo.inchargeName
                          ? jobData.siteInfo.inchargeName
                          : "--- --- "
                      }}
                    </p>
                  </div>
                  <div class="column is-5">
                    <h1>Incharge Email</h1>
                    <p class="is-bold">
                      {{
                        jobData.siteInfo && jobData.siteInfo.inchargeEmail
                          ? jobData.siteInfo.inchargeEmail
                          : "-----"
                      }}
                    </p>
                  </div>
                </div>
                <PolygonMap
                  v-if="!Loading"
                  style="width: 90%; height: 220px"
                  :siteData="jobData.siteInfo ? jobData.siteInfo : jobData"
                />
              </div>
            </div>
          </div>
          <div v-if="currentTab == 'worker'" class="column is-12">
            <div
              class="field columns is-multiline mb-0 cu-all-input space-between smart-search-dropdown"
            >
              <div class="field column is-5 mb-0">
                <label
                  >Select Worker ({{
                    selectWorkerSlotOptions.length > 10
                      ? selectWorkerSlotOptions.length
                      : "0" + selectWorkerSlotOptions.length
                  }})*</label
                >
                <VField v-slot="{ id }">
                  <VControl class="placement-wrapper">
                    <Multiselect
                      class="multi-select lg-multiselect"
                      v-model="selectWorkerSlotValue"
                      :attrs="{ id }"
                      placeholder="Select site"
                      label="name"
                      :options="selectWorkerSlotOptions"
                      :searchable="true"
                      track-by="name"
                    >
                      <template
                        #singlelabel="{ value }"
                        style="background-color: transparent"
                      >
                        <div
                          class="multiselect-single-label"
                          style="background-color: transparent"
                        >
                          <img
                            class="select-label-icon mr-2 value-image"
                            :src="value.icon"
                            alt=""
                          />
                          {{ value.name }}
                        </div>
                      </template>

                      <template #option="{ option }">
                        <img
                          class="select-label-icon mr-2 value-image"
                          :src="option.icon"
                          alt=""
                        />
                        {{ option.name }}
                      </template>
                    </Multiselect>
                  </VControl>
                </VField>
              </div>
              <div class="field column is-6 mb-0">
                <h1
                  v-if="jobData.assignedWorkers.length"
                  class="is-md-bold mb-2"
                >
                  Assigned Workers ({{ jobData.assignedWorkers.length }})
                </h1>
                <h1 class="is-md-bold mb-2" v-else>
                  No Assigned Worker Assigned yet
                </h1>
                <div
                  v-for="worker in jobData.assignedWorkers"
                  :key="worker.id"
                  class="card px-4 py-3 mb-2 rounded"
                >
                  <VIconButton
                    @click="removeWorkerFromJob(worker.id)"
                    color="danger"
                    light
                    raised
                    circle
                    icon="feather:x"
                    style="
                      position: absolute;
                      font-size: 22px;
                      right: 10px;
                      top: 10px;
                      cursor: pointer;
                      padding: 0;
                      width: 22px;
                      height: 22px;
                    "
                  />

                  <div class="mb-2 columns is-multiline">
                    <div
                      class="column is-6 is-flex cu-pointer"
                      @click="gotoWorkerProfile(worker.id)"
                    >
                      <VAvatar
                        :picture="
                          worker.profileImageURL
                            ? worker.profileImageURL
                            : '/demo/avatars/11.jpg'
                        "
                        size="large"
                      />
                      <div class="info ml-3">
                        <p class="is-md-bold">
                          {{ worker.firstName ? worker.firstName : "---" }}
                          {{ worker.lastName ? worker.lastName : "---" }}
                        </p>
                        <p class="is-bold cu-align-center">
                          <i
                            class="iconify mr-1"
                            data-icon="feather:mail"
                            aria-hidden="true"
                          ></i>
                          {{
                            worker.emailAddress
                              ? worker.emailAddress
                              : "--- --- "
                          }}
                        </p>
                        <p class="is-bold cu-align-center">
                          <i
                            class="lnil lnil-map-marker mr-1"
                            aria-hidden="true"
                          ></i>
                          {{ worker.postCode ? worker.postCode : "--- --- " }}
                        </p>
                      </div>
                    </div>
                    <div class="column is-3">
                      <h1>Profile Completion</h1>
                      <p class="is-bold">
                        <span style="color: var(--primary)"
                          >{{
                            worker.profileStat && worker.profileStat.percentage
                              ? worker.profileStat.percentage
                              : "0"
                          }}%</span
                        >
                        Complete
                      </p>
                      <p class="is-bold">
                        <span
                          :style="{
                            color: worker.readyToGo
                              ? 'var(--primary)'
                              : 'var(--danger)',
                          }"
                          >{{
                            worker.readyToGo == true
                              ? "Ready to go"
                              : "Not Ready"
                          }}</span
                        >
                      </p>
                    </div>
                    <div class="column is-3">
                      <h1>Anomalies</h1>
                      <p class="is-bold">
                        Mandatory : -
                        {{
                          worker.profileStat.anomalieStats
                            ? worker.profileStat.anomalieStats
                                .required_not_uploaded
                            : "0"
                        }}
                      </p>
                      <p class="is-bold">
                        Optional : -
                        {{
                          worker.profileStat.anomalieStats
                            ? worker.profileStat.anomalieStats
                                .optional_not_uploaded
                            : "0"
                        }}
                      </p>
                      <p class="is-bold">
                        Expired : -
                        {{
                          worker.profileStat.anomalieStats
                            ? worker.profileStat.anomalieStats.expired
                            : "0"
                        }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Pending for checks  -->
          <div
            v-if="currentTab == 'waitingRAMS'"
            class="modal-form columns is-multiline cu-all-input"
          >
            <div class="field column is-12 mb-0" id="rota-celender-two">
              <div class="columns is-multiline mb-3 cu-all-input">
                <div class="column is-12">
                  <h1>Pending for checks</h1>
                  <div class="column is-12">
                    <VField>
                      <VControl>
                        <VTextarea
                          v-model="textarea"
                          rows="4"
                          placeholder="Enter note..."
                        />
                      </VControl>
                    </VField>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ready / ready to start -->
    <div
      v-if="parentActiveTab == 'readyToStart'"
      class="modal-form columns is-multiline cu-all-input mt-6"
    >
      <div class="field column is-12 mb-0" id="rota-celender-two">
        <div class="columns is-multiline mb-3 cu-all-input">
          <div class="column is-12">
            <div
              class="field columns is-multiline mb-0 cu-all-input space-between lengthy-smart-search-dropdown"
            >
              <div class="field column is-12 mb-0 is-relative">
                <div class="mb-2 columns is-multiline">
                  <div class="field column is-6 mb-0">
                    <h1
                      v-if="jobWorkersWithAnomalies.length"
                      class="is-md-bold mb-2"
                    >
                      {{ jobWorkersWithAnomalies.length }} - Workers are
                      assigned and ready to start the job.
                    </h1>
                    <h1 class="is-md-bold mb-2" v-else>
                      No Assigned Worker Assigned yet
                    </h1>
                    <div
                      v-for="worker in jobWorkersWithAnomalies"
                      :key="worker.id"
                      class="card px-4 py-3 mb-2 rounded"
                    >
                      <div class="mb-2 columns is-multiline">
                        <div class="column is-6 is-flex">
                          <VAvatar
                            :picture="
                              worker.profileImageURL
                                ? worker.profileImageURL
                                : '/demo/avatars/11.jpg'
                            "
                            size="large"
                          />
                          <div class="info ml-3">
                            <p class="is-md-bold">
                              {{ worker.firstName ? worker.firstName : "---" }}
                              {{ worker.lastName ? worker.lastName : "---" }}
                            </p>
                            <p class="is-bold cu-align-center">
                              <i
                                class="iconify mr-1"
                                data-icon="feather:mail"
                                aria-hidden="true"
                              ></i>
                              {{
                                worker.emailAddress
                                  ? worker.emailAddress
                                  : "--- --- "
                              }}
                            </p>
                            <p class="is-bold cu-align-center">
                              <i
                                class="lnil lnil-map-marker mr-1"
                                aria-hidden="true"
                              ></i>
                              {{
                                worker.postCode ? worker.postCode : "--- --- "
                              }}
                            </p>
                          </div>
                        </div>
                        <div class="column is-3">
                          <h1>Profile Completion</h1>
                          <p class="is-bold">
                            <span style="color: var(--primary)"
                              >{{ worker.profileStat.percentage }}%</span
                            >
                            Complete
                          </p>
                          <p class="is-bold">
                            <span
                              :style="{
                                color: worker.readyToGo
                                  ? 'var(--primary)'
                                  : 'var(--danger)',
                              }"
                              >{{
                                worker.readyToGo ? "Ready to go" : "Not Ready"
                              }}</span
                            >
                          </p>
                        </div>
                        <div class="column is-3">
                          <h1>Anomalies</h1>
                          <p class="is-bold">
                            Mandatory : -
                            {{
                              worker.profileStat.anomalieStats
                                ? worker.profileStat.anomalieStats
                                    .required_not_uploaded
                                : "0"
                            }}
                          </p>
                          <p class="is-bold">
                            Optional : -
                            {{
                              worker.profileStat.anomalieStats
                                ? worker.profileStat.anomalieStats
                                    .optional_not_uploaded
                                : "0"
                            }}
                          </p>
                          <p class="is-bold">
                            Expired : -
                            {{
                              worker.profileStat.anomalieStats
                                ? worker.profileStat.anomalieStats.expired
                                : "0"
                            }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- inprogress -->
    <div
      v-if="parentActiveTab == 'started'"
      class="modal-form columns is-multiline cu-all-input mt-0"
    >
      <div class="field column is-12 mb-0" id="rota-celender-two">
        <div class="columns is-multiline mb-3 cu-all-input">
          <div class="column is-12 mt-5">
            <VButtons>
              <VButton
                rounded
                @click="
                  () => {
                    progressView = 'rotaView';
                  }
                "
                :color="progressView === 'rotaView' ? 'primary' : ''"
                >Schedule
              </VButton>
              <VButton
                rounded
                @click="
                  () => {
                    progressView = 'timesheet';
                  }
                "
                :color="progressView === 'timesheet' ? 'primary' : ''"
                >Site visit logs
              </VButton>
            </VButtons>
          </div>
          <div class="column is-12">
            <div v-if="progressView == 'rotaView'">
              <JobRota :id="route.params.id" />
            </div>
            <div v-if="progressView == 'timesheet'">
              <JobTImesheet :id="route.params.id" />
            </div>
            <!-- <TimeSheetComponent timesheetId="154" /> -->
          </div>
        </div>
      </div>
    </div>

    <!-- completed -->
    <div
      v-if="parentActiveTab == 'completed'"
      class="modal-form columns is-multiline cu-all-input mt-5"
    >
      <div class="field column is-12 mb-0" id="rota-celender-two">
        <div class="columns is-multiline mb-3 cu-all-input">
          <div class="column is-12">
            <div class="field columns is-multiline mb-0 cu-all-input">
              <div class="field column is-5 mb-0 is-relative">
                <div class="mb-2 columns is-multiline">
                  <div class="field column is-6 mb-0">
                    <h1 class="is-md-bold mb-2">
                      Please verify wether the following steps have been
                      successfully executed.
                    </h1>

                    <VField>
                      <VControl raw subcontrol>
                        <VCheckbox
                          v-model="option3"
                          label="PM assigned ?"
                          color="info"
                        />
                      </VControl>
                      <VControl raw subcontrol>
                        <VCheckbox
                          v-model="option2"
                          label="Checks completed (RAMS/CPP) ?"
                          color="primary"
                        />
                      </VControl>
                      <VControl raw subcontrol>
                        <VCheckbox
                          v-model="option4"
                          label="Workers compliance checked ?"
                          color="success"
                        />
                      </VControl>
                      <VControl raw subcontrol>
                        <VCheckbox
                          v-model="option1"
                          color="info"
                          label="Job completed successfully ?"
                        />
                      </VControl>
                    </VField>
                    <VButton
                      @click="markJobDone"
                      style="float: right"
                      elevated
                      color="warning"
                      >Complete Job</VButton
                    >
                  </div>
                </div>
              </div>
              <div class="field column is-3 mb-0">
                <ApexChart
                  id="radial-circle"
                  class="circle-chart-wrapper"
                  :height="optionsCircle.chart.height"
                  :type="optionsCircle.chart.type"
                  :series="[jobProgress]"
                  :options="optionsCircle"
                />
              </div>
              <div class="field column is-12 mb-0 is-relative">
                <!-- <VField>
                  <VControl>
                    <VTextarea
                      v-model="textarea"
                      rows="4"
                      placeholder="A longer note..."
                    />
                  </VControl>
                </VField> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <AddJobsModal
      v-if="EditJobModalOpen"
      :jobId="selectedJobId"
      :AddJobModalOpen="EditJobModalOpen"
      @update:modalHandler="EditJobModalOpen = false"
      @update:on-success="getJobById"
    />
    <SiteDetailModal
      v-if="openAddSiteModal"
      :contractId="jobData.siteInfo.contract"
      @update:modalHandler="
        () => {
          openAddSiteModal = !openAddSiteModal;
        }
      "
      :AddSiteModalOpen="openAddSiteModal"
      @update:OnSuccess="getJobById"
    />
  </div>
</template>

<style lang="scss" scoped>
.parentActiveState {
  color: var(--primary);
  font-weight: 600;
}
.parentActiveState:focus {
  color: var(--primary);
}
.parentActiveTab {
  border-bottom: 3px solid var(--primary);
}
.parentActiveTab:hover {
  border-bottom: 3px solid var(--primary);
}

.parentActiveTab:focus {
  border-bottom: 3px solid var(--primary);
}

body {
  margin: 0;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.partnerLogo {
  width: 120px;
  height: 120px;

  img {
    width: 100%;
    height: 90%;
  }
}

.cus-section-heading {
  border-left: 4px solid var(--success);
  padding-left: 8px;
  color: var(--light-text);
  font-weight: 600;
  font-size: 16px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

td {
  padding: 10px;
  text-align: start;
  border: none;
  /* Remove cell borders */
}

.cell-content {
  display: flex;
  flex-direction: column;
  align-items: start;
  line-height: 1.2; // Adjusted line height for better readability
}

.heading {
  font-weight: bold;
  font-size: 12px;
}

.content {
  margin-top: 5px;
}

/*table style  */
.is-navbar {
  .datatable-toolbar {
    padding-top: 30px;
  }
}

// --------------------------MS_Me----------------------->
.sup-profile {
  width: full;
  padding: 2rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  background-color: white;
}

.left-profile-wrapper {
  display: flex;
  align-items: center;
  gap: 2rem;

  .left-profile-image {
    width: 9rem;
    height: 9rem;
    border-radius: 3.5rem;
    object-fit: fill;
    overflow: hidden;
  }
}

.Brooks-Brothers {
  height: 46px;
  font-family: GoogleSans;
  font-size: 36px;
  color: #1a1a1a;
}

.left-profileContent span {
  font-family: sans-serif;
  font-size: 18px;
  color: #333;
}

.brooksbrothersgmail {
  font-family: GoogleSans;
  font-size: 18px;
  color: #333;
}

.editbtn {
  width: 225px;
  height: 48px;
  background-color: #e3f3f3;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #179e9b;
  gap: 1rem;
  border-radius: 20px;
}

.editbtn:hover {
  background: rgb(212, 245, 245);
}

// Service-Partner-01
.servicePartner1 {
  width: full;
  min-height: 70vh;
  background: #179e9b;
  display: flex;
}

.partnerInfo1 {
  display: flex;
  align-items: center;
  gap: 4rem;
}

// <--------------Responsiveness---------------->
@media (max-width: 725px) {
  .sup-profile {
    display: flex;
    align-items: start;
    flex-direction: column;
    gap: 2rem;
  }

  .Brooks-Brothers {
    width: 263px;
    height: 46px;
    font-family: GoogleSans;
    font-size: 36px;
    color: #1a1a1a;
  }
}

@media (max-width: 625px) {
  .left-profile-image {
    width: 7rem !important;
    height: 7rem !important;
    border-radius: 2rem !important;
  }

  .Brooks-Brothers {
    height: 46px;
    font-family: GoogleSans;
    font-size: 24px;
    color: #1a1a1a;
  }

  .left-profileContent span {
    font-size: 15px;
  }

  .partnerInfo1 {
    display: flex;
    align-items: start;
    gap: 2rem;
    flex-direction: column;
  }
}
</style>
