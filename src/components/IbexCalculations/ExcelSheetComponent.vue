<script setup lang="ts">
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { HotTable } from "@handsontable/vue3";
import "handsontable/dist/handsontable.full.min.css";
import { ref, onMounted, nextTick } from "vue";
import {
  convertToFormData,
  formatDateTime,
} from "/@src/composable/useSupportElement";
import { useUserSession } from "/@src/stores/userSession";

const userSession = useUserSession();
const hotTable = ref<InstanceType<typeof HotTable> | null>(null);
const api = useApi();
const notyf = useNotyf();
const loading = ref(false);
const sheetDataNew = ref<string[][]>([[""]]);
const filesList = ref([]);
const templatesList = ref([]);
const filters = ref("");
const addFileModal = ref(false);
const sheetNameDeleteTobe = ref("");
const selectedFileName = ref("");
const start = ref("");
let myFile: File | null = null;

const props = defineProps<{
  fetchAll?: {
    type: Boolean;
    default: true;
  };
  fetchTemplates?: {
    type: Boolean;
    default: false;
  };
  userId?: string;
  objectId?: string;
}>();

const openEditorModal = ref(false);
const selectedFileId = ref(0);
const uploadExcelData = ref({
  file: "",
  title: "",
  object: props.objectId,
});

const handleFileSelect = (event) => {
  let csvFile = event.target.files[0];
  uploadExcelData.value.file = csvFile;
  selectedFileName.value = csvFile.name;
  uploadExcelData.value.title = csvFile.name;
};
const selectedTemplateValue = ref("");
const selectTemplateOptions = ref([
  {
    value: "javascript",
    name: "Javascript",
    icon: "/images/icons/stacks/js.svg",
  },
]);

