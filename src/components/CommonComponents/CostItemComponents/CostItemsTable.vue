<script setup lang="ts">
import type { VAvatarProps } from "/@src/components/base/avatar/VAvatar.vue";
import { useNotyf } from "/@src/composable/useNotyf";
import { useProposalStore } from "/@src/stores/LeadEstimatesStore/proposalStore";
import { useApi } from "/@src/composable/useAPI";
import { getColumnData, getColumnName } from "./costItems";
import { formatAmount } from "/@src/composable/useSupportElement";

const api = useApi();
const dragItem = ref("");
const addCostItemModal = ref(false);
const selectedIndex = ref(0);
const addSectionModal = ref(false);
const useProposal = useProposalStore();
const notyf = useNotyf();
const proposalId = ref("");
const previousItemIndex = ref(0);
const selectedCostItem = ref("");
const previewCostItems = ref(false);
const loading = ref(false);
const editor = shallowRef<any>();
const props = defineProps<{
  columnsToShow?: any;
  itemsList?: any;
  proposalId?: any;
}>();

const emits = defineEmits<{
  (e: "update:onsuccess", value: null): void;
}>();

const SweetAlertProps = ref({
  title: "",
  subtitle: "test",
  isSweetAlertOpen: false,
  btntext: "text",
});
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
const handleDragStart = (id: string) => {
  dragItem.value = id;
  console.log("Drag started for ID:", id);
};

const handleDrop = (id: string) => {
  console.log("Dropped on ID:", id);
  const draggedItem = useProposal.proposalCostItems.find(
    (item) => item.id === dragItem.value
  );
  const droppedItem = useProposal.proposalCostItems.find(
    (item) => item.id === id
  );

  if (draggedItem && droppedItem) {
    api.post("/api/cost/drag-drop-items/", {
      dragged_item_id: draggedItem.id,
      dropped_item_id: droppedItem.id,
    });

    // Reorder logic if needed
    const draggedIndex = useProposal.proposalCostItems.indexOf(draggedItem);
    const droppedIndex = useProposal.proposalCostItems.indexOf(droppedItem);
    if (draggedIndex >= 0 && droppedIndex >= 0) {
      useProposal.proposalCostItems.splice(draggedIndex, 1);
      useProposal.proposalCostItems.splice(droppedIndex, 0, draggedItem);
    }
  } else {
    console.error("Dragged or Dropped Item not found");
  }
  dragItem.value = null;
};

const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
};

const handleDragEnter = (event: DragEvent) => {
  event.preventDefault();
  event.currentTarget?.classList.add("drag-over");
};

const handleDragLeave = (event: DragEvent) => {
  event.preventDefault();
  event.currentTarget?.classList.remove("drag-over");
};

const openDeleteCostItemAlert = (cost: any) => {
  selectedCostItem.value = cost.id;
  proposalId.value = cost.proposal;
  SweetAlertProps.value = {
    title: "Are you sure?",
    subtitle: "You will not be able to recover this cost item!",
    btntext: "Delete",
    isSweetAlertOpen: true,
  };
};

const deleteCostItemHandler = async () => {
  try {
    loading.value = true;
    const response = await api.delete(`/api/cost/${selectedCostItem.value}/`);
    selectedCostItem.value = "";
    emits("update:onsuccess", null);
    getProposalCostItems(props.proposalId);
    SweetAlertProps.value.isSweetAlertOpen = false;
    notyf.success("Cost item deleted");
  } catch (Err) {
    console.log(Err);
  } finally {
    loading.value = false;
  }
};

const openUpdateCostItem = (cost: any, preview: boolean = false) => {
  selectedCostItem.value = cost.id;
  previewCostItems.value = preview;
  proposalId.value = cost.proposal;
  addCostItemModal.value = !addCostItemModal.value;
};
const openProposalCostItems = (cost: any) => {
  proposalId.value = cost.proposal;
  previousItemIndex.value = cost.index;
  addCostItemModal.value = !addCostItemModal.value;
};

const getProposalCostItems = (id: any) => {
  emits("update:onsuccess", null);
  useProposal.getProposalCostItems(id ? id : proposalId.value);
};

