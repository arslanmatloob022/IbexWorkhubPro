<script setup lang="ts">
import { ref } from "vue";
import { useCompany } from "/@src/stores/company";
import { useNotyf } from "/@src/composable/useNotyf";
import { useApi } from "/@src/composable/useAPI";
import { useViewWrapper } from "/@src/stores/viewWrapper";
const viewWrapper = useViewWrapper();

const api = useApi();
export interface CompaniesData {
  id: string;
  name: string;
  trade_name: string;
  email: string;
  phone_number: string;
  logo: string;
  postcode: string;
  latitude: 0.0;
  longitude: 0.0;
  business_details: string;
  reg_no: string;
  business_type: string;
  covered_distance: string;
  vat_no: string;
  address: string;
  industry: string;
  color: string;
}

// -------------

const route = useRoute();
const router = useRouter();
const company = useCompany();
const notyf = useNotyf();
const Loading = ref(false);
const selectSlotValue = ref("");
const selectContractValue = ref("");
const selectSiteValue = ref("");
const isShow = ref(1);

let selectSlotOptions = ref<any[]>([]);
let selectContractsOptions = ref<any[]>([]);
let selectStiesOptions = ref<any[]>([]);

const totalCompanies = ref([]);
const totalContracts = ref([]);

const selectCompany = ref<string>("");
const selectContract = ref<string>("");
// All Companies
const getAllCompanies = async () => {
  Loading.value = true;
  try {
    const resp = await api.get(
      `/v3/api/customer-company/company/${company.loggedCompany.id}`
    );
    console.log("Companies:", resp.data);
    totalCompanies.value = resp.data;
    //   Companies
    selectSlotOptions.value = resp.data.map((item: any) => {
      return {
        value: item.id.toString(),
        name: item.name,
        icon: item.logo ? item.logo : "/default/icon.png",
        email: item.email,
      };
    });
    // if (resp.data) {
    //   selectSlotValue.value = resp.data[0].id;
    // }
    Loading.value = false;
  } catch (error) {
    console.log(error);
    notyf.error("Something went wrong!");
    Loading.value = false;
  }
};

// All Contracts
const getAllContracts = async () => {
  Loading.value = true;
  selectStiesOptions.value = [];
  try {
    const resp = await api.get(
      `/v3/api/contract/customer-company/${selectSlotValue.value}/`
    );
    totalContracts.value = resp.data;
    console.log("Contracts1:", resp.data);
    selectContractsOptions.value = [];
    //   Companies
    selectContractsOptions.value = resp.data.map((item: any) => {
      return {
        value: item.id.toString(),
        id: item.id,
        name: item.name,
        sites: item.sitesCount,
        incharge: item.incharge_name,
        rate: item.over_rate,
      };
    });
    Loading.value = false;
  } catch (error) {
    console.log(error);
    notyf.error("Something went wrong!");
    Loading.value = false;
  }
};

// All Sites

const getAllSites = async () => {
  Loading.value = true;
  if (!selectContractValue.value) {
    return notyf.error("Contract Id is required!");
  }
  try {
    const resp = await api.get(
      `/v3/api/site/contract/${selectContractValue.value}/`
    );
    selectStiesOptions.value = [];
    //   Companies
    selectStiesOptions.value = resp.data.sites.map((item: any) => {
      return {
        value: item.id.toString(),
        id: item.id,
        name: item.name,
        jobs: item?.jobs,
        postcode: item.postcode,
        city: item.city,
        contractSiteId: item.id,
        inchargeName: item.incharge_name,
      };
    });
    //   if (resp.data) {
    //     selectSiteValue.value = resp.data[0].id;
    //   }
    Loading.value = false;
  } catch (error) {
    console.log(error);
    notyf.error("Something went wrong (Sites)!");
    Loading.value = false;
  }
};

const handleInput = (value: number) => {
  console.log("Selected value:", value);
  const selectedCompany = totalCompanies.value.find(
    (company) => company.id == value
  );
  console.log("Selected Company:", selectedCompany);

  if (selectedCompany) {
    selectCompany.value = selectedCompany.name;
    console.log("Selected Company:", selectCompany.value);
  } else {
    console.error("Company with id", value, "not found");
  }
};

const handleSelectContract = (value: number) => {
  console.log("Selected value:", value);
  const selectedContract = totalContracts.value.find(
    (company) => company.id == value
  );
  console.log("Selected Contract:", selectedContract);

  if (selectedContract) {
    selectContract.value = selectedContract.name;
    console.log("Selected Contract:", selectContract.value);
  } else {
    console.error("Contract with id", value, "not found");
  }
};

onMounted(() => {
  getAllCompanies();
});

