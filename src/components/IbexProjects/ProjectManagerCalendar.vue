<script lang="ts" setup>
import FullCalendar from "@fullcalendar/vue3";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useUserSession } from "/@src/stores/userSession";
import { formatISO } from "date-fns";
import { useNotyf } from "/@src/composable/useNotyf";
import { useApi } from "/@src/composable/useAPI";
import { formatDate } from "/@src/composable/useSupportElement";

const api = useApi();
const calendarRef = ref(null);

const userSession = useUserSession();
const notyf = useNotyf();
const loading = ref(false);
const fullWidthView = ref(false);
const activeFilter = ref("all");
const query = ref("");
const tasks = ref([]);
const filteredResources = ref([]);
const projects = ref([]);
const projectID = ref<any>(0);
const selectedWorkerName = ref("");
const startDate = ref<any>("");
const endDate = ref<any>("");
const selectedWorkerId = ref(0);
const showWorkerChart = ref(true);
const isTaskFormOpen = ref<any>(false);
const editTaskId = ref<any>("");

const colors = ref({
  pending: "#8392ab",
  active: "#fbcf33",
  completed: "#82d616",
  canceled: "#344767",
});

const calendarOptions = ref({
  plugins: [resourceTimelinePlugin, interactionPlugin],
  schedulerLicenseKey: "0965592368-fcs-1694657447",
  initialView: "resourceTimelineMonth", // Set the default view to yearly
  initialDate: new Date().toISOString(), // F
  height: "auto",
  themeSystem: "cerulean",
  resourceAreaWidth: "20%",
  resourcesInitiallyExpanded: false,
  selectable: true,
  dragScroll: true,
  eventOrder: "start",
  resourceOrder: "start",
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
  resourceAreaHeaderContent: "Projects",
  // resourceGroupField: "project",
  resources: [],
  events: [],
  eventDrop: (info: any) => {
    eventChangeHandler(info);
    info.revert();
  },
  eventResize: (info: any) => {
    eventChangeHandler(info);
  },

  select: (info: any) => {
    if (userSession.user.role === "contractor") {
      return;
    }
    if (
      userSession.user.role === "manager" &&
      !info.resource.extendedProps.managers.includes(userSession.user.id)
    ) {
      return;
    }
    console.log("start date", info.startStr);
    editTaskId.value = 0;
    projectID.value = info.resource.extendedProps.project;
    startDate.value = info.startStr;
    endDate.value = info.endStr;
    isTaskFormOpen.value = true;
  },
});

const eventChangeHandler = (info: any) => {
  console.warn("inside func");
  console.log("inside ", userSession.user.role);

  if (userSession.user.role === "contractor") {
    info.revert();
    return;
  } else if (userSession.user.role === "manager") {
    if (!info.event.extendedProps.managers.includes(userSession.user.id)) {
      info.revert();

      notyf.error(
        "You can modify the task only for the projects for which you are a manager."
      );
      return;
    }
  }

  let start = info.event.startStr;
  let end = info.event.end.toISOString().substring(0, 10);
  console.log("resource ids", info.event);
  console.log("event", info.event);
  if (info.event.id != info.event._def.publicId) {
    info.revert();
    return;
  }

  if (
    !confirm(
      `Are you sure you want to update the project ${info.event.title} date from ${start} to ${end}?`
    )
  ) {
    info.revert();
  } else {
    editTask(info.event.id, start, end);
  }
};

const addOneDayToDate = (dateString: any) => {
  let date = new Date(dateString);
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
};

const workerImageClick = (worker: any) => {
  window.location.hash = "";
  selectedWorkerId.value = worker.id;
  selectedWorkerName.value = worker.username;
  window.location.hash = "workerCalendar";
};

const eventClick = (info: any) => {
  console.log(info.event);
  if (userSession.user.role === "contractor") {
    return;
  }
  if (userSession.user.role === "manager") {
    if (!info.event.extendedProps.managers.includes(userSession.user.id)) {
      notyf.error(
        "You can modify the task only for the projects for which you are a manager"
      );
      return;
    }
  }
  startDate.value = "";
  isTaskFormOpen.value = true;
  projectID.value = 0;
  editTaskId.value = info.event.id;
};

