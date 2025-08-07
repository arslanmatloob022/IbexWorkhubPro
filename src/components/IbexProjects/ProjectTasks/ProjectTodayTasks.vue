<script setup lang="ts">
import { useNotyf } from "/@src/composable/useNotyf";
import { useApi } from "/@src/composable/useAPI";
import { useUserSession } from "/@src/stores/userSession";

const userSession = useUserSession();
const api = useApi();
const notyf = useNotyf();
const props = withDefaults(
  defineProps<{
    projectId?: string;
    straight?: boolean;
    workerId?: string;
  }>(),
  {
    projectId: "",
    straight: false,
    workerId: "",
  }
);

const projectTodaysTasks = ref<any>({
  tasks: [
    {
      id: "",
      workers: [
        {
          id: "",
          username: "",
          email: "",
          role: "",
          avatar: "",
        },
      ],
      color: "",
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      status: "",
      is_active: false,
      updated: "",
      created: "",
      costCode: "",
      quantity: "",
      unit: "",
      fileName: null,
      note: null,
      priority: "",
      project: "",
    },
  ],
  stats: {
    active: 1,
    completed: 1,
    pending: 1,
  },
});

const getLoggedWorkerTodayTask = async (refresh: any) => {
  try {
    const resp = await api.get(
      `/api/task/worker-today/${userSession.user.id}/`
    );
    projectTodaysTasks.value = resp.data;
    if (refresh) {
      notyf.green("Tasks list Refreshed");
    }
    console.log("data", projectTodaysTasks.value);
  } catch (err) {
    console.log(err);
  }
};
const getWorkerTodayTask = async (refresh: any) => {
  try {
    const resp = await api.get(`/api/task/worker-today/${props.workerId}/`);
    projectTodaysTasks.value = resp.data;
    if (refresh) {
      notyf.green("Tasks list Refreshed");
    }
    console.log("data", projectTodaysTasks.value);
  } catch (err) {
    console.log(err);
  }
};

const getTodayTask = async (refresh: any) => {
  try {
    const resp = await api.get(
      `/api/task/today-tasks/?project=${props.projectId}`
    );
    projectTodaysTasks.value = resp.data.map((item) => ({
      ...item,
      workers: item.workers.map((worker) => ({
        ...worker,
        picture: worker?.avatar,
        initials: worker?.username?.slice(0, 2).toUpperCase(),
      })),
    }));
    if (refresh) {
      notyf.green("Tasks list Refreshed");
    }
    console.log("data", projectTodaysTasks.value);
  } catch (err) {
    console.log(err);
  }
};

onMounted(() => {
  if (props.workerId) {
    getWorkerTodayTask(false);
  } else if (userSession.user.role == "worker") {
    getLoggedWorkerTodayTask(false);
  } else {
    getTodayTask(false);
  }
});
</script>

<template>
  <div class="list-widget is-straight">
    <div class="widget-head">
      <h3 class="dark-inverted">Today Tasks</h3>
      <i
        @click="getTodayTask(true)"
        style="color: var(--primary)"
        class="fas fa-redo cu-pointer"
        aria-hidden="true"
      ></i>
    </div>

    <div v-if="projectTodaysTasks.length" class="inner-list">
      <div>
        <VBlock
          v-for="topic in projectTodaysTasks"
          :key="topic.id"
          center
          lighter
          class="inner-list-item"
        >
          <template #icon>
            <VIconWrap
              icon="lucide:clock"
              dark-card-bordered
              dark="5"
              color="secondary"
            />
          </template>
          <template #action>
            <VAvatarStack
              v-if="topic.workers.length"
              :avatars="topic.workers"
              size="small"
              :limit="3"
            />
          </template>

          <a href="#">{{ topic.title }}</a>
          <span>{{ topic.status }}</span>
        </VBlock>
      </div>
    </div>
    <div v-else class="inner-list">
      <div>
        <VBlock center lighter class="inner-list-item">
          <template #icon>
            <VIconWrap
              icon="lucide:check"
              dark-card-bordered
              dark="5"
              color="secondary"
            />
          </template>
          <template #action>
            <VIconWrap
              color="success"
              has-background
              has-large-icon
              icon="fas fa-check-circle"
            >
            </VIconWrap>
          </template>

          <a href="#">No Tasks Found Of This Day.</a>
          <span>Today</span>
        </VBlock>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "/@src/scss/abstracts/all";

.list-widget {
  @include vuero-l-card;

  padding: 30px;

  &:not(:last-child) {
    margin-bottom: 1.5rem;
  }

  &.is-straight {
    @include vuero-s-card;
  }

  .widget-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 32px;
    margin-bottom: 10px;

    h3 {
      color: var(--dark-text);
      font-size: 1.1rem;
      font-weight: 500;
    }
  }

  .inner-list {
    padding: 10px 0;

    .inner-list-item {
      + .inner-list-item {
        margin-top: 24px;
      }
    }
  }
}

.is-dark {
  .list-widget {
    @include vuero-card--dark;
  }
}
</style>
