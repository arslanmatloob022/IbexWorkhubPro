<script setup lang="ts">
import { useNotyf } from "/@src/composable/useNotyf";
import { useApi } from "/@src/composable/useAPI";
import { convertToFormData } from "/@src/composable/useSupportElement";
const api = useApi();
const notyf = useNotyf();
const route = useRoute();
const router = useRouter();
const props = withDefaults(
  defineProps<{
    projectId?: string;
    straight?: boolean;
    workerId: string;
  }>(),
  {
    projectId: "",
  }
);

const projectTodaysTasks = ref<any>({
  tasks: [
    {
      id: "1a82e8dc-496e-45be-a5f6-1b202abdadc8",
      workers: [
        {
          id: "fe8b01ec-1f56-4ecd-886e-31defc4a96a1",
          username: "Others",
          email: "others@gmail.com",
          role: "worker",
          avatar:
            "https://res.cloudinary.com/dcqeugna3/image/upload/v1/media/static/users_avatars/logo1_pfu1ge",
        },
      ],
      color: "#2c3e50",
      title: "Fifth title",
      description: "Description",
      startDate: "2024-10-02",
      endDate: "2024-10-16",
      status: "active",
      is_active: false,
      updated: "2024-10-05T05:29:28.348706Z",
      created: "2024-10-05T05:29:28.348727Z",
      costCode: "Code",
      quantity: "Quanityt",
      unit: "Unit",
      fileName: null,
      note: null,
      priority: "Medium",
      project: "e7f43430-677e-4b23-b420-fca1fe4310f2",
    },
  ],
  stats: {
    active: 1,
    completed: 1,
    pending: 1,
  },
});
// 032f54b2-9229-4d05-9a2a-eed9eabb9b75/

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
  } else {
    getTodayTask(false);
  }
});
</script>

<template>
  <div class="list-widget is-straight">
    <div class="widget-head">
      <h3 class="dark-inverted">Tasks of Today</h3>
      <i
        @click="getTodayTask(true)"
        style="color: var(--primary)"
        class="fas fa-redo cu-pointer"
        aria-hidden="true"
      ></i>
    </div>

    <div class="inner-list">
      <div>
        <VBlock
          v-for="topic in projectTodaysTasks.tasks"
          :key="topic.id"
          center
          lighter
          class="inner-list-item"
        >
          <template #icon>
            <VIconWrap
              icon="lucide:star"
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
