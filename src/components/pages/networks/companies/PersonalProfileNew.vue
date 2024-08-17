<script setup lang="ts">
import { onceImageErrored } from "/@src/utils/via-placeholder";
import { useUserSession } from "/@src/stores/userSession";
import { useNotyf } from "/@src/composable/useNotyf";
import { useApi } from "/@src/composable/useAPI";
type TabId = "overview" | "content" | "brands";
const activeTab = ref<TabId>("overview");
const userSession = useUserSession();
const edit_mode = ref(false);
const isUploading = ref(false);
const api = useApi();
const notyf = useNotyf();
const user_action = ref("update");
const FormData = ref({});
const CustomUserData = ref({
  id: "",
  password: "",
  last_login: "",
  date_joined: "",
  email: "",
  role: "",
  avatar: "",
  is_active: "",
  phoneNumber: "",
  username: "",
  is_sentMail: 0,
});
CustomUserData.value = userSession.user;
console.log(userSession.user);
const inputChangeHandler = (event: any) => {
  FormData.value = {
    ...FormData.value,
    [event.target.name]: event.target.value,
  };
};

const onAddFile = (error: any, fileInfo: any) => {
  const _file = fileInfo.file as File;
  if (_file) {
    console.log(_file);
    FormData.value = { ...FormData.value, profileImage: _file };
  }
};

const onRemoveFile = (error: any, fileInfo: any) => {
  FormData.value = { ...FormData.value, profileImage: null };
};
const updateProfile = async () => {
  try {
    const formDataAPI = new window.FormData();
    for (const key in FormData.value) {
      formDataAPI.append(key, FormData.value[key]);
    }
    const response = await api.patch(
      `/v3/api/account/user/${CustomUserData.value.id}/`,
      formDataAPI
    );
    userSession.setUser(response.data);
    edit_mode.value = false;
    notyf.dismissAll();
    notyf.success("Profile updated successfully");
  } catch (error: any) {
    let errorObj = error.response.data ?? {};
    Object.values(errorObj).forEach((values) => {
      values.forEach((value) => {
        console.log(value);
        notyf.error(` ${value}, Profile `);
      });
    });
  }
};
</script>

