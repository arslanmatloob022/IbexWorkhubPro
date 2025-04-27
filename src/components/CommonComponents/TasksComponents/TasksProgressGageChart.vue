<script setup lang="ts">
import ApexChart from "vue3-apexcharts";
import { useThemeColors } from "/@src/composable/useThemeColors";

const props = defineProps({
  percentCount: {
    type: Number,
    required: true,
    default: 0,
  },
});

const themeColors = useThemeColors();

const flexRadialChartStripesOptions = shallowRef({
  series: [props.percentCount],
  chart: {
    height: 190,
    type: "radialBar",
    offsetX: -15,
    offsetY: -10,
    toolbar: {
      show: false,
    },
  },
  colors: [themeColors.info, themeColors.secondary],
  plotOptions: {
    radialBar: {
      startAngle: -135,
      endAngle: 135,
      dataLabels: {
        name: {
          fontSize: "13px",
          fontWeight: "600",
          color: themeColors.lightText,
          show: false,
        },
        value: {
          offsetY: 5,
          fontSize: "16px",
          fontFamily: "Roboto, sans-serif",
          fontWeight: "500",
          color: undefined,
          formatter: function (val: string) {
            return val + "%";
          },
        },
      },
    },
  },
  fill: {
    type: "gradient",
    gradient: {
      shade: "dark",
      shadeIntensity: 0.15,
      inverseColors: false,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 50, 65, 91],
    },
  },
  stroke: {
    dashArray: 4,
  },
  labels: ["(30 days)"],
});
</script>
<template>
  <ApexChart
    id="flex-stat-radial"
    :height="flexRadialChartStripesOptions.chart.height"
    :type="flexRadialChartStripesOptions.chart.type"
    :series="flexRadialChartStripesOptions.series"
    :options="flexRadialChartStripesOptions"
  />
</template>
