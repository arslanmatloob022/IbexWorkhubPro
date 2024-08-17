<script setup lang="ts">
import { ref } from "vue";
import { useCompany } from "/@src/stores/company";
import { useNotyf } from "/@src/composable/useNotyf";
import { useApi } from "/@src/composable/useAPI";
import CusLargModal from "/@src/components/supportComponents/CusLargModal.vue";
import { useViewWrapper } from "/@src/stores/viewWrapper";
const viewWrapper = useViewWrapper();

const api = useApi();
export interface BusinessProfileData {
  id: number;
  supplierName: string;
  supplierEmailAddress: string;
  registrationNumber: string;
  contactPerson: string;

  postCode: string;
  supplierPhoneNumber: "";
  VATExist: false;
  color: "#49DFDC";
  partnerLogo: string;
  contactEmail: string;
  address: string;
  latitude: 0.0;
  longitude: 0.0;
}

let map = <any>{};
let supplierCircleMap = <any>{};
const mapLoading = ref(false);
const route = useRoute();
const router = useRouter();
const company = useCompany();
const notyf = useNotyf();
const Loading = ref(false);
const itemsPerPage = ref(8);
const maxLinksDisplayed = ref(3);
const filters = ref("");
const createNewBusinessModal = ref(false);
const editBusinessModal = ref(false);
const EditSupplierID = ref<any>("");
const currentSelectedID = ref(0);
const OpenCusLargModal = ref(false);
const supplierLength = ref(0);
const openActionVerificationModal = ref(false);
let title = "Service Partners";

const projects: BusinessProfileData[] = [];
const columns = {
  registrationNumber: "Partner",
  email: {
    label: "Reg#",
    align: "center",
  },
  location: {
    label: "Location",
    align: "center",
  },
  actions: {
    label: "Actions",
    align: "end",
  },
} as const;

const getAllSuppliers = async () => {
  Loading.value = true;
  projects.length = 0;
  const resp = await api.get(
    `/v3/api/supplier/get_company_suppliers/${
      company.loggedCompany.id
    }/?industry=${
      route.query.type
        ? route.query.type !== "All"
          ? route.query.type
          : ""
        : ""
    }`
  );
  projects.push(...(resp.data as BusinessProfileData[]));
  supplierLength.value = resp.data.length;
  filters.value = "value";
  filters.value = "";
  Loading.value = false;
  drawmap(projects);
  viewWrapper.setPageTitle(`Service Partners (${supplierLength?.value}) `);
};

