<script setup lang="ts">
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { useUserSession } from "/@src/stores/userSession";
import { onceImageErrored } from "/@src/utils/via-placeholder";
import moment from "moment";
const props = withDefaults(
  defineProps<{
    title?: string;
    object?: string;
    task?: string;
    activityId?: string;
    user?: string;
    getUserActivities?: boolean;
    labels?: () => string[];
  }>(),
  {
    title: "Todo",
    labels: () => ["Today", "All"],
    getUserActivities: false,
  }
);

const tab = ref<"today" | "all">("today");
const loading = ref(false);
const state = ref("Today");
const api = useApi();
const notyf = useNotyf();
const userSession = useUserSession();
const activitiesList = ref([
  {
    id: "d6b97056-0001-4c90-9c7b-aa019c94e152",
    attendees_info: [
      {
        id: "a1af480c-4b20-4669-bcc6-db4402074fc7",
        username: "Test",
        last_name: "contractor",
        email: "testcontractor@gmail.com",
        role: "contractor",
        avatar: null,
      },
      {
        id: "0feda007-d8a0-4b96-acb7-d7763614854e",
        username: "Test &",
        last_name: "Dev",
        email: "test@dev.com",
        role: "admin",
        avatar:
          "https://ibex-documents.s3.us-east-2.amazonaws.com/public/static/users_avatars/Screenshot_from_2025-01-17_15-14-32.png",
      },
    ],
    initiated_by_info: {
      id: "0feda007-d8a0-4b96-acb7-d7763614854e",
      username: "Test &",
      last_name: "Dev",
      email: "test@dev.com",
      role: "admin",
      avatar:
        "https://ibex-documents.s3.us-east-2.amazonaws.com/public/static/users_avatars/Screenshot_from_2025-01-17_15-14-32.png",
    },
    title: "Test",
    description: "Descriptio",
    objectId: "f3e8ca35-7ff6-456f-af56-fe034fa1b974",
    type: "email",
    color: "#22c55e",
    status: "pending",
    date: "2025-02-05",
    start_time: "00:08:00",
    end_time: "03:06:00",
    reminder_time: "01:06:00",
    created_at: "2025-02-06T19:06:55.257721Z",
    address: "Rosecroft Gardens, Twickenham TW2 7PX, UK",
    city: "",
    state: "England",
    zip_code: "tw2 7px",
    file: null,
    latitude: 51.4497981,
    longitude: -0.3464276,
    initiated_by: "0feda007-d8a0-4b96-acb7-d7763614854e",
    attendees: [
      "a1af480c-4b20-4669-bcc6-db4402074fc7",
      "0feda007-d8a0-4b96-acb7-d7763614854e",
    ],
  },
]);

const getObjectActivities = async () => {
  try {
    loading.value = true;
    const response = await api.get(`/api/activity/by-object/${props.object}/`);
    activitiesList.value = response.data;
  } catch (error) {
    console.log("getting todos", error);
  } finally {
    loading.value = false;
  }
};
const getUserActivities = async () => {
  try {
    loading.value = true;
    const response = await api.get(
      `/api/activity/by-user/${userSession.user.id}/`
    );
    activitiesList.value = response.data;
  } catch (error) {
    console.log("getting todos", error);
  } finally {
    loading.value = false;
  }
};

const getTodoHandler = () => {
  if (props.getUserActivities == true) {
    getUserActivities();
  } else if (props.object) {
    getObjectActivities();
  }
};

const getActivityIcon = ref({
  call: "lucide:phone-call",
  email: "lucide:mail",
  followup: "lucide:repeat",
  visit: "lucide:bookmark",
  form: "lucide:file-text",
});

onMounted(() => {
  getTodoHandler();
});
</script>
<template>
  <div class="icon-timeline">
    <div
      v-for="activity in activitiesList"
      :key="activity.id"
      class="timeline-item"
    >
      <div class="timeline-icon" :style="{ backgroundColor: activity.color }">
        <!-- <VIcon :icon="getActivityIcon[activity.type]" /> -->

        <i
          aria-hidden="true"
          class="iconify"
          :data-icon="getActivityIcon[activity.type]"
        />
      </div>
      <div class="timeline-content">
        <p>{{ activity.title }}</p>
        <span
          >{{ moment(activity.date).format("DD MMM YYYY") }} -
          {{ activity.start_time }}</span
        >
      </div>
    </div>
    <!-- <div>
      <div class="timeline-icon">
        <i aria-hidden="true" class="iconify" data-icon="feather:phone-call" />
      </div>
      <div class="timeline-content">
        <p>Call Danny at Colby's</p>
        <span>Today - 11:30am</span>
      </div>
    </div>
    <div class="timeline-item">
      <div class="timeline-icon">
        <img
          class="avatar"
          src="/demo/avatars/7.jpg"
          alt=""
          @error.once="onceImageErrored(150)"
        />
      </div>
      <div class="timeline-content">
        <p>Meeting with Alice</p>
        <span>Today - 01:00pm</span>
      </div>
    </div>
    <div class="timeline-item">
      <div class="timeline-icon">
        <i
          aria-hidden="true"
          class="iconify"
          data-icon="feather:message-circle"
        />
      </div>
      <div class="timeline-content">
        <p>Answer Annie's message</p>
        <span>Today - 01:45pm</span>
      </div>
    </div>
    <div class="timeline-item">
      <div class="timeline-icon">
        <i aria-hidden="true" class="iconify" data-icon="feather:mail" />
      </div>
      <div class="timeline-content">
        <p>Send new campaign</p>
        <span>Today - 02:30pm</span>
      </div>
    </div>
    <div class="timeline-item">
      <div class="timeline-icon">
        <i aria-hidden="true" class="iconify" data-icon="feather:smile" />
      </div>
      <div class="timeline-content">
        <p>Project review</p>
        <span>Today - 03:30pm</span>
      </div>
    </div>
    <div class="timeline-item">
      <div class="timeline-icon">
        <i aria-hidden="true" class="iconify" data-icon="feather:phone-call" />
      </div>
      <div class="timeline-content">
        <p>Call Trisha Jackson</p>
        <span>Today - 05:00pm</span>
      </div>
    </div>
    <div class="timeline-item">
      <div class="timeline-icon">
        <i aria-hidden="true" class="iconify" data-icon="feather:feather" />
      </div>
      <div class="timeline-content">
        <p>Write proposal for Don</p>
        <span>Today - 06:00pm</span>
      </div>
    </div> -->
  </div>
</template>
