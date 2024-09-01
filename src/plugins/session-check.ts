// import { useFetch } from '/@src/composable/useFetch'
import { definePlugin } from "/@src/app";
import { useUserSession } from "/@src/stores/userSession";
import { useApi } from "../composable/useAPI";
import { useLayoutSwitcher } from "/@src/stores/layoutSwitcher";
import { useCompany } from "/@src/stores/company";

const layoutSwitcher = useLayoutSwitcher();
/**
 * Here we are setting up two router navigation guards
 * (note that we can have multiple guards in multiple plugins)
 *
 * We can add meta to pages either by declaring them manualy in the
 * routes declaration (see /@src/router.ts)
 * or by adding a <route> tag into .vue files (see /@src/pages/sidebar/dashboards.ts)
 *
 * <route lang="yaml">
 * meta:
 *   requiresAuth: true
 * </route>
 *
 * <script setup lang="ts">
 *  // TS script
 * </script>
 *
 * <template>
 *  // HTML content
 * </template>
 */
export default definePlugin(async ({ router, pinia }) => {
  const userSession = useUserSession(pinia);
  const api = useApi();
  const company = useCompany();

  // 1. Check token validity at app startup
  if (userSession.isLoggedIn) {
    try {
      // Do api request call to retreive user profile.
      // Note that the api is provided with json-server
      // const response = await api.get("/v3/api/account/get_user_from_token");
      // const user = response.data[0];
      // if (user.company) {
      //   await company.loadCompany(user.company);
      // }

      layoutSwitcher.setDynamicLayoutId("sideblock-default");

      // userSession.setUser(user);
    } catch (err) {
      // delete stored token if it fails
      userSession.logoutUser();
    }
  }

  router.beforeEach((to) => {
    if (to.meta.requiresAuth && !userSession.isLoggedIn) {
      return {
        name: "/auth/login",
        query: { redirect: to.fullPath },
      };
    }
  });
});
