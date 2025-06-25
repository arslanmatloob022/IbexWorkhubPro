<script setup lang="ts">
import { useNotyf } from "/@src/composable/useNotyf";
import { useApi } from "/@src/composable/useAPI";
import { convertToFormData } from "/@src/composable/useSupportElement";
import { useUserSession } from "/@src/stores/userSession";
import { CreateActivityLog } from "/@src/composable/useSupportElement";
const fileInput = ref<HTMLInputElement | null>(null);
const api = useApi();
const notyf = useNotyf();
const loading = ref(false);
const userSession = useUserSession();

const props = defineProps<{
  openFileModal?: boolean;
  type?: string;
  object?: string;
}>();

const emit = defineEmits<{
  (e: "close:ModalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: null): void;
}>();

const closeModalHandler = () => {
  emit("close:ModalHandler", false);
};

const updateOnSuccess = () => {
  emit("update:OnSuccess", null);
};

const fileData = ref({
  type: props.type,
  object: props.object,
  title: "",
  uploaded_by: userSession.user.id,
  file: null as File | null,
});

const uploadFileHandler = async () => {
  try {
    loading.value = true;
    const payload = convertToFormData(fileData.value, ["file"]);
    const response = await api.post(`/api/attachment/`, payload);
    getFileUploadingStatus(response.data.task_id);
    CreateActivityLog({
      object_type: "files",
      object_id: props.object,
      action: "CREATE",
      message: `Uploaded new file named <b>${fileData.value.title}</b>.`,
      performedOnName: "job",
    });
    notyf.success("File uploaded successfully!");
    updateOnSuccess();
    closeModalHandler();
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const getFileUploadingStatus = async (id: any) => {
  try {
    const resp = await api.get(`api/upload-status/${id}/`);
    notyf.green(`res: ${resp.data}`);
  } catch (err) {
    console.log(err);
  }
};

const selectedFileTitle = ref("");
const triggerFileInput = (): void => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};
// const handleFileChange = (event: Event) => {
//   const input = event.target as HTMLInputElement;
//   const selectedFile = input.files?.[0];
//   input.value = "";
//   if (selectedFile) {
//     fileData.value.file = selectedFile;
//     selectedFileTitle.value = selectedFile.name;
//   }
// };

const filesNames = ref([]);

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const files = Array.from(target.files);
    fileData.value.file = files;
    filesNames.value = files.map((file) => file.name);
    selectedFileTitle.value =
      files.length > 1 ? `${files.length} photos selected` : files[0].name;

    if (fromCamera.value) {
      // 🔧 Upload immediately if taken from camera
      fileData.value.title = files[0].name;
      await uploadFileHandler();
    }
  }

  // Reset input so that same file can be selected again
  if (fileInput.value) fileInput.value.value = "";
};

onMounted(() => {});
</script>
<template>
  <VModal
    is="form"
    :open="props.openFileModal"
    title="Add Attachment"
    size="medium"
    actions="right"
    @submit.prevent="uploadFileHandler"
    @close="closeModalHandler"
  >
    <template #content>
      <div class="modal-form columns is-multiline">
        <!-- <div class="column is-full">
          <div class="field">
            <label class="label">Title </label>
            <div class="control">
              <input
                type="text"
                required
                class="input"
                placeholder="Enter Title"
                v-model="fileData.title"
              />
            </div>
          </div>
        </div> -->
        <div class="field column is-half">
          <VField grouped>
            <VControl>
              <div class="file">
                <label class="file-label">
                  <input
                    @change="handleFileChange"
                    class="file-input"
                    type="file"
                    name="resume"
                    multiple
                  />
                  <span class="file-cta">
                    <span class="file-icon">
                      <i class="fas fa-cloud-upload-alt" />
                    </span>
                    <span class="file-label">
                      {{
                        selectedFileTitle ? selectedFileTitle : "Choose a file…"
                      }}
                    </span>
                  </span>
                </label>
              </div>
            </VControl>
          </VField>
        </div>
        <div class="column is-full">
          <p>Selected Photos</p>
          <span v-for="file in filesNames"> {{ file }} <br /> </span>
        </div>
      </div>
    </template>
    <template #action>
      <VButton type="submit" color="primary" :loading="loading" raised>
        Save</VButton
      >
    </template>
    <template #cancel>
      <VButton color="light" @click="closeModalHandler" raised>Close </VButton>
    </template>
  </VModal>
</template>
<style lang="scss" scoped></style>
