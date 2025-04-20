<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";

const notyf = useNotyf();
const api = useApi();
const selectedObject = ref("");
const openFileModal = ref(false);
const openPhotoModal = ref(false);
const folderStack = ref<any[]>([]);
const folders = ref<any[]>([]);
const files = ref<any[]>([]);
const loading = ref(false);
const selectedFolderToDelete = ref("");
const props = defineProps({
  objectId: String,
  type: {
    type: String,
    required: true,
  },
});

const currentFolder = computed(
  () => folderStack.value[folderStack.value.length - 1] || null
);

const SweetAlertProps = ref({
  title: "",
  subtitle: "test",
  isSweetAlertOpen: false,
  btntext: "text",
  Icon: "",
});

const openDeleteFolderAlert = (folder: any = "") => {
  selectedFolderToDelete.value = folder.id;
  SweetAlertProps.value = {
    title: `Delete ${folder.title} folder?`,
    subtitle:
      "Once deleted, you will not be able to recover this folder and the content in it.",
    isSweetAlertOpen: true,
    btntext: "Delete",
    Icon: "fas fa-bell",
  };
};
// Fetch top-level folders
const fetchTopLevelFolders = async () => {
  loading.value = true;
  try {
    const response = await api.get(
      `/api/media-folder/?object=${props.objectId}&type=${props.type}`
    );
    folders.value = response.data.filter((item) => {
      return item.parent === null;
    });
    files.value = []; // No files on root level
  } catch (error) {
    console.error("Error fetching top folders:", error);
  } finally {
    loading.value = false;
  }
};

// Fetch subfolders and files for a given folder
const fetchFolderContents = async (folderId: string) => {
  loading.value = true;
  try {
    const subfolderResp = await api.get(
      `/api/media-folder/${folderId}/sub-folders/`
    );
    folders.value = subfolderResp.data;
    const fileResp = await api.get(
      `/api/attachment/by-object/${folderId}/?type=${props.type}`
    );
    files.value = fileResp.data;
  } catch (error) {
    console.error("Error fetching folder contents:", error);
  } finally {
    loading.value = false;
  }
};

// Navigation
const navigateToFolder = async (folder: any) => {
  folderStack.value.push(folder);
  await fetchFolderContents(folder.id);
};

const goBack = async () => {
  folderStack.value.pop();
  const parent = currentFolder.value;
  if (parent) {
    await fetchFolderContents(parent.id);
  } else {
    await fetchTopLevelFolders();
  }
};
const openCreateFolderModal = ref(false);
const selectedParentFolder = ref("");
// Add new folder
const openAddFolderModal = async () => {
  selectedParentFolder.value = currentFolder.value
    ? currentFolder.value.id
    : "";
  openCreateFolderModal.value = true;
  // const folderName = prompt("Enter folder name:");
  // if (!folderName) return;

  // try {
  //   await api.post("/api/media-folder/", {
  //     title: folderName,
  //     object: props.objectId,
  //     type: props.type,
  //     parent: currentFolder.value ? currentFolder.value.id : null,
  //   });
  //   currentFolder.value
  //     ? fetchFolderContents(currentFolder.value.id)
  //     : fetchTopLevelFolders();
  // } catch (error) {
  //   console.error("Error adding folder:", error);
  // }
};

const getFoldersNow = async () => {
  // notyf.success("Folder created successfully");
  if (selectedParentFolder.value) {
    await fetchFolderContents(selectedParentFolder.value);
  } else {
    await fetchTopLevelFolders();
  }
};

const openAddFileModal = async () => {
  selectedObject.value = currentFolder.value
    ? currentFolder.value.id
    : props.objectId;
  if (props.type === "photos") {
    openPhotoModal.value = true;
  } else {
    openFileModal.value = true;
  }
};

const deleteFolder = async () => {
  try {
    SweetAlertProps.value.isSweetAlertOpen = false;
    await api.delete(`/api/media-folder/${selectedFolderToDelete.value}/`);
    goBack();
    if (currentFolder.value) {
      await fetchFolderContents(currentFolder.value.id);
    } else {
      await fetchTopLevelFolders();
    }
    notyf.success("Folder deleted successfully");
  } catch (error) {
    console.error("Error deleting folder:", error);
  }
};

const getFolderContent = async () => {
  if (currentFolder.value) {
    await fetchFolderContents(currentFolder.value.id);
  }
};

