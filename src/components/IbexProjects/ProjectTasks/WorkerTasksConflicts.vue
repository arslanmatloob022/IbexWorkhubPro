<script setup lang="ts">
import { formatDate } from "/@src/composable/useSupportElement";
import { useNotyf } from "/@src/composable/useNotyf";

const notyf = useNotyf();
const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: null): void;
}>();

const props = defineProps<{
  conflictsDetailModal?: boolean;
  conflictData?: object;
  startDate?: string;
  endDate?: string;
}>();

const closeModalHandler = () => {
  emit("update:modalHandler", true);
};

const generateTooltip = (tasks: any) => {
  if (!tasks || tasks.length === 0) return "No tasks available";
  return tasks.map((task: any) => task.title).join(" __ ");
};

const tooltip = ref({
  visible: false,
  tasks: <any>[
    {
      id: "36913bdf-8056-4a06-823a-86e92c591615",
      title: "Bathroom Tiling 3",
    },
    {
      id: "369178bdf-8056-4a06-823a-86e92c591615",
      title: "Bathroom Tiling 1",
    },
  ],
  x: 0,
  y: 0,
});

const showTooltip = (tasks: any[], event: MouseEvent) => {
  notyf.success("Tasks found within given date range");
  tooltip.value.tasks = tasks;

  tooltip.value.x = event.pageX + 10; // Offset for better positioning
  tooltip.value.y = event.pageY + 10;
  console.log("tasks", tooltip.value.tasks);
  tooltip.value.visible = true;
};

const hideTooltip = () => {
  tooltip.value.visible = false;
};
</script>

<template>
  <VModal
    v-if="props.conflictsDetailModal"
    :open="props.conflictsDetailModal"
    title="Conflicts Details"
    actions="right"
    size="big"
    @close="closeModalHandler"
  >
    <template #content>
      <div class="heatmap-wrapper">
        <div class="heatmap-title">
          <div class="title-meta">
            <p>
              Tasks found within given date range:
              <span class="primary-text">{{
                formatDate(props.startDate)
              }}</span>
              to
              <span class="primary-text">{{ formatDate(props.endDate) }}</span
              >.
            </p>
          </div>
        </div>

        <div class="heatmap-inner">
          <div v-for="item in props.conflictData?.map" class="heatmap-row">
            <div class="heatmap-row-label">
              <span>{{ item.month }}</span>
            </div>
            <div class="heatmap-row-content">
              <div
                v-for="date in item.dates"
                :key="item.date"
                class="heatmap-row-item is-relative"
              >
                <Tippy placement="top">
                  <span
                    style="
                      position: absolute;
                      font-weight: bold;
                      top: 1px;
                      right: 1px;
                      color: var(--dark-inverted);
                    "
                    >{{ date.date.slice(8, 10) }}</span
                  >
                  <i
                    v-if="date.count"
                    class="fas fa-exclamation-triangle danger-text cu-pointer"
                    aria-hidden="true"
                  ></i>

                  <i
                    v-if="!date.count"
                    class="fas fa-check primary-text"
                    aria-hidden="true"
                  ></i>
                  <template #content>
                    <div class="v-popover-content is-text">
                      <div class="popover-head">
                        <h4 class="dark-inverted">
                          {{
                            date.tasks?.length
                              ? "Conflicts Found"
                              : "No Conflicts Found"
                          }}
                        </h4>
                      </div>
                      <div v-if="date.tasks?.length" class="popover-body">
                        <ol>
                          <li v-for="task in date.tasks" :key="task.id">
                            <p class="primary-text">{{ task.job_title }}</p>
                            <p>{{ task.title }}</p>
                          </li>
                        </ol>
                      </div>
                      <div v-else class="popover-body">
                        <p>You can add tasks on this date</p>
                      </div>
                    </div>
                  </template>
                </Tippy>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #action>
      <VButton style="display: none" color="primary" raised> Confirm </VButton>
    </template>
    <template #cancel>
      <VButton @click="closeModalHandler" raised> Close </VButton>
    </template>
  </VModal>
</template>

