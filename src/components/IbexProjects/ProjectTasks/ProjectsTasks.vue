<script setup lang="ts">
import { emit } from "process";
import type { VAvatarProps } from "/@src/components/base/avatar/VAvatar.vue";
import * as listData from "/@src/data/layouts/flex-list-v2";
import { convertToFormData } from "/@src/composable/useSupportElement";
import { useNotyf } from "/@src/composable/useNotyf";
import { useApi } from "/@src/composable/useAPI";
export interface ProjectData {
  id: number;
  name: string;
  customer: string;
  duration: string;
  picture: string;
  industry: string;
  status: string;
  team: VAvatarProps[];
}

const api = useApi();
const projects = listData.projects as ProjectData[];
const notyf = useNotyf();
const currentPage = ref(1);
const props = withDefaults(
  defineProps<{
    activeTab?: "active" | "closed";
    projectID?: "";
  }>(),
  {
    activeTab: "active",
  }
);

const emits = defineEmits<{
  (e: "update-getAllTasks", value: void): null;
}>();

const editmodalTitle = ref("Edit Project");
const modalTitle = ref("Add Task");
const filters = ref("");
const tab = ref(props.activeTab);
const showDropdown = ref(false);
const currentTask = ref(0);
const isOpen = ref(false);
const isProjectFormOpen = ref(false);
const loading = ref(false);
const assignToMore = ref(false);
const isTaskFormOpen = ref(false);
const deleteTaskId = ref(0);
const activeTasks = ref(0);
const projectid = ref(0);
const taskData = ref({});
const selectedManagers = ref([]);
const preview = ref("");
const editProjectId = ref("");
const editTaskId = ref("");
const currentProjectId = ref("");

const Taskstatus = ref([
  { value: "active", name: "Active" },
  { value: "pending", name: "Pre Construction" },
  { value: "completed", name: "Completed" },
  { value: "cancelled", name: "cancelled" },
]);

const alertData = ref({
  icon: "fa fa-bell",
  alertTitle: "Delete Task ?",
  alertDescription:
    "After deleting this task you will not be able to recover it",
});
const delteAlertData = ref({
  icon: "fa fa-warning",
  alertTitle: "Delete Project Permanently?",
  alertDescription:
    "After deleting this Project you will not be able to recover it",
});

const workersData = ref([{ id: 0, username: "", email: "", phoneNumber: "" }]);
const projectTasks = ref([
  {
    id: 0,
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    project: 0,
    status: "",
    worker: [{ id: 0, username: "", email: "", role: "", avatar: "" }],
    quantity: "",
    unit: "",
    costCode: "",
  },
]);

const columns = {
  title: {
    label: "Title",
    // grow: true,
    // media: true,
  },
  quantity: "Quantity/Unit",
  start: "Start Date",
  end: "End Date",
  status: "Status",
  team: {
    label: "Worker(s)",
    cellClass: "h-hidden-tablet-p",
  },
  actions: {
    label: "Actions",
    align: "end",
  },
} as const;

const toggleDropdown = (taskId: any) => {
  if (currentTask.value === taskId) {
    currentTask.value = 0;
  } else {
    currentTask.value = taskId;
  }
};

const openDeleteAlert = (id: any) => {
  //   $refs.deleteSweetAlert.openModal();
  projectIdDeleteTobe.value = id;
};

const getActiveTasks = () => {
  activeTasks.value = projectTasks.value.filter(
    (tasks) => tasks.status == "active"
  );
  activeTasks.value = activeTasks.value.length;
};

const closeTheModals = () => {
  taskData.value = {
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    workers: [],
    status: "",
  };
};

const openAlert = (id: any) => {
  //   $refs.sweetAlert.openModal();
  deleteTaskId.value = id;
};

