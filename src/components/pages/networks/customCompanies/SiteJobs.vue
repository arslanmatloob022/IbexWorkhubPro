<script setup lang="ts">
import { ref } from "vue";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";

// --------------->
const api = useApi();
const notyf = useNotyf();
const EditSiteID = ref<any>("");
const siteId = ref<any>("");
const currentSelectedID = ref(0);
const openSiteJobModel = ref(false);
const loading = ref(false);
const editSiteId = ref<any>("");
const openAddSiteModal = ref(false);
const tab = ref<"jobs" | "siteRota" | "timeSheet" | "siteDetails">(
  "siteDetails"
);
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
  siteID: {
    type: String,
  },
  getSites: Function,
  editSiteModal: Function,
  isShow: Number,
  siteLength: Number,
});

// ----------Edit Site--------->
const editSiteDetailModal = (id: any) => {
  editSiteId.value = id;
  openAddSiteModal.value = true;
};

const FormData = ref({
  id: "",
  jobsCount: 0,
  name: "",
  inchargeName: "",
  color: "",
  postcode: "",
  contractInfo: <any>{},
  jobs: [],
});

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

// --------Open Custom Large Model----->
const openSiteDetailModal = (id: number = 0) => {
  EditSiteID.value = id;
  openSiteJobModel.value = true;
};

// Get All Jobs
const getSites = async () => {
  loading.value = true;
  console.log(props.siteID);
  const resp = await api.get(`/v3/api/jobs/site/${props.siteID}/`);
  FormData.value = resp.data;
  console.log("Job Data:", resp.data);
  loading.value = false;
};

// Delete Contract
const OpenDeleteSweetAlert = (id: number) => {
  currentSelectedID.value = id;
  SweetAlertPropsDelete.value = {
    title: "Are you sure?",
    subtitle: "You will not be able to recover this job!",
    btntext: "Yes, Delete it",
    isSweetAlertOpen: true,
  };
};

const DeleteWorkerHandler = async () => {
  try {
    loading.value = true;
    SweetAlertPropsDelete.value.isSweetAlertOpen = false;
    const response = await api.delete(
      `/v3/api/jobs/${currentSelectedID.value}/`
    );
    getSites();
    notyf.dismissAll();
    notyf.success("Job Delete");
    loading.value = false;
  } catch (error) {
    console.error("ok", error);
    loading.value = false;
  }
};

// Edit Site
const handleEditSite = (id: any) => {
  if (props.editSiteModal) {
    props.editSiteModal(id);
  }
};

