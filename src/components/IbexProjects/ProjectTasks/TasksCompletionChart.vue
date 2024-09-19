<script setup lang="ts">
import { useThemeColors } from "/@src/composable/useThemeColors";

const themeColors = useThemeColors();

const props = defineProps<{
  completedTasks: {
    type: string;
    default: 0;
  };
}>();

const optionsCircle = shallowRef({
  series: [props.completedTasks],
  chart: {
    height: 160,
    type: "radialBar",
    toolbar: {
      show: false,
    },
  },
  colors: [themeColors.accent],
  plotOptions: {
    radialBar: {
      hollow: {
        size: "75%",
      },
      dataLabels: {
        show: true,
        name: {
          show: true,
          fontSize: "14px",
          fontWeight: 500,
          offsetY: -10,
          color: themeColors.lightText,
        },
        value: {
          show: true,
          fontWeight: 600,
          color: themeColors.purple,
          fontSize: "16px",
          offsetY: -5,
        },
      },
    },
  },
  labels: ["Completion"],
});
</script>
<template>
  <div class="dashboard-card">
    <div class="card-head">
      <h3 class="dark-inverted">Sales</h3>
    </div>

    <div class="progress-block">
      <div class="value">
        <span class="dark-inverted">78%</span>
      </div>
      <VProgress size="tiny" :value="78" />
      <div class="progress-foot">
        <span class="text-h-green"
          >+6.4%
          <i
            aria-hidden="true"
            class="iconify"
            data-icon="feather:trending-up"
          />
        </span>
        <span>since last month</span>
      </div>

      <ApexChart
        id="radial-circle"
        class="circle-chart-wrapper"
        :height="optionsCircle.chart.height"
        :type="optionsCircle.chart.type"
        :series="optionsCircle.series"
        :options="optionsCircle"
      />
    </div>
  </div>
</template>
<style scoped lang="scss">
@import "/@src/scss/abstracts/all";
.dashboard-card {
  @include vuero-s-card;

  font-family: var(--font);
  height: 100%;

  .card-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;

    h3 {
      font-family: var(--font-alt);
      font-size: 1rem;
      font-weight: 600;
      color: var(--dark-text);
    }
  }

  .revenue-stats {
    display: flex;

    .revenue-stat {
      margin-inline-end: 30px;
      font-family: var(--font);

      span {
        display: block;

        &:first-child {
          color: var(--light-text);
          font-size: 0.9rem;
        }

        &:nth-child(2) {
          color: var(--dark-text);
          font-size: 1.2rem;
          font-weight: 600;
        }

        &.current {
          color: var(--primary);
        }
      }
    }
  }

  .radial-wrap {
    display: flex;
    flex-direction: column;
    height: calc(100% - 44px);

    .radial-stats {
      margin-top: auto;
      display: flex;
      padding-top: 20px;
      border-top: 1px solid var(--fade-grey-dark-3);

      .radial-stat {
        width: 50%;
        text-align: center;

        &:first-child {
          border-inline-end: 1px solid var(--fade-grey-dark-3);
        }

        span {
          display: block;

          &:first-child {
            color: var(--light-text);
            font-size: 0.9rem;
          }

          &:nth-child(2) {
            color: var(--dark-text);
            font-size: 1.3rem;
            font-weight: 600;
          }
        }
      }
    }
  }

  .progress-block {
    display: flex;
    flex-direction: column;
    height: calc(100% - 44px);
    font-family: var(--font);

    .value {
      font-size: 1.4rem;
      font-weight: 600;

      span {
        color: var(--dark-text);
      }
    }

    .progress {
      margin-bottom: 8px;
    }

    .progress-foot {
      span {
        &:first-child {
          font-weight: 500;

          svg {
            height: 16px;
            width: 16px;
            margin-inline-end: 6px;
            stroke-width: 3px;
          }
        }

        &:nth-child(2) {
          color: var(--light-text);
          font-size: 0.9rem;
        }
      }
    }

    .circle-chart-wrapper {
      margin-top: auto;
    }
  }
}
.is-dark {
  .analytics-dashboard {
    .dashboard-tile,
    .dashboard-card {
      @include vuero-card--dark;
    }
  }
}
</style>