onMounted(() => {
  fetchTopLevelFolders();
});
</script>

<template>
  <div>
    <div class="card-grid-toolbar">
      <VButton
        color="warning"
        light
        class="mr-1"
        size="medium"
        outlined
        v-if="folderStack.length"
        @click="goBack"
        icon="fas fa-chevron-left"
      >
      </VButton>
      <div>
        <VButton
          v-if="!currentFolder"
          icon="fas fa-folder"
          color="warning"
          light
          bold
          fullwidth
          >Main Folders</VButton
        >
        <VButton
          v-else
          color="warning"
          light
          bold
          fullwidth
          icon="fas fa-folder-open"
          >{{ currentFolder.title }}</VButton
        >
      </div>

      <div class="buttons">
        <VButton
          v-if="currentFolder"
          @click="openAddFileModal"
          color="primary"
          light
          outlined
          raised
        >
          <span class="icon">
            <i aria-hidden="true" class="fas fa-plus" />
          </span>
          <span>{{ props.type == "photos" ? "Photos" : "File" }}</span>
        </VButton>
        <VButton @click="openAddFolderModal" color="info" outlined raised>
          <span class="icon">
            <i aria-hidden="true" class="fas fa-folder-plus" />
          </span>
          <span>Folder</span>
        </VButton>
        <VButton
          v-if="currentFolder"
          @click="openDeleteFolderAlert(currentFolder)"
          color="danger"
          raised
          outlined
        >
          <span class="icon">
            <i aria-hidden="true" class="fas fa-trash" />
          </span>
          <span>Folder</span>
        </VButton>
      </div>
    </div>

    <div>
      <!-- Loading -->
      <div v-if="loading" class="card-grid card-grid-v4">
        <div class="columns is-multiline">
          <div v-for="i in 18" :key="i" class="column is-2">
            <div class="card-grid-item">
              <VPlaceload height="160px" />
            </div>
          </div>
        </div>
      </div>

      <!-- Folders -->
      <div class="card-grid card-grid-v4">
        <TransitionGroup name="list" tag="div" class="columns is-multiline">
          <div
            v-if="folders.length"
            v-for="folder in folders"
            :key="folder.id"
            class="column is-2"
          >
            <a @click="navigateToFolder(folder)" class="card-grid-item">
              <img src="/icons/folders.png" alt="item.title" />
              <div class="card-grid-item-content">
                <h3 class="dark-inverted">{{ folder.title }}</h3>
              </div>
            </a>
          </div>
          <NewDocumentViewer
            v-for="file in files"
            v-if="files.length"
            :key="file.id"
            :file="file"
            @updateOnSuccess="getFolderContent"
          />
        </TransitionGroup>
      </div>

      <div
        v-if="!folders.length && !files.length && !loading"
        class="card-grid card-grid-v4"
      >
        <TransitionGroup name="list" tag="div" class="columns is-multiline">
          <div class="column is-2">
            <div class="card-grid-item">
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
              <div class="card-grid-item-content">
                <h3 class="dark-inverted">No Item Found</h3>
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>
      <UploadDocumentModal
        v-if="openFileModal"
        :openFileModal="openFileModal"
        :object="selectedObject"
        :type="props.type"
        @close:ModalHandler="openFileModal = false"
        @update:OnSuccess="fetchFolderContents(selectedObject)"
      />
      <UploadPhotosModal
        v-if="openPhotoModal"
        :openFileModal="openPhotoModal"
        :object="selectedObject"
        :type="props.type"
        @close:ModalHandler="openPhotoModal = false"
        @update:OnSuccess="fetchFolderContents(selectedObject)"
      />
      <SweetAlert
        v-if="SweetAlertProps.isSweetAlertOpen"
        :title="SweetAlertProps.title"
        :subtitle="SweetAlertProps.subtitle"
        :btntext="SweetAlertProps.btntext"
        :icon="SweetAlertProps.Icon"
        :onCancel="
          () => {
            SweetAlertProps.isSweetAlertOpen = false;
          }
        "
        :onConfirm="deleteFolder"
      ></SweetAlert>
      <CreateFolderModal
        v-if="openCreateFolderModal"
        :open-create-folder-modal="openCreateFolderModal"
        :type="props.type"
        :object="currentFolder.id"
        :parent="selectedParentFolder"
        @update:modalHandler="openCreateFolderModal = false"
        @update:OnSuccess="getFoldersNow"
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
    min-height: 200px;

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
