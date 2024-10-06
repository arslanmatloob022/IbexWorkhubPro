<script lang="ts" setup>
import { useThemeColors } from "/@src/composable/useThemeColors";
import ApexChart from "vue3-apexcharts";
import { useApi } from "/@src/composable/useAPI";

const api = useApi();
const loading = ref(false);
const themeColors = useThemeColors();

const completionOptions = ref({
  series: [
    {
      name: "Projects",
      data: [],
    },
  ],
  height: 280,
  type: "bar",

  options: {
    chart: {
      toolbar: {
        show: true,
      },
    },
    plotOptions: {
      bar: {
        dataLabels: {
          position: "top", // top, center, bottom
        },
      },
    },
    dataLabels: {
      enabled: true,
      //   formatter: asPercent,
      offsetY: -20,
      style: {
        fontSize: "12px",
        colors: ["#304758"],
      },
    },
    xaxis: {
      categories: [],
      position: "bottom",
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      crosshairs: {
        fill: {
          type: "gradient",
          gradient: {
            colorFrom: "#D8E3F0",
            colorTo: "#BED1E6",
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
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
      },
    },
    colors: [themeColors.primary, themeColors.secondary, themeColors.orange],
    title: {
      text: "",
      align: "left",
    },
  },
});

const getProjectsStats = async () => {
  try {
    loading.value = true;
    const resp = await api.get("/api/project/project-analaytics/");
    const stats = resp.data;
    completionOptions.value.series[0].data = stats.count;
    completionOptions.value.options.xaxis.categories = stats.months;
  } catch (Err) {
    console.error(Err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  getProjectsStats();
});
</script>
<template>
  <div class="dashboard-card">
    <div class="card-head">
      <h3 class="dark-inverted">Projects Stats</h3>
    </div>
    <ApexChart
      v-if="!loading"
      :height="completionOptions.height"
      :type="completionOptions.type"
      :series="completionOptions.series"
      :options="completionOptions.options"
    />
  </div>
</template>
