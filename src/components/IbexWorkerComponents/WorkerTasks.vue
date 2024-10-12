<script setup lang="ts">
import type { VAvatarProps } from "/@src/components/base/avatar/VAvatar.vue";
import { convertToFormData } from "/@src/composable/useSupportElement";
import { useNotyf } from "/@src/composable/useNotyf";
import { useApi } from "/@src/composable/useAPI";
import { useUserSession } from "/@src/stores/userSession";

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
const notyf = useNotyf();
const startDate = ref("");
const userSession = useUserSession();
const props = withDefaults(
  defineProps<{
    projectID?: string;
    workerId?: string;
  }>(),
  {
    projectID: "",
    workerId: "",
  }
);

const emits = defineEmits<{
  (e: "update:getAllTasks", value: null): void;
  (e: "update:completedTasks", value: number): void;
  (e: "update:activeTasks", value: number): void;
}>();

const filters = ref("");
const tab = ref("all");
const currentTask = ref(0);
const loading = ref(false);
const isTaskFormOpen = ref(false);
const deleteTaskId = ref(0);
const taskData = ref({});
const taskToBeEdit = ref("");

const Taskstatus = ref([
  { value: "active", name: "Active" },
  { value: "pending", name: "Pre Construction" },
  { value: "completed", name: "Completed" },
  { value: "cancelled", name: "cancelled" },
]);

