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

const selectedSortOption = ref("");
const route = useRoute();
const selectedContractorId = ref("");
const contractorOptions = ref([
  {
    value: "",
    name: "",
    icon: "",
  },
]);
const page = ref(1);
const filters = ref("");
const openLeadProposalModal = ref(false);
const openLeadModal = ref(false);

const columns = {
  username: {
    label: "Contractor / Client",
    grow: true,
  },
  location: {
    label: "Job",
    grow: true,
  },
  contacts: {
    label: "Date Created",
    grow: true,
  },

  status: "Status",
  industry: "Manager",
  actions: {
    label: "Actions",
    align: "end",
  },
} as const;
const contractorsList = ref([
  {
    id: "bc199abb-e8f3-4074-91c1-a73c182de6aa",
    active_project: 0,
    completed_project: 1,
    cancelled_project: 0,
    pending_project: 0,
    password:
      "pbkdf2_sha256$260000$OczZJ7bosNcSEPl14SwE2W$BE95gFMgOF4gKAvgE5PIfMbSmRXSrPjn0+Th1ox5lOQ=",
    last_login: null,
    date_joined: "2024-05-23T10:14:39.803183Z",
    email: "ibexbuilderstudios@gmail.com",
    role: "contractor",
    avatar: null,
    is_active: true,
    phoneNumber: "23984729370",
    username: "Patrick",
    last_name: "",
    is_sentMail: false,
    supplier: null,
  },
]);
const currentJobsList = ref([
  {
    id: "",
    sales_people_info: [
      {
        id: "",
        username: "",
        last_name: "",
        email: "",
        role: "",
        avatar: null,
      },
    ],
    clientInfo: {
      id: "",
      username: "",
      last_name: "",
      email: "",
      role: "",
      avatar: "",
    },
    created_by_info: null,
    contractor_info: {
      id: "",
      username: "",
      last_name: "",
      email: "",
      role: "",
      avatar: null,
    },
    managers_list: [
      {
        id: "",
        username: "",
        last_name: "",
        email: "",
        role: "",
        avatar: "",
      },
    ],
    title: "",
    description: "",
    image: "",
    color: "",
    startDate: "",
    endDate: "",
    status: "",
    is_active: false,
    address: "",
    wifiAvaliabe: false,
    parkingAvaliable: false,
    property_features: null,
    created: "",
    uploaded_files: [],
    leadStatus: "",
    current_state: "",
    city: "",
    state: "",
    zip_code: "",
    confidence: "",
    sale_date: null,
    estimated_from: null,
    estimated_to: null,
    tags: [],
    sources: "",
    project_type: null,
    notes: "",
    attach_mail: null,
    latitude: 31.5440886,
    longitude: 74.3839007,
    client: "",
    contractor: "",
    created_by: null,
    managers: [""],
    sales_people: [],
  },
]);
const isPaginated = ref(true);
const selectedLeadId = ref("");
const itemsPerPage = ref(20);
const jobsData = ref({
  count: 40,
  next: "https://api.ibexworkhub.com/api/project/project-jobs/?is-paginated=true&page=2&page_size=10",
  previous: null,
  results: [],
});

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

