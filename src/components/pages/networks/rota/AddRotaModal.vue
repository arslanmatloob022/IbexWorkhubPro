<script setup lang="ts">
import { watchEffect } from "vue";
import { start } from "nprogress";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { useCompany } from "/@src/stores/company";
import FullCalendar from "@fullcalendar/vue3";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import { M } from "@fullcalendar/resource/internal-common";
import { info } from "console";
const company = useCompany();
const Loading = ref(false);
const notyf = useNotyf();
const api = useApi();
const addjobs = ref(false);
const selectWorkerOptions = ref("");
const selectSiteSlotValue = ref("");
const selectJobSlotValue = ref("");
let selectSiteSlotOptions = ref<any[]>([]);
const selectCustomerSlotValue = ref("");
const selectWorkerSlotValue = ref("");
const siteAllJobs = ref([]);
const rotaJobs = ref<any>([]);
let selectSlotOptions = ref<any[]>([]);
let selectWorkerSlotOptions = ref<any[]>([]);
let selectJobsSlotOptions = ref<any[]>([]);

const workers = ref([
  {
    id: 0,
    firstName: "",
    lastName: "",
    profileImageURL: "",
  },
]);

const data = [
  {
    title: "Additional Information",
    content: "Add additional information about rota, rate or worker",
  },
];

const jobsData = ref([
  {
    id: 0,
    jobName: "",
    description: "",
    shift: "",
    startDate: "",
    endDate: "",
    startTime: "08:00:00",
    endTime: "16:00:00",
    hourlyRate: 0,
    overtimeRate: 0,
    isActive: false,
    jobType: "",
    color: "",
    isApproval: true,
    createdAt: "",
    updatedAt: null,
    workingDays: [],
    contractSite: 0,
  },
]);
const jobData = ref({
  id: 0,
  jobName: "",
  start: "",
  end: "",
});
const rotaData = ref({
  dates: [],
  id: 0,
  start: "08:00",
  end: "16:00",
  hours: 0,
  shift: "",
  hourlyRate: 0,
  notes: "",
  createdBy: "",
  UpdatedAt: "",
  updatedBy: "",
  company: "",
  site: "",
  worker: "",
  customerCompany: "",
  job: "",
  jobsList: [],
});

const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: null): void;
  (e: "remove-date", value: number | null): void;
}>();

const removeDate = (index) => {
  emit("remove-date", index);
};

const closeModalHandler = () => {
  emit("update:modalHandler", false);
};

const props = defineProps<{
  AddRotaModalOpen?: boolean;
  selectedDatesArray: {
    type: Array;
    default: () => [];
  };
  workerId: {
    type: number;
    default: 0;
  };
}>();

const removeBackgroundJob = () => {
  rotaJobs.value = rotaJobs.value.filter(
    (item) => !item.hasOwnProperty("display")
  );
};

const renderCalender = () => {
  removeBackgroundJob();
  rotaJobs.value.push({
    start: `2024-04-23T${rotaData.value.start}`,
    end: `2024-04-23T${rotaData.value.end}`,
    display: "background",
  });

  calendarOptions.value.resources = rotaJobs.value;
  calendarOptions.value.events = rotaJobs.value;
};

const calendarOptions = ref<any>({
  plugins: [resourceTimelinePlugin],
  schedulerLicenseKey: "0965592368-fcs-1694657447",
  initialView: "resourceTimelineDay",
  height: "auto",
  resourceAreaWidth: "10%",
  selectable: true,
  now: "2024-04-23",
  headerToolbar: {
    left: "",
    center: "",
    right: "",
  },
  droppable: true,
  editable: true,
  views: {
    resourceTimelineDay: {
      type: "timeline",
      duration: { days: 2 },
      slotDuration: "00:30:00", // Set the slot duration as needed
      slotLabelFormat: { hour: "2-digit", minute: "2-digit", hour12: false },
    },
  },
  resourceAreaHeaderContent: "Jobs",
  // eventClick: (info) => {
  //   // console.log("clickin on", info.event.id);
  // },
});

