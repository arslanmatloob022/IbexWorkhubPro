<script setup lang="ts">
import { ref } from "vue";
import { useNotyf } from "/@src/composable/useNotyf";
import { useApi } from "/@src/composable/useAPI";
import { useUserSession } from "/@src/stores/userSession";

const userSession = useUserSession();
const route = useRoute();
const api = useApi();
const tab = ref<
  | "info"
  | "documents"
  | "questions"
  | "details"
  | "contact"
  | "workers"
  | "user"
>("info");
const notyf = useNotyf();
const loading = ref(false);
const setColor = ref("#8b8df2");
const ChangePasswordModalOpen = ref(false);
const ChangeProlileModalOpen = ref(false);
const isShow = ref(false);
const EditMemberID = ref(0);
const FormData = ref({
  id: "",
  supplierName: "",
  country: "",
  noOfEmployees: "",
  supplierPhoneNumber: "",
  supplierEmailAddress: "",
  registrationNumber: "",
  contactPerson: "",
  postCode: "",
  VATExist: false,
  partnerLogo: null as File | null | string,
  vatNumber: "",
  industry: "",
  registeredName: "",
  tradingName: "",
  businessArea: "",
  industryDetail: {},
  relationShip: "",
  taxReference: "",
  bankCountry: "",
  bankName: "",
  accountName: "",
  sortCode: "",
  accountNumber: "",
  accountReference: "",
  website: "",
  color: "#49DFDC",
  address: "",
  approved_till: "",
  latitude: "",
  longitude: "",
  contactEmail: "",
  contactPhoneNumber: "",
  postalAddress: "",
  status: false,
  company: "",
  created_at: "",
  profileStats: {
    percentage: 0,
  },
});

const profileData = <any>ref({});

const editBusinessModal = ref(false);
const businessArea_array = ref([
  {
    name: "Guard & Security",
  },
  {
    name: "Guard & Cleaning",
  },
]);
const businessRelation_array = ref([
  {
    name: "Supplier",
  },
  {
    name: "UnSpecified",
  },
]);

const getSupplier = async () => {
  loading.value = true;
  const resp = await api.get(
    `/v3/api/supplier/${
      userSession.user.role == "partner"
        ? userSession.user.partner
        : route.params.id
    }/detail/`
  );
  FormData.value = resp.data;
  drawmap(resp.data.latitude, resp.data.longitude);
  loading.value = false;
};

const updatePartialSupplierData = async (payload: any) => {
  try {
    const response = await api.patch(
      `/v3/api/supplier/${route.params.id}/`,
      payload
    );
    notyf.success("Partner updated");
  } catch (err) {
    return err;
  }
};

// Get User Info
const getUserProfileData = async () => {
  try {
    const { data } = await api.get(
      `/v3/api/account/user/member/${route.params.id}/`
    );
    profileData.value = data;
    isShow.value = false;
    console.log("User Profile Data:", profileData.value);
  } catch (error) {
    console.log(error);
    isShow.value = true;
  }
};
// google map
const drawmap = (lat: any, lng: any) => {
  let map = new google.maps.Map(document.getElementById("supplierMap"), {
    center: { lat: lat, lng: lng },
    scrollwheel: false,
    mapTypeId: google.maps.MapTypeId.Satellite,
    zoom: 7,
  });
  const marker = new google.maps.Marker({
    position: { lat: lat, lng: lng },
    map: map,
    title: "Supplier Location",
    icon: {
      path: "M-1.547 12l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
      scale: 2.5,
      strokeWeight: 2,
      fillColor: FormData.value.color, // Set your desired color
      fillOpacity: 1,
      strokeColor: FormData.value.color,
      anchor: new google.maps.Point(0, 20),
    },
  });
};

onActivated(() => {
  getSupplier();
});

onMounted(() => {
  getSupplier();
});
</script>

