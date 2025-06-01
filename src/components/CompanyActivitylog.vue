<script setup lang="ts">
import { useApi } from "/@src/composable/useAPI";
import { useRouter, useRoute } from "vue-router";
import { useUserSession } from "/@src/stores/userSession";
import { ref, computed, onMounted, onUnmounted } from "vue";
const userSession = useUserSession();
const router = useRouter();
const route = useRoute();
const api = useApi();
const Loading = ref(false);
const actions = ref({
  count: 0,
  next: null,
  previous: null,
  results: [
    {
      id: "298d8a63-1acb-4d5c-b395-b27d389ddf09",
      action: "UPDATE",
      timestamp: "2025-05-28T16:12:22.424612-04:00",
      actor_info: {
        id: "73462666-c7f0-41eb-b978-24f5ffe7a539",
        role: "admin",
        email: "mike@ibexbuilderstudios.com",
        avatar: null,
        username: "Mike",
        last_name: null,
      },
      message:
        "updated proposal titled <a>Wood Floor Refinishing</a> information.",
      object_id: "32e3d9a6-ee38-4f34-912c-8202fb797882",
      object_type: "proposal",
      actor: "73462666-c7f0-41eb-b978-24f5ffe7a539",
    },
  ],
});

const Logs_exist = ref(false);
const props = defineProps({
  id: {
    type: String,
    default: 0,
  },
  worker: {
    type: Object,
    default: {},
  },
});
const selectedOption = ref("2");
const radioOptions = [
  { value: "1", label: "Today" },
  { value: "2", label: "Yesterday" },
  { value: "7", label: "Last 7 Days" },
  { value: "14", label: "Last 14 Days" },
  { value: "30", label: "Last 30 Days" },
  { value: "90", label: "Last 90 Days" },
  { value: "all", label: "All" },
];

// Fetch worker activities
const getCompanyLogs = async () => {
  Loading.value = true;
  try {
    const response = await api.get(
      `/api/activity-logs/?page=${currentPage.value}&page_size=${maxItemsPerPage}`
    );
    actions.value = response.data;
  } catch (error) {
    console.error("Error fetching worker activities:", error);
  } finally {
    Loading.value = false;
  }
};

// Define ring colors for action types
const ringColors = {
  get: "is-success",
  post: "is-info",
  patch: "is-warning",
  delete: "is-danger",
};
function formatDate(inputDate: string) {
  const dateObject = new Date(inputDate);
  const options = { year: "numeric", month: "short", day: "numeric" };
  return dateObject.toLocaleString("en-US", options);
}

// Calculate date range based on selected option
function calculateDateRange(option: string) {
  const now = new Date();
  const start = new Date();
  const end = new Date();

  switch (option) {
    case "1": // Today
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case "2": // Yesterday
      start.setDate(now.getDate() - 1); // Start from yesterday
      start.setHours(0, 0, 0, 0); // Start of yesterday
      end.setHours(23, 59, 59, 999); // End of today
      break;
    case "7": // Last 7 Days
      start.setDate(now.getDate() - 7);
      break;
    case "14": // Last 14 Days
      start.setDate(now.getDate() - 14);
      break;
    case "30": // Last 30 Days
      start.setDate(now.getDate() - 30);
      break;
    case "90": // Last 90 Days
      start.setDate(now.getDate() - 90);
      break;
    case "all": // All
    default:
      return null; // No date filtering
  }

  return { start, end };
}

// Pagination and search
const currentPage = ref(1);
const maxItemsPerPage = ref(20);

const filter = ref("");
const filteredActions = computed(() => {
  if (!filter.value) {
    return actions.value.results;
  } else {
    const filterRe = new RegExp(filter.value, "i");

    return actions.value.results.filter((item) => {
      return (
        item.id.match(filterRe) ||
        item.actor_info.username.match(filterRe) ||
        item.actor_info.email.match(filterRe) ||
        item.message.match(filterRe) ||
        item.timestamp.match(filterRe)
      );
    });
  }
});

// Compute if pagination should be shown
const showPagination = computed(() => {
  return filteredActions.value.length > maxItemsPerPage.value;
});

