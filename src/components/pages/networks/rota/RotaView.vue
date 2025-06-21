<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref, defineProps, onMounted } from "vue";
import { useApi } from "/@src/composable/useAPI";
import FullCalendar from "@fullcalendar/vue3";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useCompany } from "/@src/stores/company";

const rotaStartDate = ref("");
const rotaEndDate = ref("");
const company = useCompany();
const api = useApi();
const openRotaDetailModal = ref(false);
const addRotaModalOpen = ref(false);
const selectedDates = ref([]);
const selectedDatesBackground = ref([]);
const timeSheetId = ref("3773");
const rotaID = ref(0);
const props = defineProps({
  id: {
    type: String,
    default: "0",
  },
  workerId: {
    type: Number,
    default: 0,
  },
  siteID: {
    type: Number,
    default: 0,
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
    openRotaDetailModal.value = !openRotaDetailModal.value;
    rotaID.value = info.event.id;
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
  dateClick: function (info) {
    dateClickHandler(info);
  },
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
    const startTime = event.start;
    const endTime = event.end;
    event.startedTime = startTime;
    event.endedTime = endTime;
    event.start = event.date;
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
  let payload = {
    company: company.loggedCompany.id,
    start_date: rotaStartDate.value,
    end_date: rotaEndDate.value,
  };
  console.log("props", props.workerId);
  if (props.workerId === 0) {
    delete payload.worker;
  } else if (props.workerId !== 0) {
    payload.worker = props.workerId;
  }
  if (props.siteID === 0) {
    delete payload.site;
  } else if (props.siteID !== 0) {
    payload.site = props.siteID;
  }
  const { data } = await api.post("/v3/api/rota/date-range/", payload);
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
          Rota View
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
          :style="{
            backgroundColor:
              arg.event.extendedProps.shift == 'day' ? '#effaec' : '#eae9f1',
          }"
          style="
            display: flex;
            justify-content: space-between;
            height: 90px;
            width: 100%;
            border-radius: 12px;
          "
        >
          <div class="is-flex space-between mb-2">
            <i
              v-if="arg.event.extendedProps.shift == 'day'"
              style="color: #f89216; font-size: 16px"
              class="fas fa-sun"
              aria-hidden="true"
            ></i>
            <i
              v-else
              class="fas fa-moon"
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
                  ? arg.event.extendedProps.startedTime
                  : "-- : --"
              }}
              -
              {{
                arg.event.extendedProps.endedTime
                  ? arg.event.extendedProps.endedTime
                  : "----"
              }}
            </p>
          </div>
          <div>
            <div class="is-flex mb-1">
              <p
                style="
                  font-weight: 600;
                  margin-bottom: 0px;
                  padding-left: 10px;
                  color: #444;
                "
              >
                {{
                  arg.event.extendedProps.worker
                    ? `${arg.event.extendedProps.worker.firstName}
              ${arg.event.extendedProps.worker.lastName}`
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
              >
                {{
                  arg.event.extendedProps.companyName
                    ? arg.event.extendedProps.companyName
                    : "----"
                }}
              </p>
            </div>
            <p
              style="
                font-weight: 600;
                margin-bottom: 0px;
                padding-left: 10px;
                color: #666;
              "
            >
              {{
                arg.event.extendedProps.siteName
                  ? arg.event.extendedProps.siteName.slice(0, 28)
                  : "-- -- --"
              }}
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

  <RotaDetailModal
    v-if="openRotaDetailModal"
    :timeSheetDetailModal="openRotaDetailModal"
    :timesheetId="timeSheetId"
    :rotaId="rotaID"
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
    border: 1px solid rgb(109, 17, 17) !important;
  }

  tr {
    border: 1px solid rgb(100, 16, 16) !important;
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
