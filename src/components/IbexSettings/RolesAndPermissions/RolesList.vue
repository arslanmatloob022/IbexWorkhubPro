<script setup lang="ts">
import { useApi } from "/@src/composable/useAPI";

const emits = defineEmits<{
  (e: "select-role", value: any): string;
}>();

const api = useApi();
const filters = ref("");
const selectedModule = ref("");
const loading = ref(false);
const roleList = ref([
  {
    id: "1",
    title: "Admin",
    value: "admin",
    color: "primary",
  },
  {
    id: "2",
    title: "Manager",
    value: "manager",
    color: "info",
  },
  {
    id: "3",
    title: "Contractor",
    value: "contractor",
    color: "info",
  },
  {
    id: "4",
    title: "Subcontractor",
    value: "supplier",
    color: "info",
  },
  {
    id: "5",
    title: "Client",
    value: "client",
    color: "info",
  },
]);

const selectedRole = ref("");
const selectRole = (role: any) => {
  selectedRole.value = role;
  emits("select-role", role);
};

const filteredData = computed(() => {
  if (!filters.value) {
    return roleList.value;
  } else {
    return roleList.value.filter((item) => {
      return (
        item.title.match(new RegExp(filters.value, "i")) ||
        item.value.match(new RegExp(filters.value, "i"))
      );
    });
  }
});
onMounted(() => {});
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

      <!-- <div class="buttons">
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
          <span>User</span>
        </VButton>
      </div> -->
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
            :class="selectedRole === item.value ? 'active-card' : ''"
            @click="selectRole(item.value)"
          >
            <div class="tile-grid-item-inner">
              <div class="meta">
                <span class="dark-inverted">{{ item.title }}</span>
                <!-- <span class="capitalized">{{ item.role }}</span> -->
              </div>
              <UserCardDropdown />
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
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
