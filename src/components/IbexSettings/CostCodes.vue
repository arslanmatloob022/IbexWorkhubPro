<script setup lang="ts">
import { useApi } from "/@src/composable/useAPI";
import { formatDate } from "/@src/composable/useSupportElement";
// import notyf from "/@src/plugins/notyf";
import { useNotyf } from "/@src/composable/useNotyf";

const notyf = useNotyf();
const loading = ref(false);
const tab = ref("Items list");
const costCodeItemsList = ref([
  {
    id: "c1383c64-008b-4e70-8e63-58f129eec320",
    name: "CAT-0001",
    description: "string",
    created_at: "2025-02-02T06:20:48.540838Z",
    updated_at: "2025-02-02T06:20:48.540871Z",
    trade: null,
    codes: [
      {
        id: "eb9f4bf2-e90d-4a23-83fd-b32d92ea32f3",
        name: "Test under 001",
        description: "",
        is_labour_code: false,
        labour_cost: 0.0,
        unit_cost: 1200.0,
        is_active: true,
        created_at: "2025-02-02T20:01:14.844462Z",
        updated_at: "2025-02-02T20:01:14.844480Z",
        category: "c1383c64-008b-4e70-8e63-58f129eec320",
        parent_code: null,
        child_codes: [
          {
            id: "b8cc78ba-30cb-41cd-890d-4dd9af170721",
            name: "tes under 00101",
            description: "",
            is_labour_code: true,
            labour_cost: 120.0,
            unit_cost: 0.0,
            is_active: true,
            created_at: "2025-02-02T20:02:35.921742Z",
            updated_at: "2025-02-02T20:02:35.921757Z",
            category: "c1383c64-008b-4e70-8e63-58f129eec320",
            parent_code: "eb9f4bf2-e90d-4a23-83fd-b32d92ea32f3",
          },
        ],
      },
    ],
  },
]);
const api = useApi();
const filters = ref("");

const users = [{}];
const openCostCodeModal = ref(false);
const openCategoryModal = ref(false);
const openTradeModal = ref(false);
const currentSelectedId = ref("");

const deleteCostCode = async (id: any) => {
  try {
    loading.value = true;
    const response = await api.delete(`/api/cost-code/${id}/`);
    getCostCodesItems();
    notyf.success("delete cost code");
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};
const getCostCodesItems = async () => {
  try {
    loading.value = true;
    const response = await api.get(`/api/cost-code/`);
    costCodeItemsList.value = response.data;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const openCostCodeModalHandler = (id: any) => {
  currentSelectedId.value = id;
  openCostCodeModal.value = !openCostCodeModal.value;
};

const filteredData = computed(() => {
  if (!filters.value) {
    return users;
  } else {
    const filterRe = new RegExp(filters.value, "i");
    return users.filter((item) => {
      return item.username?.match(filterRe) || item.location?.match(filterRe);
    });
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
          color="primary"
          @click="openCostCodeModal = !openCostCodeModal"
          icon="fas fa-plus"
          raised
          size="small"
          outlined
        >
          Cost Code
        </VButton>
      </VButtons>
    </div>

    <div class="page-content-inner">
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

      <table class="table is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th scope="col">Title</th>
            <th scope="col">Description</th>
            <th scope="col">Children</th>
            <th scope="col" class="is-end">
              <div class="dark-inverted is-flex is-justify-content-flex-end">
                Actions
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- Main List -->
          <template v-for="code in costCodeItemsList" :key="code.id">
            <tr class="sub-item">
              <td class="pl-5">
                <p class="dark-text text-primary">
                  {{ code.name }}
                </p>
              </td>
              <td>{{ code.description || "No description" }}</td>
              <td>{{ code.child_codes?.length || 0 }}</td>
              <td class="is-end">
                <div class="is-flex is-justify-content-flex-end">
                  <VIconWrap
                    @click="openCostCodeModalHandler(code.id)"
                    icon="lucide:pen"
                    color="warning"
                    dark-card-bordered
                  />

                  <VIconWrap
                    icon="lucide:trash"
                    color="info"
                    class="ml-1"
                    dark-card-bordered
                    @click="deleteCostCode(code.id)"
                  />
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <CostCodeModal
      v-if="openCostCodeModal"
      :addUpdateCostCodeModal="openCostCodeModal"
      :cost-code-id="currentSelectedId"
      @update:modal-handler="openCostCodeModal = false"
      @update:OnSuccess="getCostCodesItems()"
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
