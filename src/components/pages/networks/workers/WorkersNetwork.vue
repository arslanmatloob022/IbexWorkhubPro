import { get } from 'cypress/types/lodash';
<script setup lang="ts">
import ApexChart from "vue3-apexcharts";
import { useThemeColors } from "/@src/composable/useThemeColors";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { useCompany } from "/@src/stores/company";
import { useViewWrapper } from "/@src/stores/viewWrapper";
import { debounce } from "/@src/composable/useSupportElement.ts";
import { CreateActivityLog } from "/@src/composable/useSupportElement";
import { useUserSession } from "/@src/stores/userSession";

const viewWrapper = useViewWrapper();
const userSession = useUserSession();
const themeColors = useThemeColors();
const company = useCompany();
const route = useRoute();
const router = useRouter();
const AddCompanyModalOpen = ref(false);
const EditCompanyModalOpen = ref(false);
const notyf = useNotyf();
const api = useApi();
const Loading = ref(false);
const currentSelectedID = ref(0);
const EditWorkerID = ref(0);
const workerArchived = ref(false);
const tab = ref("active");
const showCertificate = ref(false);
const filters = ref<any>("");
const functionCall = ref(0);
const openSanctionModal = ref(false);
let name;
const tabs = ref<"listView" | "mapView">("listView");
const search = computed(() => {
  return route.query.search || "";
});
filters.value = search.value;
export interface WorkerData {
  id: number;
  firstName: string;
  lastName: string;
  emailAddress: string;
  veriffStatus: string;
  phoneNumber: string;
  profileImageURL: string;
  lineManager: string;
  bs7858: boolean;
  homeAddress: string;
  postCode: string;
  rating: number;
  activationCode: string;
  transport: string;
  sanctionStatus: boolean;
  industry: {
    name: string;
    industryLogo: string;
  };
  profileStat: {
    percentage: 0;
    emptyFields: any[];
  };
}

const workerData = ref({});

const formData = ref([
  {
    id: 4992,
    firstName: "Toby",
    lastName: "O'Connor",
    latitude: 58.92893167510288,
    longitude: -0.11729476478785372,
    postCode: "E40 4XY",
    phoneNumber: "+443069990606",
    emailAddress: "barrettmartyn@example.org",
  },
]);

// pagination
const projects: WorkerData[] = [];
const maxLinksDisplayed = ref(3);
const page_size = ref(10);
const total_items = ref(0);
const currentPage = computed(() => {
  return Number(route.query.page) || 1;
});

const props = defineProps<{
  partnerID: {
    type: number;
    default: 0;
  };
}>();

const loadPage = async (pageNumber: number) => {
  try {
    Loading.value = true;
    projects.length = 0;
    const response = await api.get(
      `/v3/api/worker/company-workers/${company.loggedCompany.id}/?industry=${
        route.query.type
          ? route.query.type !== "All"
            ? route.query.type
            : ""
          : ""
      }${
        route.query.archive ? "&archive=true" : ""
      }&page=${pageNumber}&page_size=${page_size.value}&search=${
        search.value
      }&partner=${
        selectSlotValue.value ||
        props.partnerID ||
        userSession.user.role == "partner"
          ? selectSlotValue.value || props.partnerID || userSession.user.partner
          : ""
      }`,
      {}
    );
    total_items.value = response.data.count;
    projects.push(...(response.data.results as WorkerData[]));
  } catch (error) {
    console.error("Error loading page", error);
  } finally {
    Loading.value = false;
  }
};

const debouncedSearchChangeHandler = debounce(() => {
  router.push({ query: { ...route.query, page: 1, search: filters.value } });
}, 500);

const getAllWorkers = async () => {
  await loadPage(currentPage.value);
  checkisTypeSecurity();
};

const optionsCircle = shallowRef({
  series: [0],
  chart: {
    height: 100,
    type: "radialBar",
    toolbar: {
      show: false,
    },
  },
  colors: [themeColors.accent],
  plotOptions: {
    radialBar: {
      hollow: {
        size: "40%",
      },
      dataLabels: {
        show: true,
        name: {
          show: true,
          fontSize: "9px",
          fontWeight: 500,
          offsetY: -10,
          color: themeColors.lightText,
        },
        value: {
          show: true,
          fontWeight: 600,
          color: themeColors.purple,
          fontSize: "10px",
          offsetY: -11,
        },
      },
    },
  },
  labels: [""],
});

