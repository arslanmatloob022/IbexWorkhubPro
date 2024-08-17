<script setup lang="ts">
import { get } from "cypress/types/lodash";
import { useApi } from "/@src/composable/useAPI";
import { useCompany } from "/@src/stores/company";
import { useNotyf } from "/@src/composable/useNotyf";
import type { VAvatarProps } from "/@src/components/base/avatar/VAvatar.vue";
import * as listData from "/@src/data/layouts/flex-list-v1";

const company = useCompany();
const route = useRoute();
const notyf = useNotyf();
const api = useApi();
const Loading = ref(false);
const router = useRouter();
const EditJobModalOpen = ref(false);
const selectedJobId = ref(0);
const page = ref(1);
const filters = ref("");
const jobsArray = ref<any>([]);
const maxLinksDisplayed = ref(3);
const props = defineProps<{
  tasks: {
    type: Array;
    default: [];
  };
}>();

const jobs = ref<any>([]);

const columns = {
  title: {
    label: "Job",
    grow: true,
  },
  manager: {
    label: "Manager",
    grow: true,
  },
  externalID: "External ID",
  isWorkWithContractor: "Type",
  type: "Status",
  status: "workers",
  actions: {
    label: "Actions",
    align: "end",
  },
} as const;

const pageData = ref([
  {
    id: 1,
    title: "job title",
    description: "desc goes here",
    externalId: "extr-123",
    state: "contractor",
    createdAt: "2024-05-01T09:45:53.627773Z",
    updatedAt: "2024-05-01T09:45:53.627796Z",
    manager: null,
  },
]);

const openJobEditModal = (jobId: any) => {
  selectedJobId.value = jobId;
  EditJobModalOpen.value = true;
};

const gotoJob = (jobId: any) => {
  router.push({
    name: "/sidebar/company/jobs/[id]",
    params: { id: jobId },
  });
};

const getJobsState = (state: any) => {
  switch (state) {
    case "created":
      return "Created";
    case "started":
      return "In Progress";
    case "waitingRAMS":
      return "Pending for Checks";
    case "readyToStart":
      return "Ready to Start";
    case "completed":
      return "Job Completed";
  }
};

const getStateColor = (state: any) => {
  switch (state) {
    case "created":
      return "secondary";
    case "started":
      return "info";
    case "waitingRAMS":
      return "warning";
    case "readyToStart":
      return "success";
    case "completed":
      return "primary";
  }
};

const filteredData = computed(() => {
  jobsArray.value = props.tasks;
  return jobsArray.value;
});
</script>

