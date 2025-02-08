<script setup lang="ts">
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { convertToFormData } from "/@src/composable/useSupportElement";
const loading = ref(false);
const api = useApi();
const notyf = useNotyf();

const props = withDefaults(
  defineProps<{
    fileUploadModal?: boolean;
    type: string;
    objectId?: string;
    fileId?: string;
  }>(),
  {
    fileUploadModal: false,
    type: "",
    objectId: "",
    fileId:"",
  }
);
const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: null): void;
}>();

const closeModalHandler = () => {
  emit("update:modalHandler", false);
};
const fileData = ref({
  file: "",
  id: "",
  type: "",
  object: "",
  title: "",
  uploaded_by: "",
});

const uploadFileHandler = async () => {
  try {
    loading.value = true;
    const payload = convertToFormData(fileData.value, ["file"]);
    const resp = await api.post(`/api/attachment/`, payload);
    notyf.success("File Uploaded successfully");
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const getFileHandler = async () => {
  try {
    loading.value = true;
    const payload = convertToFormData(fileData.value, ["file"]);
    const resp = await api.post(`/api/attachment/${props.}/`, payload);
    notyf.success("File Uploaded successfully");
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};


onMounted(() => {
  getFileHandler();
});
</script>

<template>
  <VModal
    is="form"
    :open="props.fileUploadModal"
    title="Document Info"
    size="medium"
    actions="right"
    @submit.prevent="mergeProposalsHandler"
    @close="closeModalHandler()"
  >
    <template #content>
      <div class="columns is-multiline">
        <div class="column is-12">
          <VField label="Title *">
            <VControl>
              <VInput
                v-model="groupProposalData.title"
                placeholder="Document Title"
                type="text"
                name="title"
                required
              />
            </VControl>
          </VField>
        </div>
        <div class="column is-12"></div>
      </div>
    </template>
    <template #action>
      <VButton :loading="loading" type="submit" color="warning" raised
        >Upload</VButton
      >
    </template>
  </VModal>
</template>

<style lang="scss" scoped></style>
