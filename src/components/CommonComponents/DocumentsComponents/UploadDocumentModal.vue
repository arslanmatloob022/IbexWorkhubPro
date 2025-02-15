<script setup lang="ts">
import { useNotyf } from "/@src/composable/useNotyf";
import { useApi } from "/@src/composable/useAPI";
import { convertToFormData } from "/@src/composable/useSupportElement";

const fileInput = ref<HTMLInputElement | null>(null);
const api = useApi();
const notyf = useNotyf();
const loading = ref(false);

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

const fileData = ref({
  type: props.type,
  object: props.object,
  title: "",
  uploaded_by: "",
  file: null as File | null,
});

const uploadFileHandler = async () => {
  try {
    loading.value = true;
    const payload = convertToFormData(fileData.value, ["file"]);
    const response = await api.post(`/api/attachment/`, payload);
    notyf.success("File uploaded successfully!");
    closeModalHandler();
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const selectedFileTitle = ref("");
const triggerFileInput = (): void => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};
const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const selectedFile = input.files?.[0];
  input.value = "";
  if (selectedFile) {
    fileData.value.file = selectedFile;
    selectedFileTitle.value = selectedFile.name;
  }
};

onMounted(() => {});
</script>
<template>
  <VModal
    is="form"
    :open="props.openFileModal"
    title="Attach File"
    size="medium"
    actions="right"
    @submit.prevent="uploadFileHandler"
    @close="closeModalHandler"
  >
    <template #content>
      <div class="modal-form columns is-multiline">
        <div class="column is-full">
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
        </div>
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
      </div>
    </template>
    <template #action>
      <VButton type="submit" color="primary" :loading="loading" raised>
        Schedule Mail</VButton
      >
    </template>
    <template #cancel>
      <VButton color="light" @click="closeModalHandler" raised>Close </VButton>
    </template>
  </VModal>
</template>
<style lang="scss" scoped></style>
