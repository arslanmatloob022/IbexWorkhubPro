<script setup lang="ts">
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";

const notyf = useNotyf();
const loading = ref(false);
const api = useApi();
const filters = ref("");
const openCostTypeModal = ref(false);
const currentSelectedId = ref("");
const costTypeList = ref([
  {
    id: "",
    title: "",
    value: "",
    description: "",
    is_active: true,
    created_at: "",
    updated_at: "",
  },
]);

const deleteCostType = async (id: any) => {
  try {
    loading.value = true;
    const response = await api.delete(`/api/cost-types/${id}/`);
    getCostTypes();
    notyf.success("Cost deleted successfully");
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};
const getCostTypes = async () => {
  try {
    loading.value = true;
    const response = await api.get(`/api/cost-types/`);
    costTypeList.value = response.data;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const openCostTypeModalHandler = (id: any = "") => {
  currentSelectedId.value = id;
  openCostTypeModal.value = !openCostTypeModal.value;
};

const filteredData = computed(() => {
  if (!filters.value) {
    return costTypeList.value;
  } else {
    const filterRe = new RegExp(filters.value, "i");
    return costTypeList.value.filter((item) => {
      return item.title?.match(filterRe) || item.value?.match(filterRe);
    });
  }
});
onMounted(() => {
  getCostTypes();
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
          @click="openCostTypeModalHandler('')"
          icon="fas fa-plus"
          raised
          size="small"
          outlined
        >
          Cost Type
        </VButton>
      </VButtons>
    </div>

    <div class="tile-grid tile-grid-v1">
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
      <TransitionGroup name="slide-x" tag="div" class="columns is-multiline">
        <!--Grid item-->
        <div v-for="(item, key) in filteredData" :key="key" class="column is-4">
          <div class="tile-grid-item">
            <div class="tile-grid-item-inner">
              <div class="meta">
                <span class="dark-inverted">{{ item.title }}</span>
                <span>{{ item.value }}</span>
              </div>
              <VDropdown icon="feather:more-vertical" spaced right>
                <template #content>
                  <a
                    @click="openCostTypeModalHandler(item.id)"
                    role="menuitem"
                    class="dropdown-item is-media"
                  >
                    <div class="icon">
                      <i aria-hidden="true" class="lnil lnil-lock" />
                    </div>
                    <div class="meta">
                      <span>Edit</span>
                      <span>Edit unit</span>
                    </div>
                  </a>

                  <hr class="dropdown-divider" />

                  <a
                    @click="deleteCostType(item.id)"
                    role="menuitem"
                    class="dropdown-item is-media"
                  >
                    <div class="icon">
                      <i aria-hidden="true" class="lnil lnil-trash-can-alt" />
                    </div>
                    <div class="meta">
                      <span>Remove</span>
                      <span>Remove from grid</span>
                    </div>
                  </a>
                </template>
              </VDropdown>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
    <AddCostTypeModal
      v-if="openCostTypeModal"
      :add-update-cost-type="openCostTypeModal"
      :typeId="currentSelectedId"
      @update:modalHandler="
        openCostTypeModal = false;
        currentSelectedId = '';
      "
      @update:OnSuccess="getCostTypes()"
    />
  </div>
</template>

<style lang="scss">
@import "/@src/scss/abstracts/all";

.tile-grid {
  .columns {
    margin-inline-start: -0.5rem !important;
    margin-inline-end: -0.5rem !important;
    margin-top: -0.5rem !important;
  }

  .column {
    padding: 0.5rem !important;
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
    padding: 16px;

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
