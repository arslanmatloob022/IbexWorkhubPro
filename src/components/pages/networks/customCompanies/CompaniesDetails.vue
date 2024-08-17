<script setup lang="ts">
import { ref } from "vue";
import { useCompany } from "/@src/stores/company";
import { useNotyf } from "/@src/composable/useNotyf";
import { useApi } from "/@src/composable/useAPI";
import { useViewWrapper } from "/@src/stores/viewWrapper";
const viewWrapper = useViewWrapper();

const route = useRoute();
const api = useApi();
const tab = ref<"contact" | "businesss" | "location" | "contract">("contact");
const notyf = useNotyf();
const memberType = ref("partner");
const setColor = ref("#8b8df2");

const FormData = ref({
  id: "",
  name: "",
  trade_name: "",
  email: "",
  phone_number: "",
  postcode: "",
  latitude: "",
  longitude: "",
  logo: null as File | null,
  business_details: "",
  reg_no: "",
  business_type: "",
  covered_distance: "",
  vat_no: "",
  address: "",
  industry: "",
  company: 0,
  color: "",
  profileStats: {
    percentage: 10,
  },
});

const openCustomCompany = ref(false);
const EditSupplierID = ref("");
const currentSelectedID = ref(0);
const showDateIpnut = ref(false);
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

