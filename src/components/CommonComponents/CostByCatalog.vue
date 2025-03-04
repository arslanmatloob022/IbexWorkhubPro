<script setup lang="ts">
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { convertToFormData } from "/@src/composable/useSupportElement";
import { useUserSession } from "/@src/stores/userSession";
const editor = shallowRef<any>();
const userSession = useUserSession();
const notyf = useNotyf();
const api = useApi();

const centeredActionsOpen = ref(false);
const props = defineProps<{
  centeredActionsOpen?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: null): void;
}>();
const loading = ref(false);
const catalogList = ref(<any>[]);
const selectedCataLog = ref("");
const assumeList = ref(<any>[]);
const getCataLogItemDetail = async () => {
  try {
    loading.value = true;
    const response = await api.get(`/api/cost/catalogs/`);
    assumeList.value = response.data;
    catalogList.value = response.data.map((item: any) => {
      return {
        value: item.id,
        name: item.title,
      };
    });
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};
const createCostOnCatalog = async () => {
  let list = assumeList.value;
  const matchedItem = list.find((item) => item.id == selectedCataLog.value);

  if (matchedItem) {
    console.log("Matched Item:", matchedItem);
  } else {
    console.log("No item found with the given ID.");
  }

  const formDataAPI = convertToFormData(matchedItem, []);
  try {
    const response = await api.post("/api/cost/", formDataAPI);
    closeModalHandler();
    updateOnSuccess();
    notyf.success("Item added successfully.");
  } catch (error: any) {
    notyf.error("Failed try again");
  }
};
const closeModalHandler = () => {
  emit("update:modalHandler", false);
};

const updateOnSuccess = () => {
  emit("update:OnSuccess", null);
};

onMounted(async () => {
  getCataLogItemDetail();
});
</script>

<template>
  <VModal
    :open="props.centeredActionsOpen"
    actions="right"
    is="form"
    title="Create Cost item"
    @submit.prevent="createCostOnCatalog()"
    @close="closeModalHandler"
  >
    <template #content>
      <VField
        v-slot="{ id }"
        class="is-image-select m-b-80"
        label="Selecte Catalog"
      >
        <VControl>
          <Multiselect
            v-model="selectedCataLog"
            :attrs="{ id }"
            placeholder="Select a catalog"
            label="name"
            :options="catalogList"
          >
            <template #singlelabel="{ value }">
              <div class="multiselect-single-label">
                <span class="select-label-text">
                  {{ value.name }}
                </span>
              </div>
            </template>
            <template #option="{ option }">
              <span class="select-label-text">
                {{ option.name }}
              </span>
            </template>
          </Multiselect>
        </VControl>
      </VField>
    </template>
    <template #action>
      <VButton color="primary" raised type="submit"> Confirm </VButton>
    </template>
    <!-- <template #cancel>
      <VButton color="primary" raised style="display: none"> Confirm </VButton>
    </template> -->
  </VModal>
</template>
