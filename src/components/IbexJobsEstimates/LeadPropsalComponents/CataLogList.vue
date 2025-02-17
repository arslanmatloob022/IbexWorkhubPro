<script setup lang="ts">
import type { VAvatarProps } from "/@src/components/base/avatar/VAvatar.vue";
import * as listData from "/@src/data/layouts/flex-list-v2";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import {
  formatDate,
  formatDateTime,
  formatTime,
} from "/@src/composable/useSupportElement";
import {
  getProposalStatusColor,
  getProposalStatusName,
  getProposalTypeColor,
  getProposalTypeName,
} from "../estimatesScripts";
const router = useRouter();
const route = useRoute();
const api = useApi();
const notyf = useNotyf();
const filters = ref("");

const catalogs = ref<any>([]);
const proposalsList = ref<any[]>([]); // Fetch if needed

const columns = [
  { label: "Title", key: "title" },
  { label: "Unit", key: "unit" },
  { label: "Total Price", key: "total_price" },
  { label: "Cost Type", key: "cost_type" },
  { label: "Actions", key: "actions" },
];

const fetchCatalogs = async () => {
  try {
    const response = await api.get("/api/cost/catalogs/");
    catalogs.value = response.data;
  } catch (error) {
    console.error("Error fetching catalogs:", error);
  }
};

const deleteCatalog = async (id: string) => {
  try {
    await api.delete(`/api/cost/${id}/`);
    catalogs.value = catalogs.value.filter((item) => item.id !== id);
  } catch (error) {
    console.error("Error deleting catalog:", error);
  }
};

const filteredData = computed(() => {
  return catalogs.value.filter((item) =>
    item.title.toLowerCase().includes(filters.value.toLowerCase())
  );
});
onMounted(fetchCatalogs);
</script>

<template>
  <div class="is-flex" style="justify-content: end">
    <VControl icon="feather:search">
      <input
        v-model="filters"
        class="input custom-text-filter"
        placeholder="Search..."
      />
    </VControl>
  </div>
  <VFlexTable
    class="mt-5"
    v-if="filteredData.length > 0"
    :data="filteredData"
    :columns="columns"
    rounded
  >
    <template #body>
      <TransitionGroup name="list" tag="div" class="flex-list-inner">
        <div
          v-for="item in filteredData"
          :key="item.id"
          class="flex-table-item"
        >
          <VFlexTableCell
            :column="{ media: true, grow: false }"
            class="cu-pointer"
          >
            <div>
              <span class="item-name dark-inverted">{{ item.title }}</span>
            </div>
          </VFlexTableCell>
          <VFlexTableCell>
            <span class="light-text">{{ item.unit }}</span>
          </VFlexTableCell>
          <VFlexTableCell>
            <span class="light-text">{{ item.total_price }}</span>
          </VFlexTableCell>
          <VFlexTableCell>
            <span class="light-text">{{ item.cost_type }}</span>
          </VFlexTableCell>
          <VFlexTableCell>
            <VButton color="danger" size="small" @click="deleteCatalog(item.id)"
              >Delete</VButton
            >
          </VFlexTableCell>
        </div>
      </TransitionGroup>
    </template>
  </VFlexTable>
</template>
