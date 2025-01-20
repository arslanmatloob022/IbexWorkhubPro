<script setup lang="ts">
import type { VAvatarProps } from "/@src/components/base/avatar/VAvatar.vue";
import * as listData from "/@src/data/layouts/flex-list-v2";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { formatDate, formatTime } from "/@src/composable/useSupportElement";

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

  actions: {
    label: "Actions",
    align: "end",
  },
} as const;

const getLeadProposals = async () => {
  try {
    loading.value = true;
    const response = await api.get(
      `/api/lead-proposal/by-job/${props.leadId}/`
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
    <!-- <DraggableItem /> -->
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
      </div>
    </div>

    <div class="flex-list-wrapper flex-list-v2">
      <!--List Empty Search Placeholder -->

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
              <VFlexTableCell :column="{ media: true, grow: true }">
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
              <VFlexTableCell :column="{ media: true }">
                <div>
                  <span class="item-name dark-inverted">{{
                    formatDate(item.created_at)
                  }}</span>
                  <span class="light-text">{{
                    formatTime(item.created_at)
                  }}</span>
                </div>
              </VFlexTableCell>
              <VFlexTableCell>
                <VTag rounded>
                  {{ item.type }}
                </VTag>
              </VFlexTableCell>
              <VFlexTableCell>
                <span class="light-text">{{ item.approval_deadline }}</span>
              </VFlexTableCell>
              <VFlexTableCell>
                <VTag rounded color="info">
                  {{ item.payment_status }}
                </VTag>
                <!-- <span class="light-text">{{ item.payment_status }}</span> -->
              </VFlexTableCell>
              <!-- <VFlexTableCell class="h-hidden-tablet-p">
                <VAvatarStack
                  :avatars="item.team"
                  size="small"
                  :limit="3"
                  class="is-pushed-mobile"
                />
              </VFlexTableCell> -->
              <VFlexTableCell :column="{ align: 'end' }">
                <VDropdown
                  class="is-pushed-mobile"
                  icon="feather:more-vertical"
                  spaced
                  right
                >
                  <template #content>
                    <a role="menuitem" class="dropdown-item is-media">
                      <div class="icon">
                        <i aria-hidden="true" class="lnil lnil-briefcase" />
                      </div>
                      <div class="meta">
                        <span>View Proposal</span>
                        <span>View proposal detail</span>
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
                        <span>Edit project details</span>
                      </div>
                    </a>
                    <a
                      role="menuitem"
                      @click="
                        router.push(`/sidebar/dashboard/proposals/${item.id}`)
                      "
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

                    <a role="menuitem" href="#" class="dropdown-item is-media">
                      <div class="icon">
                        <i aria-hidden="true" class="lnil lnil-add-files" />
                      </div>
                      <div class="meta">
                        <span>New Task</span>
                        <span>Add a new task</span>
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

      <!--Table Pagination-->
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
    <SweetAlert
      v-if="SweetAlertProps.isSweetAlertOpen"
      :isSweetAlertOpen="SweetAlertProps.isSweetAlertOpen"
      :title="SweetAlertProps.title"
      :subtitle="SweetAlertProps.subtitle"
      :btntext="SweetAlertProps.btntext"
      :onConfirm="DeleteProposalHandler"
      :onCancel="() => (SweetAlertProps.isSweetAlertOpen = false)"
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