const getAllSheets = async () => {
  try {
    loading.value = true;
    const response = await api.get(
      `/api/excel-files/?object=${props.objectId}`
    );
    filesList.value = response.data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const getAllTemplates = async () => {
  try {
    loading.value = true;
    const response = await api.get(`/api/excel-files/templates/`);
    templatesList.value = response.data;
    selectTemplateOptions.value = templatesList.value.map((item) => ({
      value: item.id,
      name: item.title,
    }));
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const getUserSheets = async () => {
  try {
    loading.value = true;

    const response = await api.get(`/api/excel-files/by-user/${props.userId}/`);
    filesList.value = response.data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
const openExcelEditor = (id: any = "") => {
  selectedFileId.value = id;
  openEditorModal.value = true;
};

const loadingTask = ref(false);
const uploadTasksSheet = async () => {
  try {
    loadingTask.value = true;
    const payload = convertToFormData(uploadExcelData.value, [""]);
    const response = await api.post(`/api/excel-files/upload-excel/`, payload);
    getAllSheets();
    notyf.success("Sheet uploaded successfully");
  } catch (error) {
    console.error(error);
  } finally {
    loadingTask.value = false;
    addFileModal.value = false;
  }
};

const uploadSheetFromTemplate = async (id: any) => {
  try {
    loadingTask.value = true;

    const response = await api.post(
      `/api/excel-files/create-from-template/${id}/`
    );
    notyf.success("Sheet create successfully");
    getAllSheets();
  } catch (error) {
    console.error(error);
  } finally {
    loadingTask.value = false;
    addFileModal.value = false;
  }
};

watch(
  () => selectedTemplateValue.value,
  (newValue) => {
    if (newValue) {
      uploadSheetFromTemplate(newValue);
    }
  }
);

const deleteSheetHandler = async (id: any) => {
  try {
    await api.delete(`/api/excel-files/${id}/`);
    notyf.success("Sheet deleted successfully!");
    getAllSheets();
  } catch (error) {
    console.error(error);
    notyf.error("Failed to delete sheet.");
  }
};
const calTab = ref("excel");
const filteredPendingData = computed(() => {
  if (!filters.value) {
    return filesList.value.filter((item) => item.is_template == false);
  } else {
    const filterRe = new RegExp(filters.value, "i");

    return filesList.value.filter((item) => {
      return item.title?.match(filterRe) && item.is_template == false;
    });
  }
});

const filteredTemplatesData = computed(() => {
  if (!filters.value) {
    return templatesList.value;
  } else {
    const filterRe = new RegExp(filters.value, "i");

    return templatesList.value.filter((item) => {
      return item.title?.match(filterRe);
    });
  }
});

onMounted(async () => {
  if (props.fetchAll) {
    await getAllSheets();
  }
  if (props.userId) {
    getUserSheets();
  }
  getAllTemplates();

  await getAllSheets();
});
</script>

<template>
  <PlaceloadV4 v-if="loading" />
  <div v-else>
    <div class="columns is-multiline">
      <div class="list-flex-toolbar is-reversed column is-12">
        <VButtons>
          <VField style="width: 260px" v-slot="{ id }">
            <VControl>
              <Multiselect
                v-model="selectedTemplateValue"
                :attrs="{ id }"
                placeholder="Create with template"
                label="name"
                :options="selectTemplateOptions"
                :searchable="true"
                track-by="name"
                :max-height="145"
              >
                <template #singlelabel="{ value }">
                  <div class="multiselect-single-label">
                    <img class="select-label-icon" :src="value.icon" alt="" />
                    {{ value.name }}
                  </div>
                </template>
                <template #option="{ option }">
                  <img class="select-option-icon" :src="option.icon" alt="" />
                  {{ option.name }}
                </template>
              </Multiselect>
            </VControl>
          </VField>
          <VButton
            icon="fas fa-plus"
            color="info"
            outlined
            light
            class="ml-2"
            raised
            @click="openExcelEditor()"
            >New Sheet</VButton
          >
          <VButton
            icon="fas fa-upload"
            raised
            light
            @click="addFileModal = !addFileModal"
            outlined
            color="primary"
          >
            File
          </VButton>
        </VButtons>
        <div class="is-flex">
          <VControl class="mr-2 h-hidden-mobile" icon="feather:search">
            <input
              v-model="filters"
              class="input custom-text-filter"
              placeholder="Search..."
            />
          </VControl>
        </div>
      </div>
      <!-- <div class="columns is-multiline"> -->
      <div
        v-if="filteredPendingData.length"
        class="column is-6"
        v-for="(item, index) in filteredPendingData"
        :key="item.id"
      >
        <div class="card p-4 curved is-flex space-between">
          <div>
            <h4 class="subtitle is-5 m-0">{{ item.title }}</h4>
            <div class="content">
              <p>
                {{ formatDateTime(item.created_at) }}
              </p>
            </div>
          </div>
          <div class="is-flex">
            <VIconWrap
              icon="lucide:pen"
              color="info"
              class="cu-pointer"
              @click="openExcelEditor(item.id)"
              has-background
            />
            <VIconWrap
              @click="deleteSheetHandler(item.id)"
              icon="lucide:trash"
              color="danger"
              has-background
              class="cu-pointer ml-1"
            />
          </div>
        </div>
      </div>
      <div v-else>
        <h1 class="title is-4">No File Uploaded</h1>
      </div>
      <!-- </div> -->
    </div>

    <ExcelFileEditor
      v-if="openEditorModal"
      class="fullscreen"
      :excel-file-modal="openEditorModal"
      :fileId="selectedFileId"
      :object-id="props.objectId"
      :isTemplate="false"
      @update:modalHandler="
        openEditorModal = false;
        getAllSheets();
      "
    />
    <VModal
      is="form"
      :open="addFileModal"
      title="Upload Task File"
      size="medium"
      actions="right"
      @close="addFileModal = false"
      @submit.prevent="uploadTasksSheet"
    >
      <template #content>
        <div class="modal-form columns is-multiline">
          <VField class="column is-12">
            <VLabel>File Title</VLabel>
            <VControl>
              <VInput v-model="uploadExcelData.title" type="text" />
            </VControl>
          </VField>
          <VField class="column is-12" grouped>
            <VControl>
              <div class="file has-name">
                <label class="file-label">
                  <input
                    @change="handleFileSelect"
                    class="file-input"
                    type="file"
                    name="file"
                    required
                  />
                  <span class="file-cta">
                    <span class="file-icon">
                      <i class="fas fa-cloud-upload-alt" />
                    </span>
                    <span class="file-label"> Choose a file… </span>
                  </span>
                  <span class="file-name light-text">
                    {{
                      selectedFileName ? selectedFileName : "Upload any file"
                    }}
                  </span>
                </label>
              </div>
            </VControl>
          </VField>
        </div>
      </template>

      <template #cancel>
        <VButton @click="addFileModal = false" raised>Close</VButton>
      </template>
      <template #action>
        <VButton type="submit" color="primary" raised>Upload</VButton>
      </template>
    </VModal>
  </div>
</template>
<style lang="scss" scoped>
.fullscreen {
  position: fixed; /* Stays fixed on the screen */
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #fff; /* Optional background */
  z-index: 9999;
  display: flex;
  padding: 12px;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 24px;
}
</style>
