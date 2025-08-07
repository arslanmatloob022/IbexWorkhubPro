<script setup lang="ts">
import type { VAvatarProps } from "/@src/components/base/avatar/VAvatar.vue";
import * as listData from "/@src/data/layouts/flex-list-v2";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import {
  formatAmount,
  formatDateTime,
} from "/@src/composable/useSupportElement";
import {
  getProposalStatusColor,
  getProposalStatusName,
  getProposalTypeColor,
  getProposalTypeName,
} from "../estimatesScripts";

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

const router = useRouter();
const route = useRoute();
const api = useApi();
const notyf = useNotyf();
const proposalsList = ref<Proposal[]>([]);
const selectedProposalId = ref("");
const loading = ref(false);
const openLeadProposalModal = ref(false);
const openCreateTasksModal = ref(false);
const openProposalGroupModal = ref(false);
const previewModal = ref(false);
const selectedProposal = ref(false);
const addCostItemModal = ref(false);
const proposalId = ref("");
const filters = ref("");
const selectedDeleteProposalId = ref("");
const tab = ref(props.activeTab);

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

const columns = {
  picture: {
    label: "Proposal",
    grow: true,
    media: true,
  },
  industry: "Type",
  status: "Status",
  amount: {
    label: "Total Amount",
    media: true,
  },
  customer: "Calendar Tasks ",
  actions: {
    label: "Actions",
    align: "end",
  },
} as const;

const emits = defineEmits<{
  (e: "updateCompany", value: null): void;
}>();

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

const openLeadProposalModalHandler = (id: any) => {
  selectedProposalId.value = id;
  openLeadProposalModal.value = true;
};

const openCreateTasksModalHandler = (id: any) => {
  selectedProposalId.value = id;
  openCreateTasksModal.value = true;
};

const openProposalGroupModalHandler = () => {
  openProposalGroupModal.value = true;
};

