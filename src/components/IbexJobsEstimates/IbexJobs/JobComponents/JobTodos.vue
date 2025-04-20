<script setup lang="ts">
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { useUserSession } from "/@src/stores/userSession";
import moment from "moment";
const props = withDefaults(
  defineProps<{
    title?: string;
    project?: string;
    task?: string;
    todoId?: string;
    user?: string;
    getUserTodo?: boolean;
    labels?: () => string[];
  }>(),
  {
    title: "Todo",
    labels: () => ["Today", "All"],
    getUserTodo: false,
    todoId: "",
    project: "",
    task: "",
    user: "",
  }
);

const tab = ref<"today" | "all">("today");
const loading = ref(false);
const state = ref("Today");
const api = useApi();
const notyf = useNotyf();
const userSession = useUserSession();
const openTodoModal = ref(false);
const selectedTodo = ref("");
const modelValue = ref(false);
// assigned_to
// project
// task

const todosList = ref([
  {
    id: "6db1b605-38b6-4917-8722-5edc50a4e0ad",
    created_by_info: {
      id: "0feda007-d8a0-4b96-acb7-d7763614854e",
      username: "Test &",
      last_name: "Dev",
      email: "test@dev.com",
      role: "admin",
      avatar:
        "https://ibex-documents.s3.us-east-2.amazonaws.com/public/static/users_avatars/Screenshot_from_2025-01-17_15-14-32.png",
    },
    assigned_to_info: [
      {
        id: "085f43b6-e869-495e-a712-781324ecc497",
        username: "arslan",
        last_name: null,
        email: "arslan@ibex.com",
        role: "admin",
        avatar: null,
      },
      {
        id: "fd0a4649-984a-4bcc-98c0-9b766c141fbe",
        username: "Test Sub con",
        last_name: null,
        email: "raoarslan263@gmail.com",
        role: "worker",
        avatar:
          "https://ibex-documents.s3.us-east-2.amazonaws.com/public/static/users_avatars/not-available.png",
      },
    ],
    project_info: {
      id: "751b95b2-9961-45a0-948c-96f85cea6a52",
      title: "Test Lead",
      startDate: "2025-02-14",
      endDate: "2025-02-07",
      status: "pending",
      address: "Lahore, Punjab 54000, Pakistan",
      wifiAvaliabe: false,
      parkingAvaliable: false,
      description: "",
    },
    task_info: null,
    title: "Test Todo On Job",
    description:
      "ons and they are widely used accross a large variety of websites. Please refer to the code example for more details about usage.",
    color: "#fb923c",
    file: null,
    is_completed: false,
    created_at: "2025-03-09T12:56:30.661475Z",
    date: "2025-02-28",
    time: "19:56:00",
    time_to_complete: null,
    cerated_by: "0feda007-d8a0-4b96-acb7-d7763614854e",
    project: "751b95b2-9961-45a0-948c-96f85cea6a52",
    task: null,
    assigned_to: [
      "085f43b6-e869-495e-a712-781324ecc497",
      "fd0a4649-984a-4bcc-98c0-9b766c141fbe",
    ],
  },
]);

const getProjectTodos = async () => {
  try {
    loading.value = true;
    const response = await api.get(`/api/todo/?project=${props.project}`);
    todosList.value = response.data;
  } catch (error) {
    console.log("getting todos", error);
  } finally {
    loading.value = false;
  }
};
const getUserTodos = async (id: any) => {
  try {
    loading.value = true;
    const response = await api.get(`/api/todo/?assigned_to=${id}`);
    todosList.value = response.data;
  } catch (error) {
    console.log("getting todos", error);
  } finally {
    loading.value = false;
  }
};
const getTaskTodos = async () => {
  try {
    loading.value = true;
    const response = await api.get(`/api/todo/?task=${props.task}`);
    todosList.value = response.data;
  } catch (error) {
    console.log("getting todos", error);
  } finally {
    loading.value = false;
  }
};

