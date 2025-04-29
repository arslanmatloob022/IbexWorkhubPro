<script setup lang="ts">
import { useNotyf } from "/@src/composable/useNotyf";
import { useApi } from "/@src/composable/useAPI";
const api = useApi();
const notyf = useNotyf();
const loading = ref(false);

const props = defineProps<{
  openEstimatesModal?: boolean;
  proposalId?: String;
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

const selectedFileTitle = ref("");
const file = ref<File | null>(null);
const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const selectedFile = input.files?.[0];
  input.value = "";
  if (selectedFile) {
    file.value = selectedFile;
    selectedFileTitle.value = selectedFile.name;
  }
};

const createEstimates = async () => {
  try {
    loading.value = true;
    const resp = await api.post(
      `/api/lead-proposal/upload-estimates/${props.proposalId}/`,
      {
        file: file.value,
      }
    );
    notyf.success(`${resp.data}`);
    selectedFileTitle.value = "";
    updateOnSuccess();
  } catch (err) {
    console.log(err);
    notyf.error("File is not supported.");
  } finally {
    loading.value = false;
    closeModalHandler();
  }
};

onMounted(() => {});
</script>
<template>
  <VModal
    is="form"
    :open="props.openEstimatesModal"
    title="Upload Estimates File"
    size="medium"
    actions="right"
    @submit.prevent="createEstimates"
    @close="closeModalHandler"
  >
    <template #content>
      <div class="modal-form columns is-multiline">
        <div class="field column is-full">
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
      <VButton
        type="submit"
        :disabled="!file"
        color="primary"
        :loading="loading"
        raised
      >
        Create Estimates</VButton
      >
    </template>
    <template #cancel>
      <VButton color="light" @click="closeModalHandler" raised>Close </VButton>
    </template>
  </VModal>
</template>
<style lang="scss" scoped></style>
