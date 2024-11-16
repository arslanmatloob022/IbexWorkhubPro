<script setup lang="ts">
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

const props = withDefaults(
  defineProps<{
    tasks?: object;
  }>(),
  {
    tasks: {},
  }
);

const filters = ref("");
const tab = ref("active");

const columns = {
  picture: {
    label: "Task",
    media: true,
    grow: true,
  },
  customer: "Start ",
  industry: "End",
  status: "Quantity",
  team: {
    label: "Unit",
    cellClass: "h-hidden-tablet-p",
  },
  actions: {
    label: "Cost code",
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
    <div class="flex-list-wrapper flex-list-v2">
      <!--List Empty Search Placeholder -->
      <VPlaceholderPage
        v-if="tab === 'active' && filteredData.length === 0"
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

      <!--Active Tab-->
      <div v-if="tab === 'active'" class="tab-content is-active">
        <VFlexTable
          v-if="props.tasks"
          :data="filteredData"
          :columns="columns"
          rounded
        >
          <template #body>
            <TransitionGroup name="list" tag="div" class="flex-list-inner">
              <!--Table item-->
              <div
                v-for="item in props.tasks"
                :key="item.id"
                class="flex-table-item"
              >
                <VFlexTableCell :column="{ media: true, grow: true }">
                  <!-- <VAvatar :picture="item.picture" /> -->
                  <div>
                    <span class="item-name dark-inverted">
                      {{ item.title ? item.title : "" }}</span
                    >
                    <span class="item-meta">
                      <Tippy trigger="click">
                        <span class="link-text">
                          {{
                            item.description?.length > 40
                              ? item.description?.slice(0, 40)
                              : item.description.length < 40
                              ? item.description
                              : ""
                          }}</span
                        >
                        <template #content>
                          {{ item.description ? item.description : "" }}
                        </template>
                      </Tippy>
                    </span>
                  </div>
                </VFlexTableCell>
                <VFlexTableCell>
                  <span class="light-text">{{
                    item.startDate ? item.startDate : ""
                  }}</span>
                </VFlexTableCell>
                <VFlexTableCell>
                  <span class="light-text">{{
                    item.endDate ? item.endDate : ""
                  }}</span>
                </VFlexTableCell>
                <VFlexTableCell>
                  <VTag outlined color="info" rounded>
                    {{ item.quantity ? item.quantity : "" }}
                  </VTag>
                </VFlexTableCell>
                <VFlexTableCell class="h-hidden-tablet-p">
                  <VTag outlined color="primary" rounded>
                    {{ item.unit ? item.unit : "N/A" }}
                  </VTag>
                  <!-- <VAvatarStack
                    :avatars="item.team"
                    size="small"
                    :limit="3"
                    class="is-pushed-mobile"
                  /> -->
                </VFlexTableCell>
                <VFlexTableCell :column="{ align: 'end' }">
                  <!-- <ProjectListDropdown /> -->
                  <VTag outlined color="warning" rounded>
                    {{ item.costCode ? item.costCode : "" }}
                  </VTag>
                </VFlexTableCell>
              </div>
            </TransitionGroup>
          </template>
        </VFlexTable>
      </div>

      <!--inactive Tab-->
      <div v-else-if="tab === 'closed'" class="tab-content is-active">
        <!--Empty placeholder-->
        <VPlaceholderPage
          title="No closed projects."
          subtitle="Looks like you don't have any closed project yet. When you'll
              start closing off projects, they will be showing up in here."
        >
          <template #image>
            <img
              class="light-image is-larger"
              src="/@src/assets/illustrations/placeholders/projects.svg"
              alt=""
            />
            <img
              class="dark-image is-larger"
              src="/@src/assets/illustrations/placeholders/projects-dark.svg"
              alt=""
            />
          </template>
        </VPlaceholderPage>
      </div>
    </div>
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
