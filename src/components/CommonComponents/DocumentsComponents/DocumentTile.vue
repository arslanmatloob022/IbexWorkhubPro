<script setup lang="ts">
import DocumentViewer from "./DocumentViewer.vue";
import { formatDate, formatDateTime } from "/@src/composable/useSupportElement";

const props = defineProps<{
  document?: any;
}>();

const emits = defineEmits<{
  (e: "deleteSelectedFile", value: string): void;
}>();

const documentToView = ref("");
const openDocViewModal = ref(false);
const documentTitle = ref("");

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

const deleteFileHandler = (id: any) => {
  emits("deleteSelectedFile", id);
};

const DocumentType = ref("");
const openDocViewModalHandler = (doc: any) => {
  documentToView.value = doc.file_info?.url;
  DocumentType.value = doc.file_info?.type;
  documentTitle.value = doc.title;
  openDocViewModal.value = !openDocViewModal.value;
};

const downloadFile = async (url: any, fileName: any) => {
  try {
    // Fetch the file from the URL
    const response = await fetch(url);

    // Check if the response is OK (status is in the range 200-299)
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    // Get the file as a blob
    const blob = await response.blob();

    // Create a URL for the blob
    const blobUrl = window.URL.createObjectURL(blob);

    // Create an anchor element
    const anchor = document.createElement("a");
    anchor.href = blobUrl;
    anchor.download = fileName;

    // Append the anchor to the body
    document.body.appendChild(anchor);

    // Programmatically click the anchor to trigger the download
    anchor.click();

    // Remove the anchor from the document
    document.body.removeChild(anchor);

    // Revoke the blob URL to free up memory
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Download failed:", error);
  }
};
</script>

<template>
  <div>
    <div class="tile-grid-item">
      <div class="tile-grid-item-inner">
        <img
          @click="openDocViewModalHandler(props.document)"
          :src="getFilesIcons[props.document?.file_info?.type]"
        />
        <div class="meta">
          <span class="dark-inverted">{{ props.document.title ?? "N/A" }}</span>
          <span>
            <span>{{ props.document?.file_info?.size ?? 0 }} MB</span>
            <i aria-hidden="true" class="fas fa-circle icon-separator" />
            <span>At:{{ formatDate(props.document.created_at) }}</span>
          </span>
        </div>
        <VDropdown icon="feather:more-vertical" spaced right>
          <template #content>
            <a
              role="menuitem"
              @click="downloadFile(props.document.file, props.document.title)"
              class="dropdown-item is-media"
            >
              <div class="icon">
                <i aria-hidden="true" class="lnil lnil-cloud-download" />
              </div>
              <div class="meta">
                <span>Download</span>
                <span>Download this file</span>
              </div>
            </a>

            <hr class="dropdown-divider" />
            <a
              role="menuitem"
              @click="deleteFileHandler(props.document.id)"
              class="dropdown-item is-media"
            >
              <div class="icon">
                <i aria-hidden="true" class="lnil lnil-trash-can-alt" />
              </div>
              <div class="meta">
                <span>Delete</span>
                <span>Delete this file</span>
              </div>
            </a>
          </template>
        </VDropdown>
      </div>
    </div>
    <DocumentViewer
      v-if="openDocViewModal"
      :openDocViewModal="openDocViewModal"
      :document="documentToView"
      :DocumentType="DocumentType"
      :title="documentTitle"
      @update:closeModalHandler="openDocViewModal = false"
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
