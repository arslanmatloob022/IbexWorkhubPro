<script setup lang="ts">
import type { VAvatarProps } from "/@src/components/base/avatar/VAvatar.vue";
import * as listData from "/@src/data/layouts/flex-list-v1";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import {
  formatDate,
  formatDateTime,
  formatTime,
} from "/@src/composable/useSupportElement";
import { getStatusColor, getJobStatusColor } from "../estimatesScripts";
import moment from "moment";

const router = useRouter();
const notyf = useNotyf();
const api = useApi();
const loading = ref();
const tab = ref("all");
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

const leadsList = ref({
  id: "54985a54-db61-4761-becd-3b35f8ec503e",
  sales_people_info: [],
  clientInfo: null,
  created_by_info: null,
  manager_info: null,
  title: "test job",
  address: null,
  current_state: "lead",
  city: null,
  state: null,
  status: null,
  zip_code: null,
  confidence: "0.00",
  sale_date: null,
  tags: [],
  estimated_from: null,
  estimated_to: null,
  sources: null,
  project_type: null,
  notes: null,
  attach_mail: null,
  created_at: "2025-01-15T19:55:18.448485Z",
  updated_at: "2025-01-15T19:55:18.448510Z",
  created_by: null,
  manager: null,
  client: null,
  sales_people: [],
});

const page = ref(42);
const filters = ref("");
const statusFilter = ref("");
const openLeadProposalModal = ref(false);
const openLeadModal = ref(false);
const users = listData.users as UserData[];
const leadsStatusFilters = ref([
  { value: "Open", label: "Open" },
  { value: "Sold", label: "Sold" },
  { value: "Lost", label: "Lost" },
  { value: "onHold", label: "On hold" },
]);

const columns = {
  username: {
    label: "Job",
    grow: true,
  },
  location: {
    label: "Contractor/Client",
    grow: true,
  },
  contacts: "Date Created",
  status: "Status",
  industry: "Manager",
  actions: {
    label: "Actions",
    align: "end",
  },
} as const;

const inCompletedLeadsList = ref([]);
const getCompanyJobs = async () => {
  try {
    loading.value = true;
    const response = await api.get("/api/project/project-jobs/");
    leadsList.value = response.data.filter(
      (item: any) => item.status == "completed"
    );
    inCompletedLeadsList.value = response.data.filter(
      (item: any) => item.status != "completed"
    );
  } catch (error: any) {
    notyf.error(` ${error}, Lead`);
  } finally {
    loading.value = false;
  }
};

const selectedLeadId = ref("");
const openLeadUpdateModal = (id: any) => {
  selectedLeadId.value = id;
  openLeadModal.value = true;
};
const SweetAlertProps = ref({
  title: "",
  subtitle: "test",
  isSweetAlertOpen: false,
  btntext: "text",
});
const openLeadDeleteAlert = (id: any) => {
  selectedLeadId.value = id;
  SweetAlertProps.value = {
    title: "Delete Job?",
    subtitle:
      "Are you sure to delete this Job? After delete you will not be able to recover it again.",
    btntext: "Yes delete",
    isSweetAlertOpen: true,
  };
};

const deleteLeadHandler = async () => {
  try {
    loading.value = true;
    const response = await api.delete(`/api/project/${selectedLeadId.value}/`);

    notyf.success("Proposal delete successfully");
    getCompanyJobs();
  } catch (error: any) {
    notyf.error(` ${error}, Proposal`);
    notyf.error("Something went wrong please try later");
  } finally {
    loading.value = false;
    SweetAlertProps.value.isSweetAlertOpen = false;
  }
};

const openAddProposalModalHandler = (id: any) => {
  selectedLeadId.value = id;
  openLeadProposalModal.value = !openLeadProposalModal.value;
};

