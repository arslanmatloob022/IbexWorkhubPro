<script lang="ts" setup>
import { useRoute } from "vue-router";
import {
  routerLinks,
  workerRouterLinks,
  managerRouterLinks,
  contractorRouterLinks,
  clientRouterLinks,
} from "/@src/composable/CommonScripts/sideBarRoutes";
import { useUserSession } from "/@src/stores/userSession";
const userSession = useUserSession();
const userRouterLinks = ref({
  worker: workerRouterLinks,
  client: clientRouterLinks,
  manager: managerRouterLinks,
  contractor: contractorRouterLinks,
  admin: routerLinks,
  superAdmin: routerLinks,
});
</script>
<template>
  <div class="mobile-subsidebar">
    <div class="inner">
      <div class="sidebar-title">
        <h3>Ibex WorkHub</h3>
      </div>

      <ul class="submenu" data-simplebar>
        <template
          v-for="link in userRouterLinks[userSession.user.role]"
          :key="link.title"
        >
          <li v-if="link.linkType == 'single'">
            <RouterLink :to="link.route"> {{ link.title }} </RouterLink>
          </li>

          <VCollapseLinks v-else-if="link.linkType == 'collapse'">
            <template #header>
              {{ link.headerTitle }}
              <i
                aria-hidden="true"
                class="iconify rtl-hidden"
                data-icon="feather:chevron-right"
              />
              <i
                aria-hidden="true"
                class="iconify ltr-hidden"
                data-icon="feather:chevron-left"
              />
            </template>

            <RouterLink
              v-for="child in link.children"
              :to="child.route"
              class="is-submenu"
            >
              <i :class="child.icon" aria-hidden="true"></i>
              <span>{{ child.title }}</span>
            </RouterLink>
          </VCollapseLinks>
        </template>

        <li class="divider" />
      </ul>
    </div>
  </div>
</template>