const editTask = async (id: any, start: any, end: any) => {
  try {
    await api.patch(`/api/task/${id}/`, {
      startDate: start,
      endDate: end,
      schedule_mode: false,
      // schedule_mode: store.state.isScheduleMode,
    });

    notyf.success("Task updated successfully");
    await getProjectHandler();
    await getTasksHandler();
    renderCalender();
  } catch (err) {
    notyf.error("Something went wrong");
    console.log(err);
  }
};

const editProject = async (id: any, start: any, end: any) => {
  try {
    let resp = await api.patch(`/api/project/${id}/`, {
      startDate: start,
      endDate: end,
    });
    console.log(resp);
    notyf.success("Project updated successfully");
  } catch (err) {
    notyf.error("Something went wrong");
    console.log(err);
  }
};

const getManagersById = (id: any) => {
  const project = projects.value.find((project) => project.id === id);
  if (project) {
    return project.managers;
  } else {
    return [];
  }
};

const renderCalender = () => {
  console.log(projects.value);

  // Map projects to background events
  const bgEvents = projects.value.map((project) => ({
    id: project.id,
    resourceId: project.id,
    start: project.startDate,
    end: project.endDate,
    title: project.title,
    display: "background",
    color: project.color,
  }));

  // Map tasks to events
  const events = tasks.value.map((task) => ({
    id: task.id,
    resourceId: task.id,
    project: task.project,
    start: task.startDate,
    end: addOneDayToDate(task.endDate),
    title: task.title,
    color: task.color,
    description: task.description,
    workers: task.workers,
    borderColor: colors[task.status],
    managers: getManagersById(task.project),
  }));

  // Merge all events
  let sortedEvents = [...events, ...bgEvents];

  let allNew = sortedEvents.sort(
    (a, b) => new Date(a.start) - new Date(b.start)
  );

  const allEvents = allNew;
  console.log("events rea", allEvents);
  // Map tasks as child resources of their respective projects
  const projectResources = projects.value.map((project) => {
    const taskResources = tasks.value
      .filter((task) => task.project === project.id)
      .map((task) => ({
        id: task.id,
        title: task.title,
        project: task.project,
        initiallyExpanded: true, // Child resources collapsed by default
      }));

    return {
      id: project.id,
      title: project.title,
      eventBackgroundColor: project.color,
      project: project.id,
      initiallyExpanded: true, // Parent resource expanded
      children: taskResources, // Tasks as child resources
    };
  });

  // Assign sorted resources and events to calendar options
  calendarOptions.value.resources = projectResources;
  calendarOptions.value.events = allEvents;
};

const changeFilterHandler = () => {
  console.log("func called", activeFilter.value);

  if (activeFilter.value !== "all") {
    let data = projects.value.filter(
      (project) => project.status === activeFilter.value
    );
    filteredResources.value = data;
  } else {
    filteredResources.value = projects.value;
  }

  if (query.value) {
    filteredResources.value = projects.value.filter((project) =>
      project.title.toLowerCase().includes(query.value.toLowerCase())
    );
  }

  calendarOptions.value.resources = filteredResources.value;
  console.log(filteredResources.value);
  console.log(filteredResources.value.length);
};

const getProjectHandler = async () => {
  try {
    loading.value = true;
    console.log("inside all projects func");

    const response = await api.get("/api/project/projects/", {});
    let newData = response.data;
    // projects.value = newData;
    // filteredResources.value = newData;

    let sortedData = newData
      .filter(
        (project) => project.startDate && !isNaN(new Date(project.startDate))
      )
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

    projects.value = sortedData;
    console.log("projects", sortedData);
    filteredResources.value = sortedData; // Use sorted data for filteredResources
  } catch (err) {
    console.error(err);
    projects.value = [];
    filteredResources.value = [];
  } finally {
    loading.value = false;
  }
};

const getTasksHandler = async () => {
  try {
    loading.value = true;
    const response = await api.get("/api/task/", {});
    let newData = response.data;

    // Validate and sort tasks
    let sortedData = newData
      .filter((task) => task.startDate && !isNaN(new Date(task.startDate))) // Ensure valid dates
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    tasks.value = sortedData;
  } catch (err) {
    console.error("Error fetching tasks:", err);
    tasks.value = [];
  } finally {
    loading.value = false;
  }
};

