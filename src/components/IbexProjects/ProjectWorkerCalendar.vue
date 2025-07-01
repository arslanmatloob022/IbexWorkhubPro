<script lang="ts" setup>
import FullCalendar from "@fullcalendar/vue3";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useUserSession } from "/@src/stores/userSession";
import { useNotyf } from "/@src/composable/useNotyf";
import { useApi } from "/@src/composable/useAPI";
const api = useApi();
const userSession = useUserSession();
const notyf = useNotyf();
const loading = ref(false);
const isProjectFormOpen = ref(false);
const editProjectId = ref("");
const fullWidthView = ref(false);
const activeFilter = ref("all");
const query = ref("");
const tasks = ref([]);
const filteredResources = ref([]);
const projects = ref([]);
const projectID = ref<any>(0);
const selectedWorkerName = ref("");
const startDate = ref<any>("");
const selectedWorkerId = ref(0);
const showWorkerChart = ref(true);
const isTaskFormOpen = ref<any>(false);
const editTaskId = ref<any>(0);
const dropdownFilters = ref({
  all: "all",
  active: "active",
  pending: "pending",
  completed: "completed",
});

const colors = ref({
  pending: "#8392ab",
  active: "#fbcf33",
  completed: "#82d616",
  canceled: "#344767",
});

const calendarOptions = ref({
  plugins: [resourceTimelinePlugin, interactionPlugin],
  schedulerLicenseKey: "0965592368-fcs-1694657447",
  initialView: "resourceTimelineMonth",
  height: "auto",
  themeSystem: "cerulean",
  resourceAreaWidth: "20%",
  resourceGroupField: "title",
  resourcesInitiallyExpanded: false,
  selectable: true,
  headerToolbar: {
    left: "today prev,next",
    center: "title",
    right: "resourceTimelineWeek,resourceTimelineMonth,resourceTimelineYear",
  },
  editable: true,
  views: {
    resourceTimelineWeek: {
      slotDuration: { days: 1, hours: 1 }, // Each slot represents 1 hour
      slotLabelFormat: {
        weekday: "short",
        month: "numeric",
        day: "numeric",
        year: "numeric",
      },
    },
  },
  resourceAreaHeaderContent: "Workers",
  resources: [],
  resourceId: selectedWorkerId.value,
  // eventDrop: (info: any) => {
  //   console.log(info.event);
  //   eventChangeHandler(info);
  //   // info.revert();
  // },
  // eventResize: (info: any) => {
  //   eventChangeHandler(info);
  // },
  // dateClick: (info: any) => {
  //   if (userSession.user.role === "contractor") {
  //     return;
  //   }
  //   if (
  //     userSession.user.role === "manager" &&
  //     !info.resource.extendedProps.managers.includes(userSession.user.id)
  //   ) {
  //     return;
  //   }
  //   editTaskId.value = 0;
  //   projectID.value = info.resource.id;
  //   startDate.value = info.dateStr;
  //   isTaskFormOpen.value = true;
  // },
});

// const eventChangeHandler = (info: any) => {
//   console.warn("inside func");
//   console.log("inside ", userSession.user.role);

//   if (userSession.user.role === "contractor") {
//     console.log("inside ", userSession.user.role);
//     info.revert();
//     return;
//   } else if (userSession.user.role === "manager") {
//     if (!info.event.extendedProps.managers.includes(userSession.user.id)) {
//       info.revert();

//       notyf.error(
//         "You can modify the task only for the projects for which you are a manager."
//       );
//       return;
//     }
//   }

//   let start = info.event.startStr;
//   let end = info.event.end.toISOString().substring(0, 10);
//   console.log("resource ids", info.event._def.resourceIds[0]);

//   if (info.event.extendedProps.project != info.event._def.resourceIds[0]) {
//     info.revert();
//     return;
//   }

//   if (
//     !confirm(
//       `Are you sure you want to update the project ${info.event.title} date from ${start} to ${end}?`
//     )
//   ) {
//     info.revert();
//   } else {
//     editTask(info.event.id, start, end);
//   }
// };

const addOneDayToDate = (dateString: any) => {
  let date = new Date(dateString);
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
};

// const workerImageClick = (worker: any) => {
//   window.location.hash = "";
//   selectedWorkerId.value = worker.id;
//   selectedWorkerName.value = worker.username;
//   window.location.hash = "workerCalendar";
// };

// const eventClick = (info: any) => {
//   console.log(info.event);
//   if (userSession.user.role === "contractor") {
//     return;
//   }
//   if (userSession.user.role === "manager") {
//     if (!info.event.extendedProps.managers.includes(userSession.user.id)) {
//       notyf.error(
//         "You can modify the task only for the projects for which you are a manager"
//       );
//       return;
//     }
//   }
//   startDate.value = "";
//   isTaskFormOpen.value = true;
//   projectID.value = 0;
//   editTaskId.value = info.event.id;
// };

// const editTask = async (id: any, start: any, end: any) => {
//   try {
//     await api.patch(`/api/task/${id}/`, {
//       startDate: start,
//       endDate: end,
//       schedule_mode: false,
//       // schedule_mode: store.state.isScheduleMode,
//     });

//     notyf.success("Task updated successfully");
//   } catch (err) {
//     notyf.error("Something went wrong");
//     console.log(err);
//   }
// };

