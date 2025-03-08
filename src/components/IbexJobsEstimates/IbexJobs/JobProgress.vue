<script setup lang="ts">
import { posts } from "/@src/data/layouts/card-grid-v4";
import { onceImageErrored } from "/@src/utils/via-placeholder";
import { useApi } from "/@src/composable/useAPI";
import { formatDateTime, formatDate } from "/@src/composable/useSupportElement";
const props = defineProps<{
  object?: string;
  type?: string;
  taskData?: {};
}>();
const api = useApi();
const filters = ref("");
const loading = ref(false);
const openFileModal = ref(false);
const valueSingle = ref(0);
const optionsSingle = [
  "All Posts",
  "Recent Posts",
  "Older Posts",
  "Popular Posts",
];

const progressList = ref([
  {
    id: "",
    uploaded_by_info: {
      id: "",
      username: "",
      last_name: "",
      email: "",
      role: "",
      avatar: "",
    },
    file_info: {
      url: "",
      name: "",
      type: "",
      size: 0.0,
    },
    progress: 0,
    title: "",
    description: "",
    created_at: "",
    file: "",
    job: "",
    task: "",
    uploaded_by: "",
  },
]);

const getJobProgress = async () => {
  try {
    loading.value = true;
    const resp = await api.get(`/api/job-progress/by-job/${props.object}/`);
    progressList.value = resp.data;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const progressListCustom = computed(() => {
  return progressList.value.map((item) => {
    return {
      src: item.file_info.url,
      thumbnail: item.file_info.url,
      w: 1200,
      h: 900,
      alt: item.file_info.name,
    };
  });
});
const filteredData = computed(() => {
  if (!filters.value) {
    return progressList.value;
  } else {
    const filterRe = new RegExp(filters.value, "i");
    console.log(filterRe);
    return progressList.value.filter((item) => {
      return (
        item.title?.match(filterRe) ||
        item.created_at?.match(filterRe) ||
        item.uploaded_by_info?.username?.match(filterRe) ||
        item.uploaded_by_info?.email?.match(filterRe) ||
        item.uploaded_by_info?.last_name?.match(filterRe)
      );
    });
  }
});

onMounted(() => {
  if (props.type === "job") {
    getJobProgress();
  }
});
</script>

<template>
  <JobProgressLoader v-if="loading" />
  <div v-else>
    <div class="card-grid-toolbar">
      <VControl icon="feather:search">
        <input
          v-model="filters"
          class="input custom-text-filter"
          placeholder="Search..."
        />
      </VControl>

      <div class="buttons">
        <VField class="h-hidden-mobile">
          <VControl>
            <Multiselect
              v-model="valueSingle"
              :options="optionsSingle"
              :max-height="145"
              placeholder="Select an option"
            />
          </VControl>
        </VField>
        <VButton @click="openFileModal = !openFileModal" color="primary" raised>
          <span class="icon">
            <i aria-hidden="true" class="fas fa-plus" />
          </span>
          <span>Progress</span>
        </VButton>
      </div>
    </div>

    <div class="card-grid card-grid-v4">
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
          <a
            :href="item.file"
            :title="item.title"
            itemprop="contentUrl"
            data-pswp-width="1200"
            data-pswp-height="900"
            target="_blank"
            data-cropped="true"
            ref="noreferrer"
            class="card-grid-item"
          >
            <img
              :src="item.file"
              :alt="item.title"
              @error.once="onceImageErrored(400, 300)"
            />
            <div class="card-grid-item-content">
              <h3 class="dark-inverted">
                {{ item.title ? item.title : "No Title" }}
              </h3>
              <p>
                {{
                  item.description
                    ? item.description.slice(0, 34)
                    : "No Description"
                }}
                <details v-if="item.description.length > 44">
                  <summary>Read More</summary>
                  {{ item.description ? item.description : "" }}
                </details>
              </p>
            </div>
            <div v-if="item.uploaded_by_info" class="card-grid-item-footer">
              <VAvatar :picture="item.uploaded_by_info.avatar" size="small" />
              <div class="meta">
                <span class="dark-inverted"
                  >{{ item.uploaded_by_info.username ?? "N/A" }}
                  {{ item.uploaded_by_info.last_name ?? "" }}</span
                >
                <span>{{ formatDateTime(item.created_at) }}</span>
              </div>
            </div>
          </a>
        </div>
      </TransitionGroup>
    </div>
    <AddProgressModal
      v-if="openFileModal"
      :job="props.object"
      :openProgressModal="openFileModal"
      @update:OnSuccess="getJobProgress"
      @close:ModalHandler="openFileModal = false"
    />
  </div>
</template>

<style lang="scss">
@import "/@src/scss/abstracts/all";

.card-grid {
  .columns {
    margin-inline-start: -0.5rem !important;
    margin-inline-end: -0.5rem !important;
    margin-top: -0.5rem !important;
  }

  .column {
    padding: 0.5rem !important;
  }
}

.card-grid-v4 {
  .card-grid-item {
    @include vuero-s-card;

    display: flex;
    flex-direction: column;
    padding: 10px;
    border-radius: 16px;
    min-height: 300px;

    &:hover,
    &:focus {
      box-shadow: var(--light-box-shadow);
    }

    > img {
      display: block;
      border-radius: 12px;
      width: 100%;
      height: 160px;
      object-fit: cover;
    }

    .card-grid-item-content {
      padding: 12px 5px;

      h3 {
        font-family: var(--font-alt);
        font-size: 1rem;
        font-weight: 600;
        color: var(--dark-text);
        line-height: 1.3;
      }
    }

    .card-grid-item-footer {
      display: flex;
      align-items: center;
      margin-top: auto;
      padding: 0 5px 10px;

      .meta {
        margin-inline-start: 8px;
        line-height: 1.2;

        span {
          display: block;
          font-weight: 400;

          &:first-child {
            font-family: var(--font-alt);
            font-size: 0.9rem;
            color: var(--dark-text);
            font-weight: 600;
          }

          &:nth-child(2) {
            font-family: var(--font);
            font-size: 0.85rem;
            color: var(--light-text);
          }
        }
      }
    }
  }
}

.is-dark {
  .card-grid-v4 {
    .card-grid-item {
      @include vuero-card--dark;
    }
  }
}

@media only screen and (width >= 768px) and (width <= 1024px) and (orientation: portrait) {
  .card-grid-v4 {
    .columns {
      display: flex;
    }

    .column {
      width: 33.3%;
      min-width: 33.3%;
    }
  }
}
</style>
