<script setup lang="ts">
import { ref } from "vue";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";

// --------------->
const api = useApi();
const route = useRoute();
const notyf = useNotyf();
const openCustomCompany = ref(false);
const EditSiteID = ref<any>("");
const siteId = ref<any>("");
const contractLength = ref(0);
const currentSelectedID = ref(0);
const openAddSiteModal = ref(false);
const getSingleSite = ref([]);
const loading = ref(false);
const siteID = ref<any>("");
const companyID = ref("");
const tab = ref<"listview" | "mapview">("listview");
const SweetAlertProps = ref({
  title: "",
  subtitle: "test",
  isSweetAlertOpen: false,
  btntext: "text",
});

const SweetAlertPropsDelete = ref({
  title: "",
  subtitle: "test",
  isSweetAlertOpen: false,
  btntext: "text",
});

const props = defineProps({
  contractId: {
    type: String,
  },
  getContract: Function,
  colors: String,
});

export interface ContractData {
  id: string;
  sites: object;
  charge_rate: number;
  total_hours: string;
  start_date: string;
  end_date: string;
  name: string;
  incharge_name: string;
  incharge_phone: string;
  incharge_email: string;
  color: string;
  over_rate: number;
  description: string;
  company: string;
  customer_company: string;
}

// <ContractData[]>

const FormData = ref<ContractData[]>([
  {
    id: "",
    sites: [],
    charge_rate: 0,
    total_hours: "",
    name: "",
    start_date: "",
    end_date: "",
    incharge_name: "",
    incharge_phone: "",
    incharge_email: "",
    color: "",
    over_rate: 0,
    description: "",
    company: "",
    customer_company: "",
  },
]);

const siteData = ref({
  id: null,
  name: "",
  address: "",
  postcode: "",
  latitude: null,
  longitude: null,
  city: "",
  inchargeName: "",
  inchargePhoneNo: "",
  inchargeEmail: "",
  comments: "",
  geofence: {},
});

let selectSlotOptions: any = ref([]);

// --------Open Custom Large Model----->
const openSiteDetailModal = (id: number = 0) => {
  EditSiteID.value = id;
  openAddSiteModal.value = true;
};

// Get All Contracts
const getSites = async () => {
  siteID.value = "";
  loading.value = true;
  console.log(props.contractId);
  const resp = await api.get(`/v3/api/site/contract/${props.contractId}/`);
  FormData.value = resp.data;
  console.log("All Sites:", resp.data);
  companyID.value = resp.data.customer_company;
  contractLength.value = resp.data.sites.length;
  loading.value = false;
  console.log("Sites List:", FormData.value);
  console.log("Contract Id :", companyID.value);
};

// Delete Contract
const OpenDeleteSweetAlert = (id: number) => {
  currentSelectedID.value = id;
  SweetAlertPropsDelete.value = {
    title: "Are you sure?",
    subtitle: "You will not be able to recover this site!",
    btntext: "Yes, Delete it",
    isSweetAlertOpen: true,
  };
};

const DeleteWorkerHandler = async () => {
  try {
    loading.value = true;
    SweetAlertPropsDelete.value.isSweetAlertOpen = false;
    const response = await api.delete(
      `/v3/api/site/${currentSelectedID.value}/`
    );
    getSites();
    notyf.dismissAll();
    notyf.success("Site Delete");
    loading.value = false;
  } catch (error) {
    console.error("ok", error);
    loading.value = false;
  }
};

// Get All Sites
// const getAllSites = async () => {
//   loading.value = true;
//   const resp = await api.get(`/v3/api/site/`);
//   siteData.value = resp.data;
//   loading.value = false;

//   selectSlotOptions.value = resp.data.map((item) => {
//     return {
//       value: item.id.toString(),
//       name: item.name,
//     };
//   });

//   console.log("Name:", selectSlotOptions);
//   console.log("Sites list:", siteData.value);
// };