<template>
  <div class="lifestyle-dashboard lifestyle-dashboard-v1">
    <div class="dashboard-header-wrapper">
      <div class="dashboard-header" v-if="!edit_mode">
        <div class="avatar-container">
          <img
            :src="userSession.user.avatar"
            alt=""
            @error.once="onceImageErrored(150)"
          />
          <!-- <button class="button is-circle">
          <span class="icon is-small">
            <i
              aria-hidden="true"
              class="iconify"
              data-icon="feather:plus"
            />
          </span>
        </button> -->
        </div>
        <div class="header-meta">
          <div class="username-wrap">
            <div class="username">
              <h3>
                <span>{{ CustomUserData.username }} </span>
                <i aria-hidden="true" class="fas fa-star" />
                <i aria-hidden="true" class="fas fa-star" />
                <i aria-hidden="true" class="fas fa-star" />
                <i aria-hidden="true" class="fas fa-star" />
                <i aria-hidden="true" class="fas fa-star" />
              </h3>
              <span>{{ CustomUserData.email }}</span>
            </div>
            <div class="badges">
              <VTag rounded color="info" :label="CustomUserData.role" />
            </div>
          </div>
          <div class="meta-stats">
            <div class="meta-stat">
              <span>{{ CustomUserData.phoneNumber }}</span>
            </div>
            <div class="meta-stat">
              <span>38.3K</span>
              <span>Followers</span>
            </div>
            <div class="meta-stat">
              <span>329</span>
              <span>Following</span>
            </div>
          </div>
          <div class="meta-description">
            <p>
              Artist, musician, songwriter, influencer, these are the many names
              people give me. But for you Iam simply Clarissa. *Forever with all
              my friends* // Latest video can be found here youtu.be/8Tcee5Cyz
            </p>
          </div>
          <div class="meta-achievements">
            <div>
              <Tippy>
                <div class="meta-achievement is-danger">
                  <i aria-hidden="true" class="fas fa-fire" />
                </div>
                <template #content>
                  <div class="v-popover-content is-text">
                    <div class="popover-head">
                      <VIconBox size="small" color="danger">
                        <i aria-hidden="true" class="fas fa-fire" />
                      </VIconBox>
                      <h4 class="dark-inverted">On Fire</h4>
                    </div>
                    <div class="popover-body">
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      </p>
                    </div>
                  </div>
                </template>
              </Tippy>
            </div>

            <div>
              <Tippy>
                <div class="meta-achievement is-primary">
                  <i aria-hidden="true" class="fas fa-medal" />
                </div>
                <template #content>
                  <div class="v-popover-content is-text">
                    <div class="popover-head">
                      <VIconBox size="small" color="primary">
                        <i aria-hidden="true" class="fas fa-medal" />
                      </VIconBox>
                      <h4 class="dark-inverted">Post Veteran</h4>
                    </div>
                    <div class="popover-body">
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      </p>
                    </div>
                  </div>
                </template>
              </Tippy>
            </div>

            <div>
              <Tippy>
                <div class="meta-achievement is-yellow">
                  <i aria-hidden="true" class="fas fa-trophy" />
                </div>
                <template #content>
                  <div class="v-popover-content is-text">
                    <div class="popover-head">
                      <VIconBox size="small" color="yellow">
                        <i aria-hidden="true" class="fas fa-medal" />
                      </VIconBox>
                      <h4 class="dark-inverted">Social Champion</h4>
                    </div>
                    <div class="popover-body">
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      </p>
                    </div>
                  </div>
                </template>
              </Tippy>
            </div>
          </div>
        </div>

        <div class="end">
          <!--Dropdown-->
          <VDropdown
            icon="feather:more-vertical"
            class="end-action"
            spaced
            right
          >
            <template #content>
              <a role="menuitem" href="#" class="dropdown-item is-media">
                <div class="icon">
                  <i aria-hidden="true" class="lnil lnil-whiteboard-alt-2" />
                </div>
                <div class="meta">
                  <span>Reports</span>
                  <span>View detailed reports</span>
                </div>
              </a>

              <a
                @click="edit_mode = true"
                role="menuitem"
                href="#"
                class="dropdown-item is-media"
              >
                <div class="icon">
                  <i aria-hidden="true" class="lnil lnil-pencil" />
                </div>
                <div class="meta">
                  <span>Edit</span>
                  <span>Edit this profile</span>
                </div>
              </a>

              <hr class="dropdown-divider" />

              <a role="menuitem" href="#" class="dropdown-item is-media">
                <div class="icon">
                  <i aria-hidden="true" class="lnil lnil-bubble" />
                </div>
                <div class="meta">
                  <span>Message</span>
                  <span>Send a direct message</span>
                </div>
              </a>

              <a role="menuitem" href="#" class="dropdown-item is-media">
                <div class="icon">
                  <i aria-hidden="true" class="lnil lnil-gift-alt-1" />
                </div>
                <div class="meta">
                  <span>Gift</span>
                  <span>send a gift</span>
                </div>
              </a>

              <hr class="dropdown-divider" />

              <a role="menuitem" href="#" class="dropdown-item is-media">
                <div class="icon">
                  <i aria-hidden="true" class="lnil lnil-cog" />
                </div>
                <div class="meta">
                  <span>Settings</span>
                  <span>Configure settings</span>
                </div>
              </a>
            </template>
          </VDropdown>
        </div>
      </div>
      <div class="dashboard-header" v-if="edit_mode">
        <div class="header-meta">
          <div class="columns is-multiline mb-5">
            <div class="field column is-12 mb-0 is-offset-10">
              <div class="end">
                <!--Dropdown-->
                <div class="buttons">
                  <VButton
                    danger-outlined
                    rounded
                    color="danger"
                    @click="
                      () => {
                        edit_mode = false;
                      }
                    "
                  >
                    Cancel
                  </VButton>
                  <VButton
                    dark-outlined
                    rounded
                    color="primary"
                    @click="updateProfile"
                  >
                    Save
                  </VButton>
                </div>
              </div>
            </div>
            <div class="field column is-2 mb-0">
              <VField class="column is-12">
                <!-- <label>Profile Image:</label> -->
                <VControl class="is-flex is-justify-content-center mt-3">
                  <VAvatar size="xl" class="profile-v-avatar">
                    <template #avatar>
                      <img
                        v-if="!isUploading"
                        class="avatar"
                        :src="
                          CustomUserData.profileImage == null
                            ? '/images/avatars/placeholder.jpg'
                            : CustomUserData.profileImage
                        "
                        alt=""
                      />

                      <VFilePond
                        v-else
                        class="profile-filepond"
                        name="profile_filepond"
                        :chunk-retry-delays="[500, 1000, 3000]"
                        label-idle="<i class='fas fa-cloud-upload-alt' style='font-size:27px'></i>"
                        :accepted-file-types="[
                          'image/png',
                          'image/jpeg',
                          'image/gif',
                        ]"
                        :image-preview-height="140"
                        :image-resize-target-width="140"
                        :image-resize-target-height="140"
                        image-crop-aspect-ratio="1:1"
                        style-panel-layout="compact circle"
                        style-load-indicator-position="center bottom"
                        style-progress-indicator-position="right bottom"
                        style-button-remove-item-position="left bottom"
                        style-button-process-item-position="right bottom"
                        @addfile="onAddFile"
                        @removefile="onRemoveFile"
                      />

                      <span v-if="user_action == 'update'">
                        <VIconButton
                          style="position: absolute; top: 30%; right: -3%"
                          v-if="!isUploading"
                          icon="feather:edit-2"
                          class="edit-button is-edit"
                          circle
                          tabindex="0"
                          @keydown.space.prevent="isUploading = true"
                          @click="isUploading = true"
                        />

                        <VIconButton
                          style="position: absolute; top: 30%; right: -3%"
                          v-else
                          icon="feather:arrow-left"
                          class="edit-button is-back"
                          circle
                          tabindex="0"
                          @keydown.space.prevent="isUploading = false"
                          @click="isUploading = false"
                        />
                      </span>
                    </template>
                  </VAvatar>
                </VControl>
              </VField>
            </div>
            <div class="field column is-10 mb-0">
              <div class="columns is-multiline">
                <div class="field column is-4 mb-0">
                  <label>Fist name: *</label>
                  <div class="control">
                    <input
                      type="text"
                      name="first_name"
                      v-model="CustomUserData.first_name"
                      @change="(e) => inputChangeHandler(e)"
                      required
                      class="input"
                      placeholder="first name"
                    />
                  </div>
                </div>
                <div class="field column is-4 mb-0">
                  <label>Last name: *</label>
                  <div class="control">
                    <input
                      type="text"
                      name="last_name"
                      v-model="CustomUserData.last_name"
                      @change="(e) => inputChangeHandler(e)"
                      required
                      class="input"
                      placeholder="last name"
                    />
                  </div>
                </div>

                <div class="field column is-4 mb-0">
                  <label>Job title: </label>
                  <div class="control">
                    <input
                      type="text"
                      name="jobPosition"
                      v-model="CustomUserData.jobPosition"
                      @change="(e) => inputChangeHandler(e)"
                      class="input"
                      placeholder="job title"
                    />
                  </div>
                </div>
                <div class="field column is-4 mb-0">
                  <label>Department:</label>
                  <div class="control">
                    <input
                      type="text"
                      name="department"
                      v-model="CustomUserData.department"
                      @change="(e) => inputChangeHandler(e)"
                      class="input"
                      required
                      placeholder="Department"
                    />
                  </div>
                </div>
                <div class="field column is-4 mb-0">
                  <label>Mobile no:</label>
                  <div class="control">
                    <input
                      type="tel"
                      name="mobileNo"
                      v-model="CustomUserData.mobileNo"
                      @change="(e) => inputChangeHandler(e)"
                      class="input"
                      placeholder="Mobile no"
                    />
                  </div>
                </div>
                <div class="field column is-4 mb-0">
                  <label>Phone no:</label>
                  <div class="control">
                    <input
                      type="tel"
                      name="phoneNo"
                      v-model="CustomUserData.phoneNo"
                      @change="(e) => inputChangeHandler(e)"
                      class="input"
                      placeholder="Phone no"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="tabs-wrapper">
      <div class="tabs-inner">
        <div class="tabs">
          <ul>
            <li :class="[activeTab === 'overview' && 'is-active']">
              <a
                tabindex="0"
                role="button"
                @keydown.space.prevent="activeTab = 'overview'"
                @click="activeTab = 'overview'"
                >Overview</a
              >
            </li>
            <li :class="[activeTab === 'content' && 'is-active']">
              <a
                tabindex="0"
                role="button"
                @keydown.space.prevent="activeTab = 'content'"
                @click="activeTab = 'content'"
                >Content</a
              >
            </li>
            <li :class="[activeTab === 'brands' && 'is-active']">
              <a
                tabindex="0"
                role="button"
                @keydown.space.prevent="activeTab = 'brands'"
                @click="activeTab = 'brands'"
                >Brands</a
              >
            </li>
          </ul>
        </div>
      </div>

      <LifestyleOverviewTab v-if="activeTab === 'overview'" />
      <LifestyleContentTab v-else-if="activeTab === 'content'" />
      <LifestyleBrandsTab v-else-if="activeTab === 'brands'" />
    </div>
  </div>