const filteredData = computed(() => {
  let filteredProjects = projects;

  if (filters.value) {
    const filterRe = new RegExp(filters.value, "i");

    filteredProjects = projects.filter((item) => {
      const nameMatches =
        item.supplierName && item.supplierName.match(filterRe);
      const emailMatches =
        item.supplierEmailAddress && item.supplierEmailAddress.match(filterRe);
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

const currentPage = computed(() => {
  let index: any = route.query.page as string;
  if (index == undefined || index == "undefined") {
    index = 1;
  } else {
    index = route.query.page as string;
  }
  return Number.parseInt(route.query.page as string) || 1;
});

const openCustomLargModal = (id: number = 0) => {
  EditSupplierID.value = id;
  OpenCusLargModal.value = true;
};

const OpenDeleteSweetAlert = (id: number) => {
  currentSelectedID.value = id;
  openActionVerificationModal.value = true;
};

const DeleteSupplierHandler = async () => {
  try {
    const response = await api.delete(
      `/v3/api/supplier/${currentSelectedID.value}/`,
      {}
    );
    getAllSuppliers();
    notyf.dismissAll();
    notyf.success("Supplier Delete");
    company.loadSuppliers(company.loggedCompany.id);
  } catch (error) {
    console.error("ok", error);
  }
};

const handleUpdateSupplierModalOpen = (value: boolean) => {
  createNewBusinessModal.value = value;
  editBusinessModal.value = value;
};
function increaseStrokeOpacityById(itemId: any) {
  const specificSupplierCircle = supplierCircleMap[itemId];
  if (specificSupplierCircle) {
    specificSupplierCircle.setOptions({ strokeOpacity: 0.3 }); // Adjust the desired opacity
    specificSupplierCircle.setOptions({ strokeWeight: 50 });
    for (const id in supplierCircleMap) {
      if (id != itemId) {
        const otherSupplierCircle = supplierCircleMap[id];
        if (otherSupplierCircle) {
          otherSupplierCircle.setOptions({ strokeOpacity: 0.1 });
          otherSupplierCircle.setOptions({ strokeWeight: 20 });
        }
      }
    }
  }
}

function resetMap() {
  map.setZoom(6);
  for (const id in supplierCircleMap) {
    const otherSupplierCircle = supplierCircleMap[id];
    if (otherSupplierCircle) {
      otherSupplierCircle.setOptions({ strokeOpacity: 0.1 });
      otherSupplierCircle.setOptions({ strokeWeight: 20 });
    }
  }
}
const mapFocus = (item: any) => {
  if (!item.latitude) return;
  map.panTo({ lat: item.latitude, lng: item.longitude });
  map.setZoom(8);
  increaseStrokeOpacityById(item.id);
};
function drawmap(suppliers: any = projects) {
  let center = { lat: 51.4497984, lng: -0.3464489 };
  map = new google.maps.Map(document.getElementById("myMap"), {
    center: center,
    scrollwheel: false,
    mapTypeId: google.maps.MapTypeId.Satellite,
    zoom: 6,
  });
  suppliers.forEach((item: any, index: any) => {
    let defaultStrokeWeight = 20;
    let defaultStrokeOpacity = 0.1;
    if (!item.latitude) return;
    const supplierCircle = new google.maps.Circle({
      strokeColor: item.color,
      strokeOpacity: defaultStrokeOpacity,
      strokeWeight: defaultStrokeWeight,
      fillColor: item.color,
      fillOpacity: 0.7,
      map,
      center: { lat: item.latitude, lng: item.longitude },
      radius: 10000 * 1.63,
    });
    supplierCircleMap[item.id] = supplierCircle;
  });

  mapLoading.value = false;
}

watch(
  () => route.query.type,
  async (newFullPath, oldFullPath) => {
    if (route.query.type) {
      title = `Partners: ${route.query.type}`;
    }
    getAllSuppliers();
    viewWrapper.setPageTitle(title);
  }
);
if (route.query.type) {
  title = `(${route.query.type})`;
}
viewWrapper.setPageTitle(title);

onMounted(() => {
  getAllSuppliers();
});
</script>

<template>
  <div>
    <div class="columns mt-5">
      <div class="column is-7">
        <div>
          <div class="list-flex-toolbar mb-5" style="justify-content: end">
            <VControl icon="feather:search">
              <input
                v-model="filters"
                class="input custom-text-filter"
                placeholder="Search..."
              />
            </VControl>

            <VButton
              @click="openCustomLargModal()"
              class="ml-2"
              color="primary"
              icon="fas fa-plus"
              elevated
            >
              New Partner
            </VButton>
          </div>

          <div class="flex-list-wrapper flex-list-v2 mt-5">
            <!--Active Tab-->
            <PlaceloadV1 v-if="Loading" />
            <VFlexTable
              v-if="pagedData.length"
              :data="pagedData"
              :columns="columns"
              rounded
            >
              <template #body>
                <TransitionGroup name="list" tag="div" class="flex-list-inner">
                  <div
                    v-for="(item, index) in pagedData"
                    :key="item.id"
                    :style="{
                      backgroundImage: `linear-gradient(-175deg, white 60%, ${item.color}30)`,
                    }"
                    class="flex-table-item mt-1"
                    @mouseleave="resetMap()"
                    @mouseover="() => mapFocus(item)"
                  >
                    <VFlexTableCell
                      :column="{ media: true }"
                      @click="
                        router.push({
                          path: `/sidebar/company/supplier/${item.id}`,
                          params: { id: item.id },
                        })
                      "
                    >
                      <VAvatar
                        size="medium"
                        :picture="
                          item.partnerLogo
                            ? item.partnerLogo
                            : '/images/avatars/placeholder.jpg'
                        "
                      />
                      <div class="user-meta">
                        <span
                          class="item-name dark-inverted"
                          style="margin-bottom: 6px !important"
                        >
                          {{ item.supplierName }}</span
                        >

                        <span class="item-meta">
                          <span>
                            <i
                              style="width: 10px"
                              class="iconify"
                              data-icon="feather:phone"
                              aria-hidden="true"
                            ></i>
                            {{ item.supplierPhoneNumber }}</span
                          >
                        </span>

                        <span class="item-meta">
                          <span class="light-text">
                            <i
                              class="lnir lnir-control-panel"
                              aria-hidden="true"
                            ></i>
                            {{
                              item.contactEmail
                                ? item.contactEmail.slice(0, 12) + ".."
                                : "------"
                            }}</span
                          >
                        </span>
                      </div>
                    </VFlexTableCell>

                    <VFlexTableCell :column="{ align: 'center' }">
                      <span class="light-text">{{
                        item.registrationNumber
                          ? item.registrationNumber.slice(0, 20)
                          : "-------"
                      }}</span>
                    </VFlexTableCell>
                    <VFlexTableCell>
                      <div
                        class="light-text is-flex is-pointer"
                        style="
                          position: relative;
                          align-items: end;
                          cursor: pointer;
                        "
                      >
                        <div>
                          <i
                            class="me-2 fa fa-map-marker mr-3"
                            :style="{ color: item.color, fontSize: '30px' }"
                          ></i>
                          <span class="ml-3">
                            {{ item.postCode ? item.postCode : "------" }}</span
                          ><br />
                          <span class="light-text ml-6">
                            {{
                              item.address ? item.address.slice(0, 20) : " "
                            }}</span
                          >
                        </div>
                      </div>
                    </VFlexTableCell>
                    <VFlexTableCell :column="{ align: 'end' }">
                      <VDropdown
                        style="position: relative"
                        class="is-pushed-mobile"
                        icon="feather:more-vertical"
                        spaced
                        right
                      >
                        <template #content>
                          <RouterLink
                            role="menuitem"
                            href="#"
                            class="dropdown-item is-media"
                            :to="{
                              name: '/sidebar/company/supplier/[id]',
                              params: { id: item.id },
                            }"
                          >
                            <div class="icon">
                              <i
                                aria-hidden="true"
                                class="lnil lnil-briefcase"
                              />
                            </div>
                            <div class="meta">
                              <span>View</span>
                              <span>View supplier details</span>
                            </div>
                          </RouterLink>

                          <a
                            role="menuitem"
                            href="#"
                            class="dropdown-item is-media"
                            @click="openCustomLargModal(item.id)"
                          >
                            <div class="icon">
                              <i aria-hidden="true" class="lnil lnil-pencil" />
                            </div>
                            <div class="meta">
                              <span>Edit</span>
                              <span>Edit supplier details</span>
                            </div>
                          </a>

                          <hr class="dropdown-divider" />

                          <a
                            role="menuitem"
                            href="#"
                            class="dropdown-item is-media"
                            @click="OpenDeleteSweetAlert(item.id)"
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
                  </div>
                </TransitionGroup>
              </template>
            </VFlexTable>
            <VPlaceholderPage
              v-else
              title="No service partners found."
              subtitle="It seems that you haven't connected with any service partners yet. As you begin to finalize projects, they will be displayed here."
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

            <!--Table Pagination-->
            <VFlexPagination
              v-if="filteredData.length > itemsPerPage"
              :item-per-page="itemsPerPage"
              v-model="currentPage"
              :total-items="filteredData.length"
              :current-page="currentPage"
              :max-links-displayed="maxLinksDisplayed"
            />
          </div>
        </div>
      </div>
      <div class="column is-5 mt-8 is-base-chart is-dark-bordered-12">
        <div class="content-box">
          <h1 class="title is-5">Coverage Area</h1>
          <div
            id="myMap"
            style="height: 550px; width: 550px; border-radius: 10px"
          ></div>
        </div>
      </div>
    </div>

    <!--  edit / create new supplier -->
    <CusLargModal
      v-if="OpenCusLargModal"
      :id="EditSupplierID"
      :OpenCusLargModal="OpenCusLargModal"
      @update:cusModalHandler="(value: boolean) => (OpenCusLargModal = value)"
      @update:OnSuccess="getAllSuppliers"
    ></CusLargModal>

    <!--Create New Business-->
    <AddSupplier
      v-if="createNewBusinessModal"
      :createNewBusinessModal="createNewBusinessModal"
      @update:modalHandler="handleUpdateSupplierModalOpen"
      @update:OnSuccess="getAllSuppliers"
    />

    <ActionsVerificationModal
      :actionVerificationModal="openActionVerificationModal"
      message="Your are going to delete this Partner permanently, and if you do so you will not be able to recover this partner again."
      captionText="delete this partner"
      btn-text="Delete"
      @update:OnSuccess="DeleteSupplierHandler"
      @update:modal-handler="openActionVerificationModal = false"
    />
  </div>
</template>

<style lang="scss" scoped>
.flex-table-cell {
  cursor: pointer;
  flex: none;
  display: flex;
  justify-content: left;

  &:nth-child(1) {
    width: 35% !important;
  }

  &:nth-child(2) {
    width: 25% !important;
  }

  &:nth-child(3) {
    width: 25% !important;
  }

  &:nth-child(4) {
    width: 15% !important;
    display: flex;
    justify-content: end;
  }
}

.is-navbar {
  .datatable-toolbar {
    padding-top: 30px;
  }
}

.datatable-toolbar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  &.is-reversed {
    flex-direction: row-reverse;
  }

  .field {
    margin-bottom: 0;

    .control {
      .button {
        color: var(--light-text);

        &:hover,
        &:focus {
          background: var(--primary);
          border-color: var(--primary);
          color: var(--primary--color-invert);
        }
      }
    }
  }

  .buttons {
    margin-left: auto;
    margin-bottom: 0;

    .v-button {
      margin-bottom: 0;
    }
  }
}

.is-dark {
  .datatable-toolbar {
    .field {
      .control {
        .button {
          background: var(--dark-sidebar) !important;
          color: var(--light-text);

          &:hover,
          &:focus {
            background: var(--primary) !important;
            border-color: var(--primary) !important;
            color: var(--smoke-white) !important;
          }
        }
      }
    }
  }
}

.datatable-wrapper {
  width: 100%;

  .datatable-container {
    background: var(--white);
    border: none !important;
    overflow-x: auto;

    .table,
    table {
      width: 100%;
    }

    &::-webkit-scrollbar {
      height: 8px !important;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 10px !important;
      background: rgb(0 0 0 / 20%) !important;
    }
  }
}

.datatable-table {
  border: 1px solid var(--fade-grey);
  border-collapse: collapse;
  border-radius: 0.75rem;

  th {
    padding: 16px 20px;
    font-family: var(--font-alt);
    font-size: 0.8rem;
    color: var(--dark-text);
    text-transform: uppercase;
    border: 1px solid var(--fade-grey);
    font-weight: 600;

    &:last-child {
      text-align: right;
    }
  }

  td {
    font-family: var(--font);
    vertical-align: middle;
    padding: 12px 20px;
    border-bottom: 1px solid var(--fade-grey);

    &:last-child {
      text-align: right;
    }

    &.datatables-empty {
      opacity: 0;
    }
  }

  .light-text {
    color: var(--light-text);
  }

  .flex-media {
    display: flex;
    align-items: center;

    .meta {
      margin-left: 10px;
      line-height: 1.3;

      span {
        display: block;
        font-size: 0.8rem;
        color: var(--light-text);
        font-family: var(--font);

        &:first-child {
          font-family: var(--font-alt);
          color: var(--dark-text);
        }
      }
    }
  }

  .row-action {
    display: flex;
    justify-content: flex-end;
  }

  .checkbox {
    padding: 0;
  }

  .product-photo {
    width: 80px;
    height: 80px;
    object-fit: contain;
  }

  .file-icon {
    width: 46px;
    height: 46px;
    object-fit: contain;
  }

  .drinks-icon {
    display: block;
    max-width: 48px;
    border-radius: var(--radius-rounded);
    border: 1px solid var(--fade-grey);
  }

  .negative-icon,
  .positive-icon {
    svg {
      height: 16px;
      width: 16px;
    }
  }

  .positive-icon {
    .iconify {
      color: var(--success);

      * {
        stroke-width: 4px;
      }
    }
  }

  .negative-icon {
    &.is-danger {
      .iconify {
        color: var(--danger) !important;
      }
    }

    .iconify {
      color: var(--light-text);

      * {
        stroke-width: 4px;
      }
    }
  }

  .price {
    color: var(--dark-text);
    font-weight: 500;

    &::before {
      content: "$";
    }

    &.price-free {
      color: var(--light-text);
    }
  }

  .status {
    display: flex;
    align-items: center;

    &.is-available {
      i {
        color: var(--success);
      }
    }

    &.is-busy {
      i {
        color: var(--danger);
      }
    }

    &.is-offline {
      i {
        color: var(--light-text);
      }
    }

    i {
      margin-right: 8px;
      font-size: 8px;
    }

    span {
      font-family: var(--font);
      font-size: 0.9rem;
      color: var(--light-text);
    }
  }
}

.is-dark {
  .datatable-wrapper {
    .datatable-container {
      border-color: var(--dark-sidebar-light-12);
      background: var(--dark-sidebar-light-6);
    }
  }

  .datatable-table {
    border-color: var(--dark-sidebar-light-12);

    th,
    td {
      border-color: var(--dark-sidebar-light-12);
      color: var(--dark-dark-text);
    }

    .drinks-icon {
      border-color: var(--dark-sidebar-light-12);
    }
  }
}
</style>
