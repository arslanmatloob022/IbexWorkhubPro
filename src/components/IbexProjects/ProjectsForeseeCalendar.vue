<script lang="ts" setup>
import FullCalendar from "@fullcalendar/vue3";
import interactionPlugin from "@fullcalendar/interaction";
import { useApi } from "/@src/composable/useAPI";
import dayGridPlugin from "@fullcalendar/daygrid";
import multiMonthPlugin from "@fullcalendar/multimonth";
const api = useApi();
const calendarRef = ref(null);
const projectTasks = ref([
  {
    id: "fa8457ac-9e2c-4345-8933-824c6be3de24",
    title: "Masonry Installation",
    description:
      "Time to install the the bricks, lintels, header and sill details (includes patching the flue hole.)",
    startDate: "2025-04-22",
    endDate: "2025-04-28",
    status: "active",
    project_title: "Wilson",
  },
]);
const loading = ref(false);
const tasks = ref([]);
const projectID = ref<any>(0);
const selectedWorkerName = ref("");
const startDate = ref<any>("");
const endDate = ref<any>("");
const selectedWorkerId = ref("");
const calendarStartDate = ref<any>("");
const calendarEndDate = ref<any>("");
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
  plugins: [dayGridPlugin, multiMonthPlugin, interactionPlugin],
  initialView: "dayGridMonth",
  schedulerLicenseKey: "0965592368-fcs-1694657447",
  initialDate: (() => {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1); // First DAY of next month
    return nextMonth.toISOString().split("T")[0];
  })(),

  height: "auto",
  themeSystem: "cerulean",
  dragScroll: true,
  resourceClickable: true,
  nowIndicator: true,
  eventOrder: "start",
  headerToolbar: {
    left: "today prev,next",
    center: "title",
    right: "dayGridWeek,dayGridMonth,dayGridYear",
  },
  events: [],
  buttonText: {
    today: "Today",
    dayGridWeek: "Week",
    dayGridMonth: "Month",
    dayGridYear: "Year",
  },
  editable: true,
  views: {
    dayGridMonth: {
      type: "dayGrid", // Use the dayGrid view
      duration: { months: 3 }, // Set the duration to three months
      buttonText: "3 Months", // Button text for the custom view
    },
  },

  dayCellDidMount: function (info: any) {
    const day = info.date.getDay();

    if (day === 0 || day === 6) {
      info.el.classList.add("fc-day-sat", "fc-day-sun");
    }
    const date = new Date(info.date);
    const day2 = date.getDate();
    if (day2 === 1) {
      info.el.classList.add("fc-month-start");
    }
  },
  datesSet: function (info: any) {
    calendarStartDate.value = info.startStr.substring(0, 10);
    calendarEndDate.value = info.endStr.substring(0, 10);
  },
});

const addOneDayToDate = (dateString: any) => {
  let date = new Date(dateString);
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
};

const renderCalender = () => {
  calendarOptions.value.events = projectTasks.value.map((task: any) => ({
    id: task.id,
    title: task.title,
    start: task.startDate,
    end: addOneDayToDate(task.endDate), // Ensure this function works correctly
    extendedProps: {
      projectTitle: task.project_title,
    },
  }));
  console.log("Events:", calendarOptions.value.events);
};

const getForeseeTasksHandler = async () => {
  try {
    loading.value = true;
    const response = await api.get(
      `/api/project/projects-tasks-by-date-range/?start_date=${calendarStartDate.value}&end_date=${calendarEndDate.value}`
    );
    projectTasks.value = response.data;
    renderCalender();
  } catch (err) {
    console.error("Error fetching tasks:", err);
    tasks.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  getForeseeTasksHandler();
  const calendarApi = calendarRef.value?.getApi();
  if (calendarApi) {
    calendarApi.gotoDate(calendarOptions.value.initialDate);
  }
});
</script>

