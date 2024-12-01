<script setup lang="ts">
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";

const api = useApi();
const notyf = useNotyf();
const route = useRoute();
const filters = ref("");
const selectedIdToDelete = ref("");
const currentSelectId = ref("");
const isOpenModal = ref(false);
const itemsPerPage = ref(8);
const maxLinksDisplayed = ref(5);
const loading = ref(false);
const selectedIdToChangeStatus = ref(null);
const selectedStatus = ref(null);

const SweetAlertProps = ref({
  title: "",
  subtitle: "test",
  isSweetAlertOpen: false,
  btntext: "text",
});

const deleteSweetAlertProps = ref({
  title: "",
  subtitle: "test",
  isSweetAlertOpen: false,
  btntext: "text",
});

const workersData = ref([
  {
    id: "",
    active_tasks: 0,
    completed_tasks: 2,
    cancelled_tasks: 0,
    pending_tasks: 13,
    password: "",
    last_login: null,
    date_joined: "",
    email: "",
    role: "",
    is_active: true,
    phoneNumber: "",
    username: "",
    last_name: "",
    is_sentMail: false,
    avatar: null as File | null | String,
  },
]);

const openUserModal = (id: any = "") => {
  currentSelectId.value = id;
  isOpenModal.value = !isOpenModal.value;
};

const pagedData = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  return filteredData.value.slice(startIndex, endIndex);
});

const filteredData = computed(() => {
  if (!filters.value) {
    return workersData.value;
  } else {
    return workersData.value.filter((item) => {
      return (
        item.username.match(new RegExp(filters.value, "i")) ||
        item.email.match(new RegExp(filters.value, "i"))
      );
    });
  }
});

const currentPage = computed(() => {
  let index: any = route.query.page as string;
  if (index == undefined || index == "undefined") {
    index = 1;
  } else {
    index = route.query.page as string;
  }
  return Number.parseInt(route.query.page as string) || 1;
});

const openStatusAlert = (user: any) => {
  selectedIdToChangeStatus.value = user.id;
  selectedStatus.value = user.is_active;
  SweetAlertProps.value.title = "Change Status";
  SweetAlertProps.value.btntext = `${
    user.is_active ? "In-Activate" : "Activate"
  }`;
  SweetAlertProps.value.subtitle = !selectedStatus.value
    ? "From now this user will be able to login and perform all activities"
    : "After this User will not be able to login into the system";
  SweetAlertProps.value.isSweetAlertOpen = true;
};

const openDeleteModal = (worker: any) => {
  selectedIdToDelete.value = worker.id;
  deleteSweetAlertProps.value = {
    title: `Delete ${worker.username}?`,
    subtitle:
      "After deleting this worker you won't be able to recover it again.",
    btntext: `Delete it`,
    isSweetAlertOpen: true,
  };
};

const columns = ref({});

const deleteWorker = async () => {
  try {
    loading.value = true;
    await api.delete(`/api/users/${selectedIdToDelete.value}/`, {});
    await getWorkershandler();
    notyf.green("Worker deleted successfully");
  } catch (err) {
    console.log(err);
    notyf.error("Error while deleting");
  } finally {
    loading.value = false;
    deleteSweetAlertProps.value.isSweetAlertOpen = false;
  }
};

