<script setup lang="ts">
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { ref, computed, onMounted } from "vue";

const notyf = useNotyf();
const loading = ref(false);
const tab = ref("Items list");
const costCodeItemsList = ref([]);
const api = useApi();
const filters = ref("");
const openTradeModal = ref(false);
const selectedTrade = ref(null);

const getCostCodesItems = async () => {
  try {
    loading.value = true;
    const response = await api.get(`/api/cost-trade/`);
    costCodeItemsList.value = response.data;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const deleteTrade = async (id) => {
  try {
    await api.delete(`/api/cost-trade/${id}/`);
    notyf.success("Trade deleted successfully");
    getCostCodesItems();
  } catch (err) {
    console.log(err);
    notyf.error("Failed to delete trade");
  }
};

const openTradeModalHandler = (trade = null) => {
  selectedTrade.value = trade;
  openTradeModal.value = true;
};

const filteredData = computed(() => {
  if (!filters.value) {
    return costCodeItemsList.value;
  } else {
    const filterRe = new RegExp(filters.value, "i");
    return costCodeItemsList.value.filter((item) => item.name?.match(filterRe));
  }
});

onMounted(() => {
  getCostCodesItems();
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
          @click="openTradeModalHandler()"
          color="warning"
          icon="fas fa-plus"
          outlined
          size="small"
          raised
        >
          Trade
        </VButton>
      </VButtons>
    </div>
    <div v-if="loading" class="columns is-multiline">
      <div class="column is-12">
        <VPlaceload
          v-for="item in 20"
          height="40px"
          width="100%"
          class="my-2"
        />
      </div>
    </div>
    <div v-else class="page-content-inner">
      <VPlaceholderPage
        v-if="!filteredData.length"
        title="No matching results found."
        subtitle="Try different search terms or criteria."
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

      <table class="table is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Children</th>
            <th class="is-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="item in filteredData" :key="item.id">
            <tr>
              <td>{{ item.name ?? "n/a" }}</td>
              <td>{{ item.description || "No description" }}</td>
              <td>{{ item.codes?.length || 0 }}</td>
              <td class="is-end">
                <div class="is-flex is-justify-content-flex-end">
                  <VIconWrap
                    @click="openTradeModalHandler(item)"
                    icon="lucide:pen"
                    color="warning"
                    has-background
                    dark-card-bordered
                  />
                  <VIconWrap
                    icon="lucide:trash"
                    color="danger"
                    class="ml-1"
                    dark-card-bordered
                    has-background
                    @click="deleteTrade(item.id)"
                  />
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <TradeTypeModal
      v-if="openTradeModal"
      :openTradeModal="openTradeModal"
      :trade="selectedTrade"
      @update:modal-handler="openTradeModal = false"
      @update:OnSuccess="getCostCodesItems"
    />
  </div>
</template>
<style lang="scss" scoped>
.has-top-nav {
  .flex-list-wrapper,
  .list-flex-toolbar {
    width: 100%;
    // margin-inline-end: auto;
    // margin-inline-start: auto;
  }
}

.cost-codes-container {
  width: 100%;
  margin: auto;
}

/* Header styles */
.cost-codes-header {
  width: 100%;
  display: grid;
  grid-template-columns: 2fr 3fr 2fr 1fr;
  background: var(--primary);
  color: white;
  padding: 10px;
  font-weight: bold;
  border-radius: 5px;
}
.col-title {
  :nth-child(2) {
    font-weight: 600;
  }
}

/* List styles */
.cost-codes-list {
  list-style: none;
  padding: 0;
}

.cost-code-item,
.sub-item,
.child-item {
  border-bottom: 1px solid #ddd;
  padding: 10px;
}

.cost-code-row {
  width: 100%;
  display: grid;
  grid-template-columns: 2fr 3fr 2fr 1fr;
  align-items: center;
}

.cost-code-row span {
  padding: 5px 10px;
}

/* Nested lists */
.sub-list,
.child-list {
  list-style: none;
  margin-left: 10px;
  padding-left: 5px;
  border-left: 2px solid #ccc;
}

/* Buttons */
.col-actions {
  display: flex;
  gap: 5px;
}

.edit-btn,
.delete-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 16px;
}

.edit-btn {
  color: #4caf50;
}

.delete-btn {
  color: #f44336;
}
</style>
