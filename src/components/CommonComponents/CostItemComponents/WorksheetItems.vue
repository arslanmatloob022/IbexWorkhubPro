<script setup lang="ts">
import { useProposalStore } from "/@src/stores/LeadEstimatesStore/proposalStore";
import { selectedColumnsToShow, columnsTitle } from "./costItems";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
const api = useApi();
const notyf = useNotyf();

const editor = shallowRef<any>();
const proposalStore = useProposalStore();
const addCostItemModal = ref(false);
const showDropdown = ref(false);

const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: null): void;
}>();
const centeredActionsOpen = ref(false);

const props = defineProps<{
  leadProposalModal?: boolean;
  proposalId?: string;
  proposalData?: any;
}>();

function DataURIToBlob(dataURI: string) {
  const splitDataURI = dataURI.split(",");
  const byteString =
    splitDataURI[0].indexOf("base64") >= 0
      ? atob(splitDataURI[1])
      : decodeURI(splitDataURI[1]);
  const mimeString = splitDataURI[0].split(":")[1].split(";")[0];
  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
  return new Blob([ia], { type: mimeString });
}
const tab = ref<"worksheet" | "format" | "preview">("worksheet");
const CKEditor = defineAsyncComponent(() =>
  import("@ckeditor/ckeditor5-vue").then((m) => m.default.component)
);

const editorConfig = {
  fontFamily: {
    options: ['"Montserrat", sans-serif', '"Roboto", sans-serif'],
  },
  height: "400px",
  minHeight: "400px",
};

const getProposalCostItems = async () => {
  try {
    proposalStore.getProposalCostItems(props.proposalId);
  } catch (err) {
    console.log(err);
  } finally {
  }
};

const addUpdateProposalHandler = async () => {
  try {
    if (props.proposalId) {
      const response = await api.patch(
        `/api/lead-proposal/${props.proposalId}/`,
        {
          columns_to_show: JSON.stringify(selectedColumnsToShow.value),
        }
      );
    }
    proposalStore.getProposalDetail(props.proposalId);
  } catch (error: any) {
    notyf.error(`Something went wrong, try again`);
  }
};

watch(
  () => selectedColumnsToShow.value,
  (newVal, oldVal) => {
    if (newVal && JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
      addUpdateProposalHandler();
    }
  },
  { deep: true } // Enable deep watching for nested objects/arrays
);

onMounted(async () => {
  editor.value = await import("@ckeditor/ckeditor5-build-classic").then(
    (m) => m.default
  );
  if (props.proposalId) {
    getProposalCostItems();
    proposalStore.getProposalDetail(props.proposalId);
  }
});
onUnmounted(() => {
  proposalStore.clearProposalId();
});
</script>

<template>
  <div>
    <div class="columns is-multiline">
      <div class="column is-12 is-flex space-between">
        <div>
          <h1 class="title is-4">Proposal Worksheet</h1>
        </div>
        <div>
          <VButton
            size="small"
            light
            outlined
            icon="fas fa-cog"
            class="mr-2"
            :color="showDropdown ? 'danger' : 'success'"
            @click="showDropdown = !showDropdown"
            >Table</VButton
          >
          <VButton
            size="small"
            light
            outlined
            class="mr-2"
            color="info"
            @click="centeredActionsOpen = !centeredActionsOpen"
            >Import</VButton
          >
          <VButton
            size="small"
            light
            outlined
            class="mr-2"
            color="primary"
            @click="addCostItemModal = !addCostItemModal"
            >Add From</VButton
          >
          <VButton
            size="small"
            light
            outlined
            color="warning"
            @click="addCostItemModal = !addCostItemModal"
            >Add Item</VButton
          >
        </div>
      </div>
      <TransitionGroup class="fade-slow" name="fade-slow">
        <div v-if="showDropdown" class="column is-12">
          <VField
            v-slot="{ id }"
            label="Choose what to show to lead"
            class="column is-12"
          >
            <VControl>
              <Multiselect
                v-model="selectedColumnsToShow"
                :attrs="{ id }"
                mode="tags"
                :searchable="true"
                :create-tag="true"
                :options="columnsTitle"
                placeholder="Add columns"
              />
            </VControl>
          </VField>
        </div>
      </TransitionGroup>
      <div class="tabs-wrapper column is-12 m-0">
        <div class="tabs-inner mt-4">
          <div class="tabs is-boxed">
            <ul>
              <li :class="[tab === 'worksheet' ? 'is-active' : 'not-active']">
                <a
                  tabindex="0"
                  role="button"
                  @keydown.space.prevent="tab = 'worksheet'"
                  @click="tab = 'worksheet'"
                  ><span>Worksheet</span></a
                >
              </li>
              <li :class="[tab === 'format' ? 'is-active' : 'not-active']">
                <a
                  tabindex="0"
                  role="button"
                  @keydown.space.prevent="tab = 'format'"
                  @click="tab = 'format'"
                  ><span>Format</span></a
                >
              </li>
              <li :class="[tab === 'preview' ? 'is-active' : 'not-active']">
                <a
                  tabindex="0"
                  role="button"
                  @keydown.space.prevent="tab = 'preview'"
                  @click="tab = 'preview'"
                  ><span>Preview</span></a
                >
              </li>
            </ul>
          </div>
        </div>
      </div>

      <TransitionGroup class="fade-slow" name="slide-x">
        <div v-if="tab === 'worksheet'" class="column is-12">
          <CostItemsTable
            :columnsToShow="selectedColumnsToShow"
            :proposalId="props.proposalId"
          />
        </div>
      </TransitionGroup>

      <TransitionGroup class="fade-slow" name="slide-x">
        <div v-if="tab === 'format'" class="column is-12">
          <div class="columns is-multiline">
            <VField
              v-slot="{ id }"
              label="Choose what to show to lead"
              class="column is-12"
            >
              <VControl>
                <Multiselect
                  v-model="selectedColumnsToShow"
                  :attrs="{ id }"
                  mode="tags"
                  :searchable="true"
                  :create-tag="true"
                  :options="columnsTitle"
                  placeholder="Add tags"
                />
              </VControl>
            </VField>
          </div>
          <VCard class="columns is-multiline m-0">
            <div class="column is-12" style="text-align: center">
              <h1 class="title is-4">Connect your clients to their projects</h1>
              <h1 class="title is-5">
                Create a client contact and assign them to jobs and lead
                opportunities effortlessly.
              </h1>
            </div>
            <div class="column is-12">
              <CostItemsTable
                :columnsToShow="selectedColumnsToShow"
                :proposalId="props.proposalId"
              />
            </div>
          </VCard>
        </div>
      </TransitionGroup>

      <TransitionGroup class="fade-slow" name="slide-x">
        <div v-if="tab === 'preview'" class="column is-12">
          <ProposalPreview
            :proposalData="props.proposalData"
            :proposalId="props.proposalId"
            :columnsToShow="selectedColumnsToShow"
          />
        </div>
      </TransitionGroup>
    </div>
    <EstimateCostItemModal
      v-if="addCostItemModal"
      :costItemModal="addCostItemModal"
      :proposalId="props.proposalId"
      @update:modalHandler="addCostItemModal = false"
      @update:OnSuccess="getProposalCostItems"
    >
    </EstimateCostItemModal>
    <CostByCatalog
      v-if="centeredActionsOpen"
      :centeredActionsOpen="centeredActionsOpen"
      :proposalId="props.proposalId"
      @update:modalHandler="centeredActionsOpen = false"
      @update:OnSuccess="getProposalCostItems"
    >
    </CostByCatalog>
  </div>
</template>
