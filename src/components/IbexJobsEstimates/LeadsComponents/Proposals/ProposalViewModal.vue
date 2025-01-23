<script setup lang="ts">
import { popovers } from "/@src/data/users/userPopovers";
import { getColumnName, getColumnData, costItems } from "../../proposalItems";
import { forEach } from "cypress/types/lodash";
import { useProposalStore } from "/@src/stores/LeadEstimatesStore/proposalStore";
import { useApi } from "/@src/composable/useAPI";
const api = useApi();
const props = withDefaults(
  defineProps<{
    previewModal?: boolean;
    columnsToShow: any;
    proposalId: string;
  }>(),
  {
    columnsToShow: false,
    columnsToShow: [],
    proposalId: "",
  }
);
const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: null): void;
}>();
const useProposal = useProposalStore();
const data = ref([
  {
    name: "Website Redesign",
    unit: "hrs",
    quantity: 54,
    rate: 24,
  },
  {
    name: "Logo Design",
    unit: "hrs",
    quantity: 12,
    rate: 24,
  },
  {
    name: "Custom Illustrations",
    unit: "hrs",
    quantity: 7,
    rate: 32,
  },
]);

const vatRate = 0.1;
const totalData = computed(() => {
  const subtotal = data.value.reduce((acc, item) => {
    return acc + item.quantity * item.rate;
  }, 0);
  const vatValue = subtotal * vatRate;
  const total = subtotal + vatValue;

  return [
    {
      label: "Subtotal",
      value: subtotal,
    },
    {
      label: "Taxes",
      value: vatValue,
    },
    {
      label: "Total",
      value: total,
    },
  ];
});

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const columns = [
  "Item",
  "Description",
  "Unit Cost",
  "Qty",
  "Unit",
  "Builder Cost",
  "Markup",
  "Total Price",
];

const totalColumns = {
  label: {
    label: "",
    grow: "xl",
    align: "end",
  },
  value: {
    label: "",
    bold: true,
    format: (value: any) => usdFormatter.format(value),
  },
} as const;

const header = ref("");

const body = ref(true);
const contactInfo = ref(true);
const showAddress = ref(true);
const oneLiner = ref(true);

const totalPrice = computed(() => {
  return costItems.value.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
});
const loading = ref(false);
const proposalDetail = ref({
  id: "c897de41-609f-4a20-8d79-0537b6a873d6",
  title: "Test Lead's Proposal",
  approval_deadline: "2025-01-30",
  internal_notes: null,
  introductory_text: null,
  closing_text: null,
  payment_status: "Pending",
  type: "proposal",
  status: "pending",
  created_at: "2025-01-21T19:08:06.509861Z",
  updated_at: "2025-01-21T19:08:06.509875Z",
  job: "da0aa7c1-3744-4856-a637-e5a821f5ec7e",
});

const proposalCostItems = ref([
  {
    id: "5e7d026a-b392-47e9-9d24-58fbc1de12c5",
    index: 1,
    title: "Test Lead Proposal Item",
    description: "<p>Description</p>",
    type: "",
    quantity: 100,
    unit: "Sq ft",
    unit_cost: "10.00",
    markup: "150.00",
    total_price: "1150.00",
    cost_code: "11012",
    cost_type: "material",
    builder_cost: "1000.00",
    margin: "1.00",
    profit: "0.00",
    internal_notes: "Internal notes",
    mark_as: "bid",
    state: "active",
    group_amount: "0.00",
    status: null,
    created_at: "2025-01-23T18:25:46.392750Z",
    proposal: "c897de41-609f-4a20-8d79-0537b6a873d6",
  },
]);

