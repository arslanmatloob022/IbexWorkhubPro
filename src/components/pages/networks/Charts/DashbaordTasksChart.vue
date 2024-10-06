<script lang="ts" setup>
import { useThemeColors } from "/@src/composable/useThemeColors";
import ApexChart from "vue3-apexcharts";
import { useApi } from "/@src/composable/useAPI";

const api = useApi();
const loading = ref(false);
const themeColors = useThemeColors();

const completionOptions = shallowRef({
  series: [],
  chart: {
    height: 295,
    type: "area",
    toolbar: {
      show: true,
    },
  },
  colors: [themeColors.accent, themeColors.info, themeColors.primary],
  legend: {
    position: "top",
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    width: [2, 3, 5],
    curve: "smooth",
  },
  xaxis: {
    type: "date",
    categories: [],
  },
  tooltip: {
    x: {
      format: "dd/MM/yy HH:mm",
    },
  },
});

const getTasksStats = async () => {
  try {
    loading.value = true;
    const resp = await api.get("/api/task/dashboard-analaytics/");
    const stats = resp.data;
    completionOptions.value.series = stats.series;
    completionOptions.value.xaxis.categories = stats.dates;
  } catch (Err) {
    console.error(Err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  getTasksStats();
});
</script>
<template>
  <div class="dashboard-card">
    <div class="card-head">
      <h3 class="dark-inverted">Task Completion</h3>
      <!-- <a class="action-link" tabindex="0">Reports</a> -->
    </div>
    <ApexChart
      v-if="!loading"
      id="completion-chart"
      :height="completionOptions.chart.height"
      :type="completionOptions.chart.type"
      :series="completionOptions.series"
      :options="completionOptions"
    />
  </div>
</template>