const SweetAlertProps = ref({
  title: "",
  subtitle: "test",
  isSweetAlertOpen: false,
  btntext: "text",
});

let columns = {
  profileImageURL: {
    label: "Worker",
    grow: true,
    media: true,
  },

  profileCompeletion: {
    label: "Profile Completion",
    align: "center",
  },

  rating: {
    label: "Rating",
    align: "end",
  },

  activationCode: {
    label: "Activation Code",
    align: "end",
  },
  transport: {
    label: "Transport",
    align: "end",
  },
  industry: {
    align: "center",
    label: "Industry",
    cellClass: "h-hidden-tablet-p",
  },

  sanctions: {
    align: "center",
    label: "Sanctions list",
  },

  BSevenCode: {
    align: "center",
    label: "BS7858",
  },

  actions: {
    label: "Actions",
    align: "end",
  },
};

const handleUpdateAddWorkerModalOpen = (value: boolean) => {
  AddCompanyModalOpen.value = value;
};

const OpenArchiveSweetAlert = (id: number) => {
  functionCall.value = 1;
  currentSelectedID.value = id;
  SweetAlertProps.value = {
    title: "Are you sure?",
    subtitle: "You will not be able to recover this Worker!",
    btntext: "Yes, Archive it",
    isSweetAlertOpen: true,
  };
};

const OpenUnArchiveSweetAlert = (id: number) => {
  functionCall.value = 1;
  currentSelectedID.value = id;
  SweetAlertProps.value = {
    title: "Are you sure?",
    subtitle:
      "Worker will be move to primary list, and remove from the archives!",
    btntext: "Yes, Unarchive",
    isSweetAlertOpen: true,
  };
};

const openPermanentallyDeleteSweetAlert = (id: number) => {
  functionCall.value = 2;
  currentSelectedID.value = id;
  SweetAlertProps.value = {
    title: "Are you sure?",
    subtitle:
      "The worker will be permanently deleted, along with all associated documents.",
    btntext: "Yes, delete",
    isSweetAlertOpen: true,
  };
};

const commonFunction = () => {
  if (functionCall.value == 1) {
    ArchiveWorkerHandler();
  } else if (functionCall.value == 2) {
    deleteWorker();
  }
};

const ArchiveWorkerHandler = async () => {
  try {
    SweetAlertProps.value.isSweetAlertOpen = false;
    const response = await api.patch(
      `/v3/api/worker/${currentSelectedID.value}/`,
      { archive: !workerArchived.value }
    );
    getAllWorkers();
    CreateActivityLog({
      message: `moved to <b>${
        workerArchived.value ? "Active list" : "Archive"
      }</b>`,
      objectId: currentSelectedID.value,
      method: "patch",
    });
    notyf.dismissAll();
    notyf.warning("Worker removed from the list");
    currentSelectedID.value = 0;
  } catch (error) {
    console.error("ok", error);
  }
};

const deleteWorker = async () => {
  try {
    SweetAlertProps.value.isSweetAlertOpen = false;
    const response = await api.delete(
      `/v3/api/worker/${currentSelectedID.value}/`
    );
    getAllWorkers();
    notyf.dismissAll();
    notyf.error("Worker deleted permanently.");
    currentSelectedID.value = 0;
  } catch (err) {
    return err;
  }
};

const copyCode = (value: any) => {
  navigator.clipboard.writeText(value);
  notyf.success("Code Copied");
};

const checkisTypeSecurity = () => {
  if (route.query.type === "Security") {
    const { actions, ...newColumns } = columns;

    columns = {
      ...newColumns,
      BSevenCode: {
        align: "center",
        label: "BS7858",
      },
      actions: {
        label: "Actions",
        align: "end",
      },
    };
    console.log(columns);
  } else {
    const { BSevenCode, ...newColumns } = columns;
    columns = newColumns;
  }
};

watch(
  () => route.fullPath,
  async (newFullPath, oldFullPath) => {
    checkisTypeSecurity();
    workerArchived.value = route.query.archive === "true";
    await getAllWorkers();
  }
);

