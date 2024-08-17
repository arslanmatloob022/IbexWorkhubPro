<script setup lang="ts">
import { ref, defineProps, onMounted } from "vue";
import { useApi } from "/@src/composable/useAPI";
import FullCalendar from "@fullcalendar/vue3";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";

const rotaStartDate = ref("");
const rotaEndDate = ref("");
const api = useApi();
const openRotaDetailModal = ref(false);
const addRotaModalOpen = ref(false);
const selectedDates = ref([]);
const timeSheetId = ref("");
const props = defineProps({
  id: {
    type: String,
    default: "0",
  },
  calendarView: {
    type: String,
    default: "dayGridMonth",
  },
});

function customizeDayCell(info) {
  var dayCell = info.el;
  dayCell.style.background = "#fff";
  dayCell.style.borderRadius = "16px";
}

const dateClickHandler = (info: any) => {
  const dateIndex = selectedDates.value.indexOf(info.dateStr);
  if (dateIndex !== -1) {
    // Date already exists, remove it
    selectedDates.value.splice(dateIndex, 1);
    info.dayEl.style.backgroundColor = "#fff";
  } else {
    // Date does not exist, add it
    selectedDates.value.push(info.dateStr);
    info.dayEl.style.backgroundColor = "#C0DEFF";
  }
};

const calendarOptions = ref<any>({
  plugins: [dayGridPlugin, interactionPlugin],
  // schedulerLicenseKey: "0965592368-fcs-1694657447",
  initialView: props.calendarView,
  height: "auto",
  selectable: true,
  eventClick: function (info) {
    timeSheetId.value = info.event.id;
    openRotaDetailModal.value = !openRotaDetailModal.value;
  },
  eventColor: "transparent",
  themeSystem: "bootstrap5",
  headerToolbar: {
    left: "prev,next today",
    center: "title",
    right: "dayGridMonth,dayGridWeek,dayGridDay",
  },

  views: {
    dayGridMonth: {
      eventLimit: 3,
    },
    dayGridWeek: {
      eventLimit: 50,
    },
    dayGridDay: {
      eventLimit: 50,
    },
  },
  eventLimitClick: "popover",
  droppable: true,
  editable: true,
  dayCellDidMount: function (info) {
    customizeDayCell(info);
  },

  events: [],
  datesSet: function (info) {
    rotaStartDate.value = info.startStr.substring(0, 10);
    rotaEndDate.value = info.endStr.substring(0, 10);
  },
});

const evenColors = {
  Pending: "#FAAD42",
  Approved: "#05D69E",
  Rejected: "#E62864",
};

const combineDateWithTime = (events: any) => {
  events.forEach((event) => {
    const startTime = event.bookOnTime;
    const endTime = event.bookOffTime;
    event.startedTime = startTime;
    event.endedTime = endTime;
    event.start = event.bookOnTime;
  });
  return events;
};

const clearDatesSelection = () => {
  selectedDates.value = [];
  const calendarDiv = document.querySelector("#rota-celender");
  if (calendarDiv) {
    calendarDiv.querySelectorAll("td").forEach(function (element) {
      element.removeAttribute("style");
    });
  }
};

const removeDate = (index: any) => {
  selectedDates.value.splice(index, 1);
};

const getRota = async () => {
  const { data } = await api.get(`v3/api/timesheet/job/${props.id}`);
  calendarOptions.value.events = combineDateWithTime(data);
  console.log("rota data", data);
  clearDatesSelection();
};

watch(
  [() => rotaStartDate.value, () => rotaEndDate.value],
  ([newStart, newEnd], [oldStart, oldEnd]) => {
    getRota();
  }
);

onMounted(() => {
  getRota();
});
// Get Rota By Worker Id
watch(
  () => props.workerId,
  (newValue, oldValue) => {
    getRota();
  }
);
</script>

