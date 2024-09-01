<script setup lang="ts">
import { useApi } from "/@src/composable/useAPI";
import { useThemeColors } from "/@src/composable/useThemeColors";
import ApexChart from "vue3-apexcharts";
import { useCompany } from "/@src/stores/company";
import { ref, onMounted, shallowRef, watch } from "vue";
const api = useApi();
const company = useCompany();
const themeColors = useThemeColors();
const input = ref("");
const filters = ref("");
const router = useRouter();
const dummyArray = ref([0, 305, 200, 350, 250, 100, 250, 400, 300, 100, 50]);
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
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
  },
  tooltip: {
    y: {
      formatter: function (val: string) {
        return val;
      },
    },
  },
});
const selectedYear = ref("2023");
//pie chart code
const reactive = shallowRef({
  height: 295,
  type: "pie",
  series: [5672, 832, 1297, 4515],
  options: {
    colors: ["#00d0ff", "#fd2d2c", "#C449C2", "#00d457"],
    labels: ["Profiles", "SIA Expired", "Completed Profiles", "Valid SIA"],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 315,
            toolbar: {
              show: false,
            },
          },
          legend: {
            position: "top",
          },
        },
      },
    ],
    legend: {
      position: "bottom",
      horizontalAlign: "center",
    },
  },
});
const dashboardData = ref({
  total_workers: 0,
  workers_by_month: [],
  sanction_last_update: null,
  bs7858: 0,
  partners: 0,
  warningProfiles: 0,
  approvedReferences: 0,
  refCount: 0,
  customers: 0,
  pendingReferences: 0,
});
const isShow = ref(true);
const getDashboardData = async (year: any = "2024") => {
  try {
    isShow.value = false;
    const response = await api.post(
      `v3/api/company/dashboard/${company.loggedCompany.id}/`,
      { year: year }
    );
    dashboardData.value = response.data;
    lineStatsChartOptions.value.series[0].data = dummyArray.value;
    // dashboardData.value.workers_by_month;
    isShow.value = true;
  } catch (error) {
    console.error("ok", error);
  }
};
const workersCount = ref({
  all: 0,
  archived: 0,
  industries: <any>[],
});
const getIndustryWorkersCount = async () => {
  try {
    const resp = await api.get(
      `/v3/api/company/${company.loggedCompany.id}/get_company_industry_workers_count/`
    );
    workersCount.value = resp.data;
    console.log("counts", resp.data);
  } catch (err) {
    console.log(err);
  }
};

//flex list data
export interface ProfileAnomalyDetectionData {
  id: number;
  colleagueImage: string;
  name: string;
  contactNumber: string;
  email: string;
  status: string;
  profileAnomaly: string;
}
const ProfileAnomalyDetection = ref([
  {
    id: "",
    colleagueImage: "",
    name: "",
    contactNumber: "",
    email: "",
    status: "",
    Sia: true,
    profileAnomaly: "",
  },
]);
const getdummyWorkers = async () => {
  const response = await api.get(
    `/v3/api/worker/company-workers/${company.loggedCompany.id}/`,
    {}
  );
  ProfileAnomalyDetection.value = response.data.results;
};

const columns = {
  colleague: "Name",
  email: {
    label: "Email",
    align: "left",
  },

  phoneno: {
    label: "Phone Number",
    align: "left",
  },

  siaStatus: {
    label: "SIA Status",
    align: "center",
  },
  status: {
    label: "Status",
    align: "center",
  },
  profileAnomaly: "Profile Anomaly",
} as const;

const anomaliesStats = ref({
  not_uploaded: 0,
  expired: 0,
  date_missing: 0,
  expire_within_14_days: 0,
});

const getAnomaliesStats = async () => {
  try {
    const response = await api.get(
      `/v3/api/worker/anomalies/${company.loggedCompany.id}/anomalies-stats/`
    );
    anomaliesStats.value = response.data;
  } catch (err) {
    console.log(err);
  }
};

