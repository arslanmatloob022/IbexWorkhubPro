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
  }>(),
  {
    projectId: "",
  }
);

const projectTodaysTasks = ref<any>([]);

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
  getTodayTask(false);
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
          v-for="topic in projectTodaysTasks"
          :key="topic.id"
          center
          lighter
          class="inner-list-item"
        >
          <template #icon>
            <VAnimatedCheckbox
              v-model="topic.is_active"
              :value="topic.is_active"
              color="info"
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
