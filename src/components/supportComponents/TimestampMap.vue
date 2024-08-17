<script setup lang="ts">
import { ref, onMounted, shallowRef, watch } from "vue";
import ApexChart from "vue3-apexcharts";
import { useThemeColors } from "/@src/composable/useThemeColors";
const themeColors = useThemeColors();

const showChart = ref(false)

const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
}>();
const props = defineProps<{
    activities: any;
    timestamp:any
}>();


//line chart code
const lineStatsChartOptions = shallowRef({
  series: [
    {
      name: "Profiles",
      data: props.activities,
    },
  ],

  chart: {
    height: 270,
    type: "area",
    zoom: {
      enabled: false,
    },
    toolbar: {
      show: false,
    },
  },
  colors: [themeColors.success],
  dataLabels: {
    enabled: false,
  },
  stroke: {
    width: [4, 5, 5],
    curve: "smooth",
  },
  grid: {
    row: {
      colors: ["transparent", "transparent"], // takes an array which will be repeated on columns
      opacity: 0,
    },
    yaxis: {
      lines: {
        show: false, //or just here to disable only x axis grids
      },
    },
  },
  xaxis: {
    categories: props.timestamp,
  },
  tooltip: {
    y: {
      formatter: function (val: string) {
        return val;
      },
    },
  },
});


onMounted(() => {
    showChart.value = true
});
</script>

<template>
  
        
        <div styke="width:100%; height:100%">
          <ApexChart
          v-if="showChart"
            id="line-stats-widget-chart2"
            :height="lineStatsChartOptions.chart.height"
            :type="lineStatsChartOptions.chart.type"
            :series="lineStatsChartOptions.series"
            :options="lineStatsChartOptions"
          />
        </div>
            
   
</template>