let title = "Workers";
const types = ref([
  {
    name: "archive",
    count: 0,
  },
  {
    name: "All",
    count: 0,
  },
  {
    name: "care",
    count: 0,
  },
]);

const openSanctionModalFunction = (worker: any) => {
  workerData.value = worker;
  openSanctionModal.value = true;
};

watch(
  () => total_items.value,
  async (newFullPath, oldFullPath) => {
    title = "Workers"; // Reset title
    if (route.query.type) {
      title = `Workers: ${route.query.type} - ${total_items.value}`;
    } else if (route.query.archive) {
      title = `Workers: Archive - ${total_items.value}`;
    }
    viewWrapper.setPageTitle(title);
  }
);

const showCertificateModal = (fname: any, lname: any) => {
  router.push({ query: { ...route.query, name: `${fname} ${lname}` } });
  name = `${fname} ${lname}`;
  showCertificate.value = !showCertificate.value;
};

const openCertificate = () => {
  window.open(`/worker-certificate?name=${name}`, "_blank");
};

const companySuppliers = company.suppliers ? company.suppliers : [];
console.log("company supplier", companySuppliers);
const selectSlotValue = ref("");

const selectSlotOptions = companySuppliers.map((item) => {
  return {
    value: item.id.toString(), // Convert id to string
    name: item.supplierName,
    icon: item.partnerLogo ? item.partnerLogo : "/default/icon.png",
  };
});

selectSlotOptions.unshift({
  value: "",
  name: "All",
  icon: company.loggedCompany.compnayLogo,
});

watch(selectSlotValue, (oldVal, newVal) => {
  getAllWorkers();
});

// Initial title setting
if (route.query.type) {
  title = `(${route.query.type})`;
} else if (route.query.archive) {
  title = "Workers (Archived)";
}
viewWrapper.setPageTitle(title);

const gotoWorkerProfile = (workerID: any) => {
  if (userSession.user.role == "partner") {
    router.push({
      name: "/sidebar/partner/workers/[id]",
      params: { id: workerID },
    });
  } else {
    router.push({
      name: "/sidebar/company/workers/[id]",
      params: { id: workerID },
    });
  }
};

onActivated(async () => {
  await getAllWorkers();
  checkisTypeSecurity();
});

onMounted(async () => {
  await getAllWorkers();
  checkisTypeSecurity();
});
</script>