const closeModalHandler = () => {
  emit("update:modalHandler", false);
};
const getProposalDetail = async () => {
  try {
    loading.value = true;
    const resp = await api.get(`/api/lead-proposal/${props.proposalId}/`);
    getProposalCostItems();
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const getProposalCostItems = async () => {
  try {
    const resp = await api.get(`api/cost/by-proposal/${props.proposalId}/`);
    proposalCostItems.value = resp.data;
  } catch (err) {
    console.log(err);
  }
};

onMounted(() => {
  getProposalDetail();
});
</script>

<template>
  <VModal
    is="form"
    :open="props.previewModal"
    title="Cost Item "
    size="xl"
    actions="right"
    @close="closeModalHandler"
  >
    <template #content>
      <div class="columns is-multiline">
        <div class="column is-12">
          <div class="invoice-wrapper">
            <div class="invoice-header">
              <div class="left">
                <h3>Proposal-ID PD-456-14</h3>
              </div>
              <div class="right">
                <div class="controls">
                  <a class="action">
                    <i
                      aria-hidden="true"
                      class="iconify"
                      data-icon="feather:printer"
                    />
                  </a>
                  <a class="action">
                    <i
                      aria-hidden="true"
                      class="iconify"
                      data-icon="feather:download-cloud"
                    />
                  </a>
                  <a class="action">
                    <i
                      aria-hidden="true"
                      class="iconify"
                      data-icon="feather:mail"
                    />
                  </a>
                </div>
              </div>
            </div>
            <div class="invoice-body">
              <div class="invoice-card">
                <div class="invoice-section is-flex is-bordered">
                  <VAvatar size="xl" picture="/logos/IbexFavicon.png" />

                  <div class="meta"></div>
                  <div class="end">
                    <span>PO Box 242</span>
                    <span>Evergreen, CO 80437-0242</span>
                    <span>Phone: 720 272-9061</span>
                    <span>Premium Trades for Premier Builders</span>
                  </div>
                </div>

                <div class="invoice-section is-flex is-bordered">
                  <div class="meta">
                    <h3>Client Name</h3>
                    <span>Client Phone</span>
                    <span>25724 Independence Trail Evergreen, CO 80439</span>
                  </div>
                  <div class="end is-left">
                    <h3>Friday Jan 17, 2025</h3>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Quod equidem non reprehendo.
                    </p>
                  </div>
                </div>
                <div class="invoice-section" v-if="proposalCostItems.length">
                  <table class="responsive-table">
                    <thead>
                      <th v-for="(column, index) in columns" :key="index">
                        {{ column }}
                      </th>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(cost, index) in proposalCostItems"
                        :key="cost.id"
                      >
                        <td>
                          <span>
                            {{ cost.title }}
                          </span>
                          <br />
                          <span>
                            {{ cost.cost_code }}
                          </span>
                        </td>
                        <td>
                          <span v-html="cost.description"> </span>
                        </td>
                        <td>
                          <span> ${{ cost.unit_cost }}</span>
                        </td>
                        <td>
                          <span> {{ cost.quantity }}</span>
                        </td>
                        <td>
                          <span> {{ cost.unit }}</span>
                        </td>
                        <td>
                          <span> ${{ cost.builder_cost }}</span>
                        </td>
                        <td>
                          <span> ${{ cost.markup }}</span>
                        </td>
                        <td>
                          <span> ${{ cost.total_price }}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="invoice-section is-flex mt-0 pt-0">
                  <div class="end is-left">
                    <h3 class="text-right">Total Price: ${{ totalPrice }}</h3>
                    <p>Mentioned price are final</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #action>
      <VButton
        :loading="loading"
        type="submit"
        color="warning"
        raised
        @click="closeModalHandler"
        >Close</VButton
      >
    </template>
  </VModal>
</template>

<style lang="scss">
@import "/@src/scss/abstracts/all";

.responsive-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}
.responsive-table tr {
  border: 1px solid #ddd;
}

.responsive-table thead {
  border: 1px solid #ddd;
  padding: 10px;
}
.responsive-table th {
  font-size: 12px;
  font-weight: 500;
  padding: 10px;
}
.responsive-table td {
  padding: 10px;
  font-size: 11px;
  text-align: left;
}

.responsive-table th {
  background-color: #fff;
}

.description-list {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

@media (max-width: 768px) {
  .responsive-table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
}

.main-wrapper {
  width: 100%;
}

/* ==========================================================================
4. Invoice
========================================================================== */
.invoice-wrapper {
  max-width: 740px;
  margin: 0 auto;

  &.is-navbar {
    margin-top: 30px;
  }

  .invoice-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--fade-grey-dark-4);

    .left {
      h3 {
        font-family: var(--font-alt);
        font-size: 1.2rem;
        font-weight: 600;
        color: var(--dark-text);
      }
    }

    .right {
      .controls {
        display: flex;

        .action {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 32px;
          width: 32px;
          min-width: 32px;
          border-radius: var(--radius-rounded);
          color: var(--light-text);
          margin: 0 4px;
          transition: all 0.3s; // transition-all test

          &:hover {
            color: var(--dark-text);
            background: var(--fade-grey-dark-4);
          }

          svg {
            height: 16px;
            width: 16px;
            stroke-width: 1.6px;
          }
        }
      }
    }
  }

  .invoice-body {
    .invoice-card {
      @include vuero-s-card;

      padding: 0;

      .invoice-section {
        padding: 40px;

        &.is-flex {
          display: flex;
          align-items: center;

          .meta {
            margin-inline-start: 16px;
            font-family: var(--font);

            h3 {
              font-family: var(--font-alt);
              font-size: 1.1rem;
              font-weight: 600;
              line-height: 1;
            }

            span {
              display: block;
              color: var(--light-text);
              font-weight: 400;
              font-size: 0.9rem;
            }
          }

          .end {
            margin-inline-start: auto;
            text-align: inset-inline-end;

            &.is-left {
              text-align: inset-inline-start;
              max-width: 300px;

              p {
                padding-top: 4px;
                font-size: 0.95rem;
                line-height: 1.2;
              }
            }

            h3 {
              font-family: var(--font-alt);
              font-size: 1.1rem;
              font-weight: 600;
              line-height: 1;
            }

            span {
              display: block;
              color: var(--light-text);
              font-weight: 400;
              font-size: 0.9rem;
            }
          }
        }

        &.is-bordered {
          border-bottom: 1px solid var(--fade-grey-dark-3);
        }

        .v-avatar {
          &.is-customer {
            border: 1.6px solid var(--fade-grey-dark-3);
            border-radius: var(--radius-rounded);
            box-shadow: var(--light-box-shadow);
          }
        }

        .flex-table {
          .flex-table-header {
            span {
              &:not(:first-child) {
                justify-content: flex-end;
              }
            }
          }

          .flex-table-item {
            .flex-table-cell {
              &:not(:first-child) {
                justify-content: flex-end;
              }
            }
          }
        }
      }
    }
  }
}

