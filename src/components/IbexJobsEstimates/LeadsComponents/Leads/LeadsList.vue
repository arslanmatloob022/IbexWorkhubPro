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
import { getStatusColor } from "../../estimatesScripts";

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

const openLeadModal = ref(false);
const users = listData.users as UserData[];

const leadsStatusFilters = ref([
  { value: "open", label: "Open" },
  { value: "sold", label: "Sold" },
  { value: "lost", label: "Lost" },
  { value: "onHold", label: "On hold" },
]);

const columns = {
  username: {
    label: "Contractor",
    grow: true,
  },
  location: {
    label: "Job",
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

const getCompanyLeads = async () => {
  try {
    loading.value = true;
    const response = await api.get("/api/job/leads/");
    leadsList.value = response.data;
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
    title: "Delete Proposal?",
    subtitle:
      "Are you sure to delete this proposal? After delete you will not be able to recover it again.",
    btntext: "Yes delete",
    isSweetAlertOpen: true,
  };
};

const deleteLeadHandler = async () => {
  try {
    loading.value = true;
    const response = await api.delete(`/api/job/${selectedLeadId.value}/`);

    notyf.success("Proposal delete successfully");
    getCompanyLeads();
  } catch (error: any) {
    notyf.error(` ${error}, Proposal`);
    notyf.error("Something went wrong please try later");
  } finally {
    loading.value = false;
    SweetAlertProps.value.isSweetAlertOpen = false;
  }
};
const filters = ref("");
const statusFilter = ref("");

const filteredData = computed(() => {
  if (!filters.value) {
    return leadsList.value;
  } else {
    const filterRe = new RegExp(filters.value, "i");
    return leadsList.value.filter((item) => {
      return item.title.match(filterRe) || item.created_at.match(filterRe);
    });
  }
});

onMounted(() => {
  getCompanyLeads();
});
</script>

<template>
  <div>
    <PlaceloadV1 v-if="loading" />
    <div v-else>
      <div class="list-flex-toolbar flex-list-v1">
        <VField>
          <VControl icon="feather:search">
            <input
              v-model="filters"
              class="input custom-text-filter"
              placeholder="Search..."
            />
          </VControl>
        </VField>

        <VField>
          <VControl class="has-icons-left" icon="fas fa-globe">
            <VSelect v-model="statusFilter">
              <VOption value=""> All </VOption>
              <VOption v-for="link in leadsStatusFilters" :value="link.value">
                {{ link.label }}
              </VOption>
            </VSelect>
          </VControl>
        </VField>

        <VButtons>
          <VButton
            @click="openLeadModal = !openLeadModal"
            color="primary"
            icon="fas fa-plus"
            elevated
          >
            Lead Opportunity
          </VButton>
        </VButtons>
      </div>

      <div class="page-content-inner">
        <div class="flex-list-wrapper flex-list-v1">
          <!--List Empty Search Placeholder -->
          <VPlaceholderPage
            v-if="!filteredData.length"
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
            v-if="filteredData.length"
            :data="filteredData"
            :columns="columns"
            compact
          >
            <template #body>
              <TransitionGroup name="list" tag="div" class="flex-list-inner">
                <div
                  v-for="item in filteredData"
                  :key="item.id"
                  class="flex-table-item"
                >
                  <VFlexTableCell
                    @click="
                      () => {
                        router.push(`/sidebar/dashboard/jobs/${item.id}`);
                      }
                    "
                    :column="{ media: true, grow: true }"
                  >
                    <div class="show-text-200">
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
                  </VFlexTableCell>

                  <VFlexTableCell :column="{ media: true, grow: true }">
                    <div class="">
                      <span class="item-name dark-inverted show-text-200">{{
                        item.title ? item.title : "N/A"
                      }}</span>
                      <span class="item-meta show-text-200">
                        <span>{{ item.address ? item.address : "N/A" }}</span>
                      </span>
                    </div>
                  </VFlexTableCell>
                  <VFlexTableCell :column="{ media: true }">
                    <div>
                      <span class="item-name">{{
                        formatDate(item.created_at)
                      }}</span>
                      <span class="item-meta">
                        <span>At:{{ formatTime(item.created_at) }}</span>
                      </span>
                    </div>
                  </VFlexTableCell>

                  <VFlexTableCell>
                    <VTag :color="getStatusColor[item.status]" rounded>
                      {{ item.status ? item.status : "N/A" }}
                    </VTag>
                  </VFlexTableCell>

                  <VFlexTableCell :column="{ media: true }">
                    <div>
                      <span class="item-name">{{
                        item.manager_info?.username
                          ? item.manager_info?.username
                          : "N/A"
                      }}</span>
                      <span class="item-meta">
                        <span>{{
                          item.manager_info?.email
                            ? item.manager_info?.email
                            : "N/A"
                        }}</span>
                      </span>
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
                          @click.prevent=""
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
                          class="dropdown-item is-media"
                          @click.prevent=""
                        >
                          <div class="icon">
                            <i aria-hidden="true" class="lnil lnil-briefcase" />
                          </div>
                          <div class="meta">
                            <span>Proposals</span>
                            <span>View proposal of lead</span>
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

          <!--Table Pagination-->
          <VFlexPagination
            v-if="filteredData.length > 5"
            v-model:current-page="page"
            :item-per-page="10"
            :total-items="80"
            :max-links-displayed="7"
            no-router
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
