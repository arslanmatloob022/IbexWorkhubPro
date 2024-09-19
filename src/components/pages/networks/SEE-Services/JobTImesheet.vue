<script setup lang="ts">
import { useApi } from "/@src/composable/useAPI";
import { TimeSheetInterFace } from "/@src/composable/useInterfaces";
import { formatDate, formatDateTime } from "/@src/composable/useSupportElement";

const api = useApi();
const Loading = ref(false);
const timeSheetDetailModal = ref(false);
const timesheetID = ref(0);
const timesheet = ref<TimeSheetInterFace[]>([]);
const props = defineProps({
  id: {
    type: String,
    default: 0,
  },
});

const getJobTimeSheet = async () => {
  try {
    Loading.value = true;
    const resp = await api.get(`v3/api/timesheet/job/${props.id}/`);
    timesheet.value = resp.data;
    console.log("timesheeeet", timesheet.value);
    Loading.value = false;
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  getJobTimeSheet();
});
</script>

<template>
  <div class="timeline-wrapper">
    <div class="timeline-header" />
    <div class="timeline-wrapper-inner">
      <div class="timeline-container">
        <!--Timeline item-->
        <!--  :style="{border:`1px solid ${ringColors[item.method]}`}" -->
        <PlaceloadV1 v-if="Loading" />
        <div class="timeline-item is-unread" v-for="item in timesheet">
          <div class="date">
            <span>{{ formatDate(item.created_at) }}</span>
          </div>
          <div class="dot is-success" />
          <div class="content-wrap">
            <div
              class="content-box"
              @click="
                () => {
                  timeSheetDetailModal = true;
                  timesheetID = item.id;
                }
              "
            >
              <div class="no-status" />
              <!-- Start -->

              <div class="container">
                <!-- First Half -->
                <div class="half">
                  <div class="" style="display: flex; align-items: center">
                    <VAvatar
                      :picture="item.bookOnImageURL"
                      squared
                      size="medium"
                    />

                    <div class="box-text">
                      <div class="meta-text">
                        <p>
                          <span>{{ formatDateTime(item.bookOnTime) }}</span>
                        </p>
                        <span class="">
                          <i
                            class="lnir lnir-hospital-location mr-2"
                            style="font-size: larger; color: var(--primary)"
                            aria-hidden="true"
                          ></i>
                          {{
                            item.bookOnLocation &&
                            item.bookOnLocation.length > 90
                              ? item.bookOnLocation.slice(0, 90) + "..."
                              : item.bookOnLocation
                          }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Second Half -->
                <div class="half">
                  <div class="" style="display: flex; align-items: center">
                    <VAvatar
                      :picture="item.bookOffImageURL"
                      squared
                      size="medium"
                    />
                    <div class="box-text">
                      <div class="meta-text">
                        <p>
                          <span>{{ formatDateTime(item.bookOffTime) }}</span>
                        </p>
                        <span style="display: flex">
                          <i
                            class="lnir lnir-hospital-location mr-2"
                            style="font-size: larger; color: var(--primary)"
                            aria-hidden="true"
                          ></i>
                          <!-- {{ item.bookOffLocation }} -->
                          {{
                            item.bookOffLocation &&
                            item.bookOffLocation.length > 90
                              ? item.bookOffLocation.slice(0, 90) + "..."
                              : item.bookOffLocation
                          }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!--End  -->

              <div class="box-end">
                <VDropdown icon="feather:more-vertical" spaced right>
                  <template #content>
                    <a
                      role="menuitem"
                      href="#"
                      class="dropdown-item is-media"
                      @click="timeSheetDetailModal = true"
                    >
                      <div class="icon">
                        <i aria-hidden="true" class="lnil lnil-bubble" />
                      </div>
                      <div class="meta">
                        <span>Activity</span>
                        <span>View activity of Timesheet</span>
                      </div>
                    </a>
                  </template>
                </VDropdown>
              </div>
            </div>
          </div>
        </div>

        <VPlaceholderPage
          v-if="timesheet.length == 0"
          title="No Activity found."
          subtitle="Looks like you don't have done any activity on this worker yet as you will do anything, that will be showing up in here."
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

    <TimeSheetDetail
      v-if="timeSheetDetailModal"
      :timeSheetDetailModal="timeSheetDetailModal"
      timesheetId="993"
      @update:modalHandler="
        () => {
          timeSheetDetailModal = false;
        }
      "
    />
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

.container {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.half {
  width: 50%;
}

/*
   1. Timeline
   2. Timeline Dark mode
   3. Media Queries
 */

/* ==========================================================================
 1. Timeline
 ========================================================================== */
.timeline-wrapper {
  max-width: 1040px;
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
          top: 55px;
          inset-inline-start: 151px;
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
          width: 120px;
          font-family: var(--font);
          //   text-align: inset-inline-end;

          span {
            font-size: 14px;
            color: var(--light-text);
            font-weight: bold;
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
                  margin-bottom: 5px;

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
