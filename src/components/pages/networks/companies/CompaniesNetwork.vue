import { get } from 'cypress/types/lodash';
<script setup lang="ts">
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
export interface CompanyData {
  id: number;
  companyName: string;
  industry: {
    id: number;
    name: string;
    industryLogo: string | null;
  } | null;
  siteURL: string;
  businessAddress: string;
  postCode: string;
  country: string;
  state: string;
  yearBusinessStarted: string;
  companyPhoneNumber: string;
  billingAddress: string;
  companyEmailAddress: string;
  companyRegistrationNumber: string;
  companyRegisteredName: string;
  billingPhoneNumber: string;
  BillingEmailAddress: string;
  dailyEmailLimit: number;
  dailySMSLimit: number;
  noOfLicence: number;
  compnayLogo: string;
}
const router = useRouter();
const projects: CompanyData[] = [];
const AddCompanyModalOpen = ref(false);
const EditCompanyModalOpen = ref(false);
const notyf = useNotyf();
const api = useApi();
const Loading = ref(false);
const currentSelectedID = ref(0);
const EditCompanyID = ref(0);
const SweetAlertProps = ref({
  title: "",
  subtitle: "test",
  isSweetAlertOpen: false,
  btntext: "text",
});
const tab = ref("active");
const filters = ref("");
const getAllCompanies = async () => {
  try {
    Loading.value = true;
    const response = await api.get("/v3/api/company/", {});
    projects.length = 0;
    projects.push(...(response.data as CompanyData[]));
    Loading.value = false;
  } catch (error) {
    console.error("ok", error);
  }
};

const columns = {
  compnayLogo: {
    label: "Company",
    grow: true,
    media: true,
  },

  companyPhoneNumber: "Phone",
  companyRegisteredName: {
    label: "Registered Name",
    cellClass: "h-hidden-tablet-p",
  },
  billingAddress: {
    label: "Address",
  },
  actions: {
    label: "Actions",
    align: "end",
  },
} as const;
const filteredData = computed(() => {
  if (!filters.value) {
    return projects;
  } else {
    const filterRe = new RegExp(filters.value, "i");

    return projects.filter((item) => {
      return (
        item.companyName.match(filterRe) ||
        item.companyEmailAddress.match(filterRe) ||
        item.companyPhoneNumber.match(filterRe)
      );
    });
  }
});
const handleUpdateAddCompanyModalOpen = (value: boolean) => {
  AddCompanyModalOpen.value = value;
};
const OpenDeleteSweetAlert = (id: number) => {
  currentSelectedID.value = id;
  SweetAlertProps.value = {
    title: "Are you sure?",
    subtitle: "You will not be able to recover this Company!",
    btntext: "Yes, Delete it",
    isSweetAlertOpen: true,
  };
};

const DeleteTeamMemberHandler = async () => {
  try {
    console.log(currentSelectedID.value, "selected id");

    const response = await api.delete(
      `/v3/api/company/${currentSelectedID.value}/`,
      {}
    );
    SweetAlertProps.value.isSweetAlertOpen = false;
    getAllCompanies();
    notyf.dismissAll();
    notyf.success("Delete company, Company");
  } catch (error) {
    console.error("ok", error);
  }
};
onMounted(() => {
  getAllCompanies();
});
</script>

