<script setup lang="ts">
import type { VAvatarProps } from "/@src/components/base/avatar/VAvatar.vue";
import { useNotyf } from "/@src/composable/useNotyf";
import { costItems } from "../../IbexJobsEstimates/proposalItems";
import { useProposalStore } from "/@src/stores/LeadEstimatesStore/proposalStore";
export interface UserData extends VAvatarProps {
  id: number;
  username: string;
  position: string;
  picture: string;
  badge: string;
  location: string;
  industry: string;
  status: string;
  contacts: VAvatarProps[];
}

const props = defineProps<{
  columnsToShow?: any;
  itemsList?: any;
}>();
const notyf = useNotyf();
const page = ref(42);
const useProposal = useProposalStore();
const tagsValue = ref([
  "ItemNumber",
  "Description",
  "Quantity",
  "Unit",
  "UnitCost",
  "TotalPrice",
]);
const tagsOptions = [
  { value: "ItemNumber", label: "Item Number" },
  { value: "Description", label: "Description" },
  { value: "Quantity", label: "Quantity" },
  { value: "Unit", label: "Unit" },
  { value: "UnitCost", label: "Unit Cost" },
  { value: "Markup", label: "Markup" },
  { value: "Margin", label: "Margin" },
  { value: "TotalPrice", label: "Client Price" },
  { value: "Profit", label: "Profit" },
  { value: "Notes", label: "Notes" },
];

const getColumnName = ref({
  CostCode: "Cost Code",
  Title: "Title",
  Unit: "Unit",
  Description: "Description",
  CostType: "Cost Type",
  MarkAs: "Mark As",
  Quantity: "Quantity",
  UnitCost: "Unit Cost",
  BuilderCost: "Builder Cost",
  Markup: "Markup",
  MarkupAmount: "Markup Amount",
  UnitPrice: "Unit Price",
  Price: "Price",
  TotalPrice: "Total Price",
  GroupPrice: "Group Price",
  TotalCost: "Total Cost",
  TotalMarkup: "Total Markup",
  Profit: "Profit",
  Notes: "Internal Notes",
});

const getColumnData = ref({
  CostCode: "cost_code",
  Title: "title",
  Unit: "unit",
  Description: "description",
  CostType: "cost_type",
  MarkAs: "mark_as",
  Quantity: "quantity",
  UnitCost: "unit_cost",
  BuilderCost: "builder_cost",
  Markup: "markup",
  MarkupAmount: "markup_amount",
  UnitPrice: "unit_cost",
  Price: "price",
  TotalPrice: "total_price",
  GroupPrice: "group",
  TotalCost: "total_cost",
  TotalMarkup: "total_markup",
  Profit: "profit",
  Notes: "internal_notes",
});

const dragItem = ref<number | null>(null);

const handleDragStart = (index: number) => {
  dragItem.value = index;
};

const handleDrop = (index: number) => {
  if (dragItem.value !== null && dragItem.value !== index) {
    const draggedItem = costItems.value[dragItem.value];
    costItems.value.splice(dragItem.value, 1);
    costItems.value.splice(index, 0, draggedItem);
  }
  dragItem.value = null;
};

const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
};

onMounted(() => {});
</script>

<template>
  <div class="datatable-wrapper mt-0">
    <div class="table-container">
      <table class="table datatable-table is-fullwidth" id="external-events">
        <thead>
          <th>Item#</th>
          <th v-for="(column, index) in props.columnsToShow" :key="index">
            {{ getColumnName[column] }}
          </th>
          <th>Actions</th>
        </thead>
        <tbody>
          <tr
            v-if="useProposal.proposalCostItems.length > 0"
            class="events"
            v-for="(cost, index) in useProposal.proposalCostItems"
            :key="cost.id"
            :data-event="JSON.stringify(cost)"
            draggable="true"
            @dragstart="handleDragStart(index)"
            @drop="() => handleDrop(index)"
            @dragover="handleDragOver"
          >
            <td>{{ index + 1 }}</td>
            <td v-for="(column, index) in props.columnsToShow" :key="index">
              <div
                v-if="column === 'Description'"
                v-html="cost[getColumnData[column]]"
              ></div>
              <span v-else>
                {{ cost[getColumnData[column]] }}
              </span>
            </td>

            <td>
              <FlexTableDropdown />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
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
    padding: 12px 20px;
    border-bottom: 1px solid var(--fade-grey);

    &:last-child {
      text-align: right;
    }

    &.datatables-empty {
      opacity: 0;
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
    }

    .drinks-icon {
      border-color: var(--dark-sidebar-light-12);
    }
  }
}
</style>