const addRota = async () => {
  // removeBackgroundJob();
  Loading.value = true;
  try {
    const response = await api.post("/v3/api/rota/create/", {
      dates: JSON.stringify(props.selectedDatesArray),
      start: rotaData.value.start,
      end: rotaData.value.end,
      shift: rotaData.value.shift,
      hourlyRate: rotaData.value.hourlyRate,
      notes: rotaData.value.notes,
      createdBy: rotaData.value.createdBy,
      UpdatedAt: rotaData.value.UpdatedAt,
      updatedBy: rotaData.value.updatedBy,
      company: company.loggedCompany.id,
      site: selectSiteSlotValue.value,
      worker: selectWorkerOptions.value,
      customerCompany: selectCustomerSlotValue.value,
      job: rotaData.value.job,
      jobsList: JSON.stringify(rotaJobs.value),
    });
    emit("update:OnSuccess", null);
    notyf.success("Rota Added Successfuly");
    Loading.value = false;
    closeModalHandler();
  } catch (err) {
    console.log(err);
    notyf.error(
      "You're assigning the same worker on the same date please try different."
    );
    Loading.value = false;
  }
};

const getSitesOfCustomer = async () => {
  try {
    const resp = await api.get(
      `/v3/api/site/customer-company/${selectCustomerSlotValue.value}/`
    );
    selectSiteSlotOptions.value = resp.data.map((site) => {
      return {
        value: site.id.toString(),
        name: `${site.name} - ${site.contractInfo.name}`,
      };
    });
    if (resp.data) {
      selectSiteSlotValue.value = resp.data[0].id;
    }
  } catch (err) {
    console.log(err);
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
    selectWorkerOptions.value = props.workerId;
  } catch {
    notyf.error("Invalid data");
  } finally {
    Loading.value = false;
  }
};

const getAllJobs = async () => {
  try {
    const response = await api.get(
      `/v3/api/jobs/site/${selectSiteSlotValue.value}/`,
      {}
    );
    jobsData.value = response.data;
    siteAllJobs.value = response.data.jobs;
    console.log("jobs", siteAllJobs.value);
    selectJobsSlotOptions.value = response.data.jobs.map((job) => {
      return {
        value: job.id.toString(),
        name: job.jobName,
      };
    });
  } catch (err) {}
};

const addJob = () => {
  jobData.value.start = `2024-04-23T${jobData.value.start}`;
  jobData.value.end = `2024-04-23T${jobData.value.end}`;
  jobData.value.resourceId = jobData.value.id;
  const newJob = { ...jobData.value };
  rotaJobs.value.push(newJob);
  renderCalender();
  jobData.value.id = 0;
  jobData.value.end = "";
  jobData.value.start = "";
  jobData.value.jobName = "";
  notyf.success("Job Added");
};

// HandleRemoveJob
const handleRemoveJob = (id: any) => {
  id = parseInt(id);
  rotaJobs.value = rotaJobs.value.filter((job: any) => job.id !== id);
  renderCalender();
};

watch(selectJobSlotValue, (newValue, oldValue) => {
  console.log("wactch id", selectJobSlotValue);
  const selectedJob = siteAllJobs.value.find((job) => job.id == newValue);
  if (selectedJob) {
    rotaJobs.value.push({
      id: selectedJob.id,
      jobName: selectedJob.jobName,
      start: `2024-04-23T${selectedJob.startTime}`,
      end: `2024-04-23T${selectedJob.endTime}`,
      resourceId: selectedJob.id,
      title: selectedJob.jobName,
    });
    console.log("selected job", selectedJob);
    renderCalender();
  }
});

watch(selectCustomerSlotValue, (newValue, oldValue) => {
  getSitesOfCustomer(newValue);
});

watch(selectSiteSlotValue, (newValue, oldValue) => {
  getAllJobs(newValue);
});

watch(
  [() => rotaData.value.start, () => rotaData.value.end],
  ([newStart, newEnd], [oldStart, oldEnd]) => {
    renderCalender();
  }
);

