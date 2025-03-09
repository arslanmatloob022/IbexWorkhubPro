<script setup lang="ts">
import type {
  VAvatarProps,
  VAvatarColor,
} from "/@src/components/base/avatar/VAvatar.vue";
import { projects } from "/@src/data/layouts/card-grid-v3";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { useUserSession } from "/@src/stores/userSession";
import { formatDate } from "/@src/composable/useSupportElement";
import { activityTypes } from "../../estimatesScripts";

const searchQuery = ref("");
const selectedActivity = ref("");
const showAddUpdateContactModal = ref(false);
const showMailSenderModal = ref(false);
const activitiesList = ref([
  {
    id: "",
    attendees_info: [
      {
        id: "",
        username: "",
        last_name: null,
        email: "",
        role: "",
        avatar: "",
      },
    ],
    initiated_by_info: {
      id: "",
      username: "",
      last_name: "",
      email: "",
      role: "",
      avatar: "",
    },
    title: "",
    description: "",
    objectId: "",
    type: "",
    color: "",
    status: "",
    date: "",
    start_time: "",
    end_time: "",
    reminder_time: "",
    created_at: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    file: null,
    latitude: 0.0,
    longitude: 0.0,
    initiated_by: "",
    attendees: [""],
  },
]);
const api = useApi();
const notyf = useNotyf();
const userSession = useUserSession();
const loading = ref(false);
const valueSingle = ref("");

const props = defineProps<{
  jobId?: "";
}>();

function getAvatarData(user: any): VAvatarProps {
  return {
    picture: user?.picture,
    initials: user?.initials,
    color: user?.color as VAvatarColor,
  };
}

const openActivityModal = (activity: any) => {
  selectedActivity.value = activity;
  showAddUpdateContactModal.value = true;
};

const getLeadActivitiesHandler = async () => {
  try {
    loading.value = true;
    const response = await api.get(`/api/activity/by-object/${props.jobId}/`);
    activitiesList.value = response.data;
  } catch (error: any) {
    notyf.error(`something get wrong`);
  } finally {
    loading.value = false;
  }
};

const getAllActivitiesHandler = async () => {
  try {
    loading.value = true;
    const response = await api.get(`/api/activity/`);
    activitiesList.value = response.data;
  } catch (error: any) {
    notyf.error(`something get wrong`);
  } finally {
    loading.value = false;
  }
};

const deleteLoading = ref(false);
const deleteActivity = async (id: any = "") => {
  try {
    deleteLoading.value = true;
    const response = await api.delete(`/api/activity/${id}/`);
    if (response.status === 204) {
      notyf.success("Activity deleted successfully");
      getActivitiesHandler();
    } else {
      notyf.error("Something went wrong");
    }
  } catch (err) {
    console.log("Err in deleting activity", err);
  } finally {
    deleteLoading.value = false;
  }
};

const filteredData = computed(() => {
  if (!activitiesList.value) return [];

  const searchRegEx = new RegExp(searchQuery.value, "i");
  const selectedType = valueSingle.value?.trim(); // Handle empty or null values properly

  return activitiesList.value.filter((item) => {
    // Match search query (if provided)
    const matchesSearch =
      !searchQuery.value ||
      searchRegEx.test(item.title) ||
      searchRegEx.test(item.start_time) ||
      searchRegEx.test(item.end_time) ||
      searchRegEx.test(item.date) ||
      searchRegEx.test(item.status) ||
      searchRegEx.test(item.type);

    // Match selected type (if provided)
    const matchesType = !selectedType || item.type === selectedType;

    return matchesSearch && matchesType; // Both conditions must be true
  });
});

const getActivitiesHandler = () => {
  if (props.jobId) {
    getLeadActivitiesHandler();
  } else {
    getAllActivitiesHandler();
  }
};

onMounted(() => {
  getActivitiesHandler();
});
</script>

