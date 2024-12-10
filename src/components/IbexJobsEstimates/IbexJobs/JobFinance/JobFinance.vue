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
const router = useRouter();
const tab = ref("estimate");
const props = withDefaults(
  defineProps<{
    activeTab?: "active" | "closed";
  }>(),
  {
    activeTab: "active",
  }
);

const filters = ref("");

const columns = {
  picture: {
    label: "Project",
    grow: true,
    media: true,
  },
  customer: "Customer",
  industry: "Industry",
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
  <div class="columns is-multiline">
    <div class="column is-12">
      <div class="toolbar">
        <div class="tabs-inner">
          <div class="tabs">
            <ul>
              <li :class="[tab === 'estimate' && 'is-active']">
                <a
                  tabindex="0"
                  role="button"
                  @keydown.space.prevent="tab = 'estimate'"
                  @click="tab = 'estimate'"
                  ><span>Estimate</span></a
                >
              </li>
              <li :class="[tab === 'budget' && 'is-active']">
                <a
                  tabindex="0"
                  role="button"
                  @keydown.space.prevent="tab = 'budget'"
                  @click="tab = 'budget'"
                  ><span>Budget</span></a
                >
              </li>
              <li :class="[tab === 'invoice' && 'is-active']">
                <a
                  tabindex="0"
                  role="button"
                  @keydown.space.prevent="tab = 'invoice'"
                  @click="tab = 'invoice'"
                  ><span>Owner Invoice</span></a
                >
              </li>

              <li class="tab-naver" />
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div v-if="tab === 'estimate'" class="column is-12">
      <JobEstimates />
    </div>
    <div v-if="tab === 'budget'" class="column is-12"></div>
    <div v-if="tab === 'invoice'" class="column is-12">
      <JobInvoice />
    </div>
  </div>
</template>
