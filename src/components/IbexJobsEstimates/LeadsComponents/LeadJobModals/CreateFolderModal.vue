<script setup lang="ts">
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { convertToFormData } from "/@src/composable/useSupportElement";
const loading = ref(false);
const api = useApi();
const notyf = useNotyf();

const props = withDefaults(
  defineProps<{
    openCreateFolderModal?: boolean;
    type: string;
    object?: string;
    folderId?: string;
  }>(),
  {
    openCreateFolderModal: false,
    type: "",
    object: "",
    folderId: "",
  }
);
const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: null): void;
}>();

const closeModalHandler = () => {
  emit("update:modalHandler", false);
};

const updateOnSuccessHandler = () => {
  emit("update:OnSuccess", null);
};

const folderData = ref({
  id: "",
  type: props.type,
  object: props.object,
  title: "",
  description: "",
  viewPermissions: [],
  uploadPermissions: [],
});

const createFolderHandler = async () => {
  try {
    loading.value = true;
    const payload = convertToFormData(folderData.value, [""]);
    const resp = await api.post(`/api/media-folder/`, payload);
    notyf.success("Folder created successfully");
    updateOnSuccessHandler();
    closeModalHandler();
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const getFolderHandler = async () => {
  try {
    loading.value = true;
    const payload = convertToFormData(folderData.value, [""]);
    const resp = await api.post(`/api/attachment/${props.folderId}/`, payload);
    notyf.success("File Uploaded successfully");
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  getFolderHandler();
});
</script>

<template>
  <VModal
    is="form"
    :open="props.openCreateFolderModal"
    title="Folder Info"
    size="medium"
    actions="right"
    @submit.prevent="createFolderHandler"
    @close="closeModalHandler()"
  >
    <template #content>
      <div class="columns is-multiline">
        <div class="column is-12">
          <VField label="Title *">
            <VControl>
              <VInput
                v-model="folderData.title"
                placeholder="Folder Title"
                type="text"
                name="title"
                required
              />
            </VControl>
          </VField>
        </div>
        <div class="column is-12">
          <VField label="Description (Optional)">
            <VControl>
              <VTextarea
                v-model="folderData.description"
                rows="2"
                placeholder="Description..."
              />
            </VControl>
          </VField>
        </div>
      </div>
    </template>
    <template #action>
      <VButton :loading="loading" type="submit" color="warning" raised
        >Create</VButton
      >
    </template>
  </VModal>
</template>

<style lang="scss" scoped></style>