onMounted(() => {
  getSites();
  // getAllSites();
});

const OpenSweetAlert = (id: any) => {
  siteId.value = id;
  SweetAlertProps.value = {
    title: "Are you sure?",
    subtitle: "Do you want to add this site?",
    btntext: "Yes, add it",
    isSweetAlertOpen: true,
  };
};

// Function to handle multiselect click
const handleSelectSite = async () => {
  SweetAlertProps.value.isSweetAlertOpen = false;
  try {
    const { data } = await api.post(`/v3/api/contract/assign-site/`, {
      contract: props.contractId,
      site: siteId.value,
    });
    if (data) {
      getSites();
      notyf.success("Site added");
    }
  } catch (error) {
    console.log(error);
    notyf.error("This Site is already assigned.");
  }
};

// Add Site Modal
const toggleAddSiteModal = () => {
  openAddSiteModal.value = !openAddSiteModal.value;
};
</script>

<!-- Template -->
<template>
  <div class="contract-wrapper">
    <div class="contract-wrapper" v-if="!siteID">
      <!-- -----------------Header------------- -->
      <div class="contract-header">
        <div class="header-left" style="display: flex; flex-direction: column">
          <!--  -->
          <div
            :style="{
              backgroundImage: `linear-gradient(-175deg, white 65%, ${FormData.color}30)`,
            }"
            style="
              display: flex;
              flex-direction: column;
              padding: 1rem;
              border-radius: 1rem;

              border: 1px solid #eee;
            "
          >
            <span
              style="
                font-size: 1.1rem;
                font-weight: 500;
                color: #111;
                margin-top: 1rem;
                display: flex;
                align-items: center;
              "
            >
              <VButton
                color="primary"
                outlined
                class="mr-2"
                @click="props.getContract"
                style="width: 3rem; border-radius: 12px; padding: 2px 4px"
              >
                <i
                  class="iconify"
                  data-icon="feather:arrow-left"
                  aria-hidden="true"
                  style="font-size: 1.5rem"
                ></i>
              </VButton>
              Contract_{{ props.contractId }}</span
            >
            <h1 style="font-size: 1.7rem; font-weight: 500; color: #111">
              {{ FormData.name }}
            </h1>
            <div
              class=""
              style="display: flex; align-items: center; gap: 0.6rem"
            >
              <span style="font-size: 1.1rem; font-weight: 500; color: #333"
                >Total Sites:
                <span style="font-size: 1rem; font-weight: 400; color: #333">{{
                  contractLength < 10 && contractLength > 0
                    ? "0" + contractLength
                    : contractLength
                }}</span>
              </span>
              <span
                class=""
                style="width: 2px; height: 1rem; background: #ccc"
              ></span>
              <span style="font-size: 1.1rem; font-weight: 500; color: #333"
                >Slots Available:
                <span style="font-size: 1rem; font-weight: 400; color: #333"
                  >0/15</span
                >
              </span>
              <span
                class=""
                style="width: 2px; height: 1rem; background: #ccc"
              ></span>
              <span style="font-size: 1.1rem; font-weight: 500; color: #333"
                >Contact Person:
                <span style="font-size: 1rem; font-weight: 400; color: #333">{{
                  FormData.incharge_name
                }}</span></span
              >
            </div>
          </div>
          <!--  -->
        </div>
        <div
          class="header-right"
          style="
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-top: 6rem;
          "
        >
          <!-----------Search Site--------->
          <!-- <div class="">
          <VField
            v-slot="{ id }"
            class="is-autocomplete-select"
            style="width: 15rem; cursor: pointer"
          >
            <VControl icon="feather:search">
              <Multiselect
                v-model="getSingleSite"
                :attrs="{ id }"
                :options="selectSlotOptions"
                placeholder="Assign a Site"
                :searchable="true"
                style="cursor: pointer; color:#111;"
                @change="OpenSweetAlert"
                track-by="name"
              >
              <template #option="{ option }" @click="()=>OpenSweetAlert(option.value)">
                    {{ option.name }}
              </template>
            </Multiselect>
            </VControl>
          </VField>
        </div> -->

          <VButton
            color="primary"
            style="
              border-radius: 1.5rem;
              display: flex;
              align-items: center;
              gap: 0.5rem;
            "
            @click="
              () => {
                EditSiteID = '';
                toggleAddSiteModal();
              }
            "
          >
            <i class="iconify" data-icon="feather:plus" aria-hidden="true"></i>
            Add New Site
          </VButton>
        </div>
      </div>

      <!-- -----------------Content Details------------- -->
      <div
        class=""
        style="
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 1rem;
        "
      >
        <div class="tabs-inner">
          <div class="tabs is-toggle">
            <ul>
              <li :class="[tab === 'listview' ? 'is-active' : 'not-active']">
                <a
                  tabindex="0"
                  role="button"
                  @keydown.space.prevent="tab = 'listview'"
                  @click="tab = 'listview'"
                  ><span>List View</span></a
                >
              </li>
              <li :class="[tab === 'mapview' ? 'is-active' : 'not-active']">
                <a
                  tabindex="0"
                  role="button"
                  @keydown.space.prevent="tab = 'mapview'"
                  @click="tab = 'mapview'"
                  ><span>Map View</span></a
                >
              </li>
            </ul>
          </div>
        </div>

        <!----------List View----------->
        <div class="contracts-section1" v-show="tab == 'listview'">
          <PlaceloadV3 v-if="loading" />
          <div
            class="contracts-section"
            v-for="(item, index) in FormData.sites"
            :key="item.id"
          >
            <div
              class="contracts-list"
              :style="{
                backgroundImage: `linear-gradient(-175deg, white 40%, ${item.color}45)`,
              }"
            >
              <div
                class=""
                style="
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  justify-content: space-between;
                "
              >
                <span
                  style="
                    font-size: 1rem;
                    font-weight: 400;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #333;
                  "
                  ><i class="fas fa-map-marker-alt" aria-hidden="true"></i
                  >{{ item.postcode }}</span
                >
                <VDropdown
                  style="position: relative"
                  class="is-pushed-mobile"
                  icon="feather:more-vertical"
                  spaced
                  right
                >
                  <template #content>
                    <a
                      role="menuitem"
                      href="#"
                      class="dropdown-item is-media"
                      @click="openSiteDetailModal(item.id)"
                    >
                      <div class="icon">
                        <i aria-hidden="true" class="lnil lnil-pencil" />
                      </div>
                      <div class="meta">
                        <span>Edit</span>
                        <span>Edit site details</span>
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
                        <i aria-hidden="true" class="lnil lnil-trash-can-alt" />
                      </div>
                      <div class="meta">
                        <span>Delete</span>
                        <span>Delete from list</span>
                      </div>
                    </a>
                  </template>
                </VDropdown>
              </div>
              <div
                class=""
                style="display: flex; flex-direction: column; gap: 0.5rem"
                @click="siteID = item.id"
              >
                <div
                  class=""
                  style="
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 0.6rem;
                  "
                >
                  <span
                    class="Genevieve-Hodges-Copy"
                    style="
                      font-size: 13px;
                      margin-top: 0.5rem;
                      font-weight: 500;
                      color: #333;
                    "
                  >
                    {{ item.name }}
                  </span>
                </div>

                <div
                  class=""
                  style="
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                  "
                >
                  <span
                    class="-Euston-Road-Lond"
                    style="font-size: 13px; font-weight: 400; color: #666"
                    >{{ item.address }}</span
                  >
                </div>
                <div
                  style="
                    font-size: 1rem;
                    font-weight: 400;
                    display: flex;
                    align-items: center;
                    gap: 0.2rem;
                  "
                >
                  <b style="font-weight: 500; color: #222">City:</b
                  ><span style="color: #333">{{ item.city }}</span>
                </div>
                <div
                  style="
                    font-size: 1rem;
                    font-weight: 400;
                    display: flex;
                    align-items: center;
                    gap: 0.2rem;
                  "
                >
                  <b style="font-weight: 500; color: #222">Site Manager Name:</b
                  ><span style="color: #333">{{ item.inchargeName }}</span>
                </div>
              </div>
            </div>
          </div>
          <!-- Place Holder -->
          <VPlaceholderPage
            v-if="FormData.sites && FormData.sites.length === 0"
            title="No Sites is added for this Contract."
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
          <!--  -->
        </div>

        <!-- ---------Map View--------- -->
        <!-- v-if="companyID" -->
        <div class="contracts-section1" v-if="tab == 'mapview'">
          <SiteMapLocation :sites="FormData.sites" :companyId="companyID" />
        </div>

        <!-- Delete Sites-->
        <SweetAlert
          v-if="SweetAlertPropsDelete.isSweetAlertOpen"
          :isSweetAlertOpen="SweetAlertPropsDelete.isSweetAlertOpen"
          :title="SweetAlertPropsDelete.title"
          :subtitle="SweetAlertPropsDelete.subtitle"
          :btntext="SweetAlertPropsDelete.btntext"
          :onConfirm="DeleteWorkerHandler"
          :onCancel="() => (SweetAlertPropsDelete.isSweetAlertOpen = false)"
        />

        <!-- Add Site Confirmation -->
        <SweetAlert
          v-if="SweetAlertProps.isSweetAlertOpen"
          :isSweetAlertOpen="SweetAlertProps.isSweetAlertOpen"
          :title="SweetAlertProps.title"
          :subtitle="SweetAlertProps.subtitle"
          :btntext="SweetAlertProps.btntext"
          :onConfirm="handleSelectSite"
          :onCancel="() => (SweetAlertProps.isSweetAlertOpen = false)"
        />
      </div>
    </div>
    <!-- ---------------------SiteJob------------- -->
    <div class="contract-wrapper" v-if="siteID">
      <SiteJobs
        :getSites="getSites"
        :siteID="siteID"
        :editSiteModal="openSiteDetailModal"
        :siteLength="contractLength"
      />
    </div>
    <!-- -------------------Contract Model-------------- -->
    <!-- Edit Company Model (ContractModal) -->

    <SiteDetailModal
      v-if="openAddSiteModal"
      :contractId="props.contractId"
      :EditSiteID="EditSiteID"
      @update:modalHandler="
        () => {
          openAddSiteModal = !openAddSiteModal;
        }
      "
      :AddSiteModalOpen="openAddSiteModal"
      @update:OnSuccess="getSites"
    />
  </div>
</template>

<!-- Styling -->
<style lang="scss" scoped>
.contract-wrapper {
  width: 100%;
}
.contract-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.contracts-section1 {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding-bottom: 3rem;
}
.contracts-section {
  grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
  grid-gap: 1rem;
  margin-top: 1rem;
}
.contracts-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  border-radius: 1rem;
  background: #fff;
  padding: 1.5rem 1rem;
  box-shadow: 0.1rem 0.1rem 0.1rem rgba(0, 0, 0, 0.1);
  transition: 0.2s ease-in-out;

  min-width: 22rem;
  border: 1px solid #eee;
  cursor: pointer;
  min-height: 14rem;
}
.contracts-list:hover {
  box-shadow: 0.2rem 0.2rem 0.2rem rgba(0, 0, 0, 0.3);
  transform: scale(1.01);
}
.contracts-list:active {
  box-shadow: 0.1rem 0.1rem 0.1rem rgba(0, 0, 0, 0.1);
  transform: scale(1);
}
.contract-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.1rem;
  border-radius: 0.5rem;
  background: #ccc;
  cursor: pointer;
}
</style>
