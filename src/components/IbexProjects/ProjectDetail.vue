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
import { useUserSession } from "/@src/stores/userSession";

const themeColors = useThemeColors();
const api = useApi();
const notyf = useNotyf();
const route = useRoute();
const router = useRouter();
const userSession = useUserSession();
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
const managersList = ref([]);
const selectMangerSlotOptions = ref(<any>[]);
const deleteTaskId = ref(0);
const projectCompletedTasks = ref<any>(0);
const projectActiveTasks = ref<any>(0);
const preview = ref("");
const projectId = ref("");
const editProjectId = ref("");
const workersData = ref([{ id: 0, username: "", email: "", phoneNumber: "" }]);

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
  labels: ["Progress"],
});

const completionOptions = shallowRef({
  series: [],
  chart: {
    height: 295,
    type: "pie",
    toolbar: {
      show: false,
    },
  },
  labels: ["Active", "Pending", "Completed", "Canceled"],
  colors: [
    themeColors.accent,
    themeColors.info,
    themeColors.primary,
    themeColors.orange,
  ],
  legend: {
    position: "right",
    horizontalAlign: "center",
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 315,
          toolbar: {
            show: false,
          },
        },
        legend: {
          position: "top",
        },
      },
    },
  ],
  dataLabels: {
    enabled: false,
  },
  // stroke: {
  //   width: [2, 3, 5],
  //   curve: "smooth",
  // },
  // xaxis: {
  //   type: "date",
  //   categories: [
  //     "2024-11-15",
  //     "2024-11-16",
  //     "2024-11-17",
  //     "2024-11-18",
  //     "2024-11-19",
  //     "2024-11-20",
  //     "2024-11-21",
  //     "2024-11-22",
  //   ],
  // },
  // tooltip: {
  //   x: {
  //     format: "dd/MM/yy HH:mm",
  //   },
  // },
});

const toggleAddContractor = () => {
  showAddContractor.value = !showAddContractor.value;
};

const toggleAddClient = () => {
  showAddClient.value = !showAddClient.value;
};
const showAddManager = ref(false);
const toggleAddManager = () => {
  showAddManager.value = !showAddManager.value;
};

const openDeleteAlert = (id: any) => {
  projectId.value = id;
};

