<script setup lang="ts">
import { useApi } from "/@src/composable/useAPI";
const loading = ref(false);
const costCodeItemsList = ref([]);
const api = useApi();
const filters = ref("");
const columns = {
  username: {
    label: "User",
    grow: true,
    media: true,
  },
  location: "Location",
  industry: "Industry",
  status: "Status",
  contacts: "Relations",
  actions: {
    label: "Actions",
    align: "end",
  },
} as const;
const users = [{}];
const openCostCodeModal = ref(false);
const openCategoryModal = ref(false);
const openTradeModal = ref(false);

const getCostCodesItems = async () => {
  try {
    loading.value = true;
    const response = await api.get(`/api/cost-category/list/`);
    costCodeItemsList.value = response.data;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
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
          elevated
          outlined
        >
          Cost Code
        </VButton>
        <VButton
          @click="openCategoryModal = !openCategoryModal"
          color="info"
          icon="fas fa-plus"
          elevated
          outlined
        >
          Category
        </VButton>
        <VButton
          @click="openTradeModal = !openTradeModal"
          color="warning"
          icon="fas fa-plus"
          outlined
          elevated
        >
          Trade
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

        <div class="cost-codes">
          <ul>
            <li v-for="item in costCodeItemsList" :key="item.id">
              <span>{{ item.name ?? "n/a" }}</span>
              <ul v-if="item.codes?.length">
                <li v-for="code in item.codes">
                  <span>{{ code.name }}</span>
                  <ul v-if="code.child_codes?.length">
                    <li v-for="child in code.child_codes">
                      <span>{{ child.name }}</span>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <CostCodeModal
      v-if="openCostCodeModal"
      :addUpdateCostCodeModal="openCostCodeModal"
      @update:modal-handler="openCostCodeModal = false"
      @update:on-success="getCostCodesItems()"
    />
    <CodeCategoryModal
      v-if="openCategoryModal"
      :addUpdateCategoryModal="openCategoryModal"
      @update:modal-handler="openCategoryModal = false"
      @update:on-success="getCostCodesItems()"
    />
    <TradeTypeModal
      v-if="openTradeModal"
      :addUpdateTradeModal="openTradeModal"
      @update:modal-handler="openTradeModal = false"
      @update:on-success="getCostCodesItems()"
    />
  </div>
</template>

<style lang="scss">
.has-top-nav {
  .flex-list-wrapper,
  .list-flex-toolbar {
    width: 100%;
    margin-inline-end: auto;
    margin-inline-start: auto;
  }
}

.cost-codes {
  ul {
    list-style-type: none;
    padding-left: 20px;

    li {
      margin: 5px 0;

      span {
        font-weight: bold;
      }

      ul {
        margin-top: 5px;
        padding-left: 20px;

        li {
          span {
            font-weight: normal;
          }
        }
      }
    }
  }
}
</style>
