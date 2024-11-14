<script setup lang="ts">
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { usePersonalScoreGauge } from "/@src/data/widgets/charts/personalScoreGauge";

const notyf = useNotyf();
const api = useApi();
const route = useRoute();
const events = ref<any>([]);

const { personalScoreGaugeOptions, onPersonalScoreGaugeReady } =
  usePersonalScoreGauge();
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
const loading = ref(false);
const tab = ref("tasks");

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

// Method to get tasks for a worker
const getTasksHandler = async () => {
  try {
    const response = await api.get(
      `/api/task/${route.params.id}/worker-tasks/`
    );
    tasks.value = response.data;
    console.log("worker tasks", tasks.value);
  } catch (err) {
    tasks.value = [];
  }
};

const getContractorDetailHandler = async () => {
  try {
    loading.value = true;
    const response = await api.get(`/api/users/${route.params.id}`);
    workerData.value = response.data;
    // renderCalendar();
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};
const showFullView = () => {
  fullWidthView.value = !fullWidthView.value;
};

const workerTasksStats = ref({});
const getWorkerTodayTask = async () => {
  try {
    const resp = await api.get(`/api/task/worker-today/${props.workerId}/`);
    workerTasksStats.value = resp.data.stats;
    if (refresh) {
      notyf.green("Tasks list Refreshed");
    }
  } catch (err) {
    console.log(err);
  }
};

onMounted(async () => {
  await getContractorDetailHandler();
  //   await getTasksHandler();
  //   renderCalendar();
  //   getWorkerTodayTask();
});
</script>

<template>
  <div class="lifestyle-dashboard lifestyle-dashboard-v3">
    <div class="illustration-header">
      <div class="p-4">
        <VAvatar size="xl" squared :picture="workerData.avatar" alt="" />
      </div>
      <div class="header-meta">
        <h3>{{ loading ? "Loading..." : workerData?.username }}</h3>
        <!-- <p>Monitor your activity and keep improving your weak points.</p> -->
        <div class="summary-stats">
          <div class="summary-stat">
            <span>{{ loading ? "Loading..." : workerData?.role }}</span>
            <span>Role</span>
          </div>
          <div class="summary-stat">
            <span>{{
              loading
                ? "Loading..."
                : workerData?.is_active
                ? "Active"
                : " In-Active"
            }}</span>
            <span>Status</span>
          </div>
          <div class="summary-stat">
            <span>{{
              loading
                ? "Loading..."
                : workerData?.phoneNumber
                ? workerData?.phoneNumber
                : "N/A"
            }}</span>
            <span>Phone</span>
          </div>
          <div class="summary-stat">
            <span>{{ loading ? "Loading..." : workerData?.email }}</span>
            <span>Email</span>
          </div>
          <div class="summary-stat h-hidden-tablet-p">
            <span>{{
              loading ? "Loading..." : workerData.is_sentMail ? "On" : "Off"
            }}</span>
            <span>Email Notification</span>
          </div>
        </div>
      </div>
    </div>

    <div class="columns is-multiline is-flex-tablet-p">
      <div class="list-flex-toolbar is-reversed">
        <div class="tabs-inner">
          <div class="tabs is-boxed">
            <ul>
              <li :class="[tab === 'tasks' && 'is-active']">
                <a
                  tabindex="0"
                  role="button"
                  @keydown.space.prevent="tab = 'tasks'"
                  @click="tab = 'tasks'"
                  ><span>Tasks</span></a
                >
              </li>
              <li :class="[tab === 'workers' && 'is-active']">
                <a
                  tabindex="0"
                  role="button"
                  @keydown.space.prevent="tab = 'workers'"
                  @click="tab = 'workers'"
                  ><span>Workers</span></a
                >
              </li>
              <!-- <li :class="[tab === 'today' && 'is-active']">
                <a
                  tabindex="0"
                  role="button"
                  @keydown.space.prevent="tab = 'today'"
                  @click="tab = 'today'"
                  ><span>Today Tasks</span></a
                >
              </li> -->
              <li class="tab-naver" />
            </ul>
          </div>
        </div>
      </div>
      <div v-if="tab == 'tasks'" class="column is-12">
        <WorkerTasks :workerId="route.params.id" />
      </div>
      <div v-if="tab == 'workers'" class="column is-12">
        <WorkersOfSubcontractors
          :supplier-id="route.params.id"
        ></WorkersOfSubcontractors>
      </div>
    </div>
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
    background: #202944;
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