const anomalieClickHandler = (type: any) => {
  window.sessionStorage.setItem(
    `anomalieFilters${company.loggedCompany.id}`,
    JSON.stringify({
      industry: [],
      documents: [],
      limitedScreening: false,
      currentStatType: type,
    })
  );
  router.push("company/anomalies?page=1");
};

function formatDate(inputDate) {
  const date = new Date(inputDate);
  const options = { day: "numeric", month: "long", year: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

onActivated(async () => {
  await getDashboardData();
  getIndustryWorkersCount();
  getAnomaliesStats();
});

onMounted(async () => {
  await getDashboardData();
  getdummyWorkers();
  getIndustryWorkersCount();
  getAnomaliesStats();
});
</script>

<template>
  <div class="business-dashboard company-dashboard">
    <div class="columns is-multiline">
      <div class="column is-5">
        <h1
          class="cu-text-primary"
          style="transform: translateY(-20px); margin-left: 12px"
        >
          Sanction updated at:
          <span class="cus-black-heading" style="color: #090909">{{
            formatDate(dashboardData.sanction_last_update)
          }}</span>
        </h1>
      </div>
    </div>

    <div class="is-flex space-between cu-align-center">
      <h1 class="subtitle weighted">Compliance Industries</h1>
      <div class="is-flex justify-content-end" style="justify-content: end">
        <div
          class="industry-worker"
          style="display: inline-block; margin-bottom: 0"
        >
          <div class="industry-block">
            <div
              class="industry-block cu-pointer"
              @click="
                () => {
                  router.push(`/sidebar/company/workers?type=${x.name}`);
                }
              "
              v-for="(x, index) in workersCount.industries"
            >
              <div class="">
                <!-- <img :src="x.industryLogo" alt="" srcset="" style="height: 32px;"> -->
                <div class="is-block">
                  <img
                    :src="x.industryLogo"
                    alt=""
                    srcset=""
                    style="width: 22px"
                  />
                  <h6 class="titile is-6 pl-2" style="font-weight: 500">
                    {{ x.name }}
                    <span class="cus-stat-heading">({{ x.count }})</span>
                  </h6>
                </div>

                <p></p>
              </div>
              <div
                class="vr-line"
                v-if="index !== workersCount.industries.length - 1"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="columns is-multiline">
      <div class="column is-12">
        <div
          class="dashboard-card is-base-chart"
          style="background-color: transparent; box-shadow: none"
        >
          <div class="content-box pl-0" style="padding-bottom: 10px">
            <div
              class="revenue-stats is-dark-bordered-12 is-flex is-justify-content-space-between is-align-items-center"
              style="border-bottom: none"
            >
              <div class="revenue-stat" style="border-bottom: none">
                <h1 style="color: #000000a4" class="title is-5 is-flex">
                  <p class="vr-line-main"></p>
                  <div class="ml-3">Profile Registration</div>
                </h1>
              </div>
              <div style="width: 200px">
                <VField>
                  <VControl class="has-icons-left" icon="fas fa-globe">
                    <VSelect
                      @input="
                        (e) => {
                          getDashboardData(e.target.value);
                        }
                      "
                    >
                      <VOption value="">Select Year</VOption>
                      <VOption value="2020">2020</VOption>
                      <VOption value="2021">2021</VOption>
                      <VOption value="2022">2022</VOption>
                      <VOption value="2023">2023</VOption>
                      <VOption value="2024">2024</VOption>
                      <VOption value="2025">2025</VOption>
                    </VSelect>
                  </VControl>
                </VField>
              </div>
            </div>
          </div>
          <ApexChart
            v-if="isShow"
            id="line-stats-widget-chart"
            :height="lineStatsChartOptions.chart.height"
            :type="lineStatsChartOptions.chart.type"
            :series="lineStatsChartOptions.series"
            :options="lineStatsChartOptions"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "/@src/scss/abstracts/all";

.industry-worker {
  padding: 12px 24px 12px 24px;
  border-radius: 19px;
  background-color: #ffffff;
}

.custom-badge {
  background: black;
  color: white;
  padding: 5px 5px 5px 5px;
  border-radius: 10px;
}

.odd-row {
  background-color: #e9e9e9 !important;
  border: none !important;
  border-radius: 16px !important;
}

.even-row {
  background-color: transparent !important;
  border: none !important;
  border-radius: 16px !important;
}

.industry-block {
  display: flex;
  gap: 28px;
  align-items: end;
  text-align: center;
}

.vr-line {
  height: 16px;
  width: 4px;
  background-color: rgb(224, 224, 224);
  border-radius: 12px;
  margin-bottom: 3px;
}

.vr-line-main {
  height: 16px;
  width: 8px;
  background-color: rgb(24, 23, 23);
  border-radius: 12px;
}

.analytic-report-btn {
  width: 21px;
  height: 21px;
  border-radius: 12px;
  cursor: pointer;
  background: rgb(236, 236, 236);
  display: flex;
  align-items: center;
  transition:
    width 2s,
    height 4s;
  padding-left: 4px;
  padding-right: 4px;
  white-space: nowrap;
}

.analytic-report-btn .detail {
  // visibility: hidden;
  color: white;
  display: none;
  white-space: nowrap;
}

.analytic-report-btn:hover .detail {
  display: block;
}

.analytic-report-btn:hover {
  width: 180px;
}

.cus-stat-heading {
  white-space: nowrap;
  min-width: 120px;
}

.user-metadata {
  display: flex;
  flex-direction: column;
  gap: 10px;

  .item-meta {
    display: flex !important;
    align-items: center;
    flex-direction: column !important;
    gap: 1px !important;
    color: rgba(99, 99, 99, 0.7);
  }
}

.dashboard-card {
  border: none !important;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  border-radius: 12px !important;
}

.profiles-anomaly {
  border: none !important;
  // box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  border-radius: 8px !important;
  padding: 20px;
}

.company-dashboard {
  .company-header {
    display: flex;
    padding: 20px;
    background: var(--white);
    border: 1px solid var(--fade-grey-dark-3);
    border-radius: var(--radius-large);
    margin-bottom: 1.5rem;

    .header-item {
      width: 25%;
      border-inline-end: 1px solid var(--fade-grey-dark-3);

      &:last-child {
        border-inline-end: none;
      }

      .item-inner {
        text-align: center;

        .lnil,
        .lnir {
          font-size: 1.8rem;
          margin-bottom: 6px;
          color: var(--primary);
        }

        span {
          display: block;
          font-family: var(--font);
          font-weight: 600;
          font-size: 1.6rem;
          color: var(--dark-text);
        }

        p {
          font-family: var(--font-alt);
          font-size: 0.95rem;
        }
      }
    }
  }

  .widget {
    height: 100%;
  }

  .dashboard-card {
    @include vuero-s-card;

    height: 100%;

    &.is-company {
      text-align: center;
      padding: 30px;

      .v-avatar {
        display: block;
        margin: 0 auto 10px;

        .button {
          position: absolute;
          bottom: 0;
          inset-inline-end: 0;
          max-width: 35px;
        }
      }

      > h3 {
        color: var(--dark-text);
        font-family: var(--font-alt);
        font-size: 1.2rem;
        font-weight: 600;
      }

      > p {
        font-size: 0.9rem;
      }

      .description {
        padding: 10px 0 0;
      }

      .company-stats {
        display: flex;
        padding-top: 20px;
        margin-top: 20px;
        border-top: 1px solid var(--fade-grey-dark-3);

        .company-stat {
          width: 33.3%;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;

          span {
            display: block;
            font-family: var(--font);

            &:first-child {
              text-transform: uppercase;
              font-family: var(--font-alt);
              font-size: 0.75rem;
              color: var(--light-text);
            }

            &:nth-child(2) {
              color: var(--dark-text);
              font-size: 1.4rem;
              font-weight: 600;
            }
          }
        }
      }
    }

    &.is-base-chart {
      padding: 0;
      display: flex;
      flex-direction: column;

      .content-box {
        padding: 30px;

        .revenue-stats {
          display: flex;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--fade-grey-dark-3);

          .revenue-stat {
            margin-inline-end: 30px;
            font-family: var(--font);

            span {
              display: block;

              &:first-child {
                text-transform: uppercase;
                font-family: var(--font-alt);
                font-size: 0.75rem;
                color: var(--light-text);
              }

              &:nth-child(2) {
                color: var(--dark-text);
                font-size: 1.6rem;
                font-weight: 600;
              }

              &.current {
                color: var(--primary);
              }
            }
          }
        }
      }

      .chart-container {
        margin-top: auto;
      }
    }

    &.is-tickets {
      padding: 30px;

      .ticket-list {
        padding: 10px 0;

        .media-flex {
          + .media-flex {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid var(--fade-grey-dark-3);
          }

          .flex-meta {
            span {
              &:nth-child(2) {
                font-size: 1rem;
                margin: 4px 0;
                color: var(--light-text-dark-20);
                max-width: 430px;
              }

              &:nth-child(3) {
                font-size: 0.9rem;
                color: var(--light-text);
              }
            }
          }
        }
      }
    }

    .card-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;

      h3 {
        font-family: var(--font-alt);
        font-size: 1rem;
        font-weight: 600;
        color: var(--dark-text);
      }
    }
  }

  .table-wrapper {
    min-height: 0;
  }

  .dataTable-wrapper {
    .dataTable-top {
      padding: 0 !important;
      margin: 0 !important;
    }
  }
}

