<script setup lang="ts">
import { ref } from "vue";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { jobs } from "/@src/data/dashboards/jobs";

// --------------->
const api = useApi();
const route = useRoute();
const notyf = useNotyf();
const openAddSiteModal = ref(false);

const props = defineProps({
  EditSiteID: {
    type: String,
  },
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
  created_at: "2024-05-07T12:17:14.267313Z",
  updated_at: "2024-05-09T11:17:59.556648Z",
  color: "#D875C7",
  regionFormat: "Large North",
  areaManager: "",
  managingDirector: "Jonathan Taylor",
  contract: 0,
  jobs: [],
  contractInfo: {
    id: 0,
    name: " ",
    company: 0,
    customer_company: 0,
    incharge_name: "",
    color: "",
    charge_rate: 0.0,
    cuCompanyInfo: {
      id: 0,
      name: "",
      email: "",
      logo: "",
      phone_number: "",
    },
  },
});

const getEditSite = async () => {
  const resp = await api.get(`/v3/api/site/${props.EditSiteID}/`);
  siteData.value = resp.data;
};

const handleEditModal = () => {
  openAddSiteModal.value = true;
};

onMounted(() => {
  if (props.EditSiteID) {
    getEditSite();
  }
});
</script>

<template>
  <div
    style="display: flex; align-items: start; justify-content: space-between"
  >
    <!-- Content -->
    <div
      class="site-content"
      style="display: flex; flex-direction: column; gap: 2rem"
    >
      <span
        style="
          font-size: 1.4rem;
          margin-left: 2rem;
          color: #23ad8d;
          cursor: pointer;
          position: absolute;
          right: 50%;
        "
        @click="handleEditModal"
      >
        <i
          class="iconify"
          data-icon="feather:edit"
          aria-hidden="true"
          style="
            font-size: 1.4rem;
            margin-left: 2rem;
            color: #23ad8d;
            cursor: pointer;
            position: absolute;
            right: 50%;
          "
        ></i>
      </span>
      <div class="" style="display: flex; align-items: center; gap: 0.3rem">
        <label style="font-size: 1.2rem; font-weight: 500">Site Name:</label>
        <span style="font-weight: 400; font-size: 1.1rem">
          {{ siteData?.name }}
        </span>
      </div>
      <div class="" style="display: flex; align-items: center; gap: 0.3rem">
        <label style="font-size: 1.2rem; font-weight: 500">Site Address:</label>
        <span style="font-weight: 400; font-size: 1.1rem">
          {{ siteData?.address }}
        </span>
      </div>
      <div class="" style="display: flex; align-items: center; gap: 0.3rem">
        <label style="font-size: 1.2rem; font-weight: 500">Post Code:</label>
        <span style="font-weight: 400; font-size: 1.1rem">
          {{ siteData?.postcode }}</span
        >
      </div>
      <div class="" style="display: flex; align-items: center; gap: 0.3rem">
        <label style="font-size: 1.2rem; font-weight: 500"
          >Site Incharge:</label
        >
        <span style="font-weight: 400; font-size: 1.1rem">
          {{
            siteData.contractInfo?.incharge_name
              ? siteData.contractInfo?.incharge_name
              : "Not mentioned"
          }}</span
        >
      </div>
      <div class="" style="display: flex; align-items: center; gap: 0.3rem">
        <label style="font-size: 1.2rem; font-weight: 500"
          >Contact Person:</label
        >
        <span style="font-weight: 400; font-size: 1.1rem">
          {{
            siteData?.inchargeName ? siteData?.inchargeName : "Not Mentioned"
          }}</span
        >
      </div>
      <div class="" style="display: flex; align-items: center; gap: 0.3rem">
        <label style="font-size: 1.2rem; font-weight: 500"
          >Contact Phone:</label
        >
        <span style="font-weight: 400; font-size: 1.1rem">
          {{ siteData?.inchargePhoneNo }}</span
        >
      </div>
      <div class="" style="display: flex; align-items: center; gap: 0.3rem">
        <label style="font-size: 1.2rem; font-weight: 500">City:</label>
        <span style="font-weight: 400; font-size: 1.1rem">
          {{ siteData?.city }}</span
        >
      </div>
      <div class="" style="display: flex; align-items: center; gap: 0.3rem">
        <label style="font-size: 1.2rem; font-weight: 500">Email:</label>
        <span style="font-weight: 400; font-size: 1.1rem">
          {{ siteData?.inchargeEmail ? siteData?.inchargeEmail : " N/A" }}</span
        >
      </div>
      <div
        class=""
        style="display: flex; flex-direction: column;  start; gap: 0.4rem"
      >
        <label
          style="font-size: 1.2rem; font-weight: 500; width: 9rem"
          class="ckeditor"
          >Comments:</label
        >
        <div
          v-html="siteData?.comments ? siteData?.comments : 'N/A'"
          class="ckeditor"
          style="font-weight: 500; margin-left: 0.5rem; color: #111"
        ></div>
      </div>
    </div>
    <!-- Map -->

    <div
      v-if="siteData.latitude"
      style="
        border: 1px solid #ccc;
        border-radius: 1rem;
        box-shadow: 0.2rem 0.2rem 0.2rem rgba(0, 0, 0, 0.2);
      "
    >
      <PolygonMap style="width: 600px; height: 350px" :siteData="siteData" />
    </div>
  </div>

  <!-- Edit Company Modal -->
  <SiteDetailModal
    v-if="openAddSiteModal"
    :EditSiteID="EditSiteID"
    @update:modalHandler="
      () => {
        openAddSiteModal = false;
      }
    "
    :AddSiteModalOpen="openAddSiteModal"
    @update:OnSuccess="getEditSite"
  />
</template>
<style lang="scss" scoped></style>