</template>

<style lang="scss">
.dropdown.is-spaced .dropdown-menu {
  position: absolute;
  right: 2.5rem;
  top: -0.5rem;
  z-index: 50;
}

.dashboard-header-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  height: 220px;
  margin-bottom: 20px;
  z-index: 1;

  .dashboard-header {
    display: flex;
    width: 100%;

    .avatar-container {
      position: relative;
      height: 140px;
      width: 140px;
      min-width: 140px;

      img {
        display: block;
        height: 140px;
        width: 140px;
        min-width: 140px;
        border-radius: var(--radius-rounded);
      }

      .button {
        position: absolute;
        bottom: 5px;
        inset-inline-end: 5px;
      }
    }

    .header-meta {
      font-family: var(--font);
      margin-inline-start: 16px;

      .username-wrap {
        display: flex;

        .username {
          h3 {
            font-family: var(--font-alt);
            color: var(--dark-text);
            font-size: 1.2rem;
            font-weight: 700;

            i {
              font-size: 1.2rem;
              margin-inline-start: 5px;
              color: var(--yellow);
            }
          }

          > span {
            color: var(--light-text-dark-5);
          }
        }

        .badges {
          margin-inline-start: 16px;

          .tag {
            margin-inline-end: 0.5rem;
          }
        }
      }

      .meta-stats {
        display: flex;
        padding: 16px 0;

        .meta-stat {
          margin-inline-end: 30px;

          span {
            &:first-child {
              color: var(--dark-text);
              font-size: 1.3rem;
              font-weight: 600;
              margin-inline-end: 0.25rem;
            }

            &:nth-child(2) {
              color: var(--light-text);
            }
          }
        }
      }

      .meta-description {
        max-width: 640px;

        p {
          color: var(--light-text-dark-5);
        }
      }

      .meta-achievements {
        display: flex;
        padding-top: 16px;

        .meta-achievement {
          height: 36px;
          width: 36px;
          min-width: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid var(--white);
          background: var(--fade-grey);
          border-radius: var(--radius-rounded);
          margin-inline-end: 10px;
          box-shadow: var(--light-box-shadow);

          &.is-primary {
            color: var(--primary);
            background: var(--primary-light-45);
          }

          &.is-yellow {
            color: var(--yellow);
            background: var(--yellow-light-22);
          }

          &.is-danger {
            color: var(--danger);
            background: var(--danger-light-40);
          }
        }
      }
    }

    .end {
      margin-inline-start: auto;
    }
  }
}

