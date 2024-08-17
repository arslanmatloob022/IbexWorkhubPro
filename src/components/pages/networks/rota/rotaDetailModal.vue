<script setup lang="ts">
import { ref, onMounted, shallowRef, watch } from "vue";
import { useApi, useDeviceApi } from "/@src/composable/useAPI";
import { useThemeColors } from "/@src/composable/useThemeColors";
import { close } from "fs-extra";
import { useNotyf } from "/@src/composable/useNotyf";
import FullCalendar from "@fullcalendar/vue3";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";

let map;
let directionsService;
let directionsRenderer;
const rotaJobs = ref([]);
const router = useRouter();
const notyf = useNotyf();
const api = useApi();
const editRotaModalOpen = ref(false);
const deleteRotaModal = ref(false);
const currentSelectedID = ref(0);

const rotaDetail = ref({
  id: 0,
  siteInfo: {
    id: 5,
    name: "",
    address: "",
    postcode: "",
    city: "",
    inchargeName: "",
    color: "",
    latitude: 0,
    longitude: 0,
    geofence: {},
    comments: "",
  },
  wokrkerInfo: {
    id: 0,
    firstName: "",
    lastName: "",
    latitude: 0,
    longitude: 0,
    postCode: " ",
    phoneNumber: "",
    emailAddress: "",
    profileImageURL: "",
  },
  customerCompanyInfo: {
    id: 36,
    name: "",
    trade_name: "",
    email: "",
    phone_number: "",
    logo: "",
    postcode: "",
    latitude: 0,
    longitude: 0,
    business_details: "",
    reg_no: "",
    business_type: "",
    covered_distance: 75,
    vat_no: null,
    address: "",
    color: "",
    created_at: "",
    company: 0,
    industry: 0,
  },
  date: "",
  start: "",
  end: "",
  shift: "",
  hourlyRate: 0,
  notes: "",
  createdAt: "",
  createdBy: "",
  UpdatedAt: null,
  updatedBy: "",
  company: 0,
  site: 0,
  worker: 0,
  customerCompany: 0,
  job: null,
  jobsList: [
    {
      id: "",
      end: "",
      start: "",
      jobName: "",
      resourceId: "",
    },
  ],
});

const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
}>();

const props = defineProps<{
  timeSheetDetailModal: boolean;
  timesheetId: string | number;
  rotaId: string | number;
  getRota:Function;
}>();

const closeModalHandler = () => {
  emit("update:modalHandler", false);
  props.getRota()
};

const getRotaDetailHandler = async () => {
  try {
    const response = await api.get(`/v3/api/rota/${props.rotaId}/detail/`);
    rotaDetail.value = response.data;
    rotaJobs.value = response.data.jobsList.map((job) => {
      return {
        ...job,
        title: job.jobName,
      };
    });
    renderCalender();
  } catch (err) {
    console.log(err);
  }
};

const deleteRotaHandler = async () => {
  try {
    const response = await api.delete(`/v3/api/rota/${props.rotaId}/`);
    closeModalHandler();
    notyf.error("Job deleted successfuly");
  } catch (err) {
    console.log(err);
  }
};

const gotoWorker = () => {
  router.push({
    name: "/sidebar/company/workers/[id]",
    params: { id: rotaDetail.value.wokrkerInfo.id },
  });
  console.log("clickingg");
};

const drawMap = (workerLat, workerLng, siteLat, siteLng) => {
  const workerLocation = new google.maps.LatLng(workerLat, workerLng);
  const siteLocation = new google.maps.LatLng(siteLat, siteLng);

  map = new google.maps.Map(document.getElementById("myMap"), {
    center: workerLocation,
    scrollwheel: false,
    mapTypeId: google.maps.MapTypeId.Satellite,
    zoom: 7,
  });

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);

  const request = {
    origin: workerLocation,
    destination: siteLocation,
    travelMode: google.maps.TravelMode.DRIVING,
  };

  directionsService.route(request, function (result, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsRenderer.setDirections(result);
    } else {
      console.error("Error fetching directions: " + status);
    }
  });

  const workerMarker = new google.maps.Marker({
    position: workerLocation,
    map: map,
    title: "Worker Location",
  });

  const siteMarker = new google.maps.Marker({
    position: siteLocation,
    map: map,
    title: "Site Location",
  });
};

