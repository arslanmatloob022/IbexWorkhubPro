<script setup lang="ts">
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import { useApi } from "/@src/composable/useAPI";
import Worker from "/@src/pages/sidebar/worker.vue";
const api = useApi();
const route = useRoute();
const loading = ref(false);
const tab = ref("tasks");
const subTab = ref("calendar");
const subcontractorData = ref({
  id: "",
  password: "",
  last_login: null,
  date_joined: "",
  email: "",
  role: "",
  avatar: "",
  is_active: true,
  phoneNumber: "",
  username: "",
  is_sentMail: false,
});

const getContractorDetailHandler = async () => {
  try {
    loading.value = true;
    const response = await api.get(`/api/users/${route.params.id}`);
    subcontractorData.value = response.data;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await getContractorDetailHandler();
});
</script>

<template>
  <div class="lifestyle-dashboard lifestyle-dashboard-v3">
    <div class="illustration-header">
      <div class="p-4">
        <VAvatar size="xl" squared :picture="subcontractorData.avatar" alt="" />
      </div>
      <div class="header-meta">
        <h3>
          {{ loading ? "Loading..." : subcontractorData?.username }}
          {{ subcontractorData.last_name ? subcontractorData.last_name : "" }}
        </h3>
        <div class="summary-stats">
          <div class="summary-stat">
            <span>{{ loading ? "Loading..." : "Subcontractor" }}</span>
            <span>Role</span>
          </div>
          <div class="summary-stat">
            <span>{{ loading ? "Loading..." : subcontractorData?.email }}</span>
            <span>Email</span>
          </div>
        </div>
      </div>
    </div>
    <div class="tabs-wrapper">
      <div class="tabs-inner">
        <div class="tabs is-boxed" slider>
          <ul>
            <li :class="[tab === 'tasks' && 'is-active']">
              <a
                tabindex="0"
                role="button"
                @keydown.space.prevent="tab = 'tasks'"
                @click="tab = 'tasks'"
                ><span>Tasks</span></a
              >
            </li>
            <li :class="[tab === 'workers' && 'is-active']">
              <a
                tabindex="0"
                role="button"
                @keydown.space.prevent="tab = 'workers'"
                @click="tab = 'workers'"
                ><span>Workers</span></a
              >
            </li>
            <li :class="[tab === 'profile' && 'is-active']">
              <a
                tabindex="0"
                role="button"
                @keydown.space.prevent="tab = 'profile'"
                @click="tab = 'profile'"
                ><span>Profile Info</span></a
              >
            </li>
            <li :class="[tab === 'todos' && 'is-active']">
              <a
                tabindex="0"
                role="button"
                @keydown.space.prevent="tab = 'todos'"
                @click="tab = 'todos'"
                ><span>Todos</span></a
              >
            </li>
            <li :class="[tab === 'activities' && 'is-active']">
              <a
                tabindex="0"
                role="button"
                @keydown.space.prevent="tab = 'activities'"
                @click="tab = 'activities'"
                ><span>Activities</span></a
              >
            </li>
            <li class="tab-naver" />
          </ul>
        </div>
      </div>
    </div>
    <div v-if="tab == 'tasks'" class="columns is-multiline is-flex-tablet-p">
      <div class="list-flex-toolbar is-reversed">
        <div class="tabs-inner">
          <div class="tabs is-boxed">
            <ul>
              <li :class="[subTab === 'calendar' && 'is-active']">
                <a
                  tabindex="0"
                  role="button"
                  @keydown.space.prevent="subTab = 'calendar'"
                  @click="subTab = 'calendar'"
                  ><span>Tasks Calendar</span></a
                >
              </li>
              <li :class="[subTab === 'chronic' && 'is-active']">
                <a
                  tabindex="0"
                  role="button"
                  @keydown.space.prevent="subTab = 'chronic'"
                  @click="subTab = 'chronic'"
                  ><span>Chronic View</span></a
                >
              </li>
              <li :class="[subTab === 'tasks' && 'is-active']">
                <a
                  tabindex="0"
                  role="button"
                  @keydown.space.prevent="subTab = 'tasks'"
                  @click="subTab = 'tasks'"
                  ><span>Tasks</span></a
                >
              </li>

              <li class="tab-naver" />
            </ul>
          </div>
        </div>
      </div>
      <div v-if="subTab == 'calendar'" class="column is-12">
        <WorkerCalendar :worker-id="route.params.id" />
      </div>

      <div v-if="subTab == 'chronic'" class="column is-12">
        <ChronicTasksView :userId="route.params.id" />
      </div>
      <div v-if="subTab == 'tasks'" class="column is-12">
        <WorkerTasks :workerId="route.params.id" />
      </div>
    </div>
    <div v-if="tab == 'workers'" class="columns is-multiline is-flex-tablet-p">
      <div class="column is-12">
        <WorkersOfSubcontractors
          :supplier-id="route.params.id"
        ></WorkersOfSubcontractors>
      </div>
    </div>
    <div v-if="tab == 'profile'" class="columns is-multiline is-flex-tablet-p">
      <div class="column is-12">
        <UserProfileInfo :user-data="subcontractorData" />
      </div>
    </div>
    <div v-if="tab == 'todos'" class="columns is-multiline is-flex-tablet-p">
      <div class="column is-12">
        <JobTodos :user="route.params.id" />
      </div>
    </div>
    <div v-if="tab === 'activities'" class="column is-12">
      <JobLeadActivities :user="route.params.id" />
    </div>
  </div>
</template>

<style lang="scss">
@import "/@src/scss/abstracts/all";

.lifestyle-dashboard-v3 {
  .illustration-header {
    display: flex;
    align-items: center;
    padding: 10px;
    border-radius: 16px;
    background: #23074d; /* fallback for old browsers */
    background: -webkit-linear-gradient(
      to left,
      #cc5333,
      #23074d
    ); /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(
      to left,
      #cc5333,
      #23074d
    ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

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
