<script lang="ts" setup>
import FullCalendar from "@fullcalendar/vue3";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import interactionPlugin from "@fullcalendar/interaction";
import { useUserSession } from "/@src/stores/userSession";
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
const selectedWorkerId = ref("");
const showWorkerChart = ref(true);
const isTaskFormOpen = ref<any>(false);
const editTaskId = ref<any>("");
const workerTasksModal = ref(false);
const colors = ref({
  pending: "#8392ab",
  active: "#fbcf33",
  completed: "#82d616",
  canceled: "#344767",
});

const SweetAlertProps = ref({
  title: "",
  subtitle: "test",
  isSweetAlertOpen: false,
  btntext: "text",
});

const calendarOptions = ref({
  plugins: [resourceTimelinePlugin, interactionPlugin],
  schedulerLicenseKey: "0965592368-fcs-1694657447",
  initialView: "resourceTimelineYear",
  initialDate: new Date().toISOString().split("T")[0],
  height: "auto",
  themeSystem: "cerulean",
  resourceAreaWidth: "16%",
  slotMinHeight: 20,
  resourcesInitiallyExpanded: false,
  selectable: true,
  dragScroll: true,
  resourceClickable: true,
  nowIndicator: true,
  eventOrder: "start",
  resourceOrder: "start",
  headerToolbar: {
    left: "today prev,next",
    center: "title",
    right: "resourceTimelineWeek,resourceTimelineMonth,resourceTimelineYear",
  },
  resourceAreaHeaderContent: "Projects",
  resources: [],
  events: [],
  buttonText: {
    today: "Today",
    resourceTimelineWeek: "Week",
    resourceTimelineMonth: "Month",
    resourceTimelineYear: "Year",
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
    resourceTimelineYear: {
      type: "resourceTimeline",
      duration: { month: 12 },
      titleFormat: { year: "numeric" },
      title: "Year",
      slotLabelFormat: [
        { month: "short" },
        { day: "numeric" },
        { weekday: "short" },
      ],
      slotMinWidth: 30,
      dayMinWidth: 30,
      slotMinHeight: 28,
      dayMinHeight: 26,
    },
  },
  eventDidMount: function (info) {
    if (
      info.el &&
      info.event &&
      info.event._def &&
      info.event._def.resourceIds
    ) {
      const resourceId = info.event._def.resourceIds[0]; // assuming one resource per event
      info.el.setAttribute("data-resource-id", resourceId);
    }
  },
  resourceLabelDidMount: function (info) {
    const resource = info.resource;

    info.el.style.cursor = "pointer";
    info.el.style.color = "blue";

    info.el.addEventListener("click", function () {
      console.log("Clicked resource:", resource.title, resource.id);

      setTimeout(() => {
        const resourceRow = document.querySelector(
          `.fc-event[data-resource-id="${resource.id}"]`
        );

        if (resourceRow) {
          resourceRow.scrollIntoView({
            behavior: "smooth",
            inline: "center",
            block: "center",
          });
        }
      }, 100);
    });
  },
  dayCellDidMount: function (info) {
    const day = info.date.getDay();

    if (day === 0 || day === 6) {
      info.el.classList.add("fc-day-sat", "fc-day-sun");
    }
  },

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
    editTaskId.value = 0;
    projectID.value = info.resource.extendedProps.project;
    startDate.value = info.startStr;
    endDate.value = info.endStr;
    isTaskFormOpen.value = true;
  },
});

const eventChangeHandler = (info: any) => {
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

  if (info.event.id != info.event._def.publicId) {
    info.revert();
    return;
  }

  SweetAlertProps.value = {
    title: "Confirm Update",
    subtitle: `Are you sure you want to update the project "${info.event.title}" date from ${start} to ${end}?`,
    btntext: "Confirm",
    isSweetAlertOpen: true,
    onConfirm: () => {
      editTask(info.event.id, start, end);
      SweetAlertProps.value.isSweetAlertOpen = false;
    },
    onCancel: () => {
      SweetAlertProps.value.isSweetAlertOpen = false;
      info.revert();
    },
  };
};

