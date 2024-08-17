import { get } from 'cypress/types/lodash';
<script setup lang="ts">
import { useApi } from "/@src/composable/useAPI";
import { useCompany } from "/@src/stores/company";
import { downloadCSV, debounce } from "/@src/composable/useSupportElement";
import { useNotyf } from "/@src/composable/useNotyf";
let sessoionAnomalieFilters = <any>{};
let isSelectedDocFirstCall = true;
const setloading = ref(false);
const company = useCompany();
const route = useRoute();
const router = useRouter();
const api = useApi();
const Loading = ref(false);
const tab = ref("active");
const filters = ref("");
const anomaliesOptions = ref<any>([]);
const anomaliesData = ref<any>([]);
const optionSelected = ref("All");
const itemsPerPage = ref(12);
const maxLinksDisplayed = ref(3);
const currentStatType = ref("all");
const anomaliesResponse = ref<any>([]);
const limitedScreening = ref(false);
const showAnomaliesCard = ref(false);
const selectedUserId = ref("");
const docAllNoneFilter = ref(true);
const filterLoading = ref(false);
const currentPage = computed(() => {
  return Number(route.query.page) || 1;
});
const selectedOptions = ref<any>([]);
const selectedDocList = ref<any>([]);
const CurrentView = ref("grid");
const stats = ref({
  not_uploaded: 0,
  expired: 0,
  date_missing: 0,
  expire_within_14_days: 0,
  all: 0,
});
const docTypeSelected = ref<any>([{ id: 1, name: "all", type: "all" }]);

const statChangeHandler = (anomalyType: string) => {
  currentStatType.value = anomalyType;
  router.push({ query: { ...route.query, page: 1 } });
  if (anomalyType === "all") {
    anomaliesData.value = anomaliesResponse.value;
    return;
  }
  let data = anomaliesResponse.value.filter((item) => {
    const filteredAnomalies = item.anomalies.filter(
      (anomaly) => anomaly.type === anomalyType
    );
    return filteredAnomalies.length > 0; // Include the item only if it has the specified anomaly type
  });
  anomaliesData.value = data;
  sessoionAnomalieFilters.currentStatType = anomalyType;
  window.sessionStorage.setItem(
    `anomalieFilters${company.loggedCompany.id}`,
    JSON.stringify(sessoionAnomalieFilters)
  );
};

let columns = {
  profileImageURL: {
    label: "",
    grow: false,
    media: true,
  },
  profileCompeletion: {
    label: "",
    align: "start",
    grow: true,
  },
};

const getAnomaliesData = async (
  isResetDocList: Boolean = true,
  isEmptyDoc: Boolean = false
) => {
  setloading.value = true;
  Loading.value = true;

  try {
    let industries = <any>[];
    selectedOptions.value.forEach((element: any) => {
      industries.push(element.id);
    });
    let documents = <any>[];
    console.log("lus", selectedDocList.value, typeof selectedDocList.value);
    if (selectedDocList.value) {
      selectedDocList.value.forEach((element: any) => {
        documents.push(element.id);
      });
    }
    if (isEmptyDoc) {
      documents = [0];
      selectedDocList.value = [];
    }
    if (isResetDocList) {
      documents = [];
    }

    sessoionAnomalieFilters.industry = selectedOptions.value;
    sessoionAnomalieFilters.documents = selectedDocList.value;
    sessoionAnomalieFilters.limitedScreening = limitedScreening.value;
    window.sessionStorage.setItem(
      `anomalieFilters${company.loggedCompany.id}`,
      JSON.stringify(sessoionAnomalieFilters)
    );
    filterLoading.value = true;
    const response = await api.get(
      `/v3/api/worker/anomalies/anomales-data/${
        company.loggedCompany.id
      }/?documents=${[...documents]}&industries=${[...industries]}&step=${
        limitedScreening.value
      }`
    );
    isSelectedDocFirstCall = false;
    if (isResetDocList) {
      selectedDocList.value = response.data.doc_options;
    }
    anomaliesData.value = response.data.data;
    anomaliesResponse.value = response.data.data;
    stats.value = response.data.stats;
    anomaliesOptions.value = response.data.doc_options;
    currentStatType.value = "all";
    router.push({ query: { ...route.query, page: 1 } });
    if (sessoionAnomalieFilters.currentStatType) {
      statChangeHandler(sessoionAnomalieFilters.currentStatType);
    }
    setloading.value = false;
    Loading.value = false;
    filterLoading.value = false;
  } catch (err) {
    console.log(err);
    setloading.value = false;
    Loading.value = false;
  }
};

const filteredData = computed(() => {
  let filteredProjects = anomaliesData.value;

  if (filters.value) {
    const filterRe = new RegExp(filters.value, "i");
    filteredProjects = filteredProjects.filter((item: any) => {
      const nameMatches = item.firstName && item.firstName.match(filterRe);
      const emailMatches = item.lastName && item.lastName.match(filterRe);
      return nameMatches || emailMatches;
    });
  }

  return filteredProjects;
});

const pagedData = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  return filteredData.value.slice(startIndex, endIndex);
});

const printCsv = () => {
  downloadCSV(
    anomaliesData.value,
    `Anomalies-document(${optionSelected.value}) type(${currentStatType.value})`,
    ["id", "profileImageURL", "industry", "postCode"]
  );
};