watch(selectSlotValue, () => {
  getAllContracts();
});

watch(selectContractValue, () => {
  getAllSites();
});
</script>

<template>
  <div class="columns mt-5" style="margin-bottom: 3rem; gap: 1.5rem">
    <!-- ----------Company DropDown-------- -->
    <VField v-slot="{ id }" class="pl-2">
      <VControl class="placement-wrapper">
        <span
          style="
            margin-left: 1rem;
            font-weight: 500;
            font-size: 1.3rem;
            color: #555;
            transform: translateY(0.5rem);
          "
          >Customers({{
            selectSlotOptions.length > 10
              ? selectSlotOptions.length
              : "0" + selectSlotOptions.length
          }})</span
        >
        <Multiselect
          style="
            width: 280px;
            height: 55px;
            border-radius: 1rem;
            background-color: transparent;
            border: none;
            outline: none;
            width: 100%;
          "
          v-model="selectSlotValue"
          :attrs="{ id }"
          placeholder="Select a customer company"
          label="name"
          :options="selectSlotOptions"
          :searchable="true"
          track-by="name"
          :height="300"
          class="lg-multiselect"
          @input="handleInput"
        >
          <template
            #singlelabel="{ value }"
            style="background-color: transparent"
          >
            <div
              class="multiselect-single-label"
              style="background-color: transparent"
            >
              <img
                style="width: 30px; border-radius: 0.5rem"
                class="select-label-icon mr-2"
                :src="value.icon"
                alt=""
              />
              {{ value.name }}
            </div>
          </template>

          <template #option="{ option }">
            <div
              class=""
              style="display: flex; flex-direction: column; gap: 0.3rem"
            >
              <div
                class=""
                style="display: flex; align-items: center; gap: 0.5rem"
              >
                <img
                  style="width: 40px; border-radius: 0.5rem"
                  class="select-option-icon mr-2"
                  :src="option.icon"
                  alt=""
                />
                <div style="display: flex; flex-direction: column; gap: 0.3rem">
                  <span
                    style="color: #444; font-size: 1.2rem; font-weight: 500"
                    >{{ option.name }}</span
                  >
                  <span style="color: #666; font-size: 1rem"
                    ><span style="color: #444">Email:</span>
                    {{ option.email }}</span
                  >
                </div>
              </div>
            </div>
          </template>
        </Multiselect>
      </VControl>
    </VField>
    <!-- Contracts Dropdown -->
    <VField v-slot="{ id }" class="pl-2">
      <VControl class="placement-wrapper">
        <span
          style="
            margin-left: 1rem;
            font-weight: 500;
            font-size: 1.3rem;
            color: #555;
            transform: translateY(0.5rem);
          "
          >{{ selectCompany }} Contracts ({{
            selectContractsOptions.length > 10
              ? selectContractsOptions.length
              : "0" + selectContractsOptions.length
          }})</span
        >
        <Multiselect
          style="
            width: 280px;
            height: 55px;
            border-radius: 1rem;
            background-color: transparent;
            border: none;
            outline: none;
            width: 100%;
          "
          v-model="selectContractValue"
          :attrs="{ id }"
          placeholder="Select Contract"
          label="name"
          :options="selectContractsOptions"
          :searchable="true"
          track-by="name"
          :height="300"
          class="lg-multiselect"
          @input="handleSelectContract"
        >
          <template
            #singlelabel="{ value }"
            style="background-color: transparent"
          >
            <div
              class="multiselect-single-label"
              style="background-color: transparent"
            >
              {{ value.name }}
            </div>
          </template>

          <template #option="{ option }">
            <div style="display: flex; flex-direction: column; gap: 0.5rem">
              <div
                class=""
                style="
                  display: flex;
                  flex-direction: column;
                  align-items: start;
                "
              >
                <span style="color: #666; font-size: 1rem"
                  >Contract_ID: #00{{ option.id }}</span
                >
                <span style="font-weight: 500; font-size: 1.2rem"
                  >{{ option.name }} (
                  {{
                    option.sites > 10 ? option.sites : "0" + option.sites
                  }})</span
                >
                <div
                  style="
                    display: flex;
                    flex-direction: row;
                    gap: 0.2rem;
                    align-items: start;
                  "
                >
                  <span style="color: #666; font-size: 0.9rem"
                    >Total Sites:
                    {{
                      option.sites > 10 ? option.sites : "0" + option.sites
                    }}</span
                  >
                  <span
                    style="background-color: #ccc; height: 0.8rem; width: 2px"
                  ></span>
                  <span style="color: #666; font-size: 0.9rem"
                    >Charge Rate: £{{ option.rate }}</span
                  >
                  <span
                    style="background-color: #ccc; height: 0.8rem; width: 2px"
                  ></span>
                  <span style="color: #666; font-size: 0.9rem"
                    >Incharge: {{ option.incharge }}</span
                  >
                </div>
              </div>
              <span
                style="background-color: #eee; height: 2px; width: 100%"
              ></span>
            </div>
          </template>
        </Multiselect>
      </VControl>
    </VField>
    <!-- Sites Dropdown-->
    <VField v-slot="{ id }" class="pl-2">
      <VControl class="placement-wrapper">
        <span
          style="
            margin-left: 1rem;
            font-weight: 500;
            font-size: 1.3rem;
            color: #555;
            transform: translateY(0.5rem);
          "
        >
          {{ selectContract }} Sites ({{
            selectStiesOptions.length > 10
              ? selectStiesOptions.length
              : "0" + selectStiesOptions.length
          }})</span
        >
        <Multiselect
          style="
            width: 280px;
            height: 55px;
            border-radius: 1rem;
            background-color: transparent;
            border: none;
            outline: none;
            width: 100%;
          "
          v-model="selectSiteValue"
          :attrs="{ id }"
          placeholder="Select Contract Site"
          label="name"
          :options="selectStiesOptions"
          :searchable="true"
          track-by="name"
          :height="300"
          class="lg-multiselect"
        >
          <template
            #singlelabel="{ value }"
            style="background-color: transparent"
          >
            <div
              class="multiselect-single-label"
              style="background-color: transparent"
            >
              {{ value.name }}
            </div>
          </template>

          <template #option="{ option }">
            <div
              class=""
              style="display: flex; flex-direction: column; align-items: start"
            >
              <span style="color: #666; font-size: 0.9rem"
                >Contract_ID: #00{{ option.id }}</span
              >
              <span style="font-weight: 500; font-size: 1.1rem"
                >{{ option.name }} ({{
                  option?.jobs > 10 ? option?.jobs : "0" + option?.jobs
                }})</span
              >
              <div
                style="
                  display: flex;
                  flex-direction: row;
                  gap: 0.2rem;
                  align-items: start;
                "
              >
                <span style="color: #666; font-size: 0.8rem"
                  >Total Jobs:
                  {{ option.jobs > 10 ? option.jobs : "0" + option.jobs }}</span
                >
                <span
                  style="background-color: #ccc; height: 0.8rem; width: 2px"
                ></span>
                <span style="color: #666; font-size: 0.8rem"
                  >Postcode: {{ option.postcode }}</span
                >
                <span
                  style="background-color: #ccc; height: 0.8rem; width: 2px"
                ></span>
                <span style="color: #666; font-size: 0.8rem"
                  >City: {{ option.city }}</span
                >
              </div>
            </div>
          </template>
        </Multiselect>
      </VControl>
    </VField>
    <!--  -->
  </div>
  <!-- ---------------------SiteJob------------- -->
  <div class="contract-wrapper sitejob-space" v-if="selectSiteValue">
    <SiteJobs :siteID="selectSiteValue" :isShow="isShow" />
  </div>
  <!-- ------------Placeholder--------------->
  <VPlaceholderPage
    v-if="!selectSiteValue"
    title="Please select the company contract and site associated with your company."
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
</template>

