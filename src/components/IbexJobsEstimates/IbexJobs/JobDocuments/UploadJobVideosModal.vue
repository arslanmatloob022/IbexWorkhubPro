<script setup lang="ts">
import { useNotyf } from "/@src/composable/useNotyf";
import { useApi } from "/@src/composable/useAPI";
import { convertToFormData } from "/@src/composable/useSupportElement";
import { useUserSession } from "/@src/stores/userSession";
import { CreateActivityLog } from "/@src/composable/useSupportElement";

const api = useApi();
const notyf = useNotyf();
const loading = ref(false);
const userSession = useUserSession();
const selectedFileTitle = ref("");
const fileInput = ref<HTMLInputElement | null>(null);
const fromCamera = ref(false);

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
  file: null as File[] | null,
});

const uploadFileHandler = async () => {
  if (!fileData.value.file || fileData.value.file.length === 0) return;

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
    updateOnSuccess();
    updateTaskOnSuccess(response.data.task_id);
    closeModalHandler();
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// 🔧 Trigger camera directly
const triggerCamera = () => {
  fromCamera.value = true;
  if (fileInput.value) {
    fileInput.value.accept = "image/*";
    fileInput.value.setAttribute("capture", "environment");
    fileInput.value.removeAttribute("multiple");
    fileInput.value.click();
  }
};

// 🔧 Trigger upload from disk
const triggerUpload = () => {
  fromCamera.value = false;
  if (fileInput.value) {
    fileInput.value.accept = "image/*";
    fileInput.value.removeAttribute("capture");
    fileInput.value.setAttribute("multiple", "true");
    fileInput.value.click();
  }
};

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
</script>
<template>
  <VModal
    is="form"
    :open="props.openFileModal"
    title="Upload Video"
    size="small"
    actions="center"
    @submit.prevent="uploadFileHandler"
    @close="closeModalHandler"
  >
    <template #content>
      <div class="modal-form columns is-multiline">
        <!-- Hidden File Input shared by both actions -->
        <input
          ref="fileInput"
          @change="handleFileChange"
          class="file-input"
          type="file"
          accept="video/*"
          style="display: none"
        />

        <!-- Upload from Disk -->
        <div class="column is-12 is-flex is-justify-content-center">
          <VField grouped>
            <VControl>
              <div class="file">
                <label class="file-label" @click.prevent="triggerUpload">
                  <span class="file-cta">
                    <span class="file-icon">
                      <i class="fas fa-cloud-upload-alt" />
                    </span>
                    <span class="file-label">
                      {{
                        selectedFileTitle
                          ? selectedFileTitle
                          : "Choose photo(s)"
                      }}
                    </span>
                  </span>
                </label>
              </div>
            </VControl>
          </VField>
          <VIconBox
            class="ml-2"
            @click="triggerCamera"
            size="small"
            color="info"
            bordered
          >
            <i class="fas fa-camera" aria-hidden="true"></i>
          </VIconBox>
        </div>

        <!-- Take Photo -->
        <div v-if="filesNames.length" class="column is-full text-align-center">
          <p>Selected Photos ({{ filesNames.length }})</p>
          <span v-for="file in filesNames"> {{ file }} <br /> </span>
        </div>
      </div>
    </template>

    <template #action>
      <VButton type="submit" color="primary" :loading="loading" raised>
        Save
      </VButton>
    </template>

    <template #cancel>
      <VButton color="light" @click="closeModalHandler" raised>Close</VButton>
    </template>
  </VModal>
</template>
