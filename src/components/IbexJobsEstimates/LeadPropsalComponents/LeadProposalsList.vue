<script setup lang="ts">
import type { VAvatarProps } from "/@src/components/base/avatar/VAvatar.vue";
import * as listData from "/@src/data/layouts/flex-list-v2";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { formatDate, formatTime } from "/@src/composable/useSupportElement";
import {
  getProposalStatusColor,
  getProposalStatusName,
  getProposalTypeColor,
  getProposalTypeName,
} from "../estimatesScripts";
const router = useRouter();
const route = useRoute();
const api = useApi();
const notyf = useNotyf();
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
const loading = ref(false);
const projects = listData.projects as ProjectData[];
interface Proposal {
  id: string;
  title: string;
  approval_deadline: string;
  internal_notes: string | null;
  introductory_text: string | null;
  closing_text: string | null;
  payment_status: string;
  type: string;
  created_at: string;
  updated_at: string;
  job: string;
}

const proposalsList = ref<Proposal[]>([]);

const openLeadProposalModal = ref(false);
const selectedProposalId = ref("");

const openLeadProposalModalHandler = (id: any) => {
  selectedProposalId.value = id;
  openLeadProposalModal.value = true;
};

const openProposalGroupModal = ref(false);
const openProposalGroupModalHandler = () => {
  openProposalGroupModal.value = true;
};

const props = withDefaults(
  defineProps<{
    activeTab?: "active" | "closed";
    leadId?: string;
    allProposal?: boolean;
  }>(),
  {
    activeTab: "active",
    leadId: "",
    allProposal: false,
  }
);

const filters = ref("");
const selectedDeleteProposalId = ref("");
const tab = ref(props.activeTab);
const SweetAlertProps = ref({
  title: "",
  subtitle: "test",
  isSweetAlertOpen: false,
  btntext: "text",
});

const TasksSweetAlertProps = ref({
  title: "",
  subtitle: "",
  isSweetAlertOpen: false,
  btntext: "",
});

const openProposalDeleteAlert = (id: any) => {
  selectedDeleteProposalId.value = id;
  SweetAlertProps.value = {
    title: "Delete Proposal?",
    subtitle:
      "Are you sure to delete this proposal? After delete you will not be able to recover it again.",
    btntext: "Yes delete",
    isSweetAlertOpen: true,
  };
};

const createTasksOfProposal = (id: any) => {
  selectedDeleteProposalId.value = id;
  TasksSweetAlertProps.value = {
    title: "Generate Tasks?",
    subtitle:
      "Tasks will be generated of all cost items are listed in this proposal.",
    btntext: "Yes Generate",
    isSweetAlertOpen: true,
  };
};

const DeleteProposalHandler = async () => {
  try {
    loading.value = true;
    const response = await api.delete(
      `/api/lead-proposal/${selectedDeleteProposalId.value}/`
    );
    proposalsList.value = response.data;
    notyf.success("Proposal delete successfully");
    getCompanyProposalList();
  } catch (error: any) {
    notyf.error(` ${error}, Proposal`);
    notyf.error("Something went wrong please try later");
  } finally {
    loading.value = false;
    SweetAlertProps.value.isSweetAlertOpen = false;
  }
};
const columns = {
  picture: {
    label: "Proposal",
    grow: true,
    media: true,
  },
  customer: "Created At",
  industry: "Type",
  deadline: "Deadline",
  status: "Status",
  amount: {
    label: "Total Amount",
    media: true,
  },
  actions: {
    label: "Actions",
    align: "end",
  },
} as const;

const getLeadProposals = async () => {
  try {
    loading.value = true;
    const response = await api.get(
      `/api/lead-proposal/by-project/${props.leadId}/`
    );
    proposalsList.value = response.data;
  } catch (error: any) {
    notyf.error(` ${error}, Lead`);
  } finally {
    loading.value = false;
  }
};

const getCompanyProposals = async () => {
  try {
    loading.value = true;
    const response = await api.get(`/api/lead-proposal/`);
    proposalsList.value = response.data;
  } catch (error: any) {
    notyf.error(` ${error}, Lead`);
  } finally {
    loading.value = false;
  }
};

const filteredData = computed(() => {
  if (!filters.value) {
    return proposalsList.value;
  } else {
    const filterRe = new RegExp(filters.value, "i");

    return proposalsList.value.filter((item) => {
      return (
        item.title.match(filterRe) || item.approval_deadline.match(filterRe)
      );
    });
  }
});

const previewModal = ref(false);
const selectedProposal = ref(false);
const openProposalPreview = (id: any) => {
  selectedProposal.value = id;
  previewModal.value = !previewModal.value;
};

