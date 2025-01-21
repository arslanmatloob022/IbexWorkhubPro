<script lang="ts" setup>
import { useApi } from "/@src/composable/useAPI";
import { defineEmits, defineProps } from "vue";

const api = useApi();
const loading = ref(false);
const selectedClientId = ref("");
const companyClientsList = ref([
  {
    value: "",
    name: "",
    icon: "",
  },
]);

const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
  (e: "update:OnSelectClient", value: string): void;
}>();

const props = defineProps<{
  selectedClient?: string | undefined;
}>();

const closeModalHandler = () => {
  emit("update:modalHandler", false);
};

const selectClient = () => {
  emit("update:OnSelectClient", selectedClientId.value);
};

watch(selectedClientId, (oldVal, newVal) => {
  selectClient();
});
const getManagersHandler = async () => {
  try {
    loading.value = true;
    const response = await api.get("/api/users/by-role/client/", {});
    companyClientsList.value = response.data.map((client) => {
      return {
        value: client.id,
        name: `${
          client.username
            ? client.username
            : "" + client.lastName
            ? client.lastName
            : ""
        }`,
        icon: client.avatar,
      };
    });

    selectedClientId.value = props.selectedClient;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};
onMounted(() => {
  getManagersHandler();
});
</script>
<template>
  <div>
    <VField v-slot="{ id }" class="is-image-select" label="Client">
      <VControl>
        <Multiselect
          v-model="selectedClientId"
          :attrs="{ id }"
          placeholder="Select a client"
          label="name"
          :options="companyClientsList"
        >
          <template #singlelabel="{ value }">
            <div class="multiselect-single-label">
              <img class="select-label-icon" :src="value.icon" alt="" />
              <span class="select-label-text">
                {{ value.name }}
              </span>
            </div>
          </template>
          <template #option="{ option }">
            <img class="select-option-icon" :src="option.icon" alt="" />
            <span class="select-label-text">
              {{ option.name }}
            </span>
          </template>
        </Multiselect>
      </VControl>
    </VField>
  </div>
</template>
