<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useApi } from "/@src/composable/useAPI";

const api = useApi();

const props = defineProps({
  objectId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

// Stack to manage navigation (each element = a folder level)
const folderStack = ref<any[]>([]);

// Currently viewed folder (null = root)
const currentFolder = computed(
  () => folderStack.value[folderStack.value.length - 1] || null
);

const folders = ref<any[]>([]);
const files = ref<any[]>([]);
const loading = ref(false);

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
    // console.log("fileder", folderId);
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

// Add new folder
const openAddFolderModal = async () => {
  const folderName = prompt("Enter folder name:");
  if (!folderName) return;

  try {
    await api.post("/api/media-folder/", {
      title: folderName,
      object: props.objectId,
      type: props.type,
      parent: currentFolder.value ? currentFolder.value.id : null,
    });
    currentFolder.value
      ? fetchFolderContents(currentFolder.value.id)
      : fetchTopLevelFolders();
  } catch (error) {
    console.error("Error adding folder:", error);
  }
};

const selectedObject = ref("");
const openFileModal = ref(false);
const openAddFileModal = async () => {
  selectedObject.value = currentFolder.value
    ? currentFolder.value.id
    : props.objectId;
  openFileModal.value = true;

  // prompt(`${currentFolder.value.title} and id ${currentFolder.value.id}`);
  // const fileTitle = prompt("Enter file title:");
  // if (!fileTitle) return;

  // try {
  //   await api.post("/api/attachment/", {
  //     title: fileTitle,
  //     object: currentFolder.value ? currentFolder.value.id : props.objectId,
  //     type: props.type,
  //     file: "https://example.com/path-to-your-file",
  //   });
  //   if (currentFolder.value) {
  //     await fetchFolderContents(currentFolder.value.id);
  //   }
  // } catch (error) {
  //   console.error("Error adding file:", error);
  // }
};

// Delete folder
const deleteFolder = async (folderId: string) => {
  if (!confirm("Are you sure you want to delete this folder?")) return;

  try {
    await api.delete(`/api/media-folder/${folderId}/`);
    if (currentFolder.value) {
      await fetchFolderContents(currentFolder.value.id);
    } else {
      await fetchTopLevelFolders();
    }
  } catch (error) {
    console.error("Error deleting folder:", error);
  }
};

// Delete file
const deleteFile = async (fileId: string) => {
  if (!confirm("Are you sure you want to delete this file?")) return;

  try {
    await api.delete(`/api/attachment/${fileId}/`);
    if (currentFolder.value) {
      await fetchFolderContents(currentFolder.value.id);
    }
  } catch (error) {
    console.error("Error deleting file:", error);
  }
};

// Initial load
onMounted(() => {
  fetchTopLevelFolders();
});
</script>

<template>
  <div>
    <div class="card-grid-toolbar">
      <VButton
        color="dark"
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
        <span v-if="!currentFolder">📂 Root Folders</span>
        <span v-else>📂 {{ currentFolder.title }}</span>
      </div>
      <!-- <VControl icon="feather:search">
        <input
          v-model="filters"
          class="input custom-text-filter"
          placeholder="Search..."
        />
      </VControl> -->

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
        <VButton @click="openAddFileModal" color="primary" raised>
          <span class="icon">
            <i aria-hidden="true" class="fas fa-plus" />
          </span>
          <span>File</span>
        </VButton>
        <VButton @click="openAddFolderModal" color="info" raised>
          <span class="icon">
            <i aria-hidden="true" class="fas fa-folder-plus" />
          </span>
          <span>Folder</span>
        </VButton>
        <VButton
          @click.stop="deleteFolder(currentFolder.id)"
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

    <div>
      <!-- <h1 class="text-2xl font-bold">📁 Folder Navigator</h1>
      <div class="mb-4 flex justify-between">
        <div>
          <span v-if="!currentFolder">📂 Root Folders</span>
          <span v-else>📂 {{ currentFolder.title }}</span>
        </div>
        <div class="space-x-2">
          <button v-if="folderStack.length" @click="goBack" class="btn">
            ⬅️ Back
          </button>
          <button @click="openAddFolderModal" class="btn">+ Folder</button>
          <button @click="openAddFileModal" class="btn">+ File</button>
        </div>
      </div> -->

      <!-- Loading -->
      <div v-if="loading" class="text-gray-500 text-sm">Loading...</div>

      <!-- Folders -->
      <div v-if="folders.length" class="card-grid card-grid-v4">
        <TransitionGroup name="list" tag="div" class="columns is-multiline">
          <div v-for="folder in folders" :key="folder.id" class="column is-2">
            <a @click="navigateToFolder(folder)" class="card-grid-item">
              <img src="/icons/folders.png" alt="item.title" />
              <div class="card-grid-item-content">
                <h3 class="dark-inverted">{{ folder.title }}</h3>
              </div>
            </a>
            <!-- <span @click="navigateToFolder(folder)" class="flex-1"
              >📁 {{ folder.title }}</span
            >
            <button
              @click.stop="deleteFolder(folder.id)"
              class="btn-sm text-red-600"
            >
              🗑
            </button> -->
          </div>
        </TransitionGroup>
      </div>

      <!-- Files -->
      <div v-if="files.length" class="space-y-2 mt-4">
        <div
          v-for="file in files"
          :key="file.id"
          class="flex justify-between items-center p-2 bg-white rounded shadow-sm"
        >
          <span class="flex-1">📄 {{ file.title }}</span>
          <button @click="deleteFile(file.id)" class="btn-sm text-red-600">
            🗑
          </button>
        </div>
      </div>

      <div
        v-if="!folders.length && !files.length && !loading"
        class="text-gray-400 text-sm"
      >
        This folder is empty.
      </div>
      <UploadDocumentModal
        v-if="openFileModal"
        :openFileModal="openFileModal"
        :object="selectedObject"
        :type="props.type"
        @close:ModalHandler="openFileModal = false"
        @update:OnSuccess="fetchFolderContents(selectedObject)"
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