<template>
  <div>
    <div class="tabs-wrapper">
      <div class="tabs-inner mt-2">
        <div class="tabs is-toggle">
          <ul>
            <li :class="[tabs === 'listView' ? 'is-active' : 'not-active']">
              <a
                tabindex="0"
                role="button"
                @keydown.space.prevent="tabs = 'listView'"
                @click="tabs = 'listView'"
                ><span>List view</span></a
              >
            </li>
            <li :class="[tabs === 'mapView' ? 'is-active' : 'not-active']">
              <a
                tabindex="0"
                role="button"
                @keydown.space.prevent="tabs = 'mapView'"
                @click="tabs = 'mapView'"
                ><span>Map view</span></a
              >
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div v-show="tabs == 'listView'">
      <div>
        <div class="list-flex-toolbar is-reversed">
          <div class="buttons">
            <VButton
              color="primary"
              icon="fas fa-plus"
              elevated
              @click="AddCompanyModalOpen = true"
            >
              Worker
            </VButton>
            <VControl icon="feather:search">
              <input
                v-model="filters"
                @input="debouncedSearchChangeHandler"
                class="input custom-text-filter"
                placeholder="Search..."
              />
            </VControl>
            <div v-if="userSession.user.role != 'partner'">
              <VField v-if="!props.partnerID" v-slot="{ id }" class="pl-2">
                <VControl>
                  <Multiselect
                    style="width: 220px"
                    v-model="selectSlotValue"
                    :attrs="{ id }"
                    placeholder="Select a service partner"
                    label="name"
                    :options="selectSlotOptions"
                    :searchable="true"
                    track-by="name"
                    :height="300"
                  >
                    <template #singlelabel="{ value }">
                      <div class="multiselect-single-label">
                        <img
                          style="width: 30px"
                          class="select-label-icon mr-2"
                          :src="value.icon"
                          alt=""
                        />
                        {{ value.name }}
                      </div>
                    </template>

                    <template #option="{ option }">
                      <img
                        style="width: 40px; padding-right: 6px"
                        class="select-option-icon mr-2"
                        :src="option.icon"
                        alt=""
                      />
                      {{ option.name }}
                    </template>
                  </Multiselect>
                </VControl>
              </VField>
            </div>
          </div>
        </div>
        <PlaceloadV1 v-if="Loading" />
        <div v-else class="flex-list-wrapper flex-list-v2">
          <VPlaceholderPage
            v-if="tab === 'active' && projects.length === 0"
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
              v-if="projects.length"
              :data="projects"
              :columns="columns"
              rounded
            >
              <template #body>
                <TransitionGroup name="list" tag="div" class="flex-list-inner">
                  <!--Table item-->
                  <div
                    v-for="item in projects"
                    :key="item.id"
                    class="flex-table-item"
                    style="cursor: pointer"
                  >
                    <VFlexTableCell
                      :column="{ media: true, grow: true }"
                      @click="gotoWorkerProfile(item.id)"
                    >
                      <VAvatar
                        size="medium"
                        style="position: relative"
                        :picture="
                          item.profileImageURL
                            ? item.profileImageURL
                            : '/images/avatars/placeholder.jpg'
                        "
                      >
                      </VAvatar>
                      <img
                        v-if="item.veriffStatus == 'approved'"
                        style="
                          position: absolute;
                          bottom: 10px;
                          margin-left: 32px;
                          background-color: #fff;
                          border-radius: 50%;
                          z-index: 1;
                          width: 20px;
                        "
                        src="/images/veriff-logo-round.svg"
                      />
                      <img
                        v-if="item.warning"
                        style="
                          position: absolute;
                          top: 1px;
                          margin-left: 32px;
                          background-color: #fff;
                          border-radius: 50%;
                          z-index: 1;
                          width: 24px;
                          height: auto;
                        "
                        src="/images/warning-48.png"
                      />

                      <div class="user-meta">
                        <span
                          class="item-name dark-inverted"
                          style="margin-bottom: 6px !important"
                          >{{ item.firstName }} {{ item.lastName }}</span
                        >
                        <span class="item-meta">
                          <span>
                            <i
                              style="width: 10px"
                              class="iconify"
                              data-icon="feather:phone"
                              aria-hidden="true"
                            ></i>
                            {{ item.phoneNumber }}</span
                          >
                        </span>
                        <span class="item-meta">
                          <span>
                            <i
                              style="width: 10px"
                              class="iconify"
                              data-icon="feather:mail"
                              aria-hidden="true"
                            ></i>
                            {{ item.emailAddress }}</span
                          >
                        </span>
                        <span class="item-meta">
                          <span>
                            <i
                              style="width: 10px"
                              class="iconify"
                              data-icon="feather:map-pin"
                              aria-hidden="true"
                            ></i>
                            {{ item.postCode ? item.postCode : "-----" }}</span
                          >
                        </span>
                      </div>
                    </VFlexTableCell>

                    <!-- profile completion -->
                    <VFlexTableCell :column="{ align: 'start' }">
                      <Tippy>
                        <template #content>
                          <div class="content">
                            <h6 style="text-align: center" class="mt-4">
                              Compliance Documents
                            </h6>
                            <ol
                              style="width: 160px !important"
                              type="1"
                              v-if="item.profileStat"
                            >
                              <li
                                v-for="(missing, index) in item.profileStat
                                  .emptyFields"
                                :key="index"
                                style="font-weight: 500 !important"
                                :style="{
                                  color: missing.is_uploaded
                                    ? missing.status
                                      ? '#0AA209'
                                      : '#FEA208'
                                    : '#FD2D2C',
                                }"
                              >
                                {{
                                  missing.doc.length < 17
                                    ? missing.doc
                                    : `${missing.doc.slice(0, 17)} ...`
                                }}
                                <img
                                  v-if="missing.status"
                                  style="
                                    height: 18px;
                                    width: 18px;
                                    float: right;
                                  "
                                  src="/images/photo/greenshield.png"
                                />
                                <img
                                  v-else-if="missing.is_uploaded"
                                  style="
                                    height: 18px;
                                    width: 18px;
                                    float: right;
                                  "
                                  src="/images/photo/defence.png"
                                />
                                <img
                                  v-else
                                  style="
                                    height: 18px;
                                    width: 18px;
                                    float: right;
                                  "
                                  src="/images/photo/redsshield.png"
                                />
                              </li>
                            </ol>
                          </div>
                        </template>
                        <ApexChart
                          id="radial-circle"
                          class="circle-chart-wrapper"
                          :height="optionsCircle.chart.height"
                          :type="optionsCircle.chart.type"
                          :series="[
                            item.profileStat ? item.profileStat.percentage : 0,
                          ]"
                          :options="optionsCircle"
                        />
                      </Tippy>
                    </VFlexTableCell>

                    <!-- rating -->
                    <VFlexTableCell :columns="{ align: 'end' }">
                      <VField class="ml-6">
                        <VControl>
                          <VRangeRating
                            :model-value="item.rating"
                            :readonly="true"
                          />
                        </VControl>
                      </VField>
                    </VFlexTableCell>

                    <!-- Activation Code -->
                    <VFlexTableCell :column="{ align: 'center' }">
                      <VTag
                        v-tooltip.info.rounded="'Click to copy'"
                        @click="copyCode(item.activationCode)"
                        color="info"
                        :label="
                          item.activationCode
                            ? item.activationCode
                            : 'No Activation Code!'
                        "
                        rounded
                      />
                    </VFlexTableCell>

                    <!-- Transport -->
                    <VFlexTableCell :column="{ align: 'center' }">
                      <VTag
                        :color="item.transport ? 'primary' : ''"
                        :label="
                          item.transport ? item.transport : 'Not Available!'
                        "
                        rounded
                      />
                    </VFlexTableCell>

                    <!-- industry -->
                    <VFlexTableCell :column="{ align: 'center' }">
                      <img
                        class="cus-small-industry"
                        :src="
                          item.industry.industryLogo
                            ? item.industry.industryLogo
                            : '/images/avatars/placeholder.jpg'
                        "
                      />
                    </VFlexTableCell>

                    <!-- sanction Code -->
                    <VFlexTableCell :column="{ align: 'center' }">
                      <div class="justify-center">
                        <img
                          style="height: auto; width: 28px"
                          class="cus-small-industry"
                          :src="
                            item.sanctionStatus
                              ? '/images/warning-48.png'
                              : '/images/cleared.png'
                          "
                        />
                        <p
                          v-if="item.sanctionStatus"
                          class="is-small-bold is-underline"
                          @click="openSanctionModalFunction(item)"
                          style="color: var(--danger)"
                        >
                          Not Cleared
                        </p>
                      </div>
                    </VFlexTableCell>

                    <!-- BSSeve Code -->
                    <VFlexTableCell
                      v-if="route.query.type === 'Security'"
                      :column="{ align: 'center' }"
                    >
                      <i
                        v-if="!item.bs7858"
                        class="fas fa-times-circle"
                        style="color: var(--danger); font-size: 20px"
                        aria-hidden="true"
                      ></i>
                      <span
                        @click="
                          showCertificateModal(item.firstName, item.lastName)
                        "
                        v-if="item.bs7858"
                      >
                        <img
                          class="cu-pointer"
                          style="height: 24px; width: auto"
                          src="/images/view-48.png"
                        />
                      </span>
                    </VFlexTableCell>

                    <!-- Action button -->
                    <VFlexTableCell :column="{ align: 'end' }">
                      <VDropdown icon="feather:more-vertical" spaced right>
                        <template #content>
                          <RouterLink
                            role="menuitem"
                            class="dropdown-item is-media"
                            :to="{
                              name: '/sidebar/company/workers/[id]',
                              params: { id: item.id },
                            }"
                          >
                            <div class="icon">
                              <i
                                aria-hidden="true"
                                class="lnil lnil-user-alt"
                              />
                            </div>
                            <div class="meta">
                              <span>Profile</span>
                              <span>View worker profile</span>
                            </div>
                          </RouterLink>

                          <a
                            role="menuitem"
                            href="#"
                            class="dropdown-item is-media"
                          >
                            <div class="icon">
                              <i aria-hidden="true" class="lnil lnil-bubble" />
                            </div>
                            <div class="meta">
                              <span>Message</span>
                              <span>Send Message</span>
                            </div>
                          </a>

                          <a
                            role="menuitem"
                            href="#"
                            class="dropdown-item is-media"
                            @click="
                              () => {
                                EditWorkerID = item.id;
                                EditCompanyModalOpen = true;
                              }
                            "
                          >
                            <div class="icon">
                              <i
                                class="lnil lnil-message-edit"
                                aria-hidden="true"
                              ></i>
                            </div>
                            <div class="meta">
                              <span>Edit</span>
                              <span>Edit worker Info</span>
                            </div>
                          </a>

                          <hr class="dropdown-divider" />

                          <a
                            v-if="workerArchived"
                            role="menuitem"
                            href="#"
                            class="dropdown-item is-media"
                            @click="OpenUnArchiveSweetAlert(item.id)"
                          >
                            <div class="icon">
                              <i
                                class="lnir lnir-archive"
                                aria-hidden="true"
                              ></i>
                            </div>
                            <div class="meta">
                              <span>Unarchive</span>
                              <span>Move to primary list</span>
                            </div>
                          </a>
                          <a
                            v-else
                            role="menuitem"
                            href="#"
                            class="dropdown-item is-media"
                            @click="OpenArchiveSweetAlert(item.id)"
                          >
                            <div class="icon">
                              <i
                                class="lnir lnir-archive"
                                aria-hidden="true"
                              ></i>
                            </div>
                            <div class="meta">
                              <span>Archive</span>
                              <span>Remove from list</span>
                            </div>
                          </a>
                          <a
                            role="menuitem"
                            href="#"
                            class="dropdown-item is-media"
                            @click="openPermanentallyDeleteSweetAlert(item.id)"
                          >
                            <div class="icon">
                              <i aria-hidden="true" class="lnil lnil-trash" />
                            </div>
                            <div class="meta">
                              <span>Delete</span>
                              <span>Delete worker permanently</span>
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
              v-if="total_items > page_size"
              :item-per-page="page_size"
              v-model="currentPage"
              :total-items="total_items"
              :current-page="currentPage"
              :max-links-displayed="maxLinksDisplayed"
            />
          </div>
        </div>
      </div>
    </div>
    <div v-show="tabs == 'mapView'">
      <div class="content-box">
        <WorkersMapLocation />
      </div>
    </div>

    <SanctionList
      v-if="openSanctionModal"
      :firstName="workerData.firstName"
      :lastName="workerData.lastName"
      :openSanctionModal="openSanctionModal"
      @update:openSanctionModal="
        (value: boolean) => (openSanctionModal = value)
      "
    ></SanctionList>

    <AddWorker
      :AddCompanyModalOpen="AddCompanyModalOpen"
      @update:modalHandler="handleUpdateAddWorkerModalOpen"
      @update:OnSuccess="getAllWorkers"
    />
    <EditWorker
      v-if="EditCompanyModalOpen"
      :EditCompanyModalOpen="EditCompanyModalOpen"
      :id="EditWorkerID"
      :getAllWorkers="getAllWorkers"
      @update:modalHandler="(value: boolean) => (EditCompanyModalOpen = value)"
      @update:OnSuccess="getAllWorkers"
    />
    <SweetAlert
      v-if="SweetAlertProps.isSweetAlertOpen"
      :isSweetAlertOpen="SweetAlertProps.isSweetAlertOpen"
      :title="SweetAlertProps.title"
      :subtitle="SweetAlertProps.subtitle"
      :btntext="SweetAlertProps.btntext"
      :onConfirm="commonFunction"
      :onCancel="() => (SweetAlertProps.isSweetAlertOpen = false)"
    />
  </div>
  <VModal
    is="form"
    :open="showCertificate"
    title="BS7858"
    size="big"
    actions="right"
    @close="showCertificate = false"
  >
    <template #content>
      <BScertificate />
    </template>
    <template #action>
      <VButton color="primary" @click="openCertificate" raised>Print</VButton>
    </template>
  </VModal>