const DeleteProposalHandler = async () => {
  try {
    loading.value = true;
    const response = await api.delete(
      `/api/lead-proposal/${selectedDeleteProposalId.value}/`
    );
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

const openProposalPreview = (id: any) => {
  selectedProposal.value = id;
  previewModal.value = !previewModal.value;
};

const updateProposalStatus = async (status: any, id: any) => {
  try {
    const resp = await api.patch(`/api/lead-proposal/${id}/`, {
      status: status,
    });
    notyf.success(`You have ${status} this proposal.`);
    if (status == "approved") {
      emits("updateCompany", null);
    }
    getCompanyProposalList();
  } catch (err) {
    console.log(err);
  } finally {
  }
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

const duplicateProposal = async (id: any) => {
  try {
    const resp = await api.post(`/api/lead-proposal/${id}/duplicate/`, {
      project: props.leadId,
    });
    notyf.purple("Proposal duplicated successfully");
    getLeadProposals();
  } catch (err) {
    console.log(err);
  }
};

const statusFilter = ref("");
const sortProposalsOptions = ref([
  {
    desc: "Proposals default list. ",
    icon: "fas fa-align-left",
    value: "default",
    label: "Default",
  },
  {
    desc: "Newly created proposals ",
    icon: "fas fa-calendar-day",
    value: "recent",
    label: "New Proposals",
  },
  {
    desc: "Proposals created recently ",
    icon: "fas fa-calendar-minus ",
    value: "old",
    label: "Old Proposals",
  },
  {
    desc: "Proposals ascending order ",
    icon: "fas fa-sort-alpha-down",
    value: "asc",
    label: "Ascending",
  },
  {
    desc: "Proposals descending order ",
    icon: "fas fa-sort-alpha-up ",
    value: "desc",
    label: "Descending",
  },
]);

const filteredData = computed(() => {
  let data = proposalsList.value;

  // Filter by search
  if (filters.value) {
    const filterRe = new RegExp(filters.value, "i");
    data = data.filter((item) => item.title.match(filterRe));
  }

  // Sort based on statusFilter
  switch (statusFilter.value) {
    case "recent":
      data = [...data].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      break;
    case "old":
      data = [...data].sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      break;
    case "asc":
      data = [...data].sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "desc":
      data = [...data].sort((a, b) => b.title.localeCompare(a.title));
      break;
    default:
      break;
  }

  // Always move 'draft' proposals to the bottom
  data = [...data].sort((a, b) => {
    if (a.type === "draft" && b.type !== "draft") return 1;
    if (a.type !== "draft" && b.type === "draft") return -1;
    return 0;
  });

  return data;
});

onMounted(() => {
  getCompanyProposalList();
});
</script>

<template>
  <div>
    <div v-if="loading">
      <PlaceloadV1 />
    </div>
    <div v-else>
      <div class="flex-toolbar is-reversed is-flex space-between my-4">
        <div class="is-flex g-2">
          <VControl icon="feather:search">
            <input
              v-model="filters"
              class="input custom-text-filter"
              placeholder="Search..."
            />
          </VControl>
          <VField class="ml-2">
            <VDropdown title="Sort proposal" spaced>
              <template #content>
                <a
                  v-for="link in sortProposalsOptions"
                  :value="link.value"
                  @click="statusFilter = link.value"
                  class="dropdown-item is-media"
                  :class="statusFilter === link.value && 'is-active'"
                >
                  <div class="icon">
                    <i :class="link.icon" />
                  </div>
                  <div class="meta">
                    <span>{{ link.label }}</span>
                    <span>{{ link.desc }}</span>
                  </div>
                </a>
              </template>
            </VDropdown>
          </VField>
        </div>

        <div class="is-flex">
          <VButton
            class="h-hidden-mobile"
            color="primary"
            @click="openLeadProposalModal = !openLeadProposalModal"
            icon="fas fa-plus"
            >Lead Proposal
          </VButton>
          <VButton
            class="h-hidden-desktop"
            color="primary"
            @click="openLeadProposalModal = !openLeadProposalModal"
          >
            <i class="fas fa-plus"></i>
          </VButton>

          <VButton
            color="warning"
            class="ml-2"
            v-if="props.leadId"
            @click="openProposalGroupModalHandler()"
          >
            <i class="fas fa-cogs"></i>
            <span class="h-hidden-mobile"> Proposals </span>
          </VButton>
        </div>
      </div>

      <div class="flex-list-wrapper flex-list-v2">
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
                  <VAvatar
                    picture="/images/dummyShareProf/document.png
                    "
                    squared
                    size="medium"
                  />
                  <div v-tooltip.rounded.light="`${item.title}`">
                    <span class="item-name dark-inverted show-text-250">{{
                      item.title
                    }}</span>
                    <span class="item-meta">
                      <span>
                        <i
                          aria-hidden="true"
                          class="iconify"
                          data-icon="feather:clock"
                        />{{ formatDateTime(item.created_at) }}</span
                      >
                    </span>
                  </div>
                </VFlexTableCell>

                <VFlexTableCell class="cu-pointer" @click="gotoDetail(item.id)">
                  <VTag rounded :color="getProposalTypeColor[item.type]">
                    {{ getProposalTypeName[item.type] }}
                  </VTag>
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
                    <span class="item-name dark-inverted">{{
                      formatAmount(item?.proposalAmount)
                    }}</span>
                    <!-- <span class="light-text">{{ item.payment_status }}</span> -->
                  </div>
                </VFlexTableCell>
                <VFlexTableCell class="cu-pointer" @click="gotoDetail(item.id)">
                  <VTag color="purple" outlined>{{
                    item.is_task_created ? "Created" : "Not Created"
                  }}</VTag>
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
                        v-if="item.status == 'approved'"
                        role="menuitem"
                        @click="openCreateTasksModalHandler(item.id)"
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
                        @click="duplicateProposal(item.id)"
                        class="dropdown-item is-media"
                      >
                        <div class="icon">
                          <i class="lnir lnir-copy" aria-hidden="true"></i>
                        </div>
                        <div class="meta">
                          <span>Duplicate </span>
                          <span>Duplicate the proposal</span>
                        </div>
                      </a>

                      <hr class="dropdown-divider" />

                      <a
                        v-if="item.status != 'approved'"
                        role="menuitem"
                        @click="updateProposalStatus('approved', item.id)"
                        class="dropdown-item is-media"
                      >
                        <div class="icon">
                          <i
                            class="lnir lnir-round-box-check"
                            aria-hidden="true"
                          ></i>
                        </div>
                        <div class="meta">
                          <span>Mark Approved</span>
                          <span>Mark Proposal As Approved</span>
                        </div>
                      </a>

                      <a
                        role="menuitem"
                        @click="openProposalDeleteAlert(item.id)"
                        class="dropdown-item is-media"
                      >
                        <div class="icon">
                          <i
                            aria-hidden="true"
                            class="lnil lnil-trash-can-alt"
                          />
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

        <!-- <VFlexPagination
          v-if="filteredData.length > 5"
          :item-per-page="10"
          :total-items="873"
          :current-page="42"
          :max-links-displayed="7"
        /> -->
      </div>
      <CreateProposalTasksModal
        v-if="openCreateTasksModal"
        :createProposalTasksModal="openCreateTasksModal"
        :proposalId="selectedProposalId"
        @closeModalHandler="openCreateTasksModal = false"
        @update:OnSuccess="getCompanyProposalList()"
      />
      <LeadProposalModal
        v-if="openLeadProposalModal"
        :leadId="props.leadId"
        :proposalId="selectedProposalId"
        :leadProposalModal="openLeadProposalModal"
        :getLeadsList="props.allProposal"
        @update:modalHandler="
          () => {
            getCompanyProposalList();
            openLeadProposalModal = false;
          }
        "
        @clearProposalId="selectedProposalId = ''"
      />
      <!-- @update:OnSuccess="getCompanyProposalList()" -->
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
