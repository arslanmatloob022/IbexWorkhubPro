<script setup lang="ts">
import { posts } from "/@src/data/layouts/tile-grid-v3";
import { onceImageErrored } from "/@src/utils/via-placeholder";
import { useApi } from "/@src/composable/useAPI";
import { formatDate } from "/@src/composable/useSupportElement";
const api = useApi();
const filters = ref("");
const loading = ref(false);
const openFileModal = ref(false);
const props = defineProps<{
  object?: string;
  type?: string;
  taskData?: {};
}>();

const valueSingle = ref(0);
const optionsSingle = [
  "All Posts",
  "Recent Posts",
  "Older Posts",
  "Popular Posts",
];
const progressList = ref([
  {
    id: "65f77998-8cbb-4d6a-acfd-100f9a117386",
    uploaded_by_info: {
      id: "937a8b15-62b4-4576-98af-2e53ecb90e46",
      username: "Test Worker",
      last_name: null,
      email: "testworker@gmail.com",
      role: "worker",
      avatar:
        "https://ibex-documents.s3.us-east-2.amazonaws.com/public/static/users_avatars/availalbe.png",
    },
    file_info: {
      url: "https://ibex-documents.s3.us-east-2.amazonaws.com/public/job_progress/Screenshot_from_2025-03-06_17-04-21.png",
      name: "Screenshot_from_2025-03-06_17-04-21.png",
      type: "png",
      size: 0.16,
    },
    progress: 0,
    title: "Test 1",
    description: "description of the progress",
    created_at: "2025-03-06T18:07:35.239784Z",
    file: "https://ibex-documents.s3.us-east-2.amazonaws.com/public/job_progress/Screenshot_from_2025-03-06_17-04-21.png",
    job: "751b95b2-9961-45a0-948c-96f85cea6a52",
    task: "894767a3-516e-4bd8-931d-76e36f99d7a8",
    uploaded_by: "937a8b15-62b4-4576-98af-2e53ecb90e46",
  },
]);

