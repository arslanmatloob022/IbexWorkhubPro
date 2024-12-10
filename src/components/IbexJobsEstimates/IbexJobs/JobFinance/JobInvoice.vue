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
  <table class="table is-striped is-fullwidth">
    <thead>
      <tr>
        <th scope="col">Job</th>
        <th scope="col">ID</th>
        <th scope="col">Title</th>
        <th scope="col">Status</th>
        <th scope="col">Total Price</th>
        <th scope="col">Total Tax</th>
        <th scope="col">Amount Paid</th>
        <th scope="col">Balance</th>
        <th scope="col">Deadline</th>
        <th scope="col">Date Paid</th>
        <th scope="col">Files</th>
        <th scope="col" class="is-end">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Tina</td>
        <td>Bergmann</td>
        <td>Sales</td>
        <td>Tina</td>
        <td>Bergmann</td>
        <td>Sales</td>
        <td>Tina</td>
        <td>Bergmann</td>
        <td>Sales</td>
        <td>Bergmann</td>
        <td>Sales</td>
        <td class="is-end">
          <div class="is-flex is-justify-content-flex-end">
            <FlexTableDropdown />
          </div>
        </td>
      </tr>
      <tr>
        <td>Tina</td>
        <td>Bergmann</td>
        <td>Sales</td>
        <td>Tina</td>
        <td>Bergmann</td>
        <td>Sales</td>
        <td>Tina</td>
        <td>Bergmann</td>
        <td>Sales</td>
        <td>Bergmann</td>
        <td>Sales</td>
        <td class="is-end">
          <div class="is-flex is-justify-content-flex-end">
            <FlexTableDropdown />
          </div>
        </td>
      </tr>
      <tr>
        <td>Tina</td>
        <td>Bergmann</td>
        <td>Sales</td>
        <td>Tina</td>
        <td>Bergmann</td>
        <td>Sales</td>
        <td>Tina</td>
        <td>Bergmann</td>
        <td>Sales</td>
        <td>Bergmann</td>
        <td>Sales</td>
        <td class="is-end">
          <div class="is-flex is-justify-content-flex-end">
            <FlexTableDropdown />
          </div>
        </td>
      </tr>
      <tr>
        <td>Tina</td>
        <td>Bergmann</td>
        <td>Sales</td>
        <td>Tina</td>
        <td>Bergmann</td>
        <td>Sales</td>
        <td>Tina</td>
        <td>Bergmann</td>
        <td>Sales</td>
        <td>Bergmann</td>
        <td>Sales</td>
        <td class="is-end">
          <div class="is-flex is-justify-content-flex-end">
            <FlexTableDropdown />
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>
