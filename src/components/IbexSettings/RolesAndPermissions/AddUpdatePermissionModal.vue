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
  name: "",
  module: props.moduleId ? props.moduleId : null,
});

const fetchPermissionData = async () => {
  try {
    loading.value = true;
    const response = await api.get(
      `/api/module-permission/${props.permId ? props.permId : ""}/`
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
    if (props.permId) {
      const resp = await api.patch(
        `/api/module-permission/${props.permId}/`,
        permissionData.value
      );
    } else {
      const resp = await api.post(
        `/api/module-permission/`,
        permissionData.value
      );
    }
    emit("update:OnSuccess", null);
    notyf.success("Permission added successfully");
    closeModalHandler();
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
                v-model="permissionData.name"
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
