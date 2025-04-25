<script setup lang="ts">
import { useProposalStore } from "/@src/stores/LeadEstimatesStore/proposalStore";
import {
  selectedColumnsToShow,
  getColumnName,
  getColumnData,
} from "/@src/components/CommonComponents/CostItemComponents/costItems";
import {
  downloadProposalPdf,
  printPDF,
  fileLoading,
} from "../../proposalsComponents";
import { useCompany } from "/@src/stores/company";

const company = useCompany();
const props = defineProps<{
  columnsToShow?: any;
  proposalData?: any;
}>();

const useProposal = useProposalStore();
const openSendProposalModal = ref(false);
const columnsToShow = ref([]);
const selectedProposalsIds = ref([]);
const proposalFormData = ref({});
const openSendProposalModalHandler = () => {
  selectedProposalsIds.value.push(props.proposalData);
  proposalFormData.value = props.proposalData;
  columnsToShow.value = useProposal.leadProposalFormData.columns_to_show;
  openSendProposalModal.value = !openSendProposalModal.value;
};

// const priceElement = document.querySelector(".price");
// priceElement.textContent = formatCurrency(parseFloat(priceElement.textContent));

function formatCurrency(amount: any) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

const getProposalType = ref({
  proposal: "Proposal",
  change_order: "Change Order",
  draft: "Draft",
});

onMounted(() => {});
</script>

