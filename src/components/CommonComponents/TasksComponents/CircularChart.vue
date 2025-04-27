<script lang="ts" setup>
import { useThemeColors } from "/@src/composable/useThemeColors";
import ApexChart from "vue3-apexcharts";

const themeColors = useThemeColors();
const props = defineProps({
  percentCount: {
    type: Number,
    required: true,
    default: 0,
  },
  id: {
    type: String,
    required: true,
    default: "",
  },
  color: {
    type: String,
    required: true,
    default: "",
  },
});

const widgetRadialGroup1Options = shallowRef({
  series: [props.percentCount],
  chart: {
    height: 102,
    type: "radialBar",
    offsetY: -10,
    toolbar: {
      show: false,
    },
  },
  colors: [props.color],
  plotOptions: {
    radialBar: {
      hollow: {
        size: "35%",
      },
      dataLabels: {
        show: false,
      },
    },
  },
  labels: [""],
});
</script>
<template>
  <ApexChart
    :id="props.id"
    :height="widgetRadialGroup1Options.chart.height"
    :type="widgetRadialGroup1Options.chart.type"
    :series="widgetRadialGroup1Options.series"
    :options="widgetRadialGroup1Options"
  />
</template>
