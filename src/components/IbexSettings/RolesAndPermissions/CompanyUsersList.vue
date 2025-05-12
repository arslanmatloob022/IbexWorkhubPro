<script setup lang="ts">
import { useApi } from "/@src/composable/useAPI";

const emits = defineEmits<{
  (e: "select-module", value: any): string;
}>();

const api = useApi();
const filters = ref("");
const selectedModule = ref("");
const loading = ref(false);
const usersList = ref([
  {
    avatar: null,
    city: null,
    country: null,
    date_joined: "2025-04-15T16:54:31.397437-04:00",
    email: "krystal@ibex.com",
    id: "cfe8260c-07e4-4935-b23b-e1dc73811469",
    is_active: true,
    is_sentMail: false,
    last_login: "2025-04-24T15:45:47.192183-04:00",
    last_name: "Henning",
    latitude: null,
    longitude: null,
    password:
      "pbkdf2_sha256$870000$kRWmdZbAqOlOVIitiSivUu$ShbRvvElhWdXIq8hI4i0DilbBz+8VWPQ96qBauel3K4=",
    phoneNumber: "",
    postalCode: null,
    role: "client",
    supplier: null,
    token: null,
    username: "John",
  },
]);
const openModuleModal = ref(false);

const openModuleModalHandler = (module: any = "") => {
  selectedModule.value = module;
  openModuleModal.value = !openModuleModal.value;
};

const getCompanyUsers = async () => {
  try {
    loading.value = true;
    const resp = await api.get("/api/users/");
    usersList.value = resp.data.filter((user: any) => {
      return user.role !== "worker";
    });
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

const filteredData = computed(() => {
  if (!filters.value) {
    return usersList.value;
  } else {
    return usersList.value.filter((item) => {
      return (
        item.username.match(new RegExp(filters.value, "i")) ||
        item.last_name.match(new RegExp(filters.value, "i"))
      );
    });
  }
});
onMounted(() => {
  getCompanyUsers();
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
          <span>User</span>
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
              <VAvatar
                :picture="item.avatar"
                :dot="item.is_active"
                color="info"
                :initials="item.username.slice(0, 2)"
                size="medium"
              />
              <div class="meta">
                <span class="dark-inverted">{{ item.username }}</span>
                <span class="capitalized">{{ item.role }}</span>
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
      @update:OnSuccess="getCompanyUsers"
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
  height: 60dvh;
  overflow-y: scroll;
  overflow-x: hidden;
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