<template>
  <PlaceloadV1 v-if="Loading" />
  <div v-else>
    <div>
      <div class="list-flex-toolbar is-reversed">
        <div class="buttons">
          <VButton
            color="primary"
            icon="fas fa-plus"
            elevated
            @click="AddCompanyModalOpen = true"
          >
            Company
          </VButton>
          <VControl icon="feather:search">
            <input
              v-model="filters"
              class="input custom-text-filter"
              placeholder="Search..."
            />
          </VControl>
        </div>

        <div class="tabs-inner">
          <div class="tabs">
            <ul>
              <li :class="[tab === 'active' && 'is-active']">
                <a
                  tabindex="0"
                  role="button"
                  @keydown.space.prevent="tab = 'active'"
                  @click="tab = 'active'"
                  ><span>Active</span></a
                >
              </li>
              <li :class="[tab === 'closed' && 'is-active']">
                <a
                  tabindex="0"
                  role="button"
                  @keydown.space.prevent="tab = 'closed'"
                  @click="tab = 'closed'"
                  ><span>Closed</span></a
                >
              </li>
              <li class="tab-naver" />
            </ul>
          </div>
        </div>
      </div>

      <div class="flex-list-wrapper flex-list-v2">
        <!--List Empty Search Placeholder -->
        <VPlaceholderPage
          v-if="tab === 'active' && filteredData.length === 0"
          title="We couldn't find any matching results."
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

        <!--Active Tab-->
        <div v-if="tab === 'active'" class="tab-content is-active">
          <VFlexTable
            v-if="filteredData.length"
            :data="filteredData"
            :columns="columns"
            rounded
          >
            <template #body>
              <TransitionGroup name="list" tag="div" class="flex-list-inner">
                <!--Table item-->
                <div
                  v-for="item in filteredData"
                  :key="item.id"
                  class="flex-table-item"
                >
                  <VFlexTableCell
                    :column="{ media: true, grow: true }"
                    style="cursor: pointer"
                    @click="
                      router.push({
                        name: '/sidebar/networks/companies/[id]',
                        params: { id: item.id },
                      })
                    "
                  >
                    <VAvatar :picture="item.compnayLogo" />
                    <div>
                      <span class="item-name dark-inverted">{{
                        item.companyName
                      }}</span>
                      <span class="item-meta">
                        <span>
                          <i
                            class="iconify"
                            data-icon="feather:mail"
                            aria-hidden="true"
                          ></i>
                          {{ item.companyEmailAddress }}</span
                        >
                      </span>
                    </div>
                  </VFlexTableCell>
                  <VFlexTableCell>
                    <span class="light-text">{{
                      item.companyPhoneNumber
                    }}</span>
                  </VFlexTableCell>

                  <VFlexTableCell>
                    <VTag rounded color="primary" elevated>
                      {{
                        item.companyRegisteredName
                          ? item.companyRegisteredName
                          : "Not Registered"
                      }}
                    </VTag>
                  </VFlexTableCell>
                  <VFlexTableCell>
                    <span class="light-text"
                      >{{ item.billingAddress.slice(1, 20) }} ...</span
                    >
                  </VFlexTableCell>

                  <VFlexTableCell :column="{ align: 'end' }">
                    <VDropdown icon="feather:more-vertical" spaced right>
                      <template #content>
                        <RouterLink
                          role="menuitem"
                          class="dropdown-item is-media"
                          :to="{
                            name: '/sidebar/networks/companies/[id]',
                            params: { id: item.id },
                          }"
                        >
                          <div class="icon">
                            <i aria-hidden="true" class="lnil lnil-user-alt" />
                          </div>
                          <div class="meta">
                            <span>Profile</span>
                            <span>View company profile</span>
                          </div>
                        </RouterLink>

                        <a
                          role="menuitem"
                          href="#"
                          class="dropdown-item is-media"
                        >
                          <div class="icon">
                            <i aria-hidden="true" class="lnil lnil-bubble" />
                          </div>
                          <div class="meta">
                            <span>Message</span>
                            <span>Send Message</span>
                          </div>
                        </a>

                        <a
                          role="menuitem"
                          href="#"
                          class="dropdown-item is-media"
                          @click="
                            () => {
                              EditCompanyID = item.id;
                              EditCompanyModalOpen = true;
                            }
                          "
                        >
                          <div class="icon">
                            <i
                              class="lnil lnil-message-edit"
                              aria-hidden="true"
                            ></i>
                          </div>
                          <div class="meta">
                            <span>Edit</span>
                            <span>Edit company Info</span>
                          </div>
                        </a>

                        <hr class="dropdown-divider" />

                        <a
                          role="menuitem"
                          href="#"
                          class="dropdown-item is-media"
                          @click="OpenDeleteSweetAlert(item.id)"
                        >
                          <div class="icon">
                            <i aria-hidden="true" class="lnil lnil-trash" />
                          </div>
                          <div class="meta">
                            <span>Remove</span>
                            <span>Remove from list</span>
                          </div>
                        </a>
                      </template>
                    </VDropdown>
                  </VFlexTableCell>
                </div>
              </TransitionGroup>
            </template>
          </VFlexTable>
        </div>

        <!--inactive Tab-->
        <div v-else-if="tab === 'closed'" class="tab-content is-active">
          <!--Empty placeholder-->
          <VPlaceholderPage
            title="No closed companies."
            subtitle="Looks like you don't have any closed company yet. When you'll
start closing off projects, they will be showing up in here."
          >
            <template #image>
              <img
                class="light-image is-larger"
                src="/@src/assets/illustrations/placeholders/projects.svg"
                alt=""
              />
              <img
                class="dark-image is-larger"
                src="/@src/assets/illustrations/placeholders/projects-dark.svg"
                alt=""
              />
            </template>
          </VPlaceholderPage>
        </div>
      </div>
    </div>

    <AddCompany
      v-if="AddCompanyModalOpen"
      :AddCompanyModalOpen="AddCompanyModalOpen"
      @update:handleUpdateAddCompanyModalOpen="handleUpdateAddCompanyModalOpen"
      @update:getAllCompanies="getAllCompanies"
    />
    <EditCompany
      v-if="EditCompanyModalOpen"
      :EditCompanyModalOpen="EditCompanyModalOpen"
      :id="EditCompanyID"
      @update:handleUpdateEditCompanyModalOpen="
        (value) => (EditCompanyModalOpen = value)
      "
      @update:getAllCompanies="getAllCompanies"
    />
    <SweetAlert
      v-if="SweetAlertProps.isSweetAlertOpen"
      :isSweetAlertOpen="SweetAlertProps.isSweetAlertOpen"
      :title="SweetAlertProps.title"
      :subtitle="SweetAlertProps.subtitle"
      :btntext="SweetAlertProps.btntext"
      :onConfirm="DeleteTeamMemberHandler"
      :onCancel="() => (SweetAlertProps.isSweetAlertOpen = false)"
    />
  </div>