const correctStatType = ref({
  all: "All",
  expired: "Expired",
  date_missing: "Date Missing",
  not_uploaded: "Not Uploaded",
  expire_within_14_days: "Expire within 14 days",
});

const getAnomalyColor = (status: any) => {
  switch (status) {
    case "all":
      return "#0892A5";
    case "expired":
      return "#E54B4B";
    case "date_missing":
      return "#FF8E72";
    case "not_uploaded":
      return "#5887FF";
    default:
      return "#c449c2";
  }
};

const adjustPercentage = (notUploaded, total) => {
  let percentage = (notUploaded / total) * 100;

  if (percentage < 10) {
    return 10;
  } else if (percentage > 90) {
    return 90 - 10; // Subtract 10 from 90 to avoid going beyond 100%
  } else {
    return percentage;
  }
};

const showCard = (userId: any) => {
  showAnomaliesCard.value = true;
  selectedUserId.value = userId;
};

const hideCard = () => {
  showAnomaliesCard.value = false;
};

const debouncedGetAnomaliesData = debounce(() => {
  if (isSelectedDocFirstCall && sessoionAnomalieFilters.documents.length) {
    getAnomaliesData(false);
  } else {
    getAnomaliesData();
  }
}, 1000);

const debouncedChangeDocListGetAnomaliesData = debounce(() => {
  getAnomaliesData(false);
}, 1000);

watch(selectedDocList, (oldVal, newVal) => {
  if (anomaliesOptions.value.length == selectedDocList.value.length) {
    docAllNoneFilter.value = true;
    docAllNoneFilter.value = false;
  } else {
    docAllNoneFilter.value = "reset";
  }
  if (isSelectedDocFirstCall) {
    return;
  }
  if (
    selectedDocList.value.length &&
    anomaliesOptions.value.length != selectedDocList.value.length
  ) {
    debouncedChangeDocListGetAnomaliesData();
  }
});

const reselAllFilters = () => {
  sessionStorage.clear();
  limitedScreening.value = false;
  selectedDocList.value = [];
  selectedOptions.value = company.loggedCompany.industry;
  currentStatType.value = "all";
  getAnomaliesData();
  // statChangeHandler('all')
};

const docAllOrNoneChageHandler = () => {
  if (docAllNoneFilter.value == false) {
    getAnomaliesData(false, true);
  } else if (docAllNoneFilter.value == true) {
    selectedDocList.value = anomaliesOptions.value;
    getAnomaliesData();
  }
};

watch(selectedOptions, (oldVal, newVal) => {
  docAllNoneFilter.value = true;
  debouncedGetAnomaliesData();
});

onMounted(() => {
  statChangeHandler("all");
  Loading.value = true;
  sessoionAnomalieFilters = JSON.parse(
    window.sessionStorage.getItem(`anomalieFilters${company.loggedCompany.id}`)
  ) ?? {
    industry: [],
    documents: [],
    limitedScreening: false,
    currentStatType: "all",
  };
  console.log("sesssion value ", sessoionAnomalieFilters);
  if (sessoionAnomalieFilters.limitedScreening) {
    limitedScreening.value = true;
  }
  if (sessoionAnomalieFilters.documents) {
    console.log("inside documents list");
    selectedDocList.value = sessoionAnomalieFilters.documents;
  }
  if (sessoionAnomalieFilters.industry.length) {
    selectedOptions.value = sessoionAnomalieFilters.industry;
  } else {
    selectedOptions.value = company.loggedCompany.industry;
  }
});
</script>