const workersData = ref([{ id: 0, username: "", email: "", phoneNumber: "" }]);
const workerTasks = ref([
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

const SweetAlertProps = ref({
  title: "",
  subtitle: "test",
  isSweetAlertOpen: false,
  btntext: "text",
});

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
  deleteTaskId.value = id;
  SweetAlertProps.value = {
    title: "Delete Task?",
    subtitle: "Do you really want to delete this task permanently?",
    btntext: "Yes, Delete",
    isSweetAlertOpen: true,
  };
};

const getWorkerTasks = async () => {
  try {
    loading.value = true;
    const resp = await api.get(
      `/api/task/${
        props.workerId ? props.workerId : userSession.user.id
      }/worker-tasks/`
    );
    workerTasks.value = resp.data;
    console.log(resp.data);
    loading.value = false;
  } catch (err) {
    console.log(err);
  }
};

const totalActiveTasks = computed(() => {
  let totalActiveTasks = workerTasks.value.filter(
    (task) => task.status == "active"
  );
  emits("update:completedTasks", totalActiveTasks.length);
  return totalActiveTasks.length;
});

const totalPendingTasks = computed(() => {
  let totalPendingTasks = workerTasks.value.filter(
    (task) => task.status == "pending"
  );
  emits("update:activeTasks", totalPendingTasks.length);
  return totalPendingTasks.length;
});

const totalCompletedTasks = computed(() => {
  let totalCompletedTasks = workerTasks.value.filter(
    (task) => task.status == "completed"
  );
  return totalCompletedTasks.length;
});

const openTaskForm = (taskId: any) => {
  taskToBeEdit.value = taskId;
  isTaskFormOpen.value = true;
};
const closeTaskForm = () => {
  getWorkerTasks();
  isTaskFormOpen.value = false;
  // currentTask.value = 0;
  taskToBeEdit.value = "";
};

const updateTaskStatus = async (taskId: any, taskStatus: any) => {
  try {
    loading.value = true;
    const resp = await api.patch(`/api/task/${taskId}/`, {
      status: taskStatus,
      schedule_mode: localStorage.getItem("isScheduleMode"),
    });
    getWorkerTasks();
    notyf.success(`Task set to ${taskStatus} successfully`);
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
    notyf.success(`Task deleted successfully`);
    getWorkerTasks();
    SweetAlertProps.value.isSweetAlertOpen = false;
    currentTask.value = 0;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const filteredData = computed(() => {
  if (!filters.value) {
    return workerTasks.value.filter((tasks) => tasks.status != "completed");
  } else {
    const filterRe = new RegExp(filters.value, "i");

    return workerTasks.value.filter((item) => {
      return (
        item.status != "completed" &&
        (item.title.match(filterRe) ||
          item.description.match(filterRe) ||
          item.status.match(filterRe))
      );
    });
  }
});

const filteredCompletedData = computed(() => {
  if (!filters.value) {
    return workerTasks.value.filter((tasks) => tasks.status == "completed");
  } else {
    const filterRe = new RegExp(filters.value, "i");

    return workerTasks.value.filter((item) => {
      return (
        item.status == "completed" &&
        (item.title.match(filterRe) ||
          item.description.match(filterRe) ||
          item.status.match(filterRe))
      );
    });
  }
});

const filteredActiveData = computed(() => {
  if (!filters.value) {
    return workerTasks.value.filter((tasks) => tasks.status == "active");
  } else {
    const filterRe = new RegExp(filters.value, "i");

    return workerTasks.value.filter((item) => {
      return (
        item.status == "active" &&
        (item.title.match(filterRe) ||
          item.description.match(filterRe) ||
          item.status.match(filterRe))
      );
    });
  }
});
const filteredPendingData = computed(() => {
  if (!filters.value) {
    return workerTasks.value.filter((tasks) => tasks.status == "pending");
  } else {
    const filterRe = new RegExp(filters.value, "i");

    return workerTasks.value.filter((item) => {
      return (
        item.status == "pending" &&
        (item.title.match(filterRe) ||
          item.description.match(filterRe) ||
          item.status.match(filterRe))
      );
    });
  }
});

onMounted(() => {
  getWorkerTasks();
});
</script>

<template>
  <div>
    <div class="list-flex-toolbar is-reversed">
      <VButtons>
        <VControl class="mr-2 h-hidden-mobile" icon="feather:search">
          <input
            v-model="filters"
            class="input custom-text-filter"
            placeholder="Search..."
          />
        </VControl>
        <VButton
          @click="openTaskForm()"
          color="primary"
          icon="fas fa-plus"
          elevated
          raised
          >Task</VButton
        >
      </VButtons>
      <div class="tabs-inner">
        <div class="tabs">
          <ul>
            <li :class="[tab === 'all' && 'is-active']">
              <a
                tabindex="0"
                role="button"
                @keydown.space.prevent="tab = 'all'"
                @click="tab = 'all'"
                ><span>All</span></a
              >
            </li>
            <li :class="[tab === 'active' && 'is-active']">
              <a
                tabindex="0"
                role="button"
                @keydown.space.prevent="tab = 'active'"
                @click="tab = 'active'"
                ><span>Active</span></a
              >
            </li>
            <li :class="[tab === 'pending' && 'is-active']">
              <a
                tabindex="0"
                role="button"
                @keydown.space.prevent="tab = 'pending'"
                @click="tab = 'pending'"
                ><span>Pending</span></a
              >
            </li>
            <li :class="[tab === 'completed' && 'is-active']">
              <a
                tabindex="0"
                role="button"
                @keydown.space.prevent="tab = 'completed'"
                @click="tab = 'completed'"
                ><span>Completed</span></a
              >
            </li>
            <li class="tab-naver" />
          </ul>
        </div>
      </div>
    </div>

    <div class="flex-list-wrapper flex-list-v2">
      <!--Active Tab-->
      <div v-if="tab === 'all'" class="tab-content is-active">
        <div class="all-projects">
          <!-- <ProjectsToolbar /> -->

          <div class="all-projects-header">
            <div class="header-item">
              <div class="item-inner">
                <i aria-hidden="true" class="lnil lnil-analytics-alt-1" />
                <span>{{ workerTasks.length }}</span>
                <p>Total Tasks</p>
              </div>
            </div>
            <div class="header-item">
              <div class="item-inner">
                <i aria-hidden="true" class="lnil lnil-target-alt-1" />
                <span>{{ totalCompletedTasks }}</span>
                <p>Completed Tasks</p>
              </div>
            </div>
            <div class="header-item">
              <div class="item-inner">
                <i aria-hidden="true" class="lnil lnil-pie-chart-alt" />
                <span>{{ totalPendingTasks }}</span>
                <p>Pending Tasks</p>
              </div>
            </div>
            <div class="header-item">
              <div class="item-inner">
                <i aria-hidden="true" class="lnil lnil-leaf" />
                <span>{{ totalActiveTasks }}</span>
                <p>Active Tasks</p>
              </div>
            </div>
          </div>

          <div
            v-if="filteredData.length"
            class="columns is-multiline projects-card-grid"
          >
            <!--Project-->
            <div v-for="item in filteredData" class="column is-6">
              <div class="grid-item">
                <div class="top-section">
                  <div class="head">
                    <h3>{{ item.title }}</h3>
                    <!--Dropdown-->
                    <VDropdown icon="feather:more-vertical" spaced right>
                      <template #content>
                        <a
                          @click="updateTaskStatus(item.id, 'active')"
                          role="menuitem"
                          class="dropdown-item is-media"
                        >
                          <div class="icon">
                            <i aria-hidden="true" class="lnil lnil-eye" />
                          </div>
                          <div class="meta">
                            <span>Active</span>
                            <span>Start work on this task</span>
                          </div>
                        </a>

                        <a
                          @click="updateTaskStatus(item.id, 'pending')"
                          role="menuitem"
                          class="dropdown-item is-media"
                        >
                          <div class="icon">
                            <i aria-hidden="true" class="lnil lnil-pencil" />
                          </div>
                          <div class="meta">
                            <span>Pending</span>
                            <span>Waiting to work on</span>
                          </div>
                        </a>

                        <a
                          @click="updateTaskStatus(item.id, 'completed')"
                          role="menuitem"
                          class="dropdown-item is-media"
                        >
                          <div class="icon">
                            <i aria-hidden="true" class="lnil lnil-pencil" />
                          </div>
                          <div class="meta">
                            <span>Completed</span>
                            <span>Mark task as completed</span>
                          </div>
                        </a>

                        <hr class="dropdown-divider" />
                        <a
                          @click="openTaskForm(item.id)"
                          role="menuitem"
                          class="dropdown-item is-media"
                        >
                          <div class="icon">
                            <i aria-hidden="true" class="lnil lnil-pencil" />
                          </div>
                          <div class="meta">
                            <span>Edit</span>
                            <span>Edit Task detail</span>
                          </div>
                        </a>

                        <a
                          @click="openAlert(item.id)"
                          role="menuitem"
                          class="dropdown-item is-media"
                        >
                          <div class="icon">
                            <i aria-hidden="true" class="lnil lnil-archive" />
                          </div>
                          <div class="meta">
                            <span>Delete </span>
                            <span>Delete this task</span>
                          </div>
                        </a>
                      </template>
                    </VDropdown>
                  </div>
                  <div class="body">
                    <p>
                      {{ item.description }}
                    </p>
                  </div>
                </div>
                <div class="bottom-section">
                  <div class="foot-block">
                    <h4 class="heading">Worker(s)</h4>
                    <div class="developers">
                      <VAvatar
                        v-for="worker in item.workers"
                        :picture="worker.avatar"
                        size="small"
                        color="primary"
                        v-tooltip.rounded.info="`${worker.username}`"
                        :initials="
                          worker.avatar ? '' : worker.username.slice(0, 2)
                        "
                      />
                    </div>
                  </div>
                  <div class="foot-block">
                    <h4 class="heading">Start date</h4>
                    <p>{{ item.startDate }}</p>
                  </div>
                  <div class="foot-block">
                    <h4 class="heading">End date</h4>
                    <p>{{ item.endDate }}</p>
                  </div>
                  <div class="foot-block">
                    <h4 class="heading">Status</h4>
                    <p>{{ item.status }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--Empty placeholder-->
          <VPlaceholderPage
            v-else
            title="There is no task added on this projects."
            subtitle="Looks like you don't have any task on this project yet. When you'll
                start creating tasks of this project, they will be showing up in here."
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

      <!--active Tab-->
      <div v-else-if="tab === 'active'" class="tab-content is-active">
        <div class="all-projects">
          <!-- <ProjectsToolbar /> -->

          <div
            v-if="filteredActiveData.length"
            class="columns is-multiline projects-card-grid"
          >
            <!--Project-->
            <div v-for="item in filteredActiveData" class="column is-6">
              <div class="grid-item">
                <div class="top-section">
                  <div class="head">
                    <h3>{{ item.title }}</h3>
                    <!--Dropdown-->
                    <VDropdown icon="feather:more-vertical" spaced right>
                      <template #content>
                        <a
                          @click="updateTaskStatus(item.id, 'active')"
                          role="menuitem"
                          class="dropdown-item is-media"
                        >
                          <div class="icon">
                            <i aria-hidden="true" class="lnil lnil-eye" />
                          </div>
                          <div class="meta">
                            <span>Active</span>
                            <span>Start work on this task</span>
                          </div>
                        </a>

                        <a
                          @click="updateTaskStatus(item.id, 'pending')"
                          role="menuitem"
                          class="dropdown-item is-media"
                        >
                          <div class="icon">
                            <i aria-hidden="true" class="lnil lnil-pencil" />
                          </div>
                          <div class="meta">
                            <span>Pending</span>
                            <span>Waiting to work on</span>
                          </div>
                        </a>

                        <a
                          @click="updateTaskStatus(item.id, 'completed')"
                          role="menuitem"
                          class="dropdown-item is-media"
                        >
                          <div class="icon">
                            <i aria-hidden="true" class="lnil lnil-pencil" />
                          </div>
                          <div class="meta">
                            <span>Completed</span>
                            <span>Mark task as completed</span>
                          </div>
                        </a>

                        <hr class="dropdown-divider" />
                        <a
                          @click="openTaskForm(item.id)"
                          role="menuitem"
                          class="dropdown-item is-media"
                        >
                          <div class="icon">
                            <i aria-hidden="true" class="lnil lnil-pencil" />
                          </div>
                          <div class="meta">
                            <span>Edit</span>
                            <span>Edit Task detail</span>
                          </div>
                        </a>

                        <a
                          @click="openAlert(item.id)"
                          role="menuitem"
                          class="dropdown-item is-media"
                        >
                          <div class="icon">
                            <i aria-hidden="true" class="lnil lnil-archive" />
                          </div>
                          <div class="meta">
                            <span>Delete </span>
                            <span>Delete this task</span>
                          </div>
                        </a>
                      </template>
                    </VDropdown>
                  </div>
                  <div class="body">
                    <p>
                      {{ item.description }}
                    </p>
                  </div>
                </div>
                <div class="bottom-section">
                  <div class="foot-block">
                    <h4 class="heading">Worker(s)</h4>
                    <div class="developers">
                      <VAvatar
                        v-for="worker in item.workers"
                        :picture="worker.avatar"
                        size="small"
                        color="primary"
                        v-tooltip.rounded.info="`${worker.username}`"
                        :initials="
                          worker.avatar ? '' : worker.username.slice(0, 2)
                        "
                      />
                    </div>
                  </div>
                  <div class="foot-block">
                    <h4 class="heading">Start date</h4>
                    <p>{{ item.startDate }}</p>
                  </div>
                  <div class="foot-block">
                    <h4 class="heading">End date</h4>
                    <p>{{ item.endDate }}</p>
                  </div>
                  <div class="foot-block">
                    <h4 class="heading">Status</h4>
                    <p>{{ item.status }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--Empty placeholder-->
          <VPlaceholderPage
            v-else
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
      <!--active Tab-->
      <div v-else-if="tab === 'pending'" class="tab-content is-active">
        <div class="all-projects">
          <!-- <ProjectsToolbar /> -->

          <div
            v-if="filteredPendingData.length"
            class="columns is-multiline projects-card-grid"
          >
            <!--Project-->
            <div v-for="item in filteredPendingData" class="column is-6">
              <div class="grid-item">
                <div class="top-section">
                  <div class="head">
                    <h3>{{ item.title }}</h3>
                    <!--Dropdown-->
                    <VDropdown icon="feather:more-vertical" spaced right>
                      <template #content>
                        <a
                          @click="updateTaskStatus(item.id, 'active')"
                          role="menuitem"
                          class="dropdown-item is-media"
                        >
                          <div class="icon">
                            <i aria-hidden="true" class="lnil lnil-eye" />
                          </div>
                          <div class="meta">
                            <span>Active</span>
                            <span>Start work on this task</span>
                          </div>
                        </a>

                        <a
                          @click="updateTaskStatus(item.id, 'pending')"
                          role="menuitem"
                          class="dropdown-item is-media"
                        >
                          <div class="icon">
                            <i aria-hidden="true" class="lnil lnil-pencil" />
                          </div>
                          <div class="meta">
                            <span>Pending</span>
                            <span>Waiting to work on</span>
                          </div>
                        </a>

                        <a
                          @click="updateTaskStatus(item.id, 'completed')"
                          role="menuitem"
                          class="dropdown-item is-media"
                        >
                          <div class="icon">
                            <i aria-hidden="true" class="lnil lnil-pencil" />
                          </div>
                          <div class="meta">
                            <span>Completed</span>
                            <span>Mark task as completed</span>
                          </div>
                        </a>

                        <hr class="dropdown-divider" />
                        <a
                          @click="openTaskForm(item.id)"
                          role="menuitem"
                          class="dropdown-item is-media"
                        >
                          <div class="icon">
                            <i aria-hidden="true" class="lnil lnil-pencil" />
                          </div>
                          <div class="meta">
                            <span>Edit</span>
                            <span>Edit Task detail</span>
                          </div>
                        </a>

                        <a
                          @click="openAlert(item.id)"
                          role="menuitem"
                          class="dropdown-item is-media"
                        >
                          <div class="icon">
                            <i aria-hidden="true" class="lnil lnil-archive" />
                          </div>
                          <div class="meta">
                            <span>Delete </span>
                            <span>Delete this task</span>
                          </div>
                        </a>
                      </template>
                    </VDropdown>
                  </div>
                  <div class="body">
                    <p>
                      {{ item.description }}
                    </p>
                  </div>
                </div>
                <div class="bottom-section">
                  <div class="foot-block">
                    <h4 class="heading">Worker(s)</h4>
                    <div class="developers">
                      <VAvatar
                        v-for="worker in item.workers"
                        :picture="worker.avatar"
                        size="small"
                        color="primary"
                        v-tooltip.rounded.info="`${worker.username}`"
                        :initials="
                          worker.avatar ? '' : worker.username.slice(0, 2)
                        "
                      />
                    </div>
                  </div>
                  <div class="foot-block">
                    <h4 class="heading">Start date</h4>
                    <p>{{ item.startDate }}</p>
                  </div>
                  <div class="foot-block">
                    <h4 class="heading">End date</h4>
                    <p>{{ item.endDate }}</p>
                  </div>
                  <div class="foot-block">
                    <h4 class="heading">Status</h4>
                    <p>{{ item.status }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--Empty placeholder-->
          <VPlaceholderPage
            v-else
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

      <!--completed Tab-->
      <div v-else-if="tab === 'completed'" class="tab-content is-active">
        <div class="all-projects">
          <!-- <ProjectsToolbar /> -->

          <div
            v-if="filteredCompletedData.length"
            class="columns is-multiline projects-card-grid"
          >
            <!--Project-->
            <div v-for="item in filteredCompletedData" class="column is-6">
              <div class="grid-item">
                <div class="top-section">
                  <div class="head">
                    <h3>{{ item.title }}</h3>
                    <!--Dropdown-->
                    <VDropdown icon="feather:more-vertical" spaced right>
                      <template #content>
                        <a
                          @click="updateTaskStatus(item.id, 'active')"
                          role="menuitem"
                          class="dropdown-item is-media"
                        >
                          <div class="icon">
                            <i aria-hidden="true" class="lnil lnil-eye" />
                          </div>
                          <div class="meta">
                            <span>Active</span>
                            <span>Start work on this task</span>
                          </div>
                        </a>

                        <a
                          @click="updateTaskStatus(item.id, 'pending')"
                          role="menuitem"
                          class="dropdown-item is-media"
                        >
                          <div class="icon">
                            <i aria-hidden="true" class="lnil lnil-pencil" />
                          </div>
                          <div class="meta">
                            <span>Pending</span>
                            <span>Waiting to work on</span>
                          </div>
                        </a>

                        <a
                          @click="updateTaskStatus(item.id, 'completed')"
                          role="menuitem"
                          class="dropdown-item is-media"
                        >
                          <div class="icon">
                            <i aria-hidden="true" class="lnil lnil-pencil" />
                          </div>
                          <div class="meta">
                            <span>Completed</span>
                            <span>Mark task as completed</span>
                          </div>
                        </a>

                        <hr class="dropdown-divider" />
                        <a
                          @click="openTaskForm(item.id)"
                          role="menuitem"
                          class="dropdown-item is-media"
                        >
                          <div class="icon">
                            <i aria-hidden="true" class="lnil lnil-pencil" />
                          </div>
                          <div class="meta">
                            <span>Edit</span>
                            <span>Edit Task detail</span>
                          </div>
                        </a>

                        <a
                          @click="openAlert(item.id)"
                          role="menuitem"
                          class="dropdown-item is-media"
                        >
                          <div class="icon">
                            <i aria-hidden="true" class="lnil lnil-archive" />
                          </div>
                          <div class="meta">
                            <span>Delete </span>
                            <span>Delete this task</span>
                          </div>
                        </a>
                      </template>
                    </VDropdown>
                  </div>
                  <div class="body">
                    <p>
                      {{ item.description }}
                    </p>
                  </div>
                </div>
                <div class="bottom-section">
                  <div class="foot-block">
                    <h4 class="heading">Worker(s)</h4>
                    <div class="developers">
                      <VAvatar
                        v-for="worker in item.workers"
                        :picture="worker.avatar"
                        size="small"
                        color="primary"
                        v-tooltip.rounded.info="`${worker.username}`"
                        :initials="
                          worker.avatar ? '' : worker.username.slice(0, 2)
                        "
                      />
                    </div>
                  </div>
                  <div class="foot-block">
                    <h4 class="heading">Start date</h4>
                    <p>{{ item.startDate }}</p>
                  </div>
                  <div class="foot-block">
                    <h4 class="heading">End date</h4>
                    <p>{{ item.endDate }}</p>
                  </div>
                  <div class="foot-block">
                    <h4 class="heading">Status</h4>
                    <p>{{ item.status }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--Empty placeholder-->
          <VPlaceholderPage
            v-else
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
  </div>

  <SweetAlert
    v-if="SweetAlertProps.isSweetAlertOpen"
    :isSweetAlertOpen="SweetAlertProps.isSweetAlertOpen"
    :title="SweetAlertProps.title"
    :subtitle="SweetAlertProps.subtitle"
    :btntext="SweetAlertProps.btntext"
    :onConfirm="deleteTask"
    :loading="loading"
    :onCancel="() => (SweetAlertProps.isSweetAlertOpen = false)"
  />
  <UpdateTask
    v-if="isTaskFormOpen"
    :projectID="props.projectID"
    :isOpen="isTaskFormOpen"
    :taskIdSelected="taskToBeEdit"
    :startDate="startDate"
    @update:modalHandler="closeTaskForm"
    @update:OnSuccess="getWorkerTasks"
  />
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
<style scoped lang="scss">
.all-projects {
  .all-projects-header {
    display: flex;
    padding: 20px;
    background: var(--white);
    border: 1px solid var(--fade-grey-dark-3);
    border-radius: var(--radius-large);
    margin-bottom: 1.5rem;

    .header-item {
      width: 25%;
      border-inline-end: 1px solid var(--fade-grey-dark-3);

      &:last-child {
        border-inline-end: none;
      }

      .item-inner {
        text-align: center;

        .lnil,
        .lnir {
          font-size: 2.2rem;
          margin-bottom: 6px;
          color: var(--primary);
        }

        span {
          display: block;
          font-family: var(--font);
          font-weight: 600;
          font-size: 1.4rem;
          color: var(--dark-text);
        }

        p {
          font-family: var(--font-alt);
        }
      }
    }
  }

  .projects-card-grid {
    .grid-item {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 220px;
      padding: 20px;
      background: var(--white);
      border: 1px solid var(--fade-grey-dark-3);
      border-radius: var(--radius-large);

      .top-section {
        .head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;

          h3 {
            font-size: 1rem;
            font-family: var(--font-alt);
            color: var(--dark-text);
            font-weight: 600;
          }
        }

        .body {
          p {
            font-family: var(--font);
            color: var(--light-text);
          }
        }
      }

      .bottom-section {
        display: flex;

        .foot-block {
          margin-inline-end: 30px;

          .heading {
            font-family: var(--font-alt);
            font-size: 0.75rem;
            color: var(--light-text-dark-22);
          }

          > p {
            padding-top: 5px;
          }

          .developers {
            display: flex;

            .v-avatar {
              margin-inline-end: 6px;
            }
          }
        }
      }
    }
  }
}

.is-dark {
  .all-projects {
    .all-projects-header {
      background: var(--dark-sidebar-light-6);
      border-color: var(--dark-sidebar-light-12);

      .header-item {
        border-color: var(--dark-sidebar-light-18);

        span {
          color: var(--dark-dark-text);
        }

        i {
          color: var(--primary) !important;
        }
      }
    }

    .projects-card-grid {
      .grid-item {
        background: var(--dark-sidebar-light-6);
        border-color: var(--dark-sidebar-light-12);

        .top-section {
          .head {
            h3 {
              color: var(--dark-dark-text);
            }
          }
        }

        .bottom-section {
          .foot-block {
            .heading {
              color: var(--light-text-dark-12);
            }
          }
        }
      }
    }
  }
}
</style>
