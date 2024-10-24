<script setup lang="ts">
import FullCalendar from "@fullcalendar/vue3";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { useUserSession } from "/@src/stores/userSession";

const userSession = useUserSession();
const notyf = useNotyf();
const api = useApi();
const route = useRoute();
const events = ref<any>([]);
const router = useRouter();
const currentSelectedId = ref("");
const openUserUpdateModal = ref(false);
const tab = ref("cards");
const userId = ref("");
const isPasswordModalOpen = ref(false);
const workerData = ref({
  id: "",
  password: "",
  last_login: null,
  date_joined: "",
  email: "",
  role: "",
  avatar: "",
  is_active: true,
  phoneNumber: "",
  username: "",
  is_sentMail: false,
});
const fullWidthView = ref(false);
const activeFilter = ref("all");
const query = ref("");
const loading = ref(false);

// Tasks, Resources, Events, and Projects as Reactive Arrays
const tasks = ref([]);
const filteredResources = ref([]);
const filteredEvents = ref([]);
const projects = ref<any>([]);

// Colors as an Object
const colors = ref({
  pending: "#fbcf33",
  active: "#82d616",
  completed: "#cb0c9f",
  canceled: "#344767",
});

const calendarOptions = ref({
  plugins: [resourceTimelinePlugin],
  schedulerLicenseKey: "0965592368-fcs-1694657447",
  initialView: "resourceTimelineMonth",
  height: "auto",
  resourceAreaWidth: "20%",
  selectable: true,
  events: [],
  headerToolbar: {
    left: "today prev,next",
    center: "title",
    right: "resourceTimelineWeek,resourceTimelineMonth,resourceTimelineYear",
  },
  editable: true,
  views: {
    resourceTimelineWeek: {
      slotDuration: { days: 1, hours: 1 },
      slotLabelFormat: {
        weekday: "short",
        month: "numeric",
        day: "numeric",
        year: "numeric",
      },
    },
  },
  resourceAreaHeaderContent: "Projects",
  resources: [],
});

const sendTasksMailToWorker = async () => {
  try {
    const resp = await api.post(`/api/task/worker-mail/`, {
      worker: route.params.id,
    });
    console.log(resp);
    notyf.success(
      `List of tasks sent to ${workerData.value.username} successfully`
    );
  } catch (err) {
    console.log(err);
  }
};

const renderCalendar = () => {
  events.value = tasks.value.map((task) => ({
    id: task.id,
    resourceId: task.project.id,
    start: task.startDate,
    end: task.endDate,
    title: task.title,
    color: task.color,
    description: task.description,
    workers: task.workers,
    borderColor: colors[task.status],
    status: task.status,
  }));

  projects.value = tasks.value.map((task) => ({
    id: task.project.id,
    start: task.project.startDate,
    end: task.project.endDate,
    title: task.project.title,
    address: task.project.address,
    status: task.project.status,
    color: colors[task.project.status],
  }));

  filteredResources.value = projects.value;
  filteredEvents.value = events.value;

  // Update the reactive calendar options object properly
  calendarOptions.value = {
    ...calendarOptions.value, // Keep other properties intact
    resources: filteredResources.value, // Assign resources in a reactive manner
    events: filteredEvents.value, // Assign events in a reactive manner
  };

  console.log(
    "tasks",
    calendarOptions.value.events,
    "resources",
    calendarOptions.value.resources
  );
};

const changeFilterHandler = () => {
  if (activeFilter.value !== "all") {
    const data = events.value.filter(
      (event) => event.status === activeFilter.value
    );
    filteredEvents.value = data;
  } else {
    filteredEvents.value = events.value;
  }
  calendarOptions.value.events = filteredEvents.value;
};

const openPasswordModal = (id: any) => {
  userId.value = id;
  isPasswordModalOpen.value = true;
};

// Method to get tasks for a worker
const getTasksHandler = async () => {
  try {
    const response = await api.get(
      `/api/task/${
        route.params.id ? route.params.id : userSession.user.id
      }/worker-tasks/`
    );
    tasks.value = response.data;
    console.log("worker tasks", tasks.value);
  } catch (err) {
    tasks.value = [];
  }
};