// Handle page change
const handlePageChange = (page: number) => {
  currentPage.value = page;
  router.push({
    path: route.path,
    query: { ...route.query, page },
  });
  getCompanyLogs();
};

// Lifecycle hooks
onMounted(() => {
  currentPage.value = parseInt(route.query.page as string) || 1;
  getCompanyLogs();
});

onUnmounted(() => {});
</script>

<template>
  <div class="columns is-multiline">
    <div class="column is-12">
      <div
        class="column is-12 mt-6 is-flex is-flex-direction-column"
        style="gap: 20px; align-items: center"
      >
        <VField addons style="width: 21rem">
          <VControl expanded>
            <VInput
              @keypress.enter="getCompanyLogs"
              type="text"
              class="input"
              v-model="filter"
              placeholder="Search ..."
            />
          </VControl>
          <VControl>
            <VButton color="primary">
              <i class="fa fa-search"></i>
            </VButton>
          </VControl>
        </VField>
        <div class="timeline-wrapper">
          <div class="timeline-header" />
          <div class="timeline-wrapper-inner no-padding-all">
            <div class="timeline-container">
              <PlaceloadV1 v-if="Loading" />

              <div
                class="timeline-item is-unread"
                v-for="item in filteredActions"
                :key="item?.id"
              >
                <div class="date">
                  <span>{{ formatDate(item?.timestamp.slice(0, 10)) }}</span>
                </div>
                <div class="dot" :class="ringColors[item.action]" />
                <div class="content-wrap">
                  <div class="content-box">
                    <VAvatar :picture="item?.actor_info.avatar" />
                    <div class="box-text">
                      <div class="meta-text">
                        <p>
                          <span
                            :style="{
                              color: `${
                                item.actor === item?.object_id
                                  ? 'var(--red)'
                                  : ''
                              }`,
                            }"
                            >{{ item?.actor_info.username }}
                            {{ item?.actor_info.last_name }}.
                          </span>
                          <span
                            class="action-message"
                            v-html="item?.message"
                          ></span>
                        </p>
                        <span>{{ item?.timestamp.slice(11, 16) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- No Logs Placeholder -->
              <VPlaceholderPage
                v-if="!actions.count"
                title="No Activity found."
                subtitle="Looks like you haven't done any activity on this worker yet. Anything you do will show up here."
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
          </div>

          <!-- Pagination -->
          <VFlexPagination
            v-if="actions.count > maxItemsPerPage"
            v-model:current-page="currentPage"
            :item-per-page="maxItemsPerPage"
            :total-items="actions.count"
            :max-links-displayed="7"
            no-router
            class="mt-4"
            @update:current-page="handlePageChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.action-message {
  font-weight: 400 !important;
  color: var(--light-text-light-42) !important;

  b {
    color: #2aac8e !important;
  }
}
</style>

<style lang="scss" scoped>
@import "/@src/scss/abstracts/all";

/*
    1. Timeline
    2. Timeline Dark mode
    3. Media Queries
  */

/* ==========================================================================
  1. Timeline
  ========================================================================== */
.activity {
  font-size: 1.4rem;
  font-weight: 500;
  color: #000;
  height: 3.5rem;
  border-color: #e4f7f0;
  text-align: center;
}
.timeline-wrapper {
  // max-width: 940px;
  width: 100% !important;
  margin: 0 auto;

  .timeline-wrapper-inner {
    padding-top: 30px;

    .timeline-container {
      .timeline-item {
        position: relative;
        display: flex;
        align-items: center;
        margin-bottom: 10px;

        &::before {
          content: "";
          position: absolute;
          top: 46px;
          inset-inline-start: 111px;
          height: 100%;
          width: 2px;
          background: var(--placeholder);
          z-index: 0;
        }

        &:last-child {
          &::before {
            display: none;
          }
        }

        &.is-unread {
          .content-wrap {
            .content-box {
              .status {
                background: var(--red) !important;
              }
            }
          }
        }

        .date {
          width: 80px;
          font-family: var(--font);
          text-align: inset-inline-end;

          span {
            font-size: 0.9rem;
            color: var(--light-text);
          }
        }

        .dot {
          position: relative;
          height: 14px;
          width: 14px;
          border-radius: var(--radius-rounded);
          border: 2.6px solid var(--primary);
          margin: 0 25px;
          z-index: 1;

          &.is-info {
            border-color: var(--info);
          }

          &.is-success {
            border-color: var(--success);
          }

          &.is-warning {
            border-color: var(--warning);
          }

          &.is-danger {
            border-color: var(--danger);
          }

          &.is-purple {
            border-color: var(--purple);
          }
        }

        .content-wrap {
          @include vuero-s-card;

          flex-grow: 2;

          .content-box {
            display: flex;
            align-items: center;

            .status {
              height: 8px;
              width: 8px;
              min-width: 8px;
              border-radius: var(--radius-rounded);
              background: var(--light-text-light-15);
              margin: 0 16px 0 0;
            }
            .no-status {
              height: 8px;
              width: 8px;
              min-width: 8px;
              border-radius: var(--radius-rounded);
              margin: 0 16px 0 0;
            }

            .box-text {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-inline-start: 12px;
              flex-grow: 2;

              .meta-text {
                line-height: 1.2;

                p {
                  color: var(--light-text-dark-10);

                  span {
                    font-family: var(--font-alt);
                    color: var(--dark-text);
                    font-weight: 600;
                  }

                  a {
                    color: var(--primary);
                  }

                  .tag {
                    position: relative;
                    top: -1px;
                    font-weight: 500;
                    line-height: 1.8;
                    height: 1.8em;
                    margin: 0 2px;
                  }
                }

                > span {
                  color: var(--light-text);
                  font-size: 0.9rem;
                }
              }
            }

            .box-end {
              margin-inline-start: auto;

              .v-avatar {
                margin: 0 2px;
              }
            }
          }

          .meta-content {
            padding-inline-start: 78px;
          }
        }
      }
    }

    .load-more-wrap {
      padding: 40px 0;

      .button {
        min-width: 240px;
        min-height: 50px;
        text-transform: uppercase;
        font-size: 0.85rem;
        font-weight: 500;
        color: var(--light-text);
      }
    }
  }
}

/* ==========================================================================
  2. Timeline Dark mode
  ========================================================================== */

.is-dark {
  .timeline-wrapper {
    .timeline-wrapper-inner {
      .timeline-container {
        .timeline-item {
          &::before {
            background: var(--dark-sidebar-light-20);
          }

          .content-wrap {
            @include vuero-card--dark;

            .content-box {
              .status {
                background: var(--dark-sidebar-light-20);
              }

              .box-text {
                .meta-text {
                  p {
                    span {
                      color: var(--dark-dark-text);
                    }

                    a {
                      color: var(--primary);
                    }
                  }
                }
              }
            }
          }
        }
      }

      .load-more-wrap {
        .button {
          background: var(--dark-sidebar-light-2) !important;
        }
      }
    }
  }
}

/* ==========================================================================
  3. Media Queries
  ========================================================================== */

@media only screen and (width <=767px) {
  .timeline-wrapper {
    .timeline-wrapper-inner {
      padding-top: 0;

      .timeline-container {
        .timeline-item {
          flex-direction: column;

          &::before {
            display: none;
          }

          .dot {
            display: none;
          }

          .date {
            align-self: end;
            margin-bottom: 4px;
          }

          .content-wrap {
            .content-box {
              .box-end {
                display: none;
              }
            }
          }
        }
      }
    }
  }
}

@media only screen and (width >=768px) and (width <=1024px) and (orientation: portrait) {
  .timeline-wrapper {
    .timeline-wrapper-inner {
      padding-top: 0;

      .timeline-container {
        .timeline-item {
          flex-direction: column;

          &::before {
            display: none;
          }

          .dot {
            display: none;
          }

          .date {
            align-self: end;
            margin-bottom: 4px;
          }

          .content-wrap {
            .content-box {
              .box-end {
                display: none;
              }
            }
          }
        }
      }
    }
  }
}
</style>
