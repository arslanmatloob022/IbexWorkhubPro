<script setup lang="ts">
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { useUserSession } from "/@src/stores/userSession";
import type { VAvatarProps } from "/@src/components/base/avatar/VAvatar.vue";
import * as gridData from "/@src/data/layouts/tile-grid-v1";
import ChangePasswordModal from "./ChangePasswordModal.vue";

export interface UserData extends VAvatarProps {
  username: string;
  location: string;
  position: string;
}

const api = useApi();
const notyf = useNotyf();
const userSession = useUserSession();
const users = gridData.users as UserData[];
const filters = ref("");
const Loading = ref(false);
const currentSelectId = ref("");
const selectedIdToDelete = ref("");
const isOpenModal = ref(false);
const SweetAlertProps = ref({
  title: "",
  subtitle: "test",
  isSweetAlertOpen: false,
  btntext: "text",
});

const adminsData = ref([
  {
    username: "",
    email: "",
    password: "",
    status: "",
    role: "admin",
    phoneNumber: "",
    avatar: null as File | null | String,
  },
]);
const filteredData = computed(() => {
  if (!filters.value) {
    return adminsData.value;
  } else {
    return adminsData.value.filter((item) => {
      return (
        item.username.match(new RegExp(filters.value, "i")) ||
        item.email.match(new RegExp(filters.value, "i"))
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

const getAdminshandler = async () => {
  try {
    Loading.value = true;
    const response = await api.get("/api/users/by-role/admin/", {});
    adminsData.value = response.data;
  } catch (err) {
    console.log(err);
  } finally {
    Loading.value = false;
  }
};
const deleteAdminHandler = async () => {
  try {
    Loading.value = true;
    const resp = await api.delete(
      `/api/users/${selectedIdToDelete.value}/`,
      {}
    );
    getAdminshandler();
    notyf.success("Admin deleted successfully");
  } catch (err) {
    console.error(err);

    notyf.error("Error while deleting");
  } finally {
    SweetAlertProps.value.isSweetAlertOpen = false; // close modal using the ref
    Loading.value = false;
  }
};

const openUserModal = (id: any = "") => {
  currentSelectId.value = id;
  isOpenModal.value = !isOpenModal.value;
};

const openPasswordModal = ref(false);
const openChangePasswordModal = (id: any) => {
  currentSelectId.value = id;
  openPasswordModal.value = true;
};

const openDeleteModal = (admin: any) => {
  selectedIdToDelete.value = admin.id;
  SweetAlertProps.value = {
    title: `Delete ${admin.username}?`,
    subtitle:
      "After deleting this admin you won't be able to recover it again.",
    btntext: `Delete it`,
    isSweetAlertOpen: true,
  };
};

onMounted(() => {
  getAdminshandler();
});
</script>

<template>
  <div>
    <div class="tile-grid-toolbar">
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
          <span>Admin</span>
        </VButton>
      </div>
    </div>

    <div class="tile-grid tile-grid-v1">
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
            src="/@src/assets/illustrations/placeholders/search-6.svg"
            alt=""
          />
          <img
            class="dark-image"
            src="/@src/assets/illustrations/placeholders/search-6-dark.svg"
            alt=""
          />
        </template>
      </VPlaceholderPage>

      <!--Tile Grid v1-->
      <TransitionGroup name="list" tag="div" class="columns is-multiline">
        <!--Grid item-->
        <div v-for="(item, key) in filteredData" :key="key" class="column is-6">
          <div class="tile-grid-item">
            <div class="tile-grid-item-inner">
              <VAvatar
                :picture="item.avatar"
                color="primary"
                :initials="item.username.slice(0, 2)"
                size="medium"
              />
              <div class="meta">
                <span class="dark-inverted">{{ item.username }}</span>
                <span style="text-transform: capitalize">{{ item.role }}</span>
              </div>
              <VDropdown icon="feather:more-vertical" spaced right>
                <template #content>
                  <a
                    @click="openUserModal(item.id)"
                    role="menuitem"
                    class="dropdown-item is-media"
                  >
                    <div class="icon">
                      <i aria-hidden="true" class="lnil lnil-lock" />
                    </div>
                    <div class="meta">
                      <span>Edit</span>
                      <span>Edit user</span>
                    </div>
                  </a>

                  <a
                    @click="openChangePasswordModal(item.id)"
                    role="menuitem"
                    class="dropdown-item is-media"
                  >
                    <div class="icon">
                      <i aria-hidden="true" class="lnil lnil-share" />
                    </div>
                    <div class="meta">
                      <span>Password</span>
                      <span>Change password</span>
                    </div>
                  </a>

                  <hr class="dropdown-divider" />

                  <a
                    @click="openDeleteModal(item)"
                    role="menuitem"
                    class="dropdown-item is-media"
                  >
                    <div class="icon">
                      <i aria-hidden="true" class="lnil lnil-trash-can-alt" />
                    </div>
                    <div class="meta">
                      <span>Delete</span>
                      <span>Delete from list</span>
                    </div>
                  </a>
                </template>
              </VDropdown>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
    <AddUpdateUser
      v-if="isOpenModal"
      :is-modal-open="isOpenModal"
      user-role="admin"
      :user-id="currentSelectId"
      @update:close-modal-handler="isOpenModal = false"
      @update:action-update-handler="getAdminshandler"
    />
    <SweetAlert
      v-if="SweetAlertProps.isSweetAlertOpen"
      :loading="Loading"
      :isSweetAlertOpen="SweetAlertProps.isSweetAlertOpen"
      :title="SweetAlertProps.title"
      :subtitle="SweetAlertProps.subtitle"
      :btntext="SweetAlertProps.btntext"
      :onConfirm="deleteAdminHandler"
      :onCancel="() => (SweetAlertProps.isSweetAlertOpen = false)"
    />
    <ChangePasswordModal
      v-if="openPasswordModal"
      :isModalOpen="openPasswordModal"
      :userId="currentSelectId"
      @update:closeModalHandler="openPasswordModal = false"
      @update:actionUpdateHandler="getAdminshandler"
    />
  </div>
</template>

<style lang="scss">
@import "/@src/scss/abstracts/all";

.tile-grid {
  .columns {
    margin-inline-start: -0.5rem !important;
    margin-inline-end: -0.5rem !important;
    margin-top: -0.5rem !important;
  }

  .column {
    padding: 0.5rem !important;
  }
}

.is-dark {
  .tile-grid {
    .tile-grid-item {
      @include vuero-card--dark;
    }
  }
}

.tile-grid-v1 {
  .tile-grid-item {
    @include vuero-s-card;

    border-radius: 14px;
    padding: 16px;

    .tile-grid-item-inner {
      display: flex;
      align-items: center;

      .meta {
        margin-inline-start: 10px;
        line-height: 1.2;

        span {
          display: block;
          font-family: var(--font);

          &:first-child {
            color: var(--dark-text);
            font-family: var(--font-alt);
            font-weight: 600;
            font-size: 1rem;
          }

          &:nth-child(2) {
            color: var(--light-text);
            font-size: 0.9rem;
          }
        }
      }

      .dropdown {
        position: relative;
        margin-inline-start: auto;
      }
    }
  }
}
</style>
