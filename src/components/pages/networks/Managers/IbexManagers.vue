<script setup lang="ts">
import type { VTagColor } from "/@src/components/base/tags/VTag.vue";
import type { VAvatarProps } from "/@src/components/base/avatar/VAvatar.vue";
import * as listData from "/@src/data/layouts/view-list-v1";
import { useApi } from "/@src/composable/useAPI";
export interface UserData extends VAvatarProps {
  name: string;
  location: string;
  role: string;
  roleColor: VTagColor;
  medias: {
    avatar: string;
    flag: string;
  };
  stats: {
    projects: number;
    replies: number;
    posts: number;
  };
  teams: VAvatarProps[];
}

const api = useApi();
const isOpenModal = ref(false);
const currentSelectId = ref("");
const users = listData.users as UserData[];
const managersData = ref([
  {
    id: "08653904-4a13-47b4-b045-9546c10a1b2b",
    password:
      "pbkdf2_sha256$260000$ZzDsvIbubU7GpPIHfbgkK6$lEWkAp4a7xWZfFjASFBYtWiX6BbhWmD9w78Lany7Jq4=",
    last_login: null,
    date_joined: "2024-08-29T15:40:17.430723Z",
    email: "juan@ibexbuilderstudios.com",
    role: "manager",
    avatar: null,
    is_active: true,
    phoneNumber: "5484651464",
    username: "Juan",
    is_sentMail: false,
  },
]);
const userData = ref({
  username: "",
  email: "",
  status: "active",

  role: "manager",
  phoneNumber: "",
  avatar: null as File | null | String,
});

const loading = ref(false);

