<script setup lang="ts">
import { useApi } from "/@src/composable/useAPI";

const emits = defineEmits<{
  (e: "select-module", value: any): string;
}>();

const api = useApi();
const filters = ref("");
const selectedModule = ref("");
const loading = ref(false);
const appModulesList = ref([
  {
    id: "1c84ef34-8149-40c3-81ba-0b6625bebfee",
    title: "Test Module",
    value: "test_module",
    description: "string",
  },
]);
const openModuleModal = ref(false);
const filteredData = computed(() => {
  if (!filters.value) {
    return appModulesList.value;
  } else {
    return appModulesList.value.filter((item) => {
      return (
        item.title.match(new RegExp(filters.value, "i")) ||
        item.description.match(new RegExp(filters.value, "i"))
      );
    });
  }
});

const openModuleModalHandler = (module: any = "") => {
  selectedModule.value = module;
  openModuleModal.value = !openModuleModal.value;
};

const getModulesListHandler = async () => {
  try {
    loading.value = true;
    const resp = await api.get("/api/app-modules/");
    appModulesList.value = resp.data;
  } catch (Error) {
    console.log(Error);
  } finally {
    loading.value = false;
  }
};

const selectedModuleId = ref("");

const selectModule = (module: any) => {
  selectedModuleId.value = module;
  emits("select-module", module);
};

onMounted(() => {
  getModulesListHandler();
});
</script>

<template>
  <div>
    <div class="tile-grid-toolbar">
      <VControl icon="feather:search">
        <input
          v-model="filters"
          class="input custom-text-filter"
          placeholder="Search..."
        />
      </VControl>

      <div class="buttons">
        <VButton
          @click="openModuleModalHandler('')"
          outlined
          light
          color="info"
          raised
        >
          <span class="icon">
            <i aria-hidden="true" class="fas fa-plus" />
          </span>
          <span>Module</span>
        </VButton>
      </div>
    </div>

    <div class="tile-grid tile-grid-v1">
      <!--List Empty Search Placeholder -->
      <VPlaceholderPage
        :class="[filteredData.length !== 0 && 'is-hidden']"
        title="We couldn't find any matching results."
        subtitle="Too bad. Looks like we couldn't find any matching results for the
          search terms you've entered. Please try different search terms or
          criteria."
        larger
      >
        <template #image>
          <img
            class="light-image"
            src="/@src/assets/illustrations/placeholders/search-6.svg"
            alt=""
          />
          <img
            class="dark-image"
            src="/@src/assets/illustrations/placeholders/search-6-dark.svg"
            alt=""
          />
        </template>
      </VPlaceholderPage>

      <!--Tile Grid v1-->
      <TransitionGroup name="list" tag="div" class="columns is-multiline">
        <!--Grid item-->
        <div
          v-for="(item, key) in filteredData"
          :key="key"
          class="column is-12"
        >
          <div
            class="tile-grid-item cu-pointer"
            :class="selectedModuleId === item.id ? 'active-card' : ''"
            @click="selectModule(item.id)"
          >
            <div class="tile-grid-item-inner">
              <div class="meta">
                <span class="dark-inverted">{{ item.title }}</span>
                <span>{{ item.description }}</span>
              </div>
              <UserCardDropdown />
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
    <AddUpdateModuleModal
      v-if="openModuleModal"
      :open-app-module-modal="openModuleModal"
      :module-id="selectedModule"
      @close:modal-handler="openModuleModal = false"
      @update:OnSuccess="getModulesListHandler"
    />
  </div>
</template>

<style lang="scss" scoped>
@import "/@src/scss/abstracts/all";

.active-card {
  background-color: #ebf8ff !important;
  border-color: var(--info) !important;
}

.tile-grid {
  .columns {
    margin-inline-start: -0.5rem !important;
    margin-inline-end: -0.5rem !important;
    margin-top: -0.5rem !important;
  }

  .column {
    padding: 0.1rem !important;
  }
}

.is-dark {
  .tile-grid {
    .tile-grid-item {
      @include vuero-card--dark;
    }
  }
}

.tile-grid-v1 {
  .tile-grid-item {
    @include vuero-s-card;

    border-radius: 14px;
    padding: 12px;

    .tile-grid-item-inner {
      display: flex;
      align-items: center;

      .meta {
        margin-inline-start: 10px;
        line-height: 1.2;

        span {
          display: block;
          font-family: var(--font);

          &:first-child {
            color: var(--dark-text);
            font-family: var(--font-alt);
            font-weight: 600;
            font-size: 1rem;
          }

          &:nth-child(2) {
            color: var(--light-text);
            font-size: 0.9rem;
          }
        }
      }

      .dropdown {
        position: relative;
        margin-inline-start: auto;
      }
    }
  }
}
</style>
