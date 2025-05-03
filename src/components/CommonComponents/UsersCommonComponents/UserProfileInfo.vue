<route lang="yaml">
meta:
  requiresAuth: true
  # isAdminAllowed: true
  # isManagerAllowed: false
  # isContractorAllowed: false
  # isPartnerAllowed: false
  # isWorkerAllowed: false
  # isClientAllowed: false
</route>
<script setup lang="ts">
import { useUserSession } from "/@src/stores/userSession";
import { useApi } from "/@src/composable/useAPI";
import { useViewWrapper } from "/@src/stores/viewWrapper";
import { useI18n } from "vue-i18n";
import { formatDateTime } from "/@src/composable/useSupportElement";

const { t } = useI18n();
const api = useApi();
const userSession = useUserSession();
const isOpenModal = ref(false);
const openPasswordModal = ref(false);
const currentSelectId = ref("");
const Loading = ref(false);
const tab = ref<"personal" | "admins" | "logs" | "activities" | "todo">(
  "personal"
);
const userFormData = ref<any>({
  username: "",
  email: "",
  password: "",
  is_sentMail: false,
  status: "",
  role: "",
  phoneNumber: "",
  avatar: "",
  supplier: "",
  address: "",
  city: "",
  country: "",
  postalCode: "",
  latitude: "",
  longitude: "",
});

const props = defineProps<{
  userData: {
    id: "5989539e-7914-47de-b29f-6009df3887da";
    last_login: "";
    date_joined: "";
    email: "";
    role: "";
    avatar: "";
    is_active: true;
    phoneNumber: "";
    username: "";
    last_name: "";
    state: "";
    is_sentMail: true;
    token: null;
    address: null;
    city: null;
    country: null;
    postalCode: null;
    latitude: null;
    longitude: null;
    supplier: null;
  };
}>();

const emits = defineEmits<{
  (e: "update:close-modal-handler", value: boolean): void;
  (e: "update:action-update-handler", value: any): void;
}>();

const openChangePasswordModal = (id: any) => {
  currentSelectId.value = id;
  openPasswordModal.value = true;
};

const getUserDataHandler = async () => {
  emits("update:action-update-handler", null);
  isOpenModal.value = false;
};

onMounted(() => {
  console.log("user data ", userSession.user);
  if (userSession.user.id) {
    getUserDataHandler();
  }
});
</script>

