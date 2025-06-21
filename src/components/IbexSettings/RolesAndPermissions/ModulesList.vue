<script setup lang="ts">
import { useApi } from "/@src/composable/useAPI";

const emits = defineEmits<{
  (e: "select-module", value: any): string;
}>();

const api = useApi();
const filters = ref("");
const selectedModule = ref("");
const loading = ref(false);
const selectedModuleId = ref("");
const selectedModuleToDelete = ref("");
const openModuleModal = ref(false);

const appModulesList = ref([
  {
    id: "1c84ef34-8149-40c3-81ba-0b6625bebfee",
    name: "Test Module",
    value: "test_module",
    description: "string",
  },
]);

const SweetAlertProps = ref({
  title: "Delete Module",
  subtitle: "Are you sure you want to delete this module?",
  icon: "fas fa-bell",
  btntext: "Delete",
  isSweetAlertOpen: false,
});

const filteredData = computed(() => {
  if (!filters.value) {
    return appModulesList.value;
  } else {
    return appModulesList.value.filter((item) => {
      return (
        item.name.match(new RegExp(filters.value, "i")) ||
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

const selectModule = (module: any) => {
  selectedModuleId.value = module;
  emits("select-module", module);
};

const openDeleteModuleAlert = (id: any = "") => {
  selectedModuleToDelete.value = id;
  SweetAlertProps.value.isSweetAlertOpen = true;
};

const deleteModuleHandler = async () => {
  try {
    loading.value = true;
    const resp = await api.delete(
      `/api/app-modules/${selectedModuleToDelete.value}/`
    );
    SweetAlertProps.value.isSweetAlertOpen = false;
    getModulesListHandler();
  } catch (Error) {
    console.log(Error);
  } finally {
    loading.value = false;
  }
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
          >
            <div class="tile-grid-item-inner">
              <div @click="selectModule(item.id)" class="meta">
                <span class="dark-inverted">{{ item.name }}</span>
                <!-- <span>{{ item.description }}</span> -->
              </div>
              <VDropdown icon="feather:more-vertical" spaced right>
                <template #content>
                  <a
                    @click="selectModule(item.id)"
                    role="menuitem"
                    class="dropdown-item is-media"
                  >
                    <div class="icon">
                      <i aria-hidden="true" class="lnil lnil-lock" />
                    </div>
                    <div class="meta">
                      <span>Permissions</span>
                      <span>Edit permissions</span>
                    </div>
                  </a>
                  <a
                    @click="openModuleModalHandler(item.id)"
                    role="menuitem"
                    class="dropdown-item is-media"
                  >
                    <div class="icon">
                      <i aria-hidden="true" class="lnil lnil-pencil" />
                    </div>
                    <div class="meta">
                      <span>Edit</span>
                      <span>Edit Module</span>
                    </div>
                  </a>

                  <hr class="dropdown-divider" />

                  <a
                    @click="openDeleteModuleAlert(item.id)"
                    role="menuitem"
                    class="dropdown-item is-media"
                  >
                    <div class="icon">
                      <i aria-hidden="true" class="lnil lnil-trash-can-alt" />
                    </div>
                    <div class="meta">
                      <span>Remove</span>
                      <span>Remove module</span>
                    </div>
                  </a>
                </template>
              </VDropdown>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
    <AddUpdateModuleModal
      v-if="openModuleModal"
      :openAppModuleModal="openModuleModal"
      :moduleId="selectedModule"
      @close:modalHandler="openModuleModal = false"
      @update:OnSuccess="getModulesListHandler"
    />
    <SweetAlert
      v-if="SweetAlertProps.isSweetAlertOpen"
      :isSweetAlertOpen="SweetAlertProps.isSweetAlertOpen"
      :title="SweetAlertProps.title"
      :subtitle="SweetAlertProps.subtitle"
      :btntext="SweetAlertProps.btntext"
      :onConfirm="deleteModuleHandler"
      :onCancel="() => (SweetAlertProps.isSweetAlertOpen = false)"
    />
  </div>
</template>

<style lang="scss" scoped>
@import "/@src/scss/abstracts/all";

.active-card {
  // background-color: #ebf8ff !important;
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
