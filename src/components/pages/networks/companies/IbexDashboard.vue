<route lang="yaml">
meta:
  requiresAuth: true
  isManagerAllowed: true
  # isPartnerAllowed: false
  # isContractorAllowed: false
  # isWorkerAllowed: false
  # isClientAllowed: false
</route>

<script setup lang="ts">
import { useApi } from "/@src/composable/useAPI";
import { useThemeColors } from "/@src/composable/useThemeColors";
import { useCompany } from "/@src/stores/company";
import { ref, onMounted, shallowRef, watch } from "vue";

import ApexChart from "vue3-apexcharts";

import type { VAvatarProps } from "/@src/components/base/avatar/VAvatar.vue";
import { useInterviewsChart } from "/@src/data/dashboards/personal-v3/interviewsChart";
import { useProgressChart } from "/@src/data/dashboards/personal-v3/progressChart";
import * as userData from "/@src/data/dashboards/personal-v3/users";
import { formatDateTime } from "/@src/composable/useSupportElement";

const { progressGaugeOptions, onprogressGaugeReady } = useProgressChart();
const { interviewsOptions } = useInterviewsChart();
const api = useApi();
const route = useRoute();
const userStack = userData.userStack as VAvatarProps[];
const loading = ref(false);
const dashboardStats = ref({
  all_project: 0,
  active_projects: 0,
  pending_projects: 0,
  completed_projects: 0,
  workers: 0,
  managers: 0,
  last_mail_sent: "",
  clients: 0,
  contractors: 0,
});