const getWorkerHandler = async () => {
  try {
    loading.value = true;
    const response = await api.get(
      `/api/users/${route.params.id ? route.params.id : userSession.user.id}`
    );
    workerData.value = response.data;
    loading.value = false;
    // renderCalendar();
  } catch (err) {
    console.log(err);
  }
};

const showFullView = () => {
  fullWidthView.value = !fullWidthView.value;
};

const openEditUserModal = (id: any = "") => {
  currentSelectedId.value = id;
  openUserUpdateModal.value = true;
};

const workerTasksStats = ref({});
const getWorkerTodayTask = async (refresh: boolean = false) => {
  try {
    const resp = await api.get(
      `/api/task/worker-today/${
        route.params.id ? route.params.id : userSession.user.id
      }/`
    );
    workerTasksStats.value = resp.data;
    if (refresh) {
      notyf.green("Tasks list Refreshed");
    }
  } catch (err) {
    console.log(err);
  }
};

onMounted(async () => {
  await getWorkerHandler();
  await getTasksHandler();
  getWorkerTodayTask();
  renderCalendar();
});
</script>

<template>
  <div class="lifestyle-dashboard lifestyle-dashboard-v3">
    <div class="illustration-header">
      <div class="p-4">
        <VAvatar size="xl" squared :picture="workerData.avatar" alt="" />
      </div>
      <div class="header-meta">
        <h3>
          {{ workerData?.username }}
          <i
            @click="openEditUserModal(workerData.id)"
            class="fas fa-pencil-alt ml-2 cu-pointer"
            aria-hidden="true"
          ></i>
        </h3>
        <!-- <p>Monitor your activity and keep improving your weak points.</p> -->
        <div class="summary-stats">
          <div class="summary-stat">
            <span>Role</span>
            <span>{{ workerData?.role }}</span>
          </div>
          <div class="summary-stat">
            <span>Status</span>
            <span>{{ workerData?.is_active ? "Active" : " In-Active" }}</span>
          </div>
          <div class="summary-stat">
            <span>Phone</span>
            <span>{{
              workerData?.phoneNumber ? workerData?.phoneNumber : "N/A"
            }}</span>
          </div>
          <div class="summary-stat">
            <span>Email</span>
            <span>{{ workerData?.email }}</span>
          </div>
          <div class="summary-stat h-hidden-tablet-p">
            <span>Mail notify </span>
            <span>{{ workerData.is_sentMail ? "On" : "Off" }}</span>
          </div>
          <div class="summary-stat h-hidden-tablet-p">
            <span>Password </span>
            <span
              ><i
                @click="openPasswordModal(workerData.id)"
                class="fas fa-lock cu-pointer"
                aria-hidden="true"
              ></i
            ></span>
          </div>
        </div>
      </div>
    </div>

    <div class="columns is-multiline is-flex-tablet-p">
      <!--Tile-->
      <div class="column is-3">
        <div class="health-tile">
          <div class="tile-head">
            <VIconBox color="primary">
              <i class="fas fa-clipboard-list" aria-hidden="true"></i>
            </VIconBox>
            <h4>
              <span class="dark-inverted">{{
                workerTasksStats?.stats?.pending +
                workerTasksStats?.stats?.active +
                workerTasksStats?.stats?.active
              }}</span>
              <!-- <span>lbs</span> -->
            </h4>
          </div>
          <h3 class="dark-inverted">Total Tasks</h3>
          <p>Number of tasks assigned within 30 Days duration</p>
        </div>
      </div>

      <!--Tile-->
      <div class="column is-3">
        <div class="health-tile">
          <div class="tile-head">
            <VIconBox color="primary">
              <i aria-hidden="true" class="fas fa-tint" />
            </VIconBox>
            <h4>
              <span class="dark-inverted">{{
                workerTasksStats?.stats?.active
                  ? workerTasksStats?.stats?.active
                  : 0
              }}</span>

              <!-- <span>Active</span> -->
            </h4>
          </div>
          <h3 class="dark-inverted">Active Tasks</h3>
          <p>Tasks are currently active and worker notified</p>
        </div>
      </div>

      <!--Tile-->
      <div class="column is-3">
        <div class="health-tile">
          <div class="tile-head">
            <VIconBox color="primary">
              <i class="fas fa-clipboard" aria-hidden="true"></i>
            </VIconBox>
            <h4>
              <span class="dark-inverted">{{
                workerTasksStats?.stats?.pending
                  ? workerTasksStats?.stats?.pending
                  : 0
              }}</span>
              <!-- <span>Bpm</span> -->
            </h4>
          </div>
          <h3 class="dark-inverted">Pending Tasks</h3>
          <p>Tasks that are pending and worker need to done.</p>
        </div>
      </div>

      <!--Tile-->
      <div class="column is-3">
        <div class="health-tile">
          <div class="tile-head">
            <VIconBox color="primary">
              <i class="fas fa-clipboard-check" aria-hidden="true"></i
            ></VIconBox>
            <h4>
              <span class="dark-inverted">{{
                workerTasksStats?.stats?.completed
                  ? workerTasksStats?.stats?.completed
                  : 0
              }}</span>
              <!-- <span>lbs</span> -->
            </h4>
          </div>
          <h3 class="dark-inverted">Completed Tasks</h3>
          <p>
            The worker has done his job on these tasks and assure by the manager
          </p>
        </div>
      </div>
    </div>

    <div class="columns is-multiline">
      <div class="list-flex-toolbar is-reversed">
        <div class="tabs-inner">
          <div class="tabs is-boxed">
            <ul>
              <li :class="[tab === 'cards' && 'is-active']">
                <a
                  tabindex="0"
                  role="button"
                  @keydown.space.prevent="tab = 'cards'"
                  @click="tab = 'cards'"
                  ><span>Cards View</span></a
                >
              </li>
              <li :class="[tab === 'calendar' && 'is-active']">
                <a
                  tabindex="0"
                  role="button"
                  @keydown.space.prevent="tab = 'calendar'"
                  @click="tab = 'calendar'"
                  ><span>Calendar View</span></a
                >
              </li>
              <li :class="[tab === 'today' && 'is-active']">
                <a
                  tabindex="0"
                  role="button"
                  @keydown.space.prevent="tab = 'today'"
                  @click="tab = 'today'"
                  ><span>Today Tasks</span></a
                >
              </li>
              <li class="tab-naver" />
            </ul>
          </div>
        </div>
      </div>
      <div v-show="tab == 'cards'" class="column is-12">
        <WorkerTasks :workerId="route.params.id" />
      </div>
      <div v-if="tab == 'calendar'" class="column is-12">
        <FullCalendar :options="calendarOptions">
          <template v-slot:eventContent="arg">
            <div
              style="
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                justify-content: space-between;
              "
            >
              <p
                style="font-weight: 600; margin-bottom: 0px; padding-left: 10px"
              >
                {{ arg.event.title }}
              </p>
              <div>
                <p style="margin-top: 8px; padding-right: 10px">
                  {{ new Date(arg.event.start).toDateString() }} to
                  {{ new Date(arg.event.end).toDateString() }}
                </p>
              </div>
            </div>
          </template>
        </FullCalendar>
      </div>
      <div v-if="tab == 'today'" class="column is-12">
        <ProjectTodayTasks :workerId="route.params.id" />
      </div>
    </div>
    <ChangePasswordModal
      v-if="isPasswordModalOpen"
      :isModalOpen="isPasswordModalOpen"
      :userId="userId"
      @update:closeModalHandler="isPasswordModalOpen = false"
    />
    <AddUpdateUser
      v-if="openUserUpdateModal"
      :isModalOpen="openUserUpdateModal"
      :userId="currentSelectedId"
      userRole="worker"
      @update:closeModalHandler="openUserUpdateModal = false"
      @update:actionUpdateHandler="getWorkerHandler"
    />
  </div>
