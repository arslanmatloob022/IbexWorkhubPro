<script lang="ts" setup>
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
const api = useApi();
const notyf = useNotyf();
const loading = ref(false);

const props = withDefaults(
  defineProps<{
    userId?: string;
    name?: string;
    userType?: string;
  }>(),
  {
    userId: "",
    name: "",
    userType: "User",
  }
);

const emits = defineEmits<{
  (e: "update:closeModalHandler", value: boolean): void;
  (e: "update:actionUpdateHandler", value: null): void;
}>();

const closeUserModalHandler = () => {
  emits("update:closeModalHandler", false);
};

const actionUpdateHandler = () => {
  emits("update:actionUpdateHandler", null);
};

const deleteSweetAlertProps = ref({
  title: "",
  subtitle: "test",
  isSweetAlertOpen: false,
  btntext: "text",
});

const openDeleteModal = () => {
  deleteSweetAlertProps.value = {
    title: `Delete ${props.name}?`,
    subtitle:
      "After deleting this worker you won't be able to recover it again.",
    btntext: `Delete it`,
    isSweetAlertOpen: true,
  };
};

const deleteUser = async () => {
  try {
    loading.value = true;
    await api.delete(`/api/users/${props.userId}/`, {});
    actionUpdateHandler();
    notyf.green(`${props.userType} deleted successfully`);
  } catch (err) {
    console.log(err);
    notyf.error("Error while deleting");
  } finally {
    loading.value = false;
    deleteSweetAlertProps.value.isSweetAlertOpen = false;
  }
};
</script>
<template>
  <VButton @click="openDeleteModal" icon="fas fa-trash">
    Delete
    <SweetAlert
      v-if="deleteSweetAlertProps.isSweetAlertOpen"
      :loading="loading"
      :isSweetAlertOpen="deleteSweetAlertProps.isSweetAlertOpen"
      :title="deleteSweetAlertProps.title"
      :subtitle="deleteSweetAlertProps.subtitle"
      :btntext="deleteSweetAlertProps.btntext"
      :onConfirm="deleteUser"
      :onCancel="() => (deleteSweetAlertProps.isSweetAlertOpen = false)"
  /></VButton>
</template>
