<script setup lang="ts">
import { useApi } from "/@src/composable/useAPI";
import type { VAvatarProps } from "/@src/components/base/avatar/VAvatar.vue";
import * as listData from "/@src/data/layouts/flex-list-v2";
import { formatDate } from "/@src/composable/useSupportElement";

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

const group_by = ref("combine");
const loading = ref(false);
const tab = ref("active");
const api = useApi();
const tagsValue = ref([]);
const tagsOptions = ref([{ value: "", label: "" }]);
const openMergeProposalsModal = ref(false);
const selectedProposals = ref<any[]>([]);
const proposalIds = selectedProposals.value.map((proposal) => proposal.id);
const props = withDefaults(
  defineProps<{
    leadProposalListModal?: boolean;
    leadID: string;
  }>(),
  {
    columnsToShow: false,
    leadID: "",
  }
);
const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: null): void;
}>();
export interface ProjectData {
  id: number;
  name: string;
  customer: string;
  duration: string;
  picture: string;
  industry: string;
  status: string;
  team: VAvatarProps[];
}

const filters = ref("");

const columns = {
  picture: {
    label: "Proposal",
    grow: true,
    media: true,
  },
  customer: "Type",
  industry: "Amount",
  status: "Status",
  team: {
    label: "Payment",
  },
  actions: {
    label: "Select",
    align: "end",
  },
} as const;

const openSendProposalModal = ref(false);
const openSendProposalModalHandler = () => {
  openSendProposalModal.value = !openSendProposalModal.value;
};

const selectProposal = (item: any) => {
  const index = selectedProposals.value.findIndex(
    (proposal) => proposal.id === item.id
  );

  if (index !== -1) {
    selectedProposals.value.splice(index, 1);
  } else {
    selectedProposals.value.push(item);
  }
};

const filteredData = computed(() => {
  if (!filters.value) {
    return proposalList.value;
  } else {
    const filterRe = new RegExp(filters.value, "i");
    return proposalList.value.filter((item) => {
      return item.title.match(filterRe) || item.description.match(filterRe);
    });
  }
});

const closeModalHandler = () => {
  emit("update:modalHandler", false);
};

