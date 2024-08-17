<script setup lang="ts">
const router = useRouter();
const page = ref(1);

const jobs = ref(<any>[]);
const currentSelectedState = ref("created");
const props = defineProps({
  tasks: {
    type: Array,
    default: [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const getColorByState = (state: any) => {
  switch (state) {
    case "waitingRAMS":
      return "#f0d9f0";
    case "readyToStart":
      return "#dce4fb";
    case "started":
      return "#fcefe8";
    case "completed":
      return "#c1efd2";
    default:
      return "#f3f1f1";
  }
};

const gotoJob = (jobId: any) => {
  router.push({
    name: "/sidebar/company/jobs/[id]",
    params: { id: jobId },
  });
};

const filterJobsByTabs = (selectedState: any) => {
  currentSelectedState.value = selectedState;
  jobs.value = props.tasks.filter(
    (job) => job.state == currentSelectedState.value
  );
};

const filteredData = computed(() => {
  return jobs.value;
});

onMounted(() => {
  jobs.value = props.tasks;
});
</script>

<template>
  <div>
    <div class="page-content-inner">
      <div class="flex-list-wrapper flex-list-v1">
        <!--List Empty Search Placeholder -->
        <VPlaceholderPage
          v-if="!jobs.length"
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
        <!-- <PlaceloadV1 v-if="Loading" /> -->
        <div>
          <PlaceloadV3 v-if="$props.loading" />
          <div class="row mb-3">
            <div class="columns is-multiline">
              <div class="column is-12 is-flex">
                <VButton
                  @click="filterJobsByTabs('created')"
                  class="ml-4 cus-tag-button"
                  rounded
                  :color="currentSelectedState == 'created' ? 'dark' : 'white'"
                  elevated
                  >New Jobs ({{
                    props.tasks.filter((task) => task.state === "created")
                      .length
                  }})
                </VButton>
                <VButton
                  @click="filterJobsByTabs('readyToStart')"
                  class="ml-2 cus-tag-button"
                  rounded
                  :color="
                    currentSelectedState == 'readyToStart' ? 'dark' : 'white'
                  "
                  >Ready To Start ({{
                    props.tasks.filter((task) => task.state === "readyToStart")
                      .length
                  }})
                </VButton>
                <VButton
                  @click="filterJobsByTabs('started')"
                  class="ml-2 cus-tag-button"
                  :color="currentSelectedState == 'started' ? 'dark' : 'white'"
                  rounded
                  >In Progress ({{
                    props.tasks.filter((task) => task.state === "started")
                      .length
                  }})
                </VButton>
                <VButton
                  @click="filterJobsByTabs('waitingRAMS')"
                  class="ml-2 cus-tag-button"
                  rounded
                  :color="
                    currentSelectedState == 'waitingRAMS' ? 'dark' : 'white'
                  "
                  >Pending Checks ({{
                    props.tasks.filter((task) => task.state === "waitingRAMS")
                      .length
                  }})
                </VButton>
                <VButton
                  @click="filterJobsByTabs('completed')"
                  class="ml-2 cus-tag-button"
                  :color="
                    currentSelectedState == 'completed' ? 'dark' : 'white'
                  "
                  rounded
                  >Completed Job ({{
                    props.tasks.filter((task) => task.state === "completed")
                      .length
                  }})
                </VButton>
              </div>
            </div>
          </div>

          <section>
            <div class="cu-card-container">
              <!-- Card 1 -->
              <div
                style="min-height: 18rem"
                :style="{
                  backgroundImage: `linear-gradient(-175deg, white 60%, ${getColorByState(
                    item.state
                  )}90)`,
                }"
                class="cus-card"
                v-for="item in filteredData"
                :key="item.id"
              >
                <i
                  @click="gotoJob(item.id)"
                  class="fas fa-external-link-square-alt expand-icon"
                  aria-hidden="true"
                ></i>
                <div
                  style="
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                  "
                >
                  <div>
                    <div class="manager-div">
                      <div class="user-details content cu-pointer">
                        <h3>
                          {{ item && item.title ? item.title : "-----" }}
                        </h3>
                        <p class="title mb-1">
                          Id:
                          <span class="is-small-bold">
                            {{
                              item && item.externalId
                                ? item.externalId
                                : "-----"
                            }}</span
                          >
                        </p>
                      </div>
                    </div>

                    <div class="manager-div mt-3 mb-2">
                      <img
                        class="user-image cu-pointer"
                        @click="
                          () => {
                            gotoJob(item.id);
                          }
                        "
                        :src="
                          item.managerInfo && item.managerInfo.profileImage
                            ? item.managerInfo.profileImage
                            : '/images/avatars/placeholder.jpg'
                        "
                        alt="User 1"
                      />
                      <div class="user-details content cu-pointer">
                        <h3
                          @click="
                            () => {
                              $router.push(`/sidebar/company/jobs/${item.id}`);
                            }
                          "
                        >
                          {{
                            item.managerInfo && item.managerInfo.first_name
                              ? item.managerInfo.first_name
                              : "-----"
                          }}
                          {{
                            item.managerInfo && item.managerInfo.last_name
                              ? item.managerInfo.last_name
                              : ""
                          }}
                        </h3>
                        <p class="title mb-0">
                          {{
                            item.managerInfo && item.managerInfo.email
                              ? item.managerInfo.email
                              : "-----"
                          }}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="item.siteInfo"
                    class="mt-2"
                    style="
                      background-color: #05d69e09;
                      padding: 2px;
                      border-radius: 3px;
                    "
                  >
                    <p class="">
                      <span class="light-text"> Site: </span>
                    </p>
                    <h3 class="mb-0">
                      {{ item?.siteInfo?.name }}
                    </h3>
                    <p class="title" style="font-size: 12px">
                      Incharge :
                      <span class="is-small-bold">
                        {{
                          item.siteInfo && item.siteInfo.inchargeName
                            ? item.siteInfo.inchargeName
                            : ""
                        }}
                      </span>
                    </p>
                    <p class="is-small-bold">
                      {{
                        item.siteInfo && item.siteInfo.postcode
                          ? item.siteInfo.postcode
                          : ""
                      }}
                      ({{
                        item.siteInfo && item.siteInfo.city
                          ? item.siteInfo.city
                          : ""
                      }})
                    </p>
                    <p class="cus-light-text">
                      {{
                        item.siteInfo && item.siteInfo.address
                          ? item.siteInfo.address
                          : ""
                      }}
                    </p>
                  </div>
                  <div class="worker-div mt-4">
                    <h1>Assigned Workers:</h1>
                    <div>
                      <VAvatar
                        v-for="worker in item.assignedWorkers"
                        :key="worker.id"
                        size="small"
                        :picture="
                          worker && worker.profileImageURL
                            ? worker.profileImageURL
                            : ''
                        "
                      ></VAvatar>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <!--Table Pagination-->
        <VFlexPagination
          v-if="jobs.length > 5"
          v-model:current-page="page"
          :item-per-page="10"
          :total-items="jobs.length"
          :max-links-displayed="7"
          no-router
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "/@src/scss/abstracts/all";
.worker-div {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.manager-div {
  display: flex;
}
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
  width: 31%;
  margin: 8px;
  padding: 15px 16px;
  border-radius: 18px;
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
}

.data-list-item {
  margin-bottom: 5px;
  display: flex;
  flex-direction: row;
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
