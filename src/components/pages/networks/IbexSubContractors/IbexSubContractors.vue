<script setup lang="ts">
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";

const api = useApi();
const notyf = useNotyf();
const suppliers = ref([]);
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
    const resp = await api.get(`/api/users/by-role-option/supplier/`, {});
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
                    <i
                      aria-hidden="true"
                      class="iconify"
                      data-icon="feather:map-pin"
                    />
                    <span>{{ item?.email }}</span>
                  </span>
                </div>
                <div class="meta-right">
                  <div class="tags">
                    <VTag
                      :label="item?.role"
                      color="success"
                      rounded
                      elevated
                    />
                  </div>

                  <div class="stats">
                    <div class="stat">
                      <span>33</span>
                      <span>Projects</span>
                    </div>
                    <div class="separator" />
                    <div class="stat">
                      <span>33</span>
                      <span>Replies</span>
                    </div>
                    <div class="separator" />
                    <div class="stat">
                      <span>33</span>
                      <span>Posts</span>
                    </div>
                  </div>

                  <div class="network">
                    <!-- <VAvatarStack
                      :avatars="item.teams"
                      :limit="3"
                      size="small"
                    /> -->
                    <span>in Team</span>
                  </div>

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
                            isOpenModal = true;
                            currentSelectId = item.id;
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
      :userId="selectedUserId"
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
