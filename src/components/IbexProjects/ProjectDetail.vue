<script setup lang="ts">
import ApexChart from "vue3-apexcharts";

import type { VAvatarProps } from "/@src/components/base/avatar/VAvatar.vue";
import { useTeamEfficiencyChart } from "/@src/data/dashboards/personal-v2/teamEfficiencyChart";
import { popovers } from "/@src/data/users/userPopovers";
import * as usersData from "/@src/data/dashboards/personal-v2/users";
import { useNotyf } from "/@src/composable/useNotyf";
import { useApi } from "/@src/composable/useAPI";
import { convertToFormData } from "/@src/composable/useSupportElement";
import { useThemeColors } from "/@src/composable/useThemeColors";

const themeColors = useThemeColors();
const api = useApi();
const notyf = useNotyf();
const route = useRoute();
const router = useRouter();
const tab = ref("detail");

const Loading = ref(false);
const showAddClient = ref(false);
const isTaskFormOpen = ref(false);
const showAddContractor = ref(false);
const isProjectFormOpen = ref(false);
const loading = ref(false);
const clientsList = ref([]);
const contarctorList = ref([]);
const selectedManagers = ref([]);
const deleteTaskId = ref(0);
const projectCompletedTasks = ref<any>(0);
const projectActiveTasks = ref<any>(0);
const editTaskId = ref("");
const currentProjectId = ref("");
const sheetNameDeleteTobe = ref("");
const preview = ref("");
const image = ref("");
const projectId = ref("");
const editProjectId = ref("");
const workersData = ref([{ id: 0, username: "", email: "", phoneNumber: "" }]);
const Taskstatus = ref([
  { value: "active", name: "Active" },
  { value: "pending", name: "Pre Construction" },
  { value: "completed", name: "Completed" },
  { value: "cancelled", name: "cancelled" },
]);
const projectTodaysTasks = ref<any>([]);
const projectData = ref<any>({
  id: 0,
  title: "",
  created: "",
  startDate: "",
  color: "",
  endDate: "",
  description: "",
  image: "",
  is_active: null,
  status: "",
  address: "",
  total_tasks: 0,
  client: 0,
  contractor: 0,
  clientInfo: {
    id: 0,
    username: "",
    email: "",
    password: "",
    avatar: null as File | String | null,
  },
  uploaded_files: <any>[],
  contractorInfo: {
    id: 0,
    username: "",
    email: "",
    password: "",
    avatar: null as File | String | null,
  },
  managers: [
    {
      id: 0,
      username: "",
      avatar: null,
      email: "",
      role: "",
    },
  ],
});

const taskData = ref({
  title: "",
  description: "",
  startDate: "",
  endDate: "",
  status: "",
  project: route.params.id,
  workers: [],
});

const projectTasks = ref([
  {
    id: 0,
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    project: 0,
    status: "",
    worker: [{ id: 0, username: "", email: "", role: "", avatar: "" }],
  },
]);

const deleteAlertData = ref({
  icon: "fa fa-warning",
  alertTitle: "Delete Project Permanently?",
  alertDescription:
    "After deleting this Project you will not be able to recover it",
});

const completionChart = shallowRef({
  height: 180,
  type: "radialBar",
  series: [],
  title: {
    text: "",
  },
  chart: {
    toolbar: {
      show: false,
    },
  },
  colors: [themeColors.primary, themeColors.purple, themeColors.orange],
  plotOptions: {
    radialBar: {
      hollow: {
        size: "55%",
      },
    },
  },
  labels: ["Completion"],
});

const completionOptions = shallowRef({
  series: [
    {
      name: "Pending",
      data: [31, 40, 28, 51, 42, 109, 100],
    },
    {
      name: "Completed",
      data: [11, 32, 45, 32, 34, 52, 41],
    },
    {
      name: "Blocked",
      data: [78, 53, 36, 10, 14, 5, 2],
    },
  ],
  chart: {
    height: 295,
    type: "area",
    toolbar: {
      show: false,
    },
  },
  colors: [themeColors.accent, themeColors.info, themeColors.primary],
  legend: {
    position: "top",
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    width: [2, 3, 5],
    curve: "smooth",
  },
  xaxis: {
    type: "date",
    categories: [
      "2020-09-19",
      "2020-09-20",
      "2020-09-21",
      "2020-09-22",
      "2020-09-23",
      "2020-09-24",
      "2020-09-25",
    ],
  },
  tooltip: {
    x: {
      format: "dd/MM/yy HH:mm",
    },
  },
});

const toggleAddContractor = () => {
  showAddContractor.value = !showAddContractor.value;
};