const isLoading = ref(false);
const updateStatus = async (todo: any) => {
  try {
    isLoading.value = true;
    selectedTodo.value = todo.id;
    const response = await api.patch(`/api/todo/${todo.id}/`, {
      is_completed: !todo.is_completed,
    });
    getTodoHandler();
    notyf.success("Todo Updated");
  } catch (error) {
    console.log("getting todos", error);
  } finally {
    isLoading.value = false;
    selectedTodo.value = "";
  }
};

const getAllTodos = async () => {
  try {
    loading.value = true;
    const response = await api.get(`/api/todo/`);
    todosList.value = response.data;
  } catch (error) {
    console.log("getting todos", error);
  } finally {
    loading.value = false;
  }
};

const todayTodos = computed(() => {
  const today = moment().format("YYYY-MM-DD");
  return todosList.value.filter((item) => item.date === today);
});
// "date": "2025-02-28",

const getTodoHandler = () => {
  if (props.getUserTodo == true) {
    getUserTodos(userSession.user.id);
  } else if (props.project) {
    getProjectTodos();
  } else if (props.task) {
    getTaskTodos();
  } else if (props.user) {
    getUserTodos(props.user);
  } else {
    getAllTodos();
  }
};

onMounted(() => {
  getTodoHandler();
});
</script>

