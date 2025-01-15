<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useDarkmode } from "/@src/stores/darkmode";
import { usePanels } from "/@src/stores/panels";
import type { SideblockTheme } from "/@src/components/navigation/desktop/Sideblock.vue";
import { useViewWrapper } from "/@src/stores/viewWrapper";
import { useCompany } from "/@src/stores/company";
import { useLayoutSwitcher } from "/@src/stores/layoutSwitcher";
import { useApi } from "../composable/useAPI";
import { useUserSession } from "/@src/stores/userSession";
import { useNotyf } from "../composable/useNotyf";

const notyf = useNotyf();
const mostVisitedPages = ref([
  {
    id: 0,
    page: "",
    count: 0,
    user: 0,
  },
]);
const userSession = useUserSession();
const layoutSwitcher = useLayoutSwitcher();
const router = useRouter();
const route = useRoute();
const api = useApi();
const addJobModalOpen = ref(false);
const invitationModal = ref(false);
const viewWrapper = useViewWrapper();
const panels = usePanels();
const openSideblockLinks = ref("");
const isMobileSideblockOpen = ref(false);
const isDesktopSideblockOpen = ref(true);
const activeMobileSubsidebar = ref(props.defaultSideblock);
const company = useCompany();
const darkmode = useDarkmode();
const { locale } = useI18n();

const props = withDefaults(
  defineProps<{
    theme?: SideblockTheme;
    defaultSideblock?: string;
    closeOnChange?: boolean;
    openOnMounted?: boolean;
    nowrap?: boolean;
  }>(),
  {
    defaultSideblock: "dashboard",
    theme: "default",
  }
);

const workersCount = ref({
  all: 0,
  archived: 0,
  industries: <any>[],
});

const partnersCount = ref({
  all: 0,
  archived: 0,
  industries: <any>[],
});

const localFlagSrc = computed(() => {
  switch (locale.value) {
    case "fr":
      return "/images/icons/flags/france.svg";
    case "es":
      return "/images/icons/flags/spain.svg";
    case "es-MX":
      return "/images/icons/flags/mexico.svg";
    case "de":
      return "/images/icons/flags/germany.svg";
    case "zh-CN":
      return "/images/icons/flags/china.svg";
    case "ar":
      return "/images/icons/flags/saudi-arabia.svg";
    case "en":
    default:
      return "/images/icons/flags/united-states-of-america.svg";
  }
});

watchPostEffect(() => {
  viewWrapper.setPushedBlock(isDesktopSideblockOpen.value ?? false);
});

watchPostEffect(() => {
  layoutSwitcher.setDynamicLayoutId(
    darkmode.isDark ? "sideblock-default" : "sideblock-color"
  );
});

const isSwitchOn = ref(false);

const toggleSwitch = () => {
  company.toggleScheduleMode();
  isSwitchOn.value = company.isScheduleMode;
  notyf.green(
    `The schedule mode is turned ${
      localStorage.getItem("isScheduleMode") == "true" ? "On" : "Off"
    }`
  );
};

const shouldShowButton = computed(() => {
  return route.path !== "/sidebar/company";
});

watch(
  () => route.fullPath,
  (newFullPath, oldFullPath) => {
    isMobileSideblockOpen.value = false;
    if (props.closeOnChange && isDesktopSideblockOpen.value) {
      const shouldCloseSidebar = false;
      if (shouldCloseSidebar) {
        isDesktopSideblockOpen.value = false;
      }
    }
  }
);

onMounted(() => {
  viewWrapper.setPushed(false);
});
</script>

