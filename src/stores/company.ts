/**
 * This is a store that hold the messaging-v1 state
 * It uses the useFetch composition component to make the api calls
 *
 * @see /src/pages/messaging-v1.vue
 * @see /src/composable/useFetch.ts
 * @see /src/components/partials/chat/*.vue
 * @see /src/utils/api/chat
 */

import { ref, computed } from "vue";
import { acceptHMRUpdate, defineStore } from "pinia";
import { useApi } from "/@src/composable/useAPI";
import { useUserSession } from "/@src/stores/userSession";
import { changeFavicon } from "../composable/useSupportElement";
import { useNotyf } from "../composable/useNotyf";

const notyf = useNotyf();
export const useCompany = defineStore("company", () => {
  const userSession = useUserSession();
  const api = useApi();
  const isScheduleMode = ref(false);
  const industries = ref([{ id: "", name: "", industryLogo: "" }]);
  const suppliers = ref([{ id: "", supplierName: "" }]);
  const workersCount = ref({
    all: "",
    archived: "",
    indutries: [{ id: "", name: "", industryLogo: "", count: 0 }],
  });
  const loggedCompany = ref({
    id: "",
    companyName: "",
    industry: [
      {
        industryLogo: "",
        id: "",
        name: "",
      },
    ],

    siteURL: "",
    businessAddress: "",
    postCode: "",
    country: "",
    state: "",
    yearBusinessStarted: "",
    companyPhoneNumber: "",
    billingAddress: "",
    companyEmailAddress: "",
    companyRegistrationNumber: "",
    companyRegisteredName: "",
    billingPhoneNumber: "",
    BillingEmailAddress: "",
    dailyEmailLimit: 0,
    dailySMSLimit: 0,
    noOfLicence: 0,
    compnayLogo: "",
    favIcon: "",
  });
  const loading = ref(false);

  async function loadCompany(id: any) {
    loading.value = true;
    try {
      const response = await api.get(`/v3/api/company/${id}/`);
      loggedCompany.value = response.data;
      if (response.data.favIcon) {
        changeFavicon(response.data.favIcon);
      }
      loadSuppliers(response.data.id);
    } finally {
      loading.value = false;
    }
  }

  async function toggleScheduleMode() {
    loading.value = true;
    isScheduleMode.value = !isScheduleMode.value;
    localStorage.setItem("isScheduleMode", isScheduleMode.value.toString());
  }

  async function loadSuppliers(id: any = loggedCompany.id) {
    try {
      const response = await api.get(
        `/v3/api/supplier/get_company_suppliers_option/${id}/`
      );
      suppliers.value = response.data ?? [];
    } catch (err) {
      suppliers.value = [];
    }
  }

  async function loadIndustriesWorkersStat(id: any = loggedCompany.id) {
    try {
      const resp = await api.get(`/get_workers_of_industries/${id}`);
      workersCount.value = resp.data ?? [];
    } catch (err) {
      console.log(err);
    }
  }
  async function getIndustryWorkerCount(id: any = 0) {
    return {
      all: "Total Workers",
      archived: "Archived Workers",
      indutries: [
        { id: "1", name: "Industry 1", industryLogo: "Logo1.png", count: 10 },
        { id: "2", name: "Industry 2", industryLogo: "Logo2.png", count: 20 },
        { id: "3", name: "Industry 2", industryLogo: "Logo2.png", count: 30 },
        { id: "4", name: "Industry 2", industryLogo: "Logo2.png", count: 40 },
      ],
    };
  }
  return {
    getIndustryWorkerCount,
    loadIndustriesWorkersStat,
    toggleScheduleMode,
    loadCompany,
    loadSuppliers,
    industries,
    suppliers,
    workersCount,
    loggedCompany,
    loading,
    isScheduleMode,
  } as const;
});

/**
 * Pinia supports Hot Module replacement so you can edit your stores and
 * interact with them directly in your app without reloading the page.
 *
 * @see https://pinia.esm.dev/cookbook/hot-module-replacement.html
 * @see https://vitejs.dev/guide/api-hmr.html
 */
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCompany, import.meta.hot));
}