const addUpdateProposalHandler = async () => {
  try {
    if (props.proposalId) {
      const response = await api.patch(
        `/api/lead-proposal/${props.proposalId}/`,
        {
          columns_to_show: JSON.stringify(props.columnsToShow),
        }
      );
    }
    useProposal.getProposalDetail(props.proposalId);
  } catch (error: any) {
    notyf.error(`Something went wrong, try again`);
  }
};
import { ref, nextTick } from "vue";

const editingCell = ref<{ rowId: string; column: string } | null>(null);
const editingValue = ref("");

function startEditing(cost: any, column: string) {
  const key = getColumnData[column] || column;
  editingCell.value = { rowId: cost.id, column };
  editingValue.value = cost[key] ?? ""; // Use ?? "" to avoid undefined
  nextTick(() => {
    const input = document.getElementById(`edit-input-${cost.id}-${column}`);
    if (input) input.focus();
  });
}

function onCKEditorReady(editorInstance: any, cost: any, column: any) {
  editorInstance.editing.view.document.on("blur", () => {
    saveEdit(cost, column);
  });
}
function saveEdit(cost: any, column: string) {
  const key = getColumnData[column] || column;
  cost[key] = editingValue.value;
  editingCell.value = null;
  console.log("Column", key, "cost", cost, "value", editingValue.value);
  let setKey = key.toString();
  let payload = { [setKey]: editingValue.value };
  addUpdateCostItemHandler(cost.id, payload);
}

const addUpdateCostItemHandler = async (id: any = "", payload: any = {}) => {
  try {
    const response = await api.patch(`/api/cost/${id}/`, payload);
    emits("update:onsuccess", null);
    getProposalCostItems(props.proposalId);
    useProposal.getProposalCostItems(props.proposalId);
    notyf.success("Item updated successfully.");
  } catch (error: any) {
    notyf.error(` ${error}, New Worker`);
  } finally {
  }
};

const addBlankLineItem = async (index: any) => {
  try {
    const resp = await api.post(`/api/cost/add-empty-item/`, {
      proposal: props.proposalId,
      previousItemIndex: index,
      is_empty: true,
    });
    notyf.success("Blank line added successfully!");
    getProposalCostItems(props.proposalId);
  } catch (err) {
    console.log(err);
    notyf.error("Something went wrong, try again");
  }
};

const openAddSectionModal = (index: any) => {
  selectedIndex.value = index;
  addSectionModal.value = !addSectionModal.value;
};

function cancelEdit() {
  editingCell.value = null;
}
const costCodesList = ref([]);
const getCostCodesHandler = async () => {
  try {
    const response = await api.get(`/api/cost-code/`);
    costCodesList.value = response.data.map((item: any) => {
      return {
        value: item.id,
        label: item.name,
        labour_cost: item.labour_cost,
        unit_cost: item.unit_cost ?? 0.0,
        worker_cost: item.worker_cost ?? 0.0,
        unit: item.unit ?? "--",
      };
    });
    // getMatchingCostCode();
  } catch (err) {
    console.log(err);
  } finally {
  }
};

const costUnitsList = ref([
  {
    id: "",
    title: "",
    value: "",
    description: "",
    is_active: true,
    created_at: "",
    updated_at: "",
  },
]);

