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

const userSession = useUserSession();
const layoutSwitcher = useLayoutSwitcher();
const router = useRouter();
const route = useRoute();
const api = useApi();
const supplierInfo = ref({
  partnerLogo: "",
});
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

const getIndustryWorkerCount = (id: any) => {
  const industry = workersCount.value.industries.find(
    (item: any) => item.id === id
  );
  return industry ? industry.count : 0;
};

const getIndustryPartnerCount = (id: any) => {
  const industry = partnersCount.value.industries.find(
    (item: any) => item.id === id
  );
  return industry ? industry.count : 0;
};

const getIndustryWorkersCount = async () => {
  try {
    const resp = await api.get(
      `/v3/api/company/${company.loggedCompany.id}/get_company_industry_workers_count/`
    );
    workersCount.value = resp.data;
    console.log("counts", resp.data);
  } catch (err) {
    console.log(err);
  }
};

const getIndustryPartnersCount = async () => {
  try {
    const resp = await api.get(
      `/v3/api/supplier/${company.loggedCompany.id}/industry_partners_count/`
    );
    partnersCount.value = resp.data;
    console.log("part counts", resp.data);
  } catch (err) {
    console.log(err);
  }
};

const getSupplierInfo = async () => {
  try {
    const resp = await api.get(
      `/v3/api/supplier/${userSession.user.partner}/detail/`
    );
    supplierInfo.value = resp.data;
    console.log("logoo", supplierInfo.value);
  } catch (err) {
    console.log(err);
  }
};

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
onMounted(() => {
  viewWrapper.setPushed(false);
});

