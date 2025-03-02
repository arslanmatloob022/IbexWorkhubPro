<script lang="ts" setup>
import { useApi } from "/@src/composable/useAPI";
import moment from "moment";
const api = useApi();
const logsList = ref([
  {
    id: "06b62536-220c-4d54-b437-50f035677d17",
    action: "UPDATE",
    timestamp: "2025-02-21T18:09:11.830145Z",
    actor_info: {
      id: "0feda007-d8a0-4b96-acb7-d7763614854e",
      username: "Test &",
      last_name: "Dev",
      email: "test@dev.com",
      role: "admin",
      avatar:
        "https://ibex-documents.s3.us-east-2.amazonaws.com/public/static/users_avatars/Screenshot_from_2025-01-17_15-14-32.png",
    },
    message: "updated <b>HENNING</b> lead information.",
    object_id: "1be101da-7a93-43af-b3e3-d1ca908aa2c9",
    object_type: "lead",
    actor: "0feda007-d8a0-4b96-acb7-d7763614854e",
  },
]);
const props = defineProps<{
  object_id: string;
  object_type: string;
}>();

const getActionColor = {
  UPDATE: "is-info",
  RETRIEVE: "is-warning",
  DELETE: "is-danger",
  CREATE: "is-primary",
};

const getActivityLogs = async () => {
  try {
    const res = await api.get(
      `/api/activity-logs/?object_id=${props.object_id}`
    );
    logsList.value = res.data;
  } catch (err) {
    console.log(err);
  }
};

onMounted(() => {
  getActivityLogs();
});
</script>

<template>
  <div class="timeline-wrapper">
    <div class="timeline-header" />
    <div class="timeline-wrapper-inner">
      <div class="timeline-container">
        <!--Timeline item-->
        <div v-for="item in logsList" class="timeline-item is-unread">
          <div class="date">
            <span>{{ moment(item.timestamp).format("ddd, mm yyyy") }}</span>
          </div>
          <div class="dot" :class="getActionColor[item.action]" />
          <div class="content-wrap">
            <div class="content-box">
              <div class="status" />
              <VAvatar :picture="item.actor_info?.avatar" />
              <div class="box-text">
                <div class="meta-text">
                  <p>
                    <span
                      >{{ item.actor_info?.username ?? "N/A" }}
                      {{ item.actor_info?.last_name ?? "N/A" }}</span
                    >
                    <span class="log-message" v-html="item.message"> </span>
                  </p>
                  <span>{{ moment(item.timestamp).format("hh:mm:ss") }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- <div class="load-more-wrap has-text-centered">
        <VButton dark-outlined> Load More </VButton>
      </div> -->
    </div>
  </div>
</template>
<style lang="scss">
.log-message {
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
.timeline-wrapper {
  max-width: 940px;
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
                    color: var(--info) !important;
                    font-weight: 600;
                  }

                  a {
                    color: var(--primary);
                  }

                  div {
                    // color: var(--primary);
                    b {
                      color: var(--primary) !important;
                    }
                  }
                  b {
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

                > b {
                  color: var(--primary);
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
                      color: var(--info);
                    }

                    a {
                      color: var(--primary);
                    }
                    div {
                      b {
                        color: var(--primary);
                      }
                    }
                    b {
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

@media only screen and (width <= 767px) {
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

@media only screen and (width >= 768px) and (width <= 1024px) and (orientation: portrait) {
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
