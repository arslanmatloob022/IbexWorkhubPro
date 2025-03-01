<script setup lang="ts">
import { files } from "/@src/data/layouts/tile-grid-v2";
import { onceImageErrored } from "/@src/utils/via-placeholder";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { CreateActivityLog } from "/@src/composable/useSupportElement";

const notyf = useNotyf();
const api = useApi();
const props = defineProps<{
  objectId?: string;
  docType?: string;
}>();

const filters = ref("");
const valueSingle = ref(0);
const selectedType = ref("");
const Loading = ref(false);
const openFileModal = ref(false);
const objectsFiles = ref([
  {
    id: "27223081-e97a-4420-91f2-6a08da82d846",
    uploaded_by_info: {
      id: "709ef38f-b1e3-48f2-8cd9-5a8e3e0c9a1b",
      username: "APIs",
      last_name: "Dev",
      email: "api@dev.com",
      role: "admin",
      avatar: null,
    },
    file_info: {
      url: "https://ibex-documents.s3.us-east-2.amazonaws.com/public/attachments/combined_proposal_95Ac2Fu.pdf",
      name: "combined_proposal_95Ac2Fu.pdf",
      type: "pdf",
      size: 0.14,
    },
    file: "https://ibex-documents.s3.us-east-2.amazonaws.com/public/attachments/combined_proposal_95Ac2Fu.pdf",
    type: "proposal_formats",
    object: "751b95b2-9961-45a0-948c-96f85cea6a52",
    created_at: "2025-02-14T19:42:31.991589Z",
    title: "proposal",
    uploaded_by: "709ef38f-b1e3-48f2-8cd9-5a8e3e0c9a1b",
  },
]);

const optionsSingle = [
  "All Files",
  "Recently Updated",
  "My Files",
  "Team Files",
  "Deprecated",
];

const openFileUploaderModal = () => {
  selectedType.value = props.docType;
  openFileModal.value = !openFileModal.value;
};

const getObjectFiles = async (type: any = "proposal_formats") => {
  try {
    Loading.value = true;
    const resp = await api.get(
      `/api/attachment/by-object/${props.objectId}/?type=${props.docType}`
    );
    objectsFiles.value = resp.data;
  } catch (err) {
    console.log(err);
  } finally {
    Loading.value = false;
  }
};

const deleteSelectedDocumentHandler = async (id: any) => {
  try {
    const resp = await api.delete(`/api/attachment/${id}/`);
    CreateActivityLog({
      object_type: "files",
      object_id: props.objectId,
      action: "DELETE",
      message: `Deleted a file named <b>${resp.data.title}</b>.`,
      performedOnName: "job",
    });
    notyf.purple("File Deleted Successfully");
    getObjectFiles();
  } catch (err) {
    console.log(err);
  }
};

const filteredData = computed(() => {
  if (!filters.value) {
    return objectsFiles.value;
  } else {
    return objectsFiles.value.filter((item) => {
      return (
        item.title.match(new RegExp(filters.value, "i")) ||
        item.file_info?.name?.match(new RegExp(filters.value, "i")) ||
        item.created_at.match(new RegExp(filters.value, "i"))
      );
    });
  }
});

onMounted(() => {
  getObjectFiles();
});
</script>

<template>
  <div>
    <PlaceloadV4 v-if="Loading" :rows="4" />
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
          <VButton @click="openFileUploaderModal()" color="primary" raised>
            <span class="icon">
              <i aria-hidden="true" class="fas fa-plus" />
            </span>
            <span>Add File</span>
          </VButton>
        </div>
      </div>

      <div class="tile-grid tile-grid-v2">
        <!--List Empty Search Placeholder -->
        <VPlaceholderPage
          v-if="filteredData.length == 0 && !Loading"
          title="We couldn't find any matching file of this directory."
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

        <div>
          <TransitionGroup name="list" tag="div" class="columns is-multiline">
            <!--Grid item-->
            <div
              v-for="item in filteredData"
              :key="item.id"
              class="column is-4"
            >
              <DocumentTile
                :document="item"
                @deleteSelectedFile="deleteSelectedDocumentHandler"
              />
            </div>
          </TransitionGroup>
        </div>
      </div>
      <UploadDocumentModal
        v-if="openFileModal"
        :openFileModal="openFileModal"
        :object="props.objectId"
        :type="selectedType"
        @close:ModalHandler="openFileModal = false"
        @update:OnSuccess="getObjectFiles"
      />
    </div>
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

.tile-grid-v2 {
  .tile-grid-item {
    @include vuero-s-card;

    border-radius: 14px;
    padding: 16px;
    cursor: pointer;

    &:hover,
    &:focus {
      border-color: var(--primary);
      box-shadow: var(--light-box-shadow);
    }

    .tile-grid-item-inner {
      display: flex;
      align-items: center;

      > img {
        display: block;
        width: 50px;
        height: 50px;
        min-width: 50px;
      }

      .meta {
        margin-inline-start: 10px;
        line-height: 1.4;

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
            display: flex;
            align-items: center;

            span {
              display: inline-block;
              color: var(--light-text);
              font-size: 0.8rem;
              font-weight: 400;
            }

            .icon-separator {
              position: relative;
              font-size: 4px;
              color: var(--light-text);
              padding: 0 6px;
            }
          }
        }
      }

      .dropdown {
        margin-inline-start: auto;
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

  .tile-grid-v2 {
    .tile-grid-item {
      @include vuero-card--dark;

      &:hover,
      &:focus {
        border-color: var(--primary) !important;
      }
    }
  }
}
</style>