const getContractorsHandler = async () => {
  try {
    loading.value = true;
    const response = await api.get("/api/users/by-role-option/contractor/");
    contractorsList.value = response.data;
    contractorOptions.value = response.data?.map((item: any) => {
      return {
        value: item.id,
        name: `${item.username} ${item.last_name ? item.last_name : ""}`,
        icon: item.avatar,
      };
    });
    contractorOptions.value.unshift({
      value: "",
      name: "All",
      icon: "",
    });
    selectedContractorId.value = "";
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const openAddProposalModalHandler = (id: any) => {
  selectedLeadId.value = id;
  openLeadProposalModal.value = !openLeadProposalModal.value;
};

const sortJobs = (type: string = "") => {
  selectedSortOption.value = type;
};

const getCompanyJobs = async () => {
  try {
    loading.value = true;
    const response = await api.get(
      `/api/project/project-jobs/?is-paginated=${isPaginated.value}&page=${
        page.value
      }&page_size=${itemsPerPage.value}&search=${filters.value}&contractor=${
        selectedContractorId.value ? selectedContractorId.value : ""
      }`
    );
    jobsData.value = response.data;
    leadsList.value = response.data?.results?.filter(
      (item: any) => item.status == "completed"
    );
    currentJobsList.value = response.data?.results?.filter(
      (item: any) => item.status != "completed"
    );
  } catch (error: any) {
    notyf.error(` ${error}, Lead`);
  } finally {
    loading.value = false;
  }
};

watch(
  () => selectedContractorId.value,
  (newVal) => {
    if (newVal) {
      page.value = 1;
      itemsPerPage.value = jobsData.value.count;
      getCompanyJobs();
    } else {
      page.value = 1;
      itemsPerPage.value = 20;
      getCompanyJobs();
    }
  }
);
watch(
  () => filters.value,
  (newVal) => {
    if (newVal) {
      getCompanyJobs();
    }
  }
);

watch(
  () => route.query.page,
  (newVal) => {
    page.value = route.query.page ?? 1;
    getCompanyJobs();
  }
);

watch(
  () => page.value,
  (newVal) => {
    router.push({
      query: {
        ...route.query,
        page: newVal,
      },
    });
  }
);

const filteredData = computed(() => {
  return currentJobsList.value;
});

const currentPage = computed(() => {
  let index: any = route.query.page as string;
  if (index == undefined || index == "undefined") {
    index = 1;
  } else {
    index = route.query.page as string;
  }
  return Number.parseInt(route.query.page as string) || 1;
});

const secondFiltered = computed(() => {
  // return filteredData.value;

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

onMounted(() => {
  getCompanyJobs();
  getContractorsHandler();
});
</script>

<template>
  <div>
    <div>
      <div class="list-flex-toolbar columns is-multiline">
        <div class="column is-6 is-flex is-align-items-center">
          <VField>
            <VControl icon="feather:search">
              <input
                v-model="filters"
                class="input custom-text-filter"
                placeholder="Type and press enter..."
                @keyup.enter="getCompanyJobs"
              />
            </VControl>
          </VField>

          <VDropdown title="Apply sorting" modern spaced>
            <template #content>
              <a
                @click="sortJobs('ascending')"
                class="dropdown-item is-media"
                :class="{ 'is-active': selectedSortOption === 'ascending' }"
              >
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
                class="dropdown-item is-media"
                :class="{ 'is-active': selectedSortOption === 'descending' }"
              >
                <div class="icon">
                  <i class="fas fa-sort-alpha-down-alt" aria-hidden="true"></i>
                </div>
                <div class="meta">
                  <span>Descending</span>
                  <span>Alphabetical Descending Sorting</span>
                </div>
              </a>
              <a
                @click="sortJobs('new')"
                class="dropdown-item is-media"
                :class="{ 'is-active': selectedSortOption === 'new' }"
              >
                <div class="icon">
                  <i class="fas fa-sort-numeric-down" aria-hidden="true"></i>
                </div>
                <div class="meta">
                  <span>Most Recent</span>
                  <span>Sort most recently created</span>
                </div>
              </a>
              <a
                @click="sortJobs('old')"
                class="dropdown-item is-media"
                :class="{ 'is-active': selectedSortOption === 'old' }"
              >
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
          <VField
            class="h-hidden-mobile ml-2"
            style="min-width: 200px"
            v-slot="{ id }"
          >
            <VControl>
              <Multiselect
                v-model="selectedContractorId"
                :attrs="{ id }"
                placeholder="Select a contractor"
                label="name"
                :options="contractorOptions"
                :searchable="true"
                track-by="name"
                :max-height="145"
              >
                <template #singlelabel="{ value }">
                  <div
                    v-if="selectedContractorId"
                    class="multiselect-single-label"
                  >
                    <VAvatar
                      size="xs"
                      squared
                      class="mr-2"
                      :picture="value.icon"
                    />
                    {{ value.name }}
                  </div>
                </template>
                <template #option="{ option }">
                  <VAvatar
                    size="small"
                    squared
                    class="mr-2"
                    :picture="option.icon"
                  />
                  <!-- <img class="select-option-icon" :src="option.icon" alt="" /> -->
                  {{ option.name }}
                </template>
              </Multiselect>
            </VControl>
          </VField>
        </div>

        <div class="column is-6 is-flex is-justify-content-end">
          <VField
            class="smart-search-dropdown h-hidden-desktop"
            style="min-width: 180px; height: 44px"
            v-slot="{ id }"
          >
            <VControl>
              <Multiselect
                v-model="selectedContractorId"
                :attrs="{ id }"
                placeholder="Select a contractor"
                label="name"
                :options="contractorOptions"
                :searchable="true"
                track-by="name"
                :max-height="145"
              >
                <template #singlelabel="{ value }">
                  <div class="multiselect-single-label">
                    <VAvatar
                      size="small"
                      squared
                      class="mr-2"
                      :picture="value.icon"
                    />
                    {{ value.name }}
                  </div>
                </template>
                <template #option="{ option }">
                  <VAvatar
                    size="small"
                    squared
                    class="mr-2"
                    :picture="option.icon"
                  />
                  <!-- <img class="select-option-icon" :src="option.icon" alt="" /> -->
                  {{ option.name }}
                </template>
              </Multiselect>
            </VControl>
          </VField>
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
      <PlaceloadNoButtonV1 v-if="loading" />
      <div v-else class="page-content-inner">
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
                      <i
                        v-if="!item.contractor_info?.avatar"
                        class="fas fa-hospital-user image fa-2x light-text"
                        aria-hidden="true"
                      ></i>
                      <VAvatar
                        v-else
                        :picture="
                          item.contractor_info?.avatar
                            ? item.contractor_info?.avatar
                            : '/IbexImages/home-icon.png'
                        "
                        squared
                        size="medium"
                      />
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
                      :column="{ media: true, grow: true }"
                    >
                      <div>
                        <span
                          class="item-name dark-inverted is-flex show-text-300"
                        >
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
              v-if="jobsData.count > itemsPerPage"
              :item-per-page="itemsPerPage"
              v-model="currentPage"
              :total-items="jobsData.count"
              :current-page="currentPage"
              :max-links-displayed="5"
            />
            <!-- <VFlexPagination
              v-if="secondFiltered?.length > 5"
              v-model:current-page="page"
              :item-per-page="10"
              :total-items="80"
              :max-links-displayed="7"
              no-router
            /> -->
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