<template>
  <div id="rota-celender">
    <div class="columns is-multiline">
      <div class="column is-7 is-flex space-between">
        <h6 style="white-space: nowrap" class="cus-main-heading mr-3 ml-1 mt-5">
          Job Scheduling
        </h6>
      </div>
      <div class="column is-5 mt-4">
        <div class="list-flex-toolbar is-reversed">
          <div class="buttons">
            <VButton
              :disabled="!selectedDates.length"
              color="info"
              @click="clearDatesSelection"
              elevated
            >
              Clear Selection ({{ selectedDates.length }})
            </VButton>
            <VButton
              :disabled="!selectedDates.length"
              color="primary"
              @click="addRotaModalOpen = !addRotaModalOpen"
              elevated
            >
              Add Rota - Days ({{ selectedDates.length }})
            </VButton>
          </div>
        </div>
      </div>
    </div>

    <FullCalendar :options="calendarOptions">
      <template v-slot:eventContent="arg">
        <div
          class="p-2 flex-columns event-content"
          style="
            display: flex;
            justify-content: space-between;
            height: 90px;
            width: 100%;
            border-radius: 12px;
            background-color: #effaec;
            padding: 6px 10px;
          "
        >
          <div class="is-flex space-between mb-2">
            <i
              class="fas fa-sun"
              style="color: #3f72c8; font-size: 16px"
              aria-hidden="true"
            ></i>
            <p
              style="
                font-weight: 600;
                margin-bottom: 0px;
                padding-left: 10px;
                color: #444;
              "
            >
              {{
                arg.event.extendedProps.startedTime
                  ? arg.event.extendedProps.startedTime.slice(11, 16)
                  : "-- : --"
              }}
              -
              {{
                arg.event.extendedProps.endedTime
                  ? arg.event.extendedProps.endedTime.slice(11, 16)
                  : "----"
              }}
            </p>
          </div>
          <div>
            <div class="is-flex mb-1">
              <img
                style="width: 30px"
                :src="arg.event.extendedProps.workerInfo.profileImageURL"
                alt=""
              />
              <p
                style="
                  font-weight: 600;
                  margin-bottom: 0px;
                  padding-left: 10px;
                  color: #444;
                "
              >
                {{
                  arg.event.extendedProps.workerInfo
                    ? `${arg.event.extendedProps.workerInfo.firstName}
             ${arg.event.extendedProps.workerInfo.lastName}`
                    : "Not Added"
                }}
              </p>
            </div>
            <div class="is-flex">
              <p
                style="
                  font-weight: 600;
                  margin-bottom: 0px;
                  padding-left: 10px;
                  color: #666;
                "
              ></p>
            </div>
            <p
              style="
                margin-top: 12px;
                font-weight: 600;
                margin-bottom: 8px;
                padding-left: 10px;
                color: #666;
              "
            >
              Worked:
              {{
                arg.event.extendedProps.hoursWorked
                  ? arg.event.extendedProps.hoursWorked
                  : "0"
              }}
              Hours
            </p>
          </div>
        </div>
      </template>
    </FullCalendar>
  </div>

  <AddRotaModal
    v-if="addRotaModalOpen"
    @update:modalHandler="
      () => {
        addRotaModalOpen = !addRotaModalOpen;
        clearDatesSelection();
      }
    "
    @update:OnSuccess="getRota"
    :AddRotaModalOpen="addRotaModalOpen"
    :selectedDatesArray="selectedDates"
    :workerId="props.workerId"
    @remove-date="removeDate"
  ></AddRotaModal>

  <RotaDetailView
    v-if="openRotaDetailModal"
    :timeSheetDetailModal="openRotaDetailModal"
    :timesheetId="timeSheetId"
    @update:modalHandler="
      () => {
        openRotaDetailModal = false;
      }
    "
    :getRota="getRota"
  />
</template>

<style lang="scss">
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

  // date css
  .fc .fc-daygrid-day-top {
    display: flex !important;
    font-size: 18px;
    font-weight: bold;
  }

  // days css
  .fc .fc-col-header-cell-cushion {
    display: inline-block;
    padding: 6px 8px;
    color: var(--primary) !important;
  }

  .fc-direction-ltr {
    background-color: white;
    padding: 20px;
    border-radius: 31px;
  }
}
</style>
<style scoped lang="scss">
.fc-event.fc-event-draggable {
  margin-right: 1px;
  border-width: 3px;
  border-radius: 12px;
}

.fc-event {
  margin-bottom: 6px !important;
}
</style>
<style scoped lang="scss"></style>
