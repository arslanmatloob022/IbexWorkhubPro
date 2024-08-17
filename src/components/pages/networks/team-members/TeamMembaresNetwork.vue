import { get } from 'cypress/types/lodash';
<script setup lang="ts">
import type { VTagColor } from "/@src/components/base/tags/VTag.vue";
import { useApi } from "/@src/composable/useAPI";
import { useCompany } from "/@src/stores/company";
import { useNotyf } from "/@src/composable/useNotyf";
export interface UserData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  location: string;
  role: string;
  last_login: string;
  is_active: boolean;
  roleColor: VTagColor;
  profileImage: string;
  jobPosition: string;
  department: string;
}
const company = useCompany();
const centeredActionsOpen = ref(true);
const AddMemberModalOpen = ref(false);
const EditMemberModalOpen = ref(false);
const ChangePasswordModalOpen = ref(false);
const notyf = useNotyf();
const filters = ref("");
const api = useApi();

const all_user: UserData[] = [];
const Loading = ref(false);
const currentSelectedID = ref(0);
const EditMemberID = ref(0);
const SweetAlertProps = ref({
  title: "",
  subtitle: "",
  isSweetAlertOpen: false,
  btntext: "",
});

const getTeamMembers = async () => {
  try {
    Loading.value = true;
    const response = await api.get(
      `/v3/api/account/user/company-team-members/${company.loggedCompany.id}/`,
      {}
    );
    all_user.length = 0;
    all_user.push(...(response.data as UserData[]));
    Loading.value = false;
  } catch (error) {
    console.error("ok", error);
  }
};

const filteredData = computed(() => {
  if (!filters.value) {
    return all_user;
  } else {
    return all_user.filter((item) => {
      return item.first_name.match(new RegExp(filters.value, "i"));
    });
  }
});
const handleUpdateAddMemberModalOpen = (value: boolean) => {
  AddMemberModalOpen.value = value;
};
const OpenDeleteSweetAlert = (id: number) => {
  currentSelectedID.value = id;
  SweetAlertProps.value = {
    title: "Are you sure?",
    subtitle: "You will not be able to recover this Team Member!",
    btntext: "Yes, Delete it",
    isSweetAlertOpen: true,
  };
};

const DeleteTeamMemberHandler = async () => {
  try {
    console.log(currentSelectedID.value, "selected id");
    SweetAlertProps.value.isSweetAlertOpen = false;

    const response = await api.delete(
      `/v3/api/account/user/${currentSelectedID.value}/`,
      {}
    );
    getTeamMembers();
    notyf.dismissAll();
    notyf.success("Delete Tema Member, Team Member");
  } catch (error) {
    console.error("ok", error);
  }
};
onMounted(() => {
  getTeamMembers();
  console.log("logged company", company.loggedCompany.id);
});
</script>