const toggleFullScreen = () => {
  fullWidthView.value = !fullWidthView.value;
  const fullScreenCalender = document.getElementById("fullCalendarView");
};

watch(activeFilter, (newValue, oldValue) => {
  changeFilterHandler();
});

const getCalendarData = async () => {
  await Promise.all([getProjectHandler(), getTasksHandler()]);

  await renderCalender();
};

onMounted(async () => {
  await getCalendarData();
  showWorkerChart.value = true;
});

// const getCalendarData = async () => {
//   await getProjectHandler(), await getTasksHandler();
//   await renderCalender();
// };

// onMounted(async () => {
//   await getCalendarData();
//   showWorkerChart.value = true;
// });
</script>

<template>
  <div>
    <form @submit.prevent="changeFilterHandler">
      <div class="datatable-toolbar">
        <VField elevated>
          <VControl icon="fas fa-search">
            <VInput
              type="text"
              placeholder="Search projects..."
              v-model="query"
              @input="changeFilterHandler()"
              class=""
            />
          </VControl>
        </VField>
        <div v-if="loading" class="rota-loader"></div>

        <VButtons>
          <VDropdown class="mr-1" title="Select project filter" right spaced>
            <template #content>
              <a
                @click="
                  () => {
                    changeFilterHandler();
                    activeFilter = 'all';
                  }
                "
                class="dropdown-item is-media"
                :class="activeFilter == 'all' ? 'is-active' : ''"
              >
                <div class="icon">
                  <i class="lnil lnil-menu" aria-hidden="true"></i>
                </div>
                <div class="meta">
                  <span>All</span>
                  <span>All projects owned by company</span>
                </div>
              </a>
              <a
                href="#"
                @click="
                  () => {
                    changeFilterHandler();
                    activeFilter = 'active';
                  }
                "
                :class="activeFilter == 'active' ? 'is-active' : ''"
                class="dropdown-item is-media"
              >
                <div class="icon">
                  <i class="lnil lnil-play" aria-hidden="true"></i>
                </div>
                <div class="meta">
                  <span>Active</span>
                  <span>Projects that are in progress</span>
                </div>
              </a>
              <a
                @click="
                  () => {
                    changeFilterHandler();
                    activeFilter = 'pending';
                  }
                "
                :class="activeFilter == 'pending' ? 'is-active' : ''"
                class="dropdown-item is-media"
              >
                <div class="icon">
                  <i class="lnil lnil-alarm-clock" aria-hidden="true"></i>
                </div>
                <div class="meta">
                  <span>Pending</span>
                  <span>Projects listed but not started</span>
                </div>
              </a>
              <hr class="dropdown-divider" />
              <a
                @click="
                  () => {
                    changeFilterHandler();
                    activeFilter = 'completed';
                  }
                "
                :class="activeFilter == 'completed' ? 'is-active' : ''"
                class="dropdown-item is-media"
              >
                <div class="icon">
                  <i class="lnil lnil-round-box-check" aria-hidden="true"></i>
                </div>
                <div class="meta">
                  <span>Completed</span>
                  <span>Projects that are done</span>
                </div>
              </a>
            </template>
          </VDropdown>

          <!-- <VButton elevated raised color="dark" @click="toggleFullScreen()">
            <i :class="fullWidthView ? 'fa fa-compress' : 'fa fa-expand'"></i>
          </VButton> -->
        </VButtons>
      </div>
    </form>
    <FullCalendar :options="calendarOptions" ref="calendarRef">
      <template v-slot:eventContent="arg">
        <div style="height: 100%; position: relative">
          <p
            v-if="arg.event?.display == 'background'"
            style="
              font-weight: 500;
              margin-bottom: 0px;
              padding-left: 10px;
              color: black;
            "
          >
            Job: {{ arg.event.title }}
          </p>

          <div
            v-else
            @click="eventClick(arg)"
            style="
              display: flex;
              flex-wrap: wrap;
              align-items: center;
              justify-content: space-between;
            "
          >
            <p
              style="
                font-weight: 500;
                margin-bottom: 0px;
                padding-left: 10px;
                padding-right: 10px;
                z-index: 99;
                text-shadow: 2px 2px 2px black;
              "
            >
              <!-- v-if="
                formatDate(arg.event.start)
                  .slice(-7)
                  .replace(',', '')
                  .replace(' ', '')
                  .toString() !=
                formatDate(arg.event.end)
                  .slice(-7)
                  .replace(',', '')
                  .replace(' ', '')
                  .toString()
              " -->
              <span
                v-for="worker in arg.event.extendedProps?.workers"
                :key="worker.id"
              >
                {{ worker.username }},
                <!-- {{
                  formatDate(arg.event.start)
                    .slice(-7)
                    .replace(",", "")
                    .replace(" ", "")
                    .toString()
                }}
                {{
                  formatDate(arg.event.end)
                    .slice(-7)
                    .replace(",", "")
                    .replace(" ", "")
                    .toString()
                }} -->
              </span>
            </p>
            <div
              class="avatars"
              v-if="arg.event.extendedProps?.workers?.length"
            >
              <div
                class="avatars__item"
                v-for="worker in arg.event.extendedProps.workers"
                :key="worker.id"
              >
                <Tippy>
                  <img
                    v-if="worker.avatar"
                    :src="worker.avatar"
                    alt=""
                    @click="workerImageClick(worker)"
                    :title="worker.username"
                    data-bs-toggle="tooltip"
                    data-bs-placement="bottom"
                    :data-bs-original-title="
                      worker.username ? worker.username : 'Hi'
                    "
                  />
                  <template #content>
                    <div class="v-popover-content is-text">
                      <div class="popover-head">
                        <VAvatar :picture="worker.avatar" size="small" />
                        <h4 class="dark-inverted">
                          {{ worker.username ? worker.username : "" }}
                        </h4>
                      </div>
                      <div class="popover-body">
                        <p>{{ arg.event?.title }}</p>
                      </div>
                    </div>
                  </template>
                </Tippy>

                <div
                  v-if="arg.event.extendedProps?.workers?.length == 0"
                  @click="workerImageClick(worker)"
                  data-bs-toggle="tooltip"
                  data-bs-placement="bottom"
                  :data-bs-original-title="
                    worker.username ? worker.username : 'Hi'
                  "
                  :title="worker.username"
                  style="
                    width: 100%;
                    height: 100%;
                    background-color: #292f3c;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  "
                >
                  <h6
                    class="mb-0"
                    style="color: white"
                    data-bs-toggle="tooltip"
                    data-bs-placement="bottom"
                    :data-bs-original-title="
                      worker.username ? worker.username : 'Hi'
                    "
                    :title="worker.username"
                  >
                    {{ worker.username ? worker.username.slice(0, 2) : "AA" }}
                  </h6>
                </div>

                <p>{{ worker.username }}</p>
              </div>
            </div>
            <p
              v-if="
                !arg.event.extendedProps?.workers?.length &&
                arg.event?.display != 'background'
              "
              style="font-weight: 500; margin-bottom: 0px; padding-left: 10px"
            >
              No worker is assigned yet
            </p>
          </div>
        </div>
      </template>
    </FullCalendar>

    <UpdateTask
      v-if="isTaskFormOpen"
      :isOpen="isTaskFormOpen"
      :taskIdSelected="editTaskId"
      :projectID="projectID"
      :startDate="startDate"
      :endDate="endDate"
      @update:OnSuccess="getCalendarData"
      @update:modalHandler="
        () => {
          isTaskFormOpen = false;
          console.log('Falling in main');
        }
      "
    />
  </div>
</template>
<style lang="scss">
.fc-event.fc-event-draggable {
  margin-right: 1px;
  border-width: 1px;
  border-radius: 4px;
  height: 100% !important;
  padding: 0.6rem !important;
  p {
    color: #fff;
  }
}
.fc-event {
  margin-bottom: 0px !important;
}
</style>
<style lang="scss" scoped>
.fc-h-event {
  border-width: thick !important;
  border-radius: 2px !important;
  margin-bottom: 1px !important;
}

.avatars {
  display: flex;
  position: absolute;
  right: -20%; /* Move it outside of the parent element */
  top: 50%; /* Center vertically within parent */
  transform: translateY(-50%); /* Adjust for vertical centering */
  list-style-type: none;
  margin: 0;
  padding: 0;
  flex-direction: row;
  align-items: center;
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