</template>

<style lang="scss" scoped>
@import "/@src/scss/abstracts/all";

.radio {
  padding: 0.7rem !important;
}

.item-meta {
  span {
    font-size: 10px !important;
  }
}

.list-view-v1 {
  .list-view-item {
    @include vuero-r-card;

    margin-bottom: 16px;
    padding: 16px;

    .list-view-item-inner {
      display: flex;
      align-items: center;

      .meta-left {
        margin-inline-start: 16px;

        h3 {
          font-family: var(--font-alt);
          color: var(--dark-text);
          font-weight: 600;
          font-size: 1rem;
          line-height: 1;
        }

        > span:not(.tag) {
          font-size: 0.9rem;
          color: var(--light-text);

          svg {
            height: 12px;
            width: 12px;
          }
        }
      }

      .meta-right {
        margin-inline-start: auto;
        display: flex;
        justify-content: flex-end;
        align-items: center;

        .tags {
          margin-inline-end: 30px;
          margin-bottom: 0;

          .tag {
            margin-bottom: 0;
          }
        }

        .stats {
          display: flex;
          align-items: center;
          margin-inline-end: 30px;

          .stat {
            display: flex;
            align-items: center;
            flex-direction: column;
            text-align: center;
            color: var(--light-text);

            > span {
              font-family: var(--font);

              &:first-child {
                font-size: 1.2rem;
                font-weight: 600;
                color: var(--dark-text);
                line-height: 1.4;
              }

              &:nth-child(2) {
                text-transform: uppercase;
                font-family: var(--font-alt);
                font-size: 0.75rem;
              }
            }

            svg {
              height: 16px;
              width: 16px;
            }

            i {
              font-size: 1.4rem;
            }
          }

          .separator {
            height: 25px;
            width: 2px;
            border-inline-end: 1px solid var(--fade-grey-dark-3);
            margin: 0 16px;
          }
        }

        .network {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          min-width: 145px;

          > span {
            font-family: var(--font);
            font-size: 0.9rem;
            color: var(--light-text);
            margin-inline-start: 6px;
          }
        }

        .dropdown {
          margin-inline-start: 30px;
        }
      }
    }
  }
}

