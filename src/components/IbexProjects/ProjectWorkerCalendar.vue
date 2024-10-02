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
  <div>
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

    <!-- <UpdateTask
      v-if="isTaskFormOpen"
      :isOpen="isTaskFormOpen"
      :taskId="editTaskId"
      :projectID="projectID"
      :startDate="startDate"
      @update:OnSuccess="
        () => {
          getProjectHandler(), getTasksHandler();
        }
      "
      @update:modalHandler="
        () => {
          isTaskFormOpen = false;
          console.log('Falling in main');
        }
      "
    /> -->
  </div>
</template>
<style lang="scss">
.fc-event.fc-event-draggable {
  margin-right: 1px;
  border-radius: 4px;
  border: none;
  p {
    color: #fff;
  }
}

.fc-event {
  margin-bottom: 6px !important;
}
</style>
<style lang="scss" scoped>
.fc-h-event {
  border-width: thick !important;
  border-radius: 2px !important;
  margin-bottom: 10px !important;
}

.avatars {
  display: flex;
  list-style-type: none;
  margin: auto;
  padding: 0px;
  flex-direction: row;
}

.avatars:hover .avatars__item {
  margin-right: 10px;
}

.avatars__item {
  background-color: #596376;
  border: 1px solid white;
  border-radius: 100%;
  color: #ffffff;
  display: block;
  font-family: sans-serif;
  font-size: 10px;
  font-weight: 100;
  height: 30px;
  width: 30px;
  line-height: 20px;
  text-align: center;
  transition: margin 0.1s ease-in-out;
  overflow: hidden;
  margin-left: -10px;
  transition: all 0.4s ease-in-out;
}

.avatars__item > img {
  width: 100%;
}
</style>
<style lang="scss">
.datatable-toolbar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  &.is-reversed {
    flex-direction: row-reverse;
  }

  .field {
    margin-bottom: 0;

    .control {
      .button {
        color: var(--light-text);

        &:hover,
        &:focus {
          background: var(--primary);
          border-color: var(--primary);
          color: var(--primary--color-invert);
        }
      }
    }
  }

  .buttons {
    margin-left: auto;
    margin-bottom: 0;

    .v-button {
      margin-bottom: 0;
    }
  }
}

.is-dark {
  .datatable-toolbar {
    .field {
      .control {
        .button {
          background: var(--dark-sidebar) !important;
          color: var(--light-text);

          &:hover,
          &:focus {
            background: var(--primary) !important;
            border-color: var(--primary) !important;
            color: var(--smoke-white) !important;
          }
        }
      }
    }
  }
}
</style>
