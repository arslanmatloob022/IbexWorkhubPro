<script setup lang="ts">
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { useUserSession } from "/@src/stores/userSession";
import { formatDate } from "/@src/composable/useSupportElement";

const userSession = useUserSession();
const notyf = useNotyf();
const api = useApi();
const route = useRoute();
const props = defineProps({
  user: {
    type: String,
    required: true,
  },
});

const colors = ref({
  pending: "#fbcf33",
  active: "#82d616",
  completed: "#cb0c9f",
  canceled: "#344767",
});

const workerTasksStats = ref({});
const getWorkerTodayTask = async (refresh: boolean = false, id: any = "") => {
  try {
    const resp = await api.get(`/api/task/worker-today/${id}/`);
    workerTasksStats.value = resp.data;
    if (refresh) {
      notyf.green("Tasks list Refreshed");
    }
  } catch (err) {
    console.log(err);
  }
};

onMounted(() => {
  if (props.user) {
    getWorkerTodayTask(false, props.user);
  } else {
    getWorkerTodayTask(false, userSession.user.id);
  }
});
</script>

<template>
  <div class="lifestyle-dashboard lifestyle-dashboard-v3">
    <div class="columns is-multiline is-flex-tablet-p">
      <!--Tile-->
      <div class="column is-12">
        <div class="health-tile">
          <div class="tile-head">
            <VIconBox color="primary">
              <i class="fas fa-clipboard-list" aria-hidden="true"></i>
            </VIconBox>
            <h4>
              <!-- <span class="dark-inverted"></span> -->
              <!-- <span>lbs</span> -->
            </h4>
          </div>
          <div>
            <h3 class="dark-inverted">
              Total Tasks ({{
                workerTasksStats?.stats?.pending +
                workerTasksStats?.stats?.active +
                workerTasksStats?.stats?.completed
              }})
            </h3>
            <p>Tasks assigned within 30 Days duration</p>
          </div>
        </div>
      </div>

      <!--Tile-->
      <div class="column is-12">
        <div class="health-tile">
          <div class="tile-head">
            <VIconBox color="primary">
              <i class="fas fa-calendar-day" aria-hidden="true"></i>
            </VIconBox>
            <!-- <h4> -->
            <!-- <span class="dark-inverted"></span> -->

            <!-- <span>Active</span> -->
            <!-- </h4> -->
          </div>
          <div>
            <h3 class="dark-inverted">
              Active Tasks ({{
                workerTasksStats?.stats?.active
                  ? workerTasksStats?.stats?.active
                  : 0
              }})
            </h3>
            <p>Tasks are currently active and worker notified</p>
          </div>
        </div>
      </div>

      <!--Tile-->
      <div class="column is-12">
        <div class="health-tile">
          <div class="tile-head">
            <VIconBox color="primary">
              <i class="fas fa-clipboard" aria-hidden="true"></i>
            </VIconBox>
            <h4>
              <!-- <span class="dark-inverted"></span> -->
              <!-- <span>Bpm</span> -->
            </h4>
          </div>
          <div>
            <h3 class="dark-inverted">
              Pending Tasks ({{
                workerTasksStats?.stats?.pending
                  ? workerTasksStats?.stats?.pending
                  : 0
              }})
            </h3>
            <p>Tasks pending and worker need to done.</p>
          </div>
        </div>
      </div>

      <!--Tile-->
      <div class="column is-12">
        <div class="health-tile">
          <div class="tile-head">
            <VIconBox color="primary">
              <i class="fas fa-clipboard-check" aria-hidden="true"></i
            ></VIconBox>
            <h4>
              <!-- <span class="dark-inverted"></span> -->
              <!-- <span>lbs</span> -->
            </h4>
          </div>
          <div>
            <h3 class="dark-inverted">
              Completed Tasks ({{
                workerTasksStats?.stats?.completed
                  ? workerTasksStats?.stats?.completed
                  : 0
              }})
            </h3>
            <p>The manager confirmed tasks are completed by worker.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "/@src/scss/abstracts/all";

