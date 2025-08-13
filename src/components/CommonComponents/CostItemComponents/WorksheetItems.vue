<script setup lang="ts">
import { useProposalStore } from "/@src/stores/LeadEstimatesStore/proposalStore";
import { selectedColumnsToShow, columnsTitle } from "./costItems";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { formatAmount } from "/@src/composable/useSupportElement";
const api = useApi();
const notyf = useNotyf();

const editor = shallowRef<any>();
const proposalStore = useProposalStore();
const addCostItemModal = ref(false);
const addSectionModal = ref(false);
const showDropdown = ref(false);

const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: null): void;
}>();
const centeredActionsOpen = ref(false);

const props = defineProps<{
  proposalId?: string;
  proposalData?: any;
}>();

const tab = ref<"worksheet" | "format" | "preview">("worksheet");

const getProposalCostItems = async () => {
  try {
    proposalStore.getProposalCostItems(props.proposalId);
    emit("update:OnSuccess", null);
    // notyf.green("calling in sheet");
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

const addBlankLineItem = async () => {
  try {
    const resp = await api.post(`/api/cost/add-empty-item/`, {
      proposal: props.proposalId,
      previousItemIndex: proposalStore.proposalCostItems.length
        ? proposalStore.proposalCostItems[
            proposalStore.proposalCostItems.length - 1
          ].index
        : 0,
      is_empty: true,
    });
    notyf.success("Blank line added successfully!");
    getProposalCostItems();
  } catch (err) {
    console.log(err);
    notyf.error("Something went wrong, try again");
  }
};

const draggingIndex = ref<number | null>(null);
const dragOverIndex = ref<number | null>(null);

function onDragStart(index: number) {
  draggingIndex.value = index;
}

function onDragOver(index: number) {
  dragOverIndex.value = index;
}
function onDragEnd() {
  draggingIndex.value = null;
  dragOverIndex.value = null; // Reset
}
function onDrop(targetIndex: number) {
  if (draggingIndex.value === null || draggingIndex.value === targetIndex)
    return;
  const moved = selectedColumnsToShow.value.splice(draggingIndex.value, 1)[0];
  selectedColumnsToShow.value.splice(targetIndex, 0, moved);
  addUpdateProposalHandler();
  draggingIndex.value = null;
  dragOverIndex.value = null;
}

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
        <div class="is-flex align-items-center">
          <h1
            v-if="props.proposalData?.proposalAmount"
            class="title is-6 mt-5 mr-3"
          >
            <!-- {{ props.proposalData }} -->
            Total Amount:
            {{ formatAmount(props.proposalData?.proposalAmount) }}
          </h1>
          <VButton
            size="small"
            light
            outlined
            icon="fas fa-cogs"
            class="mr-2"
            :color="showDropdown ? 'danger' : 'warning'"
            @click="showDropdown = !showDropdown"
            >Customize Columns</VButton
          >
          <VButton
            size="small"
            icon="fas fa-plus"
            color="primary"
            @click="addCostItemModal = !addCostItemModal"
          >
            Cost Item</VButton
          >
          <VButton
            size="small"
            class="ml-1"
            icon="fas fa-plus"
            color="danger"
            @click="addSectionModal = !addSectionModal"
          >
            Section</VButton
          >
          <VButton
            @click="addBlankLineItem()"
            size="small"
            light
            outlined
            class="ml-1"
            color="dark"
            icon="fas fa-plus"
          >
            Blank Line</VButton
          >
        </div>
      </div>
      <!-- <TransitionGroup class="fade-slow" name="fade-slow"> -->
      <div v-if="showDropdown" class="column is-6">
        <div class="field">
          <label for=""> Manage order of columns by dragging them</label>
          <div class="d-flex mt-3">
            <VTag
              v-for="(column, index) in selectedColumnsToShow"
              :key="column"
              class="capitalized ml-1"
              color="dark"
              outlined
              draggable="true"
              @dragstart="onDragStart(index)"
              @dragover.prevent="onDragOver(index)"
              @drop="onDrop(index)"
              @dragend="onDragEnd"
              :class="{
                dragging: draggingIndex === index,
                'drag-over': dragOverIndex === index,
              }"
            >
              {{ column }}
            </VTag>
          </div>
        </div>
      </div>
      <div v-if="showDropdown" class="column is-6">
        <VField
          v-slot="{ id }"
          label="Choose what to show to lead"
          class="column is-12"
        >
          <VControl>
            <Multiselect
              v-model="selectedColumnsToShow"
              @update:model-value="addUpdateProposalHandler"
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
      <!-- </TransitionGroup> -->
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

      <!-- <TransitionGroup class="fade-slow" name="slide-x"> -->
      <div v-if="tab === 'worksheet'" class="column is-12">
        <CostItemsTable
          :columnsToShow="selectedColumnsToShow"
          :proposalId="props.proposalId"
          :proposalData="props.proposalData"
          @update:onsuccess="
            () => {
              emit('update:OnSuccess', null);
            }
          "
        />
        <div
          class="card bg-transparent column is-12 mt-3 is-flex space-between"
        >
          <VButton
            size="small"
            light
            outlined
            color="primary"
            @click="addCostItemModal = !addCostItemModal"
          >
            Add Item</VButton
          >
          <div>
            Total Amount:
            <h1
              v-if="props.proposalData?.proposalAmount"
              class="title is-6 ml-2"
            >
              {{ formatAmount(props.proposalData?.proposalAmount) }}
            </h1>
          </div>
        </div>
      </div>
      <!-- </TransitionGroup> -->

      <!-- <TransitionGroup class="fade-slow" name="slide-x"> -->
      <div v-if="tab === 'format'" class="column is-12">
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
      <!-- </TransitionGroup> -->

      <!-- <TransitionGroup class="fade-slow" name="slide-x"> -->
      <div v-if="tab === 'preview'" class="column is-12">
        <ProposalPreview
          :proposalData="props.proposalData"
          :proposalId="props.proposalId"
          :columnsToShow="selectedColumnsToShow"
        />
      </div>
      <!-- </TransitionGroup> -->
    </div>

    <AddSectionLineModal
      v-if="addSectionModal"
      :costItemModal="addSectionModal"
      :proposalId="props.proposalId"
      :previousItemIndex="
        proposalStore.proposalCostItems.length
          ? proposalStore.proposalCostItems[
              proposalStore.proposalCostItems.length - 1
            ].index
          : 0
      "
      @update:modalHandler="addSectionModal = false"
      @update:OnSuccess="getProposalCostItems"
    >
    </AddSectionLineModal>

    <EstimateCostItemModal
      v-if="addCostItemModal"
      :costItemModal="addCostItemModal"
      :proposalId="props.proposalId"
      :previousItemIndex="
        proposalStore.proposalCostItems.length
          ? proposalStore.proposalCostItems[
              proposalStore.proposalCostItems.length - 1
            ].index
          : 0
      "
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
<style lang="scss" scoped>
.dragging {
  opacity: 0.5;
  border: 1px dashed #007bff !important;
}
.drag-over {
  border: 2px dashed #c5401f !important;
  color: #c5401f !important;
  background: #c3d3eb;
}
.custom-description {
  color: #000000 !important;

  ::v-deep p {
    color: var(--dark-text) !important;
    font-style: normal !important;
    font-family: var(--font) !important;
  }
}
</style>
