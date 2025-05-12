<script setup lang="ts">
import { formatDate } from "/@src/composable/useSupportElement";

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
  return tasks.map((task: any) => task.title).join("; ");
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
                v-tooltip.rounded.warning="generateTooltip(date.tasks)"
              >
                <span
                  style="
                    position: absolute;
                    font-weight: bold;
                    top: 1px;
                    right: 1px;
                    color: var(--primary);
                  "
                  >{{ date.date.slice(8, 10) }}</span
                >
                <i
                  v-if="date.count"
                  class="fas fa-exclamation-triangle warning-text"
                  aria-hidden="true"
                ></i>

                <i
                  v-else
                  class="fas fa-check primary-text"
                  aria-hidden="true"
                ></i>
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

<style lang="scss">
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