<template>
  <div id="CalendarStyling">
    <div class="full-calendar-two">
      <FullCalendar :options="calendarOptions" ref="calendarRef">
        <template v-slot:eventContent="arg">
          <div style="height: 100%; position: relative">
            <div
              style="
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                justify-content: space-between;
              "
            >
              <p class="event-title">
                {{ arg.event.extendedProps.projectTitle }} -
                {{ arg.event.title }}
              </p>
            </div>
          </div>
        </template>
      </FullCalendar>
    </div>
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
      @update:OnSuccess="getForeseeTasksHandler"
      @update:modalHandler="
        () => {
          isTaskFormOpen = false;
        }
      "
    />
  </div>
</template>
<style lang="scss">
.calendar-container {
  position: fixed;
  top: 0;
  left: 0;
  min-width: 100%;
  height: 100%;
  z-index: 99;
  padding: 6px;
  overflow: auto;
}
/* Full Calendar Wrapper */
.full-calendar-two {
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: transparent !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 10px;
  td {
    border: 1px solid var(--dark-inverted) !important;
  }

  tr {
    border: none;
  }

  th {
    background: var(--dark) !important;
    border: none;
    color: #0e0c0c !important;
  }

  table {
    border: none;
  }

  /* Calendar Toolbar */
  .fc-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    background-color: transparent !important; /* Blue background */
    color: var(--primary) !important;
    padding: 10px;
    border-radius: 6px;
  }

  .fc-toolbar h2 {
    font-size: 1.5rem;
    font-weight: bold;
    margin: 0;
  }

  .fc-toolbar button {
    background-color: var(--dark);
    color: #ffffff;
    border: none;
    border-radius: 4px;
    padding: 8px 14px;
    font-size: 0.9rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .fc-toolbar button:hover {
    background-color: var(--dark);
    color: #ffffff;
  }

  /* Calendar Header */
  .fc-col-header-cell {
    background-color: var(--dark) !important;
    background: var(--dark) !important;

    font-weight: bold;
    text-align: center;
    padding: 4px 2px !important;
    border: 1px solid #ddd;
    a {
      color: #fff !important;
    }
  }

  .fc-month-start {
    background-color: #f8f0a3 !important; /* Yellow background for month start */
    border: none !important; /* Darker yellow border */
    font-weight: bold;
    color: var(--primary) !important; /* Black text for better contrast */
  }
  /* Calendar Day Cells */
  .fc-daygrid-day {
    border: 1px solid #ddd;
    background-color: transparent;
    transition: background-color 0.3s ease;
  }

  .fc-daygrid-day:hover {
    background-color: #f0f8ff; /* Light blue on hover */
  }

  /* Events */
  .fc-event {
    border-left: 6px solid #2b3041 !important;
    border-bottom: none;
    border-right: none;
    margin-bottom: 4px !important;
    border-top: none;
    text-align: left !important;
    background: #4ff1ae; /* fallback for old browsers */
    background: -webkit-linear-gradient(
      to right,
      #2b3041,
      #d3faea
    ); /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(
      to right,
      #d2d8ef,
      transparent
    ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

    border-radius: 0 4px 4px 0 !important;
    padding: 5px;
    font-size: 0.85rem;
    font-weight: bold;
    text-align: center;
    text-overflow: ellipsis !important;
    text-wrap: wrap;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;

    .event-title {
      color: var(--dark-inverted);
      font-weight: 500;
      margin-bottom: 0px;
      padding-left: 1px;
      padding-right: 1px;
      z-index: 9;
      // text-shadow: 0px 1px 1px rgb(255, 255, 255);
    }
  }

  .fc-event:hover {
    z-index: 99 !important;
    transform: scale(1.02);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  /* Event Content */
  .fc-event-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Today Highlight */
  .fc-day-today {
    background-color: #e3f2fd; /* Light blue for today */
    border: 2px solid #007bff;
  }

  /* Weekend Highlight */
  .fc-day-sat,
  .fc-day-sun {
    background-color: #f8f9fa; /* Light gray for weekends */
  }

  /* Loading Spinner */
  .loading-spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  .loading-spinner::after {
    content: "";
    width: 40px;
    height: 40px;
    border: 4px solid #007bff;
    border-top: 4px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
}

.full-calendar-two th {
  background: var(--primary) !important;
  color: #fff !important;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