const shouldShowButton = computed(() => {
  return route.path !== "/sidebar/partner";
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

onActivated(async () => {
  await getIndustryWorkersCount();
  await getIndustryPartnersCount();
  if (userSession.user.role == "partner") {
    getSupplierInfo();
  }
});

onMounted(async () => {
  await getIndustryWorkersCount();
  await getIndustryPartnersCount();
  if (userSession.user.role == "partner") {
    getSupplierInfo();
  }
});
</script>

<template>
  <div class="sidebar-layout">
    <!-- <df-messenger
      class="df-messenger"
      project-id="earnflex-frontier"
      agent-id="66271cd5-26e9-4a25-9c2b-6bc2329eef22"
      language-code="en"
      max-query-length="-1"
    >
      <df-messenger-chat-bubble chat-title="Arez FAQ&#x27;s">
      </df-messenger-chat-bubble>
    </df-messenger> -->
    <!-- Mobile navigation -->
    <!-- <MobileNavbar
      :is-open="isMobileSideblockOpen"
      @toggle="isMobileSideblockOpen = !isMobileSideblockOpen"
    >
      <template #brand>
        <RouterLink to="/" class="navbar-item is-brand">
          <AnimatedLogo width="38px" height="38px" />
        </RouterLink>

        <div class="brand-end">
          <NotificationsMobileDropdown />
          <UserProfileDropdown />
        </div>
      </template>
    </MobileNavbar> -->

    <!-- <MobileSidebar
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
    </MobileSidebar> -->

    <!-- Mobile subsidebar links -->
    <!-- <Transition name="slide-x">
      <LayoutsMobileSubsidebar
        v-if="isMobileSideblockOpen && activeMobileSubsidebar === 'layout'"
      />
      <DashboardsMobileSubsidebar
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
        v-else-if="
          isMobileSideblockOpen && activeMobileSubsidebar === 'elements'
        "
      />
    </Transition> -->

    <!-- Desktop navigation -->
    <CircularMenu />

    <Transition name="slide-x">
      <!-- open menu -->
      <Sideblock
        v-if="isDesktopSideblockOpen || isMobileSideblockOpen"
        :theme="props.theme"
      >
        <template #header>
          <div
            @click="router.push('/sidebar/company')"
            style="
              width: 280px;
              margin-top: 20px;
              margin-left: 20px;
              height: 100%;
              overflow: hidden;
            "
          >
            <img
              v-if="userSession.user.role == 'partner'"
              style="
                width: auto;
                height: 100%;
                display: block;
                margin: 0;
                border-radius: 12px;
              "
              @click="router.push('/sidebar/partner/profile')"
              :src="
                supplierInfo
                  ? supplierInfo.partnerLogo
                  : '/images/logos/smallarezdarkversion.svg'
              "
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
            <RouterLink to="/sidebar/partner/dashboard" class="single-link">
              <span class="icon">
                <i class="iconify" data-icon="feather:grid" />
              </span>
              Dashboard
            </RouterLink>
          </li>

          <!-- Service partners -->
          <!-- <VCollapseLinks
            v-model:open="openSideblockLinks"
            collapse-id="contractors"
          >
            <template #header>
              <div
                :style="{ color: darkmode.isDark ? '#585858' : '#ffffff' }"
                class="icon"
              >
                <i class="iconify" data-icon="feather:user" />
              </div>
              <span :style="{ color: darkmode.isDark ? '#585858' : '' }">
                Service Partners
              </span>
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
              to="/sidebar/company/supplier"
              :class="{ 'cus-active-link': 'All' === route.query.type }"
              style="
                display: flex;
                gap: 10px;
                font-family: var(--font);
                background-color: transparent !important;
                align-items: center;
                padding: 0 2rem 0 3.5rem;
                font-size: 0.9rem;
                font-weight: 400;
              "
            >
              <img
                src="/images/photo/multiUsers.png"
                style="
                  border-radius: 8px;
                  padding: 1px;
                  height: 25px;
                  width: 25px;
                  background-color: #f8f8f8;
                "
              />

              <span
                class="icon-iconify"
                style="
                  display: flex;
                  font-weight: 400;
                  font-family: var(--font);
                  align-items: center;
                  background-color: transparent !important;
                  font-size: 0.9rem;
                "
                :style="{ color: darkmode.isDark ? '#585858' : '#f1f1f1' }"
                >All
                <span
                  style="
                    font-size: 10px;
                    background-color: transparent !important;
                  "
                  class="ml-2"
                >
                  ({{ partnersCount.all }})</span
                >
              </span>
            </RouterLink>

            <RouterLink
              v-for="(item, index) in company.loggedCompany.industry"
              :key="index"
              :to="`/sidebar/company/supplier?type=${item.name}`"
              :class="{ 'cus-active-link': item.name === route.query.type }"
              style="
                display: flex;
                font-family: var(--font);
                align-items: center;
                padding: 0 2rem 0 3.5rem;
                background-color: transparent !important;
                font-size: 0.9rem;
                font-weight: 400;
              "
            >
              <img
                :src="item.industryLogo"
                style="
                  height: 25px;
                  width: 25px;
                  border-radius: 8px;
                  background-color: #f8f8f8;
                  margin-inline-end: 10px;
                "
              />
              <span
                style="background-color: transparent !important"
                :style="{ color: darkmode.isDark ? '#585858' : '#fff' }"
                >{{ item.name }}
                <span
                  style="
                    font-size: 10px;
                    background-color: transparent !important;
                  "
                  class="ml-2"
                >
                  ({{ getIndustryPartnerCount(item.id) }})
                </span></span
              >
            </RouterLink>
          </VCollapseLinks> -->

          <!-- Workers  -->
          <VCollapseLinks
            v-model:open="openSideblockLinks"
            collapse-id="reports"
          >
            <template #header>
              <div
                :style="{ color: darkmode.isDark ? '#585858' : '#ffffff' }"
                class="icon"
              >
                <i class="iconify" data-icon="feather:users" />
              </div>
              <span :style="{ color: darkmode.isDark ? '#585858' : '' }">
                Workers
              </span>
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
              to="/sidebar/partner/workers?type=All"
              :class="{ 'cus-active-link': 'All' === route.query.type }"
              style="
                display: flex;
                gap: 10px;
                font-family: var(--font);
                background-color: transparent !important;
                align-items: center;
                padding: 0 2rem 0 3.5rem;
                font-size: 0.9rem;
                font-weight: 400;
              "
            >
              <img
                src="/images/photo/multiUsers.png"
                style="
                  border-radius: 8px;
                  padding: 1px;
                  height: 25px;
                  width: 25px;
                  background-color: #f8f8f8;
                "
              />

              <span
                class="icon-iconify"
                style="
                  display: flex;
                  font-weight: 400;
                  font-family: var(--font);
                  align-items: center;
                  background-color: transparent !important;
                  font-size: 0.9rem;
                "
                :style="{ color: darkmode.isDark ? '#585858' : '#f1f1f1' }"
                >All
                <span
                  style="
                    font-size: 10px;
                    background-color: transparent !important;
                  "
                  class="ml-2"
                >
                  ({{ workersCount.all }})</span
                >
              </span>
            </RouterLink>

            <RouterLink
              v-for="(item, index) in company.loggedCompany.industry"
              :key="index"
              :to="`/sidebar/partner/workers?type=${item.name}`"
              :class="{ 'cus-active-link': item.name === route.query.type }"
              style="
                display: flex;
                font-family: var(--font);
                align-items: center;
                padding: 0 2rem 0 3.5rem;
                background-color: transparent !important;
                font-size: 0.9rem;
                font-weight: 400;
              "
            >
              <img
                :src="item.industryLogo"
                style="
                  height: 25px;
                  width: 25px;
                  border-radius: 8px;
                  background-color: #f8f8f8;
                  margin-inline-end: 10px;
                "
              />
              <span
                style="background-color: transparent !important"
                :style="{ color: darkmode.isDark ? '#585858' : '#fff' }"
                >{{ item.name }}
                <span
                  style="
                    font-size: 10px;
                    background-color: transparent !important;
                  "
                  class="ml-2"
                >
                  ({{ getIndustryWorkerCount(item.id) }})
                </span></span
              >
            </RouterLink>
            <RouterLink
              to="/sidebar/partner/workers?archive=true"
              :class="{ 'cus-active-link': 'true' === route.query.archive }"
              style="
                display: flex;
                gap: 10px;
                font-family: var(--font);
                align-items: center;
                padding: 0 2rem 0 3.5rem;
                background-color: transparent !important;
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

              <span
                style="
                  font-size: 0.9rem;
                  font-weight: 400;
                  background-color: transparent !important;
                "
                :style="{ color: darkmode.isDark ? '#585858' : '#fff' }"
                >Archived
                <span
                  style="
                    font-size: 10px;
                    background-color: transparent !important;
                  "
                  class="ml-2"
                  >({{ workersCount.archived }})</span
                ></span
              >
            </RouterLink>
          </VCollapseLinks>

          <!-- Dashboard -->
          <li>
            <RouterLink to="/sidebar/partner/profile" class="single-link">
              <span class="icon">
                <i class="iconify" data-icon="feather:user" />
              </span>
              Profile
            </RouterLink>
          </li>
        </template>

        <template #bottom-links>
          <!-- <UserProfileDropdown up /> -->
          <div class="mb-6" style="display: flex; flex-direction: column">
            <div class="is-flex cus-align-center mb-3">
              <VAvatar
                :picture="company.loggedCompany.compnayLogo"
                size="small"
              />
              <h1 class="subtitle" style="color: white">
                {{ company.loggedCompany.companyName }}
              </h1>
            </div>
            <div class="pb-3 arez-version">
              <p style="font-weight: 500">Powered by EarnFlex</p>
              <p style="font-weight: 500; font-size: 10px">Version 1.04</p>
            </div>
          </div>
        </template>
      </Sideblock>
      <!-- collapsed menu -->
      <Sideblock style="width: 100px" :theme="props.theme" v-else>
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
                v-if="userSession.user.role == 'partner'"
                style="
                  width: auto;
                  height: 100%;
                  display: block;
                  margin: 0;
                  border-radius: 12px;
                "
                @click="router.push('/sidebar/partner/profile')"
                :src="
                  supplierInfo
                    ? supplierInfo.partnerLogo
                    : '/images/logos/smallarezdarkversion.svg'
                "
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
              to="/sidebar/partner/dashboard"
              class="single-link"
            >
              <span class="icon" id="cus-spanLink">
                <i class="iconify" data-icon="feather:grid" />
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
                  <i
                    class="iconify"
                    style="margin: 0; margin-right: 4px"
                    :style="{
                      color: darkmode.isDark ? '#585858' : 'whitesmoke',
                    }"
                    data-icon="feather:users"
                  ></i>
                </span>
              </template>
              <RouterLink
                to="/sidebar/partner/workers?type=All"
                :class="{ 'cus-active-link': 'All' === route.query.type }"
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
                :to="`/sidebar/partner/workers?type=${item.name}`"
                :class="{ 'cus-active-link': item.name === route.query.type }"
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
                to="/sidebar/partner/workers?archive=true"
                :class="{ 'cus-active-link': 'true' === route.query.archive }"
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

          <!-- Contracts / Sites -->
          <li>
            <RouterLink to="/sidebar/partner/profile" class="single-link">
              <span class="icon" id="cus-spanLink">
                <i
                  class="iconify"
                  data-icon="feather:user"
                  aria-hidden="true"
                ></i>
              </span>
            </RouterLink>
          </li>
        </template>

        <!-- user profile -->
        <template #bottom-links>
          <VAvatar :picture="company.loggedCompany.compnayLogo" size="small" />
          <!-- <UserProfileDropdown up /> -->
        </template>
      </Sideblock>
    </Transition>

    <LanguagesPanel />
    <ActivityPanel />
    <SearchPanel />
    <TaskPanel />

    <VViewWrapper class="mt-2" :full="isDesktopSideblockOpen">
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

            <div class="title-wrap">
              <h1 class="title is-4">
                {{ viewWrapper.pageTitle }}
              </h1>
            </div>

            <!-- toolbar -->
            <div class="toolbar">
              <SearchWorkerInput />
              <VIconButton
                color="info"
                light
                raised
                @click="invitationModal = true"
                circle
                icon="fas fa-link"
                v-tooltip.bottom.left.rounded.info="'Invitation link'"
                label="Rounded"
              />
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
<style lang="scss">
.sleakDivider {
  margin-top: 6px;
  width: 24px;
  border-radius: 20%;
  height: 4px;
  background-color: #e2e2e28c;
  margin-left: 15%;
}
.df-messenger {
  position: fixed !important;
  bottom: 10px;
  right: 10px;
  z-index: 99;
}
</style>
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

#cus-spanLink {
  display: flex !important;
  justify-content: center !important;
  align-items: center;
  margin: 0;
}

