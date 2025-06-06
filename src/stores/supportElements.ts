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
import { useUserSession } from "./userSession";
import { convertUrlToFile } from "../composable/useSupportElement";

export const useElements = defineStore("elements", () => {
  const api = useApi();
  const userSession = useUserSession();
  const selectedIcon = ref<any>({
    url: "",
    file: "",
    title: "",
  });

  const isOpenTemplateModal = ref(false);
  const loading = ref(false);
  const templateIcons = ref([
    {
      id: "",
      title: "",
      icon: "",
    },
  ]);
  const clear = () => {
    selectedIcon.url = null;
    selectedIcon.file = null;
    selectedIcon.title = null;
  };
  const openTemplateModal = () => {
    isOpenTemplateModal.value = true;
  };
  const closeTemplateModal = () => {
    isOpenTemplateModal.value = false;
    clear();
  };
  async function loadIcons() {
    loading.value = true;
    try {
      const response = await api.get(`/v3/api/template-icons/`);
      templateIcons.value = response.data;
      console.log("icons", templateIcons.value);
    } finally {
      loading.value = false;
    }
  }

  async function setIcon(chosenIcon: any) {
    const foundIcon = templateIcons.value.find(
      (icon) => icon.id == chosenIcon.id
    );
    if (foundIcon) {
      selectedIcon.value = { url: foundIcon.icon, title: foundIcon.title };
      isOpenTemplateModal.value = false;
    } else {
      console.error("Icon not found in template icons:", chosenIcon);
    }
  }

  async function getUserPermissions(id: string = "") {
    try {
      const response = await api.get(
        `/api/generic-modules/user-permissions-mapping/${id}/`
      );
      userSession.setUserPermissions(response.data);
    } catch (error) {
      console.error("Error fetching user permissions:", error);
    }
  }

  return {
    setIcon,
    loadIcons,
    openTemplateModal,
    closeTemplateModal,
    clear,
    getUserPermissions,
    isOpenTemplateModal,
    templateIcons,
    loading,
    selectedIcon, // Also expose selectedIcon for use in components
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
  import.meta.hot.accept(acceptHMRUpdate(useElements, import.meta.hot));
}