<style lang="scss">
.placement-wrapper {
  width: 30rem;
  height: 7rem;
  background: #f3f1f1;
  border-radius: 0.8rem;
  display: flex;
  align-items: start;
  padding: 0.5rem 0.5rem;
  flex-direction: column;
  gap: 0rem;
  box-shadow: 0.1rem 0.1rem 0.3rem rgba(0, 0, 0, 0.1);
  cursor: pointer;
}
.placement-wrapper:hover {
  box-shadow: 0.1rem 0.1rem 0.3rem rgba(0, 0, 0, 0.2);
}
.sitejob-space {
  margin-top: -1rem;
}
.lg-multiselect {
  .multiselect-dropdown {
    max-height: 300px !important;
  }
}

.placement-wrapper > .multiselect > .multiselect-wrapper > .multiselect-search {
  background: transparent;
  outline: none;
}

.placement-wrapper > .multiselect > .multiselect-dropdown {
  border-radius: 0.8rem;
  margin-bottom: -1.5rem;
  box-shadow: 0.2rem 0.2rem 0.2rem rgba(0, 0, 0, 0.3);
  min-height: 450px !important;
}
.multiselect .multiselect-caret {
  width: 1.3rem;
  height: 1.3rem;
  border-radius: 0.3rem;
  cursor: pointer;
  background: #666;
}
</style>