const getLeadProposals = async () => {
  try {
    loading.value = true;
    const resp = await api.get(
      `/api/lead-proposal/by-project/${props.leadID}/`
    );
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
    tagsOptions.value = response.data.map((item: any) => {
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
  getLeadProposals();
  getCostTradesHandler();
});
</script>

<template>
  <VModal
    is="form"
    :open="props.leadProposalListModal"
    title="Proposal List"
    size="xl"
    actions="right"
    @close="closeModalHandler"
  >
    <template #content>
      <div class="columns is-multiline">
        <div class="column is-12 is-flex space-between">
          <div></div>
          <div class="is-flex">
            <VField
              v-if="group_by == 'trade'"
              v-slot="{ id }"
              style="width: 340px"
            >
              <VControl>
                <Multiselect
                  v-model="tagsValue"
                  :attrs="{ id }"
                  mode="tags"
                  :searchable="true"
                  :create-tag="true"
                  :options="tagsOptions"
                  placeholder="Select Trades"
                />
              </VControl>
            </VField>
            <VButton
              class="ml-2"
              @click="openMergeProposalsModal = !openMergeProposalsModal"
              raised
              color="warning"
              light
              outlined
              icon="lnil lnil-files-alt"
              :disabled="selectedProposals.length ? false : true"
            >
              Group Proposal
            </VButton>
            <VButton
              class="ml-2"
              raised
              icon="fas fa-envelope"
              color="info"
              light
              :disabled="selectedProposals.length ? false : true"
              outlined
              @click="openSendProposalModalHandler()"
            >
              Send
            </VButton>
          </div>
        </div>
        <div class="column is-12">
          <div class="flex-list-wrapper flex-list-v2">
            <!--List Empty Search Placeholder -->
            <VPlaceholderPage
              v-if="tab === 'active' && filteredData.length === 0"
              title="We couldn't find any matching results."
              subtitle="Too bad. Looks like we couldn't find any matching results for the
          search terms you've entered. Please try different search terms or
          criteria."
              larger
            >
              <template #image>
                <img
                  class="light-image"
                  src="/@src/assets/illustrations/placeholders/search-4.svg"
                  alt=""
                />
                <img
                  class="dark-image"
                  src="/@src/assets/illustrations/placeholders/search-4-dark.svg"
                  alt=""
                />
              </template>
            </VPlaceholderPage>

            <!--Active Tab-->
            <div v-if="tab === 'active'" class="tab-content is-active">
              <VFlexTable
                v-if="filteredData.length"
                :data="filteredData"
                :columns="columns"
                rounded
              >
                <template #body>
                  <TransitionGroup
                    name="list"
                    tag="div"
                    class="flex-list-inner"
                  >
                    <!--Table item-->
                    <div
                      v-for="item in filteredData"
                      :key="item.id"
                      class="flex-table-item"
                    >
                      <VFlexTableCell :column="{ media: true, grow: true }">
                        <div>
                          <span class="item-name dark-inverted">{{
                            item.title ?? "N/A"
                          }}</span>
                          <span class="item-meta">
                            <span> {{ formatDate(item.created_at) }}</span>
                          </span>
                        </div>
                      </VFlexTableCell>
                      <VFlexTableCell>
                        <VTag>
                          {{ item.type }}
                        </VTag>
                      </VFlexTableCell>
                      <VFlexTableCell>
                        <span class="light-text"
                          >${{ item.proposalAmount }}</span
                        >
                      </VFlexTableCell>
                      <VFlexTableCell>
                        <VTag rounded>
                          {{ item.status }}
                        </VTag>
                      </VFlexTableCell>
                      <VFlexTableCell>
                        <VTag rounded>
                          {{ item.status }}
                        </VTag>
                      </VFlexTableCell>
                      <VFlexTableCell :column="{ align: 'end' }">
                        <VControl raw subcontrol>
                          <VCheckbox
                            @click="
                              () => {
                                selectProposal(item);
                              }
                            "
                            v-model="item.payment_status"
                            label=""
                            color="primary"
                          />
                        </VControl>
                      </VFlexTableCell>
                    </div>
                  </TransitionGroup>
                </template>
              </VFlexTable>

              <!--Table Pagination-->
              <VFlexPagination
                v-if="filteredData.length > 5"
                :item-per-page="10"
                :total-items="873"
                :current-page="42"
                :max-links-displayed="7"
              />
            </div>

            <!--inactive Tab-->
            <div v-else-if="tab === 'closed'" class="tab-content is-active">
              <!--Empty placeholder-->
              <VPlaceholderPage
                title="No closed projects."
                subtitle="Looks like you don't have any closed project yet. When you'll
              start closing off projects, they will be showing up in here."
              >
                <template #image>
                  <img
                    class="light-image is-larger"
                    src="/@src/assets/illustrations/placeholders/projects.svg"
                    alt=""
                  />
                  <img
                    class="dark-image is-larger"
                    src="/@src/assets/illustrations/placeholders/projects-dark.svg"
                    alt=""
                  />
                </template>
              </VPlaceholderPage>
            </div>
          </div>
        </div>
        <MergeProposalModal
          v-if="openMergeProposalsModal"
          :group-proposal-modal="openMergeProposalsModal"
          :selectedProposals="selectedProposals"
          @removeProposal="selectProposal"
          @update:modal-handler="openMergeProposalsModal = false"
        />
        <SendProposalEmailModal
          v-if="openSendProposalModal"
          :proposalSenderModal="openSendProposalModal"
          :selectedProposalsIds="proposalIds"
          @update:modalHandler="openSendProposalModal = false"
        />
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