</template>

<style lang="scss">
@import "/@src/scss/abstracts/all";
.radio {
  padding: 0.7rem !important;
}
.list-view-v1 {
  .list-view-item {
    @include vuero-r-card;

    margin-bottom: 16px;
    padding: 16px;

    .list-view-item-inner {
      display: flex;
      align-items: center;

      .meta-left {
        margin-inline-start: 16px;

        h3 {
          font-family: var(--font-alt);
          color: var(--dark-text);
          font-weight: 600;
          font-size: 1rem;
          line-height: 1;
        }

        > span:not(.tag) {
          font-size: 0.9rem;
          color: var(--light-text);

          svg {
            height: 12px;
            width: 12px;
          }
        }
      }

      .meta-right {
        margin-inline-start: auto;
        display: flex;
        justify-content: flex-end;
        align-items: center;

        .tags {
          margin-inline-end: 30px;
          margin-bottom: 0;

          .tag {
            margin-bottom: 0;
          }
        }

        .stats {
          display: flex;
          align-items: center;
          margin-inline-end: 30px;

          .stat {
            display: flex;
            align-items: center;
            flex-direction: column;
            text-align: center;
            color: var(--light-text);

            > span {
              font-family: var(--font);

              &:first-child {
                font-size: 1.2rem;
                font-weight: 600;
                color: var(--dark-text);
                line-height: 1.4;
              }

              &:nth-child(2) {
                text-transform: uppercase;
                font-family: var(--font-alt);
                font-size: 0.75rem;
              }
            }

            svg {
              height: 16px;
              width: 16px;
            }

            i {
              font-size: 1.4rem;
            }
          }

          .separator {
            height: 25px;
            width: 2px;
            border-inline-end: 1px solid var(--fade-grey-dark-3);
            margin: 0 16px;
          }
        }

        .network {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          min-width: 145px;

          > span {
            font-family: var(--font);
            font-size: 0.9rem;
            color: var(--light-text);
            margin-inline-start: 6px;
          }
        }

        .dropdown {
          margin-inline-start: 30px;
        }
      }
    }
  }
}

.is-dark {
  .list-view-v1 {
    .list-view-item {
      @include vuero-card--dark;

      .list-view-item-inner {
        .meta-left {
          h3 {
            color: var(--dark-dark-text) !important;
          }
        }

        .meta-right {
          .stats {
            .stat {
              span {
                &:first-child {
                  color: var(--dark-dark-text);
                }
              }
            }

            .separator {
              border-color: var(--dark-sidebar-light-16) !important;
            }
          }
        }
      }
    }
  }
}

@media only screen and (width <= 767px) {
  .list-view-v1 {
    .list-view-item {
      .list-view-item-inner {
        position: relative;
        flex-direction: column;

        .v-avatar {
          margin-bottom: 10px;
        }

        .meta-left {
          margin-inline-start: 0;
        }

        .meta-right {
          flex-direction: column;
          margin-inline-start: 0;

          .tags {
            margin: 10px 0;
          }

          .stats {
            margin: 10px 0;
          }

          .network {
            margin: 10px 0 0;
            justify-content: center;

            > span {
              display: none;
            }
          }

          .dropdown {
            position: absolute;
            top: 0;
            inset-inline-end: 0;
            margin-inline-start: 0;
          }
        }
      }
    }
  }
}

@media only screen and (width >= 768px) and (width <= 1024px) and (orientation: portrait) {
  .list-view-v1 {
    display: flex;
    flex-wrap: wrap;

    .list-view-item {
      margin: 10px;
      width: calc(50% - 20px);

      .list-view-item-inner {
        position: relative;
        flex-direction: column;

        .v-avatar {
          margin-bottom: 10px;
        }

        .meta-left {
          margin-inline-start: 0;
        }

        .meta-right {
          flex-direction: column;
          margin-inline-start: 0;

          .tags {
            margin: 10px 0;
          }

          .stats {
            margin: 10px 0;
          }

          .network {
            margin: 10px 0 0;
            justify-content: center;

            > span {
              display: none;
            }
          }

          .dropdown {
            position: absolute;
            top: 0;
            inset-inline-end: 0;
            margin-inline-start: 0;
          }
        }
      }
    }
  }
}
</style>
