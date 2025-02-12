<script setup lang="ts">
import { useApi } from "/@src/composable/useAPI";
import {
  selectedColumnsToShow,
  columnsTitle,
} from "../../CommonComponents/CostItemComponents/costItems";
import { useNotyf } from "/@src/composable/useNotyf";
import { convertToFormData } from "/@src/composable/useSupportElement";
const loading = ref(false);
const api = useApi();
const notyf = useNotyf();
const proposalCreated = ref("");
const tardeList = ref([
  {
    value: "",
    label: "",
  },
]);
interface Proposal {
  id: string;
  title: string;
}
const props = withDefaults(
  defineProps<{
    groupProposalModal?: boolean;
    leadID: string;
    selectedProposals?: any;
  }>(),
  {
    groupProposalModal: false,
    leadID: "",
    selectedProposals: [],
  }
);
const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: null): void;
  (e: "removeProposal", value: any): void;
}>();

const removeItem = (item: any) => {
  emit("removeProposal", item);
};
const proposalList = ref([
  {
    id: "",
    proposalAmount: 0.0,
    title: "",
    approval_deadline: "",
    internal_notes: "",
    introductory_text: "",
    closing_text: "",
    payment_status: "",
    type: "",
    status: "",
    created_at: "",
    updated_at: "",
    job: "",
  },
]);
const proposalIds = props.selectedProposals.map((proposal) => proposal.id);
const groupProposalData = ref({
  title: "",
  type: "combined",
  description: "",
  proposals: proposalIds,
  trades: [],
  columns_to_show: [],
});

const closeModalHandler = () => {
  emit("update:modalHandler", false);
};