const deleteProject = () => {
  try {
    loading.value = true;
    const response = api.delete(`/api/project/${route.params.id}/`);
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

const getProject = async () => {
  try {
    Loading.value = true;
    const resp = await api.get(`/api/project/${projectId.value}/`);
    projectData.value = resp.data;
    let completion = resp.data.percentage.toFixed(2);
    completionChart.value.series.push(completion);
    preview.value = resp.data.image;
    selectedManagers.value = resp.data.managers ? resp.data.managers : [];

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
    managersList.value = response.data.filter(
      (contractor: any) => contractor.role == "manager"
    );
    selectMangerSlotOptions.value = managersList.value.map((manager: any) => {
      return {
        value: manager.id.toString(),
        name: `${manager.username}`,
        supplier: manager.partner ? manager.partner : "",
        image: manager.avatar,
      };
    });
    console.log("data", workersData.value);
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

// const projectTasks = ref([]);
const taskSeries = ref([]);

const getProjectTasks = async () => {
  try {
    Loading.value = true;

    const resp = await api.get(`api/task/${route.params.id}/project/`);
    projectTasks.value = resp.data;

    const statusCounts = {
      pending: 0,
      completed: 0,
      active: 0,
      canceled: 0,
    };

    projectTasks.value.forEach((task) => {
      const status = task.status || "Unknown";
      if (statusCounts[status] !== undefined) {
        statusCounts[status]++;
      }
    });

    // Update the series with the counts
    completionOptions.value.series = [
      statusCounts.completed,
      statusCounts.pending,
      statusCounts.active,
      statusCounts.canceled,
    ];

    Loading.value = false;
  } catch (err) {
    console.log(err);
    Loading.value = false;
  }
};

const selectedManagersIds = ref([]);
const editProject = async () => {
  try {
    projectData.value.managers = selectedManagersIds.value;
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
    showAddManager.value = false;
    getProject(resp.data.id);
  } catch (err) {
    console.log(err);
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

const getCompletedTasks = (total: any) => {
  projectCompletedTasks.value = total;
};

const getAllActiveTasks = (total: any) => {
  projectActiveTasks.value = total;
};

onMounted(async () => {
  projectId.value = route.params.id;
  getProject();
  getWorkershandler();
  await getProjectTasks();
  getTodayTask();
});
</script>

<template>
  <div class="personal-dashboard personal-dashboard-v2">
    <!--Personal Dashboard V2-->

    <div class="columns is-multiline">
      <div class="column is-12">
        <div class="dashboard-header is-relative">
          <VIcon
            style="
              position: absolute;
              top: 10px;
              font-size: 18px;
              font-weight: 600;
              right: 36px;
              color: var(--info);
            "
            v-if="
              userSession.user.role == 'admin' ||
              userSession.user.role == 'manager'
            "
            class="cu-pointer"
            @click="
              () => {
                router.push(
                  `/sidebar/dashboard/projects/add-project/?id=${projectData.id}`
                );
              }
            "
            icon="lucide:edit"
          />
          <VIcon
            style="
              position: absolute;
              top: 10px;
              font-size: 18px;
              font-weight: 600;
              right: 10px;
              color: var(--danger);
            "
            v-if="
              userSession.user.role == 'admin' ||
              userSession.user.role == 'manager'
            "
            class="cu-pointer"
            @click="deleteProject"
            icon="lucide:trash"
          />

          <VAvatar
            :picture="projectData.image"
            squared
            color="primary"
            size="xxl"
          />
          <div class="user-meta is-dark-bordered-12">
            <h3 class="title is-4 is-narrow is-bold">
              {{ projectData.title ? projectData.title : "N/A" }}
            </h3>
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

          <div>
            <div class="media-flex inverted-text">
              <ApexChart
                v-if="!Loading"
                id="completion-chart"
                :height="completionChart.height"
                :type="completionChart.type"
                :series="completionChart.series"
                :options="completionChart"
              />
              <!-- <i aria-hidden="true" class="lnil lnil-crown-alt-1" /> -->
            </div>
            <a class="link inverted-text">Change status</a>
          </div>
        </div>
      </div>
    </div>
    <div class="tabs-wrapper">
      <div
        v-if="
          userSession.user.role == 'admin' ||
          userSession.user.role == 'manager' ||
          userSession.user.role == 'client'
        "
        class="tabs-inner"
      >
        <div class="tabs is-boxed" slider>
          <ul>
            <li :class="[tab === 'detail' && 'is-active']">
              <a
                tabindex="0"
                role="button"
                @keydown.space.prevent="tab = 'detail'"
                @click="tab = 'detail'"
                ><span>Project Info</span></a
              >
            </li>
            <li :class="[tab === 'calendar' && 'is-active']">
              <a
                tabindex="0"
                role="button"
                @keydown.space.prevent="tab = 'calendar'"
                @click="tab = 'calendar'"
                ><span>Tasks Calendar</span></a
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
    </div>
    <div v-if="tab === 'detail'" class="columns is-multiline">
      <div
        v-if="
          userSession.user.role == 'admin' || userSession.user.role == 'manager'
        "
        class="column is-8"
      >
        <div class="dashboard-card has-margin-bottom">
          <div v-html="projectData.description"></div>
        </div>
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
          <!-- v-if="completionOptions.series" -->
          <ApexChart
            v-if="projectTasks.length != 0"
            :height="completionOptions.chart.height"
            :type="completionOptions.chart.type"
            :series="completionOptions.series"
            :options="completionOptions"
          />
        </div>
      </div>

      <div
        :class="
          userSession.user.role == 'admin' || userSession.user.role == 'manager'
            ? 'column is-4'
            : 'column is-12'
        "
      >
        <!-- manager card -->
        <div class="dashboard-card">
          <div class="card-head">
            <h3 class="dark-inverted">Assigned Manager</h3>
            <a
              v-if="
                userSession.user.role == 'admin' ||
                userSession.user.role == 'manager'
              "
              @click="toggleAddManager"
              class="action-link"
              tabindex="0"
              >{{ showAddManager ? "Close" : "Edit" }}
            </a>

            <!-- @blur="editProject" -->
          </div>
          <div class="active-team">
            <ul class="user-list" v-if="selectedManagers.length > 0">
              <li v-for="manager in selectedManagers" :key="manager.id">
                <div>
                  <Tippy class="has-help-cursor" interactive :offset="[0, 10]">
                    <VAvatar :picture="manager.avatar" />
                    <template #content>
                      <UserPopoverContent :user="manager" />
                    </template>
                  </Tippy>
                </div>
                <div class="user-list-info">
                  <div class="name dark-inverted">{{ manager.username }}</div>
                  <div class="position">{{ manager.email }}</div>
                </div>
                <div class="user-list-icons"></div>
              </li>
            </ul>
            <ul class="user-list" v-else>
              <div class="user-list-info">
                <div class="name dark-inverted">No Manager assigned yet</div>
              </div>
            </ul>
            <div v-if="showAddManager">
              <VField v-slot="{ id }">
                <VControl>
                  <Multiselect
                    v-model="selectedManagersIds"
                    :attrs="{ id }"
                    mode="tags"
                    placeholder="Select manager"
                    track-by="name"
                    label="name"
                    :searchable="true"
                    :create-tag="true"
                    :options="selectMangerSlotOptions"
                    :max-height="145"
                  >
                  </Multiselect>
                </VControl>
              </VField>
            </div>
            <div class="is-flex space-between">
              <a v-if="showAddManager"> </a>

              <a
                v-if="showAddManager"
                @click="editProject"
                class="action-link"
                tabindex="0"
                >Save
              </a>
            </div>
          </div>
        </div>

        <!-- Client info -->
        <div class="dashboard-card">
          <div class="card-head">
            <h3 class="dark-inverted">Client Information</h3>
            <a
              v-if="
                userSession.user.role == 'admin' ||
                userSession.user.role == 'manager'
              "
              @click="toggleAddClient"
              class="action-link"
              tabindex="0"
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
                      <UserPopoverContent :user="projectData.client" />
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
                  <!-- <a><i aria-hidden="true" class="fas fa-phone" /></a>
                  <a><i aria-hidden="true" class="fas fa-video" /></a> -->
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
            <a
              v-if="
                userSession.user.role == 'admin' ||
                userSession.user.role == 'manager'
              "
              @click="toggleAddContractor"
              class="action-link"
              tabindex="0"
              >{{ showAddContractor ? "Close" : "Edit" }}</a
            >
          </div>
          <div class="active-team">
            <ul class="user-list" v-if="projectData.contractor">
              <li>
                <div>
                  <Tippy class="has-help-cursor" interactive :offset="[0, 10]">
                    <VAvatar :picture="projectData.contractor.avatar" />
                    <template #content>
                      <UserPopoverContent :user="projectData.contractor" />
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
                  <!-- <a><i aria-hidden="true" class="fas fa-phone" /></a>
                  <a><i aria-hidden="true" class="fas fa-video" /></a> -->
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
    <div v-if="tab === 'calendar'" class="columns is-multiline">
      <ProjectTasksCalendar :projectID="route.params.id" />
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