.is-dark {
  .company-dashboard {
    .dashboard-card {
      @include vuero-card--dark;
    }
  }
}

@media only screen and (width <=767px) {
  .company-dashboard {
    .company-header {
      flex-wrap: wrap;

      .header-item {
        width: 50%;
        border-inline-end: none;
        border: none;
        padding: 16px 0;
      }
    }

    .dashboard-card {
      &.is-tickets {
        padding: 30px;

        .ticket-list {
          .media-flex {
            .flex-meta {
              margin-bottom: 1rem;
            }
          }
        }
      }
    }
  }
}

/*Cards styling */
.card {
  width: 100%;
  height: 150px;
  text-align: center;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  border-radius: 15px;
  transition: transform 0.3s ease;
  padding-bottom: 10px;
  overflow: hidden;
  box-shadow: rgba(99, 99, 99, 0.1) 0px 2px 8px 0px;

  &:hover {
    cursor: pointer;
    transform: scale(1.1);
  }

  .title {
    font-size: calc(17px + 1vw);
    color: rgb(255, 255, 255);
  }

  .subtitle {
    font-weight: 600;
    font-size: calc(2px + 1vw);
    color: #f1f1f1;
  }
}

/*datatable list 3 */
.is-navbar {
  .datatable-toolbar {
    padding-top: 30px;
  }
}

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

.datatable-wrapper {
  width: 100%;

  .datatable-container {
    background: var(--white);
    border: none !important;
    overflow-x: auto;

    .table,
    table {
      width: 100%;
    }

    &::-webkit-scrollbar {
      height: 8px !important;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 10px !important;
      background: rgb(0 0 0 / 20%) !important;
    }
  }
}

.header-detection {
  background-color: #796cfa;
  padding: 10px;
  border-radius: 15px;
}

.header-detection h1 {
  color: white;
}

.header-detection i {
  color: white;
  cursor: pointer;
}

/*flex datatable styling */
.has-top-nav {
  .flex-list-wrapper,
  .list-flex-toolbar {
    max-width: 880px;
    margin-inline-end: auto;
    margin-inline-start: auto;
  }
}
</style>