const getUnits = async () => {
  try {
    loading.value = true;
    const response = await api.get(`/api/units/`);
    costUnitsList.value = response.data;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

watch(
  () => props.columnsToShow,
  (newVal, oldVal) => {
    if (newVal && JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
      addUpdateProposalHandler();
    }
  },
  { deep: true }
);

onMounted(async () => {
  proposalId.value = props.proposalId;
  editor.value = await import("@ckeditor/ckeditor5-build-classic").then(
    (m) => m.default
  );
  getCostCodesHandler();
  getUnits();
});
</script>

<template>
  <div class="datatable-wrapper mt-0">
    <div class="table-container">
      <table class="table datatable-table is-fullwidth" id="external-events">
        <thead>
          <th></th>
          <th v-for="(column, index) in props.columnsToShow" :key="index">
            {{ getColumnName[column] }}
          </th>
          <th>Actions</th>
        </thead>
        <tbody>
          <tr
            v-if="useProposal.proposalCostItems.length > 0"
            v-for="(cost, index) in useProposal.proposalCostItems"
            :key="cost.id"
            :data-event="JSON.stringify(cost)"
            draggable="true"
            @dragstart="handleDragStart(cost.id)"
            @drop="handleDrop(cost.id)"
            @dragover="handleDragOver"
            @dragenter="handleDragEnter"
            @dragleave="handleDragLeave"
            class="draggable-item events"
          >
            <!-- @dblclick="openUpdateCostItem(cost, false)" -->

            <td class="is-relative">
              <i
                style="
                  position: absolute;
                  bottom: -7px;
                  left: 1px;
                  cursor: pointer;
                  z-index: 9;
                  font-weight: 600;
                  font-size: 15px;
                  color: var(--primary);
                "
                @click="openProposalCostItems(cost)"
                class="fas fa-plus-circle"
                aria-hidden="true"
              ></i>
              <i
                style="
                  position: absolute;
                  bottom: -7px;
                  left: 19px;
                  cursor: pointer;
                  z-index: 9;
                  font-weight: 600;
                  font-size: 14px;
                "
                @click="openAddSectionModal(cost.index)"
                class="fas fa-plus-circle danger-text"
                aria-hidden="true"
              ></i>
              <i
                style="
                  position: absolute;
                  bottom: -7px;
                  left: 36px;
                  cursor: pointer;
                  z-index: 9;
                  font-weight: 600;
                  font-size: 14px;
                "
                @click="addBlankLineItem(cost.index)"
                class="lnir lnir-circle-plus dark-text"
                aria-hidden="true"
              ></i>
            </td>
            <!-- ================================
             ======================================
             ====================================== -->
            <td
              v-for="(column, index) in props.columnsToShow"
              :key="index"
              @dblclick="startEditing(cost, column)"
            >
              <template
                v-if="
                  editingCell &&
                  editingCell.rowId === cost.id &&
                  editingCell.column === column
                "
              >
                <CKEditor
                  v-if="editor && column === 'description'"
                  :id="`edit-input-${cost.id}-${column}`"
                  v-model="editingValue"
                  :editor="editor"
                  :config="editorConfig"
                  @keyup.enter="saveEdit(cost, column)"
                  @keyup.esc="cancelEdit"
                  @ready="onCKEditorReady($event, cost, column)"
                />
                <VField
                  v-else-if="column === 'cost_code'"
                  v-slot="{ id }"
                  style="min-width: 120px; z-index: 9999"
                >
                  <VControl>
                    <Multiselect
                      required
                      v-model="editingValue"
                      :attrs="{ id }"
                      :searchable="true"
                      :options="costCodesList"
                      @keyup.enter="saveEdit(cost, column)"
                      @keyup.esc="cancelEdit"
                      placeholder="Select a cost code"
                      @blur="saveEdit(cost, column)"
                      @update:modelValue="
                        (val) => {
                          editingValue = val;
                          saveEdit(cost, column);
                        }
                      "
                    />
                  </VControl>
                </VField>
                <VField v-else-if="column === 'unit'" addons>
                  <VControl expanded>
                    <VSelect
                      @keyup.enter="saveEdit(cost, column)"
                      @keyup.esc="cancelEdit"
                      @update:modelValue="
                        (val) => {
                          editingValue = val;
                          saveEdit(cost, column);
                        }
                      "
                      v-model="editingValue"
                    >
                      <VOption value="" disabled> Select Unit </VOption>
                      <VOption
                        v-for="item in costUnitsList"
                        :value="item.value"
                      >
                        {{ item.title }} ({{ item.value }})
                      </VOption>
                    </VSelect>
                  </VControl>
                </VField>
                <input
                  v-else
                  :id="`edit-input-${cost.id}-${column}`"
                  v-model="editingValue"
                  @keyup.enter="saveEdit(cost, column)"
                  @keyup.esc="cancelEdit"
                  @blur="saveEdit(cost, column)"
                  class="input is-small"
                  style="width: 100%"
                />
              </template>
              <!-- Otherwise, show the normal cell content -->
              <template v-else>
                <template v-if="!cost.is_empty">
                  <div
                    class="custom-description"
                    v-if="column === 'description'"
                    v-html="cost[getColumnData[column]]"
                  ></div>
                  <span
                    v-else-if="
                      [
                        'unit_cost',
                        'markup',
                        'total_price',
                        'builder_cost',
                        'margin',
                        'profit',
                        'worker_cost',
                      ].includes(column)
                    "
                  >
                    {{ formatAmount(cost[getColumnData[column]]) }}
                  </span>
                  <span v-else>
                    {{ cost[getColumnData[column]] }}
                  </span>
                  <span v-if="column === 'cost_code'">
                    {{ cost?.cost_code_info?.name }}
                  </span>
                </template>
                <template v-else>
                  <span v-if="column === 'description'">
                    {{ cost.title ? cost.title : cost.description }}
                  </span>
                </template>
              </template>
            </td>

            <td>
              <VDropdown
                icon="feather:more-vertical"
                class="is-pushed-mobile"
                spaced
                right
                up
                style="z-index: 99"
              >
                <template #content="{ close }">
                  <a
                    role="menuitem"
                    href="#"
                    class="dropdown-item is-media"
                    @click.prevent="
                      () => {
                        openUpdateCostItem(cost, false);
                        close();
                      }
                    "
                  >
                    <div class="icon">
                      <i aria-hidden="true" class="lnil lnil-briefcase" />
                    </div>
                    <div class="meta">
                      <span>Edit</span>
                      <span>Edit Cost Item</span>
                    </div>
                  </a>

                  <hr class="dropdown-divider" />

                  <a
                    role="menuitem"
                    href="#"
                    class="dropdown-item is-media"
                    @click.prevent="
                      () => {
                        openDeleteCostItemAlert(cost);
                        close();
                      }
                    "
                  >
                    <div class="icon">
                      <i aria-hidden="true" class="lnil lnil-trash-can-alt" />
                    </div>
                    <div class="meta">
                      <span>Remove</span>
                      <span>Remove from list</span>
                    </div>
                  </a>
                </template>
              </VDropdown>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <SweetAlert
      v-if="SweetAlertProps.isSweetAlertOpen"
      :isSweetAlertOpen="SweetAlertProps.isSweetAlertOpen"
      :title="SweetAlertProps.title"
      :subtitle="SweetAlertProps.subtitle"
      :btntext="SweetAlertProps.btntext"
      :onConfirm="deleteCostItemHandler"
      :onCancel="() => (SweetAlertProps.isSweetAlertOpen = false)"
    />
    <AddSectionLineModal
      v-if="addSectionModal"
      :costItemModal="addSectionModal"
      :proposalId="props.proposalId"
      :previousItemIndex="selectedIndex"
      @update:modalHandler="addSectionModal = false"
      @update:OnSuccess="getProposalCostItems(props.proposalId)"
    >
    </AddSectionLineModal>

    <EstimateCostItemModal
      v-if="addCostItemModal"
      :costItemModal="addCostItemModal"
      :proposalId="proposalId"
      :costItemId="selectedCostItem"
      :previousItemIndex="previousItemIndex"
      :previewCostItems="previewCostItems"
      @update:modalHandler="
        addCostItemModal = false;
        selectedCostItem = '';
      "
      @update:OnSuccess="getProposalCostItems(props.proposalId)"
    >
    </EstimateCostItemModal>
  </div>
</template>

<style lang="scss" scoped>
.custom-description {
  color: #000000 !important;

  ::v-deep p {
    color: var(--dark-text) !important;
    font-style: normal !important;
    font-family: var(--font) !important;
  }
}

p {
  color: var(--dark-text) !important;
}

.draggable-item {
  padding: 10px;
  border: 1px solid #ccc;
  margin-bottom: 5px;
  background-color: #f9f9f9;
}

.draggable-item.drag-over {
  border: 2px dashed #007bff;
  background-color: #eaf4ff;
}
.is-navbar {
  .datatable-toolbar {
    padding-top: 30px;
  }
}

.datatable-toolbar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  &.is-reversed {
    flex-direction: row-reverse;
  }

  .field {
    margin-bottom: 0;

    .control {
      .button {
        color: var(--light-text);

        &:hover,
        &:focus {
          background: var(--primary);
          border-color: var(--primary);
          color: var(--primary--color-invert);
        }
      }
    }
  }

  .buttons {
    margin-left: auto;
    margin-bottom: 0;

    .v-button {
      margin-bottom: 0;
    }
  }
}

.is-dark {
  .datatable-toolbar {
    .field {
      .control {
        .button {
          background: var(--dark-sidebar) !important;
          color: var(--light-text);

          &:hover,
          &:focus {
            background: var(--primary) !important;
            border-color: var(--primary) !important;
            color: var(--smoke-white) !important;
          }
        }
      }
    }
  }
}

.datatable-wrapper {
  width: 100%;

  .datatable-container {
    background: var(--white);
    border: none !important;
    overflow-x: auto;

    .table,
    table {
      width: 100%;
      background-color: #ffff;
    }

    &::-webkit-scrollbar {
      height: 8px !important;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 10px !important;
      background: rgb(0 0 0 / 20%) !important;
    }
  }
}

.datatable-table {
  border: 1px solid var(--fade-grey);
  border-collapse: collapse;
  background: transparent !important;
  background-color: transparent !important;
  border-radius: 0.75rem;

  th {
    padding: 16px 20px;
    font-family: var(--font-alt);
    font-size: 0.8rem;
    color: var(--dark-text);
    text-transform: uppercase;
    border: 1px solid var(--fade-grey);
    font-weight: 600;

    &:last-child {
      text-align: right;
    }
  }

  td {
    font-family: var(--font);
    vertical-align: middle;
    background-color: transparent !important;
    padding: 12px 20px;
    color: #333333;
    border-bottom: 1px solid var(--fade-grey);

    &:last-child {
      text-align: right;
    }
    &:nth-child(2) {
      color: #333333;
    }

    &.datatables-empty {
      opacity: 0;
    }
  }

  tbody {
    tr {
      background-color: transparent !important;
      background: transparent !important;
      td {
        background-color: transparent !important;
        background: transparent !important;
      }
    }
  }

  .light-text {
    color: var(--light-text);
  }

  .flex-media {
    display: flex;
    align-items: center;

    .meta {
      margin-left: 10px;
      line-height: 1.3;

      span {
        display: block;
        font-size: 0.8rem;
        color: var(--light-text);
        font-family: var(--font);

        &:first-child {
          font-family: var(--font-alt);
          color: var(--dark-text);
        }
      }
    }
  }

  .row-action {
    display: flex;
    justify-content: flex-end;
  }

  .checkbox {
    padding: 0;
  }

  .product-photo {
    width: 80px;
    height: 80px;
    object-fit: contain;
  }

  .file-icon {
    width: 46px;
    height: 46px;
    object-fit: contain;
  }

  .drinks-icon {
    display: block;
    max-width: 48px;
    border-radius: var(--radius-rounded);
    border: 1px solid var(--fade-grey);
  }

  .negative-icon,
  .positive-icon {
    svg {
      height: 16px;
      width: 16px;
    }
  }

  .positive-icon {
    .iconify {
      color: var(--success);

      * {
        stroke-width: 4px;
      }
    }
  }

  .negative-icon {
    &.is-danger {
      .iconify {
        color: var(--danger) !important;
      }
    }

    .iconify {
      color: var(--light-text);

      * {
        stroke-width: 4px;
      }
    }
  }

  .price {
    color: var(--dark-text);
    font-weight: 500;

    &::before {
      content: "$";
    }

    &.price-free {
      color: var(--light-text);
    }
  }

  .status {
    display: flex;
    align-items: center;

    &.is-available {
      i {
        color: var(--success);
      }
    }

    &.is-busy {
      i {
        color: var(--danger);
      }
    }

    &.is-offline {
      i {
        color: var(--light-text);
      }
    }

    i {
      margin-right: 8px;
      font-size: 8px;
    }

    span {
      font-family: var(--font);
      font-size: 0.9rem;
      color: var(--light-text);
    }
  }
}

.is-dark {
  .datatable-wrapper {
    .datatable-container {
      border-color: var(--dark-sidebar-light-12);
      background: var(--dark-sidebar-light-6);
    }
  }

  .datatable-table {
    border-color: var(--dark-sidebar-light-12);

    th,
    td {
      border-color: var(--dark-sidebar-light-12);
      color: var(--dark-dark-text);
      // background-color: #fff;
    }
    tbody tr {
      background-color: transparent !important;
      background: transparent !important;
    }

    .drinks-icon {
      border-color: var(--dark-sidebar-light-12);
    }
  }
}
</style>
