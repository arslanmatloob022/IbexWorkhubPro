<script lang="ts" setup>
import { useApi } from "/@src/composable/useAPI";
import notyf from "/@src/plugins/notyf";
import { useUserSession } from "/@src/stores/userSession";
import { defineEmits, defineProps } from "vue";

const api = useApi();
const userSession = useUserSession();
const loading = ref(false);
const selectedAdminsIds = ref([]);
const companyAdminsList = ref([
  {
    value: "",
    name: "",
    icon: "",
  },
]);

const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
  (e: "update:OnSelectAdmins", value: any): void;
}>();

const props = defineProps<{
  selectedAdmins?: Array<string>;
}>();

const closeModalHandler = () => {
  emit("update:modalHandler", false);
};

const selectManager = () => {
  emit("update:OnSelectAdmins", selectedAdminsIds.value);
};

watch(selectedAdminsIds, (oldVal, newVal) => {
  selectManager();
});
const getManagersHandler = async () => {
  try {
    loading.value = true;
    const response = await api.get("/api/users/by-role/admin/", {});
    companyAdminsList.value = response.data.map((admin) => {
      return {
        value: admin.id,
        name: `${
          admin.username
            ? admin.username
            : "" + admin.lastName
            ? admin.lastName
            : ""
        }`,
        icon: admin.avatar,
      };
    });
    selectedAdminsIds.value = props.selectedAdmins;
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
    <VField v-slot="{ id }" class="is-image-select" label="Sales people">
      <VControl>
        <Multiselect
          v-model="selectedAdminsIds"
          :attrs="{ id }"
          placeholder="Sales people"
          label="name"
          track="value"
          mode="tags"
          :options="companyAdminsList"
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
