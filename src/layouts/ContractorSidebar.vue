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
        <li>
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
      <LayoutsMobileSubsidebar
        v-if="isMobileSideblockOpen && activeMobileSubsidebar === 'layout'"
      />
      <!-- <DashboardsMobileSubsidebar
        v-else-if="
          isMobileSideblockOpen && activeMobileSubsidebar === 'dashboard'
        "
      />
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
          <li>
            <RouterLink to="/sidebar/contractor/projects" class="single-link">
              <span class="icon">
                <i class="lnir lnir-list-alt" aria-hidden="true"></i
              ></span>
              My Projects
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/sidebar/contractor/calendar" class="single-link">
              <span class="icon">
                <i class="lnir lnir-calender-alt-1" aria-hidden="true"></i>
              </span>
              Projects calendar
            </RouterLink>
          </li>

          <li>
            <RouterLink to="/sidebar/contractor/profile" class="single-link">
              <span class="icon">
                <i class="lnir lnir-user-alt-2" aria-hidden="true"></i
              ></span>
              Profile
            </RouterLink>
          </li>
        </template>

        <template #bottom-links>
          <!-- <UserProfileDropdown up /> -->
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
              to="/sidebar/contractor/projects"
              class="single-link"
            >
              <span class="icon" id="cus-spanLink">
                <i class="lnir lnir-list-alt" aria-hidden="true"></i>
              </span>
            </RouterLink>
          </li>
          <li>
            <RouterLink
              id="cus-routerLinks"
              to="/sidebar/contractor/calendar"
              class="single-link"
            >
              <span class="icon" id="cus-spanLink">
                <i class="lnir lnir-calender-alt-1" aria-hidden="true"></i>
              </span>
            </RouterLink>
          </li>
          <li>
            <RouterLink
              id="cus-routerLinks"
              to="/sidebar/contractor/profile"
              class="single-link"
            >
              <span class="icon" id="cus-spanLink">
                <i class="lnir lnir-user-alt-2" aria-hidden="true"></i>
              </span>
            </RouterLink>
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

              <ToolbarNotification />

              <a
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
              </a>
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