<template>
  <div class="profile-wrapper">
    <div class="profile-body">
      <div class="columns is-multiline">
        <div v-if="tab == 'personal'" class="column is-12">
          <div class="columns is-multiline">
            <div class="column is-8">
              <div class="profile-card">
                <div class="profile-card-section">
                  <div class="section-title">
                    <h4>About</h4>

                    <!-- <i aria-hidden="true" class="lnil lnil-pencil" /> -->
                  </div>
                  <div class="section-content">
                    <p class="description">
                      {{ props.userData?.about ?? "Not Applicable" }}
                    </p>
                  </div>
                </div>
                <div class="profile-card-section">
                  <div class="section-title">
                    <h4>Details</h4>
                    <i
                      aria-hidden="true"
                      @click="isOpenModal = !isOpenModal"
                      class="lnil lnil-pencil cu-pointer"
                    />
                  </div>
                  <div class="section-content">
                    <div class="experience-wrapper">
                      <div class="experience-item">
                        <VIconBox size="medium" color="primary" rounded>
                          <i class="fas fa-envelope" aria-hidden="true"></i>
                        </VIconBox>

                        <div class="meta">
                          <span class="dark-inverted">Email</span>
                          <span>{{ props.userData.email }}</span>
                        </div>
                      </div>
                      <div class="experience-item">
                        <VIconBox size="medium" color="primary" rounded>
                          <i class="fas fa-phone-alt" aria-hidden="true"></i>
                        </VIconBox>
                        <div class="meta">
                          <span class="dark-inverted">Phone</span>

                          <span>{{ props.userData.phoneNumber }}</span>
                        </div>
                      </div>

                      <div class="experience-item">
                        <VIconBox size="medium" color="primary" rounded>
                          <i
                            class="fas fa-location-arrow"
                            aria-hidden="true"
                          ></i>
                        </VIconBox>
                        <div class="meta">
                          <span class="dark-inverted">Postal Code</span>

                          <span>{{ props.userData.postalCode ?? "N/A" }}</span>
                        </div>
                      </div>
                      <div class="experience-item">
                        <VIconBox size="medium" color="primary" rounded>
                          <i class="fas fa-map-marker" aria-hidden="true"></i>
                        </VIconBox>
                        <div class="meta">
                          <span class="dark-inverted">City</span>

                          <span>{{ props.userData.city ?? "N/A" }}</span>
                        </div>
                      </div>
                      <div class="experience-item">
                        <VIconBox size="medium" color="primary" rounded>
                          <i class="fas fa-landmark" aria-hidden="true"></i
                        ></VIconBox>
                        <div class="meta">
                          <span class="dark-inverted">State</span>

                          <span>{{ props.userData.state ?? "N/A" }}</span>
                        </div>
                      </div>
                      <div class="experience-item">
                        <VIconBox size="medium" color="primary" rounded>
                          <i class="fas fa-home" aria-hidden="true"></i>
                        </VIconBox>
                        <div class="meta">
                          <span class="dark-inverted">Address</span>

                          <span>{{ props.userData.address ?? "N/A" }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="column is-4">
              <div class="profile-card">
                <div class="profile-card-section no-padding">
                  <div class="section-title">
                    <h4>Profile Info</h4>
                    <i
                      @click="openChangePasswordModal"
                      class="fas fa-user-lock cu-pointer"
                      aria-hidden="true"
                    ></i>
                  </div>
                </div>
                <div class="columns is-multiline is-flex-tablet-p">
                  <div class="column is-12">
                    <div class="health-tile">
                      <div class="tile-head">
                        <VIconBox color="info">
                          <i
                            class="fas fa-envelope-open-text"
                            aria-hidden="true"
                          ></i>
                        </VIconBox>
                        <h4>
                          <span class="dark-inverted">User State</span><br />
                          <span>
                            {{
                              props.userData?.is_active
                                ? "Active"
                                : " In-Active"
                            }}</span
                          >
                        </h4>
                      </div>
                    </div>
                  </div>
                  <!--Tile-->
                  <div class="column is-12">
                    <div class="health-tile">
                      <div class="tile-head">
                        <VIconBox color="info">
                          <i
                            class="fas fa-envelope-open-text"
                            aria-hidden="true"
                          ></i>
                        </VIconBox>
                        <h4>
                          <span class="dark-inverted">Mail Notification</span
                          ><br />
                          <span>
                            {{
                              props.userData?.is_sentMail
                                ? "Active"
                                : "Inactive"
                            }}</span
                          >
                        </h4>
                      </div>
                    </div>
                  </div>
                  <div class="column is-12">
                    <div class="health-tile">
                      <div class="tile-head">
                        <VIconBox color="info">
                          <i class="fas fa-clock" aria-hidden="true"></i>
                        </VIconBox>
                        <h4>
                          <span class="dark-inverted">Last Login</span><br />
                          <span>
                            {{
                              formatDateTime(props.userData?.last_login)
                            }}</span
                          >
                        </h4>
                      </div>
                    </div>
                  </div>
                  <div class="column is-12">
                    <div class="health-tile">
                      <div class="tile-head">
                        <VIconBox color="info">
                          <i class="fas fa-clock" aria-hidden="true"></i>
                        </VIconBox>
                        <h4>
                          <span class="dark-inverted">Joined At</span><br />
                          <span>
                            {{
                              formatDateTime(props.userData?.date_joined)
                            }}</span
                          >
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <AddUpdateUser
      v-if="isOpenModal"
      :is-modal-open="isOpenModal"
      :user-id="props.userData.id"
      @update:close-modal-handler="isOpenModal = false"
      @update:action-update-handler="getUserDataHandler"
    />
    <ChangePasswordModal
      v-if="openPasswordModal"
      :isModalOpen="openPasswordModal"
      :userId="props.userData.id"
      @update:closeModalHandler="openPasswordModal = false"
      @update:actionUpdateHandler="getUserDataHandler"
    />
  </div>
</template>

<style lang="scss">
@import "/@src/scss/abstracts/all";
@import "/@src/scss/components/profile-stats";

.is-navbar {
  .profile-wrapper {
    margin-top: 30px;
  }
}

.profile-wrapper {
  max-width: 100%;
  margin: 0 auto;

  .profile-header {
    text-align: center;

    > img {
      display: block;
      margin: 0 auto;
      max-width: 300px;
    }

    .v-avatar {
      margin: 0 auto 12px;
    }

    .anim-icon {
      margin-bottom: 12px;
    }

    .title {
      margin-bottom: 6px;
    }

    p {
      font-size: 1rem;
      max-width: 540px;
      margin: 0 auto;
      line-height: 1.3;
    }
  }

  .profile-body {
    padding: 10px 0 20px;

    .profile-card {
      @include vuero-s-card;

      padding: 30px;

      &:not(:last-child) {
        margin-bottom: 20px;
      }

      .profile-card-section {
        padding-bottom: 20px;

        &:not(:last-child) {
          margin-bottom: 20px;
          border-bottom: 1px solid var(--fade-grey-dark-4);
        }

        &.no-padding {
          padding-bottom: 0;
        }

        .section-title {
          display: flex;
          align-items: center;
          margin-bottom: 12px;

          h4 {
            font-family: var(--font-alt);
            font-weight: 600;
            font-size: 0.8rem;
            text-transform: uppercase;
            color: var(--dark-text);
            margin-inline-end: 6px;
          }

          i {
            color: var(--primary);
          }

          .action-link {
            position: relative;
            top: -2px;
            margin-inline-start: auto;
            text-transform: uppercase;
            font-size: 0.8rem;
          }

          .control {
            margin-inline-start: auto;

            .form-switch {
              transform: scale(0.8);
            }
          }
        }

        .section-content {
          .description {
            font-size: 0.95rem;
          }

          .experience-wrapper {
            display: flex;
            flex-wrap: wrap;
            margin-inline-start: -8px;
            margin-inline-end: -8px;

            .experience-item {
              display: flex;
              align-items: center;
              width: calc(50% - 16px);
              margin: 8px;

              img {
                display: block;
                width: 50px;
                min-width: 50px;
                height: 50px;
                border-radius: var(--radius-rounded);
                border: 1px solid var(--fade-grey-dark-4);
              }

              .meta {
                margin-inline-start: 10px;

                > span {
                  font-family: var(--font);
                  display: block;

                  &:first-child {
                    font-family: var(--font-alt);
                    font-weight: 600;
                    color: var(--dark-text);
                    font-size: 0.85rem;
                  }

                  &:nth-child(2),
                  &:nth-child(3) {
                    font-size: 0.85rem;
                    color: var(--light-text);

                    i {
                      position: relative;
                      top: -2px;
                      font-size: 4px;
                      margin: 0 6px;
                    }
                  }

                  &:nth-child(3) {
                    color: var(--primary);
                  }

                  span {
                    display: inline-block;
                  }
                }
              }
            }
          }

          .languages-wrapper {
            display: flex;
            flex-wrap: wrap;
            margin-inline-start: -8px;
            margin-inline-end: -8px;

            .languages-item {
              display: flex;
              align-items: center;
              width: calc(50% - 16px);
              margin: 8px;

              .icon-wrap {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 50px;
                min-width: 50px;
                height: 50px;

                img {
                  position: absolute;
                  top: 50%;
                  inset-inline-start: 50%;
                  transform: translate(-50%, -50%);
                  display: block;
                  width: 32px;
                  min-width: 32px;
                  height: 32px;
                  border-radius: var(--radius-rounded);
                  border: 1px solid var(--fade-grey-dark-4);
                }
              }

              .meta {
                margin-inline-start: 10px;

                > span {
                  display: block;
                  font-family: var(--font);

                  &:first-child {
                    font-family: var(--font-alt);
                    font-weight: 600;
                    color: var(--dark-text);
                    font-size: 0.9rem;
                  }

                  &:nth-child(2) {
                    font-size: 0.85rem;
                    color: var(--light-text);
                  }

                  span {
                    display: inline-block;
                  }
                }
              }
            }
          }

          .skills-wrapper {
            .skills-item {
              display: flex;
              align-items: center;

              &:not(:last-child) {
                margin-bottom: 16px;
              }

              .icon-wrap {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 42px;
                min-width: 42px;
                height: 42px;
                border-radius: var(--radius-rounded);
                border: 1px solid var(--primary);

                &.has-icon {
                  background: var(--fade-grey-light-2);
                  border: 1px solid var(--fade-grey-dark-3);
                  color: var(--light-text);

                  i {
                    font-size: 1.4rem;
                  }
                }

                img {
                  display: block;
                  width: 34px;
                  min-width: 34px;
                  height: 34px;
                  border-radius: var(--radius-rounded);
                  border: 1px solid var(--fade-grey-dark-4);
                }

                .count {
                  position: absolute;
                  bottom: 0;
                  inset-inline-end: -4px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  width: 22px;
                  height: 22px;
                  border-radius: var(--radius-rounded);
                  background: var(--white);
                  border: 1px solid var(--primary);

                  span {
                    font-family: var(--font);
                    font-weight: 500;
                    font-size: 0.75rem;
                  }
                }
              }

              .skill-info {
                font-family: var(--font);
                margin-inline-start: 12px;
                line-height: 1.3;

                span {
                  display: block;

                  &:first-child {
                    font-family: var(--font-alt);
                    font-weight: 600;
                    color: var(--dark-text);
                    font-size: 0.9rem;
                  }

                  &:nth-child(2) {
                    font-size: 0.9rem;
                    color: var(--light-text);
                  }
                }
              }

              .people {
                margin-inline-start: auto;
                display: flex;
                justify-content: flex-end;

                .v-avatar {
                  margin: 0 4px;
                }
              }
            }
          }

          .recommendations-wrapper {
            display: flex;
            flex-wrap: wrap;
            margin-inline-start: -8px;
            margin-inline-end: -8px;

            .recommendations-item {
              width: calc(50% - 16px);
              margin: 8px;
              background: var(--fade-grey-light-3);
              text-align: center;
              padding: 30px 20px;
              border-radius: var(--radius);

              > .v-avatar {
                display: block;
                margin: 0 auto 8px;
              }

              h3 {
                font-size: 1rem;
                font-family: var(--font-alt);
                font-weight: 600;
                color: var(--dark-text);
                margin-bottom: 8px;
              }

              p {
                font-size: 0.85rem;
                margin-bottom: 16px;
              }

              .meta {
                span {
                  display: block;

                  &:first-child {
                    font-weight: 600;
                    font-family: var(--font-alt);
                    font-size: 0.95rem;
                    color: var(--primary);
                  }

                  &:nth-child(2) {
                    font-size: 0.9rem;
                    color: var(--light-text);
                  }
                }
              }
            }
          }

          .network-notifications {
            h3 {
              font-family: var(--font-alt);
              font-size: 0.9rem;
              margin-bottom: 6px;
            }

            p {
              font-size: 0.9rem;
              max-width: 480px;
            }
          }

          .tools-wrapper {
            padding-top: 12px;

            .tools-item {
              display: flex;
              align-items: center;
              margin-bottom: 16px;

              &:last-child {
                margin-bottom: 0;
              }

              .icon-wrap {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 50px;
                min-width: 50px;
                height: 50px;

                img {
                  position: absolute;
                  top: 50%;
                  inset-inline-start: 50%;
                  transform: translate(
                    calc(var(--transform-direction) * -50%),
                    -50%
                  );
                  display: block;
                  width: 32px;
                  min-width: 32px;
                  height: 32px;
                  border-radius: var(--radius-rounded);
                  border: 1px solid transparent;
                }
              }

              .meta {
                margin-inline-start: 10px;

                > span {
                  display: block;
                  font-family: var(--font);

                  &:first-child {
                    font-family: var(--font-alt);
                    font-weight: 600;
                    color: var(--dark-text);
                    font-size: 0.9rem;
                  }

                  &:nth-child(2) {
                    font-size: 0.85rem;
                    color: var(--light-text);
                  }

                  span {
                    display: inline-block;
                  }
                }
              }
            }
          }

          .people-wrapper {
            padding-top: 12px;

            .people-item {
              display: flex;
              align-items: center;
              margin-bottom: 16px;

              &:last-child {
                margin-bottom: 0;
              }

              .meta {
                margin-inline-start: 10px;

                > span {
                  display: block;
                  font-family: var(--font);

                  &:first-child {
                    font-family: var(--font-alt);
                    font-weight: 600;
                    color: var(--dark-text);
                    font-size: 0.9rem;
                  }

                  &:nth-child(2) {
                    font-size: 0.85rem;
                    color: var(--light-text);
                  }

                  span {
                    display: inline-block;
                  }
                }
              }
            }
          }

          .more-button {
            padding-top: 16px;

            .button {
              min-width: 180px;
              font-family: var(--font);
              text-transform: uppercase;
              font-size: 0.8rem;
              font-weight: 500;
              margin: 0 auto;
              color: var(--light-text);
            }
          }
        }
      }
    }
  }
}

.is-dark {
  .profile-wrapper {
    .profile-header {
      .v-avatar {
        .badge {
          border-color: var(--dark-sidebar-light-6);
        }
      }
    }

    .profile-body {
      .profile-card {
        @include vuero-card--dark;

        .profile-card-section {
          border-color: var(--dark-sidebar-light-12);

          .section-title {
            h4 {
              color: var(--dark-dark-text);
            }

            i {
              color: var(--primary);
            }
          }

          .section-content {
            .icon-wrap {
              > img {
                border-color: var(--dark-sidebar-light-12) !important;
              }
            }

            .experience-wrapper {
              .experience-item {
                > img {
                  border-color: var(--dark-sidebar-light-12);
                }

                .meta {
                  > span {
                    &:nth-child(3) {
                      color: var(--primary);
                    }
                  }
                }
              }
            }

            .skills-wrapper {
              .skills-item {
                .icon-wrap {
                  border-color: var(--primary) !important;

                  &.has-icon,
                  &.has-img {
                    background: var(--dark-sidebar-light-2) !important;
                    border-color: var(--dark-sidebar-light-12) !important;
                  }
                }

                .people {
                  .v-avatar {
                    &:last-child {
                      .is-fake {
                        background: var(--dark-sidebar-light-2);
                        border: 1px solid var(--dark-sidebar-light-12);
                      }
                    }
                  }
                }
              }
            }

            .recommendations-wrapper {
              .recommendations-item {
                background: var(--dark-sidebar-light-2);
                border-color: var(--dark-sidebar-light-12);

                .meta {
                  span {
                    &:first-child {
                      color: var(--primary);
                    }
                  }
                }
              }
            }

            .more-button {
              .button {
                background: var(--dark-sidebar-light-2);
                border-color: var(--dark-sidebar-light-12);
              }
            }
          }
        }
      }
    }
  }

  .icon-wrap,
  .icon-wrap.is-placeholder {
    background: var(--dark-sidebar-light-2) !important;
    border-color: var(--dark-sidebar-light-12) !important;
  }
}

@media only screen and (width <= 767px) {
  .profile-wrapper {
    .profile-body {
      .profile-card {
        padding: 20px;

        .profile-card-section {
          .section-content {
            .experience-wrapper,
            .languages-wrapper,
            .recommendations-wrapper {
              .experience-item,
              .languages-item,
              .recommendations-item {
                width: calc(100% - 16px);
              }
            }

            .skills-wrapper {
              .skills-item {
                .people {
                  .v-avatar {
                    &:not(:last-child) {
                      display: none !important;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