onMounted(() => {
  getWorkers();
  renderCalender();
  getAllCompanies();
  if (props.workerId) {
    selectWorkerOptions.value = props.workerId.toString();
  }
});
</script>

<template>
  <VModal
    is="form"
    size="xl"
    :open="props.AddRotaModalOpen"
    title="Add Rota"
    actions="right"
    @submit.prevent="addRota"
    @close="closeModalHandler"
  >
    <template #content>
      <div class="modal-form columns is-multiline" id="addRota">
        <div class="field column is-12 mb-0">
          <div class="columns is-multiline mb-3">
            <div class="field is-flex column is-12 mb-0">
              <h1>Selected dates:</h1>
              <VControl class="is-flex">
                <VTags
                  addons
                  v-for="(date, index) in props.selectedDatesArray"
                  :key="index"
                >
                  <VTag
                    light
                    class="ml-2"
                    :label="date"
                    color="primary"
                    outlined
                    rounded
                  />
                  <VTag rounded outlined remove @click="removeDate(index)" />
                </VTags>
              </VControl>
            </div>
            <div class="field column is-6 mb-0">
              <label>Select customer company*</label>
              <VField v-slot="{ id }" class="pl-2">
                <VControl>
                  <Multiselect
                    required
                    v-model="selectCustomerSlotValue"
                    :attrs="{ id }"
                    placeholder="Select customer company"
                    label="name"
                    :options="selectSlotOptions"
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
            <div class="field column is-6 mb-0">
              <label>Select Site *</label>
              <VField v-slot="{ id }" class="pl-2">
                <VControl>
                  <Multiselect
                    required
                    v-model="selectSiteSlotValue"
                    :attrs="{ id }"
                    placeholder="Select a site"
                    label="name"
                    :options="selectSiteSlotOptions"
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
            <div class="field column is-6 mb-0">
              <label class="mb-2">Select Worker *</label>
              <VField v-slot="{ id }" class="">
                <VControl>
                  <Multiselect
                    required
                    v-model="selectWorkerOptions"
                    :attrs="{ id }"
                    placeholder="Select worker"
                    label="name"
                    :options="selectWorkerSlotOptions"
                    :searchable="true"
                    track-by="name"
                    :height="400"
                  >
                    <template #singlelabel="{ value }">
                      <div class="multiselect-single-label">
                        <img
                          style="width: 24px; height: 24px"
                          class="select-label-icon mr-2"
                          :src="value.icon"
                          alt=""
                        />
                        {{ value.name }}
                      </div>
                    </template>

                    <template #option="{ option }">
                      <img
                        style="width: 30px; padding-right: 6px"
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

            <div class="field column is-3 mb-0">
              <VField>
                <VLabel>Start Time *</VLabel>
                <VControl>
                  <VInput required v-model="rotaData.start" type="time" />
                </VControl>
              </VField>
            </div>

            <div class="field column is-3 mb-0">
              <VField>
                <VLabel>End Time *</VLabel>
                <VControl>
                  <VInput required v-model="rotaData.end" type="time" />
                </VControl>
              </VField>
            </div>
            <div class="field column is-12 mb-0">
              <label>Select Job </label>
              <VField v-slot="{ id }" class="pl-2">
                <VControl>
                  <Multiselect
                    v-model="selectJobSlotValue"
                    :attrs="{ id }"
                    placeholder="Select a job"
                    label="name"
                    :options="selectJobsSlotOptions"
                    :searchable="true"
                    track-by="name"
                    :height="100"
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
            <div class="column is-12 mb-0">
              <VField>
                <VControl>
                  <VSwitchBlock v-model="addjobs" label="Create new jobs" />
                </VControl>
              </VField>
            </div>
            <div v-if="addjobs" class="field column is-6 mb-0">
              <VField>
                <VLabel>Job Name</VLabel>
                <VControl>
                  <VInput
                    v-model="jobData.jobName"
                    type="text"
                    placeholder="Job name"
                  />
                </VControl>
              </VField>
            </div>
            <div v-if="addjobs" class="field column is-6 mb-0">
              <VField>
                <VLabel>Job Id</VLabel>
                <VControl>
                  <VInput
                    v-model="jobData.id"
                    type="text"
                    placeholder="Job id"
                  />
                </VControl>
              </VField>
            </div>
            <div v-if="addjobs" class="field column is-6 mb-0">
              <VField>
                <VLabel>Start Time *</VLabel>
                <VControl>
                  <VInput v-model="jobData.start" type="time" />
                </VControl>
              </VField>
            </div>

            <div v-if="addjobs" class="field column is-6 mb-0">
              <VField>
                <VLabel>End Time *</VLabel>
                <VControl>
                  <VInput v-model="jobData.end" type="time" />
                </VControl>
              </VField>
            </div>
            <div
              v-if="addjobs"
              class="field column is-12 mb-0"
              style="
                width: 100%;
                display: flex;
                justify-content: flex-end;
                float: right;
              "
            >
              <VButton color="primary" @click="addJob" elevated rounded light>
                Add
              </VButton>
            </div>

            <div class="column is-12">
              <FullCalendar :options="calendarOptions">
                <template v-slot:eventContent="arg">
                  <div
                    class="p-2 is-flex"
                    style="position: relative; width: 100%"
                  >
                    <span
                      style="
                        position: absolute;
                        top: 0.7rem;
                        right: 1rem;
                        z-index: 9999909;
                      "
                      v-if="arg.event.extendedProps.jobName"
                      @click="() => handleRemoveJob(arg.event.id)"
                      class="close-icon"
                    >
                      <i
                        class="iconify close"
                        data-icon="feather:x-circle"
                        aria-hidden="true"
                        style="font-size: 1.5rem"
                      ></i>
                    </span>
                    <p
                      style="
                        font-weight: 600;
                        margin-bottom: 0px;
                        padding-left: 10px;
                        color: white;
                        display: flex;
                        align-items: center;
                      "
                    ></p>
                    <VTag light color="info" class="mr-5" v-if="arg.event.id">
                      <span
                        class="item-name dark-inverted"
                        style="font-weight: 500"
                        >Job-00{{ arg.event.id }}</span
                      >
                    </VTag>
                    <p
                      style="
                        font-weight: 500;
                        margin-bottom: 0px;
                        padding-left: 5px;
                        color: white;
                      "
                    >
                      {{ arg.event.extendedProps.jobName }}
                    </p>
                  </div>
                </template>
              </FullCalendar>
            </div>
          </div>

          <VCollapse :items="data" with-chevron style="border-radius: 14px">
            <template #collapse-item-head="item">
              <div class="head-info">
                <div class="head-progress"></div>
              </div>
            </template>

            <template #collapse-item-content="item">
              <div class="body-inner-content">
                <div class="field columns is-multiline mb-0">
                  <div class="column is-12">
                    <div class="columns is-multiline space-around">
                      <div class="field column is-5 mb-0">
                        <label>Charge Rate</label>
                        <div class="control">
                          <input
                            type="number"
                            name="rate"
                            v-model="rotaData.hourlyRate"
                            class="input is-primary-focus"
                            placeholder="Rate per hour"
                          />
                        </div>
                      </div>
                      <div class="field column is-5 mb-0">
                        <label>Charge Hours</label>
                        <div class="control">
                          <input
                            type="number"
                            name="rate"
                            v-model="rotaData.hours"
                            class="input is-primary-focus"
                            placeholder="Rate per hour"
                          />
                        </div>
                      </div>
                      <div class="field column is-11 mb-0">
                        <label>Notes</label>
                        <div class="control">
                          <input
                            type="text"
                            name="note"
                            v-model="rotaData.notes"
                            class="input is-primary-focus"
                            placeholder="Enter Note"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </VCollapse>
        </div>
      </div>
    </template>
    <template #action>
      <VButton type="submit" color="primary" :loading="Loading" raised
        >Save</VButton
      >
    </template>
  </VModal>
</template>

<style lang="scss">
.close {
  color: #fff;
  z-index: 99999;
}
.close:hover {
  color: red;
}

#addRota {
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