const filteredData = computed(() => {
  if (!filters.value) {
    return inCompletedLeadsList.value;
  } else {
    const filterRe = new RegExp(filters.value, "i");
    return inCompletedLeadsList.value.filter((item: any) => {
      return (
        item.title?.match(filterRe) ||
        item.address?.match(filterRe) ||
        item.clientInfo?.username?.match(filterRe) ||
        item.clientInfo?.last_name?.match(filterRe) ||
        item.clientInfo?.username?.match(filterRe) ||
        item.city?.match(filterRe) ||
        item.created_at?.match(filterRe)
      );
    });
  }
});

const selectedSortOption = ref("");

const sortJobs = (type: string = "") => {
  selectedSortOption.value = type;
};

const secondFiltered = computed(() => {
  let data = filteredData.value || [];
  if (!selectedSortOption.value) {
    return filteredData.value;
  } else {
    return [...data].sort((a: any, b: any) => {
      if (selectedSortOption.value === "ascending") {
        return (
          a?.clientInfo?.username.localeCompare(b?.clientInfo?.username) ||
          a?.contractor_info?.username.localeCompare(
            b?.contractor_info?.username
          )
        );
      } else if (selectedSortOption.value === "descending") {
        return (
          b?.clientInfo?.username.localeCompare(a?.clientInfo?.username) ||
          b?.contractor_info?.username.localeCompare(
            a?.contractor_info?.username
          )
        );
      } else if (selectedSortOption.value === "new") {
        return moment(b.created).valueOf() - moment(a.created).valueOf(); // Most recent on top
      } else if (selectedSortOption.value === "old") {
        return moment(a.created).valueOf() - moment(b.created).valueOf(); // Oldest on top
      }
      return 0;
    });
  }
});

const completedLeads = computed(() => {
  if (!filters.value) {
    return leadsList.value;
  } else {
    const filterRe = new RegExp(filters.value, "i");
    return leadsList.value.filter((item: any) => {
      return (
        item.title?.match(filterRe) ||
        item.address?.match(filterRe) ||
        item.clientInfo?.username?.match(filterRe) ||
        item.clientInfo?.last_name?.match(filterRe) ||
        item.clientInfo?.username?.match(filterRe) ||
        item.city?.match(filterRe) ||
        item.created_at?.match(filterRe)
      );
    });
  }
});
onMounted(() => {
  getCompanyJobs();
});
</script>