<template>
  <div class="columns is-multiline">
    <div class="column is-9">
      <h1 class="title is-5 m-1 p-0">Preview Lead Proposal</h1>
      <p class="m-1">
        Below is a preview of the proposal that will be sent as a link to the
        email addresses on this client contact. The proposal can be accessed
        through the link while it is Released.
      </p>
    </div>
    <!-- <div class="column is-4">
      <h1 class="subtitle is-5 is-bold">Layout Options</h1>
      <h1 class="subtitle is-6 mb-0">Header</h1>
      <VField>
        <VControl class="flex-columns">
          <VRadio
            v-model="header"
            value="center"
            label="Centralized"
            name="outlined_radio"
            color="info"
            class="m-0 p-2"
          />
          <VRadio
            v-model="header"
            value="split"
            label="Space between"
            name="outlined_radio"
            color="info"
            class="m-0 p-2"
          />
        </VControl>
      </VField>
      <h1 class="subtitle is-6 mb-0">Body</h1>
      <VField>
        <VControl class="flex-columns">
          <VRadio
            v-model="body"
            value="column"
            label="Columns"
            name="outlined_radio"
            color="info"
            class="m-0 p-2"
          />
          <VRadio
            v-model="body"
            value="multiline"
            label="Multiline"
            name="outlined_radio"
            color="info"
            class="m-0 p-2"
          />
          <VRadio
            v-model="body"
            value="none"
            label="None"
            name="outlined_radio"
            color="info"
            class="m-0 p-2"
          />
        </VControl>
      </VField>
    </div>
    <div class="column is-4">
      <h1 class="subtitle is-5 is-bold">Customer Information</h1>
      <VField class="flex-columns">
        <VControl raw subcontrol>
          <VCheckbox
            class="mt-2 p-0"
            v-model="contactInfo"
            label="Show Client Contact and Phone"
            color="info"
          />
        </VControl>
        <VControl raw subcontrol>
          <VCheckbox
            class="mt-4 p-0"
            v-model="showAddress"
            label="Show Address"
          />
        </VControl>
      </VField>
    </div>
    <div class="column is-4">
      <h1 class="subtitle is-5 is-bold">Company Information</h1>
      <VField class="flex-columns">
        <VControl raw subcontrol>
          <VCheckbox
            class="mt-2 p-0"
            v-model="oneLiner"
            label="Show Company One Liner"
          />
        </VControl>
      </VField>
    </div> -->
    <div class="column is-12">
      <div class="invoice-wrapper">
        <div class="invoice-header">
          <div class="left">
            <h3>
              Proposal-ID {{ useProposal.leadProposalFormData?.id.slice(0, 8) }}
            </h3>
          </div>
          <div class="right">
            <div class="controls">
              <VIconButton
                v-if="fileLoading == 1"
                color="primary"
                outlined
                size="small"
                loading
                circle
                icon="lucide:plus"
              />
              <a
                v-else
                class="action"
                @click="printPDF(useProposal.leadProposalFormData?.id)"
              >
                <i
                  aria-hidden="true"
                  class="iconify"
                  data-icon="feather:printer"
                />
              </a>

              <VIconButton
                v-if="fileLoading == 3"
                color="primary"
                outlined
                size="small"
                loading
                circle
                icon="lucide:plus"
              />
              <a
                v-else
                class="action"
                @click="downloadProposalPdf(useProposal.leadProposalFormData)"
              >
                <i
                  aria-hidden="true"
                  class="iconify"
                  data-icon="feather:download-cloud"
                />
              </a>
              <a class="action" @click="openSendProposalModalHandler">
                <i
                  aria-hidden="true"
                  class="iconify"
                  data-icon="feather:mail"
                />
              </a>
            </div>
            <!-- <div>
              {{ useProposal.leadProposalFormData }}
            </div> -->
          </div>
        </div>
        <div class="invoice-body">
          <div class="invoice-card">
            <!-- Company info -->
            <div class="invoice-section is-flex pt-0">
              <img
                style="height: 160px; padding: 0; margin: 0"
                :src="company.currentCompany.invoice_header_logo"
              />

              <div class="meta"></div>
              <div class="end is-right">
                <span>PO Box 242</span>
                <span>Evergreen, CO 80437-0242</span>
                <span>Phone: 720 272-9061</span>
                <span>{{ company.currentCompany.branding_line }}</span>
              </div>
            </div>

            <!-- Client Info -->
            <div class="invoice-section is-flex">
              <div class="meta">
                <h3 v-if="useProposal.leadProposalFormData?.jobInfo?.title">
                  {{
                    useProposal.leadProposalFormData?.jobInfo?.title
                      ? useProposal.leadProposalFormData?.jobInfo?.title
                      : ""
                  }}
                </h3>
                <span
                  v-if="useProposal.leadProposalFormData?.jobInfo?.clientInfo"
                >
                  {{
                    useProposal.leadProposalFormData?.jobInfo?.clientInfo
                      ?.username ?? ""
                  }}
                  {{
                    useProposal.leadProposalFormData?.jobInfo?.clientInfo
                      ?.last_name ?? ""
                  }}
                </span>
                <span v-else>
                  {{
                    useProposal.leadProposalFormData?.jobInfo?.contractor_info
                      ?.username ?? ""
                  }}
                  {{
                    useProposal.leadProposalFormData?.jobInfo?.contractor_info
                      ?.last_name ?? ""
                  }}
                </span>

                <span v-else>{{
                  useProposal.leadProposalFormData?.jobInfo?.contractor_info
                    ?.email
                    ? useProposal.leadProposalFormData?.jobInfo?.contractor_info
                        ?.email
                    : ""
                }}</span>
                <span>
                  {{ getProposalType[useProposal.leadProposalFormData?.type] }}
                </span>
              </div>
              <div class="end is-left">
                <h3>
                  {{ useProposal.leadProposalFormData?.title }}
                </h3>
                <p>
                  {{ useProposal.leadProposalFormData?.jobInfo?.address ?? "" }}
                </p>
              </div>
            </div>

            <!-- table section -->
            <div class="invoice-section">
              <table class="responsive-table">
                <thead>
                  <th
                    v-for="(column, index) in props.columnsToShow"
                    :key="index"
                  >
                    {{ getColumnName[column] }}
                  </th>
                </thead>
                <tbody>
                  <tr
                    v-for="(cost, index) in useProposal.proposalCostItems"
                    :key="cost.id"
                  >
                    <td v-for="(column, key) in props.columnsToShow" :key="key">
                      <div
                        class="custom-description"
                        v-if="column === 'description'"
                        v-html="cost[getColumnData[column]]"
                      ></div>
                      <span v-else-if="column === 'cost_code'">
                        {{ cost?.cost_code_info?.name }}
                      </span>
                      <span v-else-if="column === 'unit_cost'">
                        {{ formatCurrency(cost?.unit_cost) }}
                      </span>
                      <span v-else-if="column === 'margin'">
                        {{ formatCurrency(cost?.margin) }}
                      </span>
                      <span v-else-if="column === 'markup'">
                        {{ formatCurrency(cost?.markup) }}
                      </span>
                      <span v-else-if="column === 'builder_cost'">
                        {{ formatCurrency(cost?.builder_cost) }}
                      </span>
                      <span v-else-if="column === 'total_price'">
                        {{ formatCurrency(cost?.total_price) }}
                      </span>
                      <span v-else-if="column === 'profit'">
                        {{ formatCurrency(cost?.profit) }}
                      </span>
                      <span v-else-if="column === 'group_amount'">
                        {{ formatCurrency(cost?.group_amount) }}
                      </span>
                      <!-- <span v-else-if="column === 'unit'">
                        {{ getUnitsLabel(cost?.unit) }}
                      </span> -->

                      <span v-else>
                        {{ cost[getColumnData[column]] }}
                      </span>
                      <!-- {{ cost[getColumnData[column]] }} -->
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="invoice-section is-flex mt-0 pt-0">
              <div class="end is-left">
                <h3 class="text-right">
                  Total Price:
                  {{
                    formatCurrency(
                      useProposal.leadProposalFormData?.proposalAmount
                    )
                  }}
                </h3>
              </div>
            </div>

            <div class="invoice-section is-flex mt-0 pt-0">
              <div class="footer">
                <h1 class="subtitle is-6 py-0 mb-0">
                  I confirm that my action here represents my electronic
                  signature and is binding.
                </h1>
                <div class="footer-meta">
                  <p>Signature:</p>
                  <div></div>
                </div>
                <div class="footer-meta">
                  <p>Date:</p>
                  <div></div>
                </div>
                <div class="footer-meta">
                  <p class="no-wrap">Print Name:</p>
                  <div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <SendProposalEmailModal
      v-if="openSendProposalModal"
      :proposalSenderModal="openSendProposalModal"
      :selectedProposalsIds="selectedProposalsIds"
      :proposalData="props.proposalData"
      :columnsToShow="props.columnsToShow"
      @update:modalHandler="
        openSendProposalModal = false;
        selectedProposalsIds = [];
      "
    />
  </div>
</template>

<style lang="scss" scoped>
@import "/@src/scss/abstracts/all";
.custom-description {
  color: #000000 !important;

  ::v-deep p {
    color: var(--dark-text) !important;
    font-style: normal !important;
    font-family: var(--font) !important;
  }
}
.footer {
  width: 100%;
  background-color: transparent;
}

.footer-meta {
  margin-bottom: 8px;
  display: flex;
}

.footer-meta p {
  width: 15%;
  color: var(--dark-inverted);
  padding-top: 6px;
  transform: translateY(10px);
}

.footer-meta div {
  width: 80%;
  border-bottom: 1px solid #ddd;
}

.responsive-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  background-color: transparent;
}
.responsive-table tr {
  border: 1px solid #ddd;
  background-color: transparent;
}

.responsive-table thead {
  border: 1px solid #ddd;
  padding: 10px;
  background-color: transparent;
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
  background-color: transparent;
}

.responsive-table th {
  background-color: transparent;
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
