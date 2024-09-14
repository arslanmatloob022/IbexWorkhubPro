<script setup lang="ts">
import ApexChart from "vue3-apexcharts";

import type { VAvatarProps } from "/@src/components/base/avatar/VAvatar.vue";
import { useTaskCompletionChart } from "/@src/data/dashboards/personal-v2/taskCompletionChart";
import { useTeamEfficiencyChart } from "/@src/data/dashboards/personal-v2/teamEfficiencyChart";
import { popovers } from "/@src/data/users/userPopovers";
import * as usersData from "/@src/data/dashboards/personal-v2/users";
import { useNotyf } from "/@src/composable/useNotyf";
import { useApi } from "/@src/composable/useAPI";
import { convertToFormData } from "/@src/composable/useSupportElement";

const { completionOptions } = useTaskCompletionChart();
const { barOptions } = useTeamEfficiencyChart();
const avatarStack1 = usersData.avatarStack1 as VAvatarProps[];
const avatarStack2 = usersData.avatarStack1 as VAvatarProps[];
const avatarStack3 = usersData.avatarStack1 as VAvatarProps[];
const avatarStack4 = usersData.avatarStack1 as VAvatarProps[];

const api = useApi();
const notyf = useNotyf();
const route = useRoute();
const router = useRouter();
const democheck = ref(["value_2"]);

const Loading = ref(false);
const showAddClient = ref(false);
const isTaskFormOpen = ref(false);
const showAddContractor = ref(false);
const isProjectFormOpen = ref(false);
const loading = ref(false);
const assignToMore = ref(false);
const clientsList = ref([]);
const contarctorList = ref([]);
const selectedManagers = ref([]);
const deleteTaskId = ref(0);
const activeTasks = ref(0);
const editTaskId = ref("");
const currentProjectId = ref("");
const modalTitle = ref("Add Task");
const sheetNameDeleteTobe = ref("");
const editmodalTitle = ref("Edit Project");
const preview = ref("");
const image = ref("");
const editProjectId = ref("");
const workersData = ref([{ id: 0, username: "", email: "", phoneNumber: "" }]);
const Taskstatus = ref([
  { value: "active", name: "Active" },
  { value: "pending", name: "Pre Construction" },
  { value: "completed", name: "Completed" },
  { value: "cancelled", name: "cancelled" },
]);