<template>
  <PlaceloadV1 v-if="Loading" />
  <div v-else>
    <div class="list-view-toolbar">
      <VField>
        <VControl icon="feather:search">
          <input
            v-model="filters"
            class="input custom-text-filter"
            placeholder="Search..."
          />
        </VControl>
      </VField>

      <div class="list-info">
        <span>{{ filteredData.length }} records </span>
      </div>

      <div class="buttons">
        <VButton
          color="primary"
          icon="fas fa-plus"
          elevated
          @click="AddMemberModalOpen = true"
        >
          New Team Member
        </VButton>
      </div>
    </div>

    <div class="page-content-inner">
      <!--List-->
      <div class="list-view list-view-v1">
        <!--List Empty Search Placeholder -->
        <VPlaceholderPage
          :class="[filteredData.length !== 0 && 'is-hidden']"
          title="We couldn't find any matching results."
          subtitle="Too bad. Looks like we couldn't find any matching results for the
          search terms you've entered. Please try different search terms or
          criteria."
          larger
        >
          <template #image>
            <img
              class="light-image"
              src="/@src/assets/illustrations/placeholders/search-1.svg"
              alt=""
            />
            <img
              class="dark-image"
              src="/@src/assets/illustrations/placeholders/search-1-dark.svg"
              alt=""
            />
          </template>
        </VPlaceholderPage>

        <div class="list-view-inner">
          <!--Item-->
          <TransitionGroup name="list-complete" tag="div">
            <div
              v-for="(item, key) in filteredData"
              :key="key"
              class="list-view-item"
            >
              <div class="list-view-item-inner">
                <div class="" style="position: relative; height: 5rem">
                  <VAvatar
                    :picture="item.profileImage && item.profileImage"
                    size="large"
                  />
                  <!-- Logo -->

                  <img
                    v-if="item?.partnerInfo?.partnerLogo"
                    :src="item?.partnerInfo?.partnerLogo"
                    alt="logo"
                    style="
                      position: absolute;
                      bottom: -0.5rem;
                      right: -0.6rem;
                      z-index: 5;
                      width: 2.5rem;
                      height: 2.5rem;
                      border-radius: 50%;
                      border: 1px solid #2aac8e;
                    "
                  />
                </div>

                <!-- :badge="item.profileImage" -->
                <div class="meta-left">
                  <h3>{{ item.first_name }} {{ item.last_name }}</h3>
                  <span class="is-flex mt-1" style="align-items: center">
                    <i
                      aria-hidden="true"
                      class="iconify"
                      data-icon="feather:mail"
                    />
                    <span>&nbsp;{{ item.email }}</span>
                  </span>
                </div>
                <div class="meta-right">
                  <div class="tags">
                    <VTag :label="item.role" color="primary" rounded elevated />
                    <span
                      style="
                        font-size: 0.9rem;
                        color: #999;
                        width: 20rem;
                        font-weight: 400;
                        text-align: center;
                      "
                      >{{ item?.partnerInfo?.supplierName }}</span
                    >
                  </div>

                  <div class="stats">
                    <div class="stat">
                      <span>Department</span>
                      <span class="is-flex" style="align-items: center">
                        {{ item.department }}</span
                      >
                    </div>

                    <div class="separator" />
                    <div class="stat">
                      <span>Position</span>
                      <span>{{ item.jobPosition }}</span>
                    </div>

                    <div class="separator" />
                    <div class="stat">
                      <span>Last Login</span>
                      <span class="is-flex" style="align-items: center"
                        ><i
                          v-if="item.last_login"
                          class="iconify"
                          style="height: 14px !important"
                          data-icon="feather:clock"
                          aria-hidden="true"
                        ></i>
                        &nbsp;
                        {{
                          item.last_login
                            ? item.last_login.substring(11, 16)
                            : "No login"
                        }}</span
                      >
                    </div>
                  </div>
                  <VDropdown icon="feather:more-vertical" spaced right>
                    <template #content>
                      <a
                        role="menuitem"
                        href="#"
                        class="dropdown-item is-media"
                      >
                        <div class="icon">
                          <i aria-hidden="true" class="lnil lnil-user-alt" />
                        </div>
                        <div class="meta">
                          <span>Profile</span>
                          <span>View profile</span>
                        </div>
                      </a>

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
                            EditMemberID = item.id;
                            EditMemberModalOpen = true;
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
                          <span>Edit Team Member Info</span>
                        </div>
                      </a>

                      <a
                        role="menuitem"
                        href="#"
                        class="dropdown-item is-media"
                        @click="
                          () => {
                            EditMemberID = item.id;
                            ChangePasswordModalOpen = true;
                          }
                        "
                      >
                        <div class="icon">
                          <i class="lnir lnir-key-alt" aria-hidden="true"></i>
                        </div>
                        <div class="meta">
                          <span>Password</span>
                          <span>Change Password</span>
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
                </div>
              </div>
            </div>
          </TransitionGroup>
        </div>
      </div>
    </div>

    <AddTeamMember
      :AddMemberModalOpen="AddMemberModalOpen"
      @update:handleUpdateAddMemberModalOpen="handleUpdateAddMemberModalOpen"
      @update:getTeamMembers="getTeamMembers"
    />
    <EditTeamMember
      v-if="EditMemberModalOpen"
      :EditMemberModalOpen="EditMemberModalOpen"
      :id="EditMemberID"
      @update:handleUpdateEditMemberModalOpen="
        (value) => (EditMemberModalOpen = value)
      "
      @update:getTeamMembers="getTeamMembers"
    />
    <ChangeMemberPassword
      v-if="ChangePasswordModalOpen"
      :ChangePasswordModalOpen="ChangePasswordModalOpen"
      :id="EditMemberID"
      @update:handleChangePasswordModalOpen="
        (value) => (ChangePasswordModalOpen = value)
      "
      @update:getTeamMembers="getTeamMembers"
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
          width: 100px;
          display: flex;
          justify-content: center;
          align-items: center;
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
            width: 140px;
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
