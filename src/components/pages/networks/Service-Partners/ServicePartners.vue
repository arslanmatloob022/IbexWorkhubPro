<script setup lang="ts">
import type {
  VAvatarProps,
  VAvatarColor,
} from "/@src/components/base/avatar/VAvatar.vue";
import { users } from "/@src/data/layouts/user-grid-v1";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
const api = useApi();
const notyf = useNotyf();
const filters = ref("");

const loading = ref(false);

const ContractorsData = ref([
  {
    id: "",
    password: "",
    last_login: null,
    date_joined: "",
    email: "",
    role: "contractor",
    avatar: null,
    is_active: true,
    phoneNumber: "",
    username: "",
    is_sentMail: false,
  },
]);

const currentSelectId = ref("");
const isOpenModal = ref(false);
const openUserModal = (id: any = "") => {
  currentSelectId.value = id;
  isOpenModal.value = !isOpenModal.value;
};

const filteredData = computed(() => {
  if (!filters.value) {
    return ContractorsData.value;
  } else {
    return ContractorsData.value.filter((item) => {
      return (
        item.username.match(new RegExp(filters.value, "i")) ||
        item.email.match(new RegExp(filters.value, "i"))
      );
    });
  }
});

const valueSingle = ref(0);
const optionsSingle = [
  "All",
  "UI/UX Design",
  "Web Development",
  "Software Eng.",
  "Business",
];

function getAvatarData(user: any): VAvatarProps {
  return {
    picture: user?.avatar,
    initials: user?.initials,
    color: user?.color as VAvatarColor,
  };
}

const getContractorshandler = async () => {
  try {
    loading.value = true;
    const response = await api.get("/api/users/by-role/contractor/", {});
    ContractorsData.value = response.data;
    console.log("data", ContractorsData.value);
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  getContractorshandler();
});
</script>

<template>
  <PlaceloadV3 v-if="loading" />
  <div v-if="!loading">
    <div class="user-grid-toolbar">
      <VControl icon="feather:search">
        <input
          v-model="filters"
          class="input custom-text-filter"
          placeholder="Search..."
        />
      </VControl>

      <VButtons>
        <VButton @click="openUserModal()" color="primary" raised>
          <span class="icon">
            <i aria-hidden="true" class="fas fa-plus" />
          </span>
          <span>Add User</span>
        </VButton>
      </VButtons>
    </div>

    <div class="user-grid user-grid-v1">
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

      <TransitionGroup name="list" tag="div" class="columns is-multiline">
        <!--Grid item-->
        <div v-for="item in filteredData" :key="item.id" class="column is-3">
          <div class="grid-item">
            <VAvatar :picture="item.avatar" size="big" />
            <h3 class="dark-inverted">
              {{ item.username }}
            </h3>
            <p>{{ item.role }}</p>
            <div class="people">
              <VTag
                :color="item.is_active ? 'primary' : 'warning'"
                rounded
                :label="item.is_active ? 'Active' : 'In-Active'"
              />
            </div>
            <div class="buttons">
              <button class="button v-button is-dark-outlined">
                <span class="icon">
                  <i
                    aria-hidden="true"
                    class="iconify"
                    data-icon="feather:user"
                  />
                </span>
                <span>Profile</span>
              </button>
              <button class="button v-button is-dark-outlined">
                <span class="icon">
                  <i
                    aria-hidden="true"
                    class="iconify"
                    data-icon="feather:message-circle"
                  />
                </span>
                <span>Talk</span>
              </button>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
    <AddUpdateUser
      v-if="isOpenModal"
      :is-modal-open="isOpenModal"
      user-role="contractor"
      :user-id="currentSelectId"
      @update:close-modal-handler="isOpenModal = false"
      @update:action-update-handler="getContractorshandler"
    />
  </div>
</template>

<style lang="scss">
@import "/@src/scss/abstracts/all";

.is-dark {
  .user-grid {
    .grid-item {
      @include vuero-card--dark;
    }
  }
}

.user-grid-v1 {
  .columns {
    margin-inline-start: -0.5rem !important;
    margin-inline-end: -0.5rem !important;
    margin-top: -0.5rem !important;
  }

  .column {
    padding: 0.5rem !important;
  }

  .grid-item {
    @include vuero-s-card;

    text-align: center;

    > .v-avatar {
      display: block;
      margin: 0 auto 4px;
    }

    h3 {
      font-family: var(--font-alt);
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--dark-text);
    }

    p {
      font-size: 0.85rem;
    }

    .people {
      display: flex;
      justify-content: center;
      padding: 8px 0 30px;

      .v-avatar {
        margin: 0 4px;
      }
    }

    .buttons {
      display: flex;
      justify-content: space-between;

      .button {
        width: calc(50% - 4px);
        color: var(--light-text);

        &:hover,
        &:focus {
          border-color: var(--fade-grey-dark-4);
          color: var(--primary);
          box-shadow: var(--light-box-shadow);
        }
      }
    }
  }
}

@media only screen and (width >= 768px) and (width <= 1024px) and (orientation: portrait) {
  .user-grid-v1 {
    .columns {
      display: flex;

      .column {
        min-width: 50% !important;
      }
    }
  }
}

@media only screen and (width >= 768px) and (width <= 1024px) and (orientation: landscape) {
  .user-grid-v1 {
    .columns {
      .column {
        min-width: 33.3% !important;
      }
    }
  }
}
</style>