#cus-routerLinks {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
}

.cus-active-link {
  transition: all 0.3s ease-in-out;
  color: var(--primary) !important;
  font-weight: 700 !important;
  transform: translate(1.2);

  img {
    border: 2px solid var(--success);
    border-radius: 8px;
  }

  i {
    padding: 6px;
    border-radius: 8px;
    border: 1px solid #dbdbdb;
  }
}

.cus-active-link-icon {
  color: var(--primary) !important;
  font-weight: 500 !important;

  img {
    border: 2px solid var(--primary);
    border-radius: 8px;
  }

  i {
    font-weight: 600;
  }
}

.cus-dropdown-head {
  display: flex !important;
}

.indutryOptions {
  margin-top: 20px;
  display: flex;
  gap: 0px;

  .options {
    width: 80px;
    height: 80px;
    cursor: pointer;
    color: aliceblue;
    display: flex;
    gap: 6px;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    img {
      width: 60px;
      height: 60px;
    }

    p {
      font-weight: 500;
    }
  }

  .cus-selected {
    width: 80px;
    height: 80px;
    cursor: pointer;

    display: flex;
    gap: 6px;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    img {
      width: 60px;
      height: 60px;
      border-color: var(--primary);
      border: 2px solid var(--primary);
      border-radius: 16px;
    }

    p {
      font-weight: 600;
      color: var(--primary);
    }
  }
}
</style>
