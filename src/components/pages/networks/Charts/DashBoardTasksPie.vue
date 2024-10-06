<script lang="ts" setup>
import { useThemeColors } from "/@src/composable/useThemeColors";
import ApexChart from "vue3-apexcharts";
import { useApi } from "/@src/composable/useAPI";

const api = useApi();
const loading = ref(false);
const themeColors = useThemeColors();

const completionOptions = shallowRef({
  height: 695,
  type: "pie",
  series: [],
  colors: [
    themeColors.accent,
    themeColors.info,
    themeColors.primary,
    themeColors.purple,
    themeColors.orange,
  ],
  labels: [],
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 315,
          toolbar: {
            show: true,
          },
        },
        legend: {
          position: "top",
        },
      },
    },
  ],
  legend: {
    position: "right",
    horizontalAlign: "center",
  },
});

const getTasksStats = async () => {
  try {
    loading.value = true;
    const resp = await api.get("/api/task/dashboard-analaytics/");
    const stats = resp.data.series;

    completionOptions.value.labels = stats.map((item) => item.name);
    console.log("chart", completionOptions.value.labels);
    completionOptions.value.series = stats.map((item) =>
      item.data.reduce((acc, value) => acc + value, 0)
    );
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
      :height="completionOptions.height"
      :type="completionOptions.type"
      :series="completionOptions.series"
      :options="completionOptions"
    />
  </div>
</template>
