<script setup lang="ts">
import ApexChart from "vue3-apexcharts";
import TasksProgressGageChart from "/@src/components/CommonComponents/TasksComponents/TasksProgressGageChart.vue";
import { useApi } from "/@src/composable/useAPI";
import CircularChart from "/@src/components/CommonComponents/TasksComponents/CircularChart.vue";
import { useThemeColors } from "/@src/composable/useThemeColors";
const themeColors = useThemeColors();
const api = useApi();
const loading = ref(false);
const props = defineProps({
  project: {
    type: String,
    required: true,
  },
});

const projectTasksStats = ref({
  stats: {
    active: 0,
    pending: 0,
    completed: 0,
    cancelled: 0,
  },
  tasks_progress: 0,
  pending_tasks: 0,
  total_tasks: 0,
  status_percentage: {
    active: 0,
    pending: 0,
    completed: 0,
    cancelled: 0,
  },
});

const getProjectTasksStats = async () => {
  try {
    loading.value = true;
    const response = await api.get(
      `/api/task/project-wise-tasks-stats/${props.project}/`
    );
    projectTasksStats.value = response.data;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  getProjectTasksStats();
});
</script>

<template>
  <div class="columns is-multiline" v-if="!loading">
    <div class="column is-6">
      <ProgressWidget
        title="Job Progress"
        :value="`${projectTasksStats.total_tasks} Total Tasks`"
        text="This is the total progress on job base on tasks that have been completed."
        straight
      >
        <TasksProgressGageChart
          :percentCount="projectTasksStats.tasks_progress"
        />
      </ProgressWidget>
    </div>

    <!--Grouped Stat Widget-->
    <div class="column is-6">
      <GroupedStatWidget
        title="Tasks Stats"
        :values="[
          projectTasksStats.stats.active,
          projectTasksStats.stats.pending,
          projectTasksStats.stats.cancelled,
        ]"
        :labels="['Active Tasks', 'Pending Tasks', 'Cancelled Tasks']"
      >
        <template #chart1>
          <CircularChart
            v-if="projectTasksStats.status_percentage"
            id="group-radial-1"
            :color="themeColors.info"
            :percentCount="projectTasksStats.status_percentage.active"
          />
        </template>
        <template #chart2>
          <CircularChart
            v-if="projectTasksStats.status_percentage"
            :color="themeColors.warning"
            id="group-radial-2"
            :percentCount="projectTasksStats.status_percentage.pending"
          />
        </template>
        <template #chart3>
          <CircularChart
            v-if="projectTasksStats.status_percentage"
            :color="themeColors.danger"
            id="group-radial-3"
            :percentCount="projectTasksStats.status_percentage.cancelled"
          />
        </template>
      </GroupedStatWidget>
    </div>
  </div>
</template>
