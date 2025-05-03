<script setup lang="ts">
import { useApi } from "/@src/composable/useAPI";
import { useUserSession } from "/@src/stores/userSession";
import ManagerProjectsList from "/@src/pages/sidebar/manager/projects/ManagerProjectsList.vue";

const userSession = useUserSession();
const api = useApi();
const route = useRoute();
const managerData = ref({
  id: "",
  password: "",
  last_login: null,
  date_joined: "",
  email: "",
  role: "",
  avatar: "",
  is_active: true,
  phoneNumber: "",
  last_name: "",
  username: "",
  is_sentMail: false,
});
const loading = ref(false);
const tab = ref("projects");
const getManagerDetailHandler = async () => {
  try {
    loading.value = true;
    const response = await api.get(
      `/api/users/${route.params.id ? route.params.id : userSession.user.id}`
    );
    managerData.value = response.data;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await getManagerDetailHandler();
});
</script>

<template>
  <div class="lifestyle-dashboard lifestyle-dashboard-v3">
    <div class="illustration-header">
      <div class="p-4">
        <VAvatar size="xl" squared :picture="managerData.avatar" alt="" />
      </div>
      <div class="header-meta">
        <h3>
          {{ loading ? "Loading..." : managerData?.username }}
          {{ managerData.last_name ? managerData.last_name : "" }}
        </h3>
        <div class="summary-stats">
          <div class="summary-stat">
            <span>Role</span>
            <span>{{ loading ? "Loading..." : managerData?.role }}</span>
          </div>
          <div class="summary-stat">
            <span>Status</span>
            <span>{{
              loading
                ? "Loading..."
                : managerData?.is_active
                ? "Active"
                : " In-Active"
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="tabs-wrapper">
      <div class="tabs-inner">
        <div class="tabs is-boxed" slider>
          <ul>
            <li :class="[tab === 'projects' && 'is-active']">
              <a
                tabindex="0"
                role="button"
                @keydown.space.prevent="tab = 'projects'"
                @click="tab = 'projects'"
                ><span>Projects</span></a
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

    <div class="columns is-multiline">
      <div v-if="tab === 'projects'" class="column is-12">
        <ManagerProjectsList v-if="userSession.user.role == 'manager'" />
        <ManagerProjects
          v-else
          :managerID="route.params.id ? route.params.id : userSession.user.id"
        />
      </div>
      <div v-if="tab === 'profile'" class="column is-12">
        <UserProfileInfo
          :userData="managerData"
          @update:action-update-handler="getManagerDetailHandler"
        />
      </div>
      <div v-if="tab === 'todos'" class="column is-12">
        <JobTodos :user="route.params.id" />
      </div>
      <div v-if="tab === 'activities'" class="column is-12">
        <JobLeadActivities :user="route.params.id" />
      </div>
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
    background: #202944;
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
