Timesheet component

<script setup lang="ts">
import { ref, onMounted, shallowRef, watch } from "vue";
import { useApi, useDeviceApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import ApexChart from "vue3-apexcharts";
import { useThemeColors } from "/@src/composable/useThemeColors";
const themeColors = useThemeColors();
const deviceapi = useDeviceApi();
const loading = ref(false);
const notyf = useNotyf();
const api = useApi();
const showChart = ref(false);
const activitiesData = ref(<any>[]);
const timestampData = ref(<any>[]);

const timesheetData = ref({
  timeSheetID: 0,
  device_data: [
    {
      acceX: 0,
      acceY: 0,
      acceZ: 0,
      accuracy_level: 0,
      activity_type: "",
      activity_value: 0,
      altitude: 0,
      app_version: "",
      battery_level: 0,
      climb: 0,
      deviceUserName: "",
      device_type: "",
      direction: 0,
      gyroX: 0,
      gyroY: 0,
      gyroZ: 0,
      heartRate: 0,
      horizontal: 0,
      id: 0,
      latitude: 0,
      longitude: 0,
      movement_type: "",
      readingsTimeDelta: 0,
      speed: 0,
      timeStamp: "",
      vertical: 0,
      timeSheetID: 0,
      worker_id: 0,
    },
  ],
  created_at: "",
  worker_id: 0,
  bookOnTime: "",
  bookOffTime: "",
  bookOnLat: "",
  bookOnLong: "",
  bookOnLocation: "",
  bookOffLat: "",
  bookOffLong: "",
  bookOffLocation: "",
  hoursWorked: "",
  bookOnImageURL: "",
  bookOffImageURL: "",
  isBookOnImageVerified: false,
  isBookOffImageVerified: false,
});

const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
}>();
const props = defineProps<{
  timesheetId: string | number;
}>();

//line chart code
const lineStatsChartOptions = shallowRef({
  series: [
    {
      name: "Profiles",
      data: [],
    },
  ],

  chart: {
    height: 270,
    type: "area",
    zoom: {
      enabled: false,
    },
    toolbar: {
      show: false,
    },
  },
  colors: [themeColors.success],
  dataLabels: {
    enabled: false,
  },
  stroke: {
    width: [4, 5, 5],
    curve: "smooth",
  },
  grid: {
    row: {
      colors: ["transparent", "transparent"], // takes an array which will be repeated on columns
      opacity: 0,
    },
    yaxis: {
      lines: {
        show: false, //or just here to disable only x axis grids
      },
    },
  },
  xaxis: {
    categories: [],
  },
  tooltip: {
    y: {
      formatter: function (val: string) {
        return val;
      },
    },
  },
});