<template>
  <div>
    <div class="page-content-inner">
      <div class="flex-list-wrapper flex-list-v1">
        <!--List Empty Search Placeholder -->
        <VPlaceholderPage
          v-if="!filteredData.length"
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
        <PlaceloadV1 v-if="Loading" />
        <VFlexTable
          v-if="filteredData.length"
          :data="filteredData"
          :columns="columns"
          compact
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
                  data-th="Label"
                  class="cu-pointer"
                  @click="gotoJob(item.id)"
                >
                  <div>
                    <span class="item-name dark-inverted"
                      >{{
                        item.title || item.title.length > 10
                          ? item.title.slice(0, 36)
                          : ""
                      }}...</span
                    >
                    <span class="item-meta">
                      <span
                        >{{
                          item.description && item.description.length > 60
                            ? item.description.slice(0, 50)
                            : ""
                        }}...</span
                      >
                    </span>
                  </div>
                </VFlexTableCell>

                <VFlexTableCell
                  :column="{ media: true, grow: true }"
                  data-th="Label"
                >
                  <VAvatar
                    :picture="
                      item.managerInfo && item.managerInfo.profileImage
                        ? item.managerInfo.profileImage
                        : ''
                    "
                  />
                  <div>
                    <span class="item-name dark-inverted"
                      >{{
                        item.managerInfo && item.managerInfo.first_name
                          ? item.managerInfo.first_name
                          : "Not Assigned"
                      }}
                      {{
                        item.managerInfo && item.managerInfo.last_name
                          ? item.managerInfo.last_name
                          : ""
                      }}</span
                    >
                    <span class="item-meta">
                      <span>{{
                        item.managerInfo && item.managerInfo.email
                          ? item.managerInfo.email
                          : ""
                      }}</span>
                    </span>
                  </div>
                </VFlexTableCell>
                <VFlexTableCell>
                  <VTag color="primary" light>
                    Ext-{{ item.externalId ? item.externalId : "" }}
                  </VTag>
                  <!-- <span class="light-text"></span> -->
                </VFlexTableCell>
                <VFlexTableCell>
                  <span class="light-text">{{
                    item.isWorkWithContractor ? "Contractor" : "Self Serve"
                  }}</span>
                </VFlexTableCell>
                <VFlexTableCell :column="{ align: 'center' }">
                  <VTag :color="getStateColor(item.state)">
                    {{ getJobsState(item.state) }}
                  </VTag>
                </VFlexTableCell>
                <VFlexTableCell>
                  <VAvatarStack
                    :avatars="item.imagesList"
                    size="small"
                    :limit="3"
                    class="is-pushed-mobile"
                  />
                </VFlexTableCell>
                <VFlexTableCell :column="{ align: 'end' }">
                  <VDropdown icon="feather:more-vertical" spaced right>
                    <template #content>
                      <a
                        v-if="item.isWorkWithContractor"
                        role="menuitem"
                        class="dropdown-item is-media"
                        @click="gotoJob(item.id)"
                      >
                        <div class="icon">
                          <i class="lnil lnil-tab" aria-hidden="true"></i>
                        </div>
                        <div class="meta">
                          <span>RAMS</span>
                          <span>Manage RAMS</span>
                        </div>
                      </a>
                      <a
                        v-else
                        role="menuitem"
                        class="dropdown-item is-media"
                        @click="gotoJob(item.id)"
                      >
                        <div class="icon">
                          <i class="lnil lnil-tab" aria-hidden="true"></i>
                        </div>
                        <div class="meta">
                          <span>CPP</span>
                          <span>Manage CPP</span>
                        </div>
                      </a>
                      <a
                        role="menuitem"
                        class="dropdown-item is-media"
                        @click="openJobEditModal(item.id)"
                      >
                        <div class="icon">
                          <i aria-hidden="true" class="lnil lnil-bubble" />
                        </div>
                        <div class="meta">
                          <span>Edit</span>
                          <span>Edit Job</span>
                        </div>
                      </a>

                      <hr class="dropdown-divider" />

                      <a
                        role="menuitem"
                        href="#"
                        class="dropdown-item is-media"
                      >
                        <div class="icon">
                          <i class="lnir lnir-archive" aria-hidden="true"></i>
                        </div>
                        <div class="meta">
                          <span>Delete</span>
                          <span>Delete job</span>
                        </div>
                      </a>
                    </template>
                  </VDropdown>
                </VFlexTableCell>
              </div>
            </TransitionGroup>
          </template>
        </VFlexTable>

        <!--Table Pagination-->
        <VFlexPagination
          v-if="jobsArray.length > 5"
          v-model:current-page="page"
          :item-per-page="10"
          :total-items="jobsArray.length"
          :max-links-displayed="maxLinksDisplayed"
          no-router
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "/@src/scss/abstracts/all";

#cus-toggler {
  position: relative;
  display: block;
  height: 31px;
  width: 53px;
  border: 2px solid var(--info);
  border-radius: 100px;
  transition:
    color 0.3s,
    background-color 0.3s,
    border-color 0.3s,
    height 0.3s,
    width 0.3s;
}

#cus-toggle-center {
  width: 100% !important;
  display: flex !important;
  justify-content: center !important;
}

.active-filter-tab {
  background-color: var(--primary);
  color: white;

  font-weight: 400;
  border-radius: 10px;
}

.is-dark {
  .dropdown-card {
    border: solid 1px #6d6d6d;
    background-color: var(--dark-sidebar-light-2);
  }
}

.dropdown-card {
  width: 300px;
  position: absolute;
  right: 15%;
  top: 0;
  background-color: var(--white);
  border: 1px solid #ccc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 10px;
  border-radius: 8px;
  z-index: 1;
}

