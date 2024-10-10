<script setup lang="ts">
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";

const api = useApi();
const notyf = useNotyf();
const suppliers = ref([
  {
    id: "53ac9fe2-e187-456a-a1e0-77d6c3c3d715",
    total_workers: 0,
    last_login: null,
    date_joined: "2024-10-02T17:18:03.032660Z",
    email: "supplier@ibex.com",
    role: "supplier",
    avatar:
      "https://res.cloudinary.com/dcqeugna3/image/upload/v1/media/static/users_avatars/Screenshot_from_2024-09-26_12-00-53_vrfqiv",
    is_active: true,
    phoneNumber: "03007626555",
    username: "Second Test",
    is_sentMail: false,
  },
]);
const filters = ref("");
const openUserModal = ref(false);
const selectedUserId = ref("");
const isOpenModal = ref(false);
const userId = ref("");
const isPasswordModalOpen = ref(false);
const currentSelectId = ref("");
const Loading = ref(false);
const getSuppliers = async () => {
  try {
    Loading.value = true;
    const resp = await api.get(`/api/users/suppliers/`, {});
    suppliers.value = resp.data;
  } catch (err) {
    console.log(err);
  } finally {
    Loading.value = false;
  }
};

const filteredData = computed(() => {
  if (!filters.value) {
    return suppliers.value;
  } else {
    return suppliers.value.filter((item) => {
      return (
        item.username.match(new RegExp(filters.value, "i")) ||
        item.email.match(new RegExp(filters.value, "i"))
      );
    });
  }
});
const router = useRouter();
const gotoSubContrctorProfile = (id: any) => {
  router.push(`/sidebar/dashboard/subcontractors/${id}`);
};
const openPasswordModal = (id: any) => {
  userId.value = id;
  isPasswordModalOpen.value = true;
};

