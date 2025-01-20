<script lang="ts" setup>
import { useApi } from "/@src/composable/useAPI";
import notyf from "/@src/plugins/notyf";
import { useUserSession } from "/@src/stores/userSession";
import { defineEmits, defineProps } from "vue";

const api = useApi();
const userSession = useUserSession();
const loading = ref(false);
const selectedManagerId = ref("");
const companyManagersList = ref([
  {
    value: "",
    name: "",
    icon: "",
  },
]);

const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
  (e: "update:OnSelectManager", value: string): void;
}>();

const props = defineProps<{
  selectedManager?: string;
}>();

const closeModalHandler = () => {
  emit("update:modalHandler", false);
};

const selectManager = () => {
  emit("update:OnSelectManager", selectedManagerId.value);
};

watch(selectedManagerId, (oldVal, newVal) => {
  selectManager();
});
const getManagersHandler = async () => {
  try {
    loading.value = true;
    const response = await api.get("/api/users/by-role/manager/", {});
    companyManagersList.value = response.data.map((manager) => {
      return {
        value: manager.id,
        name: `${
          manager.username
            ? manager.username
            : "" + manager.lastName
            ? manager.lastName
            : ""
        }`,
        icon: manager.avatar,
      };
    });
    selectedManagerId.value = props.selectedManager;
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
    <VField v-slot="{ id }" class="is-image-select" label="Manager">
      <VControl>
        <Multiselect
          v-model="selectedManagerId"
          :attrs="{ id }"
          placeholder="Select a manager"
          label="name"
          :options="companyManagersList"
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
