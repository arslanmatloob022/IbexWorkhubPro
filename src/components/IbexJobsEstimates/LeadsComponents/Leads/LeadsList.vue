<script setup lang="ts">
import type { VAvatarProps } from "/@src/components/base/avatar/VAvatar.vue";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import {
  formatDate,
  formatDateTime,
  formatTime,
} from "/@src/composable/useSupportElement";
import { getLeadStatusName, getStatusColor } from "../../estimatesScripts";
const selectedLeadId = ref("");
const router = useRouter();
const notyf = useNotyf();
const api = useApi();
const loading = ref();
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

const leadsList = ref([
  {
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
    image: "",
    sale_date: null,
    tags: [],
    estimated_from: null,
    estimated_to: null,
    sources: null,
    project_type: null,
    notes: null,
    attach_mail: null,
    created: "2025-01-15T19:55:18.448485Z",
    updated_at: "2025-01-15T19:55:18.448510Z",
    created_by: null,
    manager: null,
    client: null,
    sales_people: [],
  },
]);

const page = ref(1);
const itemsPerPage = ref(20);
const filters = ref("");
const route = useRoute();
const statusFilter = ref("");
const openLeadProposalModal = ref(false);
const openLeadModal = ref(false);

const leadsStatusFilters = ref([
  { value: "open", label: "Open" },
  { value: "sold", label: "Sold" },
  { value: "lost", label: "Lost" },
  { value: "onHold", label: "On hold" },
]);

const columns = {
  location: {
    label: "Job",
    grow: true,
  },
  username: {
    label: "Contractor/Client",
    grow: true,
  },
  contacts: "Date Created",
  status: "Lead Status",
  industry: "Manager",
  actions: {
    label: "Actions",
    align: "end",
  },
} as const;

const getCompanyLeads = async () => {
  try {
    loading.value = true;
    const response = await api.get("/api/project/project-leads/");
    leadsList.value = response.data;
  } catch (error: any) {
    notyf.error(` ${error}, Lead`);
  } finally {
    loading.value = false;
  }
};

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
    title: "Delete Lead?",
    subtitle:
      "Are you sure to delete this Lead? After delete you will not be able to recover it again.",
    btntext: "Delete",
    isSweetAlertOpen: true,
  };
};
const statusLoading = ref(false);
const updateLeadStatus = async (id: any = "") => {
  try {
    statusLoading.value = true;
    const response = await api.patch(`/api/project/${id}/`, {
      status: "completed",
    });
    notyf.success("Jobs Completed Successfully.");
    getCompanyLeads();
  } catch (Error) {
    console.log(Error);
  } finally {
    statusLoading.value = false;
  }
};

const deleteLeadHandler = async () => {
  try {
    loading.value = true;
    const response = await api.delete(`/api/project/${selectedLeadId.value}/`);
    notyf.info("Lead deleted successfully");
    getCompanyLeads();
  } catch (error: any) {
    notyf.error(` ${error}, Lead`);
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

const currentPage = computed(() => {
  let index: any = route.query.page as string;
  if (index == undefined || index == "undefined") {
    index = 1;
  } else {
    index = route.query.page as string;
  }
  return Number.parseInt(route.query.page as string) || 1;
});

const filteredData = computed(() => {
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
        item.created?.match(filterRe)
      );
    });
  }
});

const secondFiltered = computed(() => {
  if (!statusFilter.value) {
    return filteredData.value;
  } else {
    return filteredData.value?.filter((item: any) => {
      return item.leadStatus == statusFilter.value;
    });
  }
});

const pagedData = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  return secondFiltered.value.slice(startIndex, endIndex);
});

onMounted(() => {
  getCompanyLeads();
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
          <VDropdown title="Apply sorting" modern spaced>
            <template #content>
              <a
                v-for="link in leadsStatusFilters"
                :value="link.value"
                class="dropdown-item is-media"
                @click="statusFilter = link.value"
              >
                <div class="meta">
                  <span>{{ link.label }}</span>
                </div>
              </a>
            </template>
          </VDropdown>

          <!-- <VField style="min-width: 120px">
            <VControl class="has-icons-left" icon="fas fa-globe">
              <VSelect v-model="statusFilter">
                <VOption value=""> All </VOption>
                <VOption v-for="link in leadsStatusFilters" :value="link.value">
                  {{ link.label }}
                </VOption>
              </VSelect>
            </VControl>
          </VField> -->
        </div>
        <div class="column is-6 is-flex is-justify-content-end">
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
          <!--List Empty Search Placeholder -->
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

          <VFlexTable
            v-if="pagedData?.length"
            :data="pagedData"
            :columns="columns"
            compact
          >
            <template #body>
              <TransitionGroup name="list" tag="div" class="flex-list-inner">
                <div
                  v-for="item in pagedData"
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
                      <span class="item-name dark-inverted">
                        {{ item.title ? item.title : "N/A" }}</span
                      >
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
                    <div v-if="item.clientInfo">
                      <span class="item-name dark-inverted">{{
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
                    <div v-else-if="item.contractor_info">
                      <span class="item-name dark-inverted"
                        >{{
                          item.contractor_info?.username
                            ? item.contractor_info?.username
                            : "N/A"
                        }}
                        {{
                          item.contractor_info?.last_name
                            ? item.contractor_info?.last_name
                            : "N/A"
                        }}</span
                      >
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
                    <VTag :color="getStatusColor[item.leadStatus]" rounded>
                      {{ getLeadStatusName[item.leadStatus] }}
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
                              router.push(`/sidebar/dashboard/jobs/${item.id}`);
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
                          @click="updateLeadStatus(item.id)"
                          class="dropdown-item is-media"
                        >
                          <div class="icon">
                            <i
                              class="lnil lnil-checkmark"
                              aria-hidden="true"
                            ></i>
                          </div>
                          <div class="meta">
                            <span>Mark As Done</span>
                            <span>Mark Job As Completed</span>
                          </div>
                        </a>

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

          <!--Table Pagination-->
          <VFlexPagination
            v-if="leadsList?.length > itemsPerPage"
            :item-per-page="itemsPerPage"
            v-model="currentPage"
            :total-items="leadsList.length"
            :current-page="currentPage"
            :max-links-displayed="7"
          />
        </div>
      </div>
    </div>
    <LeadAddUpdateModal
      v-if="openLeadModal"
      :addUpdateLeadModal="openLeadModal"
      :leadId="selectedLeadId"
      @update:modalHandler="openLeadModal = false"
      @update:OnSuccess="getCompanyLeads"
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
      @update:OnSuccess="getCompanyLeads"
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
