<script setup lang="ts">
import { retails } from "/@src/data/layouts/view-list-v2";
import { useApi } from "/@src/composable/useAPI";
import { useUserSession } from "/@src/stores/userSession";

const userSession = useUserSession();
type TabId = "active" | "inactive";
const activeTab = ref<TabId>("active");
const filters = ref("");
const loading = ref(false);
const chronicTasks = ref([]);
const api = useApi();
const props = withDefaults(
  defineProps<{
    supplierId?: string;
    projectID?: string;
    workerId?: string;
    userId?: string;
  }>(),
  {
    projectID: "",
    workerId: "",
    supplierId: "",
    userId: "",
  }
);

const emits = defineEmits<{
  (e: "update:getAllTasks", value: null): void;
  (e: "update:completedTasks", value: number): void;
  (e: "update:activeTasks", value: number): void;
}>();

const getChronicTasks = async () => {
  try {
    loading.value = true;
    const resp = await api.get(
      `/api/task/project-wise-tasks/${
        props.userId ? props.userId : userSession.user.id
      }/`
    );
    chronicTasks.value = resp.data;
    console.log("chronic tasks", resp.data);
    loading.value = false;
  } catch (err) {
    console.log(err);
  }
};

const filteredData = computed(() => {
  if (!filters.value) {
    return chronicTasks.value;
  } else {
    const filterRe = new RegExp(filters.value, "i");
    return chronicTasks.value.filter((item) => {
      return item.title.match(filterRe) || item.description.match(filterRe);
    });
  }
});

onMounted(() => {
  getChronicTasks();
});
</script>

<template>
  <div v-if="loading">
    <PlaceloadV1 />
  </div>
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

      <div class="tabs-inner"></div>
    </div>

    <div
      v-for="item in filteredData"
      :key="item.id"
      class="page-content-inner mb-6"
    >
      <!--List-->
      <div class="list-view list-view-v2">
        <!--Active Tab-->
        <div
          id="active-items-tab"
          class="tab-content"
          :class="[activeTab === 'active' && 'is-active']"
        >
          <div class="list-view-inner">
            <TransitionGroup name="list-complete" tag="div">
              <div class="list-view-item">
                <div class="list-view-item-inner">
                  <!-- <img :src="item.image" alt="" /> -->
                  <div class="meta-left">
                    <h3>
                      <span class="info-text"
                        ><i class="lnir lnir-star-empty" aria-hidden="true"></i
                        >{{ item.title }}</span
                      >
                    </h3>
                    <div
                      v-if="item.description"
                      v-html="item.description"
                    ></div>
                    <span>
                      <span>
                        Timeline:
                        {{ item.startDate ? item.startDate : "N/A" }} to
                        {{ item.endDate ? item.endDate : "N/A" }}
                      </span>
                    </span>

                    <!-- <div class="icon-list">
                    <span>
                      <i aria-hidden="true" class="lnil lnil-air-flow" />
                      <span>Heater</span>
                    </span>
                    <span>
                      <i aria-hidden="true" class="lnil lnil-sun" />
                      <span>Cleaning</span>
                    </span>
                    <span>
                      <i aria-hidden="true" class="lnil lnil-more" />
                      <span>4 more</span>
                    </span>
                  </div> -->
                  </div>
                  <div class="meta-right">
                    <!-- <div class="buttons">
                    <VButton light> More Info </VButton>
                    <VButton color="primary" raised> Book Now </VButton>
                  </div> -->
                  </div>
                </div>
              </div>
            </TransitionGroup>
          </div>

          <!-- <VFlexPagination
            v-if="filteredData.length > 5"
            :item-per-page="10"
            :total-items="873"
            :current-page="42"
            :max-links-displayed="7"
          /> -->
        </div>

        <!--Inactive Tab-->
        <div
          id="inactive-items-tab"
          class="tab-content"
          :class="[activeTab === 'inactive' && 'is-active']"
        >
          <div class="list-view-inner">
            <!--Empty placeholder-->
            <VPlaceholderPage
              title="There are no inactive properties."
              subtitle="Looks like there are no inactive properties to display. You can
                disable and also enable a property from the property settings."
              larger
            >
              <template #image>
                <img
                  class="light-image"
                  src="/@src/assets/illustrations/placeholders/having-coffee.svg"
                  alt=""
                />
                <img
                  class="dark-image"
                  src="/@src/assets/illustrations/placeholders/having-coffee-dark.svg"
                  alt=""
                />
              </template>
            </VPlaceholderPage>
          </div>
        </div>
      </div>
      <ChronicTasksList :tasks="item.filtered_tasks" />
    </div>
  </div>
</template>