<template>
  <PlaceloadV3 v-if="loading" />
  <div v-else>
    <div class="card-grid-toolbar">
      <VControl icon="feather:search">
        <input
          v-model="searchQuery"
          class="input custom-text-filter"
          placeholder="Search..."
        />
      </VControl>

      <div class="buttons">
        {{ valueSingle }}
        <VField>
          <VControl>
            <VSelect v-model="valueSingle" required>
              <VOption value="">All</VOption>
              <VOption v-for="item in activityTypes" :value="item.value">
                {{ item.label }}
              </VOption>
            </VSelect>
          </VControl>
        </VField>

        <!-- <VField class="h-hidden-mobile">
          <VControl>
            <Multiselect
              v-model="valueSingle"
              :options="optionsSingle"
              :max-height="145"
              placeholder="Select an option"
            />
          </VControl>
        </VField> -->
        <VButton
          @click="showAddUpdateContactModal = !showAddUpdateContactModal"
          color="warning"
          icon="lnir lnir-alarm"
        >
          Create Activity
        </VButton>
        <VButton
          @click="showMailSenderModal = !showMailSenderModal"
          color="success"
          class="ml-2"
          icon="fas fa-envelope"
        >
          Schedule Email
        </VButton>
      </div>
    </div>

    <div class="card-grid card-grid-v3">
      <!--List Empty Search Placeholder -->
      <VPlaceholderPage
        :class="[filteredData.length !== 0 && 'is-hidden']"
        title="We couldn't find any matching results."
        subtitle="Too bad. Looks like we couldn't find any matching results for the
          search terms you've entered. Please try different search terms or
          criteria."
        larger
      >
        <template #image>
          <img
            class="light-image"
            src="/@src/assets/illustrations/placeholders/search-3.svg"
            alt=""
          />
          <img
            class="dark-image"
            src="/@src/assets/illustrations/placeholders/search-3-dark.svg"
            alt=""
          />
        </template>
      </VPlaceholderPage>

      <TransitionGroup
        name="list"
        tag="div"
        class="columns is-multiline is-flex-tablet-p is-half-tablet-p"
      >
        <div v-for="item in filteredData" :key="item.id" class="column is-4">
          <div
            class="card-grid-item"
            :style="{
              backgroundImage: `linear-gradient(
                    -175deg,
                    white 70%,
                  ${item.color}30
                  `,
            }"
          >
            <label class="h-toggle">
              <input type="checkbox" :checked="item.status == 'completed'" />
              <span class="toggler">
                <span class="active">
                  <i
                    aria-hidden="true"
                    class="iconify"
                    data-icon="feather:check"
                  />
                </span>
                <span class="inactive"> <VIcon icon="lucide:activity" /> </span>
              </span>
            </label>
            <VAvatar
              size="large"
              :picture="`/IbexIcons/ActivitiesIcons/${item.type}.png`"
              squared
            />
            <h3 class="dark-inverted">
              {{ item.title }}
            </h3>
            <p>{{ formatDate(item.date) }} remaining</p>
            <div class="description">
              <p>{{ item.description ?? "Not Added" }}</p>
            </div>
            <div class="people">
              <VAvatar
                v-for="user in item.attendees_info"
                :key="user.id"
                size="small"
                :initials="user.username.slice(0, 2)"
                :picture="user.avatar"
                v-tooltip.rounded="
                  `${user.username} ${user.last_name ? user.last_name : ''}`
                "
              />
            </div>
            <div class="buttons">
              <VButton
                @click="deleteActivity(item.id)"
                :loading="deleteLoading"
                icon="feather:trash"
                outlined
              >
                Delete
              </VButton>
              <button
                @click="openActivityModal(item.id)"
                class="button v-button is-dark-outlined"
              >
                <span class="icon">
                  <i
                    aria-hidden="true"
                    class="iconify"
                    data-icon="feather:edit-2"
                  />
                </span>
                <span>Edit</span>
              </button>
            </div>
          </div>
        </div>
      </TransitionGroup>

      <!--Card Grid v3-->
      <!-- <TransitionGroup
        name="list"
        tag="div"
        class="columns is-multiline is-flex-tablet-p is-half-tablet-p"
      >
        <div v-for="item in filteredData" :key="item.id" class="column is-4">
          <div class="card-grid-item">
            <label v-if="item.lockable" class="h-toggle">
              <input type="checkbox" :checked="item.locked" />
              <span class="toggler">
                <span class="active">
                  <i
                    aria-hidden="true"
                    class="iconify"
                    data-icon="feather:lock"
                  />
                </span>
                <span class="inactive">
                  <i
                    aria-hidden="true"
                    class="iconify"
                    data-icon="feather:check"
                  />
                </span>
              </span>
            </label>
            <VAvatar
              size="large"
              :picture="item.image"
              :badge="item.badge"
              squared
            />
            <h3 class="dark-inverted">
              {{ item.name }}
            </h3>
            <p>{{ item.remaining }} remaining</p>
            <div class="description">
              <p>{{ item.description }}</p>
            </div>
            <div class="people">
              <VAvatar
                v-for="user in item.team"
                :key="user.id"
                size="small"
                v-bind="getAvatarData(user)"
              />
            </div>
            <div class="buttons">
              <button class="button v-button is-dark-outlined">
                <span class="icon">
                  <i
                    aria-hidden="true"
                    class="iconify"
                    data-icon="feather:eye"
                  />
                </span>
                <span>View</span>
              </button>
              <button class="button v-button is-dark-outlined">
                <span class="icon">
                  <i
                    aria-hidden="true"
                    class="iconify"
                    data-icon="feather:edit-2"
                  />
                </span>
                <span>Edit</span>
              </button>
            </div>
          </div>
        </div>
      </TransitionGroup> -->
    </div>
    <LeadActivityModal
      v-if="showAddUpdateContactModal"
      :addUpdateContactModal="showAddUpdateContactModal"
      :objectId="props.jobId"
      :activityId="selectedActivity"
      @update:modalHandler="showAddUpdateContactModal = false"
      @update:OnSuccess="getActivitiesHandler"
    />
    <ScheduleEmailModal
      v-if="showMailSenderModal"
      :mailSchedulerModal="showMailSenderModal"
      @update:modal-handler="showMailSenderModal = false"
    />
  </div>