<template>
  <div>
    <PlaceloadV1 v-if="loading" />
    <div v-else>
      <div class="list-flex-toolbar columns is-multiline">
        <div class="column is-6 is-flex">
          <VField>
            <VControl icon="feather:search">
              <input
                v-model="filters"
                class="input custom-text-filter"
                placeholder="Search..."
              />
            </VControl>
          </VField>
          <!-- </div> -->
          <!-- <div class="column is-2"> -->
          <VDropdown title="Apply sorting" modern spaced>
            <template #content>
              <a @click="sortJobs('ascending')" class="dropdown-item is-media">
                <div class="icon">
                  <i class="fas fa-sort-alpha-down" aria-hidden="true"></i>
                </div>
                <div class="meta">
                  <span>Ascending</span>
                  <span>Alphabetical Ascending Sorting</span>
                </div>
              </a>
              <a
                @click="sortJobs('descending')"
                class="dropdown-item is-media is-active"
              >
                <div class="icon">
                  <i class="fas fa-sort-alpha-down-alt" aria-hidden="true"></i>
                </div>
                <div class="meta">
                  <span>Descending</span>
                  <span>Alphabetical Descending Sorting</span>
                </div>
              </a>
              <a @click="sortJobs('new')" class="dropdown-item is-media">
                <div class="icon">
                  <i class="fas fa-sort-numeric-down" aria-hidden="true"></i>
                </div>
                <div class="meta">
                  <span>Most Recent</span>
                  <span>Sort most recently created</span>
                </div>
              </a>
              <a @click="sortJobs('old')" class="dropdown-item is-media">
                <div class="icon">
                  <i
                    class="fas fa-sort-numeric-down-alt"
                    aria-hidden="true"
                  ></i>
                </div>
                <div class="meta">
                  <span>Most Old</span>
                  <span>Sort the most oldest</span>
                </div>
              </a>
            </template>
          </VDropdown>
        </div>

        <div class="column is-6">
          <VButtons>
            <VButton
              @click="openLeadUpdateModal('')"
              color="primary"
              icon="fas fa-plus"
              elevated
            >
              Lead Opportunity
            </VButton>
          </VButtons>
        </div>
      </div>

      <div class="page-content-inner">
        <div class="flex-list-wrapper flex-list-v1">
          <div class="columns is-multiline">
            <div class="column is-3"></div>
            <div class="column is-6 justify-right"></div>
          </div>
          <VPlaceholderPage
            v-if="!secondFiltered?.length"
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
          <div v-if="tab === 'all'">
            <VFlexTable
              v-if="secondFiltered?.length"
              :data="secondFiltered"
              :columns="columns"
              compact
            >
              <template #body>
                <TransitionGroup name="list" tag="div" class="flex-list-inner">
                  <div
                    v-for="item in secondFiltered"
                    :key="item.id"
                    class="flex-table-item"
                  >
                    <VFlexTableCell
                      @click="
                        () => {
                          router.push(`/sidebar/dashboard/jobs/${item.id}`);
                        }
                      "
                      class="cu-pointer"
                      :column="{ media: true, grow: true }"
                    >
                      <VAvatar
                        :picture="
                          item.image ? item.image : '/IbexImages/home-icon.png'
                        "
                        squared
                        size="medium"
                      />
                      <div>
                        <span class="item-name dark-inverted show-text-200">{{
                          item.title ? item.title : "N/A"
                        }}</span>
                        <span class="item-meta show-text-200">
                          <span>{{ item.address ? item.address : "N/A" }}</span>
                        </span>
                      </div>
                    </VFlexTableCell>
                    <VFlexTableCell
                      @click="
                        () => {
                          router.push(`/sidebar/dashboard/jobs/${item.id}`);
                        }
                      "
                      class="cu-pointer"
                      :column="{ media: true, grow: true }"
                    >
                      <div v-if="item.clientInfo" class="show-text-200">
                        <span class="item-name">{{
                          item.clientInfo?.username
                            ? item.clientInfo?.username
                            : "N/A"
                        }}</span>
                        <span class="item-meta">
                          <span>{{
                            item.clientInfo?.email
                              ? item.clientInfo?.email
                              : "N/A"
                          }}</span>
                        </span>
                      </div>
                      <div v-if="item.contractor_info" class="show-text-200">
                        <span class="item-name dark-inverted">{{
                          item.contractor_info?.username
                            ? item.contractor_info?.username
                            : "N/A"
                        }}</span>
                        <span class="item-meta">
                          <span>{{
                            item.contractor_info?.email
                              ? item.contractor_info?.email
                              : "N/A"
                          }}</span>
                        </span>
                      </div>
                    </VFlexTableCell>

                    <VFlexTableCell
                      @click="
                        () => {
                          router.push(`/sidebar/dashboard/jobs/${item.id}`);
                        }
                      "
                      class="cu-pointer"
                      :column="{ media: true }"
                    >
                      <div>
                        <span class="item-name dark-inverted">{{
                          formatDate(item.created)
                        }}</span>
                        <span class="item-meta">
                          <span>At:{{ formatTime(item.created) }}</span>
                        </span>
                      </div>
                    </VFlexTableCell>

                    <VFlexTableCell
                      @click="
                        () => {
                          router.push(`/sidebar/dashboard/jobs/${item.id}`);
                        }
                      "
                      class="cu-pointer"
                    >
                      <VTag
                        class="capitalized"
                        :color="getJobStatusColor[item.status]"
                        rounded
                      >
                        {{ item.status ? item.status : "N/A" }}
                      </VTag>
                    </VFlexTableCell>

                    <VFlexTableCell
                      @click="
                        () => {
                          router.push(`/sidebar/dashboard/jobs/${item.id}`);
                        }
                      "
                      class="cu-pointer"
                      :column="{ media: true }"
                    >
                      <div>
                        <VAvatar
                          v-for="manager in item.managers_list"
                          :initials="manager.username.slice(0, 2)"
                          :picture="manager.avatar"
                          v-tooltip.center.primary.rounded="
                            `${manager.username} ${manager.last_name ?? ''}`
                          "
                          color="primary"
                          size="small"
                        />
                      </div>
                    </VFlexTableCell>

                    <VFlexTableCell :column="{ align: 'end' }">
                      <VDropdown
                        icon="feather:more-vertical"
                        class="is-pushed-mobile"
                        spaced
                        right
                      >
                        <template #content="{ close }">
                          <a
                            role="menuitem"
                            class="dropdown-item is-media"
                            @click="
                              () => {
                                router.push(
                                  `/sidebar/dashboard/jobs/${item.id}`
                                );
                              }
                            "
                          >
                            <div class="icon">
                              <i aria-hidden="true" class="lnil lnil-eye" />
                            </div>
                            <div class="meta">
                              <span>View</span>
                              <span>View user details</span>
                            </div>
                          </a>

                          <a
                            role="menuitem"
                            @click="openAddProposalModalHandler(item.id)"
                            class="dropdown-item is-media"
                          >
                            <div class="icon">
                              <i class="lnil lnil-copy" aria-hidden="true"></i>
                            </div>
                            <div class="meta">
                              <span>Add Proposals</span>
                              <span>Add new proposal to lead</span>
                            </div>
                          </a>

                          <a
                            role="menuitem"
                            class="dropdown-item is-media"
                            @click.prevent="openLeadUpdateModal(item.id)"
                          >
                            <div class="icon">
                              <i aria-hidden="true" class="lnil lnil-pencil" />
                            </div>
                            <div class="meta">
                              <span>Edit</span>
                              <span>Update Lead Info</span>
                            </div>
                          </a>

                          <hr class="dropdown-divider" />

                          <a
                            role="menuitem"
                            class="dropdown-item is-media"
                            @click.prevent="openLeadDeleteAlert(item.id)"
                          >
                            <div class="icon">
                              <i
                                aria-hidden="true"
                                class="lnil lnil-trash-can-alt"
                              />
                            </div>
                            <div class="meta">
                              <span>Delete</span>
                              <span>Delete Proposal Permanently</span>
                            </div>
                          </a>
                        </template>
                      </VDropdown>
                    </VFlexTableCell>
                  </div>
                </TransitionGroup>
              </template>
            </VFlexTable>
            <VFlexPagination
              v-if="secondFiltered?.length > 5"
              v-model:current-page="page"
              :item-per-page="10"
              :total-items="80"
              :max-links-displayed="7"
              no-router
            />
          </div>
        </div>
      </div>
    </div>
    <LeadAddUpdateModal
      v-if="openLeadModal"
      :addUpdateLeadModal="openLeadModal"
      :leadId="selectedLeadId"
      @update:modalHandler="openLeadModal = false"
      @update:OnSuccess="getCompanyJobs"
    />
    <SweetAlert
      v-if="SweetAlertProps.isSweetAlertOpen"
      :isSweetAlertOpen="SweetAlertProps.isSweetAlertOpen"
      :title="SweetAlertProps.title"
      :subtitle="SweetAlertProps.subtitle"
      :loading="loading"
      :btntext="SweetAlertProps.btntext"
      :onConfirm="deleteLeadHandler"
      :onCancel="() => (SweetAlertProps.isSweetAlertOpen = false)"
    />
    <LeadProposalModal
      v-if="openLeadProposalModal"
      :lead-proposal-modal="openLeadProposalModal"
      :lead-id="selectedLeadId"
      @update:modal-handler="openLeadProposalModal = false"
      @update:OnSuccess="getCompanyJobs"
    />
  </div>
</template>

<style lang="scss">
.flex-table .flex-table-item {
  min-height: 48px !important;
}
.has-top-nav {
  .flex-list-wrapper,
  .list-flex-toolbar {
    max-width: 100%;
    margin-inline-end: auto;
    margin-inline-start: auto;
  }
}
</style>
