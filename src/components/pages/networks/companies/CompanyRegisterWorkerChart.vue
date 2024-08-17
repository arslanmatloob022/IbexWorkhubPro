<script setup lang="ts">
import ApexChart from 'vue3-apexcharts'
import { useThemeColors } from '/@src/composable/useThemeColors'

const themeColors = useThemeColors()

const profitChartOptions = shallowRef({
  series: [
    {
      name: 'Registered',
      data: [20, 34, 40, 50, 60, 80, 20, 46, 56, 80, 25, 60],
    },
  ],
  chart: {
    height: 285,
    type: 'bar',
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      dataLabels: {
        position: 'top', // top, center, bottom
      },
    },
  },
  dataLabels: {
    enabled: true,
    formatter: function (val: string) {
      return val
    },
    offsetY: -20,
    style: {
      fontSize: '12px',
      colors: ['#304758'],
    },
  },
  xaxis: {
    categories: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ],
    position: 'top',
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    crosshairs: {
      fill: {
        type: 'gradient',
        gradient: {
          colorFrom: '#D8E3F0',
          colorTo: '#BED1E6',
          stops: [0, 100],
          opacityFrom: 0.4,
          opacityTo: 0.5,
        },
      },
    },
    tooltip: {
      enabled: true,
    },
  },
  yaxis: {
    max: 100, // Set the maximum value for the y-axis
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      show: false,
      formatter: function (val: string) {
        return val
      },
    },
  },
  colors: [themeColors.primary, themeColors.secondary, themeColors.orange],
  title: {
    text: 'Registered Workers',
    align: 'left',
  },
})
</script>

<template>
  <div class="personal-dashboard personal-dashboard-v1">
   
    <!--Body-->
    <div class="dashboard-body">
      <div class="columns is-multiline">

        <!--Card-->
        <div class="column is-12">
          <div class="dashboard-card">
            <ApexChart
              :height="profitChartOptions.chart.height"
              :type="profitChartOptions.chart.type"
              :series="profitChartOptions.series"
              :options="profitChartOptions"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