const addCostItemModal = ref(false);
const proposalId = ref("");

const openCostItemModal = (id: any) => {
  proposalId.value = id;
  addCostItemModal.value = !addCostItemModal.value;
};

const gotoDetail = (id: any) => {
  router.push(`/sidebar/dashboard/proposals/${id}`);
};
const getCompanyProposalList = () => {
  if (props.allProposal == true) {
    getCompanyProposals();
  } else if (props.leadId) {
    getLeadProposals();
  }
};

onMounted(() => {
  getCompanyProposalList();
});
</script>

<template>
  <div>
    <div class="flex-toolbar is-reversed is-flex space-between my-4">
      <VControl icon="feather:search">
        <input
          v-model="filters"
          class="input custom-text-filter"
          placeholder="Search..."
        />
      </VControl>

      <div>
        <VButton
          color="primary"
          @click="openLeadProposalModal = !openLeadProposalModal"
          icon="fas fa-plus"
          >Lead Proposal</VButton
        >
        <VButton
          color="warning"
          class="ml-2"
          v-if="props.leadId"
          @click="openProposalGroupModalHandler()"
          icon="fas fa-cogs"
          >Proposals</VButton
        >
      </div>
    </div>
    <div v-if="loading">
      <PlaceloadV1 />
    </div>

    <div v-else class="flex-list-wrapper flex-list-v2">
      <VFlexTable
        v-if="filteredData.length > 0 && proposalsList.length > 0"
        :data="filteredData"
        :columns="columns"
        rounded
      >
        <template #body>
          <TransitionGroup name="list" tag="div" class="flex-list-inner">
            <!--Table item-->
            <div
              v-for="item in filteredData"
              :key="item.id"
              class="flex-table-item"
            >
              <VFlexTableCell
                :column="{ media: true, grow: true }"
                class="cu-pointer"
                @click="gotoDetail(item.id)"
              >
                <!-- <VAvatar :picture="item.picture" /> -->
                <div>
                  <span class="item-name dark-inverted">{{ item.title }}</span>
                  <!-- <span class="item-meta">
                    <span>
                      <i
                        aria-hidden="true"
                        class="iconify"
                        data-icon="feather:clock"
                      />{{ item.duration }}</span
                    >
                  </span> -->
                </div>
              </VFlexTableCell>
              <VFlexTableCell
                :column="{ media: true }"
                class="cu-pointer"
                @click="gotoDetail(item.id)"
              >
                <div>
                  <span class="item-name dark-inverted">{{
                    formatDate(item.created_at)
                  }}</span>
                  <span class="light-text">{{
                    formatTime(item.created_at)
                  }}</span>
                </div>
              </VFlexTableCell>
              <VFlexTableCell class="cu-pointer" @click="gotoDetail(item.id)">
                <VTag rounded :color="getProposalTypeColor[item.type]">
                  {{ getProposalTypeName[item.type] }}
                </VTag>
              </VFlexTableCell>
              <VFlexTableCell class="cu-pointer" @click="gotoDetail(item.id)">
                <span class="light-text">{{ item.approval_deadline }}</span>
              </VFlexTableCell>
              <VFlexTableCell class="cu-pointer" @click="gotoDetail(item.id)">
                <VTag
                  class="capitalized"
                  rounded
                  :color="getProposalStatusColor[item.status]"
                >
                  {{ getProposalStatusName[item.status] }}
                </VTag>
                <!-- <span class="light-text"></span> -->
              </VFlexTableCell>
              <VFlexTableCell
                class="cu-pointer"
                @click="gotoDetail(item.id)"
                :column="{ media: true }"
              >
                <div>
                  <span class="item-name dark-inverted"
                    >${{ item.proposalAmount }}</span
                  >
                  <span class="light-text">{{ item.payment_status }}</span>
                </div>
              </VFlexTableCell>
              <VFlexTableCell :column="{ align: 'end' }">
                <VDropdown
                  class="is-pushed-mobile"
                  icon="feather:more-vertical"
                  spaced
                  right
                >
                  <template #content>
                    <a
                      role="menuitem"
                      @click="gotoDetail(item.id)"
                      class="dropdown-item is-media"
                    >
                      <div class="icon">
                        <i aria-hidden="true" class="lnil lnil-briefcase" />
                      </div>
                      <div class="meta">
                        <span>View Detail</span>
                        <span>View detail in page</span>
                      </div>
                    </a>
                    <a
                      role="menuitem"
                      @click="openLeadProposalModalHandler(item.id)"
                      class="dropdown-item is-media"
                    >
                      <div class="icon">
                        <i aria-hidden="true" class="lnil lnil-pencil" />
                      </div>
                      <div class="meta">
                        <span>Edit</span>
                        <span>Edit Proposal Details</span>
                      </div>
                    </a>

                    <a
                      disabled
                      role="menuitem"
                      @click="openProposalPreview(item.id)"
                      class="dropdown-item is-media"
                    >
                      <div class="icon">
                        <i aria-hidden="true" class="lnil lnil-eye" />
                      </div>
                      <div class="meta">
                        <span>Preview</span>
                        <span>Preview proposal detail</span>
                      </div>
                    </a>

                    <a
                      disabled
                      role="menuitem"
                      @click="createTasksOfProposal(item.id)"
                      class="dropdown-item is-media"
                    >
                      <div class="icon">
                        <i
                          class="lnil lnil-calender-alt-1"
                          aria-hidden="true"
                        ></i>
                      </div>
                      <div class="meta">
                        <span>Create Tasks</span>
                        <span>Create tasks in chart </span>
                      </div>
                    </a>

                    <a
                      role="menuitem"
                      @click="openCostItemModal(item.id)"
                      class="dropdown-item is-media"
                    >
                      <div class="icon">
                        <i aria-hidden="true" class="lnil lnil-add-files" />
                      </div>
                      <div class="meta">
                        <span>Add Cost Item</span>
                        <span>Add a new cost item</span>
                      </div>
                    </a>

                    <hr class="dropdown-divider" />

                    <a
                      role="menuitem"
                      @click="openProposalDeleteAlert(item.id)"
                      class="dropdown-item is-media"
                    >
                      <div class="icon">
                        <i aria-hidden="true" class="lnil lnil-trash-can-alt" />
                      </div>
                      <div class="meta">
                        <span>Delete</span>
                        <span>Delete from list</span>
                      </div>
                    </a>
                  </template>
                </VDropdown>
              </VFlexTableCell>
              <!-- openLeadProposalModalHandler -->
            </div>
          </TransitionGroup>
        </template>
      </VFlexTable>
      <VPlaceholderPage
        v-if="proposalsList.length < 1 && filteredData.length == 0"
        title="There is no proposal created on this lead!"
        subtitle="Too bad. Looks like we couldn't created any proposal on this Lead, please create proposal and release to the client"
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

      <VFlexPagination
        v-if="filteredData.length > 5"
        :item-per-page="10"
        :total-items="873"
        :current-page="42"
        :max-links-displayed="7"
      />
    </div>
    <LeadProposalModal
      v-if="openLeadProposalModal"
      :leadId="props.leadId"
      :proposalId="selectedProposalId"
      :leadProposalModal="openLeadProposalModal"
      @update:modalHandler="openLeadProposalModal = false"
      @update:OnSuccess="getCompanyProposalList"
      @clearProposalId="selectedProposalId = ''"
    />
    <ProposalViewModal
      v-if="previewModal"
      :preview-modal="previewModal"
      :proposalId="selectedProposal"
      @update:modal-handler="previewModal = false"
    />
    <EstimateCostItemModal
      v-if="addCostItemModal"
      :costItemModal="addCostItemModal"
      :proposalId="proposalId"
      @update:modalHandler="addCostItemModal = false"
      @update:OnSuccess="getCompanyProposalList"
    >
    </EstimateCostItemModal>
    <SweetAlert
      v-if="SweetAlertProps.isSweetAlertOpen"
      :isSweetAlertOpen="SweetAlertProps.isSweetAlertOpen"
      :title="SweetAlertProps.title"
      :subtitle="SweetAlertProps.subtitle"
      :btntext="SweetAlertProps.btntext"
      :onConfirm="DeleteProposalHandler"
      :onCancel="() => (SweetAlertProps.isSweetAlertOpen = false)"
    />
    <SweetAlert
      v-if="TasksSweetAlertProps.isSweetAlertOpen"
      :isSweetAlertOpen="TasksSweetAlertProps.isSweetAlertOpen"
      :title="TasksSweetAlertProps.title"
      :subtitle="TasksSweetAlertProps.subtitle"
      :btntext="TasksSweetAlertProps.btntext"
      :onConfirm="DeleteProposalHandler"
      :onCancel="() => (TasksSweetAlertProps.isSweetAlertOpen = false)"
    />

    <ProposalGroupModal
      v-if="openProposalGroupModal"
      :leadProposalListModal="openProposalGroupModal"
      :leadID="props.leadId"
      :group-proposal-modal="openProposalGroupModal"
      @update:modal-handler="openProposalGroupModal = false"
    />
  </div>
</template>

<style lang="scss">
.has-top-nav {
  .flex-list-wrapper,
  .list-flex-toolbar {
    max-width: 880px;
    margin-inline-end: auto;
    margin-inline-start: auto;
  }
}
</style>