const getDashboardStats = async () => {
  try {
    loading.value = true;
    const response = await api.get("/api/project/dashboard/", {});
    dashboardStats.value = response.data;
    loading.value = false;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const sendTasksMailToAllWorker = () => {
  try {
    loading.value = true;
    const resp = api.post(`/api/task/worker-mail/`, {
      worker: "all",
    });
    console.log(resp);
    getDashboardStats();

    loading.value = false;
  } catch (err) {
    console.log(err);
  }
};

onMounted(() => {
  getDashboardStats();
});
</script>

<template>
  <div class="personal-dashboard personal-dashboard-v3">
    <div class="columns is-multiline">
      <div class="column is-12">
        <div class="columns is-multiline is-flex-tablet-p">
          <div class="column is-12">
            <div class="stats-wrapper">
              <div class="columns is-multiline is-flex-tablet-p">
                <div class="column is-3">
                  <div class="dashboard-card">
                    <VBlock
                      :title="
                        dashboardStats?.all_project
                          ? dashboardStats.all_project
                          : '0'
                      "
                      subtitle="All Projects"
                      center
                    >
                      <template #icon>
                        <VIconBox color="info" rounded>
                          <i class="fas fa-cubes" aria-hidden="true"></i>
                        </VIconBox>
                      </template>
                    </VBlock>
                  </div>
                </div>
                <div class="column is-3">
                  <div class="dashboard-card">
                    <VBlock
                      :title="
                        dashboardStats?.active_projects
                          ? dashboardStats?.active_projects
                          : '0'
                      "
                      subtitle="Active Projects"
                      center
                    >
                      <template #icon>
                        <VIconBox color="blue" rounded>
                          <i class="fas fa-boxes" aria-hidden="true"></i>
                        </VIconBox>
                      </template>
                    </VBlock>
                  </div>
                </div>
                <div class="column is-3">
                  <div class="dashboard-card">
                    <VBlock
                      :title="
                        dashboardStats?.pending_projects
                          ? dashboardStats?.pending_projects
                          : '0'
                      "
                      subtitle="Pre Construction"
                      center
                    >
                      <template #icon>
                        <VIconBox color="pink" rounded>
                          <i class="fas fa-border-style" aria-hidden="true"></i>
                        </VIconBox>
                      </template>
                    </VBlock>
                  </div>
                </div>
                <div class="column is-3">
                  <div class="dashboard-card">
                    <VBlock
                      :title="
                        dashboardStats?.completed_projects
                          ? dashboardStats?.completed_projects
                          : '0'
                      "
                      subtitle="Completed"
                      center
                    >
                      <template #icon>
                        <VIconBox color="green" rounded>
                          <i class="fas fa-dice-d6" aria-hidden="true"></i>
                        </VIconBox>
                      </template>
                    </VBlock>
                  </div>
                </div>
                <div class="column is-3">
                  <div class="dashboard-card">
                    <VBlock
                      :title="
                        dashboardStats?.managers
                          ? dashboardStats?.managers
                          : '0'
                      "
                      subtitle="Managers"
                      center
                    >
                      <template #icon>
                        <VIconBox color="yellow" rounded>
                          <i
                            class="fas fa-hospital-user"
                            aria-hidden="true"
                          ></i>
                        </VIconBox>
                      </template>
                    </VBlock>
                  </div>
                </div>
                <div class="column is-3">
                  <div class="dashboard-card">
                    <VBlock
                      :title="
                        dashboardStats?.workers ? dashboardStats?.workers : '0'
                      "
                      subtitle="Workers"
                      center
                    >
                      <template #icon>
                        <VIconBox color="lime" rounded>
                          <i class="fas fa-users" aria-hidden="true"></i>
                        </VIconBox>
                      </template>
                    </VBlock>
                  </div>
                </div>
                <div class="column is-3">
                  <div class="dashboard-card">
                    <VBlock
                      :title="
                        dashboardStats?.contractors
                          ? dashboardStats?.contractors
                          : '0'
                      "
                      subtitle="Contractors"
                      center
                    >
                      <template #icon>
                        <VIconBox color="orange" rounded>
                          <i class="fas fa-user-tag" aria-hidden="true"></i>
                        </VIconBox>
                      </template>
                    </VBlock>
                  </div>
                </div>
                <div class="column is-3">
                  <div class="dashboard-card">
                    <VBlock
                      :title="
                        dashboardStats?.clients ? dashboardStats?.clients : '0'
                      "
                      subtitle="Clients"
                      center
                    >
                      <template #icon>
                        <VIconBox color="blue" rounded>
                          <i class="fas fa-user-tie" aria-hidden="true"></i>
                        </VIconBox>
                      </template>
                    </VBlock>
                  </div>
                </div>
              </div>

              <VBlock
                title="Last Schedule Sent"
                :subtitle="
                  dashboardStats.last_mail_sent
                    ? formatDateTime(dashboardStats.last_mail_sent)
                    : 'N/A'
                "
              >
                <template #icon>
                  <VIconBox color="success" rounded>
                    <VIcon icon="lucide:clock" />
                  </VIconBox>
                </template>
                <template #action>
                  <VButton
                    @click="sendTasksMailToAllWorker"
                    color="warning"
                    rounded
                    :loading="loading"
                    elevated
                  >
                    Send Schedule
                  </VButton>
                </template>
              </VBlock>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="columns is-multiline">
      <div class="column is-8">
        <ProjectsStatsChart />
      </div>
      <div class="column is-4">
        <DashBoardTasksPie style="height: 360px" />
      </div>
      <div class="column is-12">
        <DashbaordTasksChart />
      </div>

      <div class="column is-12">
        <ProjectsDashboardCalendar />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "/@src/scss/abstracts/all";

.is-navbar {
  .personal-dashboard {
    margin-top: 30px;
  }
}

.personal-dashboard-v3 {
  .columns {
    &.is-flex-tablet-p {
      .column {
        &.is-6 {
          min-width: 50%;
        }
      }
    }
  }

  .dashboard-card {
    @include vuero-l-card;

    font-family: var(--font);

    &:not(:last-child) {
      margin-bottom: 1.5rem;
    }

    &.is-welcome {
      background: var(--widget-grey);
      border: none;
      padding: 40px;

      .welcome-title {
        h3 {
          font-family: var(--font-alt);
          font-weight: 700;
          font-size: 2rem;
          color: var(--dark-text);
        }
      }

      .welcome-progress {
        display: flex;
        align-items: center;
        padding: 10px 0;

        .meta {
          margin-inline-start: 16px;

          span {
            display: block;

            &:first-child {
              color: var(--light-text);
              font-size: 0.95rem;
            }

            &:nth-child(2) {
              font-family: var(--font-alt);
              font-size: 1.1rem;
              font-weight: 600;
              color: var(--dark-text);
            }
          }
        }
      }

      .button-wrap {
        .v-button {
          height: 44px;
          border-radius: 10px;
        }
      }
    }

    &.is-interview {
      &:not(:last-child) {
        margin-bottom: 0.75rem;
      }

      .flex-end {
        svg {
          height: 18px;
          width: 18px;
          color: var(--light-text);
        }
      }
    }
  }

  .picker-widget {
    padding: 40px;
    height: 317px;
  }

  .stats-wrapper {
    display: flex;
    flex-direction: column;
    height: 280px;

    .people {
      margin-top: auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 6px;

      .left {
        span {
          display: block;
          font-family: var(--font);

          &:first-child {
            font-family: var(--font-alt);
            font-weight: 600;
            color: var(--dark-text);
          }

          &:nth-child(2) {
            font-size: 0.9rem;
            color: var(--light-text);

            a {
              font-weight: 500;
              color: var(--primary);
            }
          }
        }
      }
    }
  }
}

.is-dark {
  .personal-dashboard-v3 {
    .dashboard-card {
      @include vuero-card--dark;
    }
  }
}

.picker-widget {
  @include vuero-l-card;

  &.is-straight {
    @include vuero-s-card;
  }

  .calendar {
    color: var(--dark-text);
    font-size: 12px;
    font-family: var(--font);
    width: 100%;
    margin-bottom: 5px;

    thead,
    tbody {
      width: 100%;
    }
  }

  .calendar thead,
  .calendar th {
    color: var(--primary);
    font-weight: 600;
    font-size: 10px;
    text-transform: uppercase;
    text-align: center;
  }

  .calendar td {
    padding: 0.5em 0;
    text-align: center;
    cursor: pointer;
    border-radius: 8px;
  }

  .calendar tbody td:hover {
    background: var(--fade-grey-light-3);
    color: var(--primary);
  }

  .current-day {
    color: var(--primary);
    font-weight: 600;
  }

  .prev-month,
  .next-month {
    color: #cacaca;
  }
}

.is-dark {
  .picker-widget {
    @include vuero-card--dark;

    .calendar {
      color: var(--dark-dark-text);

      thead,
      th {
        color: var(--primary);
      }

      td:hover {
        background: var(--dark-sidebar-light-3);
        color: var(--primary);
      }
    }

    .current-day {
      color: var(--primary);
    }
  }
}

@media only screen and (width <= 767px) {
  .personal-dashboard-v3 {
    .stats-wrapper {
      height: auto;
    }
  }
}
</style>