onMounted(() => {
  getSuppliers();
});
</script>
<template>
  <div>
    <div class="list-view-toolbar">
      <VField>
        <VControl icon="feather:search">
          <input
            v-model="filters"
            class="input custom-text-filter"
            placeholder="Search..."
          />
        </VControl>
      </VField>

      <!-- <div class="list-info">
        <span v-if="filteredData.length === 1">1 record found</span>
        <span v-else>{{ filteredData.length }} records found</span>
      </div> -->

      <div class="buttons">
        <VButton
          @click="openUserModal = !openUserModal"
          color="primary"
          icon="fas fa-plus"
          elevated
        >
          Contractors
        </VButton>
      </div>
    </div>
    <div class="page-content-inner">
      <!--List-->
      <div class="list-view list-view-v1">
        <VPlaceholderPage
          v-if="filteredData.length == 0 && !Loading"
          title="We couldn't find any matching results."
          subtitle="Too bad. Looks like we couldn't find any matching results for the
          search terms you've entered. Please try different search terms or
          criteria."
          larger
        >
          <template #image>
            <img
              class="light-image"
              src="/@src/assets/illustrations/placeholders/search-1.svg"
              alt=""
            />
            <img
              class="dark-image"
              src="/@src/assets/illustrations/placeholders/search-1-dark.svg"
              alt=""
            />
          </template>
        </VPlaceholderPage>

        <div v-if="!Loading" class="list-view-inner">
          <TransitionGroup name="list-complete" tag="div">
            <div
              v-if="filteredData.length != 0"
              v-for="(item, index) in filteredData"
              :key="item.id"
              class="list-view-item"
            >
              <div class="list-view-item-inner">
                <VAvatar
                  @click="gotoSubContrctorProfile(item.id)"
                  :picture="item?.avatar"
                  size="large"
                />
                <div
                  @click="gotoSubContrctorProfile(item.id)"
                  class="meta-left"
                >
                  <h3>{{ item?.username }}</h3>
                  <span>
                    <i aria-hidden="true" class="fas fa-envelope mr-1" />
                    <span>{{ item?.email }}</span>
                  </span>
                </div>
                <div class="meta-right">
                  <div class="tags">
                    <VTag
                      :label="item?.role.replace(/^\w/, (c) => c.toUpperCase())"
                      color="success"
                      rounded
                      elevated
                    />
                  </div>

                  <div class="stats">
                    <div class="stat">
                      <span
                        ><i
                          v-if="item.is_sentMail"
                          class="primary-text fas fa-check-circle"
                          aria-hidden="true"
                        ></i>
                        <i
                          v-else
                          class="danger-text fas fa-circle"
                          aria-hidden="true"
                        ></i>
                      </span>
                      <span>Email Notify</span>
                    </div>
                    <div class="separator" />
                    <div class="stat">
                      <span>{{ item.phoneNumber }}</span>
                      <span>Phone</span>
                    </div>
                    <div class="separator" />
                    <div class="stat">
                      <span>{{ item.total_workers }}</span>
                      <span>Workers</span>
                    </div>
                  </div>

                  <!-- <div class="network">
                    <VAvatarStack
                      :avatars="item.teams"
                      :limit="3"
                      size="small"
                    />
                    <span>in Team</span>
                  </div> -->

                  <VDropdown icon="feather:more-vertical" spaced right>
                    <template #content>
                      <a
                        role="menuitem"
                        @click="gotoSubContrctorProfile(item.id)"
                        class="dropdown-item is-media"
                      >
                        <div class="icon">
                          <i aria-hidden="true" class="lnil lnil-user-alt" />
                        </div>
                        <div class="meta">
                          <span>Profile</span>
                          <span>View profile</span>
                        </div>
                      </a>

                      <a
                        role="menuitem"
                        @click="
                          () => {
                            currentSelectId = item.id;
                            openUserModal = true;
                          }
                        "
                        class="dropdown-item is-media"
                      >
                        <div class="icon">
                          <i class="lnil lnil-pencil" aria-hidden="true"></i>
                        </div>
                        <div class="meta">
                          <span>Edit</span>
                          <span>Edit Manager info</span>
                        </div>
                      </a>

                      <a
                        @click="openPasswordModal(item.id)"
                        role="menuitem"
                        class="dropdown-item is-media"
                      >
                        <div class="icon">
                          <i class="lnil lnil-code" aria-hidden="true"></i>
                        </div>
                        <div class="meta">
                          <span>Password</span>
                          <span>Change user password</span>
                        </div>
                      </a>

                      <hr class="dropdown-divider" />

                      <a
                        role="menuitem"
                        @click="
                          () => {
                            isOpenModal = true;
                            currentSelectId = item.id;
                          }
                        "
                        class="dropdown-item is-media"
                      >
                        <div class="icon">
                          <i aria-hidden="true" class="lnil lnil-trash" />
                        </div>
                        <div class="meta">
                          <span>Delete</span>
                          <span>Delete this user permanently</span>
                        </div>
                      </a>
                    </template>
                  </VDropdown>
                </div>
              </div>
            </div>
          </TransitionGroup>
        </div>
        <PlaceloadV1 v-if="Loading" />
      </div>

      <VFlexPagination
        v-if="filteredData.length > 5"
        :item-per-page="10"
        :total-items="873"
        :current-page="42"
        :max-links-displayed="5"
      />
    </div>
    <AddUpdateUser
      v-if="openUserModal"
      :isModalOpen="openUserModal"
      userRole="supplier"
      :userId="currentSelectId"
      @update:close-modal-handler="openUserModal = false"
      @update:action-update-handler="getSuppliers"
    />
    <ChangePasswordModal
      v-if="isPasswordModalOpen"
      :isModalOpen="isPasswordModalOpen"
      :userId="userId"
      @update:closeModalHandler="isPasswordModalOpen = false"
    />
  </div>
</template>
<style lang="scss" scoped></style>