const toggleAddClient = () => {
  showAddClient.value = !showAddClient.value;
};

const openDeleteAlert = (id: any) => {
  projectId.value = id;
};

const deleteProject = () => {
  try {
    loading.value = true;
    const response = api.delete(`/api/project/${projectId.value}/`);
    notyf.green("Selected project deleted successfully!");
    router.push("/sidebar/dashboard/projects");
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const totalActiveTasks = ref(0);
const getActiveTasks = () => {
  let activeTasks = projectTasks.value.filter(
    (tasks) => tasks.status == "active"
  );
  totalActiveTasks.value = activeTasks.length;
};

const closeTheModals = () => {
  taskData.value = {
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    workers: [],
    status: "",
  };
};
const getProject = async () => {
  try {
    Loading.value = true;
    const resp = await api.get(`/api/project/${projectId.value}/`);
    projectData.value = resp.data;
    let completion = resp.data.percentage.toFixed(2);
    completionChart.value.series.push(completion);
    preview.value = resp.data.image;

    getProjectTasks();
  } catch (err) {
    console.log(err);
  } finally {
    Loading.value = false;
  }
};

const getWorkershandler = async () => {
  try {
    loading.value = true;
    const response = await api.get("/api/users/", {});

    workersData.value = response.data.filter(
      (worker: any) => worker.role == "worker"
    );

    clientsList.value = response.data.filter(
      (client: any) => client.role == "client"
    );

    contarctorList.value = response.data.filter(
      (contractor: any) => contractor.role == "contractor"
    );

    console.log("data", workersData.value);
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const addTaskHandler = async () => {
  try {
    loading.value = true;
    let formData = convertToFormData(taskData, []);
    const resp = await api.post("/api/task/", formData);
    closeTheModals();
    // $refs.customModal.closeModal();
    getProject();
    getProjectTasks();
    notyf.green("Task added successfully");
    console.log("task data", resp);
  } catch (err) {
    notyf.error("Something went wrong");
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const getProjectTasks = async () => {
  try {
    Loading.value = true;
    const resp = await api.get(`api/task/${route.params.id}/project/`);
    projectTasks.value = resp.data;
    console.log(resp.data);
    getActiveTasks();
    Loading.value = false;
  } catch (err) {
    console.log(err);
  }
};

const handleFileChange = (event) => {
  projectData.value.image = event.target.files[0];
  var input = event.target;
  if (input.files) {
    var reader = new FileReader();
    reader.onload = (e) => {
      preview.value = e.target.result;
    };
    image.value = input.files[0];
    reader.readAsDataURL(input.files[0]);
  }
};

const editProject = async () => {
  try {
    projectData.value.managers = selectedManagers;
    let formData = convertToFormData(projectData.value, ["image"]);
    formData.delete("clientInfo");
    formData.delete("contractorInfo");
    if (typeof projectData.value.client == "object") {
      formData.delete("client");
    }
    if (typeof projectData.value.contractor == "object") {
      formData.delete("contractor");
    }
    const resp = await api.patch(`/api/project/${route.params.id}/`, formData);
    showAddClient.value = false;
    showAddContractor.value = false;

    notyf.green("Project updated successfully");
    getProject(resp.data.id);
  } catch (err) {
    console.log(err);
  }
};

const openProjectForm = (projectId: any) => {
  isProjectFormOpen.value = true;
  editProjectId.value = projectId;
};

const closeProjectForm = () => {
  getProject();
  isProjectFormOpen.value = false;
  editProjectId.value = ""; // Reset the editTaskId after closing
};

const openTaskForm = (taskId: any = "", projectId: any = "") => {
  isTaskFormOpen.value = true;
  editTaskId.value = taskId;
  currentProjectId.value = projectId;
};

const closeTaskForm = () => {
  getProjectTasks();
  isTaskFormOpen.value = false;
  editTaskId.value = null; // Reset the editTaskId after closing
};

const updateTaskStatus = async (taskId: any, taskStatus: any) => {
  try {
    const resp = api.patch(`/api/task/${taskId}/`, {
      status: taskStatus,
    });
    taskData.value.status = taskStatus;
    console.log(resp);
    notyf.info(`Task set to ${taskStatus} successfully`);
    getProject();
  } catch (err) {
    console.log(err);
  }
};

const deleteTask = async () => {
  try {
    loading.value = true;
    const response = await api.delete(`/api/task/${deleteTaskId.value}/`);
    console.log(response);
    // $refs.sweetAlert.closeModal();
    notyf.success(`Task deleted successfully`);
    getProjectTasks();
    loading.value = false;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const updateProjectStatus = async (projectStatus: any) => {
  try {
    projectData.value.status = projectStatus;
    const resp = api.patch(`/api/project/${projectId.value}/`, {
      status: projectStatus,
    });
    getProject();
    console.log(resp);
    notyf.green(
      `Task set to ${
        projectStatus == "pending" ? "Pre Construction" : projectStatus
      } successfully`
    );
  } catch (err) {
    console.log(err);
  } finally {
    getProject();
  }
};

const getTodayTask = async () => {
  try {
    const resp = await api.get(
      `/api/task/today-tasks/?project=${route.params.id}`
    );
    projectTodaysTasks.value = resp.data;
  } catch (err) {
    console.log(err);
  }
};

const selectedFileName = ref("");

const handleFileSelect = (event) => {
  let csvFile = event.target.files[0];
  uploadTasksSheet(csvFile);
  selectedFileName.value = csvFile.name;
};

const removeFile = () => {
  selectedFileName.value = "";
  document.getElementById("docpicker").value = "";
};

const uploadTasksSheet = async (tasksFile: any) => {
  try {
    Loading.value = true;
    const resp = await api.post(`/api/task/bulk-upload/${route.params.id}/`, {
      file: tasksFile,
    });
    notyf.green(`Tasks Will be generated automatically`);
    console.log(resp);
    getProject();
    Loading.value = false;
  } catch (err) {
    console.log(err);
  }
};
const getCompletedTasks = (total: any) => {
  projectCompletedTasks.value = total;
};

const getAllActiveTasks = (total: any) => {
  projectActiveTasks.value = total;
};

onMounted(() => {
  projectId.value = route.params.id;
  getProject();
  getWorkershandler();
  getProjectTasks();
  getTodayTask();
});
</script>

<template>
  <div class="personal-dashboard personal-dashboard-v2">
    <!--Personal Dashboard V2-->

    <div class="columns is-multiline">
      <div class="column is-12">
        <div class="dashboard-header">
          <VAvatar
            :picture="projectData.image"
            squared
            color="primary"
            badge="/images/icons/flags/united-states-of-america.svg"
            size="xxl"
          />
          <div class="user-meta is-dark-bordered-12">
            <h3 class="title is-4 is-narrow is-bold">
              {{ projectData.title ? projectData.title : "N/A" }}
            </h3>
            <p class="light-text">
              Current status:
              <span class="info-text is-bold"
                >{{
                  projectData.status === "pending"
                    ? "Pre Construction"
                    : projectData.status.charAt(0).toUpperCase() +
                      projectData.status.slice(1)
                }}
              </span>
            </p>
            <Address>
              <i class="fas fa-home"></i> {{ projectData.address }}
            </Address>
          </div>
          <div class="user-action">
            <h3 class="title is-5 is-narrow">Information</h3>
            <p class="light-text">
              Started at:
              {{ projectData?.startDate ? projectData?.startDate : "N/A" }}
            </p>
            <p class="light-text">
              Expected end:
              {{ projectData?.endDate ? projectData?.endDate : "N/A" }}
            </p>
            <p class="light-text">
              Total jobs:
              {{ projectData.total_tasks ? projectData.total_tasks : "N/A" }}
              Tasks
            </p>
          </div>

          <div class="h-hidden-tablet-p">
            <div class="media-flex inverted-text">
              <ApexChart
                v-if="!Loading"
                id="completion-chart"
                :height="completionChart.height"
                :type="completionChart.type"
                :series="completionChart.series"
                label="Completion"
                :options="completionChart"
              />
              <!-- <i aria-hidden="true" class="lnil lnil-crown-alt-1" /> -->
            </div>
            <a class="link inverted-text">Change status</a>
          </div>
        </div>
      </div>
    </div>
    <div class="tabs-inner">
      <div class="tabs is-boxed" slider>
        <ul>
          <li :class="[tab === 'detail' && 'is-active']">
            <a
              tabindex="0"
              role="button"
              @keydown.space.prevent="tab = 'detail'"
              @click="tab = 'detail'"
              ><span>Project info</span></a
            >
          </li>
          <li :class="[tab === 'tasks' && 'is-active']">
            <a
              tabindex="0"
              role="button"
              @keydown.space.prevent="tab = 'tasks'"
              @click="tab = 'tasks'"
              ><span>Tasks</span></a
            >
          </li>
          <li class="tab-naver" />
        </ul>
      </div>
    </div>

    <div v-if="tab === 'detail'" class="columns is-multiline">
      <div class="column is-8">
        <div class="dashboard-card has-margin-bottom">
          <ProjectFiles
            :projectId="route.params.id"
            :files="projectData.uploaded_files"
            @update:on-upload-file="getProject"
          />
        </div>

        <div class="dashboard-card">
          <div class="card-head">
            <h3 class="dark-inverted">Task Completion</h3>
            <a class="action-link" tabindex="0">Reports</a>
          </div>
          <ApexChart
            id="completion-chart"
            :height="completionOptions.chart.height"
            :type="completionOptions.chart.type"
            :series="completionOptions.series"
            :options="completionOptions"
          />
        </div>

        <!-- <div class="dashboard-card">
          <div class="card-head">
            <h3 class="dark-inverted">Team Efficiency</h3>
            <a class="action-link" tabindex="0">Reports</a>
          </div>
          <ApexChart
            id="efficiency-chart"
            :height="barOptions.chart.height"
            :type="barOptions.chart.type"
            :series="barOptions.series"
            :options="barOptions"
          />
        </div> -->
      </div>

      <div class="column is-4">
        <!-- <TasksCompletionChart :completedTasks="projectCompletedTasks" /> -->

        <!-- manager card -->
        <div class="dashboard-card">
          <div class="card-head">
            <h3 class="dark-inverted">Assigned Manager</h3>
            <a class="action-link" tabindex="0"></a>
          </div>
          <div class="active-team">
            <ul class="user-list" v-if="projectData.managers.length > 0">
              <li v-for="manager in projectData.managers" :key="manager.id">
                <div>
                  <Tippy class="has-help-cursor" interactive :offset="[0, 10]">
                    <VAvatar :picture="manager.avatar" />
                    <template #content>
                      <UserPopoverContent :user="popovers.user18" />
                    </template>
                  </Tippy>
                </div>
                <div class="user-list-info">
                  <div class="name dark-inverted">{{ manager.username }}</div>
                  <div class="position">{{ manager.email }}</div>
                </div>
                <div class="user-list-icons">
                  <a><i aria-hidden="true" class="fas fa-phone" /></a>
                  <a><i aria-hidden="true" class="fas fa-video" /></a>
                </div>
              </li>
            </ul>
            <ul class="user-list" v-else>
              <div class="user-list-info">
                <div class="name dark-inverted">No Manager assigned yet</div>
              </div>
            </ul>
          </div>
        </div>

        <!-- Client info -->
        <div class="dashboard-card">
          <div class="card-head">
            <h3 class="dark-inverted">Client Information</h3>
            <a @click="toggleAddClient" class="action-link" tabindex="0"
              >{{ showAddClient ? "Close" : "Edit" }}
            </a>
          </div>
          <div class="active-team">
            <ul class="user-list" v-if="projectData.client">
              <li>
                <div>
                  <Tippy class="has-help-cursor" interactive :offset="[0, 10]">
                    <VAvatar :picture="projectData.client.avatar" />
                    <template #content>
                      <UserPopoverContent :user="popovers.user18" />
                    </template>
                  </Tippy>
                </div>
                <div class="user-list-info">
                  <div class="name dark-inverted">
                    {{ projectData.client.username }}
                  </div>
                  <div class="position">{{ projectData.client.email }}</div>
                </div>
                <div class="user-list-icons">
                  <a><i aria-hidden="true" class="fas fa-phone" /></a>
                  <a><i aria-hidden="true" class="fas fa-video" /></a>
                </div>
              </li>
            </ul>
            <ul class="user-list" v-else>
              <div class="user-list-info">
                <div class="name dark-inverted">No Client Info Added yet</div>
              </div>
            </ul>
            <div v-if="showAddClient">
              <VField>
                <VLabel>Select client</VLabel>
                <VControl>
                  <VSelect v-model="projectData.client" @change="editProject">
                    <VOption value=""> Clients </VOption>
                    <VOption
                      v-for="client in clientsList"
                      :key="client.id"
                      :value="client.id"
                      value="Superman"
                    >
                      {{ client.username }}
                    </VOption>
                  </VSelect>
                </VControl>
              </VField>
            </div>
          </div>
        </div>

        <!-- contractor card -->
        <div class="dashboard-card">
          <div class="card-head">
            <h3 class="dark-inverted">Contractor Information</h3>
            <a @click="toggleAddContractor" class="action-link" tabindex="0">{{
              showAddContractor ? "Close" : "Edit"
            }}</a>
          </div>
          <div class="active-team">
            <ul class="user-list" v-if="projectData.contractor">
              <li>
                <div>
                  <Tippy class="has-help-cursor" interactive :offset="[0, 10]">
                    <VAvatar :picture="projectData.contractor.avatar" />
                    <template #content>
                      <UserPopoverContent :user="popovers.user18" />
                    </template>
                  </Tippy>
                </div>
                <div class="user-list-info">
                  <div class="name dark-inverted">
                    {{ projectData.contractor.username }}
                  </div>
                  <div class="position">{{ projectData.contractor.email }}</div>
                </div>
                <div class="user-list-icons">
                  <a><i aria-hidden="true" class="fas fa-phone" /></a>
                  <a><i aria-hidden="true" class="fas fa-video" /></a>
                </div>
              </li>
            </ul>
            <ul class="user-list" v-else>
              <div class="user-list-info">
                <div class="name dark-inverted">
                  No contractor Info Added yet
                </div>
              </div>
            </ul>
            <div v-if="showAddContractor">
              <VField>
                <VLabel>Select contractor</VLabel>
                <VControl>
                  <VSelect
                    v-model="projectData.contractor"
                    @change="editProject"
                  >
                    <VOption
                      v-for="contractor in contarctorList"
                      :key="contractor.id"
                      :value="contractor.id"
                    >
                      {{ contractor.username }}
                    </VOption>
                  </VSelect>
                </VControl>
              </VField>
            </div>
          </div>
        </div>

        <div class="dashboard-card">
          <ProjectTodayTasks :projectId="route.params.id" />
        </div>

        <!-- <div class="dashboard-card">
          <VPlaceholderSection
            title="Go Premium"
            subtitle="Unlock more features and business tools by going premium"
          >
            <template #image>
              <img
                class="light-image"
                src="/@src/assets/illustrations/placeholders/chart-guy.svg"
                alt=""
              />
              <img
                class="dark-image"
                src="/@src/assets/illustrations/placeholders/chart-guy-dark.svg"
                alt=""
              />
            </template>

            <template #action>
              <VButton color="primary" elevated> Go Premium </VButton>
            </template>
          </VPlaceholderSection>
        </div> -->
      </div>
    </div>
    <div v-if="tab === 'tasks'" class="columns is-multiline">
      <div class="column is-12">
        <ProjectsTasks
          @update:completedTasks="getCompletedTasks"
          @update:active-tasks="getAllActiveTasks"
          :projectID="route.params.id"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "/@src/scss/abstracts/all";

.is-navbar {
  .personal-dashboard {
    margin-top: 30px;
  }
}

.personal-dashboard-v2 {
  .dashboard-header {
    @include vuero-s-card;

    display: flex;
    align-items: center;
    padding: 30px;

    .user-meta {
      padding: 0 3rem;
      border-inline-end: 1px solid var(--fade-grey-dark-3);

      h3 {
        max-width: 180px;
      }
    }

    .user-action {
      padding: 0 3rem;
    }

    .cta {
      position: relative;
      flex-grow: 2;
      max-width: 275px;
      margin-inline-start: auto;
      background: var(--primary-light-8);
      padding: 20px;
      border-radius: var(--radius-large);
      box-shadow: var(--primary-box-shadow);

      .lnil,
      .lnir {
        position: absolute;
        bottom: 1rem;
        inset-inline-end: 1rem;
        font-size: 4rem;
        opacity: 0.3;
      }

      .link {
        font-family: var(--font-alt);
        display: block;
        font-weight: 500;
        margin-top: 0.5rem;

        &:hover,
        &:focus {
          color: var(--smoke-white);
          opacity: 0.6;
        }
      }
    }
  }

  .dashboard-card {
    @include vuero-s-card;

    padding: 30px;

    &:not(:last-child) {
      margin-bottom: 1.5rem;
    }

    .card-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;

      h3 {
        font-family: var(--font-alt);
        font-size: 1rem;
        font-weight: 600;
        color: var(--dark-text);
        margin-bottom: 0;
      }
    }

    .active-projects,
    .active-team,
    .active-list {
      padding: 10px 0;
    }
  }
}

.is-dark {
  .personal-dashboard-v2 {
    .dashboard-header,
    .dashboard-card {
      @include vuero-card--dark;
    }

    .home-header {
      .cta {
        background: var(--primary-light-2);
        box-shadow: var(--primary-box-shadow);
      }
    }
  }
}

@media only screen and (width <= 767px) {
  .personal-dashboard-v2 {
    .dashboard-header {
      flex-direction: column;
      text-align: center;

      .v-avatar {
        margin-bottom: 10px;
      }

      .user-meta {
        padding-top: 10px;
        padding-bottom: 10px;
        border: none;
      }

      .user-action {
        padding-bottom: 30px;
      }

      .cta {
        margin-inline-start: 0;
      }
    }

    .active-projects {
      .media-flex-center {
        .flex-end {
          .avatar-stack {
            display: none;
          }
        }
      }
    }
  }
}
</style>
