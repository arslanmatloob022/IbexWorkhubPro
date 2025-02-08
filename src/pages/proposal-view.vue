<script setup lang="ts">
import { useApi } from "/@src/composable/useAPI";
import {
  getColumnName,
  getColumnData,
} from "../components/CommonComponents/CostItemComponents/costItems";
import { useNotyf } from "../composable/useNotyf";
const selectedStatus = ref("");
const notyf = useNotyf();
const route = useRoute();
const api = useApi();
const props = withDefaults(
  defineProps<{
    previewModal?: boolean;
    columnsToShow: any;
    proposalId: string;
  }>(),
  {
    columnsToShow: false,
    proposalId: "",
  }
);
const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: null): void;
}>();

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
const SweetAlertProps = ref({
  title: "",
  subtitle: "test",
  isSweetAlertOpen: false,
  btntext: "text",
});

const openReviewModal = ref(false);
const loading = ref(false);
const proposalDetail = ref({
  id: "",
  title: "",
  approval_deadline: "",
  internal_notes: null,
  introductory_text: null,
  closing_text: null,
  columns_to_show: [],
  payment_status: "",
  type: "",
  status: "",
  created_at: "",
  updated_at: "",
  job: "",
});

const proposalCostItems = ref([
  {
    id: "",
    index: 0,
    title: "",
    description: "",
    type: "",
    quantity: 0,
    unit: "",
    unit_cost: "",
    markup: "",
    total_price: "",
    cost_code: "",
    cost_type: "",
    builder_cost: "",
    margin: "",
    profit: "",
    internal_notes: "",
    mark_as: "",
    state: "",
    group_amount: "",
    status: null,
    created_at: "",
    proposal: "",
  },
]);

const getProposalDetail = async () => {
  try {
    loading.value = true;
    const resp = await api.get(
      `/api/lead-proposal/${route.query.proposal}/detail/`
    );
    proposalDetail.value = resp.data;
    getProposalCostItems();
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const openProposalAlert = (status: any) => {
  selectedStatus.value = status;
  SweetAlertProps.value = {
    title: `${selectedStatus.value.toLocaleUpperCase()} proposal ?`,
    subtitle: `${
      selectedStatus.value == "approve"
        ? "You are going to approve this proposal and as you do so Ibex Team will start working on mentioned work."
        : "You are about to Disapprove the proposal that will identify us that you are not going to have done the mentioned work at your site."
    }`,
    btntext: `${selectedStatus.value == "approve" ? "Approve" : "Disapprove"}`,
    isSweetAlertOpen: true,
  };
};

const updateProposalStatus = async () => {
  try {
    loading.value = true;
    const resp = await api.patch(
      `/api/lead-proposal/${route.query.proposal}/`,
      {
        status: selectedStatus.value,
      }
    );
    notyf.success(`You have ${selectedStatus.value} this proposal.`);
    SweetAlertProps.value.isSweetAlertOpen = false;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const getProposalCostItems = async () => {
  try {
    const resp = await api.get(`api/cost/by-proposal/${route.query.proposal}/`);
    proposalCostItems.value = resp.data;
  } catch (err) {
    console.log(err);
  }
};

onMounted(() => {
  if (route.query.proposal) {
    getProposalDetail();
  }
});
</script>

<template>
  <div class="columns is-multiline">
    <div class="column is-12 mt-4">
      <div class="invoice-wrapper">
        <div class="invoice-header">
          <div class="left">
            <h3>Proposal {{ route.query.proposal?.slice(0, 8) }}</h3>
          </div>
          <div class="right">
            <div class="controls">
              <VButton
                size="xsmall"
                @click="openProposalAlert('approve')"
                outlined
                color="primary"
                >Approve</VButton
              >
              <VButton
                size="xsmall"
                @click="openReviewModal = !openReviewModal"
                class="ml-2"
                outlined
                color="info"
                >Review</VButton
              >
              <VButton
                @click="openProposalAlert('disapprove')"
                size="xsmall"
                class="ml-2"
                outlined
                color="danger"
                >Disapprove</VButton
              >
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
                <h3>Job: {{ proposalDetail.jobInfo?.title ?? "N/A" }}</h3>
                <p>Address: {{ proposalDetail.jobInfo?.address ?? "N/A" }}</p>
              </div>
            </div>
            <div class="invoice-section" v-if="proposalCostItems.length">
              <table class="responsive-table">
                <thead>
                  <th
                    v-for="(column, index) in proposalDetail.columns_to_show"
                    :key="index"
                  >
                    {{ getColumnName[column] }}
                  </th>
                </thead>
                <tbody>
                  <tr v-for="(cost, index) in proposalCostItems" :key="cost.id">
                    <td
                      v-for="(column, index) in proposalDetail.columns_to_show"
                      :key="index"
                    >
                      <div
                        v-if="column === 'Description'"
                        v-html="cost[getColumnData[column]]"
                      ></div>
                      <span v-else>
                        {{ cost[getColumnData[column]] }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="invoice-section is-flex mt-0 pt-0">
              <div class="end is-left">
                <h3 class="text-right">
                  Total Price: ${{ proposalDetail.proposalAmount ?? 0 }}
                </h3>
                <!-- <p>Mentioned price are final</p> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <SweetAlert
      v-if="SweetAlertProps.isSweetAlertOpen"
      :isSweetAlertOpen="SweetAlertProps.isSweetAlertOpen"
      :title="SweetAlertProps.title"
      :subtitle="SweetAlertProps.subtitle"
      :btntext="SweetAlertProps.btntext"
      :onConfirm="updateProposalStatus"
      :onCancel="() => (SweetAlertProps.isSweetAlertOpen = false)"
    />
    <ProposalReviewModal
      v-if="openReviewModal"
      :proposalReviewModal="openReviewModal"
      :proposalId="route.query.proposal"
      @closeModalHandler="openReviewModal = false"
      @update:OnSuccess=""
    />
  </div>
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