onMounted(() => {
  getSites();
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

// Add Site Modal
const toggleAddSiteModal = () => {
  openSiteJobModel.value = !openSiteJobModel.value;
};

watchEffect(() => {
  getSites();
});
</script>

<!-- Template -->
<template>
  <div class="contract-wrapper">
    <!-- -----------------Header------------- -->
    <div class="contract-header" style="position: relative">
      <!-- Left -->
      <div
        class="header-left"
        style="display: flex; flex-direction: column; position: relative"
      >
        <div class="is-flex">
          <div
            class=""
            style="
              padding: 1rem 1rem;
              border-radius: 1rem;
              margin-top: 1rem;
              border: 1px solid #eee;
            "
            :style="{
              backgroundImage: `linear-gradient(-175deg, white 65%, ${FormData?.contractInfo?.color}30)`,
            }"
          >
            <span
              style="
                font-size: 1.1rem;
                font-weight: 500;
                color: #111;
                display: flex;
                align-items: center;
              "
            >
              <VButton
                color="primary"
                outlined
                class="mr-1"
                @click="props.getSites"
                style="width: 3rem; border-radius: 12px; padding: 2px 4px"
                v-if="isShow !== 1"
              >
                <i
                  class="iconify"
                  data-icon="feather:arrow-left"
                  aria-hidden="true"
                  style="font-size: 1.5rem"
                ></i>
              </VButton>
              Contract_00{{ FormData.contractInfo.id }}</span
            >
            <h1 style="font-size: 1.7rem; font-weight: 500; color: #111">
              {{ FormData?.contractInfo?.name }}
            </h1>
            <div
              class=""
              style="display: flex; align-items: center; gap: 0.6rem"
            >
              <span style="font-size: 1.1rem; font-weight: 500; color: #333"
                >Total Sites:
                <span style="font-size: 1rem; font-weight: 400; color: #333">{{
                  props?.siteLength < 10 && props.siteLength > 0
                    ? "0" + props.siteLength
                    : props.siteLength
                }}</span>
              </span>
              <span
                class=""
                style="width: 2px; height: 1rem; background: #ccc"
              ></span>
              <span style="font-size: 1.1rem; font-weight: 500; color: #333"
                >Assigned Jobs:
                <span style="font-size: 1rem; font-weight: 400; color: #333"
                  >00</span
                >
              </span>
              <span
                class=""
                style="width: 2px; height: 1rem; background: #ccc"
              ></span>
              <span style="font-size: 1.1rem; font-weight: 500; color: #333"
                >Unassigned Jobs:
                <span style="font-size: 1rem; font-weight: 400; color: #333"
                  >00</span
                ></span
              >
            </div>
          </div>

          <div class="" style="position: absolute; bottom: 3rem; left: 31rem">
            <!-- <img
              src="/arrow3x.png"
              alt="arrow"
              style="width: 32px; height: 36px; rotate: 360deg"
            /> -->
          </div>
          <!-- Site Details -->
          <div
            class=""
            style="
              margin-top: 3.6rem;
              display: flex;
              flex-direction: column;
              gap: 1rem;
              margin-top: 2.2rem;
              padding-left: 2.5rem;
              position: relative;
            "
          >
            <div
              class=""
              style="
                display: flex;
                flex-direction: column;
                gap: 0rem;
                padding: 1rem;
                border-radius: 0.8rem;
                min-width: 19rem;
                max-width: 27rem;
                border: 1px solid #eee;
              "
              :style="{
                backgroundImage: `linear-gradient(to bottom left, white 75%, ${FormData?.color}50)`,
              }"
            >
              <label
                style="
                  font-size: 1.2rem;
                  font-weight: 500;
                  margin-bottom: 0.5rem;
                  color: #333;
                "
                >Site_00{{ FormData?.id }}
              </label>

              <span class="" style="color: #333">
                Site: {{ FormData?.postcode }}</span
              >
              <span
                class=""
                style="font-size: 1.5rem; font-weight: 500; color: #333"
              >
                {{ FormData?.name }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right  -->
    </div>
    <!-- ------------------H_2---------------- -->

    <!-- ------------------Buttons----------------- -->
    <div
      class="tabs-wrapper rounded"
      type="rounded"
      style="padding-left: 2.5rem"
    >
      <div class="contract-header" style="margin-top: 2rem">
        <div class="header-left">
          <div class="tabs-inner">
            <div class="tabs is-toggle">
              <ul>
                <li
                  :class="[tab === 'siteDetails' ? 'is-active' : 'not-active']"
                >
                  <a
                    tabindex="0"
                    role="button"
                    @keydown.space.prevent="tab = 'siteDetails'"
                    @click="tab = 'siteDetails'"
                    ><span style="">Site Details</span></a
                  >
                </li>
                <li :class="[tab === 'jobs' ? 'is-active' : 'not-active']">
                  <a
                    tabindex="0"
                    role="button"
                    @keydown.space.prevent="tab = 'jobs'"
                    @click="tab = 'jobs'"
                    ><span>Placements</span></a
                  >
                </li>
                <li :class="[tab === 'siteRota' ? 'is-active' : 'not-active']">
                  <a
                    tabindex="0"
                    role="button"
                    @keydown.space.prevent="tab = 'siteRota'"
                    @click="tab = 'siteRota'"
                    ><span>Site Rota</span></a
                  >
                </li>
                <li :class="[tab === 'timeSheet' ? 'is-active' : 'not-active']">
                  <a
                    tabindex="0"
                    role="button"
                    @keydown.space.prevent="tab = 'timeSheet'"
                    @click="tab = 'timeSheet'"
                    ><span>Time Sheet</span></a
                  >
                </li>
              </ul>
            </div>
          </div>
        </div>
        <!-- Right Add Button -->
        <!--  -->
      </div>

      <!------------------------------------Section 1 (Contact Info)------------------------------------  -->

      <div class="" style="margin-top: 1.5rem" v-show="tab == 'jobs'">
        <div class="contracts-section1">
          <!-- -------------Add Jobs------ -->
          <div
            class="contracts-list"
            style="
              background: #e3f3f3;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-direction: column;
              grid-area: 0.5rem;
              height: 13.5rem;
            "
            @click="
              () => {
                EditSiteID = '';
                toggleAddSiteModal();
              }
            "
          >
            <div
              style="
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                grid-area: 0.5rem;
              "
            >
              <i
                class="iconify"
                data-icon="feather:plus"
                aria-hidden="true"
                style="font-size: 2.5rem; color: #179e9b"
              ></i>
              <span
                style="
                  font-size: 1.4rem;
                  font-weight: 500;
                  display: flex;
                  align-items: center;
                  gap: 0.5rem;
                  color: #179e9b;
                "
              >
                Create New Placements at
              </span>
              <span
                style="
                  font-size: 1.1rem;
                  font-weight: 400;
                  display: flex;
                  text-align: center;
                  align-items: center;
                  gap: 0.5rem;
                  color: #179e9b;
                  max-width: 90%;
                "
              >
                {{ FormData?.site?.address }}
              </span>
            </div>
          </div>

          <!------------Jobs List--------------  -->
          <PlaceloadV3 v-if="loading" />
          <div
            class="contracts-section"
            v-for="(item, index) in FormData.jobs"
            :key="item.id"
            style="margin-top: 0rem"
          >
            <div
              class="contracts-list"
              :style="{
                backgroundImage: `linear-gradient(-175deg, white 40%, ${item?.color}45)`,
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
                    text-transform: capitalize;
                    gap: 0.5rem;
                    color: #333;
                  "
                >
                  <i
                    class="iconify"
                    data-icon="feather:clock"
                    aria-hidden="true"
                    style="color: #179e9b"
                  ></i>
                  {{ item?.jobType }}
                </span>
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
              >
                <span
                  class="Genevieve-Hodges-Copy"
                  style="
                    font-size: 1.4rem;
                    margin-top: 0.5rem;
                    font-weight: 500;
                    color: #333;
                  "
                  >{{ item?.jobName }}</span
                >
                <div
                  class=""
                  style="
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    color: #333;
                  "
                >
                  <span
                    class="-Euston-Road-Lond"
                    style="font-size: 13px; font-weight: 400; color: #666"
                    >From: {{ item?.startDate }}
                    {{ item?.endDate ? `- To:` : "" }} {{ item?.endDate }}</span
                  >
                </div>
                <!--  -->
                <div
                  class=""
                  style="
                    display: flex;
                    align-items: center;
                    gap: 0.6rem;
                    margin-top: 1rem;
                    color: #333;
                  "
                >
                  <span style="font-size: 1.1rem; font-weight: 400"
                    >4 Assigned
                  </span>
                  <span
                    class=""
                    style="width: 2px; height: 1rem; background: #ccc"
                  ></span>
                  <span
                    style="
                      font-size: 1.1rem;
                      font-weight: 400;
                      text-transform: capitalize;
                      color: #333;
                    "
                    >{{ item?.shift }} Shift
                  </span>
                  <span
                    class=""
                    style="width: 2px; height: 1rem; background: #ccc"
                  ></span>
                  <span style="font-size: 1.1rem; font-weight: 400; color: #333"
                    >Rate: £{{ item?.hourlyRate }} per hour
                  </span>
                </div>
              </div>
              <!--  -->
            </div>
          </div>

          <!--  -->
        </div>
      </div>

      <!-- ---------------- Section 2 (Business Details)------------ -->
      <div class="" style="margin-top: 3.5rem" v-if="tab == 'siteRota'">
        <div
          class=" "
          style="display: flex; flex-direction: column; gap: 2.5rem"
        >
          <div class="" style="display: flex; align-items: center; gap: 4rem">
            <RotaView :siteID="props.siteID" />
          </div>
        </div>
      </div>

      <!-- ---------------- Section 3 (Location Details)------------ -->
      <div class="" style="margin-top: 0.5rem" v-show="tab == 'timeSheet'">
        <div
          class=" "
          style="display: flex; flex-direction: column; gap: 2.5rem"
        >
          <h1>Time Sheet</h1>
        </div>
      </div>

      <!-- -----------------Section 4 (Site Details)------------ -->
      <div class="" style="margin-top: 1.5rem" v-show="tab == 'siteDetails'">
        <SiteDetails :EditSiteID="props.siteID" />
      </div>
    </div>

    <!-- -------------------Jobs Model-------------- -->
    <AddJobModal
      v-if="openSiteJobModel"
      :id="EditSiteID"
      :siteID="props.siteID"
      :openSiteJobModel="openSiteJobModel"
      @update:modalHandler="
        (value: boolean) => ((openSiteJobModel = value), getSites())
      "
    ></AddJobModal>

    <!-- -------------------Edit Site Model----------- -->
    <SiteDetailModal
      v-if="openAddSiteModal"
      :contractId="FormData.contract.id"
      :EditSiteID="editSiteId"
      @update:modalHandler="
        () => {
          openAddSiteModal = !openAddSiteModal;
        }
      "
      :AddSiteModalOpen="openAddSiteModal"
      @update:OnSuccess="getSites"
    />

    <!-- Delete Jobs-->
    <SweetAlert
      v-if="SweetAlertPropsDelete.isSweetAlertOpen"
      :isSweetAlertOpen="SweetAlertPropsDelete.isSweetAlertOpen"
      :title="SweetAlertPropsDelete.title"
      :subtitle="SweetAlertPropsDelete.subtitle"
      :btntext="SweetAlertPropsDelete.btntext"
      :onConfirm="DeleteWorkerHandler"
      :onCancel="() => (SweetAlertPropsDelete.isSweetAlertOpen = false)"
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
  padding-bottom: 4rem;
}
.contracts-section {
  grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
  grid-gap: 1.5rem;
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
  max-width: 27rem;
  min-width: 22rem;
  border: 1px solid #eee;
  cursor: pointer;
  min-height: 11rem;
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

.site-details {
  display: flex;
  justify-content: space-between;
  gap: 3rem;
  min-width: 30rem;
  min-height: 16rem;
  padding: 1rem 1rem;
  gap: 1rem;
  background-color: white;
  box-shadow: 0.2rem 0.2rem 0.1rem rgba(0, 0, 0, 0.2);
  border: 1px solid #eee;
  border-radius: 1.5rem;
  margin-top: 6rem;
}
</style>
