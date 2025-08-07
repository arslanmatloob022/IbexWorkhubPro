<script setup lang="ts">
import { files } from "/@src/data/layouts/tile-grid-v2";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";

const notyf = useNotyf();
const api = useApi();
const props = defineProps<{
  leadId?: string;
  uploaded_files?: any;
}>();

const filters = ref("");
const selectedType = ref("");
const tab = ref("contracts");
const openFileModal = ref(false);
const mergedProposalsList = ref([]);
const mainTab = ref("documents");

const filteredData = computed(() => {
  if (!filters.value) {
    return files;
  } else {
    return files.filter((item) => {
      return (
        item.name.match(new RegExp(filters.value, "i")) ||
        item.size.match(new RegExp(filters.value, "i"))
      );
    });
  }
});

const optionsSingle = [
  "All Files",
  "Recently Updated",
  "My Files",
  "Team Files",
  "Deprecated",
];

const emits = defineEmits<{
  (emit: "getProjectInfo", value: any): void;
  (emit: "updateOnSuccess", value: any): void;
}>();

const getProject = () => {
  emits("getProjectInfo", null);
};

const openFileUploaderModal = (type: "") => {
  selectedType.value = type;
  openFileModal.value = !openFileModal.value;
};

const getGroupedProposals = async (type: any = "contracts") => {
  try {
    tab.value = type;
    const resp = await api.get(
      `/api/attachment/by-object/${props.leadId}/?type=${type}`
    );
    mergedProposalsList.value = resp.data;
  } catch (err) {
    console.log(err);
  }
};

const deleteSelectedDocumentHandler = async (id: any) => {
  try {
    const resp = await api.delete(`/api/attachment/${id}/`);
    notyf.purple("File Deleted Successfully");
    getGroupedProposals();
  } catch (err) {
    console.log(err);
  }
};

const folderType = ref("");
const openCreateFolderModal = ref(false);
const documentsFoldersList = ref([]);
const photosFoldersList = ref([]);
const videosFoldersList = ref([]);
const addFolderHandler = (type: string = "") => {
  folderType.value = type;
  openCreateFolderModal.value = !openCreateFolderModal.value;
};

const getMediaFolders = async (type: any = "") => {
  try {
    const resp = await api.get(
      `/api/media-folder/?object=${props.leadId}&type=${type}`
    );
    if (type === "documents") {
      documentsFoldersList.value = resp.data;
    } else if (type === "photos") {
      photosFoldersList.value = resp.data;
    } else if (type === "videos") {
      videosFoldersList.value = resp.data;
    }
  } catch (err) {
    console.log(err);
  }
};

const updateOnSuccessHandler = () => {
  getAllFolders();
  emits("updateOnSuccess", null);
};

const getAllFolders = (type: any = "documents") => {
  if (type === "documents") {
    getMediaFolders("documents");
  } else if (type === "photos") {
    getMediaFolders("photos");
  } else if (type === "videos") {
    getMediaFolders("videos");
  }
};

onMounted(() => {
  getGroupedProposals();
  getAllFolders("documents");
});
</script>

<template>
  <div>
    <div class="tabs-wrapper">
      <div class="tabs-inner">
        <div class="tabs is-boxed">
          <ul>
            <li :class="[mainTab === 'documents' && 'is-active']">
              <a
                tabindex="0"
                role="button"
                @keydown.space.prevent="mainTab = 'documents'"
                @click="
                  mainTab = 'documents';
                  getAllFolders('documents');
                "
                ><span>Documents</span></a
              >
            </li>
            <li :class="[mainTab === 'photos' && 'is-active']">
              <a
                tabindex="0"
                role="button"
                @keydown.space.prevent="mainTab = 'photos'"
                @click="
                  mainTab = 'photos';
                  getAllFolders('photos');
                "
                ><span>Photos</span></a
              >
            </li>
            <li :class="[mainTab === 'videos' && 'is-active']">
              <a
                tabindex="0"
                role="button"
                @keydown.space.prevent="mainTab = 'videos'"
                @click="
                  mainTab = 'videos';
                  getAllFolders('videos');
                "
                ><span>Videos</span></a
              >
            </li>

            <li class="tab-naver" />
          </ul>
        </div>
      </div>
    </div>

    <div v-if="mainTab == 'documents'">
      <NewJobFolders type="documents" :objectId="props.leadId" />
    </div>

    <div v-if="mainTab == 'photos'">
      <NewJobFolders type="photos" :objectId="props.leadId" />
    </div>
    <div v-if="mainTab == 'videos'">
      <NewJobFolders type="videos" :objectId="props.leadId" />
    </div>
    <UploadDocumentModal
      v-if="openFileModal"
      :openFileModal="openFileModal"
      :object="props.leadId"
      :type="selectedType"
      @close:ModalHandler="openFileModal = false"
      @update:OnSuccess="getGroupedProposals"
    />
    <CreateFolderModal
      v-if="openCreateFolderModal"
      :open-create-folder-modal="openCreateFolderModal"
      :type="folderType"
      :object="props.leadId"
      @update:modal-handler="openCreateFolderModal = false"
      @update:on-success="getAllFolders(folderType)"
    />
  </div>
</template>

<style lang="scss">
@import "/@src/scss/abstracts/all";

.is-cus-active {
  a {
    border-bottom: 3px solid !important;
    background-color: rgb(230, 247, 255);
    border-bottom-color: var(--info) !important;
    color: var(--info) !important;
  }
}

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