const renderCalender = () => {
  calendarOptions.value.resources = rotaJobs.value;
  calendarOptions.value.events = rotaJobs.value;
};

const calendarOptions = ref<any>({
  plugins: [resourceTimelinePlugin],
  schedulerLicenseKey: "0965592368-fcs-1694657447",
  initialView: "resourceTimelineDay",
  height: "auto",
  resourceAreaWidth: "10%",
  selectable: true,
  now: "2024-04-23",
  headerToolbar: {
    left: "",
    center: "",
    right: "",
  },
  droppable: true,
  editable: true,
  views: {
    resourceTimelineDay: {
      type: "timeline",
      duration: { days: 2 },
      slotDuration: "00:30:00", // Set the slot duration as needed
      slotLabelFormat: { hour: "2-digit", minute: "2-digit", hour12: false },
    },
  },
  resourceAreaHeaderContent: "Jobs",
  eventClick: (info) => {
    console.log("clicking on", info.event.id);
  },
});

onMounted(async () => {
  await getRotaDetailHandler();
  drawMap(
    rotaDetail.value.wokrkerInfo.latitude,
    rotaDetail.value.wokrkerInfo.longitude,
    rotaDetail.value.siteInfo.latitude,
    rotaDetail.value.siteInfo.longitude
  );
});
</script>

