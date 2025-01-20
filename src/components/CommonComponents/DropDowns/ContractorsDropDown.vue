<script lang="ts" setup>
import { useApi } from "/@src/composable/useAPI";
import notyf from "/@src/plugins/notyf";
import { useUserSession } from "/@src/stores/userSession";
import { defineEmits, defineProps } from "vue";

const api = useApi();
const userSession = useUserSession();
const loading = ref(false);
const selectedContractorId = ref<any>("");
const companyContractorsList = ref([
  {
    value: "",
    name: "",
    icon: "",
  },
]);

const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
  (e: "update:OnSelectContractor", value: string): void;
}>();

const props = defineProps<{
  selectedContractor?: string;
}>();

const closeModalHandler = () => {
  emit("update:modalHandler", false);
};

const selectContractor = () => {
  emit("update:OnSelectContractor", selectedContractorId.value);
};

watch(selectedContractorId, (oldVal, newVal) => {
  selectContractor();
});
const getContractorsHandler = async () => {
  try {
    loading.value = true;
    const response = await api.get("/api/users/by-role/contractor/", {});
    companyContractorsList.value = response.data.map((Contractor: any) => {
      return {
        value: Contractor.id,
        name: `${
          Contractor.username
            ? Contractor.username
            : "" + Contractor.lastName
            ? Contractor.lastName
            : ""
        }`,
        icon: Contractor.avatar,
      };
    });
    selectedContractorId.value = props.selectedContractor;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};
onMounted(() => {
  getContractorsHandler();
});
</script>
<template>
  <div>
    <VField v-slot="{ id }" class="is-image-select" label="Contractors">
      <VControl>
        <Multiselect
          v-model="selectedContractorId"
          :attrs="{ id }"
          placeholder="Select a contractor"
          label="name"
          :options="companyContractorsList"
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