const getTaskProgress = async () => {
  try {
    loading.value = true;
    const resp = await api.get(`/api/job-progress/by-task/${props.object}/`);
    progressList.value = resp.data;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};
const filteredData = computed(() => {
  if (!filters.value) {
    return progressList.value;
  } else {
    const FilterRex = new RegExp(filters.value, "i");
    return progressList.value.filter((item) => {
      return (
        item.title.match(FilterRex) ||
        item.uploaded_by_info?.username?.match(FilterRex)
      );
    });
  }
});

onMounted(() => {
  if (props.type === "task") {
    getTaskProgress();
  }
});
</script>

<template>
  <ProgressMediaLoader v-if="loading" />
  <div v-else>
    <div class="tile-grid-toolbar">
      <VControl icon="feather:search">
        <input
          v-model="filters"
          class="input custom-text-filter"
          placeholder="Search..."
        />
      </VControl>

      <div class="buttons">
        <!-- <VField class="h-hidden-mobile">
          <VControl>
            <Multiselect
              v-model="valueSingle"
              :options="optionsSingle"
              :max-height="145"
              placeholder="Select an option"
            />
          </VControl>
        </VField> -->
        <VButton @click="openFileModal = !openFileModal" color="primary" raised>
          <span class="icon">
            <i aria-hidden="true" class="fas fa-plus" />
          </span>
          <span>Progress</span>
        </VButton>
      </div>
    </div>

    <div class="tile-grid tile-grid-v3">
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

      <!--Tile Grid v3-->
      <div class="tile is-ancestor columns is-multiline">
        <div v-for="item in filteredData" class="tile is-parent column is-12">
          <a class="tile is-child tile-grid-item is-medium">
            <div class="tile-grid-item-inner">
              <img
                :src="item.file"
                :alt="item.title"
                @error.once="onceImageErrored(400, 300)"
              />
              <div class="meta">
                <div class="tile-title">
                  <h3 class="dark-inverted">
                    {{ item.title ?? "N/A" }}
                  </h3>
                  <p>
                    {{ item.description ?? "N/A" }}
                  </p>
                </div>
                <div class="tile-meta">
                  <VAvatar
                    :picture="item.uploaded_by_info.avatar"
                    size="small"
                  />
                  <div class="meta-inner">
                    <span class="dark-inverted">
                      {{ item.uploaded_by_info.username ?? "N/A" }}
                      {{ item.uploaded_by_info.last_name ?? "" }}</span
                    >
                    <span>{{ formatDate(item.created_at) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
    <AddProgressModal
      v-if="openFileModal"
      :task="props.object"
      :job="
        props.taskData.project.id
          ? props.taskData.project.id
          : props.taskData?.project
      "
      :openProgressModal="openFileModal"
      @update:OnSuccess="getTaskProgress"
      @close:ModalHandler="openFileModal = false"
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

.tile-grid-v3 {
  .tile {
    &.is-ancestor {
      margin-inline-start: -0.5rem;
      margin-inline-end: -0.5rem;
      margin-top: -0.5rem;
    }

    &.is-parent {
      padding: 0.5rem;
    }
  }

  .tile-grid-item {
    @include vuero-s-card;

    padding: 10px;
    border-radius: 16px;

    &.is-medium {
      max-height: 132px;

      .tile-grid-item-inner {
        display: flex;
        height: 100%;

        > img {
          display: block;
          border-radius: 12px;
          width: 100%;
          max-width: 110px;
          min-width: 110px;
          height: 100%;
          min-height: 110px;
          max-height: 110px;
          object-fit: cover;
        }

        .meta {
          margin-inline-start: 12px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .tile-title {
            h3 {
              font-family: var(--font-alt);
              font-size: 1rem;
              font-weight: 600;
              color: var(--dark-text);
              line-height: 1.3;
            }
          }

          .tile-meta {
            display: flex;
            align-items: center;
            margin-top: auto;
            padding: 0 0 5px;

            .v-avatar {
              max-width: 26px;
              max-height: 26px;
              min-width: 26px;

              .avatar {
                max-width: 26px;
                max-height: 26px;
                min-width: 26px;
              }
            }

            .meta-inner {
              margin-inline-start: 8px;
              line-height: 1.2;

              span {
                display: block;
                font-weight: 400;

                &:first-child {
                  color: var(--dark-text);
                  font-family: var(--font-alt);
                  font-size: 0.85rem;
                  font-weight: 600;
                }

                &:nth-child(2) {
                  font-size: 0.8rem;
                  font-family: var(--font);
                  color: var(--light-text);
                }
              }
            }
          }
        }
      }
    }

    &.is-large {
      .tile-grid-item-inner {
        display: flex;
        flex-direction: column;
        height: 100%;

        > img {
          display: block;
          border-radius: 12px;
          width: 100%;
          height: 180px;
          object-fit: cover;
        }

        .meta {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex: 1 1 0;
          padding: 0 5px;

          .tile-title {
            padding-top: 10px;

            h3 {
              font-family: var(--font);
              font-size: 1.2rem;
              font-weight: 500;
              color: var(--dark-text);
              line-height: 1.1;
            }
          }

          .tile-meta {
            display: flex;
            align-items: center;
            margin-top: auto;
            padding: 0 0 5px;

            .v-avatar {
              max-width: 26px;
              max-height: 26px;
              min-width: 26px;

              .avatar {
                max-width: 26px;
                max-height: 26px;
                min-width: 26px;
              }
            }

            .meta-inner {
              margin-inline-start: 8px;
              line-height: 1.2;

              span {
                display: block;
                font-weight: 400;

                &:first-child {
                  color: var(--dark-text);
                  font-size: 0.9rem;
                  font-weight: 500;
                }

                &:nth-child(2) {
                  font-size: 0.8rem;
                  color: var(--light-text);
                }
              }
            }
          }
        }
      }
    }

    &.is-wide {
      .tile-grid-item-inner {
        display: flex;
        height: 100%;

        > img {
          display: block;
          border-radius: 12px;
          width: 100%;
          max-width: 280px;
          height: 100%;
          min-height: 160px;
          object-fit: cover;
        }

        .meta {
          margin-inline-start: 12px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .tile-title {
            padding-top: 5px;

            h3 {
              font-family: var(--font);
              font-size: 1.3rem;
              font-weight: 500;
              color: var(--dark-text);
              line-height: 1.1;
            }

            p {
              color: var(--light-text);
              font-size: 0.95rem;
              padding-top: 5px;
            }
          }

          .tile-meta {
            display: flex;
            align-items: center;
            margin-top: auto;
            padding: 0 0 5px;

            .v-avatar {
              max-width: 26px;
              max-height: 26px;
              min-width: 26px;

              .avatar {
                max-width: 26px;
                max-height: 26px;
                min-width: 26px;
              }
            }

            .meta-inner {
              margin-inline-start: 8px;
              line-height: 1.2;

              span {
                display: block;
                font-weight: 400;

                &:first-child {
                  color: var(--dark-text);
                  font-size: 0.9rem;
                  font-weight: 500;
                }

                &:nth-child(2) {
                  font-size: 0.8rem;
                  color: var(--light-text);
                }
              }
            }
          }
        }
      }
    }

    &.is-tall {
      .tile-grid-item-inner {
        display: flex;
        flex-direction: column;
        height: 100%;

        > img {
          display: block;
          border-radius: 12px;
          width: 100%;

          // max-width: 110px;
          height: 220px;
          object-fit: cover;
        }

        .meta {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex: 1 1 0;
          padding: 0 5px;

          .tile-title {
            padding-top: 10px;

            h3 {
              font-family: var(--font);
              font-size: 1.2rem;
              font-weight: 500;
              color: var(--dark-text);
              line-height: 1.1;
            }

            p {
              color: var(--light-text);
              font-size: 0.95rem;
              padding-top: 5px;
            }
          }

          .tile-meta {
            display: flex;
            align-items: center;
            margin-top: auto;
            padding: 0 0 5px;

            .v-avatar {
              max-width: 26px;
              max-height: 26px;
              min-width: 26px;

              .avatar {
                max-width: 26px;
                max-height: 26px;
                min-width: 26px;
              }
            }

            .meta-inner {
              margin-inline-start: 8px;
              line-height: 1.2;

              span {
                display: block;
                font-weight: 400;

                &:first-child {
                  color: var(--dark-text);
                  font-size: 0.9rem;
                  font-weight: 500;
                }

                &:nth-child(2) {
                  font-size: 0.8rem;
                  color: var(--light-text);
                }
              }
            }
          }
        }
      }
    }
  }
}

.is-dark {
  .tile-grid {
    .tile-grid-item {
      @include vuero-card--dark;
    }
  }

  .tile-grid-v3 {
    .tile-grid-item {
      @include vuero-card--dark;
    }
  }
}

@media only screen and (width <= 767px) {
  .tile-grid-v3 {
    .tile-grid-item {
      max-height: 132px !important;

      .tile-grid-item-inner {
        display: flex !important;
        flex-direction: row !important;
        height: 100% !important;

        > img {
          display: block !important;
          border-radius: 12px !important;
          width: 100% !important;
          max-width: 110px !important;
          min-width: 110px !important;
          height: 100% !important;
          min-height: 110px !important;
          max-height: 110px !important;
          object-fit: cover !important;
        }

        .meta {
          margin-inline-start: 12px !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: space-between !important;

          .tile-title {
            h3 {
              font-family: var(--font) !important;
              font-size: 1.1rem !important;
              font-weight: 500;
              color: var(--dark-text) !important;
              line-height: 1.1 !important;
            }

            p {
              display: none !important;
            }
          }

          .tile-meta {
            display: flex !important;
            align-items: center !important;
            margin-top: auto !important;
            padding: 0 0 5px !important;

            .v-avatar {
              max-width: 26px !important;
              max-height: 26px !important;
              min-width: 26px !important;

              .avatar {
                max-width: 26px !important;
                max-height: 26px !important;
                min-width: 26px !important;
              }
            }

            .meta-inner {
              margin-inline-start: 8px !important;
              line-height: 1.2 !important;

              span {
                display: block !important;
                font-weight: 400 !important;

                &:first-child {
                  color: var(--dark-text) !important;
                  font-size: 0.9rem !important;
                  font-weight: 500 !important;
                }

                &:nth-child(2) {
                  font-size: 0.8rem !important;
                  color: var(--light-text) !important;
                }
              }
            }
          }
        }
      }
    }
  }
}

@media only screen and (width >= 768px) and (width <= 1024px) and (orientation: portrait) {
  .tile-grid-v3 {
    .tile-grid-item {
      max-height: 132px !important;

      .tile-grid-item-inner {
        display: flex !important;
        flex-direction: row !important;
        height: 100% !important;

        > img {
          display: block !important;
          border-radius: 12px !important;
          width: 100% !important;
          max-width: 110px !important;
          min-width: 110px !important;
          height: 100% !important;
          min-height: 110px !important;
          max-height: 110px !important;
          object-fit: cover !important;
        }

        .meta {
          margin-inline-start: 12px !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: space-between !important;

          .tile-title {
            h3 {
              font-family: var(--font) !important;
              font-size: 1.1rem !important;
              font-weight: 500;
              color: var(--dark-text) !important;
              line-height: 1.1 !important;
            }

            p {
              display: block;
              max-width: 460px;
            }
          }

          .tile-meta {
            display: flex !important;
            align-items: center !important;
            margin-top: auto !important;
            padding: 0 0 5px !important;

            .v-avatar {
              max-width: 26px !important;
              max-height: 26px !important;
              min-width: 26px !important;

              .avatar {
                max-width: 26px !important;
                max-height: 26px !important;
                min-width: 26px !important;
              }
            }

            .meta-inner {
              margin-inline-start: 8px !important;
              line-height: 1.2 !important;

              span {
                display: block !important;
                font-weight: 400 !important;

                &:first-child {
                  color: var(--dark-text) !important;
                  font-size: 0.9rem !important;
                  font-weight: 500 !important;
                }

                &:nth-child(2) {
                  font-size: 0.8rem !important;
                  color: var(--light-text) !important;
                }
              }
            }
          }
        }
      }
    }
  }
}

@media only screen and (width >= 768px) and (width <= 1024px) and (orientation: landscape) {
  .tile-grid-v3 {
    .tile-grid-item {
      &.is-medium {
        .tile-grid-item-inner {
          .tile-title {
            h3 {
              font-size: 1rem !important;
            }
          }
        }
      }

      &.is-large {
        .tile-grid-item-inner {
          .tile-title {
            h3 {
              font-size: 1.1rem !important;
            }
          }
        }
      }

      &.is-tall {
        .tile-grid-item-inner {
          .tile-title {
            h3 {
              font-size: 1.2rem !important;
            }
          }
        }
      }

      &.is-wide {
        .tile-grid-item-inner {
          > img {
            max-width: 180px;
            min-height: 160px;
          }

          .tile-title {
            h3 {
              font-size: 1.2rem !important;
            }
          }
        }
      }
    }
  }
}
</style>
