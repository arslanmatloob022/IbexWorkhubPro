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
    // If authentication is required but the user is not logged in, redirect to login page
    if (to.meta.requiresAuth && !userSession.isLoggedIn) {
      return {
        name: "/auth/login",
        query: { redirect: to.fullPath },
      };
    }

    // Check user role permissions based on meta tags
    const role = userSession.user.role;

    const roleMetaMapping = {
      supplier: "isPartnerAllowed",
      manager: "isManagerAllowed",
      contractor: "isContractorAllowed",
      worker: "isWorkerAllowed",
      client: "isClientAllowed",
    };

    const metaKey = roleMetaMapping[role];

    if (
      metaKey &&
      (to.meta[metaKey] === false || to.meta[metaKey] === undefined)
    ) {
      return {
        name: "/auth/login",
        query: { redirect: to.fullPath },
      };
    }
    console.log("dfghjlkkl", to.meta); // To see if the meta fields are correctly set
  });

  // router.beforeEach((to) => {
  //   if (to.meta.requiresAuth && !userSession.isLoggedIn) {
  //     return {
  //       name: "/auth/login",
  //       query: { redirect: to.fullPath },
  //     };
  //   }
  //   if (
  //     userSession.user.role === "supplier" &&
  //     (to.meta.isPartnerAllowed === false ||
  //       to.meta.isPartnerAllowed === undefined)
  //   ) {
  //     return {
  //       name: "/auth/login",
  //       query: { redirect: to.fullPath },
  //     };
  //   }
  //   if (
  //     userSession.user.role === "manager" &&
  //     (to.meta.isManagerAllowed === false ||
  //       to.meta.isManagerAllowed === undefined)
  //   ) {
  //     return {
  //       name: "/auth/login",
  //       query: { redirect: to.fullPath },
  //     };
  //   }
  //   if (
  //     userSession.user.role === "contractor" &&
  //     (to.meta.isContractorAllowed === false ||
  //       to.meta.isContractorAllowed === undefined)
  //   ) {
  //     return {
  //       name: "/auth/login",
  //       query: { redirect: to.fullPath },
  //     };
  //   }
  //   if (
  //     userSession.user.role === "worker" &&
  //     (to.meta.isWorkerAllowed === false ||
  //       to.meta.isWorkerAllowed === undefined)
  //   ) {
  //     return {
  //       name: "/auth/login",
  //       query: { redirect: to.fullPath },
  //     };
  //   }
  //   if (
  //     userSession.user.role === "client" &&
  //     (to.meta.isClientAllowed === false ||
  //       to.meta.isClientAllowed === undefined)
  //   ) {
  //     return {
  //       name: "/auth/login",
  //       query: { redirect: to.fullPath },
  //     };
  //   }
  // });
});

/*

// import { useFetch } from '/@src/composable/useFetch'
import { definePlugin } from "/@src/app";
import { useUserSession } from "/@src/stores/userSession";
import { useApi } from "../composable/useAPI";
import { useLayoutSwitcher } from "/@src/stores/layoutSwitcher";
import { useCompany } from "/@src/stores/company";

const router = useRouter();
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
 
export default definePlugin(async ({ router, pinia }) => {
  const userSession = useUserSession(pinia);
  const api = useApi();
  const company = useCompany();

  // 1. Check token validity at app startup
  if (userSession.isLoggedIn) {
    try {
      // Do api request call to retreive user profile.
      // Note that the api is provided with json-server
      const response = await api.get("/v3/api/account/get_user_from_token");
      const user = response.data[0];
      if (user.company) {
        await company.loadCompany(user.company);
      }

      layoutSwitcher.setDynamicLayoutId("sideblock-default");

      userSession.setUser(user);
    } catch (err) {
      // delete stored token if it fails
      userSession.logoutUser();
    }
  }

  // router.beforeEach((to, from, next) => {
  //   if (to.meta.requiresAuth) {
  //     if (!userSession.isLoggedIn) {
  //       next({
  //         path: "/auth/login",
  //         query: { redirect: to.fullPath },
  //       });
  //     } else if (
  //       userSession.user.role === "partner" &&
  //       (to.meta.isPartnerAllowed === false ||
  //         to.meta.isPartnerAllowed === undefined)
  //     ) {
  //       next({ path: "/auth/login-2" });
  //     } else {
  //       // Proceed with the navigation
  //       next();
  //     }
  //   } else {
  //     // Proceed with the navigation if no authentication is required
  //     next();
  //   }
  // });

  router.beforeEach((to) => {
    if (to.meta.requiresAuth) {
      if (!userSession.isLoggedIn) {
        return {
          name: "/",
          query: { redirect: to.fullPath },
        };
      }
      if (
        userSession.user.role == "site_manager" &&
        !to.name?.toString().includes("site-manager")
      ) {
        return {
          name: "/",
          query: { redirect: to.fullPath },
        };
      }
      if (to.meta.isOnlyAdminAllowed && userSession.user.role != "admin") {
        return {
          name: "/",
        };
      }
      if (
        userSession.user.role === "partner" &&
        (to.meta.isPartnerAllowed === false ||
          to.meta.isPartnerAllowed === undefined)
      ) {
        return {
          name: "/",
        };
      }
    }
  });
});

*/
