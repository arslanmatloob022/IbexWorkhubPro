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
const SweetAlertProps = ref({
  title: "",
  subtitle: "test",
  isSweetAlertOpen: false,
  btntext: "text",
});

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

const addTaskHandler = async () => {
  try {
    loading.value = true;
    let formData = convertToFormData(taskData, []);
    const resp = await api.post("/api/task/", formData);
    closeTheModals();
    getProjectTasks();
    notyf.success("Task added successfully");
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
    const resp = await api.get(`api/task/${props.projectID}/project/`);
    projectTasks.value = resp.data;
    projectTasks.value.map((task) => ({
      ...task,
      isOpen: false,
    }));
    console.log(resp.data);
    loading.value = false;
  } catch (err) {
    console.log(err);
  }
};

const totalActiveTasks = computed(() => {
  let totalActiveTasks = projectTasks.value.filter(
    (task) => task.status == "active"
  );
  return totalActiveTasks.length;
});

const totalPendingTasks = computed(() => {
  let totalPendingTasks = projectTasks.value.filter(
    (task) => task.status == "pending"
  );
  return totalPendingTasks.length;
});

const totalCompletedTasks = computed(() => {
  let totalCompletedTasks = projectTasks.value.filter(
    (task) => task.status == "completed"
  );
  return totalCompletedTasks.length;
});

const openTaskForm = (taskId: any = "") => {
  isTaskFormOpen.value = true;
  editTaskId.value = taskId;
};
const closeTaskForm = () => {
  getProjectTasks();
  isTaskFormOpen.value = false;
  currentTask.value = 0;
  editTaskId.value = ""; // Reset the editTaskId after closing
};

const updateTaskStatus = async (taskId: any, taskStatus: any) => {
  try {
    loading.value = true;
    const resp = await api.patch(`/api/task/${taskId}/`, {
      status: taskStatus,
      schedule_mode: localStorage.getItem("isScheduleMode"),
    });
    notyf.success(`Task set to ${taskStatus} successfully`);
    currentTask.value = 0;
    getProjectTasks();
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
    getProjectTasks();
    SweetAlertProps.value.isSweetAlertOpen = false;
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
    return projectTasks.value.filter((tasks) => tasks.status == "completed");
  } else {
    const filterRe = new RegExp(filters.value, "i");

    return projectTasks.value.filter((item) => {
      return (
        item.status == "completed" &&
        (item.title.match(filterRe) ||
          item.description.match(filterRe) ||
          item.status.match(filterRe))
      );
    });
  }
});

onMounted(() => {
  getProjectTasks();
});
</script>

<template>
  <div>
    <div class="list-flex-toolbar is-reversed">
      <VButtons>
        <VControl class="mr-2" icon="feather:search">
          <input
            v-model="filters"
            class="input custom-text-filter"
            placeholder="Search..."
          />
        </VControl>
        <VButton
          @click="openTaskForm"
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
            <li :class="[tab === 'active' && 'is-active']">
              <a
                tabindex="0"
                role="button"
                @keydown.space.prevent="tab = 'active'"
                @click="tab = 'active'"
                ><span>All</span></a
              >
            </li>
            <li :class="[tab === 'closed' && 'is-active']">
              <a
                tabindex="0"
                role="button"
                @keydown.space.prevent="tab = 'closed'"
                @click="tab = 'closed'"
                ><span>Completed</span></a
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
        <div class="all-projects">
          <!-- <ProjectsToolbar /> -->

          <div class="all-projects-header">
            <div class="header-item">
              <div class="item-inner">
                <i aria-hidden="true" class="lnil lnil-analytics-alt-1" />
                <span>{{ projectTasks.length }}</span>
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

      <!--inactive Tab-->
      <div v-else-if="tab === 'closed'" class="tab-content is-active">
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
    :closeModal="closeTaskForm"
    :taskId="editTaskId"
    @update:modalHandler="isTaskFormOpen = false"
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