<style lang="scss">
@import "/@src/scss/abstracts/all";

.list-view-v2 {
  .list-view-item {
    @include vuero-s-card;

    margin-bottom: 16px;
    padding: 16px;

    &:hover,
    &:focus {
      box-shadow: var(--light-box-shadow);
    }

    .list-view-item-inner {
      display: flex;

      > img {
        display: block;
        min-height: 130px;
        max-height: 130px;
        min-width: 190px;
        max-width: 190px;
        object-fit: cover;
        border-radius: var(--radius);
      }

      .meta-left {
        display: flex;
        flex-direction: column;
        margin-inline-start: 16px;

        h3 {
          font-family: var(--font-alt);
          color: var(--dark-text);
          font-weight: 600;
          font-size: 1.1rem;
          line-height: 1.5;

          .rating {
            margin-inline-start: 12px;

            i {
              font-size: 12px;
            }
          }
        }

        p {
          font-size: 0.95rem;
          color: var(--light-text);

          svg {
            height: 12px;
            width: 12px;
          }
        }

        > span {
          display: flex;
          align-items: center;
          margin-top: 10px;
          font-family: var(--font);
          font-size: 0.9rem;
          color: var(--primary);

          .icon-separator {
            font-size: 5px;
            color: var(--light-text);
            padding: 0 10px;
          }
        }

        .icon-list {
          margin-top: auto;
          display: flex;

          > span {
            display: flex;
            align-items: center;
            margin-inline-end: 15px;

            span {
              font-size: 0.85rem;
              font-family: var(--font-alt);
              color: var(--dark-text);
            }

            i {
              font-size: 1.2rem;
              margin-inline-end: 6px;
              color: var(--light-text);
            }
          }
        }
      }

      .meta-right {
        margin-inline-start: auto;
        display: flex;
        align-items: center;
        justify-content: flex-end;

        .buttons {
          margin-bottom: 0;
          margin-inline-end: 10px;
        }
      }
    }
  }
}

.is-dark {
  .list-view-v2 {
    .list-view-item {
      @include vuero-card--dark;

      .list-view-item-inner {
        .meta-left {
          h3 {
            color: var(--dark-dark-text) !important;
          }

          > span {
            color: var(--primary);
          }

          .icon-list {
            > span {
              span {
                color: var(--dark-dark-text);
              }
            }
          }
        }

        .meta-right {
          .buttons {
            .button {
              &:first-child {
                background: var(--dark-sidebar-light-2);
                border-color: var(--dark-sidebar-light-8);
                color: var(--dark-dark-text);
              }
            }
          }
        }
      }
    }
  }
}

@media only screen and (width <= 767px) {
  .list-view-v2 {
    .list-view-item {
      padding: 20px;

      .list-view-item-inner {
        flex-direction: column;

        > img {
          width: 100%;
          max-width: 100%;
          min-height: 160px;
          max-height: 160px;
          margin-bottom: 1rem;
        }

        .meta-left {
          margin-inline-start: 0;

          > span {
            margin-bottom: 16px;
          }

          .icon-list {
            flex-wrap: wrap;

            > span {
              flex-direction: column;
              text-align: center;
              margin: 10px;
              width: calc(33.3% - 20px);

              i {
                margin: 0;
              }
            }
          }
        }

        .meta-right {
          margin: 16px 0 0;

          .buttons {
            margin: 0;
            width: 100%;
            display: flex;
            justify-content: space-between;

            .button {
              width: 48%;
            }
          }
        }
      }
    }
  }
}

@media only screen and (width >= 768px) and (width <= 1024px) and (orientation: portrait) {
  .list-view-v2 {
    .list-view-inner {
      display: flex;
      flex-wrap: wrap;

      .list-view-item {
        padding: 20px;
        margin: 10px;
        width: calc(50% - 20px);

        .list-view-item-inner {
          flex-direction: column;
          height: 100%;
          min-height: 450px;

          > img {
            width: 100%;
            max-width: 100%;
            min-height: 160px;
            max-height: 160px;
            margin-bottom: 1rem;
          }

          .meta-left {
            margin-inline-start: 0;

            > span {
              margin-bottom: 16px;
            }

            .icon-list {
              flex-wrap: wrap;

              > span {
                flex-direction: column;
                text-align: center;
                margin: 10px;
                width: calc(33.3% - 20px);

                i {
                  margin: 0;
                }
              }
            }
          }

          .meta-right {
            margin: auto 0 0;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;

            .buttons {
              margin: 16px 0 0;
              width: 100%;
              display: flex;
              justify-content: space-between;

              .button {
                width: 48%;
              }
            }
          }
        }
      }
    }
  }
}
</style>