</template>

<style lang="scss">
@import "/@src/scss/abstracts/all";

.card-grid {
  .columns {
    margin-inline-start: -0.5rem !important;
    margin-inline-end: -0.5rem !important;
    margin-top: -0.5rem !important;
  }

  .column {
    padding: 0.5rem !important;
  }
}

.card-grid-v3 {
  .card-grid-item {
    @include vuero-s-card;

    position: relative;
    text-align: center;
    padding: 30px;

    .h-toggle {
      position: absolute;
      top: 28px;
      inset-inline-end: 10px;
      transform: scale(0.85);
    }

    > .v-avatar {
      display: block;
      margin: 0 auto 10px;
      border-radius: 16px;

      .avatar {
        object-fit: cover;
        border: 1px solid var(--fade-grey-dark-4);
        box-shadow: var(--light-box-shadow);
      }

      .badge {
        bottom: 22px;
        inset-inline-end: -12px;
      }
    }

    > h3 {
      font-size: 1.1rem;
      font-weight: 600;
      font-family: var(--font-alt);
      color: var(--dark-text);
    }

    > p {
      font-size: 0.9rem;
    }

    .description {
      padding: 12px 0;
    }

    .people {
      display: flex;
      justify-content: center;
      padding: 8px 0 30px;

      .v-avatar {
        margin: 0 4px;
      }
    }

    .buttons {
      display: flex;
      justify-content: space-between;

      .button {
        width: calc(50% - 4px);
        color: var(--light-text);

        &:hover,
        &:focus {
          border-color: var(--fade-grey-dark-4);
          color: var(--primary);
          box-shadow: var(--light-box-shadow);
        }
      }
    }
  }
}

.is-dark {
  .card-grid-v3 {
    .card-grid-item {
      @include vuero-card--dark;
    }
  }
}

@media only screen and (width >= 768px) and (width <= 1024px) and (orientation: landscape) {
  .card-grid-v3 .card-grid-item > h3 {
    font-size: 1rem;
  }
}
</style>
