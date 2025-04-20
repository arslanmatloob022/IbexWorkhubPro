<script setup lang="ts">
import { posts } from "/@src/data/layouts/card-grid-v4";
import { onceImageErrored } from "/@src/utils/via-placeholder";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";

const api = useApi();
const notyf = useNotyf();

const emits = defineEmits<{
  (e: "updateOnSuccess", value: any): void;
}>();

const props = defineProps<{
  file?: {};
}>();

const selectedFileToDelete = ref("");
const objectsFiles = ref([]);
const documentToView = ref("");
const openDocViewModal = ref(false);
const documentTitle = ref("");
const DocumentType = ref("");
const openDocViewModalHandler = (doc: any) => {
  documentToView.value = doc.file_info?.url;
  DocumentType.value = doc.file_info?.type;
  documentTitle.value = doc.title;
  openDocViewModal.value = !openDocViewModal.value;
};
const getFilesIcons = {
  pdf: "/images/icons/files/pdf.svg",
  xls: "/images/icons/files/sheet.svg",
  doc: "/images/icons/files/doc-2.svg",
  ppt: "/images/icons/files/ppt.svg",
  ai: "/images/icons/files/ai.svg",
  docx: "/images/icons/files/doc-2.svg",
  docs: "/images/icons/files/doc-2.svg",
  xlsx: "/images/icons/files/sheet.svg",
  ai2: "/images/icons/files/ai.svg",
  xlx: "/images/icons/files/sheet.svg",
  ods: "/images/icons/files/sheet.svg",
  png: "/icons/png-icon.png",
  jpg: "/icons/jpg-50.png",
  jpeg: "/icons/jpg-50.png",
  mp4: "/images/icons/files/video.svg",
};
const SweetAlertProps = ref({
  title: "",
  subtitle: "test",
  isSweetAlertOpen: false,
  btntext: "text",
  icon: "",
});

const openDeleteFileAlert = (id: any) => {
  selectedFileToDelete.value = id;
  SweetAlertProps.value = {
    title: " Delete this file?",
    subtitle: "This file will be deleted permanently.",
    isSweetAlertOpen: true,
    btntext: "Delete",
    icon: "fas fa-bell",
  };
};

const deleteFile = async () => {
  try {
    await api.delete(`/api/attachment/${selectedFileToDelete.value}/`);
    emits("updateOnSuccess", null);
    SweetAlertProps.value.isSweetAlertOpen = false;
    notyf.success("File deleted successfully");
  } catch (error) {
    console.error("Error deleting file:", error);
  }
};

onMounted(() => {});
</script>

<template>
  <div class="column is-2">
    <a class="card-grid-item">
      <img
        v-if="
          props.file?.file_info?.type === 'png' ||
          props.file?.file_info?.type === 'jpg' ||
          props.file?.file_info?.type === 'jpeg'
        "
        :src="props.file?.file_info?.url"
        :alt="props.file?.title"
        @click="openDocViewModalHandler(props.file)"
      />

      <img
        v-else
        :src="getFilesIcons[props.file?.file_info?.type]"
        :alt="props.file?.title"
        @click="openDocViewModalHandler(props.file)"
      />
      <div
        class="card-grid-item-content is-flex is-align-items-center space-between"
      >
        <h3 @click="openDocViewModalHandler(props.file)" class="dark-inverted">
          {{ props.file?.title }}
        </h3>
        <i
          @click="openDeleteFileAlert(props.file?.id)"
          class="fas fa-trash danger-text"
        ></i>
      </div>
    </a>
    <DocumentViewer
      v-if="openDocViewModal"
      :openDocViewModal="openDocViewModal"
      :document="documentToView"
      :DocumentType="DocumentType"
      :title="documentTitle"
      @update:closeModalHandler="openDocViewModal = false"
    />
    <SweetAlert
      v-if="SweetAlertProps.isSweetAlertOpen"
      :title="SweetAlertProps.title"
      :subtitle="SweetAlertProps.subtitle"
      :btntext="SweetAlertProps.btntext"
      :icon="SweetAlertProps.icon"
      :onCancel="
        () => {
          SweetAlertProps.isSweetAlertOpen = false;
        }
      "
      :onConfirm="deleteFile"
    >
    </SweetAlert>
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