.lifestyle-dashboard-v3 {
  .illustration-header {
    display: flex;
    align-items: center;
    padding: 10px;
    border-radius: 16px;
    background: var(--primary-dark-24);
    font-family: var(--font);
    margin-bottom: 30px;

    .header-image {
      position: relative;
      height: 168px;
      width: 280px;

      img {
        position: absolute;
        top: -76px;
        inset-inline-start: -30px;
        display: block;
        pointer-events: none;
      }
    }

    .header-meta {
      margin-inline-start: 0;

      h3 {
        color: var(--smoke-white);
        font-family: var(--font-alt);
        font-weight: 700;
        font-size: 1.3rem;
      }

      p {
        font-weight: 400;
        color: var(--smoke-white-dark-16);
        margin-bottom: 16px;
      }

      .summary-stats {
        display: flex;

        .summary-stat {
          margin-inline-end: 30px;

          span {
            font-family: var(--font);
            display: block;

            &:first-child {
              font-size: 1.1rem;
              font-family: var(--font-alt);
              color: var(--smoke-white);
            }

            &:nth-child(2) {
              color: var(--primary-light-18);
              font-size: 0.85rem;
            }
          }
        }
      }

      .action-link {
        span {
          font-size: 0.8rem;
          text-transform: uppercase;
          margin-inline-end: 6px;
        }

        i {
          font-size: 12px;
        }
      }
    }
  }

  .health-tile {
    font-family: var(--font);
    display: flex;

    .tile-head {
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      .v-icon {
        margin-inline-end: 10px;
      }

      h4 {
        span {
          &:first-child {
            font-size: 1.2rem;
            font-weight: 600;
            color: var(--dark-text);
            margin-inline-end: 0.25rem;
          }

          &:nth-child(2) {
            font-size: 0.95rem;
            color: var(--light-text);
          }
        }
      }
    }

    h3 {
      font-family: var(--font-alt);
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--dark-text);
    }

    p {
      font-size: 0.95rem;
    }
  }

  .dashboard-card {
    @include vuero-l-card;

    .card-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;

      h3 {
        color: var(--dark-text);
        font-size: 1.2rem;
        font-weight: 500;
      }
    }

    .chart-meta {
      p {
        font-size: 0.95rem;
        max-width: 80%;

        svg {
          position: relative;
          top: 2px;
          height: 16px;
          width: 16px;
          color: var(--light-text);
        }

        a {
          color: var(--primary);
          font-weight: 500;
        }
      }
    }
  }
}

.is-dark {
  .lifestyle-dashboard-v3 {
    .dashboard-card {
      @include vuero-card--dark;
    }
  }
}

@media only screen and (width <= 767px) {
  .lifestyle-dashboard-v3 {
    .illustration-header {
      flex-direction: column;
      text-align: center;

      .header-image {
        height: auto;
        width: 100%;

        img {
          position: relative;
          width: 100%;
          max-width: 260px;
          margin: 0 auto;
          top: 0;
          margin-top: -75px;
        }
      }

      .header-meta {
        padding: 20px;

        > p {
          max-width: 280px;
          margin-inline-start: auto;
          margin-inline-end: auto;
        }

        .summary-stats {
          flex-wrap: wrap;

          .summary-stat {
            margin: 10px;
            min-width: calc(33.3% - 20px);
          }
        }
      }
    }

    .health-tile {
      padding: 20px;
      background: var(--white);
      border: 1px solid var(--fade-grey-dark-3);
      border-radius: 10px;
    }
  }

  .is-dark {
    .lifestyle-dashboard-v3 {
      .health-tile {
        background: var(--dark-sidebar-light-6);
        border-color: var(--dark-sidebar-light-12);
      }
    }
  }
}

@media only screen and (width >= 768px) and (width <= 1024px) and (orientation: portrait) {
  .lifestyle-dashboard-v3 {
    .illustration-header {
      .header-image {
        width: 250px;
      }
    }
  }
}
</style>