<template>
  <div>
    <div class="project-description">
      <div class="tools-wrapper mt-2 p-5">
        <div style="position: relative" class="columns is-multilines">
          <!-- new of filter by industries -->
          <div
            class="column is-2 m-1"
            style="
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            "
          >
            <div class="p-2">
              <div>
                <div class="cus-align-center">
                  <h1 class="title is-5 toc-ignore mb-0">Filter industries</h1>
                  <i aria-hidden="true" class="fas fa-arrow-right light-text" />
                </div>
                <div
                  class="columns is-multiline mt-2"
                  style="display: flex; justify-content: space-between"
                >
                  <div class="industries p-2">
                    <VField
                      v-for="item in company.loggedCompany.industry"
                      :key="item.id"
                      class="is-flex m-1 cus-align-center"
                    >
                      <VLabel tabindex="0" class="tool-card cus-align-center">
                        <input
                          v-model="selectedOptions"
                          tabindex="-1"
                          type="checkbox"
                          :value="item"
                        />
                        <div class="tool-card-inner cus-align-center">
                          <img
                            style="
                              width: 20px;
                              background-color: #f2f2f2;
                              border-radius: 6px;
                            "
                            :src="item.industryLogo"
                          />
                          <span style="font-size: 13px; white-space: nowrap">{{
                            item.name
                          }}</span>
                          <VBlock center> </VBlock>
                        </div>
                      </VLabel>
                    </VField>
                  </div>
                </div>
              </div>
            </div>
            <div class="cus-align-center">
              <VIconButton
                style="width: 16px; height: 28px"
                color="warning"
                outlined
                :loading="filterLoading"
                circle
                icon="fas fa-atom"
              />
              <a
                @click="reselAllFilters"
                style="color: var(--warning); text-decoration: underline"
              >
                Reset filters
              </a>
            </div>
          </div>

          <!--new of filter by document  -->
          <div class="column is-2 m-1">
            <div class="p-2" style="max-height: 280px">
              <div class="cus-align-center">
                <h1 class="title is-5 toc-ignore mb-0">Anomalies Types</h1>
                <i aria-hidden="true" class="fas fa-arrow-right light-text" />
              </div>
              <div
                class="is-flex mt-2 ml-1 pb-0"
                style="gap: 12px; align-items: center; font-weight: 600"
              >
                <p
                  class="cu-pointer"
                  @click="
                    () => {
                      docAllNoneFilter = true;
                      docAllOrNoneChageHandler();
                    }
                  "
                  style="font-weight: 500; font-size: 12px; padding: 2px 11px"
                  :class="[docAllNoneFilter == true && 'active-filter-tab']"
                >
                  Select all
                </p>

                <p
                  class="cu-pointer"
                  @click="
                    () => {
                      docAllNoneFilter = false;
                      docAllOrNoneChageHandler();
                    }
                  "
                  :class="[docAllNoneFilter == false && 'active-filter-tab']"
                  style="font-size: 13px; font-weight: 500; padding: 2px 11px"
                >
                  Clear all
                </p>
              </div>

              <div
                class="account-wrapper cus-scrollbary cus-scrollbar"
                style="max-height: 240px"
              >
                <div class="column is-12">
                  <div
                    class="columns is-multiline pt-0"
                    style="display: flex; justify-content: space-between"
                  >
                    <div class="industries p-1">
                      <VField
                        v-for="doc in anomaliesOptions"
                        :key="doc.id"
                        class="is-flex cu-pointer mb-0"
                      >
                        <VLabel tabindex="0" class="tool-card cus-align-center">
                          <input
                            v-model="selectedDocList"
                            tabindex="-1"
                            type="checkbox"
                            :value="doc"
                          />
                          <div class="tool-card-inner cus-align-center">
                            <span
                              style="font-size: 13px; white-space: nowrap"
                              >{{
                                doc.documentTitle.length > 23
                                  ? `${doc.documentTitle.slice(0, 23)}...`
                                  : doc.documentTitle
                              }}</span
                            >
                            <VBlock center> </VBlock>
                          </div>
                        </VLabel>
                      </VField>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- new by anomalies stat -->
          <div class="column is-8">
            <div class="p-0">
              <div class="is-flex space-between">
                <div class="cus-align-center">
                  <h1 class="title is-5 toc-ignore mb-0"></h1>
                </div>
                <div class="cus-align-center">
                  <span style="color: var(--light-text)">Full screening</span>
                  <div id="" class="navbar-item is-theme-toggle">
                    <label class="theme-toggle">
                      <input
                        id="navbar-night-toggle--daynight"
                        v-model="limitedScreening"
                        @click="
                          () => {
                            limitedScreening = !limitedScreening;
                            getAnomaliesData();
                          }
                        "
                        data-cy="dark-mode-toggle"
                        type="checkbox"
                      />
                      <span class="toggler">
                        <span class="dark">
                          <i
                            class="iconify"
                            data-icon="feather:octagon"
                            aria-hidden="true"
                          ></i>
                        </span>
                        <span class="light">
                          <i
                            class="iconify"
                            data-icon="feather:minus-circle"
                            aria-hidden="true"
                          ></i>
                        </span>
                      </span>
                    </label>
                  </div>
                  <span style="color: var(--light-text)"
                    >Limited screening</span
                  >
                </div>
              </div>
              <div
                v-if="selectedDocList"
                class="is-info"
                style="
                  display: flex;
                  font-size: 11px;
                  flex-wrap: wrap;
                  gap: 5px;
                "
              >
                <div v-for="item in selectedDocList">
                  <VTag
                    style="font-weight: 500"
                    color="fade-info"
                    :label="item.documentTitle"
                    rounded
                  />
                </div>
              </div>

              <div style="" class="mt-4 is-flex">
                <div
                  class="cus-state-box cus-flex-column"
                  :class="currentStatType === 'all' ? 'active' : ''"
                  @click="statChangeHandler('all')"
                >
                  <div class="is-flex cus-align-center">
                    <div
                      class="circle-chart-wrapper is-primary"
                      style="color: #0892a5"
                      v-if="!Loading"
                    >
                      <CircleChart
                        :value="adjustPercentage(stats.all, stats.all)"
                        :size="40"
                      />
                    </div>
                    <div
                      v-else
                      class="circle-chart-wrapper is-primary"
                      style="color: #0892a5"
                    >
                      <CircleChart :value="30" :size="40" />
                    </div>
                    <h1 class="stat-heading" style="color: #0892a5">
                      {{ stats.all }}
                    </h1>
                  </div>
                  <div class="stat-content">
                    <p style="white-space: nowrap; color: #0892a5">All</p>
                  </div>
                </div>

                <div
                  class="cus-state-box cus-flex-column"
                  :class="currentStatType === 'not_uploaded' ? 'active' : ''"
                  @click="statChangeHandler('not_uploaded')"
                >
                  <div class="is-flex cus-align-center">
                    <div
                      class="circle-chart-wrapper is-info"
                      style="color: #5887ff"
                      v-if="!Loading"
                    >
                      <CircleChart
                        :value="adjustPercentage(stats.not_uploaded, stats.all)"
                        :size="40"
                      />
                    </div>
                    <div
                      v-else
                      class="circle-chart-wrapper is-info"
                      style="color: #5887ff"
                    >
                      <CircleChart :value="30" :size="40" />
                    </div>
                    <h1 class="stat-heading" style="color: #5887ff">
                      {{ stats.not_uploaded }}
                    </h1>
                  </div>
                  <div class="stat-content">
                    <p style="white-space: nowrap; color: #5887ff">
                      Not uploaded
                    </p>
                  </div>
                </div>

                <div
                  class="cus-state-box cus-flex-column"
                  :class="currentStatType === 'expired' ? 'active' : ''"
                  @click="statChangeHandler('expired')"
                >
                  <div class="is-flex cus-align-center">
                    <div
                      class="circle-chart-wrapper is-danger"
                      style="color: red"
                      v-if="!Loading"
                    >
                      <CircleChart
                        :value="adjustPercentage(stats.expired, stats.all)"
                        :size="40"
                      />
                    </div>
                    <div
                      v-else
                      class="circle-chart-wrapper is-danger"
                      style="color: #e54b4b"
                    >
                      <CircleChart :value="30" :size="40" />
                    </div>
                    <h1 class="stat-heading" style="color: #e54b4b">
                      {{ stats.expired }}
                    </h1>
                  </div>
                  <div class="stat-content">
                    <p style="white-space: nowrap; color: #e54b4b">Expired</p>
                  </div>
                </div>

                <div
                  class="cus-state-box cus-flex-column"
                  :class="
                    currentStatType === 'expire_within_14_days' ? 'active' : ''
                  "
                  @click="statChangeHandler('expire_within_14_days')"
                >
                  <div class="is-flex cus-align-center space-between">
                    <div
                      class="circle-chart-wrapper is-warning"
                      style="color: #ff8e72"
                      v-if="!Loading"
                    >
                      <CircleChart
                        :value="
                          adjustPercentage(
                            stats.expire_within_14_days,
                            stats.all
                          )
                        "
                        :size="40"
                      />
                    </div>
                    <div
                      v-else
                      class="circle-chart-wrapper is-warning"
                      style="color: #ff8e72"
                    >
                      <CircleChart :value="30" :size="40" />
                    </div>
                    <h1
                      class="stat-heading"
                      style="white-space: nowrap; color: #c449c2"
                    >
                      {{ stats.expire_within_14_days }}
                    </h1>
                  </div>
                  <div class="stat-content">
                    <p style="white-space: nowrap; color: #c449c2">
                      Expire in 14 days
                    </p>
                  </div>
                </div>

                <div
                  class="cus-state-box cus-flex-column"
                  :class="currentStatType === 'date_missing' ? 'active' : ''"
                  @click="statChangeHandler('date_missing')"
                >
                  <div class="is-flex cus-align-center">
                    <div class="circle-chart-wrapper is-danger" v-if="!Loading">
                      <CircleChart
                        :value="adjustPercentage(stats.date_missing, stats.all)"
                        :size="40"
                      />
                    </div>
                    <div v-else class="circle-chart-wrapper is-danger">
                      <CircleChart :value="30" :size="40" />
                    </div>
                    <h1
                      class="stat-heading"
                      style="white-space: nowrap; color: #ff8e72"
                    >
                      {{ stats.date_missing }}
                    </h1>
                  </div>
                  <div class="stat-content">
                    <p style="white-space: nowrap; color: #ff8e72">
                      Date missing
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex-list-wrapper flex-list-v2">
      <!--Active Tab-->
      <div class="tab-content is-active">
        <div style="display: flex; justify-content: space-between">
          <div class="cus-align-center ml-4">
            <h4 style="font-weight: 500" class="is-5 toc-ignore mb-0">
              Selected Industries ({{ selectedOptions.length }})
            </h4>
            <i aria-hidden="true" class="fas fa-arrow-right light-text" />

            <h4 style="font-weight: 500" class="is-5 toc-ignore mb-0">
              Selected Anomalies ({{ selectedDocList.length }})
            </h4>
            <i aria-hidden="true" class="fas fa-arrow-right light-text" />

            <h4 style="font-weight: 500" class="is-5 toc-ignore mb-0">
              {{ correctStatType[currentStatType] }} ({{
                stats[currentStatType]
              }})
            </h4>
          </div>
          <div class="is-flex">
            <VIconBox
              class="mr-4 cu-pointer"
              size="medium"
              @click="CurrentView = 'grid'"
              :color="[CurrentView == 'grid' ? 'primary' : '']"
            >
              <i class="lnil lnil-thumbnail" aria-hidden="true"></i>
            </VIconBox>
            <VIconBox
              class="mr-4 cu-pointer"
              size="medium"
              @click="CurrentView = 'list'"
              :color="[CurrentView == 'list' ? 'primary' : '']"
            >
              <i class="lnil lnil-list-alt" aria-hidden="true"></i>
            </VIconBox>
            <VField class="mr-5 cu-all-input">
              <VControl icon="feather:search">
                <input
                  v-model="filters"
                  class="input custom-text-filter"
                  placeholder="Search..."
                />
              </VControl>
            </VField>
            <VButton
              rounded
              color="purple"
              icon="lnir lnir-cloud-download"
              @click="printCsv"
              elevated
            >
              Download record</VButton
            >
          </div>
        </div>
        <div v-show="CurrentView == 'grid'">
          <PlaceloadV3 v-if="Loading" />
          <section v-else="pagedData.length">
            <div class="cu-card-container">
              <!-- Card 1 -->
              <div
                style="min-height: 18rem"
                class="cus-card"
                v-for="item in pagedData"
                :key="item.id"
              >
                <i
                  class="fas fa-expand-arrows-alt expand-icon"
                  @click="showCard(item.id)"
                  aria-hidden="true"
                  v-if="item.anomalies.length > 2"
                ></i>
                <img
                  class="user-image cu-pointer"
                  @click="
                    () => {
                      $router.push(`/sidebar/company/workers/${item.id}`);
                    }
                  "
                  :src="
                    item.profileImageURL
                      ? item.profileImageURL
                      : '/images/avatars/placeholder.jpg'
                  "
                  alt="User 1"
                />
                <div class="user-details content cu-pointer">
                  <h3
                    @click="
                      () => {
                        $router.push(`/sidebar/company/workers/${item.id}`);
                      }
                    "
                  >
                    {{ item.firstName }} {{ item.lastName }}
                  </h3>
                  <p class="title mb-1">{{ item.emailAddress }}</p>
                  <p class="title mb-1">{{ item.phoneNumber }}</p>
                  <p class="title mb-1">
                    {{ item.postCode ? item.postCode : "-----" }}
                  </p>
                </div>

                <ul
                  class="data-list"
                  v-for="(anomaly, index) in item.anomalies"
                  :key="anomaly.index"
                >
                  <li class="data-list-item" v-if="index < 2">
                    <span style="color: #999">
                      {{
                        anomaly.title.length > 18
                          ? `${anomaly.title.slice(0, 18)} ...`
                          : anomaly.title
                      }}
                    </span>
                    <VTag
                      style="color: #5a5a5a; font-weight: 500"
                      :style="{
                        backgroundColor: getAnomalyColor(anomaly.type) + '20',
                        color: getAnomalyColor(anomaly.type),
                      }"
                      :label="anomaly.status"
                      rounded
                    />
                  </li>
                </ul>

                <li
                  class="data-list-item mt-4"
                  v-if="item.anomalies.length - 2 > 0"
                >
                  <span></span>
                  <VTag
                    color="light"
                    style="font-weight: 500; cursor: pointer"
                    @click="showCard(item.id)"
                    :label="`${item.anomalies.length - 2} more anomalies`"
                    rounded
                  />
                </li>

                <div
                  v-if="showAnomaliesCard && selectedUserId === item.id"
                  class="dropdown-card p-5"
                >
                  <i
                    class="lnir lnir-close close-icon"
                    @click="hideCard()"
                    aria-hidden="true"
                  ></i>
                  <div class="is-flex mb-4 border-bottom-light">
                    <img
                      class="user-image"
                      :src="
                        item.profileImageURL
                          ? item.profileImageURL
                          : '/images/avatars/placeholder.jpg'
                      "
                      alt="User 1"
                    />
                    <div class="user-details">
                      <p class="is-md-bold mb-1">
                        {{ item.firstName }} {{ item.lastName }}
                      </p>
                      <p>{{ item.emailAddress }}</p>
                    </div>
                  </div>
                  <ul
                    class="data-list"
                    v-for="(anomaly, index) in item.anomalies"
                    :key="anomaly.index"
                  >
                    <li class="data-list-item">
                      <span style="color: #999">
                        {{
                          anomaly.title.length > 18
                            ? `${anomaly.title.slice(0, 18)} ...`
                            : anomaly.title
                        }}
                      </span>
                      <VTag
                        style="color: #5a5a5a; font-weight: 500"
                        :style="{
                          backgroundColor: getAnomalyColor(anomaly.type) + '20',
                          color: getAnomalyColor(anomaly.type),
                        }"
                        :label="anomaly.status"
                        rounded
                      />
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div v-show="CurrentView == 'list'">
          <PlaceloadV1 v-if="Loading" />
          <VFlexTable :data="pagedData" :columns="columns" rounded>
            <template #body>
              <TransitionGroup name="list" tag="div" class="flex-list-inner">
                <!--Table item-->
                <div
                  v-for="item in pagedData"
                  :key="item.id"
                  class="flex-table-item cus-scrollbar"
                  style="cursor: pointer"
                  :style="{
                    background: `linear-gradient(to right, ${getAnomalyColor(
                      currentStatType
                    )}22 10.1%,${getAnomalyColor(
                      currentStatType
                    )}18 40.1%, ${getAnomalyColor(currentStatType)}8 90.1%)`,
                  }"
                  @click="
                    router.push({
                      name: '/sidebar/company/workers/[id]',
                      params: { id: item.id },
                    })
                  "
                >
                  <VFlexTableCell :column="{ media: true, align: 'start' }">
                    <!-- worker profile meta -->
                    <VAvatar
                      size="medium"
                      :picture="
                        item.profileImageURL
                          ? item.profileImageURL
                          : '/images/avatars/placeholder.jpg'
                      "
                    />
                    <div class="user-meta">
                      <span
                        class="item-name dark-inverted"
                        style="margin-bottom: 6px !important"
                        >{{ item.firstName }} {{ item.lastName }}</span
                      >
                      <span class="item-meta">
                        <span class="cus-dark-text">
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
                        <span class="cus-dark-text">
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
                        <span class="cus-dark-text">
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
                  <!-- sia exp -->
                  <VFlexTableCell :column="{ align: 'start', grow: true }">
                    <div
                      class="m-3"
                      v-for="(anomaly, index) in item.anomalies"
                      :key="anomaly.index"
                    >
                      <p
                        style="
                          font-size: 13px;
                          font-color: #242424;
                          font-weight: 500;
                        "
                      >
                        {{ anomaly.title.slice(0, 14) }}
                        <span
                          ><img
                            style="width: 18px; height: 18px"
                            :src="
                              anomaly.approved
                                ? '/images/iconapprove.png'
                                : '/images/disapproved.png'
                            "
                        /></span>
                      </p>
                      <VTag
                        style="color: #5a5a5a; font-weight: 400"
                        :style="{
                          backgroundColor: getAnomalyColor(anomaly.type) + '20',
                          color: getAnomalyColor(anomaly.type),
                        }"
                        :label="anomaly.status"
                        rounded
                      />
                    </div>
                  </VFlexTableCell>
                </div>
              </TransitionGroup>
            </template>
          </VFlexTable>
        </div>
      </div>

      <VFlexPagination
        v-if="anomaliesData.length > itemsPerPage"
        :item-per-page="itemsPerPage"
        v-model="currentPage"
        :total-items="anomaliesData.length"
        :current-page="currentPage"
        :max-links-displayed="maxLinksDisplayed"
      />
      <VPlaceholderPage
        v-if="tab === 'active' && anomaliesData.length === 0"
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
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "/@src/scss/abstracts/all";