</template>

<style lang="scss">
@import "/@src/scss/abstracts/all";

.lifestyle-dashboard-v3 {
  .illustration-header {
    display: flex;
    align-items: center;
    padding: 10px;
    border-radius: 16px;
    background: var(--primary-dark-24);
    font-family: var(--font);
    margin-bottom: 30px;

    .header-image {
      position: relative;
      height: 168px;
      width: 280px;

      img {
        position: absolute;
        top: -76px;
        inset-inline-start: -30px;
        display: block;
        pointer-events: none;
      }
    }

    .header-meta {
      margin-inline-start: 0;

      h3 {
        color: var(--smoke-white);
        font-family: var(--font-alt);
        font-weight: 700;
        font-size: 1.3rem;
      }

      p {
        font-weight: 400;
        color: var(--smoke-white-dark-16);
        margin-bottom: 16px;
      }

      .summary-stats {
        display: flex;

        .summary-stat {
          margin-inline-end: 30px;

          span {
            font-family: var(--font);
            display: block;

            &:first-child {
              font-size: 1.1rem;
              font-family: var(--font-alt);
              color: var(--smoke-white);
            }

            &:nth-child(2) {
              color: var(--primary-light-18);
              font-size: 0.85rem;
            }
          }
        }
      }

      .action-link {
        span {
          font-size: 0.8rem;
          text-transform: uppercase;
          margin-inline-end: 6px;
        }

        i {
          font-size: 12px;
        }
      }
    }
  }

  .health-tile {
    font-family: var(--font);

    .tile-head {
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      .v-icon {
        margin-inline-end: 10px;
      }

      h4 {
        span {
          &:first-child {
            font-size: 1.2rem;
            font-weight: 600;
            color: var(--dark-text);
            margin-inline-end: 0.25rem;
          }

          &:nth-child(2) {
            font-size: 0.95rem;
            color: var(--light-text);
          }
        }
      }
    }

    h3 {
      font-family: var(--font-alt);
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--dark-text);
    }

    p {
      font-size: 0.95rem;
    }
  }

  .dashboard-card {
    @include vuero-l-card;

    .card-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;

      h3 {
        color: var(--dark-text);
        font-size: 1.2rem;
        font-weight: 500;
      }
    }

    .chart-meta {
      p {
        font-size: 0.95rem;
        max-width: 80%;

        svg {
          position: relative;
          top: 2px;
          height: 16px;
          width: 16px;
          color: var(--light-text);
        }

        a {
          color: var(--primary);
          font-weight: 500;
        }
      }
    }
  }
}

