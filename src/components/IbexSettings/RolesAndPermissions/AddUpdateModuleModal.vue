<script setup lang="ts">
import { ref, computed, onMounted, toRefs } from "vue";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { convertToFormData } from "/@src/composable/useSupportElement";
const notyf = useNotyf();
const api = useApi();
const loading = ref(false);
const delLoading = ref(false);

const props = withDefaults(
  defineProps<{
    openAppModuleModal?: boolean;
    moduleId?: string;
  }>(),
  {
    openAppModuleModal: false,
    moduleId: "",
  }
);

const emit = defineEmits<{
  (e: "close:modalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: null): void;
}>();

const moduleData = ref({
  name: "",
  description: "",
});

const fetchModuleData = async () => {
  try {
    loading.value = true;
    const response = await api.get(
      `/api/app-modules/${props.moduleId ? props.moduleId : ""}/`
    );
    moduleData.value = response.data;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};
const addUpdateModuleHandler = async () => {
  try {
    loading.value = true;
    let payload = convertToFormData(moduleData.value, [""]);
    if (!props.moduleId) {
      const resp = await api.post(`/api/app-modules/`, payload);
      notyf.success("Module added successfully");
    } else {
      const resp = await api.patch(
        `/api/app-modules/${props.moduleId}/`,
        payload
      );
      notyf.success("Module updated successfully");
    }
    updateOnSuccess();
    closeModalHandler();
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const closeModalHandler = () => {
  emit("close:modalHandler", false);
  console.log("modal closed");
};

const updateOnSuccess = () => {
  emit("update:OnSuccess", null);
};

onMounted(() => {
  if (props.moduleId) {
    fetchModuleData();
  }
});
</script>

<template>
  <VModal
    is="form"
    :open="props.openAppModuleModal"
    :title="props.moduleId ? 'Update Module' : 'Add Module'"
    size="medium"
    actions="right"
    @submit.prevent="addUpdateModuleHandler"
    @close="closeModalHandler"
  >
    <template #content>
      <div class="modal-form columns is-multiline">
        <div class="field column is-12 mb-0">
          <VField>
            <VLabel>Title: *</VLabel>
            <VControl>
              <VInput
                required
                v-model="moduleData.name"
                type="text"
                :placeholder="loading ? 'Loading...' : 'Title'"
              />
            </VControl>
          </VField>
        </div>

        <!-- address -->
        <div class="field column is-12 mb-0">
          <VField>
            <VLabel>Description</VLabel>
            <VControl>
              <VTextarea
                type="text"
                rows="3"
                :placeholder="loading ? 'Loading...' : 'Description'"
                v-model="moduleData.description"
              />
            </VControl>
          </VField>
        </div>
      </div>
    </template>
    <template #action>
      <VButton type="submit" :loading="loading" color="primary" raised>{{
        props.moduleId ? "Update Module" : "Add Module"
      }}</VButton>
    </template>
  </VModal>
</template>
