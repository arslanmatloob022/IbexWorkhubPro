<script setup lang="ts">
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";

const api = useApi();
const notyf = useNotyf();
const suppliers = ref([]);
const filters = ref("");
const openUserModal = ref(false);

const getSuppliers = async () => {
  try {
    const resp = await api.get(`/api/users/by-role-option/supplier/`, {});
    suppliers.value = resp.data;
  } catch (err) {
    console.log(err);
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
          v-if="filteredData.length == 0"
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

        <div class="list-view-inner">
          <TransitionGroup name="list-complete" tag="div">
            <div
              v-if="filteredData.length != 0"
              v-for="(item, index) in filteredData"
              :key="item.id"
              class="list-view-item"
            >
              <div class="list-view-item-inner">
                <VAvatar :picture="item?.avatar" size="large" />
                <div class="meta-left">
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

                  <ListViewV1Dropdown />
                </div>
              </div>
            </div>
          </TransitionGroup>
        </div>
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
      @update:close-modal-handler="openUserModal = false"
      @update:action-update-handler="getSuppliers"
    />
  </div>
</template>
<style lang="scss" scoped></style>