.dropdown-card button {
  display: block;
  width: 100%;
  padding: 8px;
  margin-bottom: 8px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.dropdown-card button:hover {
  background-color: #0056b3;
}

.anomalies-heading {
  font-size: 19px;
  font-weight: 500;
  color: #333;
}

.drop-div {
  width: 12px;
  height: 2px;
  margin: 16px 289px 16px 0;
  border-radius: 2px;
  background-color: #ccc;
}

.activeTab {
  border-bottom: 2px solid var(--primary);
}

.inactiveTab {
  border-bottom: 1px solid #a2a2a2;
}

.cus-dark-color {
  color: #5d5d5d;
}

.cu-card-container {
  display: flex;
  flex-wrap: wrap;
  padding: 6px;
}

.is-dark {
  .cus-card {
    border: solid 1px #6d6d6d;
    background-color: var(--dark-sidebar-light-2);
  }
}

.cus-card {
  position: relative;
  width: 23%;
  margin: 12px;
  padding: 15px 16px 16px;
  border-radius: 32px;
  border: solid 1px #ebebeb;
  background-color: var(--white);

  .expand-icon {
    position: absolute;
    top: 20px;
    right: 20px;
    color: #ebebeb;
    font-size: 20px;
    cursor: pointer;
  }
}

.close-icon {
  position: absolute;
  top: 12px;
  right: 12px;
  color: #ebebeb;
  font-size: 20px;
  cursor: pointer;
}

.user-image {
  width: 43px;
  height: 43px;
  margin: 0 18px 12px 0;
  border-radius: 16px;
  object-fit: cover;
  margin-bottom: 10px;
}

.user-details {
  margin-bottom: 10px;

  h3 {
    font-size: 15px;
  }

  p {
    font-size: 12px;
  }
}

.data-list {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
}

.data-list-item {
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 500;
  color: #666;
}

.cus-state-box {
  cursor: pointer;
  display: flex;
  position: relative;
  gap: 12px;
  align-items: center;
  border-radius: 24px;
  padding: 12px 22px;
  margin: 12px;

  &:nth-child(1) {
    background-color: #e3f3f3;
  }

  &:nth-child(2) {
    background-color: #5887ff30;
  }

  &:nth-child(3) {
    background-color: #e54b4b30;
  }

  &:nth-child(4) {
    background-color: #c449c230;
  }

  &:nth-child(5) {
    background-color: #ff8e7230;
  }

  &.active {
    &::before {
      content: "";
      background-color: var(--primary);
      position: absolute;
      height: 4px;
      width: 80%;
      border-radius: 8px;
      left: 10%;
      top: -10px;
      bottom: 10px;
      z-index: 1;
    }
  }

  .stat-content {
    p {
      font-size: 13px;
      font-weight: 500;
    }

    h1 {
      width: min-content;
      font-size: 26px;
      font-weight: 500;
    }
  }
}

.stat-heading {
  width: min-content;
  font-size: 26px;
  font-weight: 500;
}

.buttons {
  width: 100%;
  display: flex !important;
  flex-direction: column !important;
  justify-content: space-between !important;
}

.attractive-button {
  display: inline-block;
  border: none;
  color: var(--light-text);
  padding: 8px 10px;
  text-align: left;
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-bottom: 12px;
  border-bottom: 2px solid #898;

  &.active {
    color: var(--primary);
    border-bottom: 2px solid var(--primary);
  }
}

.tools-wrapper {
  margin: 0 auto;

  .tool-card {
    position: relative;

    input {
      position: absolute;
      top: 0;
      inset-inline-start: 0;
      height: 100%;
      width: 100%;
      opacity: 0;
      cursor: pointer;

      &:checked + .tool-card-inner {
        color: var(--primary);
        font-weight: 500;

        .flex-end {
          .checkmark {
            display: flex;
            opacity: 1;
          }
        }
      }
    }

    .tool-card-inner {
      padding: 2px;
      background: transparent;
      border-radius: 10px;
      color: #999;

      .media-flex-center {
        .flex-end {
          .checkmark {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 12px;
            width: 12px;
            border: 1px solid var(--fade-grey-dark-3);
            border-radius: var(--radius-rounded);
            box-shadow: var(--light-box-shadow);
            opacity: 0;
            color: var(--primary);
            transition:
              color 0.3s,
              background-color 0.3s,
              border-color 0.3s,
              height 0.3s,
              width 0.3s;

            svg {
              height: 14px;
              width: 14px;
              stroke-width: 3px;
            }
          }
        }
      }
    }
  }
}

.account-wrapper {
  padding-bottom: 0px;

  .account-box {
    padding: 3px;
    border-radius: 6px;
    margin-bottom: 10px;

    &.is-navigation {
      .media-flex-center {
        padding-bottom: 2px;

        .flex-meta {
          span {
            &:first-child {
              font-size: 1.3rem;
            }
          }
        }
      }

      .account-menu {
        .account-menu-item {
          display: flex;
          align-items: center;
          padding: 4px;
          width: 100%;
          border: 1px solid transparent;
          border-radius: 8px;
          margin-bottom: 0px;
          transition: all 0.3s; // transition-all test

          &.router-link-exact-active {
            box-shadow: var(--light-box-shadow);
            border-color: var(--fade-grey-dark-3);

            span,
            i {
              color: var(--primary);
            }

            .end {
              display: block;
            }
          }

          &:not(.router-link-exact-active) {
            &:hover {
              background: var(--fade-grey-light-3);
            }
          }

          i {
            margin-inline-end: 8px;
            font-size: 1.1rem;
            color: var(--light-text);

            &.fas,
            .fal,
            .far {
              font-size: 0.9rem;
            }
          }

          span {
            font-family: var(--font-alt);
            font-size: 0.95rem;
            color: var(--dark-text);
          }

          .end {
            margin-inline-start: auto;
            display: none;
          }
        }
      }
    }

    &.is-form {
      padding: 0;

      &.is-footerless {
        padding-bottom: 20px;
      }

      .form-head,
      .form-foot {
        padding: 12px 20px;

        .form-head-inner,
        .form-foot-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      }

      .form-head {
        border-bottom: 1px solid var(--fade-grey-dark-3);
        transition: all 0.3s; // transition-all test

        &.is-stuck {
          background: var(--white);
          padding-inline-end: 80px;
          border-inline-start: 1px solid var(--fade-grey-dark-3);
        }

        .left {
          h3 {
            font-family: var(--font-alt);
            font-size: 1.2rem;
            line-height: 1.3;
          }

          p {
            font-size: 0.95rem;
          }
        }
      }

      .form-foot {
        border-top: 1px solid var(--fade-grey-dark-3);
      }

      .form-body {
        padding: 20px;

        .fieldset {
          padding: 20px 0;
          max-width: 480px;
          margin: 0 auto;

          .fieldset-heading {
            margin-bottom: 20px;

            h4 {
              font-family: var(--font-alt);
              font-weight: 600;
              font-size: 1rem;
            }

            p {
              font-size: 0.9rem;
            }
          }

          .v-avatar {
            position: relative;
            display: block;
            margin: 0 auto;

            .edit-button {
              position: absolute;
              bottom: 0;
              inset-inline-end: 0;
            }
          }

          .setting-list {
            .setting-form {
              text-align: center;

              .filepond-profile-wrap {
                margin: 0 auto 10px !important;
              }
            }

            .setting-item {
              display: flex;
              align-items: center;
              margin-bottom: 24px;

              .icon-wrap {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 50px;
                min-width: 50px;
                height: 50px;
                border-radius: var(--radius-rounded);
                background: var(--fade-grey-light-2);
                border: 1px solid var(--fade-grey-dark-3);
                color: var(--light-text);

                &.has-img {
                  border-color: var(--primary);

                  img {
                    width: 36px;
                    min-width: 36px;
                    height: 36px;
                  }
                }

                i {
                  font-size: 1.4rem;
                }
              }

              img {
                display: block;
                width: 50px;
                min-width: 50px;
                height: 50px;
                border-radius: var(--radius-rounded);
                border: 1px solid transparent;
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
                    font-size: 0.9rem;
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

              .end {
                margin-inline-start: auto;
              }
            }
          }
        }
      }
    }
  }
}

.is-dark {
  .account-wrapper {
    .account-box {
      &.is-navigation {
        .account-menu {
          .account-menu-item {
            &.router-link-exact-active {
              background: var(--dark-sidebar-light-8);
              border-color: var(--dark-sidebar-light-12);

              i,
              span {
                color: var(--primary);
              }
            }

            &:not(.router-link-exact-active) {
              &:hover {
                background: var(--dark-sidebar-light-10);
              }
            }

            span {
              color: var(--dark-dark-text);
            }
          }
        }
      }

      &.is-form {
        .form-head,
        .form-foot {
          border-color: var(--dark-sidebar-light-12);
        }

        .form-head {
          &.is-stuck {
            background: var(--dark-sidebar);
            border-color: var(--dark-sidebar-light-6);
          }

          .left {
            h3 {
              color: var(--dark-dark-text);
            }
          }
        }

        .form-body {
          .fieldset {
            .fieldset-heading {
              h4 {
                color: var(--dark-dark-text);
              }
            }

            .setting-list {
              .setting-item {
                > img,
                > .icon-wrap,
                > .icon-wrap img {
                  border-color: var(--dark-sidebar-light-12);
                }

                > .icon-wrap {
                  background: var(--dark-sidebar-light-2);
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
          }
        }
      }
    }
  }
}

.button-image {
  height: 22px;
  width: 20px;
  display: inline-block;
  vertical-align: middle;
  margin-right: 10px;
}

.button-image img {
  width: 16px;
  height: auto;
}

.radio {
  padding: 0.7rem !important;
}

.item-meta {
  span {
    font-size: 10px !important;
  }
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

@media only screen and (width <=767px) {
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

@media only screen and (width >=768px) and (width <=1024px) and (orientation: portrait) {
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

.navbar-item {
  &.is-theme-toggle {
    opacity: 1;
    pointer-events: all;
  }

  .nav-link {
    position: relative;
    font-family: var(--font-alt);
    font-size: 0.9rem;
    color: var(--light-text);
    text-transform: capitalize;

    &::before {
      content: "";
      position: absolute;
      top: -4px;
      inset-inline-start: 2px;
      width: 50%;
      transform-origin: right center;
      height: 3px;
      border-radius: 50px;
      background: var(--primary);
      transform: scale(0, 1);
      transition: -webkit-transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      transition:
        transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
        -webkit-transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    // Hover state
    &:hover,
    &.is-active {
      color: var(--dark-text);

      &::before {
        transform-origin: left center;
        transform: scale(1, 1);
      }
    }

    &.active {
      &::before {
        background: var(--primary);
      }
    }
  }

  .theme-toggle {
    width: 43px;
    display: block;
    position: relative;
    cursor: pointer;
    font-size: 22px;
    user-select: none;
    transform: scale(0.9);

    &:focus-within {
      border-radius: 50px;
      outline-offset: var(--accessibility-focus-outline-offset);
      outline-width: var(--accessibility-focus-outline-width);
      outline-style: var(--accessibility-focus-outline-style);
      outline-color: var(--accessibility-focus-outline-color);
    }

    input {
      position: absolute;
      opacity: 0;
      cursor: pointer;

      &:checked ~ .toggler {
        border-color: var(--warning);

        .dark,
        .light {
          transform: translateX(calc(var(--transform-direction) * 100%))
            rotate(360deg);
        }

        .dark {
          opacity: 1 !important;
        }

        .light {
          opacity: 0 !important;
        }
      }
    }

    .toggler {
      position: relative;
      display: block;
      height: 24px;
      width: 44px;
      border: 2px solid var(--primary);
      border-radius: 100px;
      transition:
        color 0.3s,
        background-color 0.3s,
        border-color 0.3s,
        height 0.3s,
        width 0.3s;

      .dark,
      .light {
        position: absolute;
        top: 1px;
        inset-inline-start: 2px;
        height: 18px;
        width: 18px;
        border-radius: var(--radius-rounded);
        background: black;
        display: flex;
        justify-content: center;
        align-items: center;
        transform: translateX(calc(var(--transform-direction) * 0))
          rotate(calc(var(--transform-direction) * 0));
        transition: all 0.3s ease;

        svg {
          color: var(--white) !important;
          height: 12px !important;
          width: 12px !important;
          opacity: 1 !important;
        }
      }

      .light {
        background: var(--primary);
        border-color: var(--primary);
        opacity: 1;
        z-index: 1;
      }

      .dark {
        background: var(--warning);
        border-color: var(--warning);
        opacity: 0;
        z-index: 0;

        svg {
          color: var(--white) !important;
        }
      }
    }
  }

  .button {
    font-weight: 400 !important;
    height: 44px;
    min-width: 110px;
  }
}
</style>
