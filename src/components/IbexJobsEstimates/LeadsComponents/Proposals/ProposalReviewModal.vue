<script setup lang="ts">
import { useNotyf } from "/@src/composable/useNotyf";
import { useApi } from "/@src/composable/useAPI";

const notyf = useNotyf();
const api = useApi();
const clientNotes = ref("");
const loading = ref(false);

const props = withDefaults(
  defineProps<{
    proposalReviewModal?: boolean;
    proposalId: string;
  }>(),
  {
    proposalReviewModal: false,
    proposalId: "",
  }
);

const emit = defineEmits<{
  (e: "closeModalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: null): void;
}>();

const closeModalHandler = () => {
  emit("closeModalHandler", false);
};

const updateOnSuccessHandler = () => {
  emit("update:OnSuccess", null);
};

const updateProposalStatus = async () => {
  try {
    loading.value = true;
    const resp = await api.patch(`/api/lead-proposal/${props.proposalId}/`, {
      client_note: clientNotes.value,
      status: "review",
    });
    notyf.success(`Your review submitted on proposal.`);
    closeModalHandler();
    updateOnSuccessHandler();
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {});
</script>

<template>
  <VModal
    is="form"
    :open="props.proposalReviewModal"
    title="Review Proposal"
    size="small"
    actions="center"
    @submit.prevent="updateProposalStatus"
    @close="closeModalHandler"
  >
    <template #content>
      <div class="columns is-multiline">
        <div class="column is-12">
          <VField label="Enter Review Notes">
            <VControl>
              <VTextarea
                v-model="clientNotes"
                rows="4"
                placeholder="Enter Notes"
              />
            </VControl>
          </VField>
        </div>
      </div>
    </template>

    <template #cancel>
      <VButton light @click="closeModalHandler()">Cancel</VButton>
    </template>
    <template #action>
      <VButton :loading="loading" type="submit" color="info" raised
        >Submit Review</VButton
      >
    </template>
  </VModal>
</template>
