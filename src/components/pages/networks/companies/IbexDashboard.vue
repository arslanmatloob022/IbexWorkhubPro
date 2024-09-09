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
const themeColors = useThemeColors();
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
      <div class="column is-6">
        <ProjectsCompletionChart />
      </div>
      <div class="column is-6">
        <ActiveProjectsChart />
      </div>
      <div class="column is-12">
        <ProjectsDashboardCalendar />
      </div>
      <!-- <div class="column is-6">
        <UIWidget class="picker-widget">
          <template #header>
            <div class="widget-toolbar">
              <div class="left">
                <a class="action-icon">
                  <i
                    aria-hidden="true"
                    class="iconify ltr-hidden"
                    data-icon="feather:chevron-right"
                  />
                  <i
                    aria-hidden="true"
                    class="iconify rtl-hidden"
                    data-icon="feather:chevron-left"
                  />
                </a>
              </div>
              <div class="center">
                <h3>October 2020</h3>
              </div>
              <div class="right">
                <a class="action-icon">
                  <i
                    aria-hidden="true"
                    class="iconify rtl-hidden"
                    data-icon="feather:chevron-right"
                  />
                  <i
                    aria-hidden="true"
                    class="iconify ltr-hidden"
                    data-icon="feather:chevron-left"
                  />
                </a>
              </div>
            </div>
          </template>
          <template #body>
            <table class="calendar">
              <thead>
                <tr>
                  <th scope="col">Mon</th>
                  <th scope="col">Tue</th>
                  <th scope="col">Wed</th>
                  <th scope="col">Thu</th>
                  <th scope="col">Fri</th>
                  <th scope="col">Sat</th>
                  <th scope="col">Sun</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td class="prev-month">29</td>
                  <td class="prev-month">30</td>
                  <td class="prev-month">31</td>
                  <td>1</td>
                  <td>2</td>
                  <td>3</td>
                  <td>4</td>
                </tr>

                <tr>
                  <td>5</td>
                  <td>6</td>
                  <td>7</td>
                  <td>8</td>
                  <td>9</td>
                  <td>10</td>
                  <td>11</td>
                </tr>

                <tr>
                  <td>12</td>
                  <td>13</td>
                  <td>14</td>
                  <td>15</td>
                  <td>16</td>
                  <td>17</td>
                  <td class="current-day">18</td>
                </tr>

                <tr>
                  <td>19</td>
                  <td>20</td>
                  <td>21</td>
                  <td>22</td>
                  <td>23</td>
                  <td>24</td>
                  <td>25</td>
                </tr>

                <tr>
                  <td>26</td>
                  <td>27</td>
                  <td>28</td>
                  <td>29</td>
                  <td>30</td>
                  <td>31</td>
                  <td class="next-month">1</td>
                </tr>
              </tbody>
            </table>
          </template>
        </UIWidget>

        <a href="#" class="dashboard-card is-interview">
          <VBlock title="Jonathan K." subtitle="08:00 - 09:00" center>
            <template #icon>
              <VAvatar picture="/demo/avatars/32.jpg" />
            </template>
            <template #action>
              <i
                aria-hidden="true"
                class="iconify rtl-hidden"
                data-icon="feather:chevron-right"
              />
              <i
                aria-hidden="true"
                class="iconify ltr-hidden"
                data-icon="feather:chevron-left"
              />
            </template>
          </VBlock>
        </a>
        <a href="#" class="dashboard-card is-interview">
          <VBlock title="Greta K." subtitle="10:30 - 11:00" center>
            <template #icon>
              <VAvatar picture="/demo/avatars/19.jpg" />
            </template>
            <template #action>
              <i
                aria-hidden="true"
                class="iconify rtl-hidden"
                data-icon="feather:chevron-right"
              />
              <i
                aria-hidden="true"
                class="iconify ltr-hidden"
                data-icon="feather:chevron-left"
              />
            </template>
          </VBlock>
        </a>
        <a href="#" class="dashboard-card is-interview">
          <VBlock title="Joshua S." subtitle="02:30 - 03:00" center>
            <template #icon>
              <VAvatar picture="/demo/avatars/12.jpg" />
            </template>
            <template #action>
              <i
                aria-hidden="true"
                class="iconify rtl-hidden"
                data-icon="feather:chevron-right"
              />
              <i
                aria-hidden="true"
                class="iconify ltr-hidden"
                data-icon="feather:chevron-left"
              />
            </template>
          </VBlock>
        </a>
      </div>
      <div class="column is-6">
        <div class="dashboard-card">
          <ApexChart
            id="interviews-chart"
            :height="interviewsOptions.chart.height"
            :type="interviewsOptions.chart.type"
            :series="interviewsOptions.series"
            :options="interviewsOptions"
          />
        </div>
      </div> -->

      <!-- <div class="column is-6 h-hidden-mobile h-hidden-tablet-p">
        <img
          src="/@src/assets/illustrations/dashboards/personal/interviews.svg"
          alt=""
        />
      </div> -->
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
