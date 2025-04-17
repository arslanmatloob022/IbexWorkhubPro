<script lang="ts" setup>
import { onMounted, ref } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import multiMonthPlugin from "@fullcalendar/multimonth";
import interactionPlugin from "@fullcalendar/interaction";
import { useApi } from "/@src/composable/useAPI";

const api = useApi();

const props = defineProps({
  projectID: {
    type: Number,
    required: true,
  },
});

const tasks = ref([]);
const loading = ref(false);
const events = ref<any>([]);

const colors: Record<string, string> = {
  pending: "#f39c12",
  in_progress: "#3498db",
  completed: "#2ecc71",
  cancelled: "#e74c3c",
};

const calendarOptions = ref({
  plugins: [dayGridPlugin, multiMonthPlugin, interactionPlugin],
  initialView: "dayGridMonth",
  dayMaxEventRows: false, // show all tasks
  height: "auto",
  selectable: true,
  editable: false,
  views: {
    dayGridMonth: {
      slotDuration: { week: 3, day: 7 },
      slotLabelFormat: {
        weekday: "short",
        month: "numeric",
        day: "numeric",
        year: "numeric",
      },
    },
  },
  headerToolbar: {
    left: "today prev,next",
    center: "title",
    right: "dayGridWeek,dayGridMonth,multiMonthYear",
  },
  events: [],
});

const getProjectTasks = async () => {
  try {
    loading.value = true;
    const resp = await api.get(`api/task/${props.projectID}/project/`);
    tasks.value = resp.data;

    // Once tasks are loaded, convert them to FullCalendar format
    events.value = tasks.value.map((task: any) => ({
      id: task.id,
      start: task.startDate,
      end: task.endDate,
      title: task.title,
      color: task.color || "#2c3e50",
      description: task.description,
      borderColor: colors[task.status] || "#2c3e50",
      status: task.status,
      project: task.project,
    }));

    // Update calendar options with the new events
    calendarOptions.value.events = events.value;
  } catch (err) {
    console.error("Failed to fetch tasks:", err);
  } finally {
    loading.value = false;
  }
};

const openTaskDetail = (task: any) => {
  alert(`Task Detail:\n${task.title}\nStatus: ${task.status}`);
};

onMounted(() => {
  getProjectTasks();
});
</script>

<template>
  <div class="column is-12" id="CalendarStyling">
    <FullCalendar :options="calendarOptions">
      <template v-slot:eventContent="arg">
        <div
          @click="openTaskDetail(arg.event.extendedProps)"
          style="
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            padding: 6px;
            background-color: rgba(0, 0, 0, 0.3);
          "
        >
          <p
            style="
              font-weight: 600;
              margin-bottom: 0px;
              padding-left: 10px;
              color: #f1f1f1;
            "
          >
            {{ arg.event.title }}
          </p>
          <p style="padding-right: 10px; color: #f1f1f1">
            {{ new Date(arg.event.start).toDateString() }} to
            {{ new Date(arg.event.end).toDateString() }}
          </p>
        </div>
      </template>
    </FullCalendar>
  </div>
</template>

<style lang="scss">
.calendar-container {
  position: fixed;
  top: 0;
  left: 0;
  min-width: 100%;
  height: 100%;
  background-color: white;
  z-index: 99;
  padding: 6px;
  overflow: auto;
}

#CalendarStyling {
  td {
    border: none;
  }

  tr {
    border: none;
  }

  th {
    border: none;
  }

  table {
    border: none;
  }

  .fc-scrollgrid-sync-inner {
    padding: 6px;
  }

  .fc .fc-daygrid-day-frame {
    min-height: 100%;
    padding-top: 30px;
    position: relative;
    cursor: crosshair;
  }

  .fc-event {
    padding: none;
  }

  .filter {
    display: flex;
    align-items: center;
    background: var(--white);
    padding: 8px 24px;
    border-radius: 100px;

    > span {
      font-family: var(--font-alt);
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--dark-text);
      margin-inline-end: 20px;
    }

    .multiselect {
      min-width: 140px;
      border: none;
    }
  }

  .fc .fc-day-today {
    background-color: #ffeb3b10;
  }

  .fc .fc-timegrid-now-indicator {
    background-color: #ff5722;
    border-color: #ff5722;
  }

  .fc .fc-today-button {
    background-color: #2196f3;
    color: white;
  }

  .calendar-container {
    position: fixed;
    top: 0;
    left: 0;
    min-width: 100%;
    height: 100%;
    background-color: white;
    z-index: 99;
    padding: 6px;
    overflow: auto;
  }

  #rota-celender {
    td {
      border: 1px solid white !important;
    }

    tr {
      border: 1px solid white !important;
    }

    th {
      border: 1px solid white !important;
    }

    table {
      border: 1px solid white !important;
    }

    .fc .fc-col-header-cell-cushion {
      display: inline-block;
      padding: 6px 8px;
      color: var(--primary) !important;
      border: none;
    }

    .fc-direction-ltr {
      background-color: white;
      padding: 10px;
      border-radius: 16px;
    }
  }

  .staggered-fade-enter-active,
  .staggered-fade-leave-active {
    transition: all 0.5s ease-in-out;
  }

  .staggered-fade-enter-from,
  .staggered-fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }

  .staggered-fade-enter-active {
    transition-delay: calc(var(--index) * 500ms);
  }

  #calendar {
    font-family: "Arial, sans-serif";
    background: #f4f6f9;
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    padding: 20px;
  }

  .fc-header-toolbar {
    color: #181818;
    padding: 10px;
    border-radius: 10px 10px 0 0;
  }

  .fc-toolbar-title {
    font-size: 1.5em;
    font-weight: bold;
    color: #161616;
  }

  .fc-toolbar {
    .fc-toolbar-chunk {
      .fc-toolbar-title {
        color: var(--primary);
        font-weight: 500;
        font-size: 24px;
      }
      .fc-button-group {
      }
    }
  }

  /* Date number styles */
  .fc-daygrid-day-number {
    background-color: none;
    border-radius: 8px;
    color: #2aac8e;
    font-weight: bold;
    padding: 4px auto;
    position: absolute;
    top: -18px;
    right: 0;
    font-size: 12px;
    margin-bottom: 6px;
  }

  .fc-event {
    color: #3a506b;
    border: none;
    background-color: transparent;
    padding: 0px;
    margin-bottom: 3px;
    width: 100%;
    // box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease-in-out;
    background: none;
  }

  .fc-event:hover {
    transform: scale(1.03);
    box-shadow: 0 4px 8px rgba(255, 243, 78, 0.282);
  }

  /* Custom content inside date box */
  .fc-daygrid-day-frame {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 5px;
  }

  .fc-daygrid-day-events {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  .fc-daygrid-day-top {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.2em;
    font-weight: bold;
    color: #3a506b;
  }

  .fc-daygrid-day-bottom {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
  }

  .fc-event-main {
    font-size: 0.9em;
    font-weight: bold;
    text-align: center;
  }
}
</style>