const addOneDayToDate = (dateString: any) => {
  let date = new Date(dateString);
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
};

const workerImageClick = (worker: any) => {
  selectedWorkerId.value = worker.id;
  selectedWorkerName.value = worker.username;
  workerTasksModal.value = true;
  // window.location.hash = "workerCalendar";
};

const eventClick = (info: any) => {
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
  projectID.value = 0;
  editTaskId.value = info.event.id;
  isTaskFormOpen.value = true;
};

const editTask = async (id: any, start: any, end: any) => {
  try {
    await api.patch(`/api/task/${id}/`, {
      startDate: start,
      endDate: end,
      schedule_mode: false,
    });

    notyf.success("Task updated successfully");
    await getProjectHandler();
    await getTasksHandler();
    renderCalender();
  } catch (err) {
    notyf.error("Something went wrong");
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
  const bgEvents = projects.value.map((project: any) => ({
    id: project.id,
    resourceId: project.id,
    start: project.startDate,
    end: project.endDate,
    title: project.title,
    display: "background",
    color: project.color,
  }));

  const events = tasks.value.map((task: any) => ({
    id: task.id,
    resourceId: task.id,
    project: task.project,
    start: task.startDate,
    end: addOneDayToDate(task.endDate),
    title: task.title,
    color: task.color,
    description: task.description,
    workers: task.workers,
    borderColor: colors[task?.status],
    managers: getManagersById(task.project),
  }));

  let sortedEvents = [...events, ...bgEvents];
  let allNew = sortedEvents.sort(
    (a, b) => new Date(a.start) - new Date(b.start)
  );

  const allEvents = allNew;
  const projectResources = projects.value.map((project) => {
    const taskResources = tasks.value
      .filter((task) => task.project === project.id)
      .map((task) => ({
        id: task.id,
        title: task.title,
        project: task.project,
        initiallyExpanded: true,
      }));

    return {
      id: project.id,
      title: project.title,
      eventBackgroundColor: project.color,
      project: project.id,
      initiallyExpanded: true,
      children: taskResources,
      extendedProps: {
        isSubResource: false,
      },
    };
  });
  calendarOptions.value.resources = projectResources;
  calendarOptions.value.events = allEvents;
};

const changeFilterHandler = () => {
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
};

const getProjectHandler = async () => {
  try {
    loading.value = true;

    const response = await api.get("/api/project/projects/", {});
    let newData = response.data;
    projects.value = newData;
    filteredResources.value = newData; // Use sorted data for filteredResources
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

    let newTasks = newData.map((item) => {
      return {
        ...item,
        workers: item.workers.map((worker) => ({
          ...worker,
          picture: worker.avatar || "default-avatar.png", // Use a default picture if avatar is null
          initials: worker.username
            ? worker.username.slice(0, 2).toUpperCase()
            : "N/A",
        })),
      };
    });

    tasks.value = newTasks;
  } catch (err) {
    console.error("Error fetching tasks:", err);
    tasks.value = [];
  } finally {
    loading.value = false;
  }
};

watch(activeFilter, (newValue, oldValue) => {
  changeFilterHandler();
});

const getCalendarData = async () => {
  loading.value = true;
  await Promise.all([getProjectHandler(), getTasksHandler()]);

  await renderCalender();
  loading.value = false;
};

onMounted(async () => {
  await getCalendarData();
  showWorkerChart.value = true;
  document.querySelectorAll(".fc-datagrid-cell-cushion").forEach((el) => {
    el.addEventListener("click", () => {
      const resourceId = el
        .closest("[data-resource-id]")
        ?.getAttribute("data-resource-id");
      if (resourceId) {
        console.log("Clicked resource ID:", resourceId);
      }
    });
  });
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
            style="font-weight: 500; margin-bottom: 0px; color: black"
          >
            Job: {{ arg.event.title }}
          </p>

          <div
            v-else
            style="
              display: flex;
              flex-wrap: wrap;
              align-items: center;
              justify-content: space-between;
            "
          >
            <p
              @click="eventClick(arg)"
              style="
                font-weight: 500;
                margin-bottom: 0px;
                padding-left: 1px;
                padding-right: 1px;
                z-index: 99;
                text-shadow: 2px 2px 2px black;
              "
            >
              <span
                v-for="worker in arg.event.extendedProps?.workers"
                :key="worker.id"
              >
                {{ worker.username }},
              </span>
            </p>
            <div
              class="avatars"
              v-if="arg.event.extendedProps?.workers?.length"
            >
              <div
                class="avatars__item"
                v-for="worker in arg.event.extendedProps?.workers"
                :key="worker.id"
              >
                <!-- <VAvatar
                  @click="workerImageClick(worker)"
                  :picture="worker.avatar"
                /> -->
                <img
                  v-if="worker.avatar"
                  :src="worker.avatar"
                  @click="workerImageClick(worker)"
                  :title="worker.username"
                  :data-bs-original-title="
                    worker.username
                      ? worker.username.slice(0, 2).toUpperCase()
                      : 'Hi'
                  "
                />

                <!-- data-bs-toggle="tooltip" -->
                <div
                  v-if="arg.event.extendedProps?.workers?.length == 0"
                  @click="workerImageClick(worker)"
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
                    @click="workerImageClick(worker)"
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

                <p @click="workerImageClick(worker)">{{ worker.username }}</p>
              </div>
              <!-- <VAvatarStack
                :avatars="arg.event.extendedProps?.workers"
                size="small"
              >
              </VAvatarStack> -->
            </div>
            <p
              v-if="
                !arg.event.extendedProps?.workers?.length &&
                arg.event?.display != 'background'
              "
              @click="eventClick(arg)"
              style="font-weight: 500; margin-bottom: 0px; padding-left: 10px"
            >
              No worker is assigned yet
            </p>
          </div>
        </div>
      </template>
    </FullCalendar>

    <WorkersTaskCalendarModal
      v-if="workerTasksModal"
      :workerTasksModal="workerTasksModal"
      :workerId="selectedWorkerId"
      :workerName="selectedWorkerName"
      @update:modalHandler="workerTasksModal = !workerTasksModal"
    />
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
        }
      "
    />
  </div>
  <SweetAlert
    v-if="SweetAlertProps.isSweetAlertOpen"
    :isSweetAlertOpen="SweetAlertProps.isSweetAlertOpen"
    :title="SweetAlertProps.title"
    :loading="false"
    :subtitle="SweetAlertProps.subtitle"
    :btntext="SweetAlertProps.btntext"
    :onConfirm="SweetAlertProps.onConfirm"
    :onCancel="SweetAlertProps.onCancel"
  />
</template>
<style lang="scss">
.fc-day-sat,
.fc-day-sun {
  background-color: #f2f2f2;
}

.fc-event.fc-event-draggable {
  margin-right: 1px;
  border-width: 1px;
  border-radius: 4px;
  height: 100% !important;
  padding: 0.4rem !important;
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
  right: -60px;
  top: 50%;
  transform: translateY(-50%);
  list-style-type: none;
  margin: 0;
  padding: 0;
  flex-direction: row;
  align-items: center;
}

// .avatars:hover .avatars__item {
//   margin-right: 10px;
// }
.avatars__item {
  background-color: #555;
  border: 1px solid var(--primary);
  border-radius: 100%;
  color: #333;
  display: block;
  font-family: sans-serif;
  font-size: 10px;
  font-weight: 100;
  height: 30px;
  width: 30px;
  line-height: 20px;
  text-align: center;
  // transition: margin 0.1s ease-in-out;
  overflow: hidden;
  // transition: all 0.4s ease-in-out;
}
//margin-left: -10px;

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
