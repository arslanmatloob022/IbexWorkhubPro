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

const FormData = ref({
  id: "",
  name: "",
  logo: null as File | null,
});

// -------------

const route = useRoute();
const router = useRouter();
const company = useCompany();
const notyf = useNotyf();
const Loading = ref(false);
const allCompanies = ref([]);

const selectSlotValue = ref("");

let selectSlotOptions = ref<any[]>([]);

const getAllCompanies = async () => {
  Loading.value = true;
  const resp = await api.get(
    `/v3/api/customer-company/company/${company.loggedCompany.id}`
  );
  allCompanies.value = resp.data
  //   Companies
  selectSlotOptions.value = resp.data.map((item) => {
    return {
      value: item.id.toString(),
      name: item.name,
      icon: item.logo ? item.logo : "/default/icon.png",
    };
  });
  if (resp.data) {
    selectSlotValue.value = resp.data[0].id;
  }
  Loading.value = false;
  handleFilter(selectSlotValue.value)
};

// Filter Company

const handleFilter = (id: any) => {
  const singleCompany = allCompanies.value.find((company: any) => company.id ==  id);
  console.log("Single Company:", singleCompany);

  if (singleCompany) {
    FormData.value.logo = singleCompany.logo;
    FormData.value.name = singleCompany.name;
  }
};

onMounted(() => {
  getAllCompanies();
});
</script>

<template>
  <div class="columns mt-5" style="margin-bottom: 3rem">
    <!-- ----------Company DropDown-------- -->
    <VField v-slot="{ id }" class="pl-2">
      <VControl>
        <Multiselect
          style="width: 280px; height: 55px; border-radius: 1rem"
          v-model="selectSlotValue"
          :attrs="{ id }"
          placeholder="Select a customer company"
          label="name"
          :options="selectSlotOptions"
          :searchable="true"
          track-by="name"
          :height="300"
          class="lg-multiselect"
          @input="handleFilter"
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
  <!-- -------------Contracts------------- -->
  <div class="" v-if="selectSlotValue">
    <CompanyContract :customerCompanyId="selectSlotValue" :companyLogo="FormData.logo" :companyName="FormData.name" />
  </div>
  <!-- ------------Placeholder--------------->
  <VPlaceholderPage
    v-if="!selectSlotValue"
    title="Please select company to your Contracts"
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
.lg-multiselect {
  .multiselect-dropdown {
    max-height: 300px !important;
  }
}
</style>