const getWorkershandler = async () => {
  try {
    loading.value = true;
    const response = await api.get("/api/users/workers/", {});
    workersData.value = response.data.map((item) => {
      return {
        ...item,
        totalTasks:
          item.active_tasks + item.pending_tasks + item.completed_tasks,
        progress:
          (item.completed_tasks /
            (item.active_tasks + item.pending_tasks + item.completed_tasks)) *
          100,
      };
    });
    console.log("data", workersData.value);
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const changeUserStatus = async () => {
  try {
    loading.value = true;
    const resp = await api.patch(
      `/api/users/${selectedIdToChangeStatus.value}/`,
      {
        is_active: !selectedStatus.value,
      }
    );
    await getWorkershandler();
    notyf.success(
      !selectedStatus.value
        ? "Worker set active successfully"
        : "Worker set inactive successfully"
    );
    SweetAlertProps.value.isSweetAlertOpen = false;
    console.log(resp);
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  getWorkershandler();
});
</script>

<template>
  <PlaceloadV3 v-if="loading" />
  <div v-else>
    <div class="card-grid-toolbar">
      <VControl icon="feather:search">
        <input
          v-model="filters"
          class="input custom-text-filter"
          placeholder="Search..."
        />
      </VControl>

      <div class="buttons">
        <VButton @click="openUserModal()" color="primary" raised>
          <span class="icon">
            <i aria-hidden="true" class="fas fa-plus" />
          </span>
          <span> Worker</span>
        </VButton>
      </div>
    </div>

    <div class="card-grid card-grid-v1">
      <!--List Empty Search Placeholder -->
      <VPlaceholderPage
        :class="[workersData.length !== 0 && 'is-hidden']"
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

      <VFlexTable
        v-if="filteredData.length"
        :data="filteredData"
        :columns="columns"
        rounded
      >
        <template #body>
          <!--Card Grid v1-->
          <TransitionGroup name="list" tag="div" class="columns is-multiline">
            <!--Grid item-->
            <div
              v-for="(item, index) in pagedData"
              :key="index"
              class="column is-6"
            >
              <div class="card-grid-item">
                <div class="card-grid-item-body">
                  <div class="left">
                    <VAvatar size="big" :picture="item?.avatar" />
                    <div class="meta">
                      <span class="dark-inverted"
                        >{{ item.username }}
                        {{ item.last_name ? item.last_name : "" }}</span
                      >
                      <span>{{ item.role }}</span>
                    </div>
                  </div>
                  <div class="right">
                    <div class="social-links">
                      <a
                        @click="openStatusAlert(item)"
                        v-if="item.is_active"
                        channel="Linkedin"
                        class="social-link"
                      >
                        <i
                          class="success-text fas fa-check-circle"
                          aria-hidden="true"
                        ></i>
                      </a>
                      <a
                        v-else
                        @click="openStatusAlert(item)"
                        channel="Linkedin"
                        class="social-link"
                      >
                        <i
                          class="fas fa-ban warning-text"
                          aria-hidden="true"
                        ></i>
                      </a>
                      <a
                        v-if="item.is_sentMail"
                        channel="Twitter"
                        class="social-link"
                      >
                        <i
                          class="fas fa-envelope warning-text"
                          aria-hidden="true"
                        ></i>
                      </a>

                      <a
                        channel="Dribbble"
                        @click="openUserModal(item.id)"
                        class="social-link"
                      >
                        <i aria-hidden="true" class="fas fa-edit info-text" />
                      </a>
                      <a
                        channel="Dribbble"
                        @click="openDeleteModal(item)"
                        class="social-link"
                      >
                        <i
                          aria-hidden="true"
                          class="fas fa-trash danger-text"
                        />
                      </a>
                    </div>
                  </div>
                </div>

                <div class="card-grid-item-footer">
                  <div class="left">
                    <div class="progress-stats">
                      <span class="dark-inverted">Progress</span>
                      <span>
                        {{
                          item.progress ? item.progress.toFixed(2) : "0"
                        }}%</span
                      >
                    </div>
                    <div class="progress-bar">
                      <VProgress
                        size="tiny"
                        :value="item.completed_tasks ? item.completed_tasks : 0"
                        :max="item.totalTasks ? item.totalTasks : 0"
                      />
                    </div>
                  </div>
                  <div class="right">
                    <div class="buttons">
                      <VButton
                        :to="`/sidebar/dashboard/workers/${item.id}`"
                        dark-outlined
                        rounded
                      >
                        View Profile
                      </VButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TransitionGroup>
        </template>
      </VFlexTable>
      <VFlexPagination
        v-if="workersData.length > itemsPerPage"
        :item-per-page="itemsPerPage"
        v-model="currentPage"
        :total-items="workersData.length"
        :current-page="currentPage"
        :max-links-displayed="maxLinksDisplayed"
      />
    </div>

    <SweetAlert
      v-if="SweetAlertProps.isSweetAlertOpen"
      :loading="loading"
      :isSweetAlertOpen="SweetAlertProps.isSweetAlertOpen"
      :title="SweetAlertProps.title"
      :subtitle="SweetAlertProps.subtitle"
      :btntext="SweetAlertProps.btntext"
      :onConfirm="changeUserStatus"
      :onCancel="() => (SweetAlertProps.isSweetAlertOpen = false)"
    />
    <SweetAlert
      v-if="deleteSweetAlertProps.isSweetAlertOpen"
      :loading="loading"
      :isSweetAlertOpen="deleteSweetAlertProps.isSweetAlertOpen"
      :title="deleteSweetAlertProps.title"
      :subtitle="deleteSweetAlertProps.subtitle"
      :btntext="deleteSweetAlertProps.btntext"
      :onConfirm="deleteWorker"
      :onCancel="() => (deleteSweetAlertProps.isSweetAlertOpen = false)"
    />
    <AddUpdateUser
      v-if="isOpenModal"
      :is-modal-open="isOpenModal"
      user-role="worker"
      :user-id="currentSelectId"
      @update:close-modal-handler="isOpenModal = false"
      @update:action-update-handler="getWorkershandler"
    />
  </div>
</template>

<style lang="scss">
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

.card-grid-v1 {
  .card-grid-item {
    flex: 1;
    display: inline-block;
    width: 100%;
    background-color: var(--white);
    border-radius: 6px;
    border: 1px solid var(--fade-grey-dark-3);
    transition: all 0.3s; // transition-all test

    .card-grid-item-body {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px;
      border-bottom: 1px solid var(--fade-grey-dark-3);

      .left {
        display: flex;
        align-items: center;

        .meta {
          margin-inline-start: 12px;
          line-height: 1.3;

          span {
            display: block;

            &:first-child {
              font-size: 1.1rem;
              font-weight: 600;
              font-family: var(--font-alt);
              color: var(--dark-text);
            }

            &:nth-child(2) {
              font-family: var(--font);
              font-size: 0.85rem;
              color: var(--light-text);
            }
          }
        }
      }

      .right {
        .social-links {
          display: flex;
          align-items: center;
          justify-content: flex-end;

          .social-link {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 32px;
            width: 32px;
            min-width: 32px;
            border-radius: 50%;
            border: 1px solid var(--fade-grey-dark-3);
            margin: 0 4px;
            // color: var(--primary);
            box-shadow: var(--light-box-shadow);
            transition: all 0.3s; // transition-all test

            &:hover {
              color: var(--white);
              background: var(--primary);
              border-color: var(--primary);
              box-shadow: var(--primary-box-shadow);
            }

            i {
              font-size: 12px;
            }
          }
        }
      }
    }

    .card-grid-item-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px;

      .left {
        flex-grow: 2;
        max-width: 50%;

        .progress-stats {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;

          span {
            display: block;

            &:first-child {
              font-family: var(--font-alt);
              font-size: 0.9rem;
              font-weight: 600;
              color: var(--dark-text);
            }

            &:nth-child(2) {
              font-size: 0.9rem;
              color: var(--light-text);
            }
          }
        }

        .progress {
          margin-bottom: 0;
        }
      }

      .right {
        .v-button {
          color: var(--light-text);

          &:hover,
          &:focus {
            border-color: var(--primary);
            background: var(--primary);
            color: var(--smoke-white);
            box-shadow: var(--primary-box-shadow);
          }
        }
      }
    }
  }
}

.is-dark {
  .card-grid-v1 {
    .card-grid-item {
      background: var(--dark-sidebar-light-6);
      border-color: var(--dark-sidebar-light-12);

      .card-grid-item-body {
        border-color: var(--dark-sidebar-light-12);

        .left {
          .v-avatar {
            .badge {
              border-color: var(--dark-sidebar-light-6);
            }
          }
        }

        .right {
          .social-links {
            .social-link {
              background: var(--dark-sidebar-light-2);
              border-color: var(--dark-sidebar-light-12);
              color: var(--dark-dark-text);

              &:hover,
              &:focus {
                border-color: var(--primary) !important;
                color: var(--primary) !important;
              }
            }
          }
        }
      }

      .card-grid-item-footer {
        .right {
          .v-button {
            box-shadow: none !important;
          }
        }
      }
    }
  }
}

@media only screen and (width <= 767px) {
  .card-grid-v1 {
    .card-grid-item {
      .card-grid-item-body {
        flex-direction: column;

        .left {
          flex-direction: column;
          text-align: center;

          .meta {
            margin: 5px 0 20px;
          }
        }
      }
    }
  }
}
</style>
