<script setup lang="ts">
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
// import { files } from "/@src/data/layouts/tile-grid-v2";
import { onceImageErrored } from "/@src/utils/via-placeholder";

const api = useApi();
const notyf = useNotyf();
const Loading = ref(false);
const filters = ref("");

const props = defineProps<{
  projectId: string;
  files: any[];
}>();

const emits = defineEmits<{
  (e: "update:onUploadFile", value: null): void;
}>();

const getProjectDetails = () => {
  emits("update:onUploadFile", null);
};

const filteredData = computed(() => {
  if (!filters.value) {
    return props.files;
  } else {
    return props.files.filter((item) => {
      return item.match(new RegExp(filters.value, "i"));
    });
  }
});

const sheetNameDeleteTobe = ref("");
const selectedFileName = ref("");

const uploadTasksSheet = async (tasksFile: any) => {
  try {
    Loading.value = true;
    const resp = await api.post(`/api/task/bulk-upload/${props.projectId}/`, {
      file: tasksFile,
    });
    notyf.green(`Tasks Will be generated automatically`);
    console.log(resp);
    emits("update:onUploadFile", null);
    Loading.value = false;
  } catch (err) {
    console.log(err);
  }
};

const str = "Internal Notes Spreadsheet.xls on 2024-09-17 14:31:59.913783";

// Regular expression to match date and time
const getDate = (str: any) => {
  const dateTimeRegex = /\d{4}-\d{2}-\d{2}/;
  const timeRegex = /\d{2}:\d{2}:\d{2}\.\d+/;

  const match = str.match(dateTimeRegex);

  if (match) {
    const dateTime = match[0];
    return dateTime; // Output: 2024-09-17 14:31:59.913783
  } else {
    return "N/A";
  }
};

const handleFileSelect = (event) => {
  let csvFile = event.target.files[0];
  uploadTasksSheet(csvFile);
  selectedFileName.value = csvFile.name;
};

const removeFile = () => {
  selectedFileName.value = "";
  document.getElementById("docpicker").value = "";
};

const SweetAlertProps = ref({
  title: "",
  subtitle: "test",
  isSweetAlertOpen: false,
  btntext: "text",
});

const openSheetDeleteAlert = (sheetName: any) => {
  sheetNameDeleteTobe.value = sheetName;
  SweetAlertProps.value = {
    title: "Are you sure?",
    subtitle:
      "This file and all task generated from this file will be deleted permanently!",
    btntext: "Yes, Delete it",
    isSweetAlertOpen: true,
  };
};

const deleteSheetTasks = async () => {
  try {
    Loading.value = true;
    const resp = await api.patch(
      `/api/project/${props.projectId}/delete-doc-tasks/`,
      {
        document_name: sheetNameDeleteTobe.value,
      }
    );
    emits("update:onUploadFile", null);
    notyf.success("Sheet deleted successfully!");
    SweetAlertProps.value.isSweetAlertOpen = false;
  } catch (err) {
    console.log(err);
  } finally {
    Loading.value = false;
  }
};

const valueSingle = ref(0);
const optionsSingle = [
  "All Files",
  "Recently Updated",
  "My Files",
  "Team Files",
  "Deprecated",
];
</script>

<template>
  <div>
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

        <VField grouped>
          <VControl>
            <div class="file">
              <label class="file-label">
                <input
                  @change="handleFileSelect"
                  class="file-input"
                  type="file"
                  name="file"
                  style="background-color: var(--primary); color: #fff"
                />
                <span
                  style="background-color: var(--primary); color: #fff"
                  class="file-cta"
                >
                  <span class="file-icon">
                    <i class="fas fa-plus" />
                  </span>
                  <span class="file-label"> File </span>
                </span>
              </label>
            </div>
          </VControl>
        </VField>
      </div>
    </div>

    <div class="tile-grid tile-grid-v2">
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

      <!--Tile Grid v1-->
      <TransitionGroup name="list" tag="div" class="columns is-multiline">
        <!--Grid item-->
        <div v-for="item in filteredData" :key="item.id" class="column is-6">
          <div class="tile-grid-item">
            <div class="tile-grid-item-inner">
              <img
                src="/images/icons/files/sheet.svg"
                alt=""
                @error.once="onceImageErrored(150)"
              />
              <div class="meta">
                <span class="dark-inverted">{{
                  item.length > 20 ? item.slice(0, 24) : item
                }}</span>
                <span>
                  <span>Updated: {{ getDate(item) }}</span>
                </span>
              </div>
              <VDropdown icon="feather:more-vertical" spaced right>
                <template #content>
                  <!-- <a role="menuitem" href="#" class="dropdown-item is-media">
                    <div class="icon">
                      <i aria-hidden="true" class="lnil lnil-cloud-download" />
                    </div>
                    <div class="meta">
                      <span>Download</span>
                      <span>Download this file</span>
                    </div>
                  </a>
                  <hr class="dropdown-divider" /> -->
                  <a
                    @click="openSheetDeleteAlert(item)"
                    role="menuitem"
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
        </div>
      </TransitionGroup>
    </div>
  </div>
  <SweetAlert
    v-if="SweetAlertProps.isSweetAlertOpen"
    :isSweetAlertOpen="SweetAlertProps.isSweetAlertOpen"
    :title="SweetAlertProps.title"
    :subtitle="SweetAlertProps.subtitle"
    :btntext="SweetAlertProps.btntext"
    :onConfirm="deleteSheetTasks"
    :onCancel="() => (SweetAlertProps.isSweetAlertOpen = false)"
  />
</template>

<style scoped lang="scss">
@import "/@src/scss/abstracts/all";

.tile-grid-toolbar .buttons .field {
  min-width: 50px;
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
