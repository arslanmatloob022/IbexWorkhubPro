<script setup lang="ts">
import { files } from "/@src/data/layouts/tile-grid-v2";
import { onceImageErrored } from "/@src/utils/via-placeholder";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import {
  CreateActivityLog,
  formatDateTime,
} from "/@src/composable/useSupportElement";

const notyf = useNotyf();
const api = useApi();
const props = defineProps<{
  objectId?: string;
  docType?: string;
  folderId?: string;
  showFolderDeleteBtn?: boolean;
}>();

const emits = defineEmits<{
  (e: "update:objectId", id: string): void;
  (e: "deleteFolderUpdate", value: any): void;
}>();

const filters = ref("");
const valueSingle = ref(0);
const selectedType = ref("");
const Loading = ref(false);
const openFileModal = ref(false);
const DocumentType = ref("");
const documentToView = ref(false);
const documentTitle = ref(false);
const openDocViewModal = ref(false);
const photosSubFolders = ref([]);
const tab = ref("recent");
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

const deleteFolderUpdateHandler = () => {
  emits("deleteFolderUpdate", null);
};
const folderType = ref("");
const openCreateFolderModal = ref(false);
const addFolderHandler = (type: string = "") => {
  folderType.value = type;
  openCreateFolderModal.value = !openCreateFolderModal.value;
};
const selectedFolder = ref("");
const SweetAlertProps = ref({
  title: "",
  subtitle: "test",
  isSweetAlertOpen: false,
  btntext: "text",
});
const openDeleteFolderAlert = () => {
  SweetAlertProps.value = {
    title: " Delete this folder?",
    subtitle: "This action cannot be undone.",
    isSweetAlertOpen: true,
    btntext: "Delete",
  };
};

const deleteFolderHandler = async () => {
  try {
    const resp = await api.delete(`/api/media-folder/${props.folderId}/`);
    CreateActivityLog({
      object_type: "files",
      object_id: props.objectId,
      action: "DELETE",
      message: `Deleted a folder named <b>${resp.data.name}</b>.`,
      performedOnName: "job",
    });
    notyf.purple("Folder Deleted Successfully");
    SweetAlertProps.value.isSweetAlertOpen = false;
    deleteFolderUpdateHandler();
  } catch (err) {
    console.log(err);
  }
};

const openFolderDeleteModal = () => {
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

const getPhotosSubFolders = async () => {
  try {
    const resp = await api.get(
      `/api/media-folder/?parent=${props.folderId}&object=${props.objectId}`
    );
    photosSubFolders.value = resp.data;

    tab.value = "recent";
  } catch (err) {
    console.log(err);
  }
};
const openDocViewModalHandler = (doc: any) => {
  documentToView.value = doc.file_info?.url;
  DocumentType.value = doc.file_info?.type;
  documentTitle.value = doc.title;
  openDocViewModal.value = !openDocViewModal.value;
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
  getPhotosSubFolders();
});
</script>