<template>
  <div class="sidebar-layout">
    <!-- Mobile navigation -->
    <MobileNavbar
      :is-open="isMobileSideblockOpen"
      @toggle="isMobileSideblockOpen = !isMobileSideblockOpen"
    >
      <template #brand>
        <RouterLink to="/sidebar/dashboard" class="navbar-item is-brand">
          <AnimatedLogo width="38px" height="38px" style="cursor: pointer" />
        </RouterLink>

        <div class="brand-end">
          <!-- <NotificationsMobileDropdown /> -->
          <UserProfileDropdown />
        </div>
      </template>
    </MobileNavbar>

    <MobileSidebar
      :is-open="isMobileSideblockOpen"
      @toggle="isMobileSideblockOpen = !isMobileSideblockOpen"
    >
      <template #links>
        <li>
          <a
            :class="[activeMobileSubsidebar === 'dashboard' && 'is-active']"
            aria-label="Display dashboard content"
            tabindex="0"
            role="button"
            @keydown.space.prevent="activeMobileSubsidebar = 'dashboard'"
            @click="activeMobileSubsidebar = 'dashboard'"
          >
            <i
              aria-hidden="true"
              class="iconify"
              data-icon="feather:activity"
            />
          </a>
        </li>
        <!-- <li>
          <a
            aria-label="Display layout content"
            :class="[activeMobileSubsidebar === 'layout' && 'is-active']"
            tabindex="0"
            role="button"
            @keydown.space.prevent="activeMobileSubsidebar = 'layout'"
            @click="activeMobileSubsidebar = 'layout'"
          >
            <i aria-hidden="true" class="iconify" data-icon="feather:grid" />
          </a>
        </li>
        <li>
          <a
            aria-label="Display element content"
            :class="[activeMobileSubsidebar === 'elements' && 'is-active']"
            tabindex="0"
            role="button"
            @keydown.space.prevent="activeMobileSubsidebar = 'elements'"
            @click="activeMobileSubsidebar = 'elements'"
          >
            <i aria-hidden="true" class="iconify" data-icon="feather:box" />
          </a>
        </li>
        <li>
          <a
            aria-label="Display components content"
            :class="[activeMobileSubsidebar === 'components' && 'is-active']"
            tabindex="0"
            role="button"
            @keydown.space.prevent="activeMobileSubsidebar = 'components'"
            @click="activeMobileSubsidebar = 'components'"
          >
            <i aria-hidden="true" class="iconify" data-icon="feather:cpu" />
          </a>
        </li>
        <li>
          <RouterLink to="/messaging-v1">
            <i
              aria-hidden="true"
              class="iconify"
              data-icon="feather:message-circle"
            />
          </RouterLink>
        </li> -->
      </template>

      <template #bottom-links>
        <li>
          <!-- <a
            aria-label="Display search panel"
            tabindex="0"
            role="button"
            @keydown.space.prevent="panels.setActive('search')"
            @click="panels.setActive('search')"
          >
            <i aria-hidden="true" class="iconify" data-icon="feather:search" />
          
          </a> -->
          <AnimatedLogo />
        </li>
        <!-- <li>
          <a aria-label="View settings" href="#">
            <i
              aria-hidden="true"
              class="iconify"
              data-icon="feather:settings"
            />
          </a>
        </li> -->
      </template>
    </MobileSidebar>

    <!-- My editing -->
    <!-- <MobileSidebar
      :is-open="isMobileSideblockOpen"
      @toggle="isMobileSideblockOpen = !isMobileSideblockOpen"
    >
      <template #links>
        <li>
          <a
            @click="router.push('/sidebar/dashboard')"
            :class="[activeMobileSubsidebar === 'dashboard' && 'is-active']"
            aria-label="Display dashboard content"
            tabindex="0"
            role="button"
          >
            <i aria-hidden="true" class="iconify" data-icon="feather:grid" />
          </a>
        </li>
        <li>
          <a
            @click="router.push('/sidebar/dashboard/manage-projects')"
            aria-label="Display layout content"
            :class="[activeMobileSubsidebar === 'layout' && 'is-active']"
            tabindex="0"
            role="button"
          >
            <i aria-hidden="true" class="iconify" data-icon="feather:grid" />
          </a>
        </li>
        <li>
          <a
            @click="router.push('/sidebar/dashboard/projects')"
            aria-label="Display element content"
            :class="[activeMobileSubsidebar === 'elements' && 'is-active']"
            tabindex="0"
            role="button"
          >
            <i aria-hidden="true" class="iconify" data-icon="feather:box" />
          </a>
        </li>
        <li>
          <a
            @click="router.push('/sidebar/dashboard/projects')"
            aria-label="Display components content"
            :class="[activeMobileSubsidebar === 'components' && 'is-active']"
            tabindex="0"
            role="button"
          >
            <i aria-hidden="true" class="iconify" data-icon="feather:cpu" />
          </a>
        </li>
        <li>
          <a
            @click="router.push('/sidebar/dashboard/projects')"
            aria-label="Display components content"
            :class="[activeMobileSubsidebar === 'components' && 'is-active']"
            tabindex="0"
            role="button"
          >
            <i aria-hidden="true" class="iconify" data-icon="feather:cpu" />
          </a>
        </li>
      </template>

      <template #bottom-links>
        <li>
          <a
            aria-label="Display search panel"
            tabindex="0"
            role="button"
            @keydown.space.prevent="panels.setActive('search')"
            @click="panels.setActive('search')"
          >
            <i aria-hidden="true" class="iconify" data-icon="feather:search" />
          </a>
        </li>
        <li>
          <a aria-label="View settings" href="#">
            <i
              aria-hidden="true"
              class="iconify"
              data-icon="feather:settings"
            />
          </a>
        </li>
      </template>
    </MobileSidebar> -->

    <!-- Mobile subsidebar links -->
    <Transition name="slide-x">
      <CustomAdminMobileSidebar
        v-if="isMobileSideblockOpen && activeMobileSubsidebar === 'dashboard'"
      />
      <LayoutsMobileSubsidebar
        v-else-if="isMobileSideblockOpen && activeMobileSubsidebar === 'layout'"
      />
      <!--
      <ComponentsMobileSubsidebar
        v-else-if="
          isMobileSideblockOpen && activeMobileSubsidebar === 'components'
        "
      />
      <ElementsMobileSubsidebar
        v-if="isMobileSideblockOpen && activeMobileSubsidebar === 'elements'"
      /> -->
    </Transition>

    <!-- Desktop navigation -->
    <CircularMenu />

    <Transition name="slide-x">
      <!-- open menu -->
      <Sideblock
        class="is-curved is-colored"
        v-if="isDesktopSideblockOpen"
        :theme="props.theme"
      >
        <template #header>
          <div
            @click="router.push('/sidebar/dashboard')"
            style="
              width: 280px;
              margin-top: 20px;
              margin-left: 20px;
              height: 100%;
              overflow: hidden;
            "
          >
            <img
              style="
                width: auto;
                height: 100%;
                display: block;
                margin: 0;
                border-radius: 12px;
                cursor: pointer;
              "
              @click="router.push('/sidebar/dashboard')"
              src="/logos/ibexwhite.png"
            />
          </div>

          <div
            @keydown.space.prevent="
              isDesktopSideblockOpen = !isDesktopSideblockOpen
            "
            @click="isDesktopSideblockOpen = !isDesktopSideblockOpen"
            style="width:100%; display:flex, align-items:right;"
          >
            <span v-if="isDesktopSideblockOpen">
              <img
                style="height: 26px; width: 24px; cursor: pointer; float: right"
                src="/images/icons/sidebarclose.png"
              />
            </span>
          </div>
        </template>

        <template #links>
          <!-- Dashboard -->
          <li>
            <RouterLink to="/sidebar/dashboard" class="single-link">
              <span class="icon">
                <i class="lnir lnir-bar-chart" aria-hidden="true"></i>
              </span>
              <span> Dashboard </span>
              <!-- <span class="badge">5</span> -->
            </RouterLink>
          </li>

          <!-- proescts -->
          <VCollapseLinks
            v-model:open="openSideblockLinks"
            collapse-id="Projects"
            class="collapse-wrap"
          >
            <!-- :class="[isOpen && 'active']" -->
            <template #header>
              <div class="icon">
                <i class="lnir lnir-list-alt-1" aria-hidden="true"></i>
              </div>
              <span>Projects</span>
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
              class="is-submenu"
              to="/sidebar/dashboard/projects"
              :class="{ active: 'projects' === route.query.tab }"
            >
              <i class="lnir lnir-list-alt" aria-hidden="true"></i>
              <span>All Projects</span>
            </RouterLink>

            <RouterLink
              class="is-submenu"
              to="/sidebar/dashboard/manage-projects"
              :class="{ active: 'manage-projects' === route.query.tab }"
            >
              <i class="lnir lnir-appointment" aria-hidden="true"></i>
              <span>Manage Projects</span>
            </RouterLink>

            <RouterLink
              class="is-submenu"
              to="/sidebar/dashboard/workers-tasks"
              :class="{ active: 'workers-tasks' === route.query.tab }"
            >
              <i class="lnir lnir-calendar" aria-hidden="true"></i>
              <span>Workers chart</span>
            </RouterLink>

            <RouterLink
              class="is-submenu"
              to="/sidebar/dashboard/completed-projects"
              :class="{
                active: 'pre-construction' === route.query.tab,
              }"
            >
              <i class="lnir lnir-list" aria-hidden="true"></i>
              <span>Completed Projects</span>
            </RouterLink>
          </VCollapseLinks>

          <!-- <li>
            <RouterLink to="/sidebar/dashboard/managers" class="single-link">
              <span class="icon">
                <i class="lnir lnir-user-alt-1" aria-hidden="true"></i
              ></span>
              Managers
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/sidebar/dashboard/contractors" class="single-link">
              <span class="icon">
                <i class="lnir lnir-user-alt-2" aria-hidden="true"></i
              ></span>
              Contractors
            </RouterLink>
          </li>
          <li>
            <RouterLink
              to="/sidebar/dashboard/subcontractors"
              class="single-link"
            >
              <span class="icon">
                <i class="lnir lnir-users" aria-hidden="true"></i
              ></span>
              Sub Contractors
            </RouterLink>
          </li>

          <li>
            <RouterLink to="/sidebar/dashboard/workers" class="single-link">
              <span class="icon">
                <i class="lnir lnir-network" aria-hidden="true"></i
              ></span>
              Workers
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/sidebar/dashboard/clients" class="single-link">
              <span class="icon">
                <i class="lnir lnir-briefcase-alt" aria-hidden="true"></i
              ></span>
              Clients
            </RouterLink>
          </li> -->

          <VCollapseLinks
            v-model:open="openSideblockLinks"
            collapse-id="users"
            class="collapse-wrap"
          >
            <!-- :class="[isOpen && 'active']" -->
            <template #header>
              <div class="icon">
                <i class="lnir lnir-users" aria-hidden="true"></i>
              </div>
              <span>System Users</span>
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

            <RouterLink to="/sidebar/dashboard/clients" class="is-submenu">
              <span class="icon">
                <i class="lnir lnir-user-alt-2" aria-hidden="true"></i
              ></span>
              Clients
            </RouterLink>

            <RouterLink to="/sidebar/dashboard/managers" class="is-submenu">
              <span class="icon">
                <i class="lnir lnir-user-alt-1" aria-hidden="true"></i
              ></span>
              Managers
            </RouterLink>

            <RouterLink to="/sidebar/dashboard/contractors" class="is-submenu">
              <span class="icon">
                <i class="lnir lnir-user-alt" aria-hidden="true"></i
              ></span>
              Contractors
            </RouterLink>

            <RouterLink
              to="/sidebar/dashboard/subcontractors"
              class="is-submenu"
            >
              <span class="icon">
                <i class="lnir lnir-user" aria-hidden="true"></i
              ></span>
              Sub Contractors
            </RouterLink>

            <RouterLink to="/sidebar/dashboard/workers" class="is-submenu">
              <span class="icon">
                <i class="lnir lnir-users" aria-hidden="true"></i
              ></span>
              Workers
            </RouterLink>
          </VCollapseLinks>

          <VCollapseLinks
            v-model:open="openSideblockLinks"
            collapse-id="payments"
            class="collapse-wrap"
            v-if="
              userSession.user.id == 'f6c283ec-9499-4983-997c-0456362e6650' ||
              userSession.user.id == '73462666-c7f0-41eb-b978-24f5ffe7a539'
            "
          >
            <!-- :class="[isOpen && 'active']" -->
            <template #header>
              <div class="icon">
                <i class="lnir lnir-bank" aria-hidden="true"></i>
              </div>
              <span>Finance</span>
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
              class="is-submenu"
              to="/sidebar/dashboard/create-payment"
              :class="{ active: 'projects' === route.query.tab }"
            >
              <i class="lnir lnir-paypal" aria-hidden="true"></i>
              <span>Create Payment</span>
            </RouterLink>
            <RouterLink
              class="is-submenu"
              to="/sidebar/dashboard/received-payments"
              :class="{ active: 'received-payments' === route.query.tab }"
            >
              <i class="lnir lnir-invest-monitor" aria-hidden="true"></i>
              <span>All Payments</span>
            </RouterLink>

            <RouterLink
              class="is-submenu"
              to="/sidebar/dashboard/approved-payments"
              :class="{ active: 'approved-payments' === route.query.tab }"
            >
              <i class="lnir lnir-diagnosis-alt" aria-hidden="true"></i>
              <span>Approved Payments </span>
            </RouterLink>
          </VCollapseLinks>
          <VCollapseLinks
            v-model:open="openSideblockLinks"
            collapse-id="estimates"
            class="collapse-wrap"
          >
            <!-- :class="[isOpen && 'active']" -->
            <template #header>
              <div class="icon">
                <i class="lnir lnir-library" aria-hidden="true"></i>
              </div>
              <span>Leads & Jobs</span>
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
              class="is-submenu"
              to="/sidebar/dashboard/leads"
              :class="{ active: 'leads' === route.query.tab }"
            >
              <i class="lnir lnir-cloud-search" aria-hidden="true"></i>
              <span>Lead Opportunity</span>
            </RouterLink>
            <RouterLink class="is-submenu" to="/sidebar/dashboard/proposals">
              <i class="lnir lnir-add-files" aria-hidden="true"></i>
              <span>Lead Proposals</span>
            </RouterLink>
            <RouterLink
              class="is-submenu"
              to="/sidebar/dashboard/proposal-templates"
            >
              <i class="lnir lnir-files" aria-hidden="true"></i>
              <span>Proposals Templates</span>
            </RouterLink>
            <RouterLink
              class="is-submenu"
              to="/sidebar/dashboard/jobs"
              :class="{ active: 'projects' === route.query.tab }"
            >
              <i class="lnir lnir-suitcase" aria-hidden="true"></i>
              <span>Jobs</span>
            </RouterLink>
          </VCollapseLinks>
          <li>
            <RouterLink to="/sidebar/dashboard/profile" class="single-link">
              <span class="icon">
                <i class="lnir lnir-user-alt-2" aria-hidden="true"></i
              ></span>
              Profile
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/sidebar/settings" class="single-link">
              <span class="icon">
                <i class="lnir lnir-cogs" aria-hidden="true"></i
              ></span>
              Settings
            </RouterLink>
          </li>
        </template>

        <template #bottom-links>
          <!-- <UserProfileDropdown left /> -->
          <div class="pb-3 arez-version">
            <!-- <p style="font-weight: 500">Powered by CodeSphere Studios</p>
            <p style="font-weight: 500; font-size: 10px">Version 3.04</p> -->
          </div>
        </template>
      </Sideblock>
      <!-- collapsed menu -->
      <Sideblock
        style="width: 100px"
        class="is-curved"
        :theme="props.theme"
        v-else
      >
        <template #header>
          <div
            style="
              width: 100%;
              height: 100%;
              margin-top: 60px;
              display: flex;
              gap: 12px;
              flex-direction: column;
              justify-content: center;
              align-items: center;
            "
          >
            <div
              style="
                width: 100%;
                height: auto;
                display: flex;
                justify-content: center;
                border-radius: 16px;
                align-items: center;
              "
            >
              <img
                style="
                  width: 120px;
                  height: 100%;
                  background-color: transparent;
                  border-radius: 12px;
                  display: block;
                "
                src="/logos/ibexwhite.png"
              />
            </div>

            <div
              @keydown.space.prevent="
                isDesktopSideblockOpen = !isDesktopSideblockOpen
              "
              @click="isDesktopSideblockOpen = !isDesktopSideblockOpen"
              style="margin-top:16px; display:flex, justify-content:center; align-items:center; "
            >
              <span class="menu-toggle has-chevron">
                <img
                  style="height: 22px; width: 20px; cursor: pointer"
                  src="/images/icons/sidebarOpen.png"
                />
              </span>
            </div>
          </div>
        </template>

        <template #links>
          <!-- dashboard -->
          <li>
            <RouterLink
              id="cus-routerLinks"
              to="/sidebar/dashboard"
              class="single-link"
            >
              <span class="icon" id="cus-spanLink">
                <i class="lnir lnir-bar-chart" aria-hidden="true"></i>
              </span>
            </RouterLink>
          </li>

          <!-- workers -->
          <li>
            <VCollapseLinks
              v-model:open="openSideblockLinks"
              collapse-id="reports"
            >
              <template #header>
                <span class="icon" id="cus-spanLink">
                  <i class="lnir lnir-list-alt-1" aria-hidden="true"></i>
                </span>
              </template>

              <RouterLink class="is-submenu" to="/sidebar/dashboard/projects">
                <span class="icon" id="cus-spanLink">
                  <i class="lnir lnir-list-alt" aria-hidden="true"></i>
                </span>
              </RouterLink>
              <RouterLink
                class="is-submenu"
                to="/sidebar/dashboard/manage-projects"
              >
                <span class="icon" id="cus-spanLink">
                  <i class="lnir lnir-appointment" aria-hidden="true"></i>
                </span>
              </RouterLink>
              <RouterLink
                class="is-submenu"
                to="/sidebar/dashboard/workers-tasks"
              >
                <span class="icon" id="cus-spanLink">
                  <i class="lnir lnir-calendar" aria-hidden="true"></i>
                </span>
              </RouterLink>
            </VCollapseLinks>
          </li>

          <!-- Managers -->
          <li>
            <RouterLink to="/sidebar/dashboard/managers" class="single-link">
              <span class="icon" id="cus-spanLink">
                <i class="lnir lnir-user-alt-1" aria-hidden="true"></i>
              </span>
            </RouterLink>
          </li>

          <!-- Contractors -->
          <li>
            <RouterLink to="/sidebar/dashboard/contractors" class="single-link">
              <span class="icon" id="cus-spanLink">
                <i class="lnir lnir-user-alt-2" aria-hidden="true"></i>
              </span>
            </RouterLink>
          </li>

          <!-- sub Contractors -->
          <li>
            <RouterLink
              to="/sidebar/dashboard/subcontractors"
              class="single-link"
            >
              <span class="icon" id="cus-spanLink">
                <i class="lnir lnir-users" aria-hidden="true"></i>
              </span>
            </RouterLink>
          </li>

          <li>
            <RouterLink to="/sidebar/dashboard/workers" class="single-link">
              <span class="icon" id="cus-spanLink">
                <i class="lnir lnir-network" aria-hidden="true"></i>
              </span>
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/sidebar/dashboard/clients" class="single-link">
              <span class="icon" id="cus-spanLink">
                <i class="lnir lnir-briefcase-alt" aria-hidden="true"></i>
              </span>
            </RouterLink>
          </li>

          <!-- service Partners -->
          <li>
            <VCollapseLinks
              v-model:open="openSideblockLinks"
              collapse-id="contractors"
            >
              <template #header>
                <span class="icon" id="cus-spanLink">
                  <i class="lnir lnir-bank" aria-hidden="true"></i>
                </span>
              </template>
              <RouterLink
                class="is-submenu"
                to="/sidebar/dashboard/create-payment"
              >
                <span class="icon" id="cus-spanLink">
                  <i class="lnir lnir-paypal" aria-hidden="true"></i>
                </span>
              </RouterLink>
              <RouterLink
                class="is-submenu"
                to="/sidebar/dashboard/received-payments"
              >
                <span class="icon" id="cus-spanLink">
                  <i class="lnir lnir-invest-monitor" aria-hidden="true"></i>
                </span>
              </RouterLink>
              <RouterLink
                class="is-submenu"
                to="/sidebar/dashboard/received-payments"
              >
                <span class="icon" id="cus-spanLink">
                  <i class="lnir lnir-diagnosis-alt" aria-hidden="true"></i>
                </span>
              </RouterLink>
            </VCollapseLinks>
          </li>

          <!-- workers -->
          <li>
            <VCollapseLinks
              v-model:open="openSideblockLinks"
              collapse-id="reports"
            >
              <template #header>
                <span class="icon" id="cus-spanLink">
                  <i class="iconify" data-icon="feather:users"></i>
                </span>
              </template>
              <RouterLink
                to="/sidebar/dashboard/workers?type=All"
                :class="{ 'active-link': 'All' === route.query.type }"
                style="
                  display: flex;
                  flex-direction: column;
                  font-family: var(--font);
                  justify-content: center;
                  background-color: transparent !important;
                  align-items: center;
                  font-size: 0.9rem;
                  font-weight: 400;
                "
              >
                <img
                  src="/images/photo/multiUsers.png"
                  style="
                    border-radius: 8px;
                    height: 25px;
                    width: 25px;
                    background-color: #f8f8f8;
                    padding: 1px;
                  "
                />
              </RouterLink>

              <RouterLink
                v-for="(item, index) in company.loggedCompany.industry"
                :key="index"
                :to="`/sidebar/dashboard/workers?type=${item.name}`"
                :class="{ 'active-link': item.name === route.query.type }"
                style="
                  display: flex;
                  flex-direction: column;
                  font-family: var(--font);
                  background-color: transparent !important;
                  align-items: center;
                  font-size: 0.9rem;
                  font-weight: 400;
                "
              >
                <img
                  :src="item.industryLogo"
                  style="
                    border-radius: 8px;
                    height: 25px;
                    width: 25px;
                    background-color: #f8f8f8;
                    padding: 1px;
                  "
                />
              </RouterLink>

              <!-- archive link -->
              <RouterLink
                to="/sidebar/dashboard/workers?archive=true"
                :class="{ 'active-link': 'true' === route.query.archive }"
                style="
                  padding: 0;
                  background-color: transparent !important;
                  display: flex;
                  flex-direction: column;
                  font-family: var(--font);
                  align-items: center;
                  font-size: 0.9rem;
                  font-weight: 400;
                "
              >
                <img
                  src="/images/photo/archiveUser.png"
                  style="
                    border-radius: 8px;
                    padding: 1px;
                    height: 25px;
                    width: 25px;
                    background-color: #f8f8f8;
                  "
                />
              </RouterLink>
            </VCollapseLinks>
          </li>
        </template>

        <!-- user profile -->
        <template #bottom-links>
          <!-- <UserProfileDropdown up /> -->
        </template>
      </Sideblock>
    </Transition>

    <LanguagesPanel />
    <ActivityPanel />
    <SearchPanel />
    <TaskPanel />

    <VViewWrapper class="mt-0" :full="isDesktopSideblockOpen">
      <VPageContentWrapper>
        <template v-if="props.nowrap">
          <slot />
        </template>
        <VPageContent v-else class="is-relative">
          <div class="page-title has-text-centered">
            <!-- Sidebar Trigger -->
            <div
              class="vuero-hamburger nav-trigger push-resize"
              tabindex="0"
              role="button"
            >
              <span
                v-if="shouldShowButton"
                @click="
                  () => {
                    router.go(-1);
                  }
                "
                class="menu-toggle has-chevron"
              >
                <span>
                  <i
                    style="color: var(--primary); background-color: transparent"
                    class="lnir lnir-chevron-left"
                    aria-hidden="true"
                  ></i>
                </span>
              </span>
            </div>

            <div class="title-wrap is-flex cu-align-center">
              <h1 class="title is-4 mr-2">
                {{ viewWrapper.pageTitle }}
              </h1>

              <VField class="m-0">
                <VControl>
                  <VSwitchBlock
                    color="info"
                    v-model="isSwitchOn"
                    @click="toggleSwitch"
                    label="Schedule mode"
                    thin
                  />
                </VControl>
              </VField>
            </div>

            <!-- toolbar -->
            <div class="toolbar">
              <SearchWorkerInput />

              <!-- <ToolbarNotification /> -->

              <!-- <a
                class="toolbar-link right-panel-trigger"
                aria-label="View activity panel"
                tabindex="0"
                role="button"
                @keydown.space.prevent="panels.setActive('activity')"
                @click="panels.setActive('activity')"
              >
                <i
                  aria-hidden="true"
                  class="iconify"
                  data-icon="feather:grid"
                />
              </a> -->
              <!-- darkmode -->
              <div class="toolbar-link">
                <label
                  tabindex="0"
                  class="dark-mode"
                  role="button"
                  @keydown.space.prevent="
                    (e) => (e.target as HTMLLabelElement).click()
                  "
                >
                  <input
                    data-cy="dark-mode-toggle"
                    type="checkbox"
                    :checked="!darkmode.isDark"
                    @change="darkmode.onChange"
                  />
                  <span />
                </label>
              </div>

              <!-- User Profile -->
              <UserProfileDropdown />
            </div>
          </div>

          <slot />
        </VPageContent>
      </VPageContentWrapper>
    </VViewWrapper>
  </div>

  <InvitationLink
    v-if="invitationModal"
    :invitationModal="invitationModal"
    @update:modalHandler="(value: boolean) => (invitationModal = value)"
  />
</template>

<style lang="scss" scoped>
.arez-version {
  p {
    color: var(--white);
  }
}

.is-dark {
  .arez-version {
    p {
      color: black;
    }
  }
}

.icon-iconify {
  &:hover {
    color: var(--white);
  }
}

.icon-iconify:hover {
  color: var(--white);
}
</style>