const getManagershandler = async () => {
  try {
    loading.value = true;
    const response = await api.get("/api/users/by-role/manager/", {});
    managersData.value = response.data;
    isOpenModal.value = false;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const openUserModal = (id: any = "") => {
  currentSelectId.value = id;
  isOpenModal.value = !isOpenModal.value;
};
const filters = ref("");

const filteredData = computed(() => {
  if (!filters.value) {
    return managersData.value;
  } else {
    return managersData.value.filter((item) => {
      return (
        item.username.match(new RegExp(filters.value, "i")) ||
        item.email.match(new RegExp(filters.value, "i"))
      );
    });
  }
});
console.log(filteredData.value);

onMounted(() => {
  getManagershandler();
});
</script>

<template>
  <PlaceloadV1 v-if="loading" />
  <div v-else>
    <div class="list-view-toolbar">
      <VField>
        <VControl icon="feather:search">
          <input
            v-model="filters"
            class="input custom-text-filter"
            placeholder="Search..."
          />
        </VControl>
      </VField>

      <div class="list-info">
        <span v-if="filteredData.length === 1">1 record found</span>
        <span v-else>{{ filteredData.length }} records found</span>
      </div>

      <div class="buttons">
        <VButton
          @click="openUserModal()"
          color="primary"
          icon="fas fa-plus"
          elevated
        >
          Manager
        </VButton>
      </div>
    </div>

    <div class="page-content-inner">
      <!--List-->
      <div class="list-view list-view-v1">
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
              src="/@src/assets/illustrations/placeholders/search-1.svg"
              alt=""
            />
            <img
              class="dark-image"
              src="/@src/assets/illustrations/placeholders/search-1-dark.svg"
              alt=""
            />
          </template>
        </VPlaceholderPage>

        <div class="list-view-inner">
          <!--Item-->
          <TransitionGroup name="list-complete" tag="div">
            <div
              v-for="(item, key) in filteredData"
              :key="key"
              class="list-view-item"
            >
              <div class="list-view-item-inner">
                <VAvatar :picture="item.avatar" size="large" />
                <!-- :badge="item.medias.flag" -->
                <div class="meta-left">
                  <h3>{{ item.username }}</h3>
                  <span>
                    <i
                      aria-hidden="true"
                      class="iconify"
                      data-icon="feather:map-pin"
                    />
                    <span>{{ item.email }}</span>
                  </span>
                </div>
                <div class="meta-right">
                  <div class="tags">
                    <VTag :label="item.role" color="warning" rounded elevated />
                  </div>

                  <div class="stats">
                    <div class="stat">
                      <span>{{ item.phoneNumber }}</span>
                      <span>Projects</span>
                    </div>
                    <div class="separator" />
                    <div class="stat">
                      <span>{{ item.date_joined }}</span>
                      <span>Replies</span>
                    </div>
                    <div class="separator" />
                    <div @click="openUserModal(item.id)" class="stat">
                      <span>{{ item.is_active }}</span>
                      <!-- <span>Posts</span> -->
                      <span>Edit</span>
                    </div>
                  </div>

                  <!-- <div class="network">
                    <VAvatarStack
                      :avatars="item.teams"
                      :limit="3"
                      size="small"
                    />
                    <span>in Team</span>
                  </div> -->

                  <!--Dropdown-->
                  <ListViewV1Dropdown />
                </div>
              </div>
            </div>
          </TransitionGroup>
        </div>
      </div>

      <VFlexPagination
        v-if="filteredData.length > 5"
        :item-per-page="10"
        :total-items="873"
        :current-page="42"
        :max-links-displayed="5"
      />
    </div>
  </div>
  <AddUpdateUser
    v-if="isOpenModal"
    :is-modal-open="isOpenModal"
    user-role="manager"
    :user-id="currentSelectId"
    @update:close-modal-handler="isOpenModal = false"
    @update:action-update-handler="getManagershandler"
  />
</template>

<style lang="scss">
@import "/@src/scss/abstracts/all";

.list-view-v1 {
  .list-view-item {
    @include vuero-r-card;

    margin-bottom: 16px;
    padding: 16px;

    .list-view-item-inner {
      display: flex;
      align-items: center;

      .meta-left {
        margin-inline-start: 16px;

        h3 {
          font-family: var(--font-alt);
          color: var(--dark-text);
          font-weight: 600;
          font-size: 1rem;
          line-height: 1;
        }

        > span:not(.tag) {
          font-size: 0.9rem;
          color: var(--light-text);

          svg {
            height: 12px;
            width: 12px;
          }
        }
      }

      .meta-right {
        margin-inline-start: auto;
        display: flex;
        justify-content: flex-end;
        align-items: center;

        .tags {
          margin-inline-end: 30px;
          margin-bottom: 0;

          .tag {
            margin-bottom: 0;
          }
        }

        .stats {
          display: flex;
          align-items: center;
          margin-inline-end: 30px;

          .stat {
            display: flex;
            align-items: center;
            flex-direction: column;
            text-align: center;
            color: var(--light-text);

            > span {
              font-family: var(--font);

              &:first-child {
                font-size: 1.2rem;
                font-weight: 600;
                color: var(--dark-text);
                line-height: 1.4;
              }

              &:nth-child(2) {
                text-transform: uppercase;
                font-family: var(--font-alt);
                font-size: 0.75rem;
              }
            }

            svg {
              height: 16px;
              width: 16px;
            }

            i {
              font-size: 1.4rem;
            }
          }

          .separator {
            height: 25px;
            width: 2px;
            border-inline-end: 1px solid var(--fade-grey-dark-3);
            margin: 0 16px;
          }
        }

        .network {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          min-width: 145px;

          > span {
            font-family: var(--font);
            font-size: 0.9rem;
            color: var(--light-text);
            margin-inline-start: 6px;
          }
        }

        .dropdown {
          margin-inline-start: 30px;
        }
      }
    }
  }
}

.is-dark {
  .list-view-v1 {
    .list-view-item {
      @include vuero-card--dark;

      .list-view-item-inner {
        .meta-left {
          h3 {
            color: var(--dark-dark-text) !important;
          }
        }

        .meta-right {
          .stats {
            .stat {
              span {
                &:first-child {
                  color: var(--dark-dark-text);
                }
              }
            }

            .separator {
              border-color: var(--dark-sidebar-light-16) !important;
            }
          }
        }
      }
    }
  }
}

@media only screen and (width <= 767px) {
  .list-view-v1 {
    .list-view-item {
      .list-view-item-inner {
        position: relative;
        flex-direction: column;

        .v-avatar {
          margin-bottom: 10px;
        }

        .meta-left {
          margin-inline-start: 0;
        }

        .meta-right {
          flex-direction: column;
          margin-inline-start: 0;

          .tags {
            margin: 10px 0;
          }

          .stats {
            margin: 10px 0;
          }

          .network {
            margin: 10px 0 0;
            justify-content: center;

            > span {
              display: none;
            }
          }

          .dropdown {
            position: absolute;
            top: 0;
            inset-inline-end: 0;
            margin-inline-start: 0;
          }
        }
      }
    }
  }
}

@media only screen and (width >= 768px) and (width <= 1024px) and (orientation: portrait) {
  .list-view-v1 {
    display: flex;
    flex-wrap: wrap;

    .list-view-item {
      margin: 10px;
      width: calc(50% - 20px);

      .list-view-item-inner {
        position: relative;
        flex-direction: column;

        .v-avatar {
          margin-bottom: 10px;
        }

        .meta-left {
          margin-inline-start: 0;
        }

        .meta-right {
          flex-direction: column;
          margin-inline-start: 0;

          .tags {
            margin: 10px 0;
          }

          .stats {
            margin: 10px 0;
          }

          .network {
            margin: 10px 0 0;
            justify-content: center;

            > span {
              display: none;
            }
          }

          .dropdown {
            position: absolute;
            top: 0;
            inset-inline-end: 0;
            margin-inline-start: 0;
          }
        }
      }
    }
  }
}
</style>