<template>
  <div>
    <!-- -------------------MS_-------------------- -->
    <div
      class="sup-profile rounded mb-4 space-between"
      style="background-color: #fff"
      :style="{
        backgroundImage: `linear-gradient(to right, ${FormData.color}50, ${FormData.color}30, ${FormData.color}10)`,
      }"
    >
      <div class="left-profile-wrapper">
        <div v-if="!loading" class="left-profile-image">
          <img
            :src="
              FormData.partnerLogo == null
                ? '/images/logoplaceholder.png'
                : FormData.partnerLogo
            "
          />
        </div>
        <VPlaceloadAvatar v-if="loading" class="mx-5" rounded="xl" />
        <div v-if="!loading" class="left-profile-content">
          <div
            v-if="userSession.user.role != 'partner'"
            class=""
            style="margin-right: 40px"
          >
            <div
              v-if="FormData.status"
              class="is-flex"
              style="
                font-size: 15px;
                font-weight: bold;
                display: flex;
                align-items: center;
                gap: 0.5rem;
              "
            >
              <i
                class="fas fa-check-circle"
                aria-hidden="true"
                style="color: #70c03c; font-size: 1.5rem"
              ></i>
              <h4
                style="
                  padding-left: 1px;
                  font-size: 1.3rem;
                  font-weight: 500;
                  color: #70c03c;
                "
              >
                Approved
              </h4>
            </div>
            <div
              v-else="FormData.status"
              class="is-flex"
              style="
                font-size: 15px;
                font-weight: bold;
                display: flex;
                align-items: center;
                gap: 0.5rem;
              "
            >
              <i
                style="font-size: 1.5rem; color: var(--danger)"
                class="iconify"
                data-icon="feather:shield-off"
                aria-hidden="true"
              ></i>
              <h4 style="color: var(--danger); font-weight: 500">Unapproved</h4>
            </div>
          </div>
          <div
            v-if="!loading"
            class="left-profileContent"
            style="
              display: flex;
              flex-direction: column;
              gap: 0.1rem;
              margin-top: 0.3srem;
            "
          >
            <h3 class="Brooks-Brothers" style="font-family: sans-serif">
              {{ FormData.supplierName }}
            </h3>
            <span style="">{{
              FormData.contactEmail ? FormData.contactEmail : "N/A"
            }}</span>
            <span style="">{{
              FormData.contactPhoneNumber ? FormData.contactPhoneNumber : "N/A"
            }}</span>
          </div>
        </div>
      </div>
      <div v-if="loading" class="column is-12 is-flex">
        <VPlaceloadText :lines="3" width="75%" last-line-width="25%" />
      </div>
      <!-- Right -->
      <div class="is-flex">
        <div style="display: flex; align-items: flex-end">
          <div
            style="
              display: flex;
              align-items: center;
              flex-direction: column;
              margin-left: 26px;
            "
          >
            <ApexChart
              :Statvalue="
                FormData.profileStats.percentage
                  ? FormData.profileStats.percentage
                  : 0
              "
              :color="setColor"
            />
          </div>
        </div>
        <div
          style="
            display: flex;
            align-items: center;
            flex-direction: column;
            gap: 1.3rem;
          "
        >
          <div class="" style="display: flex; align-items: center">
            <div
              class="is-flex flex-columns justify-center"
              style="width: 100%"
            >
              <img
                class="mb-0"
                :src="FormData.industryDetail?.industryLogo"
                style="border-radius: 12px; width: 50px; height: 50px"
              />
              <h4 style="font-size: 14px; font-weight: 500" class="weighted">
                {{
                  FormData.industryDetail ? FormData.industryDetail.name : "N/A"
                }}
              </h4>
            </div>
          </div>
          <VButton
            class="editbtn"
            @click="
              () => {
                editBusinessModal = true;
              }
            "
            ><i
              class="fas fa-pen"
              aria-hidden="true"
              style="opacity: 1; color: #179e9b; margin-right: 0.5rem"
            ></i
            >Edit Partner Details</VButton
          >
        </div>
      </div>
    </div>

    <div class="tabs-wrapper">
      <div class="tabs-inner">
        <div class="tabs is-toggle">
          <ul>
            <li :class="[tab === 'info' ? 'is-active' : 'not-active']">
              <a
                tabindex="0"
                role="button"
                @keydown.space.prevent="tab = 'info'"
                @click="tab = 'info'"
                ><span>Partner Info</span></a
              >
            </li>
            <li :class="[tab === 'documents' ? 'is-active' : 'not-active']">
              <a
                tabindex="0"
                role="button"
                @keydown.space.prevent="tab = 'documents'"
                @click="tab = 'documents'"
                ><span>Compliance Requirements</span></a
              >
            </li>
            <li :class="[tab === 'details' ? 'is-active' : 'not-active']">
              <a
                tabindex="0"
                role="button"
                @keydown.space.prevent="tab = 'details'"
                @click="tab = 'details'"
                ><span>Bank / Tax Details</span></a
              >
            </li>
            <li :class="[tab === 'contact' ? 'is-active' : 'not-active']">
              <a
                tabindex="0"
                role="button"
                @keydown.space.prevent="tab = 'contact'"
                @click="tab = 'contact'"
                ><span>Contact Details</span></a
              >
            </li>
            <li
              v-if="userSession.user.role != 'partner'"
              :class="[tab === 'workers' ? 'is-active' : 'not-active']"
            >
              <a
                tabindex="0"
                role="button"
                @keydown.space.prevent="tab = 'workers'"
                @click="tab = 'workers'"
                ><span>Workers</span></a
              >
            </li>
            <li
              v-if="userSession.user.role != 'user'"
              :class="[tab === 'user' ? 'is-active' : 'not-active']"
            >
              <a
                tabindex="0"
                role="button"
                @keydown.space.prevent="tab = 'user'"
                @click="
                  () => {
                    (tab = 'user'), getUserProfileData();
                  }
                "
              >
                <span>User</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <!------------------------------------Section 1 (Partner Info)------------------------------------  -->

      <div class="" style="margin-top: 3.5rem" v-show="tab == 'info'">
        <div
          class=" "
          style="display: flex; flex-direction: column; gap: 2.5rem"
        >
          <div class="partnerInfo1" style="">
            <!--  -->
            <div class="" style="width: 12rem">
              <h4 class="title is-6 mb-2 mt-4" style="color: var(--light-text)">
                Business Name
              </h4>
              <h4 class="title is-6">{{ FormData.supplierName }}</h4>
            </div>
            <!--  -->
            <div v-if="userSession.user.role != 'partner'" class="" style="">
              <h4 class="title is-6 mb-2" style="color: var(--light-text)">
                Accreditation
              </h4>
              <div
                v-if="FormData.status"
                class="is-flex"
                style="
                  font-size: 15px;
                  font-weight: bold;
                  align-items: flex-start;
                "
              >
                <h4 class="title is-6">Approved</h4>
              </div>
              <div
                v-else
                class="is-flex"
                style="font-size: 15px; font-weight: bold; align-items: center"
              >
                <h4 class="title is-6">Unapproved</h4>
              </div>
            </div>

            <!--  -->
            <VField horizontal v-if="userSession.user.role != 'partner'">
              <VControl>
                <VSwitchBlock
                  @change="
                    updatePartialSupplierData({ status: FormData.status })
                  "
                  v-model="FormData.status"
                  color="primary"
                />
              </VControl>
            </VField>
          </div>
          <!--  -->
          <div class="" style="display: flex; align-items: center; gap: 4rem">
            <div class="" style="width: 12rem">
              <h4 class="title is-6 mb-4" style="color: var(--light-text)">
                Registration Number
              </h4>
              <h4 class="title is-6">
                {{
                  FormData.registrationNumber
                    ? FormData.registrationNumber
                    : "N/A"
                }}
              </h4>
            </div>

            <!--  -->

            <div class="" style="">
              <h4 class="title is-6 mb-4" style="color: var(--light-text)">
                Approved Till
              </h4>
              <h4 class="title is-6">
                {{ FormData.approved_till ? FormData.approved_till : "N/A" }}
              </h4>
            </div>
          </div>

          <!--  -->
          <!--  -->
          <div class="" style="width: 100%">
            <h4 class="title is-6 mb-4" style="color: var(--light-text)">
              Country
            </h4>
            <h4 class="title is-6">
              {{ FormData.country ? FormData.country : "N/A" }}
            </h4>
          </div>
          <!--  -->
          <div class="" style="width: 100%">
            <h4 class="title is-6 mb-4" style="color: var(--light-text)">
              No of Employees
            </h4>
            <h4 class="title is-6">
              {{ FormData.noOfEmployees ? FormData.noOfEmployees : "N/A" }}
            </h4>
          </div>
          <!--  -->

          <!--  -->
          <div class="" style="width: 100%">
            <h4 class="title is-6 mb-4" style="color: var(--light-text)">
              Website
            </h4>
            <h4 class="title is-6">
              {{ FormData.website ? FormData.website : "N/A" }}
            </h4>
          </div>
          <!--  -->
          <div class="" style="width: 100%">
            <h4 class="title is-6 mb-4" style="color: var(--light-text)">
              Assigned Color
            </h4>
            <div
              style="width: 60px; height: 24px; border-radius: 6px"
              :style="{ backgroundColor: FormData.color }"
            >
              {{ FormData.color ? " " : "N/A" }}
            </div>
          </div>
        </div>
      </div>

      <!-- ---------------- Bank/ Tax Details------------ -->
      <div class="" style="margin-top: 3.5rem" v-show="tab == 'details'">
        <div
          class=" "
          style="display: flex; flex-direction: column; gap: 2.5rem"
        >
          <div class="" style="display: flex; align-items: center; gap: 4rem">
            <!--  -->
            <div class="" style="width: 12rem">
              <h4 class="title is-6 mb-4" style="color: var(--light-text)">
                Account Reference
              </h4>
              <h4 class="title is-6">
                {{
                  FormData.accountReference ? FormData.accountReference : "N/A"
                }}
              </h4>
            </div>
            <!--  -->
            <div class="" style="">
              <h4 class="title is-6 mb-4" style="color: var(--light-text)">
                Accreditation
              </h4>
              <div
                v-if="FormData.status"
                class="is-flex"
                style="
                  font-size: 15px;
                  font-weight: bold;
                  align-items: flex-start;
                "
              >
                <h4 class="title is-6">Registered</h4>
              </div>
              <div
                v-else
                class="is-flex"
                style="font-size: 15px; font-weight: bold; align-items: center"
              >
                <h4 class="title is-6">Not Registered</h4>
              </div>
            </div>
          </div>
          <!--  -->
          <div class="" style="display: flex; align-items: center; gap: 4rem">
            <div class="" style="width: 12rem">
              <h4 class="title is-6 mb-4" style="color: var(--light-text)">
                Account Number
              </h4>
              <h4 class="title is-6">
                {{ FormData.accountNumber ? FormData.accountNumber : "N/A" }}
              </h4>
            </div>

            <!--  -->

            <div class="" style="">
              <h4 class="title is-6 mb-4" style="color: var(--light-text)">
                Tax Reference
              </h4>
              <h4 class="title is-6">
                {{
                  FormData.accountReference ? FormData.accountReference : "N/A"
                }}
              </h4>
            </div>
          </div>

          <!--  -->
          <!--  -->
          <div class="" style="width: 100%">
            <h4 class="title is-6 mb-4" style="color: var(--light-text)">
              Account Name
            </h4>
            <h4 class="title is-6">
              {{ FormData.accountName ? FormData.accountName : "N/A" }}
            </h4>
          </div>
          <!--  -->
          <div class="" style="width: 100%">
            <h4 class="title is-6 mb-4" style="color: var(--light-text)">
              Bank Name
            </h4>
            <h4 class="title is-6">
              {{ FormData.bankName ? FormData.bankName : "N/A" }}
            </h4>
          </div>
          <!--  -->

          <div class="" style="width: 100%">
            <h4 class="title is-6 mb-4" style="color: var(--light-text)">
              Bank Country
            </h4>
            <h4 class="title is-6">
              {{ FormData.bankCountry ? FormData.bankCountry : "N/A" }}
            </h4>
          </div>
          <!--  -->
          <div class="" style="width: 100%">
            <h4 class="title is-6 mb-4" style="color: var(--light-text)">
              Registeration Number
            </h4>
            <h4 class="title is-6">{{ FormData.registrationNumber }}</h4>
          </div>
          <!--  -->
          <div class="" style="width: 100%">
            <h4 class="title is-6 mb-4" style="color: var(--light-text)">
              Tax Reference
            </h4>
            <h4 class="title is-6">
              {{
                FormData.accountReference ? FormData.accountReference : "N/A"
              }}
            </h4>
          </div>
        </div>
      </div>

      <!-- ---------------- Contact Details------------ -->
      <div class="" style="margin-top: 3.5rem" v-show="tab == 'contact'">
        <div
          class=" "
          style="display: flex; flex-direction: column; gap: 2.5rem"
        >
          <div class="" style="width: 100%">
            <h4 class="title is-6 mb-4" style="color: var(--light-text)">
              Phone Number
            </h4>
            <h4 class="title is-6">
              {{
                FormData.contactPhoneNumber
                  ? FormData.contactPhoneNumber
                  : "N/A"
              }}
            </h4>
          </div>
          <!--  -->
          <div class="" style="width: 100%">
            <h4 class="title is-6 mb-4" style="color: var(--light-text)">
              Email
            </h4>
            <h4 class="title is-6">
              {{ FormData.contactEmail ? FormData.contactEmail : "N/A" }}
            </h4>
          </div>

          <div class="" style="width: 100%">
            <h4 class="title is-6 mb-4" style="color: var(--light-text)">
              Postal Address
            </h4>
            <h4 class="title is-6">
              {{ FormData.postalAddress ? FormData.postalAddress : "N/A" }}
            </h4>
          </div>

          <div class="" style="width: 100%">
            <h4 style="font-size: 15px" class="title is-6 mb-4 mt-4">
              Supplier location
            </h4>
            <div
              id="supplierMap"
              style="
                height: 200px;
                width: 340px;
                margin-top: 12px;
                border-radius: 10px;
              "
            ></div>
          </div>
        </div>
      </div>

      <!-- ---------------- Document Details------------ -->
      <div v-if="tab == 'documents'">
        <SupplierDocuments
          :id="
            userSession.user.role == 'partner'
              ? userSession.user.partner
              : route.params.id
          "
          FormData="{FormData}"
        />
        <QuestionsOfMembers
          type="partner"
          :memberId="
            userSession.user.role == 'partner'
              ? userSession.user.partner
              : route.params.id
          "
        />
      </div>
      <!-- ---------------- Worker Details------------ -->
      <div v-if="tab == 'workers'">
        <WorkersNetwork :partnerID="route.params.id && route.params.id" />
      </div>
      <!-- ---------------- User Details------------ -->
      <div v-if="tab == 'user'">
        <div
          v-if="isShow == true"
          class="row"
          style="display: flex; justify-content: center; margin-top: 120px"
        >
          <VButton
            color="primary"
            v-tooltip.primary.top.rounded="'Create User'"
            @click="
              () => {
                ChangeProlileModalOpen = true;
              }
            "
            style="display: flex; align-items: center; gap: 1rem"
          >
            <span style="font-size: 1.2rem">Create User</span>
          </VButton>
        </div>

        <div
          class=""
          v-if="isShow == false"
          style="display: flex; flex-direction: column; gap: 1rem"
        >
          <div class="" style="display: flex; align-items: center; gap: 1.5rem">
            <img
              :src="
                profileData.profileImage
                  ? profileData.profileImage
                  : '/demo/placeholder.jpg'
              "
              alt="logo"
              style="
                width: 7rem;
                height: 7rem;
                margin-left: 1rem;
                border-radius: 50%;
                border: 1px solid #2aac8e;
              "
            />
            <div class="" style="display: flex; flex-direction: column; gap: 0">
              <div
                class=""
                style="display: flex; align-items: center; gap: 1rem"
              >
                <span style="font-size: 1.6rem; font-weight: 600"
                  >{{ profileData.first_name }}
                  {{ profileData.last_name }}</span
                >
              </div>
              <div
                class=""
                style="display: flex; align-items: center; gap: 1rem"
              >
                <span style="font-size: 1.2rem; font-weight: 500">{{
                  profileData.email ? profileData.email : "N/A"
                }}</span>
              </div>
              <div
                class=""
                style="display: flex; align-items: center; gap: 1rem"
              >
                <span style="font-size: 1.2rem; font-weight: 500">{{
                  profileData.phoneNo ? profileData.phoneNo : "N/A"
                }}</span>
              </div>
            </div>
            <div
              class=""
              style="
                display: flex;
                flex-direction: column;
                gap: 1rem;
                margin-left: 1rem;
              "
            >
              <span
                v-tooltip.primary.top.rounded="'Edit Profile'"
                @click="
                  () => {
                    EditMemberID = profileData.partner;
                    ChangeProlileModalOpen = true;
                  }
                "
                ><i
                  class="iconify"
                  data-icon="feather:edit"
                  aria-hidden="true"
                  style="color: #2aac8e; font-size: 1.5rem; cursor: pointer"
                ></i
              ></span>
              <span
                v-tooltip.primary.top.rounded="'Edit Password'"
                @click="
                  () => {
                    EditMemberID = profileData.id;
                    ChangePasswordModalOpen = true;
                  }
                "
              >
                <i
                  class="lnil lnil-lock-alt"
                  aria-hidden="true"
                  style="color: #2aac8e; font-size: 1.5rem; cursor: pointer"
                ></i
              ></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <CusLargModal
    v-if="editBusinessModal"
    :id="
      userSession.user.role == 'partner'
        ? userSession.user.partner
        : route.params.id
    "
    :OpenCusLargModal="editBusinessModal"
    @update:cusModalHandler="
      (value: boolean) => ((editBusinessModal = value), getSupplier())
    "
  ></CusLargModal>
  <!-- -------------Edit User Profile---- -->
  <EditUserProfileModal
    v-if="ChangeProlileModalOpen"
    :partnerId="route.params.id"
    :ChangePasswordModalOpen="ChangeProlileModalOpen"
    :id="EditMemberID"
    @update:handleChangeProlileModalOpen="
      (value) => (ChangeProlileModalOpen = value)
    "
    @update:getUserProfileData="getUserProfileData"
    :getUserProfile="getUserProfileData"
  />

  <!------------Change Password---------- -->
  <ChangeMemberPassword
    v-if="ChangePasswordModalOpen"
    :ChangePasswordModalOpen="ChangePasswordModalOpen"
    :id="EditMemberID"
    @update:handleChangePasswordModalOpen="
      (value) => (ChangePasswordModalOpen = value)
    "
    @update:getTeamMembers=""
  />
