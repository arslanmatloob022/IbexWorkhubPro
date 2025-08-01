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
const selectedFileTitle = ref("");
const filesNames = ref([]);

const props = defineProps<{
  openFileModal?: boolean;
  type?: string;
  object?: string;
}>();

const emit = defineEmits<{
  (e: "close:ModalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: null): void;
  (e: "updateTask:OnSuccess", value: null): void;
}>();

const closeModalHandler = () => {
  emit("close:ModalHandler", false);
};

const updateTaskOnSuccess = (task: any) => {
  emit("updateTask:OnSuccess", task);
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
    CreateActivityLog({
      object_type: "files",
      object_id: props.object,
      action: "CREATE",
      message: `Uploaded new file named <b>${fileData.value.title}</b>.`,
      performedOnName: "job",
    });
    notyf.success("File uploaded successfully!");
    updateTaskOnSuccess(response.data.task_id);
    updateOnSuccess();
    closeModalHandler();
  } catch (err) {
    console.log(err);
    notyf.error(
      "The selected files are too large. Please try again with fewer or smaller files."
    );
  } finally {
    loading.value = false;
  }
};

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const files = Array.from(target.files);
    fileData.value.file = files;
    filesNames.value = files.map((file) => file.name);
    selectedFileTitle.value =
      files.length > 1 ? `${files.length} files selected` : files[0].name;

    if (fromCamera.value) {
      // 🔧 Upload immediately if taken from camera
      fileData.value.title = files[0].name;
      await uploadFileHandler();
    }
  }
  if (fileInput.value) fileInput.value.value = "";
};

onMounted(() => {});
</script>
<template>
  <VModal
    is="form"
    :open="props.openFileModal"
    title="Add Attachment"
    size="small"
    actions="center"
    @submit.prevent="uploadFileHandler"
    @close="closeModalHandler"
  >
    <template #content>
      <div class="modal-form columns is-multiline">
        <div class="field column is-full is-justify-content-center">
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
                        selectedFileTitle
                          ? selectedFileTitle
                          : "Choose file(s)…"
                      }}
                    </span>
                  </span>
                </label>
              </div>
            </VControl>
          </VField>
        </div>
        <div v-if="filesNames.length" class="column is-full">
          <p>Selected Files</p>
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