.is-dark {
  .lifestyle-dashboard-v3 {
    .dashboard-card {
      @include vuero-card--dark;
    }
  }
}

@media only screen and (width <= 767px) {
  .lifestyle-dashboard-v3 {
    .illustration-header {
      flex-direction: column;
      text-align: center;

      .header-image {
        height: auto;
        width: 100%;

        img {
          position: relative;
          width: 100%;
          max-width: 260px;
          margin: 0 auto;
          top: 0;
          margin-top: -75px;
        }
      }

      .header-meta {
        padding: 20px;

        > p {
          max-width: 280px;
          margin-inline-start: auto;
          margin-inline-end: auto;
        }

        .summary-stats {
          flex-wrap: wrap;

          .summary-stat {
            margin: 10px;
            min-width: calc(33.3% - 20px);
          }
        }
      }
    }

    .health-tile {
      padding: 20px;
      background: var(--white);
      border: 1px solid var(--fade-grey-dark-3);
      border-radius: 10px;
    }
  }

  .is-dark {
    .lifestyle-dashboard-v3 {
      .health-tile {
        background: var(--dark-sidebar-light-6);
        border-color: var(--dark-sidebar-light-12);
      }
    }
  }
}

@media only screen and (width >= 768px) and (width <= 1024px) and (orientation: portrait) {
  .lifestyle-dashboard-v3 {
    .illustration-header {
      .header-image {
        width: 250px;
      }
    }
  }
}
</style>
