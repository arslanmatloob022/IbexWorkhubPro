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
  const currentCompany = ref({
    id: "",
    name: "",
    trade_name: "",
    zipCode: "",
    city: "",
    state: "",
    country: "",
    address: "",
    phone_number: "",
    email: "",
    website: "",
    logo: "",
    created_at: "",
    updated_at: "",
    sidebar_logo: "",
    favicon: "",
    invoice_header_logo: "",
    login_page_logo: "",
    branding_line: "",
  });
  const loading = ref(false);

  async function loadCompany(id: any = "9cc43feb-b736-4d18-bd87-5d8511b28dea") {
    loading.value = true;
    try {
      const response = await api.get(`/api/company-information/${id}/`);
      currentCompany.value = response.data;
      if (response.data.favIcon) {
        changeFavicon(response.data.favIcon);
      }
    } finally {
      loading.value = false;
    }
  }

  async function toggleScheduleMode() {
    loading.value = true;
    isScheduleMode.value = !isScheduleMode.value;
    localStorage.setItem("isScheduleMode", isScheduleMode.value.toString());
  }
  return {
    toggleScheduleMode,
    loadCompany,
    currentCompany,
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