const projectData = ref({
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
  uploaded_files: [],
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

const alertData = ref({
  icon: "fa fa-bell",
  alertTitle: "Delete Task ?",
  alertDescription:
    "After deleting this task you will not be able to recover it",
});

const delteAlertData = ref({
  icon: "fa fa-warning",
  alertTitle: "Delete Project Permanently?",
  alertDescription:
    "After deleting this Project you will not be able to recover it",
});

const delteSheetAlertData = ref({
  icon: "fa fa-warning",
  alertTitle: "Delete Tasks' Sheet Permanently?",
  alertDescription:
    "After deleting this Sheet all tasks created by this sheet will be deleted permanently",
});

const deleteSheetTasks = () => {
  try {
    loading.value = true;
    const resp = api.patch(
      `/api/project/${projectId.value}/delete-doc-tasks/`,
      {
        document_name: sheetNameDeleteTobe.value,
      }
    );
    console.log(resp);
    getProject();
    notyf.error("All Tasks will be deleted that are created by Sheet!");
    loading.value = false;
  } catch (err) {
    console.log(err);
  } finally {
    getProject();
  }
};

const projectId = ref("");

const toggleAddContractor = () => {
  showAddContractor.value = !showAddContractor.value;
};

const toggleAddClient = () => {
  showAddClient.value = !showAddClient.value;
};

const openDeleteAlert = (id: any) => {
  // $refs.deleteSweetAlert.openModal();
  projectId.value = id;
};

const openSheetDeleteAlert = (sheetName: any) => {
  // $refs.deleteSheetSweetAlert.openModal();
  sheetNameDeleteTobe.value = sheetName;
};

const deleteProject = () => {
  try {
    loading.value = true;
    const response = api.delete(`/api/project/${projectId.value}/`);
    // $refs.deleteSheetSweetAlert.closeModal();
    console.log("deleted", response);
    notyf.green("Selected project deleted successfully!");
    router.push("/sidebar/dashboard/projects");
  } catch (err) {
    console.log(err);
    console.log("not deleted");
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
    preview.value = resp.data.image;

    getProjectTasks();
  } catch (err) {
    console.log(err);
  } finally {
    Loading.value = false;
  }
};

const openAlert = (id: any) => {
  // $refs.sweetAlert.openModal();
  deleteTaskId.value = id;
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

onMounted(() => {
  projectId.value = route.params.id;
  getProject();
  getWorkershandler();
  getProjectTasks();
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
            <p class="light-text">It's really nice to see you again</p>
          </div>
          <div class="user-action">
            <h3 class="title is-2 is-narrow">3</h3>
            <p class="light-text">Tasks are pending review</p>
            <a class="action-link" tabindex="0">View Tasks</a>
          </div>
          <div class="cta h-hidden-tablet-p">
            <div class="media-flex inverted-text">
              <i aria-hidden="true" class="lnil lnil-crown-alt-1" />
              <p class="white-text">
                Start using our team and project management tools
              </p>
            </div>
            <a class="link inverted-text">Learn More</a>
          </div>
        </div>
      </div>

      <div class="column is-8">
        <div class="dashboard-card has-margin-bottom">
          <div class="card-head">
            <h3 class="dark-inverted">Active Projects</h3>
            <a class="action-link" tabindex="0">View All</a>
          </div>
          <div class="active-projects">
            <!--Project-->
            <VBlock
              title="Delivery App Project"
              subtitle="Updated 30m ago"
              center
            >
              <template #icon>
                <VAvatar
                  picture="/demo/photos/apps/1.jpg"
                  badge="/images/icons/stacks/illustrator.svg"
                  size="medium"
                  squared
                />
              </template>
              <template #action>
                <VAvatarStack :avatars="avatarStack1" size="small" />
                <ProjectWidgetDropdown />
              </template>
            </VBlock>

            <!--Project-->
            <VBlock
              title="Health and Fitness Dashboard"
              subtitle="Updated 5h ago"
              center
            >
              <template #icon>
                <VAvatar
                  picture="/demo/photos/apps/2.png"
                  badge="/images/icons/stacks/reactjs.svg"
                  size="medium"
                  squared
                />
              </template>
              <template #action>
                <VAvatarStack :avatars="avatarStack2" size="small" />
                <ProjectWidgetDropdown />
              </template>
            </VBlock>

            <!--Project-->
            <VBlock
              title="Learning Tracker Dashboard"
              subtitle="Updated 7h ago"
              center
            >
              <template #icon>
                <VAvatar
                  picture="/demo/photos/apps/3.png"
                  badge="/images/icons/stacks/angular.svg"
                  size="medium"
                  squared
                />
              </template>
              <template #action>
                <VAvatarStack :avatars="avatarStack3" size="small" />
                <ProjectWidgetDropdown />
              </template>
            </VBlock>

            <!--Project-->
            <VBlock
              title="Banking App Dashboard"
              subtitle="Updated 10h ago"
              center
            >
              <template #icon>
                <VAvatar
                  picture="/demo/photos/apps/4.png"
                  badge="/images/icons/stacks/js.svg"
                  size="medium"
                  squared
                />
              </template>
              <template #action>
                <VAvatarStack :avatars="avatarStack4" size="small" />
                <ProjectWidgetDropdown />
              </template>
            </VBlock>
          </div>
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

        <div class="dashboard-card">
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
        </div>
      </div>

      <div class="column is-4">
        <div class="dashboard-card">
          <div class="card-head">
            <h3 class="dark-inverted">My Team</h3>
            <a class="action-link" tabindex="0">View All</a>
          </div>
          <div class="active-team">
            <ul class="user-list">
              <li>
                <div>
                  <Tippy class="has-help-cursor" interactive :offset="[0, 10]">
                    <VAvatar picture="/demo/avatars/18.jpg" />
                    <template #content>
                      <UserPopoverContent :user="popovers.user18" />
                    </template>
                  </Tippy>
                </div>
                <div class="user-list-info">
                  <div class="name dark-inverted">Esteban C.</div>
                  <div class="position">UI/UX Designer</div>
                </div>
                <div class="user-list-icons">
                  <a><i aria-hidden="true" class="fas fa-phone" /></a>
                  <a><i aria-hidden="true" class="fas fa-video" /></a>
                </div>
              </li>
              <li>
                <div>
                  <Tippy class="has-help-cursor" interactive :offset="[0, 10]">
                    <VAvatar initials="SC" color="h-orange" />
                    <template #content>
                      <UserPopoverContent :user="popovers.user120" />
                    </template>
                  </Tippy>
                </div>
                <div class="user-list-info">
                  <div class="name dark-inverted">Sara Connor</div>
                  <div class="position">UI/UX Designer</div>
                </div>
                <div class="user-list-icons">
                  <a><i aria-hidden="true" class="fas fa-phone" /></a>
                  <a><i aria-hidden="true" class="fas fa-video" /></a>
                </div>
              </li>
              <li>
                <div>
                  <Tippy class="has-help-cursor" interactive :offset="[0, 10]">
                    <VAvatar picture="/demo/avatars/13.jpg" />
                    <template #content>
                      <UserPopoverContent :user="popovers.user13" />
                    </template>
                  </Tippy>
                </div>
                <div class="user-list-info">
                  <div class="name dark-inverted">Tara S.</div>
                  <div class="position">UI/UX Designer</div>
                </div>
                <div class="user-list-icons">
                  <a><i aria-hidden="true" class="fas fa-phone" /></a>
                  <a><i aria-hidden="true" class="fas fa-video" /></a>
                </div>
              </li>
              <li>
                <div>
                  <Tippy class="has-help-cursor" interactive :offset="[0, 10]">
                    <VAvatar initials="NL" color="success" />
                    <template #content>
                      <UserPopoverContent :user="popovers.user121" />
                    </template>
                  </Tippy>
                </div>
                <div class="user-list-info">
                  <div class="name dark-inverted">Naomi Liversky</div>
                  <div class="position">Frontend developer</div>
                </div>
                <div class="user-list-icons">
                  <a><i aria-hidden="true" class="fas fa-phone" /></a>
                  <a><i aria-hidden="true" class="fas fa-video" /></a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div class="dashboard-card">
          <div class="card-head">
            <h3 class="dark-inverted">Todo Today</h3>
            <a class="action-link" tabindex="0">View All</a>
          </div>
          <div class="active-list">
            <div class="checkboxes-list">
              <!-- List item -->
              <div class="list-item">
                <!-- Animated checkbox-->
                <VAnimatedCheckbox v-model="democheck" value="value_1" />
                <div class="item-meta">
                  <span class="dark-inverted">Call Mr. Markstrom</span>
                  <span>Review the project initial wireframes</span>
                </div>
              </div>
              <!-- List item -->
              <div class="list-item">
                <!-- Animated checkbox-->
                <VAnimatedCheckbox v-model="democheck" value="value_2" />
                <div class="item-meta">
                  <span class="dark-inverted">Finish wireframes</span>
                  <span>Make all requested changes and publish</span>
                </div>
              </div>
              <!-- List item -->
              <div class="list-item">
                <!-- Animated checkbox-->
                <VAnimatedCheckbox v-model="democheck" value="value_3" />
                <div class="item-meta">
                  <span class="dark-inverted">Update timesheets</span>
                  <span>Update all the team timesheets</span>
                </div>
              </div>
              <!-- List item -->
              <div class="list-item">
                <!-- Animated checkbox-->
                <VAnimatedCheckbox v-model="democheck" value="value_4" />
                <div class="item-meta">
                  <span class="dark-inverted">Request payout</span>
                  <span>send project invoice to client</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="dashboard-card">
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
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
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
