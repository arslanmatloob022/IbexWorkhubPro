<script setup lang="ts">
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { usePersonalScoreGauge } from "/@src/data/widgets/charts/personalScoreGauge";
import { useUserSession } from "/@src/stores/userSession";

const userSession = useUserSession();
const notyf = useNotyf();
const api = useApi();
const route = useRoute();
const events = ref<any>([]);
const router = useRouter();
const tab = ref("cards");
const openPasswordModal = ref(false);

const { personalScoreGaugeOptions, onPersonalScoreGaugeReady } =
  usePersonalScoreGauge();
const workerData = ref({
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
const fullWidthView = ref(false);
const activeFilter = ref("all");
const loading = ref(false);

// Tasks, Resources, Events, and Projects as Reactive Arrays
const tasks = ref([]);
const filteredResources = ref([]);
const filteredEvents = ref([]);
const projects = ref<any>([]);

// Colors as an Object
const colors = ref({
  pending: "#fbcf33",
  active: "#82d616",
  completed: "#cb0c9f",
  canceled: "#344767",
});

const calendarOptions = ref({
  plugins: [resourceTimelinePlugin],
  schedulerLicenseKey: "0965592368-fcs-1694657447",
  initialView: "resourceTimelineMonth",
  height: "auto",
  resourceAreaWidth: "20%",
  selectable: true,
  events: [],
  headerToolbar: {
    left: "today prev,next",
    center: "title",
    right: "resourceTimelineWeek,resourceTimelineMonth,resourceTimelineYear",
  },
  editable: true,
  views: {
    resourceTimelineWeek: {
      slotDuration: { days: 1, hours: 1 },
      slotLabelFormat: {
        weekday: "short",
        month: "numeric",
        day: "numeric",
        year: "numeric",
      },
    },
  },
  resourceAreaHeaderContent: "Projects",
  resources: [],
});

const sendTasksMailToWorker = async () => {
  try {
    const resp = await api.post(`/api/task/worker-mail/`, {
      worker: route.params.id,
    });
    console.log(resp);
    notyf.success(
      `List of tasks sent to ${workerData.value.username} successfully`
    );
  } catch (err) {
    console.log(err);
  }
};

const renderCalendar = () => {
  events.value = tasks.value.map((task) => ({
    id: task.id,
    resourceId: task.project.id,
    start: task.startDate,
    end: task.endDate,
    title: task.title,
    color: task.color,
    description: task.description,
    workers: task.workers,
    borderColor: colors[task.status],
    status: task.status,
  }));

  projects.value = tasks.value.map((task) => ({
    id: task.project.id,
    start: task.project.startDate,
    end: task.project.endDate,
    title: task.project.title,
    address: task.project.address,
    status: task.project.status,
    color: colors[task.project.status],
  }));

  filteredResources.value = projects.value;
  filteredEvents.value = events.value;

  // Update the reactive calendar options object properly
  calendarOptions.value = {
    ...calendarOptions.value, // Keep other properties intact
    resources: filteredResources.value, // Assign resources in a reactive manner
    events: filteredEvents.value, // Assign events in a reactive manner
  };

  console.log(
    "tasks",
    calendarOptions.value.events,
    "resources",
    calendarOptions.value.resources
  );
};

const changeFilterHandler = () => {
  if (activeFilter.value !== "all") {
    const data = events.value.filter(
      (event) => event.status === activeFilter.value
    );
    filteredEvents.value = data;
  } else {
    filteredEvents.value = events.value;
  }
  calendarOptions.value.events = filteredEvents.value;
};

// Method to get tasks for a worker
const getTasksHandler = async () => {
  try {
    const response = await api.get(
      `/api/task/${route.params.id}/worker-tasks/`
    );
    tasks.value = response.data;
    console.log("worker tasks", tasks.value);
  } catch (err) {
    tasks.value = [];
  }
};

const getContractorDetailHandler = async () => {
  try {
    loading.value = true;
    const response = await api.get(
      `/api/users/${route.params.id ? route.params.id : userSession.user.id}`
    );
    workerData.value = response.data;
    // renderCalendar();
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};
const showFullView = () => {
  fullWidthView.value = !fullWidthView.value;
};

const workerTasksStats = ref({});
const getWorkerTodayTask = async () => {
  try {
    const resp = await api.get(`/api/task/worker-today/${props.workerId}/`);
    workerTasksStats.value = resp.data.stats;
    if (refresh) {
      notyf.green("Tasks list Refreshed");
    }
  } catch (err) {
    console.log(err);
  }
};

onMounted(async () => {
  await getContractorDetailHandler();
  //   await getTasksHandler();
  //   renderCalendar();
  //   getWorkerTodayTask();
});
</script>

<template>
  <div class="lifestyle-dashboard lifestyle-dashboard-v3">
    <div class="illustration-header">
      <div class="p-4">
        <VAvatar size="xl" squared :picture="workerData.avatar" alt="" />
      </div>
      <div class="header-meta">
        <h3>
          {{ loading ? "Loading..." : workerData?.username }}
          <i
            @click="openPasswordModal = true"
            class="lnir lnir-lock"
            aria-hidden="true"
          ></i>
        </h3>
        <!-- <p>Monitor your activity and keep improving your weak points.</p> -->
        <div class="summary-stats">
          <div class="summary-stat">
            <span>Role</span>
            <span>{{ loading ? "Loading..." : workerData?.role }}</span>
          </div>
          <div class="summary-stat">
            <span>Status</span>
            <span>{{
              loading
                ? "Loading..."
                : workerData?.is_active
                ? "Active"
                : " In-Active"
            }}</span>
          </div>
          <div class="summary-stat">
            <span>Phone</span>
            <span>{{
              loading
                ? "Loading..."
                : workerData?.phoneNumber
                ? workerData?.phoneNumber
                : "N/A"
            }}</span>
          </div>
          <div class="summary-stat">
            <span>Email</span>
            <span>{{ loading ? "Loading..." : workerData?.email }}</span>
          </div>
          <div class="summary-stat h-hidden-tablet-p">
            <span>Email Notification</span>
            <span>{{
              loading ? "Loading..." : workerData.is_sentMail ? "On" : "Off"
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="columns is-multiline is-flex-tablet-p profile-wrapper">
      <div class="column is-12">
        <ContractorProjects
          :contractor-id="
            route.params.id ? route.params.id : userSession.user.id
          "
        />
      </div>
    </div>
    <ChangePasswordModal
      v-if="openPasswordModal"
      :isModalOpen="openPasswordModal"
      :userId="route.params.id"
      @update:closeModalHandler="openPasswordModal = false"
    />
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
<style lang="scss">
@import "/@src/scss/abstracts/all";
@import "/@src/scss/components/profile-stats";

.is-navbar {
  .profile-wrapper {
    margin-top: 30px;
  }
}

.profile-wrapper {
  max-width: 1040px;
  margin: 0 auto;

  .profile-header {
    text-align: center;

    > img {
      display: block;
      margin: 0 auto;
      max-width: 300px;
    }

    .v-avatar {
      margin: 0 auto 12px;
    }

    .anim-icon {
      margin-bottom: 12px;
    }

    .title {
      margin-bottom: 6px;
    }

    p {
      font-size: 1rem;
      max-width: 540px;
      margin: 0 auto;
      line-height: 1.3;
    }
  }

  .profile-body {
    padding: 10px 0 20px;

    .profile-card {
      @include vuero-s-card;

      padding: 30px;

      &:not(:last-child) {
        margin-bottom: 20px;
      }

      .profile-card-section {
        padding-bottom: 20px;

        &:not(:last-child) {
          margin-bottom: 20px;
          border-bottom: 1px solid var(--fade-grey-dark-4);
        }

        &.no-padding {
          padding-bottom: 0;
        }

        .section-title {
          display: flex;
          align-items: center;
          margin-bottom: 12px;

          h4 {
            font-family: var(--font-alt);
            font-weight: 600;
            font-size: 0.8rem;
            text-transform: uppercase;
            color: var(--dark-text);
            margin-inline-end: 6px;
          }

          i {
            color: var(--primary);
          }

          .action-link {
            position: relative;
            top: -2px;
            margin-inline-start: auto;
            text-transform: uppercase;
            font-size: 0.8rem;
          }

          .control {
            margin-inline-start: auto;

            .form-switch {
              transform: scale(0.8);
            }
          }
        }

        .section-content {
          .description {
            font-size: 0.95rem;
          }

          .experience-wrapper {
            display: flex;
            flex-wrap: wrap;
            margin-inline-start: -8px;
            margin-inline-end: -8px;

            .experience-item {
              display: flex;
              align-items: center;
              width: calc(50% - 16px);
              margin: 8px;

              img {
                display: block;
                width: 50px;
                min-width: 50px;
                height: 50px;
                border-radius: var(--radius-rounded);
                border: 1px solid var(--fade-grey-dark-4);
              }

              .meta {
                margin-inline-start: 10px;

                > span {
                  font-family: var(--font);
                  display: block;

                  &:first-child {
                    font-family: var(--font-alt);
                    font-weight: 600;
                    color: var(--dark-text);
                    font-size: 0.85rem;
                  }

                  &:nth-child(2),
                  &:nth-child(3) {
                    font-size: 0.85rem;
                    color: var(--light-text);

                    i {
                      position: relative;
                      top: -2px;
                      font-size: 4px;
                      margin: 0 6px;
                    }
                  }

                  &:nth-child(3) {
                    color: var(--primary);
                  }

                  span {
                    display: inline-block;
                  }
                }
              }
            }
          }

          .languages-wrapper {
            display: flex;
            flex-wrap: wrap;
            margin-inline-start: -8px;
            margin-inline-end: -8px;

            .languages-item {
              display: flex;
              align-items: center;
              width: calc(50% - 16px);
              margin: 8px;

              .icon-wrap {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 50px;
                min-width: 50px;
                height: 50px;

                img {
                  position: absolute;
                  top: 50%;
                  inset-inline-start: 50%;
                  transform: translate(-50%, -50%);
                  display: block;
                  width: 32px;
                  min-width: 32px;
                  height: 32px;
                  border-radius: var(--radius-rounded);
                  border: 1px solid var(--fade-grey-dark-4);
                }
              }

              .meta {
                margin-inline-start: 10px;

                > span {
                  display: block;
                  font-family: var(--font);

                  &:first-child {
                    font-family: var(--font-alt);
                    font-weight: 600;
                    color: var(--dark-text);
                    font-size: 0.9rem;
                  }

                  &:nth-child(2) {
                    font-size: 0.85rem;
                    color: var(--light-text);
                  }

                  span {
                    display: inline-block;
                  }
                }
              }
            }
          }

          .skills-wrapper {
            .skills-item {
              display: flex;
              align-items: center;

              &:not(:last-child) {
                margin-bottom: 16px;
              }

              .icon-wrap {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 42px;
                min-width: 42px;
                height: 42px;
                border-radius: var(--radius-rounded);
                border: 1px solid var(--primary);

                &.has-icon {
                  background: var(--fade-grey-light-2);
                  border: 1px solid var(--fade-grey-dark-3);
                  color: var(--light-text);

                  i {
                    font-size: 1.4rem;
                  }
                }

                img {
                  display: block;
                  width: 34px;
                  min-width: 34px;
                  height: 34px;
                  border-radius: var(--radius-rounded);
                  border: 1px solid var(--fade-grey-dark-4);
                }

                .count {
                  position: absolute;
                  bottom: 0;
                  inset-inline-end: -4px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  width: 22px;
                  height: 22px;
                  border-radius: var(--radius-rounded);
                  background: var(--white);
                  border: 1px solid var(--primary);

                  span {
                    font-family: var(--font);
                    font-weight: 500;
                    font-size: 0.75rem;
                  }
                }
              }

              .skill-info {
                font-family: var(--font);
                margin-inline-start: 12px;
                line-height: 1.3;

                span {
                  display: block;

                  &:first-child {
                    font-family: var(--font-alt);
                    font-weight: 600;
                    color: var(--dark-text);
                    font-size: 0.9rem;
                  }

                  &:nth-child(2) {
                    font-size: 0.9rem;
                    color: var(--light-text);
                  }
                }
              }

              .people {
                margin-inline-start: auto;
                display: flex;
                justify-content: flex-end;

                .v-avatar {
                  margin: 0 4px;
                }
              }
            }
          }

          .recommendations-wrapper {
            display: flex;
            flex-wrap: wrap;
            margin-inline-start: -8px;
            margin-inline-end: -8px;

            .recommendations-item {
              width: calc(50% - 16px);
              margin: 8px;
              background: var(--fade-grey-light-3);
              text-align: center;
              padding: 30px 20px;
              border-radius: var(--radius);

              > .v-avatar {
                display: block;
                margin: 0 auto 8px;
              }

              h3 {
                font-size: 1rem;
                font-family: var(--font-alt);
                font-weight: 600;
                color: var(--dark-text);
                margin-bottom: 8px;
              }

              p {
                font-size: 0.85rem;
                margin-bottom: 16px;
              }

              .meta {
                span {
                  display: block;

                  &:first-child {
                    font-weight: 600;
                    font-family: var(--font-alt);
                    font-size: 0.95rem;
                    color: var(--primary);
                  }

                  &:nth-child(2) {
                    font-size: 0.9rem;
                    color: var(--light-text);
                  }
                }
              }
            }
          }

          .network-notifications {
            h3 {
              font-family: var(--font-alt);
              font-size: 0.9rem;
              margin-bottom: 6px;
            }

            p {
              font-size: 0.9rem;
              max-width: 480px;
            }
          }

          .tools-wrapper {
            padding-top: 12px;

            .tools-item {
              display: flex;
              align-items: center;
              margin-bottom: 16px;

              &:last-child {
                margin-bottom: 0;
              }

              .icon-wrap {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 50px;
                min-width: 50px;
                height: 50px;

                img {
                  position: absolute;
                  top: 50%;
                  inset-inline-start: 50%;
                  transform: translate(
                    calc(var(--transform-direction) * -50%),
                    -50%
                  );
                  display: block;
                  width: 32px;
                  min-width: 32px;
                  height: 32px;
                  border-radius: var(--radius-rounded);
                  border: 1px solid transparent;
                }
              }

              .meta {
                margin-inline-start: 10px;

                > span {
                  display: block;
                  font-family: var(--font);

                  &:first-child {
                    font-family: var(--font-alt);
                    font-weight: 600;
                    color: var(--dark-text);
                    font-size: 0.9rem;
                  }

                  &:nth-child(2) {
                    font-size: 0.85rem;
                    color: var(--light-text);
                  }

                  span {
                    display: inline-block;
                  }
                }
              }
            }
          }

          .people-wrapper {
            padding-top: 12px;

            .people-item {
              display: flex;
              align-items: center;
              margin-bottom: 16px;

              &:last-child {
                margin-bottom: 0;
              }

              .meta {
                margin-inline-start: 10px;

                > span {
                  display: block;
                  font-family: var(--font);

                  &:first-child {
                    font-family: var(--font-alt);
                    font-weight: 600;
                    color: var(--dark-text);
                    font-size: 0.9rem;
                  }

                  &:nth-child(2) {
                    font-size: 0.85rem;
                    color: var(--light-text);
                  }

                  span {
                    display: inline-block;
                  }
                }
              }
            }
          }

          .more-button {
            padding-top: 16px;

            .button {
              min-width: 180px;
              font-family: var(--font);
              text-transform: uppercase;
              font-size: 0.8rem;
              font-weight: 500;
              margin: 0 auto;
              color: var(--light-text);
            }
          }
        }
      }
    }
  }
}

.is-dark {
  .profile-wrapper {
    .profile-header {
      .v-avatar {
        .badge {
          border-color: var(--dark-sidebar-light-6);
        }
      }
    }

    .profile-body {
      .profile-card {
        @include vuero-card--dark;

        .profile-card-section {
          border-color: var(--dark-sidebar-light-12);

          .section-title {
            h4 {
              color: var(--dark-dark-text);
            }

            i {
              color: var(--primary);
            }
          }

          .section-content {
            .icon-wrap {
              > img {
                border-color: var(--dark-sidebar-light-12) !important;
              }
            }

            .experience-wrapper {
              .experience-item {
                > img {
                  border-color: var(--dark-sidebar-light-12);
                }

                .meta {
                  > span {
                    &:nth-child(3) {
                      color: var(--primary);
                    }
                  }
                }
              }
            }

            .skills-wrapper {
              .skills-item {
                .icon-wrap {
                  border-color: var(--primary) !important;

                  &.has-icon,
                  &.has-img {
                    background: var(--dark-sidebar-light-2) !important;
                    border-color: var(--dark-sidebar-light-12) !important;
                  }
                }

                .people {
                  .v-avatar {
                    &:last-child {
                      .is-fake {
                        background: var(--dark-sidebar-light-2);
                        border: 1px solid var(--dark-sidebar-light-12);
                      }
                    }
                  }
                }
              }
            }

            .recommendations-wrapper {
              .recommendations-item {
                background: var(--dark-sidebar-light-2);
                border-color: var(--dark-sidebar-light-12);

                .meta {
                  span {
                    &:first-child {
                      color: var(--primary);
                    }
                  }
                }
              }
            }

            .more-button {
              .button {
                background: var(--dark-sidebar-light-2);
                border-color: var(--dark-sidebar-light-12);
              }
            }
          }
        }
      }
    }
  }

  .icon-wrap,
  .icon-wrap.is-placeholder {
    background: var(--dark-sidebar-light-2) !important;
    border-color: var(--dark-sidebar-light-12) !important;
  }
}

@media only screen and (width <= 767px) {
  .profile-wrapper {
    .profile-body {
      .profile-card {
        padding: 20px;

        .profile-card-section {
          .section-content {
            .experience-wrapper,
            .languages-wrapper,
            .recommendations-wrapper {
              .experience-item,
              .languages-item,
              .recommendations-item {
                width: calc(100% - 16px);
              }
            }

            .skills-wrapper {
              .skills-item {
                .people {
                  .v-avatar {
                    &:not(:last-child) {
                      display: none !important;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