<template>
  <div class="list-widget tabbed-widget is-straight">
    <div class="widget-head">
      <div class="tabbed-controls">
        <a
          class="tabbed-control"
          role="button"
          :class="[tab == 'today' && 'is-active']"
          tabindex="0"
          @keydown.space.prevent="tab = 'today'"
          @click="tab = 'today'"
        >
          <span>Today</span>
        </a>
        <a
          class="tabbed-control"
          role="button"
          :class="[tab == 'all' && 'is-active']"
          tabindex="0"
          @keydown.space.prevent="tab = 'all'"
          @click="tab = 'all'"
        >
          <span>All</span>
        </a>
        <div class="tabbed-naver" />
      </div>
      <VButton
        size="small"
        @click="openTodoModal = !openTodoModal"
        icon="fas fa-plus"
        light
        outlined
        color="warning"
      >
        Todo</VButton
      >
    </div>

    <!-- <VPlaceholderPage
      :class="[todosList.length !== 0 && 'is-hidden']"
      title="We couldn't find any matching results."
      subtitle="Too bad. Looks like we couldn't find any matching results for the
          search terms you've entered. Please try different search terms or
          criteria."
      larger
    >
      <template #image>
        <img
          class="light-image"
          src="/@src/assets/illustrations/placeholders/having-coffee.svg"
          alt=""
        />
        <img
          class="dark-image"
          src="/@src/assets/illustrations/placeholders/having-coffee-dark.svg"
          alt=""
        />
      </template>
    </VPlaceholderPage> -->

    <div class="inner-list-wrapper is-active" v-if="tab == 'today'">
      <div class="inner-list">
        <div>
          <VBlock
            v-for="todo in todayTodos"
            center
            lighter
            class="inner-list-item"
          >
            <template #icon>
              <VIconButton
                :color="todo.is_completed ? 'primary' : 'warning'"
                outlined
                :loading="selectedTodo == todo.id && isLoading"
                @click="
                  () => {
                    updateStatus(todo);
                  }
                "
                circle
                :icon="
                  todo.is_completed
                    ? 'lnir lnir-checkmark'
                    : 'lnir lnir-checkmark'
                "
              />
            </template>
            <template #action>
              <VTag :color="todo.is_completed ? 'primary' : 'warning'" rounded>
                {{ todo.is_completed ? "Done" : "Pending" }}
              </VTag>
            </template>

            <a href="">{{ todo.title ? todo.title : "No Title" }}</a>
            <span>{{ todo.time ? todo.time : "No Time" }}</span>
          </VBlock>
          <VPlaceholderPage
            :class="[todayTodos.length !== 0 && 'is-hidden']"
            title="There is nothing to do in your list."
            subtitle="There is not a single to-do for you. It's good if you have done with your list, have a cup of tea!"
            small
          >
            <template #image>
              <img
                class="light-image"
                src="/@src/assets/illustrations/placeholders/having-coffee.svg"
                alt=""
              />
              <img
                class="dark-image"
                src="/@src/assets/illustrations/placeholders/having-coffee-dark.svg"
                alt=""
              />
            </template>
          </VPlaceholderPage>
        </div>
      </div>
    </div>

    <div class="inner-list-wrapper is-active" v-if="tab == 'all'">
      <div class="inner-list">
        <div>
          <VBlock
            v-for="todo in todosList"
            center
            lighter
            class="inner-list-item"
          >
            <template #icon>
              <VIconButton
                :color="todo.is_completed ? 'primary' : 'warning'"
                outlined
                :loading="selectedTodo == todo.id && isLoading"
                @click="
                  () => {
                    updateStatus(todo);
                  }
                "
                circle
                :icon="
                  todo.is_completed
                    ? 'lnir lnir-checkmark'
                    : 'lnir lnir-checkmark'
                "
              />
            </template>
            <template #action>
              <VTag :color="todo.is_completed ? 'primary' : 'warning'" rounded>
                {{ todo.is_completed ? "Done" : "Pending" }}
              </VTag>
            </template>

            <a href="">{{ todo.title ? todo.title : "No Title" }}</a>
            <span>{{ todo.time ? todo.time : "No Time" }}</span>
          </VBlock>
          <VPlaceholderPage
            :class="[todosList.length !== 0 && 'is-hidden']"
            title="There is nothing to do in your list."
            subtitle="There is not a single to-do for you. It's good if you have done with your list, have a cup of tea!"
            small
          >
            <template #image>
              <img
                class="light-image"
                src="/@src/assets/illustrations/placeholders/having-coffee.svg"
                alt=""
              />
              <img
                class="dark-image"
                src="/@src/assets/illustrations/placeholders/having-coffee-dark.svg"
                alt=""
              />
            </template>
          </VPlaceholderPage>
        </div>
      </div>
    </div>
    <AddUpdateTodoModal
      v-if="openTodoModal"
      :openTodoModal="openTodoModal"
      :project="props.project ? props.project : ''"
      :task="props.task ? props.task : ''"
      :todoId="selectedTodo"
      :user="props.user"
      @update:modalHandler="openTodoModal = false"
      @update:OnSuccess="getTodoHandler"
    />
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

  &.tabbed-widget {
    .widget-head {
      .tabbed-controls {
        position: relative;
        display: flex;
        min-width: 140px;
        height: 32px;
        background: var(--widget-grey-dark-2);
        font-family: var(--font);
        border-radius: 8px;

        .tabbed-control {
          position: relative;
          width: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 0.9rem;
          color: var(--light-text);
          z-index: 1;

          &.is-active {
            color: var(--smoke-white);

            &:first-child {
              ~ .tabbed-naver {
                margin-inline-start: 0;
              }
            }

            &:nth-child(2) {
              ~ .tabbed-naver {
                margin-inline-start: 50%;
              }
            }
          }
        }

        .tabbed-naver {
          position: absolute;
          top: 0;
          inset-inline-start: 0;
          width: 50%;
          height: 100%;
          border-radius: 8px;
          background: var(--primary);
          margin-inline-start: 0;
          transition: all 0.3s; // transition-all test
          z-index: 0;
        }
      }
    }

    .inner-list-wrapper {
      display: none;
      animation: fadeInLeft 0.5s;

      &.is-active {
        display: block;
      }
    }
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

    &.tabbed-widget {
      .widget-head {
        .tabbed-controls {
          background: var(--dark-sidebar-light-3);

          .tabbed-naver {
            background: var(--primary);
          }
        }
      }
    }
  }
}
</style>