// -------------Get Company Details------------->
const getCompany = async () => {
  const resp = await api.get(`/v3/api/customer-company/${route.params.id}/`);
  console.log("Companies Data:", resp.data);
  FormData.value = resp.data;
  console.log("Form Data:", FormData.value.name);
  viewWrapper.setPageTitle(`Business Infomation`);
  drawmap(resp.data.latitude, resp.data.longitude);
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

onMounted(async () => {
  await getCompany();
});
</script>

<template>
  <div>
    <!-- -------------------MS_-------------------- -->
    <div
      class="sup-profile rounded mb-4 space-between"
      :style="{
        backgroundImage: `linear-gradient(to right, ${FormData.color}50, ${FormData.color}30, ${FormData.color}10)`,
      }"
    >
      <!-- left -->
      <!-- <img class="mb-0" src="/images/svg/Service_partners_logo.svg"
            style="position:absolute; top:0; right:10px; border-radius: 2px; width:150px; height:50px" /> -->
      <div class="left-profile-wrapper">
        <div class="left-profile-image">
          <img
            :src="
              FormData.logo == null
                ? '/images/logoplaceholder.png'
                : FormData.logo
            "
          />
        </div>
        <div class="left-profile-content">
          <!-- Status end -->
          <div
            class="left-profileContent"
            style="
              display: flex;
              flex-direction: column;
              gap: 0.1rem;
              margin-top: 0.3srem;
            "
          >
            <h3 class="Brooks-Brothers" style="font-family: sans-serif">
              {{ FormData.name }}
            </h3>
            <span style="">{{ FormData.email ? FormData.email : "N/A" }}</span>
            <span style="">{{
              FormData.phone_number ? FormData.phone_number : "N/A"
            }}</span>
          </div>
        </div>
      </div>
      <!-- Right -->
      <div class="is-flex">
        <!-- end -->
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
              style="
                width: 100%;
                border-radius: 1rem;
                overflow: hidden;
                width: 200px;
                height: 80px;
              "
            >
              <!-- <img class="mb-0" src="/images/svg/Service_partners_logo.svg"
                style=" width:100%; height:100%; border-radius: 1rem;" /> -->
            </div>
          </div>
          <!-- end -->
          <VButton
            class="editbtn"
            @click="
              () => {
                openCustomCompany = true;
              }
            "
            ><i
              class="fas fa-pen"
              aria-hidden="true"
              style="opacity: 1; color: #179e9b; margin-right: 0.5rem"
            ></i
            >Edit Business Details</VButton
          >
        </div>
      </div>
    </div>

    <!-- Button (tabs-wrapper) -->
    <div class="tabs-wrapper">
      <div class="tabs-inner">
        <div class="tabs is-toggle">
          <ul>
            <li :class="[tab === 'contact' ? 'is-active' : 'not-active']">
              <a
                tabindex="0"
                role="button"
                @keydown.space.prevent="tab = 'contact'"
                @click="tab = 'contact'"
                ><span>Contact Info</span></a
              >
            </li>
            <li :class="[tab === 'businesss' ? 'is-active' : 'not-active']">
              <a
                tabindex="0"
                role="button"
                @keydown.space.prevent="tab = 'businesss'"
                @click="tab = 'businesss'"
                ><span>Businesss Info</span></a
              >
            </li>
            <li :class="[tab === 'location' ? 'is-active' : 'not-active']">
              <a
                tabindex="0"
                role="button"
                @keydown.space.prevent="tab = 'location'"
                @click="tab = 'location'"
                ><span>Location Info </span></a
              >
            </li>
            <li :class="[tab === 'contract' ? 'is-active' : 'not-active']">
              <a
                tabindex="0"
                role="button"
                @keydown.space.prevent="tab = 'contract'"
                @click="tab = 'contract'"
                ><span>Contract / Site </span></a
              >
            </li>
          </ul>
        </div>
      </div>
      <!------------------------------------Section 1 (Contact Info)------------------------------------  -->

      <div class="" style="margin-top: 3.5rem" v-show="tab == 'contact'">
        <div
          class=" "
          style="display: flex; flex-direction: column; gap: 2.5rem"
        >
          <div class="partnerInfo1" style="">
            <!--  -->
            <div class="" style="">
              <h4 class="title is-6 mb-2 mt-4" style="color: var(--light-text)">
                Registered Company Name
              </h4>
              <h4 class="title is-6">{{ FormData.name }}</h4>
            </div>
          </div>
          <!-- end -->
          <div class="" style="display: flex; align-items: center; gap: 4rem">
            <div class="" style="">
              <h4 class="title is-6 mb-4" style="color: var(--light-text)">
                Company Registration Number
              </h4>
              <h4 class="title is-6">
                {{ FormData.reg_no ? FormData.reg_no : "N/A" }}
              </h4>
            </div>

            <!--  -->

            <div class="" style="">
              <h4 class="title is-6 mb-4" style="color: var(--light-text)">
                Trade Name
              </h4>
              <h4 class="title is-6">
                {{ FormData.trade_name ? FormData.trade_name : "N/A" }}
              </h4>
            </div>
          </div>

          <!--  -->
          <!--  -->
          <div class="" style="width: 100%">
            <h4 class="title is-6 mb-4" style="color: var(--light-text)">
              Email Address
            </h4>
            <h4 class="title is-6">
              {{ FormData.email ? FormData.email : "N/A" }}
            </h4>
          </div>
          <!--  -->
          <div class="" style="width: 100%">
            <h4 class="title is-6 mb-4" style="color: var(--light-text)">
              Phone Number
            </h4>
            <h4 class="title is-6">
              {{ FormData.phone_number ? FormData.phone_number : "N/A" }}
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

      <!-- ---------------- Section 2 (Business Details)------------ -->
      <div class="" style="margin-top: 3.5rem" v-show="tab == 'businesss'">
        <div
          class=" "
          style="display: flex; flex-direction: column; gap: 2.5rem"
        >
          <div class="" style="display: flex; align-items: center; gap: 4rem">
            <!--  -->
            <div class="" style="">
              <h4 class="title is-6 mb-4" style="color: var(--light-text)">
                Business Type
              </h4>
              <h4 class="title is-6">
                {{ FormData.business_type ? FormData.business_type : "N/A" }}
              </h4>
            </div>
          </div>
          <!--  -->
          <div class="" style="display: flex; align-items: center; gap: 4rem">
            <div class="" style="width: 12rem">
              <h4 class="title is-6 mb-4" style="color: var(--light-text)">
                Max Working Distance
              </h4>
              <h4 class="title is-6">
                {{
                  FormData.covered_distance ? FormData.covered_distance : "N/A"
                }}
                miles
              </h4>
            </div>

            <!--  -->

            <div class="" style="">
              <h4 class="title is-6 mb-4" style="color: var(--light-text)">
                Business Area
              </h4>
              <h4 class="title is-6">
                {{ FormData.industry ? FormData.industry : "N/A" }}
              </h4>
            </div>
          </div>

          <!--  -->
          <div class="" style="width: 100%">
            <h4 class="title is-6 mb-4" style="color: var(--light-text)">
              Your VAT Number
            </h4>
            <h4 class="title is-6">
              {{ FormData.vat_no ? FormData.vat_no : "N/A" }}
            </h4>
          </div>
          <!--   -->
          <div class="" style="width: 100%">
            <h4 class="title is-6 mb-4" style="color: var(--light-text)">
              Business Details
            </h4>
            <div
              v-html="FormData?.business_details"
              class="ckeditor"
              style="font-weight: 500; margin-left: 0.5rem; color: #111"
            ></div>
          </div>
        </div>
      </div>

      <!-- ---------------- Section 3 (Location Details)------------ -->
      <div class="" style="margin-top: 3.5rem" v-show="tab == 'location'">
        <div
          class=" "
          style="display: flex; flex-direction: column; gap: 2.5rem"
        >
          <div class="" style="width: 100%">
            <h4 class="title is-6 mb-4" style="color: var(--light-text)">
              Postcode
            </h4>
            <h4 class="title is-6">
              {{ FormData.postcode ? FormData.postcode : "N/A" }}
            </h4>
          </div>
          <!--  -->
          <div class="" style="width: 100%">
            <h4 class="title is-6 mb-4" style="color: var(--light-text)">
              Business Address
            </h4>
            <h4 class="title is-6">
              {{ FormData.address ? FormData.address : "N/A" }}
            </h4>
          </div>
          <!--  -->

          <div class="" style="width: 100%">
            <h4 style="font-size: 15px" class="title is-6 mb-4 mt-4">
              Business location
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

      <!-- -----------------Section 4 (Company Contracts)------------ -->
      <div class="" style="margin-top: 3.5rem" v-show="tab == 'contract'">
        <CompanyContract :companyLogo="FormData.logo" :companyName="FormData.name" />
      </div>
    </div>
  </div>

  <!-- Edit Company Model -->

  <CompanyLargeModal
    v-if="openCustomCompany"
    :id="route.params.id"
    :openCustomCompany="openCustomCompany"
    @update:modalHandler="
      (value: boolean) => ((openCustomCompany = value), getCompany())
    "
  ></CompanyLargeModal>
</template>
<style lang="scss" scoped>
body {
  margin: 0;
  padding: 20px;
  font-family: Arial, sans-serif;
}
p {
  height: 20rem !important;
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
  padding: 1rem 1.5rem;
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