</template>
<style lang="scss">
body {
  margin: 0;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.partnerLogo {
  width: 120px;
  height: 120px;

  img {
    width: 100%;
    height: 90%;
  }
}

.cus-section-heading {
  border-left: 4px solid var(--success);
  padding-left: 8px;
  color: var(--light-text);
  font-weight: 600;
  font-size: 16px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

td {
  padding: 10px;
  text-align: start;
  border: none;
  /* Remove cell borders */
}

.cell-content {
  display: flex;
  flex-direction: column;
  align-items: start;
  line-height: 1.2; // Adjusted line height for better readability
}

.heading {
  font-weight: bold;
  font-size: 12px;
}

.content {
  margin-top: 5px;
}

// Responsive Styles
@media (max-width: 600px) {
  td {
    padding: 5px; // Adjusted padding for smaller screens
  }

  .cell-content {
    line-height: 1.5; // Adjusted line height for better readability on smaller screens
  }
}

/*table style  */
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

// --------------------------MS_Me----------------------->
.sup-profile {
  width: full;
  padding: 2rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  background-color: white;
}

.left-profile-wrapper {
  display: flex;
  align-items: center;
  gap: 2rem;

  .left-profile-image {
    width: 9rem;
    height: 9rem;
    border-radius: 3.5rem;
    object-fit: fill;
    overflow: hidden;
  }
}

.Brooks-Brothers {
  height: 46px;
  font-family: GoogleSans;
  font-size: 36px;
  color: #1a1a1a;
}

.left-profileContent span {
  font-family: sans-serif;
  font-size: 18px;
  color: #333;
}

.brooksbrothersgmail {
  font-family: GoogleSans;
  font-size: 18px;
  color: #333;
}

.editbtn {
  width: 225px;
  height: 48px;
  background-color: #e3f3f3;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #179e9b;
  gap: 1rem;
  border-radius: 20px;
}

.editbtn:hover {
  background: rgb(212, 245, 245);
}

// Service-Partner-01
.servicePartner1 {
  width: full;
  min-height: 70vh;
  background: #179e9b;
  display: flex;
}

.partnerInfo1 {
  display: flex;
  align-items: center;
  gap: 4rem;
}

// <--------------Responsiveness---------------->
@media (max-width: 725px) {
  .sup-profile {
    display: flex;
    align-items: start;
    flex-direction: column;
    gap: 2rem;
  }

  .Brooks-Brothers {
    width: 263px;
    height: 46px;
    font-family: GoogleSans;
    font-size: 36px;
    color: #1a1a1a;
  }
}

@media (max-width: 625px) {
  .left-profile-image {
    width: 7rem !important;
    height: 7rem !important;
    border-radius: 2rem !important;
  }

  .Brooks-Brothers {
    height: 46px;
    font-family: GoogleSans;
    font-size: 24px;
    color: #1a1a1a;
  }

  .left-profileContent span {
    font-size: 15px;
  }

  .partnerInfo1 {
    display: flex;
    align-items: start;
    gap: 2rem;
    flex-direction: column;
  }
}
</style>
