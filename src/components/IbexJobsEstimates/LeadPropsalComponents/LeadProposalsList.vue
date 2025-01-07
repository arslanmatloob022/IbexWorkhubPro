<script setup lang="ts">
import DraggableItem from "../../CommonComponents/Draggable/DraggableItem.vue";
import type { VAvatarProps } from "/@src/components/base/avatar/VAvatar.vue";
import * as listData from "/@src/data/layouts/flex-list-v2";

export interface ProjectData {
  id: number;
  name: string;
  customer: string;
  duration: string;
  picture: string;
  industry: string;
  status: string;
  team: VAvatarProps[];
}

const projects = listData.projects as ProjectData[];
const openLeadProposalModal = ref(false);
const props = withDefaults(
  defineProps<{
    activeTab?: "active" | "closed";
  }>(),
  {
    activeTab: "active",
  }
);

const filters = ref("");
const tab = ref(props.activeTab);

const columns = {
  picture: {
    label: "Proposal",
    grow: true,
    media: true,
  },
  customer: "Client",
  industry: "Lead",
  status: "Status",
  team: {
    label: "Team",
    cellClass: "h-hidden-tablet-p",
  },
  actions: {
    label: "Actions",
    align: "end",
  },
} as const;

const filteredData = computed(() => {
  if (!filters.value) {
    return projects;
  } else {
    const filterRe = new RegExp(filters.value, "i");

    return projects.filter((item) => {
      return (
        item.name.match(filterRe) ||
        item.customer.match(filterRe) ||
        item.industry.match(filterRe) ||
        item.status.match(filterRe) ||
        item.duration.match(filterRe)
      );
    });
  }
});
</script>

<template>
  <div>
    <!-- <DraggableItem /> -->
    <div class="flex-toolbar is-reversed is-flex space-between my-4">
      <VControl icon="feather:search">
        <input
          v-model="filters"
          class="input custom-text-filter"
          placeholder="Search..."
        />
      </VControl>

      <div>
        <VButton
          color="primary"
          @click="openLeadProposalModal = !openLeadProposalModal"
          icon="fas fa-plus"
          >Lead Proposal</VButton
        >
      </div>
    </div>

    <div class="flex-list-wrapper flex-list-v2">
      <!--List Empty Search Placeholder -->
      <VPlaceholderPage
        v-if="filteredData.length === 0"
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
          <TransitionGroup name="list" tag="div" class="flex-list-inner">
            <!--Table item-->
            <div
              v-for="item in filteredData"
              :key="item.id"
              class="flex-table-item"
            >
              <VFlexTableCell :column="{ media: true, grow: true }">
                <VAvatar :picture="item.picture" />
                <div>
                  <span class="item-name dark-inverted">{{ item.name }}</span>
                  <span class="item-meta">
                    <span>
                      <i
                        aria-hidden="true"
                        class="iconify"
                        data-icon="feather:clock"
                      />{{ item.duration }}</span
                    >
                  </span>
                </div>
              </VFlexTableCell>
              <VFlexTableCell>
                <span class="light-text">{{ item.customer }}</span>
              </VFlexTableCell>
              <VFlexTableCell>
                <span class="light-text">{{ item.industry }}</span>
              </VFlexTableCell>
              <VFlexTableCell>
                <VTag rounded>
                  {{ item.status }}
                </VTag>
              </VFlexTableCell>
              <VFlexTableCell class="h-hidden-tablet-p">
                <VAvatarStack
                  :avatars="item.team"
                  size="small"
                  :limit="3"
                  class="is-pushed-mobile"
                />
              </VFlexTableCell>
              <VFlexTableCell :column="{ align: 'end' }">
                <ProjectListDropdown />
              </VFlexTableCell>
            </div>
          </TransitionGroup>
        </template>
      </VFlexTable>

      <!--Table Pagination-->
      <VFlexPagination
        v-if="filteredData.length > 5"
        :item-per-page="10"
        :total-items="873"
        :current-page="42"
        :max-links-displayed="7"
      />
    </div>
    <LeadProposalModal
      v-if="openLeadProposalModal"
      :leadProposalModal="openLeadProposalModal"
      @update:modal-handler="openLeadProposalModal = false"
    />
  </div>
</template>

<style lang="scss">
.has-top-nav {
  .flex-list-wrapper,
  .list-flex-toolbar {
    max-width: 880px;
    margin-inline-end: auto;
    margin-inline-start: auto;
  }
}
</style>
