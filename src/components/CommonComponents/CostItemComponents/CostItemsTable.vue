<script setup lang="ts">
import type { VAvatarProps } from "/@src/components/base/avatar/VAvatar.vue";
import { useNotyf } from "/@src/composable/useNotyf";

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
const notyf = useNotyf();
const page = ref(42);
const filters = ref("");

const tagsValue = ref([]);
const tagsOptions = [
  { value: "Items", label: "Items" },
  { value: "Description", label: "Description" },
  { value: "Quantity", label: "Quantity" },
  { value: "Unit", label: "Unit" },
  { value: "UnitCost", label: "Unit Cost" },
  { value: "Markup", label: "Markup" },
  { value: "Margin", label: "Margin" },
  { value: "ClientPrice", label: "Client Price" },
  { value: "Profit", label: "Profit" },
  { value: "Internal Notes", label: "Internal Notes" },
];
const costItems = ref([
  {
    id: "12345",
    title: "Framing Labor",
    cost_code: "030500",
    cost_type: "Labor",
    unit_cost: 50.0,
    quantity: 100,
    unit: "hours",
    total_cost: 5000.0,
    markup: 10,
    markup_type: "percentage",
    markup_value: 500.0,
    tax_rate: 7.5,
    tax_value: 375.0,
    grand_total: 5875.0,
    description: "Labor costs for framing the structure.",
    internal_notes: "Ensure all workers have completed safety training.",
    created_by: "user123",
    created_date: "2024-12-22T14:45:00Z",
    updated_by: "user123",
    updated_date: "2024-12-22T15:00:00Z",
    approved_by: "manager456",
    approval_date: "2024-12-23T10:00:00Z",
    status: "approved",
    category: "Construction",
    tags: ["labor", "framing", "construction"],
    attachments: [
      {
        file_name: "worker_safety_checklist.pdf",
        file_url: "https://example.com/files/worker_safety_checklist.pdf",
        uploaded_date: "2024-12-21T12:00:00Z",
      },
    ],
    visibility: {
      internal_only: false,
      shared_with_client: true,
    },
    dependencies: [
      {
        dependency_id: "56789",
        type: "preceding_task",
        title: "Foundation Completed",
      },
    ],
    front_end_elements: {
      highlighted: true,
      background_color: "#f8f9fa",
      font_color: "#000000",
      display_order: 1,
      editable: true,
    },
    back_end_elements: {
      database_table: "cost_items",
      api_endpoint: "/api/cost-items",
      validation_rules: {
        unit_cost: "numeric|min:0",
        quantity: "integer|min:1",
        markup: "numeric|min:0|max:100",
        tax_rate: "numeric|min:0|max:100",
      },
    },
  },
  {
    id: "12346",
    title: "Foundation Material",
    cost_code: "010100",
    cost_type: "Material",
    unit_cost: 75.0,
    quantity: 200,
    unit: "cubic meters",
    total_cost: 15000.0,
    markup: 5,
    markup_type: "percentage",
    markup_value: 750.0,
    tax_rate: 7.5,
    tax_value: 1125.0,
    grand_total: 16875.0,
    description: "Materials for building the foundation.",
    internal_notes: "Order from preferred supplier for better pricing.",
    created_by: "user124",
    created_date: "2024-12-22T10:00:00Z",
    updated_by: "user124",
    updated_date: "2024-12-22T11:00:00Z",
    approved_by: "manager457",
    approval_date: "2024-12-22T15:00:00Z",
    status: "approved",
    category: "Materials",
    tags: ["foundation", "materials", "construction"],
    attachments: [
      {
        file_name: "foundation_blueprint.pdf",
        file_url: "https://example.com/files/foundation_blueprint.pdf",
        uploaded_date: "2024-12-21T08:00:00Z",
      },
    ],
    visibility: {
      internal_only: false,
      shared_with_client: true,
    },
    dependencies: [],
    front_end_elements: {
      highlighted: false,
      background_color: "#ffffff",
      font_color: "#000000",
      display_order: 2,
      editable: true,
    },
    back_end_elements: {
      database_table: "cost_items",
      api_endpoint: "/api/cost-items",
      validation_rules: {
        unit_cost: "numeric|min:0",
        quantity: "integer|min:1",
        markup: "numeric|min:0|max:100",
        tax_rate: "numeric|min:0|max:100",
      },
    },
  },
  {
    id: "12347",
    title: "Electrical Wiring",
    cost_code: "040100",
    cost_type: "Material",
    unit_cost: 20.0,
    quantity: 500,
    unit: "meters",
    total_cost: 10000.0,
    markup: 15,
    markup_type: "percentage",
    markup_value: 1500.0,
    tax_rate: 7.5,
    tax_value: 825.0,
    grand_total: 12325.0,
    description: "Electrical wiring and related materials.",
    internal_notes: "Include wiring for backup generator.",
    created_by: "user125",
    created_date: "2024-12-22T12:00:00Z",
    updated_by: "user125",
    updated_date: "2024-12-22T13:00:00Z",
    approved_by: "manager458",
    approval_date: "2024-12-22T18:00:00Z",
    status: "pending",
    category: "Electrical",
    tags: ["wiring", "electrical", "materials"],
    attachments: [],
    visibility: {
      internal_only: false,
      shared_with_client: false,
    },
    dependencies: [],
    front_end_elements: {
      highlighted: false,
      background_color: "#f0f0f0",
      font_color: "#000000",
      display_order: 3,
      editable: true,
    },
    back_end_elements: {
      database_table: "cost_items",
      api_endpoint: "/api/cost-items",
      validation_rules: {
        unit_cost: "numeric|min:0",
        quantity: "integer|min:1",
        markup: "numeric|min:0|max:100",
        tax_rate: "numeric|min:0|max:100",
      },
    },
  },
  {
    id: "12348",
    title: "Painting Services",
    cost_code: "060200",
    cost_type: "Labor",
    unit_cost: 40.0,
    quantity: 150,
    unit: "hours",
    total_cost: 6000.0,
    markup: 12,
    markup_type: "percentage",
    markup_value: 720.0,
    tax_rate: 7.5,
    tax_value: 504.0,
    grand_total: 7224.0,
    description: "Labor costs for painting the interiors.",
    internal_notes: "Use eco-friendly paints.",
    created_by: "user126",
    created_date: "2024-12-22T09:00:00Z",
    updated_by: "user126",
    updated_date: "2024-12-22T10:00:00Z",
    approved_by: "manager459",
    approval_date: "2024-12-22T14:00:00Z",
    status: "approved",
    category: "Painting",
    tags: ["painting", "labor", "interior"],
    attachments: [],
    visibility: {
      internal_only: false,
      shared_with_client: true,
    },
    dependencies: [],
    front_end_elements: {
      highlighted: false,
      background_color: "#ffffff",
      font_color: "#000000",
      display_order: 4,
      editable: true,
    },
    back_end_elements: {
      database_table: "cost_items",
      api_endpoint: "/api/cost-items",
      validation_rules: {
        unit_cost: "numeric|min:0",
        quantity: "integer|min:1",
        markup: "numeric|min:0|max:100",
        tax_rate: "numeric|min:0|max:100",
      },
    },
  },
]);

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
  <div>
    <VField v-slot="{ id }" label="Choose what to show to lead">
      <VControl>
        <Multiselect
          v-model="tagsValue"
          :attrs="{ id }"
          mode="tags"
          :searchable="true"
          :create-tag="true"
          :options="tagsOptions"
          placeholder="Add tags"
        />
      </VControl>
    </VField>
    <div class="datatable-wrapper">
      <div class="table-container">
        <table class="table datatable-table is-fullwidth" id="external-events">
          <thead>
            <th>Items</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>Unit</th>
            <th>Unit Cost</th>
            <th>Markup</th>
            <th>Margin</th>
            <th>Client Price</th>
            <th>Profit</th>
            <th>Internal Notes</th>
          </thead>
          <tbody>
            <tr
              class="events"
              v-for="(user, index) in costItems"
              :key="user.id"
              :data-event="JSON.stringify(user)"
              draggable="true"
              @dragstart="handleDragStart(index)"
              @drop="() => handleDrop(index)"
              @dragover="handleDragOver"
            >
              <td>
                <div class="is-flex">
                  <i
                    class="lnir lnir-sort"
                    style="cursor: grab"
                    aria-hidden="true"
                  ></i>

                  {{ user.id }}
                </div>
              </td>
              <td>
                <div class="flex-media">
                  <!-- <VAvatar :picture="user.picture" alt="Avatar" /> -->
                  <div class="meta">
                    <h3>{{ user.title }}</h3>
                    <span>{{ user.approved_by }}</span>
                  </div>
                </div>
              </td>
              <td>{{ user.category }}</td>
              <td>{{ user.cost_code }}</td>
              <td>
                {{ user.cost_type }}
              </td>
              <td>
                {{ user.grand_total }}
              </td>
              <td>
                {{ user.markup }}
              </td>
              <td>
                {{ user.markup_value }}
              </td>
              <td>
                {{ user.internal_notes }}
              </td>
              <td>
                <FlexTableDropdown />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <VPlaceholderPage
        v-if="costItems.length === 0"
        title="We couldn't find any matching results."
        subtitle="Too bad. Looks like we couldn't find any matching results for the search terms
            you've entered. Please try different search terms or criteria."
        larger
      >
        <template #image>
          <img
            class="light-image"
            src="/@src/assets/illustrations/placeholders/search-7.svg"
            alt=""
          />
          <img
            class="dark-image"
            src="/@src/assets/illustrations/placeholders/search-7-dark.svg"
            alt=""
          />
        </template>
      </VPlaceholderPage>
    </div>

    <!--Table Pagination-->
    <VFlexPagination
      v-if="costItems.length > 5"
      v-model:current-page="page"
      :item-per-page="10"
      :total-items="873"
      :max-links-displayed="7"
      no-router
      class="mt-4"
    />
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
