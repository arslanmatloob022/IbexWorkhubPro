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
const projects = ref([]);

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
  resourceAreaWidth: "20%",
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
  resourceAreaHeaderContent: "Projects",
  resources: [],
  eventClick: (info: any) => {
    if (userSession.user.role === "manager") {
      if (
        !info.event.extendedProps.managers.some(
          (item) => item.id === userSession.user.id
        )
      ) {
        notyf.success("You are not allowed to perform this action.");
        return;
      }
    }
    isProjectFormOpen.value = true;
    editProjectId.value = info.event.id;
  },
  eventDrop: (info: any) => {
    let start = info.event.startStr;
    let end = info.event.end.toISOString().substring(0, 10);
    console.log("resource ids", info.event._def.resourceIds[0]);
    console.log(info.event.extendedProps.project);
    if (info.event.extendedProps.project !== info.event._def.resourceIds[0]) {
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
      editProject(info.event.id, start, end);
    }
  },
  eventResize: (info: any) => {
    let start = info.event.startStr;
    let end = info.event.end.toISOString().substring(0, 10);
    console.log(info.event);
    if (
      !confirm(
        `Are you sure you want to update the project ${info.event.title} date from ${start} to ${end}?`
      )
    ) {
      info.revert();
    } else {
      editProject(info.event.id, start, end);
    }
  },
});

const addOneDayToDate = (dateString: any) => {
  let date = new Date(dateString);
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
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

const renderCalender = () => {
  console.log(projects.value);
  const events = projects.value.map((project) => ({
    id: project.id,
    resourceId: project.id,
    project: project.id,
    start: project.startDate,
    end: addOneDayToDate(project.endDate),
    title: project.title,
    description: project.description,
    total_tasks: project.total_tasks,
    managers: project.managers,
    borderColor: colors[project.status],
  }));
  calendarOptions.value.resources = projects.value;
  calendarOptions.value.events = events;
};

const getProjectHandler = async () => {
  try {
    loading.value = true;
    console.log("inside all projects func");
    const response = await api.get("/api/project/", {});
    projects.value = response.data;
    console.log("scratch projects", projects.value);
    loading.value = false;
  } catch (err) {
    console.error(err);
    projects.value = [];
    loading.value = false;
  }
};

onMounted(async () => {
  await getProjectHandler();
  renderCalender();
  console.log("projects", calendarOptions.value);
});
</script>

<template>
  <div>
    <FullCalendar v-if="!loading" :options="calendarOptions">
      <template v-slot:eventContent="arg">
        <div
          style="
            display: flex;
            border-radius: 6px;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
          "
        >
          <div>
            <span
              @click="() => {}"
              style="font-weight: 500; margin-bottom: 0px; padding-left: 10px"
              >{{ arg.event.title }}
            </span>
            <span> -- tasks ({{ arg.event.extendedProps.total_tasks }})</span>
          </div>

          <div class="avatars">
            <div
              class="avatars__item"
              v-for="worker in arg.event.extendedProps.managers"
              :key="worker.id"
            >
              <Tippy>
                <img v-if="worker.avatar" :src="worker.avatar" alt="" />
                <div
                  v-else
                  style="
                    width: 100%;
                    height: 100%;
                    background-color: #292f3c;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  "
                >
                  <h6 class="mb-0" style="color: white">
                    {{ worker.username ? worker.username.slice(0, 2) : "AA" }}
                  </h6>
                </div>
                <template #content>
                  <div class="v-popover-content is-text">
                    <div class="popover-head">
                      <VAvatar :picture="worker.avatar" size="small" />
                      <h4 class="dark-inverted">
                        {{ worker.username ? worker.username : "" }}
                      </h4>
                    </div>
                    <div class="popover-body">
                      <p>
                        {{ arg.event?.title }}
                      </p>
                    </div>
                  </div>
                </template>
              </Tippy>
            </div>
          </div>
        </div>
      </template>
    </FullCalendar>
  </div>
</template>
<style lang="scss">
.fc-event.fc-event-draggable {
  margin-right: 1px;
  border-width: 1px;
  border-radius: 4px;
  height: 100% !important;
  padding: 0.2rem !important;
  p {
    color: #fff;
  }
  span {
    color: #fff;
  }
}
.fc-event {
  margin-bottom: 0px !important;
}
</style>
<style lang="scss" scoped>
.filter-tabs {
  height: 60px;
}
.filter-tabs > button {
  margin-right: 12px;
  border: 5px solid transparent;
}
.fc-h-event {
  border-width: thick !important;
  border-radius: 2px !important;
  margin-bottom: 1px !important;
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
  background-color: #2aac8e !important;
  background: #2aac8e !important;
  border: 1px solid #2aac8e;
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