/* ==========================================================================
5. Invoice Dark mode
========================================================================== */

.is-dark {
  .invoice-wrapper {
    .invoice-header {
      border-color: var(--dark-sidebar-light-20);

      .left {
        h3 {
          color: var(--dark-dark-text);
        }
      }

      .right {
        .controls {
          .action {
            border: 1px solid transparent;

            &:hover,
            &:focus {
              background: var(--dark-sidebar-light-2);
              border-color: var(--primary);
              color: var(--primary);
            }
          }
        }
      }
    }

    .invoice-body {
      .invoice-card {
        @include vuero-card--dark;
      }
    }

    .invoice-section {
      border-color: var(--dark-sidebar-light-12) !important;

      &.is-flex {
        .v-avatar {
          border-color: var(--dark-sidebar-light-12) !important;
        }

        .meta,
        .end {
          h3 {
            color: var(--dark-dark-text);
          }
        }
      }
    }
  }
}

@media only screen and (width <= 767px) {
  .invoice-wrapper {
    .invoice-section {
      &.is-flex {
        flex-direction: column;
        text-align: center;

        .v-avatar {
          margin-bottom: 16px;
        }

        .meta {
          margin-inline-start: 0 !important;
        }

        .end {
          margin: 16px auto 0;
          text-align: center !important;
        }
      }

      .flex-table {
        .flex-table-item {
          .flex-table-cell {
            &.is-grow {
              > span {
                margin-inline-start: 0;
              }
            }
          }
        }
      }
    }
  }
}
</style>