const mergeProposalsHandler = async () => {
  try {
    loading.value = true;
    let payload = groupProposalData.value;
    payload.columns_to_show = JSON.stringify(
      groupProposalData.value.columns_to_show
    );
    payload.proposals = JSON.stringify(groupProposalData.value.proposals);
    const resp = await api.post(
      `/api/lead-proposal/merge-proposals/`,
      payload,
      {
        responseType: "blob",
      }
    );

    const blob = new Blob([resp.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Merged_Proposal.pdf"; // Set file name
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a); // Cleanup
    window.URL.revokeObjectURL(url); // Free up memory
    closeModalHandler();
    notyf.success("Proposal grouped successfully and saved in documents list");
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const getLeadProposals = async () => {
  try {
    loading.value = true;
    const resp = await api.get(``);
    proposalList.value = resp.data;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const getCostTradesHandler = async () => {
  try {
    const response = await api.get(`/api/cost-trade/`);
    tardeList.value = response.data.map((item: any) => {
      return {
        value: item.id,
        label: item.name,
      };
    });
  } catch (err) {
    console.log(err);
  } finally {
  }
};

onMounted(() => {
  getCostTradesHandler();
});
</script>

<template>
  <VModal
    is="form"
    :open="props.groupProposalModal"
    title="Group Proposal"
    size="large"
    actions="right"
    @submit.prevent="mergeProposalsHandler"
    @close="closeModalHandler()"
  >
    <template #content>
      <div class="columns is-multiline">
        <div class="column is-12">
          <VGrid>
            <VGridItem>
              <VSnack
                v-for="item in props.selectedProposals"
                :title="item.title"
                white
                class="m-1"
                icon="lnir lnir-envelope"
              >
                <VIcon @click="removeItem(item)" icon="lucide:x" />
              </VSnack>
            </VGridItem>
          </VGrid>
        </div>
        <div class="column is-12">
          <VField label="Select Group Type">
            <VControl>
              <VRadio
                v-model="groupProposalData.type"
                value="combined"
                label="Combine Proposals"
                name="outlined_squared_radio"
                color="warning"
                square
              />

              <VRadio
                v-model="groupProposalData.type"
                value="trade"
                label="Trade Proposal"
                name="outlined_squared_radio"
                color="primary"
                square
              />

              <VRadio
                v-model="groupProposalData.type"
                value="summary"
                label="Summary Proposal"
                name="outlined_squared_radio"
                color="info"
                square
              />
              <VRadio
                v-model="groupProposalData.type"
                value="report"
                label="Report"
                name="outlined_squared_radio"
                color="success"
                square
              />
            </VControl>
          </VField>
        </div>
        <div class="column is-12">
          <VField label="Proposal Title *">
            <VControl>
              <VInput
                v-model="groupProposalData.title"
                placeholder="Enter Group Proposal Title"
                type="text"
                name="title"
                required
              />
            </VControl>
          </VField>
        </div>
        <!-- <div class="column is-12">
          <VField
            v-slot="{ id }"
            label="Choose what to merge in show in group proposal"
          >
            <VControl>
              <Multiselect
                v-model="groupProposalData.columns_to_show"
                :attrs="{ id }"
                mode="tags"
                :searchable="true"
                :create-tag="true"
                :options="columnsTitle"
                placeholder="Add columns"
              />
            </VControl>
          </VField>
        </div> -->

        <div class="column is-12">
          <VField
            v-if="groupProposalData.type == 'trade'"
            v-slot="{ id }"
            label="Select the trades to merge"
          >
            <VControl>
              <Multiselect
                v-model="groupProposalData.trades"
                :attrs="{ id }"
                mode="tags"
                :searchable="true"
                :create-tag="true"
                :options="tardeList"
                placeholder="Select Trade"
              />
            </VControl>
          </VField>
        </div>
        <div class="column is-12">
          <VField label="Group Description">
            <VControl>
              <VTextarea
                v-model="groupProposalData.description"
                placeholder="Enter Group Proposal Title"
                rows="3"
                type="text"
              />
            </VControl>
          </VField>
        </div>
      </div>
    </template>
    <template #action>
      <VButton :loading="loading" type="submit" color="warning" raised
        >Group Proposals</VButton
      >
    </template>
  </VModal>
</template>

<style lang="scss" scoped>
@import "/@src/scss/abstracts/all";

.list-view-v2 {
  .list-view-item {
    @include vuero-s-card;

    margin-bottom: 16px;
    padding: 16px;

    &:hover,
    &:focus {
      box-shadow: var(--light-box-shadow);
    }

    .list-view-item-inner {
      display: flex;

      > img {
        display: block;
        min-height: 130px;
        max-height: 130px;
        min-width: 190px;
        max-width: 190px;
        object-fit: cover;
        border-radius: var(--radius);
      }

      .meta-left {
        display: flex;
        flex-direction: column;
        margin-inline-start: 16px;

        h3 {
          font-family: var(--font-alt);
          color: var(--dark-text);
          font-weight: 600;
          font-size: 1.1rem;
          line-height: 1.5;

          .rating {
            margin-inline-start: 12px;

            i {
              font-size: 12px;
            }
          }
        }

        p {
          font-size: 0.95rem;
          color: var(--light-text);

          svg {
            height: 12px;
            width: 12px;
          }
        }

        > span {
          display: flex;
          align-items: center;
          margin-top: 10px;
          font-family: var(--font);
          font-size: 0.9rem;
          color: var(--primary);

          .icon-separator {
            font-size: 5px;
            color: var(--light-text);
            padding: 0 10px;
          }
        }

        .icon-list {
          margin-top: auto;
          display: flex;

          > span {
            display: flex;
            align-items: center;
            margin-inline-end: 15px;

            span {
              font-size: 0.85rem;
              font-family: var(--font-alt);
              color: var(--dark-text);
            }

            i {
              font-size: 1.2rem;
              margin-inline-end: 6px;
              color: var(--light-text);
            }
          }
        }
      }

      .meta-right {
        margin-inline-start: auto;
        display: flex;
        align-items: center;
        justify-content: flex-end;

        .buttons {
          margin-bottom: 0;
          margin-inline-end: 10px;
        }
      }
    }
  }
}

.is-dark {
  .list-view-v2 {
    .list-view-item {
      @include vuero-card--dark;

      .list-view-item-inner {
        .meta-left {
          h3 {
            color: var(--dark-dark-text) !important;
          }

          > span {
            color: var(--primary);
          }

          .icon-list {
            > span {
              span {
                color: var(--dark-dark-text);
              }
            }
          }
        }

        .meta-right {
          .buttons {
            .button {
              &:first-child {
                background: var(--dark-sidebar-light-2);
                border-color: var(--dark-sidebar-light-8);
                color: var(--dark-dark-text);
              }
            }
          }
        }
      }
    }
  }
}

@media only screen and (width <= 767px) {
  .list-view-v2 {
    .list-view-item {
      padding: 20px;

      .list-view-item-inner {
        flex-direction: column;

        > img {
          width: 100%;
          max-width: 100%;
          min-height: 160px;
          max-height: 160px;
          margin-bottom: 1rem;
        }

        .meta-left {
          margin-inline-start: 0;

          > span {
            margin-bottom: 16px;
          }

          .icon-list {
            flex-wrap: wrap;

            > span {
              flex-direction: column;
              text-align: center;
              margin: 10px;
              width: calc(33.3% - 20px);

              i {
                margin: 0;
              }
            }
          }
        }

        .meta-right {
          margin: 16px 0 0;

          .buttons {
            margin: 0;
            width: 100%;
            display: flex;
            justify-content: space-between;

            .button {
              width: 48%;
            }
          }
        }
      }
    }
  }
}

@media only screen and (width >= 768px) and (width <= 1024px) and (orientation: portrait) {
  .list-view-v2 {
    .list-view-inner {
      display: flex;
      flex-wrap: wrap;

      .list-view-item {
        padding: 20px;
        margin: 10px;
        width: calc(50% - 20px);

        .list-view-item-inner {
          flex-direction: column;
          height: 100%;
          min-height: 450px;

          > img {
            width: 100%;
            max-width: 100%;
            min-height: 160px;
            max-height: 160px;
            margin-bottom: 1rem;
          }

          .meta-left {
            margin-inline-start: 0;

            > span {
              margin-bottom: 16px;
            }

            .icon-list {
              flex-wrap: wrap;

              > span {
                flex-direction: column;
                text-align: center;
                margin: 10px;
                width: calc(33.3% - 20px);

                i {
                  margin: 0;
                }
              }
            }
          }

          .meta-right {
            margin: auto 0 0;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;

            .buttons {
              margin: 16px 0 0;
              width: 100%;
              display: flex;
              justify-content: space-between;

              .button {
                width: 48%;
              }
            }
          }
        }
      }
    }
  }
}
</style>