<template>
  <VModal
    :open="props.timeSheetDetailModal"
    title="Rota Detail"
    size="xl"
    actions="right"
    @close="closeModalHandler"
  >
    <template #content>
      <div class="row">
        <div class="columns is-multiline">
          <div class="column is-6">
            <div class="columns is-multiline">
              <i
                style="position: absolute; top: 44px; left: 166px"
                class="fas fa-pencil-alt cu-pointer flex-align-end"
                aria-hidden="true"
                @click="editRotaModalOpen = true"
              ></i>
              <i
                style="
                  position: absolute;
                  top: 44px;
                  left: 190px;
                  color: var(--danger);
                "
                class="fas fa-trash-alt cu-pointer flex-align-end"
                aria-hidden="true"
                @click="
                  () => {
                    deleteRotaModal = !deleteRotaModal;
                  }
                "
              ></i>
              <div class="column is-12">
                <VCard radius="large" elevated>
                  <div class="columns is-multiline">
                    <div class="column is-3">
                      <VAvatar
                        @click="gotoWorker"
                        :picture="rotaDetail.wokrkerInfo.profileImageURL"
                        size="big"
                        squared
                      />
                    </div>
                    <div class="column is-9">
                      <div class="is-flex space-between">
                        <div>
                          <h3
                            style="width: 120px; white-space: nowrap"
                            class="title is-5 mb-2"
                          >
                            {{
                              rotaDetail.wokrkerInfo
                                ? rotaDetail.wokrkerInfo.firstName
                                : "------"
                            }}
                            {{
                              rotaDetail.wokrkerInfo
                                ? rotaDetail.wokrkerInfo.lastName
                                : "------"
                            }}
                          </h3>
                        </div>
                        <div
                          @click="gotoWorker"
                          class="is-flex cus-align-center"
                        >
                          <i class="lnir lnir-apple" aria-hidden="true"></i>

                          <i
                            class="iconify ml-3 cu-pointer pointer"
                            data-icon="feather:external-link"
                          ></i>
                        </div>
                      </div>
                      <div class="is-flex cus-align-center mb-1">
                        <i
                          class="iconify text-light"
                          data-icon="feather:phone"
                          aria-hidden="true"
                        ></i>
                        <p class="is-bold">
                          {{
                            rotaDetail.wokrkerInfo
                              ? rotaDetail.wokrkerInfo.phoneNumber
                              : "------"
                          }}
                        </p>
                      </div>
                      <div class="is-flex cus-align-center mb-1">
                        <i
                          class="iconify"
                          data-icon="feather:mail"
                          aria-hidden="true"
                        ></i>
                        <p class="is-bold">
                          {{
                            rotaDetail.wokrkerInfo
                              ? rotaDetail.wokrkerInfo.emailAddress
                              : "------"
                          }}
                        </p>
                      </div>
                      <div class="is-flex cus-align-center mb-1 text-light">
                        <i
                          class="iconify"
                          data-icon="feather:map-pin"
                          aria-hidden="true"
                        ></i>

                        <p class="is-bold">
                          {{
                            rotaDetail.wokrkerInfo
                              ? rotaDetail.wokrkerInfo.postCode
                              : "------"
                          }}
                        </p>
                      </div>
                    </div>
                  </div>
                </VCard>
              </div>
              <div class="column is-12">
                <VCard radius="large" elevated>
                  <div class="columns is-multiline">
                    <div class="column is-5">
                      <div class="columns is-multiline">
                        <div class="column is-12">
                          <h3 class="title is-5 mb-2">Site Name</h3>
                          <p class="is-bold">
                            {{
                              rotaDetail.siteInfo
                                ? rotaDetail.siteInfo.name
                                : "------"
                            }}
                          </p>
                        </div>
                        <div class="column is-12">
                          <h3 class="title is-5 mb-2">Site Addreess</h3>
                          <p class="is-bold">
                            {{
                              rotaDetail.siteInfo
                                ? rotaDetail.siteInfo.address
                                : "------"
                            }}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div class="column is-5">
                      <div class="columns is-multiline">
                        <div class="column is-12">
                          <h3 class="title is-5 mb-2">Date</h3>
                          <p class="is-bold">
                            {{ rotaDetail ? rotaDetail.date : "------" }}
                          </p>
                        </div>
                        <div class="column is-12">
                          <h3 class="title is-5 mb-2">Shift Time</h3>
                          <p class="is-bold">
                            {{ rotaDetail ? rotaDetail.start : "-- --" }}
                            {{ rotaDetail ? rotaDetail.end : "-- --" }}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div class="column is-2">
                      <div class="columns is-multiline">
                        <div class="column is-12">
                          <VAvatar
                            :picture="
                              rotaDetail.customerCompanyInfo
                                ? rotaDetail.customerCompanyInfo.logo
                                : '/images/logoplaceholder.png'
                            "
                            size="medium"
                            rounded
                          />
                        </div>
                        <div class="column is-12">
                          <VAvatar
                            :picture="
                              rotaDetail.shift == 'day'
                                ? '/images/dayTime.png'
                                : '/images/nightTime.png'
                            "
                            size="medium"
                            rounded
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </VCard>
              </div>
            </div>
          </div>
          <div class="column is-6">
            <div
              id="myMap"
              style="height: 324px; width: 100%; border-radius: 10px"
            ></div>
          </div>
          <div class="column is-12">
            <FullCalendar :options="calendarOptions">
              <template v-slot:eventContent="arg">
                <div class="p-2 is-flex" style="">
                  <p
                    style="
                      font-weight: 600;
                      margin-bottom: 0px;
                      padding-left: 10px;
                      color: white;
                      display: flex;
                      align-items: center;
                    "
                  ></p>
                  <VTag light color="info" class="mr-5" v-if="arg.event.id">
                    <span
                      class="item-name dark-inverted"
                      style="font-weight: 500"
                      >Job-00{{ arg.event.id }}</span
                    >
                  </VTag>
                  <p
                    style="
                      font-weight: 500;
                      margin-bottom: 0px;
                      padding-left: 5px;
                      color: white;
                    "
                  >
                    {{ arg.event.extendedProps.jobName }}
                  </p>
                </div>
              </template>
            </FullCalendar>
          </div>
        </div>
      </div>
      <VCard class="mt-3" radius="large" elevated>
        <TimeSheetComponent :timesheetId="props.timesheetId" />
      </VCard>
    </template>
    <template #action> </template>
    <template #cancel>
      <button style="display: none">close</button>
    </template>
  </VModal>

  <EditRotaModal
    v-if="editRotaModalOpen"
    :editRotaModalOpen="editRotaModalOpen"
    :rotaId="rotaDetail.id"
    @update:modal-handler="editRotaModalOpen = false"
    @update:OnSuccess="getRotaDetailHandler"
  />

  <ActionsVerificationModal
    v-if="deleteRotaModal"
    :actionVerificationModal="deleteRotaModal"
    captionText="delete job"
    message="Are you sure you want to delete this job permanentaly, if you do so then you won't be able to recover it again?"
    @update:OnSuccess="deleteRotaHandler"
  />
</template>
