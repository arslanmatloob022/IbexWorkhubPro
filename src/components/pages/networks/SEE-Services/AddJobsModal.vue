<script setup lang="ts">
import axios from "axios";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { useCompany } from "/@src/stores/company";

const company = useCompany();
const Loading = ref(false);
const notyf = useNotyf();
const api = useApi();
const selectSiteSlotValue = ref("");
const cureentSelectedSite = ref({});
const currentselectedWorker = ref({});
const companyAllSites = ref([]);
const selectWorkerSlotValue = ref("");
const siteChange = ref(false);
const currentJobId = ref(0);
const allWorkers = ref([]);
const allManagers = ref([]);
const selectedWorkers = ref([]);
let selectManagersSlotOptions = ref<any[]>([]);
const selectManagerSlotValue = ref("");
const data = [
  {
    title: "Additional Information",
    content: "Add additional information about job",
  },
];

const jobData = ref({
  externalId: "",
  title: "",
  company: "",
  description: "",
  manager: 0,
  isWorkWithContractor: true,
  file: File as Null | "",
});

const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
  (e: "update:onSuccess", value: null): void;
}>();

const closeModalHandler = () => {
  emit("update:modalHandler", false);
};
const props = defineProps<{
  jobId: {
    type: number;
    default: 0;
  };
  AddJobModalOpen?: boolean;
}>();

const addJob = () => {
  if (props.jobId) {
    updateJob();
  } else {
    AddNewJob();
  }
};

const AddNewJob = async () => {
  Loading.value = true;
  try {
    if (selectManagerSlotValue.value) {
      jobData.value.company = company.loggedCompany.id;
      const response = await api.post(`/v3/api/vixen-job/`, jobData.value);

      notyf.success("Job Added Successfuly");
      closeModalHandler();
      emit("update:onSuccess", null);
    } else {
      notyf.error("Please select a Manager");
    }
    Loading.value = false;
  } catch (err) {
    console.log(err);
    notyf.error("Error while adding a job");
    Loading.value = false;
  }
};

const updateJob = async () => {
  Loading.value = true;
  try {
    const response = await api.patch(
      `/v3/api/vixen-job/${props.jobId}/`,
      jobData.value
    );
    notyf.success("Job Added Successfuly");
    closeModalHandler();
    emit("update:onSuccess", null);
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
    allManagers.value = response.data;
    // if (response.data && !props.jobId) {
    //   selectManagerSlotValue.value = response.data[0].id;
    // }
  } catch {
    notyf.error("Invalid data");
  } finally {
    Loading.value = false;
  }
};

const getJobById = async () => {
  try {
    Loading.value = true;
    const response = await api.get(`/v3/api/vixen-job/${props.jobId}/`);
    jobData.value = response.data;
    if (response.data.manager && props.jobId) {
      selectManagerSlotValue.value = response.data.manager;
      console.log("current manager", selectManagerSlotValue.value);
    }
    Loading.value = false;
  } catch (err) {
    console.log(err);
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
    siteChange.value = true;
  }
});

watch(selectWorkerSlotValue, (newValue, oldValue) => {
  siteChange.value = false;
  const selectedWorker = allWorkers.value.find((site) => site.id == newValue);
  if (selectedWorker) {
    selectedWorkers.value.push(selectedWorker);
    currentselectedWorker.value = selectedWorker;
    siteChange.value = true;
  }
});

onMounted(() => {
  getCurrentDate();
  getManagers();
  if (props.jobId) {
    getJobById();
  }
});
</script>

<template>
  <VModal
    is="form"
    size="large"
    :open="props.AddJobModalOpen"
    title="Create Job"
    actions="right"
    @close="closeModalHandler"
  >
    <template #content>
      <div class="modal-form columns is-multiline cu-all-input" id="addJob">
        <div class="field column is-12 mb-0" id="rota-celender-two">
          <div class="columns is-multiline mb-3 cu-all-input">
            <div class="column is-12">
              <div class="columns is-multiline cu-all-input">
                <div class="column is-6">
                  <VField>
                    <VLabel>Name</VLabel>
                    <VControl>
                      <VInput
                        v-model="jobData.title"
                        type="text"
                        placeholder="Title"
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-6">
                  <VField>
                    <VLabel>External Id (Optional)</VLabel>
                    <VControl>
                      <VInput
                        v-model="jobData.externalId"
                        type="text"
                        placeholder="External id"
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-12 smart-search-dropdown">
                  <VField v-slot="{ id }">
                    <VLabel>Select Manager (PM)</VLabel>
                    <VControl class="placement-wrapper">
                      <Multiselect
                        class="multi-select"
                        v-model="selectManagerSlotValue"
                        :attrs="{ id }"
                        placeholder="Select a manager"
                        label="name"
                        :options="selectManagersSlotOptions"
                        :searchable="true"
                        track-by="name"
                        :height="40"
                        multiselectable
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
                          <div class="options-div">
                            <div class="option-cdiv">
                              <img
                                class="select-option-icon mr-2 option-image"
                                :src="option.icon"
                                alt=""
                              />
                              <div class="option-ddiv">
                                <span class="option-span">{{
                                  option.name
                                }}</span>
                                <span class="mail-span"
                                  ><span class="email-span">Email:</span>
                                  {{ option.email }}</span
                                >
                              </div>
                            </div>
                          </div>
                        </template>
                      </Multiselect>
                    </VControl>
                  </VField>
                </div>
                <div class="column is-6">
                  <VField horizontal>
                    <VControl>
                      <VSwitchSegment
                        v-model="jobData.isWorkWithContractor"
                        label-true="Work with contractor"
                        label-false="Self Serve"
                        color="primary"
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-6">
                  <VButtons>
                    <VButton
                      v-if="jobData.isWorkWithContractor"
                      light
                      @click="sendRAMSemail"
                      rounded
                      color="info"
                      ><i class="lnil lnil-envelope mr-2" aria-hidden="true"></i
                      >Initiate RAMS</VButton
                    >
                    <VButton v-else light rounded color="info">
                      <i class="lnil lnil-envelope mr-2" aria-hidden="true"></i
                      >Initiate CPP</VButton
                    >
                  </VButtons>
                </div>
                <VCollapse
                  :items="data"
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
                            <div class="field column is-5 mb-0">
                              <label>Upload File</label>
                              <VField grouped>
                                <VControl>
                                  <div class="file has-name">
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
                                      <span class="file-name light-text">
                                        filename...
                                      </span>
                                    </label>
                                  </div>
                                </VControl>
                              </VField>
                            </div>

                            <div class="" style="width: 97%">
                              <VField>
                                <VLabel>Description</VLabel>
                                <VControl>
                                  <VTextarea
                                    v-model="jobData.description"
                                    type="text"
                                    placeholder="Job description"
                                  />
                                </VControl>
                              </VField>
                            </div>
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
      </div>
      <VButton
        style="float: right"
        class="mr-5"
        @click="addJob"
        :loading="Loading"
        rounded
        color="primary"
      >
        {{ $props.jobId ? "Update Job" : "Create Job" }}
      </VButton>
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
        @click="addJob"
        color="primary"
        style="display: none"
        :loading="Loading"
        raised
        >Create job
      </VButton>
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
