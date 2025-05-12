<script setup lang="ts">
import { ref, computed, onMounted, toRefs } from "vue";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { convertToFormData } from "/@src/composable/useSupportElement";
const notyf = useNotyf();
const api = useApi();
const loading = ref(false);

const props = withDefaults(
  defineProps<{
    openPermissionModal?: boolean;
    moduleId?: string;
    permId?: string;
  }>(),
  {
    openPermissionModal: false,
    moduleId: "",
    permId: "",
  }
);

const emit = defineEmits<{
  (e: "close:modalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: null): void;
}>();

const permissionData = ref({
  title: "",
  module: props.moduleId ? props.moduleId : null,
});

const fetchPermissionData = async () => {
  try {
    loading.value = true;
    const response = await api.get(
      `/api/module-permissions/${props.permId ? props.permId : ""}/`
    );
    permissionData.value = response.data;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};
const addUpdateModuleHandler = async () => {
  try {
    loading.value = true;
    let formData = convertToFormData(permissionData.value, [""]);

    await api.post(`/api/module-permissions/`, formData);

    emit("update:OnSuccess", null);
    closeModalHandler();
    notyf.success("Permission added successfully");
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const closeModalHandler = () => {
  emit("close:modalHandler", false);
};

onMounted(() => {
  if (props.permId) {
    fetchPermissionData();
  }
});
</script>

<template>
  <VModal
    is="form"
    :open="props.openPermissionModal"
    :title="props.permId ? 'Update Permission' : 'Add Permission'"
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
                v-model="permissionData.title"
                type="text"
                :placeholder="loading ? 'Loading...' : 'Title'"
              />
            </VControl>
          </VField>
        </div>
      </div>
    </template>
    <template #action>
      <VButton type="submit" :loading="loading" color="primary" raised>
        {{ props.permId ? "Update Permission" : "Add Permission" }}
      </VButton>
    </template>
  </VModal>
</template>