// const editProject = async (id: any, start: any, end: any) => {
//   try {
//     let resp = await api.patch(`/api/project/${id}/`, {
//       startDate: start,
//       endDate: end,
//     });
//     console.log(resp);
//     notyf.success("Project updated successfully");
//   } catch (err) {
//     notyf.error("Something went wrong");
//     console.log(err);
//   }
// };

// const getManagersById = (id: any) => {
//   const project = projects.value.find((project) => project.id === id);
//   if (project) {
//     return project.managers;
//   } else {
//     return [];
//   }
// };
const renderCalendar = () => {
  console.log(projects.value);

  const events = [];

  // Loop through tasks and push events for each task

  const resources = [];

  // Loop through workers and push events related to each worker
  workers.value.forEach((worker) => {
    tasks.value.forEach((task) => {
      if (task.workers.includes(worker.id)) {
        events.push({
          id: task.id,
          resourceId: worker.id,
          project: task.project,
          start: task.startDate,
          end: addOneDayToDate(task.endDate),
          title: task.title,
          color: task.color,
          description: task.description,
          borderColor: colors[task.status],
          projectInfo: task.projectInfo,
        });
      }
    });

    // Push workers into resources
    resources.push({
      id: worker.id,
      title: worker.username,
    });
  });

  calendarOptions.value.resources = resources;
  calendarOptions.value.events = [...events]; // Spread the events into a new array
};

const changeFilterHandler = () => {
  let filteredResourcesLocal = [];
  let filteredWorkers = [];
  if (query.value) {
    filteredWorkers = workers.value.filter((worker) =>
      worker.username.toLowerCase().includes(query.value.toLowerCase())
    );
  } else {
    filteredWorkers = workers.value;
  }

  filteredWorkers.forEach((element) => {
    filteredResourcesLocal.push({
      id: element.id,
      title: element.username,
    });
  });

  calendarOptions.value.resources = filteredResourcesLocal;
};
const workers = ref(<any>[]);
const getworkersHandler = async () => {
  try {
    loading.value = true;
    console.log("inside all projects func");
    const response = await api.get("/api/users/by-role/worker/", {});
    workers.value = response.data;
    loading.value = false;
  } catch (err) {
    console.error(err);
    workers.value = [];
    loading.value = false;
  }
};

const getTasksHandler = async () => {
  try {
    const response = await api.get("/api/task/all-tasks/", {});
    tasks.value = response.data;
  } catch (err) {
    tasks.value = [];
  }
};

// const closeProjectForm = async () => {
//   isProjectFormOpen.value = false;
//   editProjectId.value = null;
//   await getProjectHandler();
//   renderCalender();
// };

// watch(activeFilter, (newValue, oldValue) => {
//   changeFilterHandler();
// });

onMounted(async () => {
  await Promise.all([getworkersHandler(), getTasksHandler()]);

  renderCalendar();
  console.log("projects", calendarOptions.value);
  showWorkerChart.value = true;
});
</script>

<template>
  <div class="main-div-worker">
    <form @submit.prevent="changeFilterHandler">
      <div class="datatable-toolbar">
        <VField elevated>
          <VControl icon="fas fa-search">
            <VInput
              type="text"
              placeholder="Search worker..."
              v-model="query"
              @input="changeFilterHandler()"
              class=""
            />
          </VControl>
        </VField>
      </div>
    </form>
    <div class="workers-task-calendar">
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
            <p style="font-weight: 500; margin-bottom: 0px; padding-left: 10px">
              ({{ arg.event.extendedProps.projectInfo.title }})
              {{ arg.event.title }}
            </p>
          </div>
        </template>
      </FullCalendar>
    </div>
  </div>
</template>
<style lang="scss">
@media screen and (max-width: 724px) {
  .workers-task-calendar {
    .fc-toolbar h2 {
      font-size: 0.9rem !important;
      font-weight: bold;
      margin: 0;
    }
    .fc-toolbar {
      display: flex;
      margin-top: 8px;
      padding: 4px;
    }

    .fc-toolbar button {
      background-color: var(--dark);
      color: #ffffff;
      border: none;
      border-radius: 4px;
      padding: 7px 7px;
      font-size: 0.8rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .fc-toolbar button:hover {
      background-color: var(--dark);
      color: #ffffff;
    }
  }
}

.is-dark {
  .workers-task-calendar {
    border-color: var(--dark-sidebar-light-12);

    table {
      border-color: var(--dark-sidebar-light-12);
    }

    th {
      background: var(--dark-light-4) !important;
      border: none;
      color: #f2f2f2 !important;
    }

    .fc .fc-timeline-slot-cushion {
      color: var(--light-text) !important;
    }
    .fc-toolbar button {
      background-color: var(--dark-sidebar-light-4);
      color: #ffffff;
    }

    .fc-toolbar button:hover {
      background-color: var(--dark);
      color: #ffffff;
    }
    .fc-toolbar button:active {
      background-color: var(--primary) !important;
      color: #ffffff;
    }

    .fc-day-today {
      background-color: var(--dark-sidebar-light-12) !important;
      border: 2px solid var(--danger);
    }

    .fc-day-sat,
    .fc-day-sun {
      background-color: var(--dark-sidebar-light-12) !important;
    }
  }
}
</style>