const addTaskHandler = async () => {
  try {
    loading.value = true;
    let formData = convertToFormData(taskData, []);
    const resp = await api.post("/api/task/", formData);
    closeTheModals();
    // $refs.customModal.closeModal();
    getProjectTasks();
    // triggerParentFunction();
    notyf.success("Task added succesfuly");
    console.log("task data", resp);
  } catch (err) {
    notyf.error("Something went wrong");
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const getProjectTasks = async () => {
  try {
    loading.value = true;
    const resp = await api.get(`api/task/${projectid.value}/project/`);
    projectTasks.value = resp.data;
    projectTasks.value.map((task) => ({
      ...task,
      isOpen: false,
    }));
    console.log(resp.data);
    getActiveTasks();
    //triggerParentFunction();
    loading.value = false;
  } catch (err) {
    console.log(err);
  }
};

const openTaskForm = (taskId: any = null) => {
  isTaskFormOpen.value = true;
  editTaskId.value = taskId;
  currentProjectId.value = props.projectID;
};
const closeTaskForm = () => {
  getProjectTasks();
  isTaskFormOpen.value = false;
  currentTask.value = 0;
  editTaskId.value = 0; // Reset the editTaskId after closing
};

const closeDropdown = () => {
  currentTask.value = 0;
};

const updateTaskStatus = async (taskId: any, taskStatus: any) => {
  try {
    loading.value = true;
    const resp = api.patch(`/api/task/${taskId}/`, {
      status: taskStatus,
      schedule_mode: localStorage.getItem("isScheduleMode"),
    });
    getProjectTasks();
    triggerParentFunction();
    console.log(resp);
    notyf.success(`Task set to ${taskStatus} succesfuly`);
    currentTask.value = 0;
    loading.value = false;
  } catch (err) {
    console.log(err);
  }
};

const deleteTask = async () => {
  try {
    loading.value = true;
    const response = await api.delete(`/api/task/${deleteTaskId.value}/`);
    console.log(response);
    // $refs.sweetAlert.closeModal();
    notyf.success(`Task deleted successfully`);
    getProjectTasks();
    loading.value = false;
    currentTask.value = 0;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const getWorkershandler = async () => {
  try {
    loading.value = true;
    const response = await api.get("/api/users/by-role/worker/", {});
    workersData.value = response.data;
    console.log("data", workersData);
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const filteredData = computed(() => {
  if (!filters.value) {
    return projectTasks.value;
  } else {
    const filterRe = new RegExp(filters.value, "i");

    return projectTasks.value.filter((item) => {
      return (
        item.title.match(filterRe) ||
        item.description.match(filterRe) ||
        item.status.match(filterRe)
      );
    });
  }
});

onMounted(() => {
  projectid.value = props.projectID;
  getProjectTasks();
});
</script>

<template>
  <div>
    <div class="list-flex-toolbar is-reversed">
      <VControl icon="feather:search">
        <input
          v-model="filters"
          class="input custom-text-filter"
          placeholder="Search..."
        />
      </VControl>

      <div class="tabs-inner">
        <div class="tabs">
          <ul>
            <li :class="[tab === 'active' && 'is-active']">
              <a
                tabindex="0"
                role="button"
                @keydown.space.prevent="tab = 'active'"
                @click="tab = 'active'"
                ><span>Active</span></a
              >
            </li>
            <li :class="[tab === 'closed' && 'is-active']">
              <a
                tabindex="0"
                role="button"
                @keydown.space.prevent="tab = 'closed'"
                @click="tab = 'closed'"
                ><span>Closed</span></a
              >
            </li>
            <li class="tab-naver" />
          </ul>
        </div>
      </div>
    </div>

    <div class="flex-list-wrapper flex-list-v2">
      <!--List Empty Search Placeholder -->
      <VPlaceholderPage
        v-if="tab === 'active' && filteredData.length === 0"
        title="We couldn't find any matching results."
        subtitle="Too bad. Looks like we couldn't find any matching results for the
          search terms you've entered. Please try different search terms or
          criteria."
        larger
      >
        <template #image>
          <img
            class="light-image"
            src="/@src/assets/illustrations/placeholders/search-4.svg"
            alt=""
          />
          <img
            class="dark-image"
            src="/@src/assets/illustrations/placeholders/search-4-dark.svg"
            alt=""
          />
        </template>
      </VPlaceholderPage>

      <!--Active Tab-->
      <div v-if="tab === 'active'" class="tab-content is-active">
        <VFlexTable
          v-if="filteredData.length"
          :data="filteredData"
          :columns="columns"
          rounded
        >
          <template #body>
            <TransitionGroup name="list" tag="div" class="flex-list-inner">
              <!--Table item-->
              <div
                v-for="item in filteredData"
                :key="item.id"
                class="flex-table-item"
              >
                <VFlexTableCell>
                  <!-- <VAvatar :picture="item.picture" /> -->
                  <div
                    style="min-width: 120px; max-width: 180px; text-wrap: wrap"
                  >
                    <span class="item-name dark-inverted">{{
                      item.title ? item.title : ""
                    }}</span>
                    <span class="item-meta">
                      <span> {{ item.description }}</span>
                    </span>
                  </div>
                </VFlexTableCell>
                <VFlexTableCell>
                  <span class="light-text"
                    >{{ item.quantity ? item.quantity : "N/A" }} /
                    {{ item.unit ? item.unit : "N/A" }}</span
                  >
                </VFlexTableCell>
                <VFlexTableCell>
                  <span class="light-text">{{
                    item.startDate ? item.startDate : "N/A"
                  }}</span>
                </VFlexTableCell>
                <VFlexTableCell>
                  <span class="light-text">{{
                    item.endDate ? item.endDate : "N/A"
                  }}</span>
                </VFlexTableCell>
                <VFlexTableCell>
                  <VTag rounded>
                    {{ item.status }}
                  </VTag>
                </VFlexTableCell>
                <VFlexTableCell class="h-hidden-tablet-p">
                  <VAvatarStack
                    :avatars="item.workers"
                    size="small"
                    :limit="3"
                    class="is-pushed-mobile"
                  />
                </VFlexTableCell>
                <VFlexTableCell :column="{ align: 'end' }">
                  <ProjectListDropdown />
                </VFlexTableCell>
              </div>
            </TransitionGroup>
          </template>
        </VFlexTable>

        <!--Table Pagination-->
        <VFlexPagination
          v-if="filteredData.length > 5"
          :item-per-page="10"
          :total-items="filteredData.length"
          :current-page="currentPage"
          :max-links-displayed="5"
        />
      </div>

      <!--inactive Tab-->
      <div v-else-if="tab === 'closed'" class="tab-content is-active">
        <!--Empty placeholder-->
        <VPlaceholderPage
          title="No closed projects."
          subtitle="Looks like you don't have any closed project yet. When you'll
              start closing off projects, they will be showing up in here."
        >
          <template #image>
            <img
              class="light-image is-larger"
              src="/@src/assets/illustrations/placeholders/projects.svg"
              alt=""
            />
            <img
              class="dark-image is-larger"
              src="/@src/assets/illustrations/placeholders/projects-dark.svg"
              alt=""
            />
          </template>
        </VPlaceholderPage>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.has-top-nav {
  .flex-list-wrapper,
  .list-flex-toolbar {
    max-width: 880px;
    margin-inline-end: auto;
    margin-inline-start: auto;
  }
}
</style>
