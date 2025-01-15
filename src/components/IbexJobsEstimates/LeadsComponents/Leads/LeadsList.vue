<script setup lang="ts">
import type { VAvatarProps } from "/@src/components/base/avatar/VAvatar.vue";
import * as listData from "/@src/data/layouts/flex-list-v1";

export interface UserData extends VAvatarProps {
  id: number;
  username: string;
  position: string;
  picture: string;
  badge: string;
  location: string;
  industry: string;
  status: string;
  contacts: VAvatarProps[];
}

interface leadsList {
  id: string;
  title: string;
  zipCode: string;
  address: string;
  createdAt: string;
  endDate: string;
  createdBy: object;
  manager: object;
  status: string;
  proposalsCount: number;
}

const page = ref(42);
const filters = ref("");
const openLeadModal = ref(false);
const users = listData.users as UserData[];

const columns = {
  username: {
    label: "Contractor",
    grow: true,
  },
  location: {
    label: "Job",
    grow: true,
  },
  contacts: "Date Created",
  status: "Status",
  industry: "Manager",
  actions: {
    label: "Actions",
    align: "end",
  },
} as const;

const filteredData = computed(() => {
  if (!filters.value) {
    return users;
  } else {
    const filterRe = new RegExp(filters.value, "i");
    return users.filter((item) => {
      return (
        item.username.match(filterRe) ||
        item.position.match(filterRe) ||
        item.industry.match(filterRe) ||
        item.status.match(filterRe) ||
        item.location.match(filterRe)
      );
    });
  }
});
</script>

<template>
  <div>
    <div class="list-flex-toolbar flex-list-v1">
      <VField>
        <VControl icon="feather:search">
          <input
            v-model="filters"
            class="input custom-text-filter"
            placeholder="Search..."
          />
        </VControl>
      </VField>

      <VButtons>
        <VButton
          @click="openLeadModal = !openLeadModal"
          color="primary"
          icon="fas fa-plus"
          elevated
        >
          Lead Opportunity
        </VButton>
      </VButtons>
    </div>

    <div class="page-content-inner">
      <div class="flex-list-wrapper flex-list-v1">
        <!--List Empty Search Placeholder -->
        <VPlaceholderPage
          v-if="!filteredData.length"
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
          compact
        >
          <template #body>
            <TransitionGroup name="list" tag="div" class="flex-list-inner">
              <div
                v-for="item in filteredData"
                :key="item.id"
                class="flex-table-item"
              >
                <VFlexTableCell :column="{ media: true, grow: true }">
                  <div>
                    <span class="item-name">Contractor Name</span>
                    <span class="item-meta">
                      <span>contractor@gmail.com</span>
                    </span>
                  </div>
                </VFlexTableCell>

                <VFlexTableCell
                  :column="{ media: true, grow: true }"
                  data-th="Label"
                >
                  <!-- <VAvatar
                    :picture="item.picture"
                    :badge="item.badge"
                    :color="item.color"
                    :initials="item.initials"
                    size="medium"
                  /> -->
                  <div>
                    <span class="item-name dark-inverted"
                      >Davidson Builders - Krugar</span
                    >
                    <span class="item-meta">
                      <span>6919 S Columbine Road, Evergreen CO</span>
                    </span>
                  </div>
                </VFlexTableCell>
                <VFlexTableCell>
                  <span>24 Jan, 2025</span>
                </VFlexTableCell>

                <VFlexTableCell>
                  <VTag v-if="item.status === 'Online'" color="success" rounded>
                    {{ item.status }}
                  </VTag>
                  <VTag v-if="item.status === 'Working'" color="info" rounded>
                    {{ item.status }}
                  </VTag>
                  <VTag
                    v-if="item.status === 'Suspended'"
                    color="danger"
                    rounded
                  >
                    {{ item.status }}
                  </VTag>
                  <VTag v-if="item.status === 'Offline'" rounded>
                    {{ item.status }}
                  </VTag>
                </VFlexTableCell>

                <VFlexTableCell :column="{ media: true }">
                  <div>
                    <span class="item-name">Manager Name</span>
                    <span class="item-meta">
                      <span>manager@gmail.com</span>
                    </span>
                  </div>
                </VFlexTableCell>

                <VFlexTableCell :column="{ align: 'end' }">
                  <FlexTableDropdown />
                </VFlexTableCell>
              </div>
            </TransitionGroup>
          </template>
        </VFlexTable>

        <!--Table Pagination-->
        <VFlexPagination
          v-if="filteredData.length > 5"
          v-model:current-page="page"
          :item-per-page="10"
          :total-items="80"
          :max-links-displayed="7"
          no-router
        />
      </div>
    </div>
  </div>
  <LeadAddUpdateModal
    v-if="openLeadModal"
    :add-update-lead-modal="openLeadModal"
    @update:modal-handler="openLeadModal = false"
  />
</template>

<style lang="scss">
.flex-table .flex-table-item {
  min-height: 48px !important;
}
.has-top-nav {
  .flex-list-wrapper,
  .list-flex-toolbar {
    max-width: 100%;
    margin-inline-end: auto;
    margin-inline-start: auto;
  }
}
</style>
