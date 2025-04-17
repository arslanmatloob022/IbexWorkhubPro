<script setup lang="ts">
import { posts } from "/@src/data/layouts/card-grid-v4";
import { onceImageErrored } from "/@src/utils/via-placeholder";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";

const api = useApi();
const notyf = useNotyf();
const foldersList = ref([
  {
    id: "fe78f420-32a5-410b-9410-046ef07e850b",
    subfolders: [
      {
        id: "249a9a2c-6847-4c1b-a04c-5724e7bdf3d0",
        subfolders: [],
        title: "Child Folcer",
        value: "childfolcer",
        object: "1be101da-7a93-43af-b3e3-d1ca908aa2c9",
        type: "Test Folder",
        file_type: null,
        description: "",
        viewPermissions: [],
        uploadPermissions: [],
        created_at: "2025-04-14T17:28:34.657537Z",
        updated_at: "2025-04-14T17:28:34.657551Z",
        created_by: null,
        parent: "fe78f420-32a5-410b-9410-046ef07e850b",
      },
      {
        id: "8b1ff654-1883-4bab-889d-daeba4d2fa1a",
        subfolders: [],
        title: "Sub Folder New",
        value: "subfoldernew",
        object: "1be101da-7a93-43af-b3e3-d1ca908aa2c9",
        type: "Test Folder",
        file_type: null,
        description: "",
        viewPermissions: [],
        uploadPermissions: [],
        created_at: "2025-04-14T19:50:46.260487Z",
        updated_at: "2025-04-14T19:50:46.260500Z",
        created_by: null,
        parent: "fe78f420-32a5-410b-9410-046ef07e850b",
      },
    ],
    title: "Test Folder",
    value: "testfolder",
    object: "1be101da-7a93-43af-b3e3-d1ca908aa2c9",
    type: "documents",
    file_type: null,
    description: "",
    viewPermissions: [],
    uploadPermissions: [],
    created_at: "2025-04-13T13:03:54.348759Z",
    updated_at: "2025-04-13T13:03:54.348772Z",
    created_by: null,
    parent: null,
  },
]);

const emits = defineEmits<{
  (e: "getAllFolder", folder: string): void;
}>();

const props = defineProps<{
  type?: string;
  parent?: string;
}>();

const selectedFolder = ref("");
const openFolder = ref(false);
const folderType = ref("");
const openCreateFolderModal = ref(false);
const selectedType = ref("");
const Loading = ref(false);
const openFileModal = ref(false);
const filters = ref("");
const valueSingle = ref(0);
const optionsSingle = [
  "All Posts",
  "Recent Posts",
  "Older Posts",
  "Popular Posts",
];
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
const openFileUploaderModal = () => {
  selectedType.value = props.type;
  openFileModal.value = !openFileModal.value;
};
const selectedParent = ref("");
const addFolderHandler = (parent: any = "") => {
  selectedParent.value = parent;
  openCreateFolderModal.value = !openCreateFolderModal.value;
};
const openFolderHandler = (folder: any) => {
  selectedFolder.value = folder;
  openFolder.value = true;
};

const getMediaFolders = async () => {
  try {
    const resp = await api.get(`/api/media-folder/?parent=${props.parent}`);
    foldersList.value = resp.data.filter((item) => {
      return item.parent === null;
    });
  } catch (err) {
    console.log(err);
  }
};

const objectsFiles = ref([]);

const getObjectFiles = async () => {
  try {
    Loading.value = true;
    const resp = await api.get(
      `/api/attachment/by-object/${props.object}/?type=${props.type}`
    );
    objectsFiles.value = resp.data;
  } catch (err) {
    console.log(err);
  } finally {
    Loading.value = false;
  }
};

const filteredData = computed(() => {
  if (!filters.value) {
    return foldersList.value;
  } else {
    return foldersList.value.filter((item) => {
      return (
        item.title.match(new RegExp(filters.value, "i")) ||
        item.type.match(new RegExp(filters.value, "i"))
      );
    });
  }
});

watch(
  () => props.object,
  () => {
    getMediaFolders();
    getObjectFiles();
  }
);

onMounted(() => {
  getMediaFolders();
  getObjectFiles();
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
        @click="openFolder = !openFolder"
        icon="fas fa-chevron-left"
      >
      </VButton>
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
        <VButton @click="addFolderHandler()" color="info" raised>
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

    <div v-if="!openFolder" class="card-grid card-grid-v4">
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
        <div
          v-for="(item, index) in filteredData"
          :key="index"
          class="column is-2"
        >
          <a @click="openFolderHandler(item.id)" class="card-grid-item">
            <img
              src="/icons/folders.png"
              alt="item.title"
              @error.once="onceImageErrored(400, 300)"
            />
            <div class="card-grid-item-content">
              <h3 class="dark-inverted">{{ item.title }}</h3>
            </div>
          </a>
        </div>
        <div v-for="item in objectsFiles" :key="item.id" class="column is-2">
          <a class="card-grid-item">
            <img
              src="/icons/pdf.png"
              alt="item.title"
              @error.once="onceImageErrored(400, 300)"
            />
            <div class="card-grid-item-content">
              <h3 class="dark-inverted">{{ item.title }}</h3>
            </div>
          </a>
        </div>
      </TransitionGroup>

      <CreateFolderModal
        v-if="openCreateFolderModal"
        :open-create-folder-modal="openCreateFolderModal"
        :type="props.type"
        :object="props.object"
        :parent="openFolder ? selectedParent : ''"
        @update:modal-handler="openCreateFolderModal = false"
        @update:on-success=""
      />
      <SweetAlert
        v-if="SweetAlertProps.isSweetAlertOpen"
        :isSweetAlertOpen="SweetAlertProps.isSweetAlertOpen"
        :title="SweetAlertProps.title"
        :subtitle="SweetAlertProps.subtitle"
        :btntext="SweetAlertProps.btntext"
        :onConfirm="deleteFolderHandler"
        :onCancel="() => (SweetAlertProps.isSweetAlertOpen = false)"
      />
      <UploadDocumentModal
        v-if="openFileModal"
        :openFileModal="openFileModal"
        :object="props.object"
        :type="selectedType"
        @close:ModalHandler="openFileModal = false"
        @update:OnSuccess="getObjectFiles"
      />
    </div>
    <!-- <JobFolders
      v-if="openFolder"
      :isChild="true"
      :type="props.type"
      :object="selectedFolder"
    /> -->
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