#cus-toggler {
  position: relative;
  display: block;
  height: 31px;
  width: 53px;
  border: 2px solid var(--info);
  border-radius: 100px;
  transition:
    color 0.3s,
    background-color 0.3s,
    border-color 0.3s,
    height 0.3s,
    width 0.3s;
}

#cus-toggle-center {
  width: 100% !important;
  display: flex !important;
  justify-content: center !important;
}

.active-filter-tab {
  background-color: var(--primary);
  color: white;

  font-weight: 400;
  border-radius: 10px;
}

.is-dark {
  .dropdown-card {
    border: solid 1px #6d6d6d;
    background-color: var(--dark-sidebar-light-2);
  }
}

.dropdown-card {
  width: 300px;
  position: absolute;
  right: 15%;
  top: 0;
  background-color: var(--white);
  border: 1px solid #ccc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 10px;
  border-radius: 8px;
  z-index: 1;
}

.dropdown-card button {
  display: block;
  width: 100%;
  padding: 8px;
  margin-bottom: 8px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.dropdown-card button:hover {
  background-color: #0056b3;
}

.anomalies-heading {
  font-size: 19px;
  font-weight: 500;
  color: #333;
}

.drop-div {
  width: 12px;
  height: 2px;
  margin: 16px 289px 16px 0;
  border-radius: 2px;
  background-color: #ccc;
}

.activeTab {
  border-bottom: 2px solid var(--primary);
}

.inactiveTab {
  border-bottom: 1px solid #a2a2a2;
}

.cus-dark-color {
  color: #5d5d5d;
}

.cu-card-container {
  display: flex;
  flex-wrap: wrap;

  padding: 6px;
}

.is-dark {
  .cus-card {
    border: solid 1px #6d6d6d;
    background-color: var(--dark-sidebar-light-2);
  }
}

.cus-card {
  position: relative;
  width: 23%;
  margin: 12px;
  padding: 15px 16px 16px;
  border-radius: 32px;
  border: solid 1px #ebebeb;
  background-color: var(--white);

  .expand-icon {
    position: absolute;
    top: 20px;
    right: 20px;
    color: #ebebeb;
    font-size: 20px;
    cursor: pointer;
  }
}

.close-icon {
  position: absolute;
  top: 12px;
  right: 12px;
  color: #ebebeb;
  font-size: 20px;
  cursor: pointer;
}

.user-image {
  width: 43px;
  height: 43px;
  margin: 0 18px 12px 0;
  border-radius: 16px;
  object-fit: cover;
  margin-bottom: 10px;
}

.user-details {
  margin-bottom: 10px;

  h3 {
    font-size: 15px;
  }

  p {
    font-size: 12px;
  }
}

.data-list {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
}

.data-list-item {
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 500;
  color: #666;
}

.cus-state-box {
  cursor: pointer;
  display: flex;
  position: relative;
  gap: 12px;
  align-items: center;
  border-radius: 24px;
  padding: 12px 22px;
  margin: 12px;

  &:nth-child(1) {
    background-color: #e3f3f3;
  }

  &:nth-child(2) {
    background-color: #5887ff30;
  }

  &:nth-child(3) {
    background-color: #e54b4b30;
  }

  &:nth-child(4) {
    background-color: #c449c230;
  }

  &:nth-child(5) {
    background-color: #ff8e7230;
  }

  &.active {
    &::before {
      content: "";
      background-color: var(--primary);
      position: absolute;
      height: 4px;
      width: 80%;
      border-radius: 8px;
      left: 10%;
      top: -10px;
      bottom: 10px;
      z-index: 1;
    }
  }

  .stat-content {
    p {
      font-size: 13px;
      font-weight: 500;
    }

    h1 {
      width: min-content;
      font-size: 26px;
      font-weight: 500;
    }
  }
}

.stat-heading {
  width: min-content;
  font-size: 26px;
  font-weight: 500;
}

.buttons {
  width: 100%;
  display: flex !important;
  flex-direction: column !important;
  justify-content: space-between !important;
}

.attractive-button {
  display: inline-block;
  border: none;
  color: var(--light-text);
  padding: 8px 10px;
  text-align: left;
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-bottom: 12px;
  border-bottom: 2px solid #898;

  &.active {
    color: var(--primary);
    border-bottom: 2px solid var(--primary);
  }
}

.tools-wrapper {
  margin: 0 auto;

  .tool-card {
    position: relative;

    input {
      position: absolute;
      top: 0;
      inset-inline-start: 0;
      height: 100%;
      width: 100%;
      opacity: 0;
      cursor: pointer;

      &:checked + .tool-card-inner {
        color: var(--primary);
        font-weight: 500;

        .flex-end {
          .checkmark {
            display: flex;
            opacity: 1;
          }
        }
      }
    }

    .tool-card-inner {
      padding: 2px;
      background: transparent;
      border-radius: 10px;
      color: #999;

      .media-flex-center {
        .flex-end {
          .checkmark {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 12px;
            width: 12px;
            border: 1px solid var(--fade-grey-dark-3);
            border-radius: var(--radius-rounded);
            box-shadow: var(--light-box-shadow);
            opacity: 0;
            color: var(--primary);
            transition:
              color 0.3s,
              background-color 0.3s,
              border-color 0.3s,
              height 0.3s,
              width 0.3s;

            svg {
              height: 14px;
              width: 14px;
              stroke-width: 3px;
            }
          }
        }
      }
    }
  }
}

.account-wrapper {
  padding-bottom: 0px;

  .account-box {
    padding: 3px;
    border-radius: 6px;
    margin-bottom: 10px;

    &.is-navigation {
      .media-flex-center {
        padding-bottom: 2px;

        .flex-meta {
          span {
            &:first-child {
              font-size: 1.3rem;
            }
          }
        }
      }

      .account-menu {
        .account-menu-item {
          display: flex;
          align-items: center;
          padding: 4px;
          width: 100%;
          border: 1px solid transparent;
          border-radius: 8px;
          margin-bottom: 0px;
          transition: all 0.3s; // transition-all test

          &.router-link-exact-active {
            box-shadow: var(--light-box-shadow);
            border-color: var(--fade-grey-dark-3);

            span,
            i {
              color: var(--primary);
            }

            .end {
              display: block;
            }
          }

          &:not(.router-link-exact-active) {
            &:hover {
              background: var(--fade-grey-light-3);
            }
          }

          i {
            margin-inline-end: 8px;
            font-size: 1.1rem;
            color: var(--light-text);

            &.fas,
            .fal,
            .far {
              font-size: 0.9rem;
            }
          }

          span {
            font-family: var(--font-alt);
            font-size: 0.95rem;
            color: var(--dark-text);
          }

          .end {
            margin-inline-start: auto;
            display: none;
          }
        }
      }
    }

    &.is-form {
      padding: 0;

      &.is-footerless {
        padding-bottom: 20px;
      }

      .form-head,
      .form-foot {
        padding: 12px 20px;

        .form-head-inner,
        .form-foot-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      }

      .form-head {
        border-bottom: 1px solid var(--fade-grey-dark-3);
        transition: all 0.3s; // transition-all test

        &.is-stuck {
          background: var(--white);
          padding-inline-end: 80px;
          border-inline-start: 1px solid var(--fade-grey-dark-3);
        }

        .left {
          h3 {
            font-family: var(--font-alt);
            font-size: 1.2rem;
            line-height: 1.3;
          }

          p {
            font-size: 0.95rem;
          }
        }
      }

      .form-foot {
        border-top: 1px solid var(--fade-grey-dark-3);
      }

      .form-body {
        padding: 20px;

        .fieldset {
          padding: 20px 0;
          max-width: 480px;
          margin: 0 auto;

          .fieldset-heading {
            margin-bottom: 20px;

            h4 {
              font-family: var(--font-alt);
              font-weight: 600;
              font-size: 1rem;
            }

            p {
              font-size: 0.9rem;
            }
          }

          .v-avatar {
            position: relative;
            display: block;
            margin: 0 auto;

            .edit-button {
              position: absolute;
              bottom: 0;
              inset-inline-end: 0;
            }
          }

          .setting-list {
            .setting-form {
              text-align: center;

              .filepond-profile-wrap {
                margin: 0 auto 10px !important;
              }
            }

            .setting-item {
              display: flex;
              align-items: center;
              margin-bottom: 24px;

              .icon-wrap {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 50px;
                min-width: 50px;
                height: 50px;
                border-radius: var(--radius-rounded);
                background: var(--fade-grey-light-2);
                border: 1px solid var(--fade-grey-dark-3);
                color: var(--light-text);

                &.has-img {
                  border-color: var(--primary);

                  img {
                    width: 36px;
                    min-width: 36px;
                    height: 36px;
                  }
                }

                i {
                  font-size: 1.4rem;
                }
              }

              img {
                display: block;
                width: 50px;
                min-width: 50px;
                height: 50px;
                border-radius: var(--radius-rounded);
                border: 1px solid transparent;
              }

              .meta {
                margin-inline-start: 10px;

                > span {
                  font-family: var(--font);
                  display: block;

                  &:first-child {
                    font-family: var(--font-alt);
                    font-weight: 600;
                    color: var(--dark-text);
                    font-size: 0.9rem;
                  }

                  &:nth-child(2),
                  &:nth-child(3) {
                    font-size: 0.85rem;
                    color: var(--light-text);

                    i {
                      position: relative;
                      top: -2px;
                      font-size: 4px;
                      margin: 0 6px;
                    }
                  }

                  &:nth-child(3) {
                    color: var(--primary);
                  }

                  span {
                    display: inline-block;
                  }
                }
              }

              .end {
                margin-inline-start: auto;
              }
            }
          }
        }
      }
    }
  }
}

.is-dark {
  .account-wrapper {
    .account-box {
      &.is-navigation {
        .account-menu {
          .account-menu-item {
            &.router-link-exact-active {
              background: var(--dark-sidebar-light-8);
              border-color: var(--dark-sidebar-light-12);

              i,
              span {
                color: var(--primary);
              }
            }

            &:not(.router-link-exact-active) {
              &:hover {
                background: var(--dark-sidebar-light-10);
              }
            }

            span {
              color: var(--dark-dark-text);
            }
          }
        }
      }

      &.is-form {
        .form-head,
        .form-foot {
          border-color: var(--dark-sidebar-light-12);
        }

        .form-head {
          &.is-stuck {
            background: var(--dark-sidebar);
            border-color: var(--dark-sidebar-light-6);
          }

          .left {
            h3 {
              color: var(--dark-dark-text);
            }
          }
        }

        .form-body {
          .fieldset {
            .fieldset-heading {
              h4 {
                color: var(--dark-dark-text);
              }
            }

            .setting-list {
              .setting-item {
                > img,
                > .icon-wrap,
                > .icon-wrap img {
                  border-color: var(--dark-sidebar-light-12);
                }

                > .icon-wrap {
                  background: var(--dark-sidebar-light-2);
                }

                .meta {
                  > span {
                    &:nth-child(3) {
                      color: var(--primary);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

.button-image {
  height: 22px;
  width: 20px;
  display: inline-block;
  vertical-align: middle;
  margin-right: 10px;
}

.button-image img {
  width: 16px;
  height: auto;
}

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

.navbar-item {
  &.is-theme-toggle {
    opacity: 1;
    pointer-events: all;
  }

  .nav-link {
    position: relative;
    font-family: var(--font-alt);
    font-size: 0.9rem;
    color: var(--light-text);
    text-transform: capitalize;

    &::before {
      content: "";
      position: absolute;
      top: -4px;
      inset-inline-start: 2px;
      width: 50%;
      transform-origin: right center;
      height: 3px;
      border-radius: 50px;
      background: var(--primary);
      transform: scale(0, 1);
      transition: -webkit-transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      transition:
        transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
        -webkit-transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    // Hover state
    &:hover,
    &.is-active {
      color: var(--dark-text);

      &::before {
        transform-origin: left center;
        transform: scale(1, 1);
      }
    }

    &.active {
      &::before {
        background: var(--primary);
      }
    }
  }

  .theme-toggle {
    width: 43px;
    display: block;
    position: relative;
    cursor: pointer;
    font-size: 22px;
    user-select: none;
    transform: scale(0.9);

    &:focus-within {
      border-radius: 50px;
      outline-offset: var(--accessibility-focus-outline-offset);
      outline-width: var(--accessibility-focus-outline-width);
      outline-style: var(--accessibility-focus-outline-style);
      outline-color: var(--accessibility-focus-outline-color);
    }

    input {
      position: absolute;
      opacity: 0;
      cursor: pointer;

      &:checked ~ .toggler {
        border-color: var(--warning);

        .dark,
        .light {
          transform: translateX(calc(var(--transform-direction) * 100%))
            rotate(360deg);
        }

        .dark {
          opacity: 1 !important;
        }

        .light {
          opacity: 0 !important;
        }
      }
    }

    .toggler {
      position: relative;
      display: block;
      height: 24px;
      width: 44px;
      border: 2px solid var(--primary);
      border-radius: 100px;
      transition:
        color 0.3s,
        background-color 0.3s,
        border-color 0.3s,
        height 0.3s,
        width 0.3s;

      .dark,
      .light {
        position: absolute;
        top: 1px;
        inset-inline-start: 2px;
        height: 18px;
        width: 18px;
        border-radius: var(--radius-rounded);
        background: black;
        display: flex;
        justify-content: center;
        align-items: center;
        transform: translateX(calc(var(--transform-direction) * 0))
          rotate(calc(var(--transform-direction) * 0));
        transition: all 0.3s ease;

        svg {
          color: var(--white) !important;
          height: 12px !important;
          width: 12px !important;
          opacity: 1 !important;
        }
      }

      .light {
        background: var(--primary);
        border-color: var(--primary);
        opacity: 1;
        z-index: 1;
      }

      .dark {
        background: var(--warning);
        border-color: var(--warning);
        opacity: 0;
        z-index: 0;

        svg {
          color: var(--white) !important;
        }
      }
    }
  }

  .button {
    font-weight: 400 !important;
    height: 44px;
    min-width: 110px;
  }
}
</style>