const getTimesheetData = async () => {
  try {
    loading.value = true;
    const response = await api.get(
      `v3/api/timesheet/details/${props.timesheetId}/`,
      {}
    );
    timesheetData.value = response.data;
    let activities = <any>[];
    let timeStamp = <any>[];

    response.data.device_data.forEach((item) => {
      activities.push(parseFloat(item.activity_value).toFixed(3));
      timeStamp.push(
        item.timeStamp && item.timeStamp.length > 20
          ? item.timeStamp.slice(11, 16)
          : item.timeStamp
      );
    });

    lineStatsChartOptions.value.series[0].data = activities;
    lineStatsChartOptions.value.xaxis.categories = timeStamp;

    activitiesData.value = activities;
    timestampData.value = timeStamp;
    showChart.value = true;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

let map = {};
const drawMap = (lat: any, lng: any) => {
  let center = { lat: lat, lng: length };
  map = new google.maps.Map(document.getElementById("myMapOn"), {
    center: center,
    scrollwheel: false,
    mapTypeId: google.maps.MapTypeId.Satellite,
    zoom: 6,
  });

  // Create marker for each worker
  const marker = new google.maps.Marker({
    position: { lat: lat, lng: lng },
    map: map,
    title: "Worker", // Set a title for the marker if needed
  });
};

const drawMapOff = (lat: any, lng: any) => {
  let center = { lat: lat, lng: length };
  map = new google.maps.Map(document.getElementById("myMapOff"), {
    center: center,
    scrollwheel: false,
    mapTypeId: google.maps.MapTypeId.Satellite,
    zoom: 6,
  });

  // Create marker for each worker
  const marker = new google.maps.Marker({
    position: { lat: lat, lng: lng },
    map: map,
    title: "Worker", // Set a title for the marker if needed
  });
};

onMounted(() => {
  drawMap(51.4497984, -0.3464489);
  drawMapOff(51.4497984, -0.3464489);
  getTimesheetData();
});
</script>

<template>
  <div v-if="timesheetData.device_data.length" class="columns is-multiline">
    <div class="column is-12">
      <div class="is-flex">
        <VPlaceload v-if="loading" height="80px" width="50%" class="mx-2" />

        <VPlaceload
          v-if="loading"
          height="80px"
          width="50%"
          class="mx-2 mb-6"
        />
      </div>
      <div class="content-wrap">
        <div class="content-box" v-show="!loading">
          <div class="columns is-multiline">
            <div class="column is-6">
              <p class="is-bold mb-1">Book on</p>
              <div class="card is-flex p-3">
                <VAvatar
                  :picture="
                    timesheetData.bookOnImageURL
                      ? timesheetData.bookOnImageURL
                      : ''
                  "
                  squared
                  size="medium"
                />
                <div class="box-text ml-2">
                  <div class="meta-text">
                    <p class="ml-1 mb-3 is-bold">
                      Time:
                      <span class="ml-1 mb-1 is-bold"
                        >{{
                          timesheetData.bookOnTime
                            ? timesheetData.bookOnTime.slice(0, 10)
                            : "-- --"
                        }}

                        {{
                          timesheetData.bookOnTime
                            ? timesheetData.bookOnTime.slice(11, 16)
                            : "-- --"
                        }}</span
                      >
                    </p>
                    <span class="ml-1" style="width: 80px">
                      <i
                        class="lnir lnir-hospital-location mr-2"
                        style="font-size: larger; color: var(--primary)"
                        aria-hidden="true"
                      ></i>
                      {{
                        timesheetData.bookOnLocation
                          ? timesheetData.bookOnLocation
                          : "-----"
                      }}
                      London
                    </span>
                  </div>
                </div>
                <div
                  id="myMapOn"
                  style="height: 140px; width: 160px; border-radius: 10px"
                ></div>
              </div>
            </div>
            <div class="column is-6">
              <p class="is-bold mb-1">Book off</p>
              <div class="card is-flex p-3">
                <VAvatar
                  :picture="
                    timesheetData.bookOffImageURL
                      ? timesheetData.bookOffImageURL
                      : ''
                  "
                  squared
                  size="medium"
                />
                <div class="box-text ml-2">
                  <div class="meta-text">
                    <p class="ml-1 mb-3 is-bold">
                      Time:
                      <span class="ml-1"
                        >{{
                          timesheetData.bookOffTime
                            ? timesheetData.bookOffTime.slice(0, 10)
                            : "-- --"
                        }}
                        {{
                          timesheetData.bookOnTime
                            ? timesheetData.bookOnTime.slice(11, 16)
                            : "-- --"
                        }}</span
                      >
                    </p>

                    <span class="ml-1" style="width: 80px">
                      <i
                        class="lnir lnir-hospital-location mr-2"
                        style="font-size: larger; color: var(--primary)"
                        aria-hidden="true"
                      ></i>
                      {{
                        timesheetData.bookOffLocation
                          ? timesheetData.bookOffLocation
                          : "-----"
                      }}, London
                    </span>
                  </div>
                </div>
                <div
                  id="myMapOff"
                  style="height: 140px; width: 160px; border-radius: 10px"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="column is-12 mt-3">
      <HeatMap
        style="height: 280px; width: 100%"
        v-if="showChart"
        :activity="timesheetData.device_data"
      />
      <VPlaceload v-if="loading" height="280px" width="100%" class="mx-2" />
    </div>
    <div class="column is-12">
      <VPlaceload v-if="loading" height="280px" width="100%" class="mx-2" />
      <TimestampMap
        v-if="showChart"
        :activities="activitiesData"
        :timestamp="timestampData"
      />
    </div>
  </div>
  <div v-else>
    <VPlaceholderPage
      title="No Activity found."
      subtitle="Looks like worker did not performed any activity within this time-stamp "
    >
      <template #image>
        <img
          class="light-image is-larger"
          src="/@src/assets/illustrations/placeholders/projects.svg"
          alt=""
        />
        <img
          class="dark-image is-larger"
          src="/@src/assets/illustrations/placeholders/projects-dark.svg"
          alt=""
        />
      </template>
    </VPlaceholderPage>
  </div>
</template>