.is-dark {
  .dashboard-header-wrapper {
    .dashboard-header {
      .header-meta {
        .username-wrap {
          .username {
            h3 {
              color: var(--dark-dark-text);
            }
          }
        }

        .meta-stats {
          .meta-stat {
            span {
              &:first-child {
                color: var(--dark-dark-text);
              }
            }
          }
        }
      }
    }
  }
}

@media only screen and (width <= 767px) {
  .dashboard-header-wrapper {
    height: 418px;

    .dashboard-header {
      flex-direction: column;

      .avatar-container {
        margin: 0 auto 10px;
      }

      .header-meta {
        margin-inline-start: 0;
        text-align: center;

        .username-wrap {
          flex-direction: column;

          .badges {
            margin: 10px auto;
          }
        }

        .meta-stats {
          justify-content: center;

          .meta-stat {
            margin: 0 10px;
          }
        }

        .meta-achievements {
          justify-content: center;
          padding-bottom: 16px;
        }
      }

      .end {
        position: absolute;
        inset-inline-end: 0;
      }
    }
  }
}
.lifestyle-dashboard-bg {
  position: absolute;
  top: 0;
  inset-inline-start: 0;
  width: 100%;
  height: 355px;
  background: var(--white);
  z-index: 1;

  &.has-top-nav {
    height: 368px;
  }
}

