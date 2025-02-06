
<script setup lang="ts">
import { useNotyf } from "/@src/composable/useNotyf";
import { useApi } from "/@src/composable/useAPI";
const props = defineProps<{ trade?: any; openTradeModal?: boolean }>();

const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: null): void;
}>();

const api = useApi();
const loading = ref(false);

const notyf = useNotyf();
const tradeType = ref({
  id: props.trade?.id || "",
  name: props.trade?.name || "",
  description: props.trade?.description || "",
});

const closeModalHandler = () => {
  emit("update:modalHandler", false);
};

const createOrUpdateTrade = async () => {
  try {
    loading.value = true;
    if (tradeType.value.id) {
      await api.patch(
        `/api/cost-trade/${tradeType.value.id}/`,
        tradeType.value
      );
      notyf.success("Trade updated successfully");
    } else {
      await api.post(`/api/cost-trade/`, tradeType.value);
      notyf.success("Trade created successfully");
    }
    emit("update:OnSuccess");
    closeModalHandler();
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <VModal
    is="form"
    :open="openTradeModal"
    title="Trade"
    size="small"
    actions="right"
    @submit.prevent="createOrUpdateTrade"
    @close="closeModalHandler"
  >
    <template #content>
      <div class="modal-form columns is-multiline">
        <div class="column is-12">
          <label class="label">Title *</label>
          <input
            type="text"
            required
            class="input"
            placeholder="Enter Title"
            v-model="tradeType.name"
          />
        </div>
        <div class="column is-12">
          <label class="label">Description</label>
          <VField>
            <VControl>
              <VTextarea
                v-model="tradeType.description"
                class="is-primary-focus"
                rows="2"
                placeholder="Enter Description"
              />
            </VControl>
          </VField>
        </div>
      </div>
    </template>
    <template #action>
      <VButton type="submit" color="primary" :loading="loading" raised
        >Save</VButton
      >
    </template>
    <template #cancel>
      <VButton color="light" @click="closeModalHandler" raised>Close</VButton>
    </template>
  </VModal>
</template>
<style lang="scss" scoped></style>