.is-dark {
  .list-view-v1 {
    .list-view-item {
      @include vuero-card--dark;

      .list-view-item-inner {
        .meta-left {
          h3 {
            color: var(--dark-dark-text) !important;
          }
        }

        .meta-right {
          .stats {
            .stat {
              span {
                &:first-child {
                  color: var(--dark-dark-text);
                }
              }
            }

            .separator {
              border-color: var(--dark-sidebar-light-16) !important;
            }
          }
        }
      }
    }
  }
}

@media only screen and (width <=767px) {
  .list-view-v1 {
    .list-view-item {
      .list-view-item-inner {
        position: relative;
        flex-direction: column;

        .v-avatar {
          margin-bottom: 10px;
        }

        .meta-left {
          margin-inline-start: 0;
        }

        .meta-right {
          flex-direction: column;
          margin-inline-start: 0;

          .tags {
            margin: 10px 0;
          }

          .stats {
            margin: 10px 0;
          }

          .network {
            margin: 10px 0 0;
            justify-content: center;

            > span {
              display: none;
            }
          }

          .dropdown {
            position: absolute;
            top: 0;
            inset-inline-end: 0;
            margin-inline-start: 0;
          }
        }
      }
    }
  }
}

@media only screen and (width >=768px) and (width <=1024px) and (orientation: portrait) {
  .list-view-v1 {
    display: flex;
    flex-wrap: wrap;

    .list-view-item {
      margin: 10px;
      width: calc(50% - 20px);

      .list-view-item-inner {
        position: relative;
        flex-direction: column;

        .v-avatar {
          margin-bottom: 10px;
        }

        .meta-left {
          margin-inline-start: 0;
        }

        .meta-right {
          flex-direction: column;
          margin-inline-start: 0;

          .tags {
            margin: 10px 0;
          }

          .stats {
            margin: 10px 0;
          }

          .network {
            margin: 10px 0 0;
            justify-content: center;

            > span {
              display: none;
            }
          }

          .dropdown {
            position: absolute;
            top: 0;
            inset-inline-end: 0;
            margin-inline-start: 0;
          }
        }
      }
    }
  }
}
</style>