<style lang="scss" scoped>
.popover-body {
  padding: 6px;
  ol li {
    margin-bottom: 5px;
  }

  ol li:last-child {
    margin-bottom: 0;
  }

  ol li p:first-child {
    color: #333 !important;
    font-size: 11px !important;
    font-weight: 500 !important;
  }
}
.primary-text {
  color: var(--primary) !important;
}

.heatmap-wrapper {
  .heatmap-title {
    display: flex;
    align-items: center;
    padding: 16px;

    .title-avatar {
      border-radius: var(--radius-rounded);
      border: 1px solid var(--fade-grey-dark-3);
      box-shadow: var(--light-box-shadow);

      img {
        display: block;
        height: 50px;
        width: 50px;
        min-width: 50px;
        border-radius: var(--radius-rounded);
        border: 3px solid var(--white);
      }
    }

    .title-meta {
      margin-inline-start: 16px;

      p {
        span {
          color: var(--dark-text);
          font-weight: 500;
        }
      }
    }
  }

  .heatmap-inner {
    .heatmap-row {
      display: flex;
      align-items: center;

      .heatmap-row-label {
        width: 60px;
        text-align: center;
        color: var(--light-text);
        font-size: 0.95rem;
      }

      .heatmap-row-content {
        display: flex;
        flex-wrap: wrap; /* Allow wrapping of items */
        gap: 5px; /* Add spacing between items */
        // flex-grow: 2;
        justify-content: flex-start; /* Align items to the start of the row */
        align-items: center;

        .heatmap-row-item {
          margin: 5px;
          position: relative;
          // flex: 1 1 0;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 30px;
          width: 50px;
          border-radius: var(--radius-large);
          background: var(--widget-grey-dark-2);

          &.heat-1 {
            background: #e984a4;
          }

          &.heat-2 {
            background: #dd6c90;
          }

          &.heat-3 {
            background: #d34f79;

            i {
              color: var(--warning);
              font-size: 12px;
            }
          }

          &.is-time {
            background: none;
            color: var(--light-text);
            font-size: 0.95rem;
            min-height: 26px;
          }
        }
      }
    }
  }
}

.is-dark {
  .heatmap-wrapper {
    .heatmap-title {
      .title-avatar {
        border-color: var(--dark-sidebar-light-12);

        img {
          border-color: var(--dark-sidebar-dark-2);
        }
      }

      .title-meta {
        p span {
          color: var(--dark-dark-text);
        }
      }
    }

    .heatmap-inner {
      .heatmap-row {
        .heatmap-row-content {
          .heatmap-row-item:not(.is-time) {
            background: var(--dark-sidebar-light-10);

            &.heat-1 {
              background: var(--dark-sidebar-light-2);
            }

            &.heat-2 {
              background: var(--primary-light-10);
            }

            &.heat-3 {
              background: var(--primary);

              i {
                color: var(--warning);
              }
            }
          }
        }
      }
    }
  }
}

@media only screen and (width >= 768px) and (width <= 1024px) and (orientation: portrait) {
  .heatmap-wrapper {
    .heatmap-inner {
      .heatmap-row {
        .heatmap-row-label {
          width: 40px;
        }

        .heatmap-row-content {
          .heatmap-row-item {
            &:first-child,
            &:nth-child(2),
            &:nth-child(3),
            &:nth-child(4),
            &:nth-child(5),
            &:nth-child(6),
            &:nth-child(7),
            &:nth-child(8),
            &:nth-child(9) {
              display: none;
            }

            &.is-time {
              font-size: 0.85rem;
            }
          }
        }
      }
    }
  }
}

@media only screen and (width >= 768px) and (width <= 1024px) and (orientation: landscape) {
  .heatmap-wrapper {
    .heatmap-inner {
      .heatmap-row {
        .heatmap-row-label {
          width: 40px;
        }

        .heatmap-row-content {
          .heatmap-row-item {
            &:first-child,
            &:nth-child(2),
            &:nth-child(3),
            &:nth-child(4),
            &:nth-child(5),
            &:nth-child(6) {
              display: none;
            }

            &.is-time {
              font-size: 0.85rem;
            }
          }
        }
      }
    }
  }
}
</style>