.lifestyle-dashboard-v1 {
  .tabs-wrapper {
    .tabs-inner {
      .tabs {
        margin-bottom: 30px;
        z-index: 10;

        ul {
          border: none;

          li {
            z-index: 10;

            a {
              border-bottom-width: 4px;
            }
          }
        }
      }
    }
  }

  .body-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: var(--font);
    margin-bottom: 20px;

    h3 {
      font-family: var(--font-alt);
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--dark-text);
    }

    .field {
      z-index: 5;
      min-width: 160px;

      .multiselect {
        .multiselect-input {
          .multiselect-single-label {
            color: var(--light-text);
          }
        }

        .multiselect-options {
          inset-inline-start: unset !important;
          min-width: 180px;
        }
      }
    }
  }

  .stat-widget {
    &:not(:last-child) {
      margin-bottom: 1.5rem;
    }
  }

  .post-stats {
    padding: 16px;
    text-align: center;
    width: 100%;
    font-family: var(--font);
    font-size: 0.9rem;

    span {
      color: var(--light-text);
    }

    .post-stat {
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1.2;

      i {
        font-size: 1.2rem;
        margin-inline-end: 6px;
      }

      .count {
        font-size: 2.2rem;
        font-weight: 700;
        color: var(--dark-text);
      }
    }
  }

  .post-group-wrap {
    padding: 4px 10px;

    .post-group {
      display: flex;
      margin-inline-start: -6px;
      margin-inline-end: -6px;

      a {
        display: block;
        width: calc(25% - 12px);
        margin: 6px;

        img {
          display: block;
          width: 100%;
          min-height: 65px;
          max-height: 85px;
          object-fit: cover;
          border-radius: var(--radius-large);
          margin: 0;
        }
      }
    }
  }
}

.is-dark {
  .lifestyle-dashboard-bg {
    background: var(--dark-sidebar-light-6);
  }

  .lifestyle-dashboard-v1 {
    .body-title {
      h3 {
        color: var(--dark-dark-text);
      }
    }
  }
}

@media only screen and (width <= 767px) {
  .lifestyle-dashboard-bg {
    &:not(.has-top-nav) {
      height: 614px;
    }

    &.has-top-nav {
      height: 625px;
    }
  }

  .lifestyle-dashboard-v1 {
    .tabs-wrapper {
      .tabs-inner {
        .tabs {
          ul {
            text-align: center;
            justify-content: center;
          }
        }
      }
    }
  }
}

@media only screen and (width >= 768px) and (width <= 1024px) and (orientation: portrait) {
  .lifestyle-dashboard-bg {
    &.has-top-nav {
      height: 428px;
    }

    &:not(.has-top-nav) {
      height: 415px;
    }
  }

  .lifestyle-dashboard-v1 {
    .is-flex-tablet-p {
      flex-wrap: wrap;

      .is-half-tablet-p {
        min-width: 50%;
      }

      .is-full-tablet-p {
        min-width: 100%;
      }

      .column.is-3 {
        min-width: 50%;
      }
    }
  }
}
</style>
