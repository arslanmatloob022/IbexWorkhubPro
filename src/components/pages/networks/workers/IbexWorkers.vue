<script setup lang="ts">
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { useUserSession } from "/@src/stores/userSession";
import { users } from "/@src/data/layouts/card-grid-v1";

const api = useApi();
const notyf = useNotyf();
const userSession = useUserSession();
const showPassword = ref(false);
const managersData = ref([]);
const filters = ref("");
const selectedIdToDelete = ref("");

const SweetAlertProps = ref({
  title: "",
  subtitle: "test",
  isSweetAlertOpen: false,
  btntext: "text",
});
const workersData = ref({
  username: "",
  email: "",
  password: "",
  is_sentMail: false,
  status: "",
  role: "worker",
  phoneNumber: "",
  avatar: null as File | null | String,
});

const filteredData = computed(() => {
  if (!filters.value) {
    return users;
  } else {
    return users.filter((item) => {
      return (
        item.name.match(new RegExp(filters.value, "i")) ||
        item.role.match(new RegExp(filters.value, "i")) ||
        item.medias.badge.match(new RegExp(filters.value, "i"))
      );
    });
  }
});

const valueSingle = ref(0);
const optionsSingle = [
  "All",
  "UI/UX Design",
  "Web Development",
  "Software Eng.",
  "Business",
];

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
const loading = ref(false);
const selectedIdToChangeStatus = ref(null);
const selectedStatus = ref(null);
const preview = ref(null);
const phoneNumber = ref("");
const userData = ref({
  username: "",
  email: "",
  password: "",
  status: "",
  avatar: null,
  is_sentMail: false,
  phoneNumber: "",
});
const editModeId = ref(0);
const modalTitle = ref("");

const openStatusAlert = (user) => {
  selectedIdToChangeStatus.value = user.id;
  selectedStatus.value = user.is_active;
  SweetAlertProps.value.title = "Change Status";
  SweetAlertProps.value.subtitle = !selectedStatus.value
    ? "From now this user will be able to login and perform all activities"
    : "After this User will not be able to login into the system";
};

const closeUserModalHandler = () => {
  userData.value.username = "";
  userData.value.email = "";
  userData.value.password = "";
  userData.value.status = "";
  preview.value = null;
  phoneNumber.value = "";
};

const openDeleteModal = (id: any) => {
  selectedIdToDelete.value = id;
};

const deletUser = async () => {
  try {
    loading.value = true;
    await api.delete(`/api/users/${selectedIdToDelete.value}/`, {});
    await getManagershandler();
    notyf.green("Worker deleted successfully");
  } catch (err) {
    console.log(err);
    notyf.error("Error while deleting");
  } finally {
    loading.value = false;
  }
};

const openCustomModal = (isEdit = false, manager = {}) => {
  closeUserModalHandler();
  if (isEdit) {
    editModeId.value = manager.id;
    modalTitle.value = "Edit Worker";
    userData.username = manager.username;
    userData.email = manager.email;
    userData.password = manager.password;
    userData.avatar = manager.avatar;
    preview.value = manager.avatar;
    userData.is_sentMail = manager.is_sentMail;
    userData.phoneNumber = manager.phoneNumber;
  } else {
    editModeId.value = 0;
    modalTitle.value = "Add Worker";
  }
};

const saveAndClose = () => {};

const handleFileChange = (event) => {
  userData.value.avatar = event.target.files[0];
  const input = event.target;
  if (input.files) {
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.value = e.target.result;
    };
    reader.readAsDataURL(input.files[0]);
  }
};

const getManagershandler = async () => {
  try {
    loading.value = true;
    const response = await api.get("/api/users/by-role/worker/", {});
    managersData.value = response.data;
    console.log("data", managersData.value);
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const addNewManager = async () => {
  try {
    loading.value = true;

    let formData = convertToFormData(userData.value, ["avatar"]);

    if (!editModeId.value && userData.value.password) {
      formData.append("password", userData.value.password);
    }

    const response = editModeId.value
      ? await api.patch(`/api/users/${editModeId.value}/`, formData)
      : await api.post("/api/users/", formData);
    notyf.green("Worker added or updated successfully");

    saveAndClose();
    await getManagershandler();
    console.log(response);
  } catch (err) {
    console.log(err);
    notyf.info(
      "Enter the information carefully and try again OR user with email already exists"
    );
  } finally {
    loading.value = false;
  }
};

const changeUserStatus = async () => {
  try {
    const resp = await api.patch(
      `/api/users/${selectedIdToChangeStatus.value}/`,
      {
        is_active: !selectedStatus.value,
      }
    );
    await getManagershandler();
    notyf.success(
      !selectedStatus.value
        ? "Worker set active successfully"
        : "Worker set inactive successfully"
    );

    console.log(resp);
  } catch (err) {
    console.log(err);
  }
};
</script>

<template>
  <div>
    <div class="card-grid-toolbar">
      <VControl icon="feather:search">
        <input
          v-model="filters"
          class="input custom-text-filter"
          placeholder="Search..."
        />
      </VControl>

      <div class="buttons">
        <VField class="h-hidden-mobile">
          <VControl>
            <Multiselect
              v-model="valueSingle"
              :options="optionsSingle"
              :max-height="145"
              placeholder="Select an option"
            />
          </VControl>
        </VField>
        <VButton color="primary" raised>
          <span class="icon">
            <i aria-hidden="true" class="fas fa-plus" />
          </span>
          <span>Add User</span>
        </VButton>
      </div>
    </div>

    <div class="card-grid card-grid-v1">
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

      <!--Card Grid v1-->
      <TransitionGroup name="list" tag="div" class="columns is-multiline">
        <!--Grid item-->
        <div
          v-for="(item, index) in filteredData"
          :key="index"
          class="column is-6"
        >
          <div class="card-grid-item">
            <div class="card-grid-item-body">
              <div class="left">
                <VAvatar
                  size="big"
                  :picture="item.medias.avatar"
                  :badge="item.medias.badge"
                />
                <div class="meta">
                  <span class="dark-inverted">{{ item.name }}</span>
                  <span>{{ item.role }}</span>
                </div>
              </div>
              <div class="right">
                <div class="social-links">
                  <a
                    v-for="(channel, channelIndex) in item.social"
                    :key="channelIndex"
                    :href="channel.url"
                    class="social-link"
                  >
                    <i aria-hidden="true" :class="channel.icon" />
                  </a>
                </div>
              </div>
            </div>

            <div class="card-grid-item-footer">
              <div class="left">
                <div class="progress-stats">
                  <span class="dark-inverted">Progress</span>
                  <span>{{ item.progress }}%</span>
                </div>
                <div class="progress-bar">
                  <VProgress size="tiny" :value="item.progress" />
                </div>
              </div>
              <div class="right">
                <div class="buttons">
                  <VButton dark-outlined rounded> View Profile </VButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
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
            color: var(--primary);
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
