<script setup lang="ts">
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";

const notyf = useNotyf();
const api = useApi();
const showPassword = ref(false);
const Loading = ref(false);
const Password = ref({
  newPassword: "",
  confirmPassword: "",
});

const props = withDefaults(
  defineProps<{
    isModalOpen?: boolean;
    userId?: string;
  }>(),
  {
    isModalOpen: false,
    userId: "",
  }
);

const emits = defineEmits<{
  (e: "update:closeModalHandler", value: boolean): void;
  (e: "update:actionUpdateHandler", value: null): void;
}>();

const closeModalHandler = () => {
  emits("update:closeModalHandler", false);
};

const actionUpdateHandler = () => {
  emits("update:actionUpdateHandler", null);
};

const changePassword = async () => {
  try {
    if (Password.value.newPassword === Password.value.confirmPassword) {
      const response = await api.patch(`/api/users/${props.userId}/`, {
        password: Password.value.confirmPassword,
      });
      notyf.success("Your password changed successfully.");
      console.log(response);
      closeModalHandler(); // close modal with ref
    } else {
      notyf.warning("New password and confirm password are not the same.");
    }
  } catch (err) {
    console.error(err);
    notyf.error("Something went wrong, please try again.");
  }
};

onMounted(() => {
  console.log("in modal", props.isModalOpen);
});
</script>
<template>
  <VModal
    is="form"
    :open="props.isModalOpen"
    title="Change Password"
    size="small"
    actions="right"
    @submit.prevent="changePassword"
    @close="closeModalHandler"
  >
    <template #content>
      <div class="modal-form columns is-multiline">
        <VField class="column is-12">
          <VLabel>New Password</VLabel>
          <VControl>
            <VInput
              required
              v-model="Password.newPassword"
              type="password"
              placeholder="New Password"
            />
          </VControl>
        </VField>
        <VField class="column is-12" label="Confirm Password" addons>
          <VControl expanded>
            <VInput
              v-model="Password.confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              class="input"
              placeholder="Confirm Password"
            />
          </VControl>
          <VControl>
            <VButton color="primary" @click="showPassword = !showPassword">
              <VIcon v-if="showPassword" icon="lucide:eye-off" />
              <VIcon v-else icon="lucide:eye" />
            </VButton>
          </VControl>
        </VField>
      </div>
    </template>
    <template #action>
      <VButton :loading="Loading" type="submit" color="warning" raised>
        Change Password
      </VButton>
    </template>
  </VModal>
</template>