<template>
  <div>
    <PlaceloadV4 v-if="Loading" :rows="4" />
    <div v-else>
      <div v-if="photosSubFolders.length">
        <div class="tabs-wrapper">
          <div class="tabs-inner">
            <div class="tabs">
              <ul>
                <li :class="[tab === 'recent' && 'is-active']">
                  <a
                    tabindex="0"
                    role="button"
                    @keydown.space.prevent="tab = 'recent'"
                    @click="tab = 'recent'"
                    ><span>Recent</span></a
                  >
                </li>
                <li
                  v-for="item in photosSubFolders"
                  :class="[tab === item.value && 'is-active']"
                >
                  <a
                    tabindex="0"
                    role="button"
                    @keydown.space.prevent="tab = item.value"
                    @click="tab = item.value"
                    ><span>{{ item.title }}</span></a
                  >
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div v-for="item in photosSubFolders" :key="item.id">
          <div v-if="tab == item.value">
            <ObjectPhotosCard
              @deleteFolderUpdate="getPhotosSubFolders()"
              :doc-type="item.value"
              :object-id="props.objectId"
              :folderId="item.id"
            />
          </div>
        </div>
        <div v-if="tab === 'recent'">
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
                <span>File</span>
              </VButton>
              <VButton @click="addFolderHandler" color="info" raised>
                <span class="icon">
                  <i aria-hidden="true" class="fas fa-folder-plus" />
                </span>
                <span>Folder</span>
              </VButton>
              <VButton @click="openDeleteFolderAlert" color="danger" raised>
                <span class="icon">
                  <i aria-hidden="true" class="fas fa-trash" />
                </span>
                <span>Folder</span>
              </VButton>
            </div>
          </div>
          <div class="card-grid card-grid-v4">
            <TransitionGroup name="list" tag="div" class="columns is-multiline">
              <div
                v-for="item in filteredData"
                :key="item.id"
                class="column is-3"
              >
                <a
                  @click="openDocViewModalHandler(item)"
                  class="card-grid-item"
                >
                  <img
                    :src="item.file"
                    alt=""
                    @error.once="onceImageErrored(400, 300)"
                  />
                  <div class="card-grid-item-footer">
                    <VAvatar
                      :picture="item.uploaded_by_info?.avatar"
                      size="small"
                    />
                    <div class="meta">
                      <span class="dark-inverted">{{
                        item.uploaded_by_info.username
                      }}</span>
                      <span>{{ formatDateTime(item.created_at) }}</span>
                    </div>
                  </div>
                </a>
              </div>
            </TransitionGroup>
          </div>
        </div>
      </div>
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
            <VButton @click="openFileUploaderModal()" color="primary" raised>
              <span class="icon">
                <i aria-hidden="true" class="fas fa-plus" />
              </span>
              <span>Photos</span>
            </VButton>
            <VButton
              v-if="props.showFolderDeleteBtn"
              @click="openDeleteFolderAlert"
              color="danger"
              raised
            >
              <span class="icon">
                <i aria-hidden="true" class="fas fa-trash" />
              </span>
              <span>Folder</span>
            </VButton>
          </div>
        </div>

        <div class="card-grid card-grid-v4">
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
              <div
                v-for="item in filteredData"
                :key="item.id"
                class="column is-3"
              >
                <a
                  @click="openDocViewModalHandler(item)"
                  class="card-grid-item"
                >
                  <img
                    :src="item.file"
                    alt=""
                    @error.once="onceImageErrored(400, 300)"
                  />
                  <div class="card-grid-item-footer">
                    <VAvatar
                      :picture="item.uploaded_by_info?.avatar"
                      size="small"
                    />
                    <div class="meta">
                      <span class="dark-inverted">{{
                        item.uploaded_by_info.username
                      }}</span>
                      <span>{{ formatDateTime(item.created_at) }}</span>
                    </div>
                  </div>
                </a>
              </div>
            </TransitionGroup>
          </div>
        </div>
      </div>
      <SweetAlert
        v-if="SweetAlertProps.isSweetAlertOpen"
        :isSweetAlertOpen="SweetAlertProps.isSweetAlertOpen"
        :title="SweetAlertProps.title"
        :subtitle="SweetAlertProps.subtitle"
        :btntext="SweetAlertProps.btntext"
        :onConfirm="deleteFolderHandler"
        :onCancel="() => (SweetAlertProps.isSweetAlertOpen = false)"
      />
      <UploadPhotosModal
        v-if="openFileModal"
        :openFileModal="openFileModal"
        :object="props.objectId"
        :type="selectedType"
        @close:ModalHandler="openFileModal = false"
        @update:OnSuccess="getObjectFiles"
      />
      <DocumentViewer
        v-if="openDocViewModal"
        :openDocViewModal="openDocViewModal"
        :document="documentToView"
        :DocumentType="DocumentType"
        :title="documentTitle"
        @update:closeModalHandler="openDocViewModal = false"
      />
      <CreateFolderModal
        v-if="openCreateFolderModal"
        :open-create-folder-modal="openCreateFolderModal"
        :type="props.docType"
        :object="props.objectId"
        :parent="props.folderId"
        @update:modal-handler="openCreateFolderModal = false"
        @update:on-success=""
      />
    </div>
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
      height: 250px;
      object-fit: cover;
    }

    .card-grid-item-content {
      //padding: 12px 5px;
      padding: 1px 1px;

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
      margin-top: 8px;
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
