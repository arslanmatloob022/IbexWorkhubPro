<script setup lang="ts">
import { getJobStatusColor } from "../IbexJobsEstimates/estimatesScripts";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { formatDate, formatTime } from "/@src/composable/useSupportElement";
const api = useApi();
const notyf = useNotyf();
const router = useRouter();
const loading = ref(false);
const query = ref("");
const HomeRating = ref(4);
const projectIdDeleteTobe = ref(0);
const projects = ref([]);
const page = ref(1);
const SweetAlertProps = ref({
  title: "",
  subtitle: "test",
  isSweetAlertOpen: false,
  btntext: "text",
});

const columns = {
  username: {
    label: "Job",
    grow: true,
  },
  location: {
    label: "Contractor/Client",
    grow: true,
  },
  contacts: "Date Created",
  status: "Status",
  industry: "Manager",
  actions: {
    label: "Actions",
    align: "end",
  },
} as const;

const openDeleteAlert = (id: any) => {
  projectIdDeleteTobe.value = id;
  SweetAlertProps.value.title = "Delete Project";
  SweetAlertProps.value.subtitle =
    "As you delete this project you won't be able to recover it again";
  SweetAlertProps.value.btntext = "Delete it";
  SweetAlertProps.value.isSweetAlertOpen = true;
};

const getProjectHandler = async () => {
  try {
    loading.value = true;
    const response = await api.get("/api/project/project-jobs/", {});
    let data = response.data;

    projects.value = data.filter((project) => {
      return project.status == "completed";
    });
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const openLeadModal = ref(false);
const selectedLeadId = ref("");
const openLeadUpdateModal = (id: any) => {
  selectedLeadId.value = id;
  openLeadModal.value = true;
};

const openLeadDeleteAlert = (id: any) => {
  selectedLeadId.value = id;
  SweetAlertProps.value = {
    title: "Delete job?",
    subtitle:
      "Are you sure to delete this job? After delete you will not be able to recover it again.",
    btntext: "Yes delete",
    isSweetAlertOpen: true,
  };
};

const deleteProject = async () => {
  try {
    loading.value = true;
    await api.delete(`/api/project/${projectIdDeleteTobe.value}/`);
    notyf.success("Project deleted successfully");
    SweetAlertProps.value.isSweetAlertOpen = false;
    getProjectHandler();
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const filteredData = computed(() => {
  if (!query.value) {
    return projects.value;
  } else {
    return projects.value.filter((item) => {
      return item?.title.match(new RegExp(query.value, "i"));
    });
  }
});

onMounted(() => {
  getProjectHandler();
});
</script>

<template>
  <PlaceloadV1 v-if="loading" />
  <div v-else>
    <div class="list-view-toolbar">
      <VField>
        <VControl icon="feather:search">
          <input
            v-model="query"
            class="input custom-text-filter"
            placeholder="Search..."
          />
        </VControl>
      </VField>

      <div class="tabs-inner">
        <VButton
          color="primary"
          to="/sidebar/dashboard/projects/add-project"
          elevated
          >Add Project
        </VButton>
      </div>
    </div>

    <div class="page-content-inner">
      <!--List-->
      <div class="flex-list-wrapper flex-list-v1">
        <div class="columns is-multiline">
          <div class="column is-3"></div>
          <div class="column is-6 justify-right"></div>
        </div>
        <VPlaceholderPage
          v-if="!filteredData?.length"
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

        <VFlexTable
          v-if="filteredData?.length"
          :data="filteredData"
          :columns="columns"
          compact
        >
          <template #body>
            <TransitionGroup name="list" tag="div" class="flex-list-inner">
              <div
                v-for="item in filteredData"
                :key="item.id"
                class="flex-table-item"
              >
                <VFlexTableCell
                  @click="
                    () => {
                      router.push(`/sidebar/dashboard/jobs/${item.id}`);
                    }
                  "
                  class="cu-pointer"
                  :column="{ media: true, grow: true }"
                >
                  <VAvatar
                    picture="/IbexImages/done-job-60.png"
                    squared
                    size="medium"
                  />
                  <div>
                    <span class="item-name dark-inverted show-text-200">{{
                      item?.title ? item?.title : "N/A"
                    }}</span>
                    <span class="item-meta show-text-200">
                      <span>{{ item?.address ? item.address : "N/A" }}</span>
                    </span>
                  </div>
                </VFlexTableCell>
                <VFlexTableCell
                  @click="
                    () => {
                      router.push(`/sidebar/dashboard/jobs/${item.id}`);
                    }
                  "
                  class="cu-pointer"
                  :column="{ media: true, grow: true }"
                >
                  <div v-if="item?.clientInfo" class="show-text-200">
                    <span class="item-name">{{
                      item.clientInfo?.username
                        ? item.clientInfo?.username
                        : "N/A"
                    }}</span>
                    <span class="item-meta">
                      <span>{{
                        item.clientInfo?.email ? item.clientInfo?.email : "N/A"
                      }}</span>
                    </span>
                  </div>
                  <div v-if="item.contractor_info" class="show-text-200">
                    <span class="item-name dark-inverted">{{
                      item.contractor_info?.username
                        ? item.contractor_info?.username
                        : "N/A"
                    }}</span>
                    <span class="item-meta">
                      <span>{{
                        item.contractor_info?.email
                          ? item.contractor_info?.email
                          : "N/A"
                      }}</span>
                    </span>
                  </div>
                </VFlexTableCell>

                <VFlexTableCell
                  @click="
                    () => {
                      router.push(`/sidebar/dashboard/jobs/${item.id}`);
                    }
                  "
                  class="cu-pointer"
                  :column="{ media: true }"
                >
                  <div>
                    <span class="item-name dark-inverted">{{
                      formatDate(item.created)
                    }}</span>
                    <span class="item-meta">
                      <span>At:{{ formatTime(item.created) }}</span>
                    </span>
                  </div>
                </VFlexTableCell>

                <VFlexTableCell
                  @click="
                    () => {
                      router.push(`/sidebar/dashboard/jobs/${item.id}`);
                    }
                  "
                  class="cu-pointer"
                >
                  <VTag
                    class="capitalized"
                    :color="getJobStatusColor[item.status]"
                    rounded
                  >
                    {{ item.status ? item.status : "N/A" }}
                  </VTag>
                </VFlexTableCell>

                <VFlexTableCell
                  @click="
                    () => {
                      router.push(`/sidebar/dashboard/jobs/${item.id}`);
                    }
                  "
                  class="cu-pointer"
                  :column="{ media: true }"
                >
                  <div>
                    <VAvatar
                      v-for="manager in item?.managers_list"
                      :initials="manager.username.slice(0, 2)"
                      :picture="manager.avatar"
                      v-tooltip.center.primary.rounded="
                        `${manager.username} ${manager.last_name ?? ''}`
                      "
                      color="primary"
                      size="small"
                    />
                  </div>
                </VFlexTableCell>

                <VFlexTableCell :column="{ align: 'end' }">
                  <VDropdown
                    icon="feather:more-vertical"
                    class="is-pushed-mobile"
                    spaced
                    right
                  >
                    <template #content="{ close }">
                      <a
                        role="menuitem"
                        class="dropdown-item is-media"
                        @click="
                          () => {
                            router.push(`/sidebar/dashboard/jobs/${item.id}`);
                          }
                        "
                      >
                        <div class="icon">
                          <i aria-hidden="true" class="lnil lnil-eye" />
                        </div>
                        <div class="meta">
                          <span>View</span>
                          <span>View user details</span>
                        </div>
                      </a>

                      <!-- <a
                        role="menuitem"
                        @click="openAddProposalModalHandler(item.id)"
                        class="dropdown-item is-media"
                      >
                        <div class="icon">
                          <i class="lnil lnil-copy" aria-hidden="true"></i>
                        </div>
                        <div class="meta">
                          <span>Add Proposals</span>
                          <span>Add new proposal to lead</span>
                        </div>
                      </a> -->

                      <!-- <a
                        role="menuitem"
                        class="dropdown-item is-media"
                        @click.prevent="openLeadUpdateModal(item.id)"
                      >
                        <div class="icon">
                          <i aria-hidden="true" class="lnil lnil-pencil" />
                        </div>
                        <div class="meta">
                          <span>Edit</span>
                          <span>Update Lead Info</span>
                        </div>
                      </a> -->

                      <hr class="dropdown-divider" />

                      <a
                        role="menuitem"
                        class="dropdown-item is-media"
                        @click.prevent="openLeadDeleteAlert(item.id)"
                      >
                        <div class="icon">
                          <i
                            aria-hidden="true"
                            class="lnil lnil-trash-can-alt"
                          />
                        </div>
                        <div class="meta">
                          <span>Delete</span>
                          <span>Delete Proposal Permanently</span>
                        </div>
                      </a>
                    </template>
                  </VDropdown>
                </VFlexTableCell>
              </div>
            </TransitionGroup>
          </template>
        </VFlexTable>
        <VFlexPagination
          v-if="filteredData?.length > 5"
          v-model:current-page="page"
          :item-per-page="10"
          :total-items="80"
          :max-links-displayed="7"
          no-router
        />
      </div>
      <SweetAlert
        v-if="SweetAlertProps.isSweetAlertOpen"
        :isSweetAlertOpen="SweetAlertProps.isSweetAlertOpen"
        :title="SweetAlertProps.title"
        :subtitle="SweetAlertProps.subtitle"
        :btntext="SweetAlertProps.btntext"
        :onConfirm="deleteProject"
        :onCancel="() => (SweetAlertProps.isSweetAlertOpen = false)"
      />
    </div>
  </div>
</template>

<style lang="scss">
@import "/@src/scss/abstracts/all";

.list-view-v2 {
  .list-view-item {
    @include vuero-s-card;

    margin-bottom: 16px;
    padding: 16px;

    &:hover,
    &:focus {
      box-shadow: var(--light-box-shadow);
    }

    .list-view-item-inner {
      display: flex;

      > img {
        display: block;
        min-height: 130px;
        max-height: 130px;
        min-width: 190px;
        max-width: 190px;
        object-fit: cover;
        border-radius: var(--radius);
      }

      .meta-left {
        display: flex;
        flex-direction: column;
        margin-inline-start: 16px;

        h3 {
          font-family: var(--font-alt);
          color: var(--dark-text);
          font-weight: 600;
          font-size: 1.1rem;
          line-height: 1.5;

          .rating {
            margin-inline-start: 12px;

            i {
              font-size: 12px;
            }
          }
        }

        p {
          font-size: 0.95rem;
          color: var(--light-text);

          svg {
            height: 12px;
            width: 12px;
          }
        }

        > span {
          display: flex;
          align-items: center;
          margin-top: 10px;
          font-family: var(--font);
          font-size: 0.9rem;
          color: var(--primary);

          .icon-separator {
            font-size: 5px;
            color: var(--light-text);
            padding: 0 10px;
          }
        }

        .icon-list {
          margin-top: auto;
          display: flex;

          > span {
            display: flex;
            align-items: center;
            margin-inline-end: 15px;

            span {
              font-size: 0.85rem;
              font-family: var(--font-alt);
              color: var(--dark-text);
            }

            i {
              font-size: 1.2rem;
              margin-inline-end: 6px;
              color: var(--light-text);
            }
          }
        }
      }

      .meta-right {
        margin-inline-start: auto;
        display: flex;
        align-items: center;
        justify-content: flex-end;

        .buttons {
          margin-bottom: 0;
          margin-inline-end: 10px;
        }
      }
    }
  }
}

.is-dark {
  .list-view-v2 {
    .list-view-item {
      @include vuero-card--dark;

      .list-view-item-inner {
        .meta-left {
          h3 {
            color: var(--dark-dark-text) !important;
          }

          > span {
            color: var(--primary);
          }

          .icon-list {
            > span {
              span {
                color: var(--dark-dark-text);
              }
            }
          }
        }

        .meta-right {
          .buttons {
            .button {
              &:first-child {
                background: var(--dark-sidebar-light-2);
                border-color: var(--dark-sidebar-light-8);
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
  .list-view-v2 {
    .list-view-item {
      padding: 20px;

      .list-view-item-inner {
        flex-direction: column;

        > img {
          width: 100%;
          max-width: 100%;
          min-height: 160px;
          max-height: 160px;
          margin-bottom: 1rem;
        }

        .meta-left {
          margin-inline-start: 0;

          > span {
            margin-bottom: 16px;
          }

          .icon-list {
            flex-wrap: wrap;

            > span {
              flex-direction: column;
              text-align: center;
              margin: 10px;
              width: calc(33.3% - 20px);

              i {
                margin: 0;
              }
            }
          }
        }

        .meta-right {
          margin: 16px 0 0;

          .buttons {
            margin: 0;
            width: 100%;
            display: flex;
            justify-content: space-between;

            .button {
              width: 48%;
            }
          }
        }
      }
    }
  }
}

@media only screen and (width >= 768px) and (width <= 1024px) and (orientation: portrait) {
  .list-view-v2 {
    .list-view-inner {
      display: flex;
      flex-wrap: wrap;

      .list-view-item {
        padding: 20px;
        margin: 10px;
        width: calc(50% - 20px);

        .list-view-item-inner {
          flex-direction: column;
          height: 100%;
          min-height: 450px;

          > img {
            width: 100%;
            max-width: 100%;
            min-height: 160px;
            max-height: 160px;
            margin-bottom: 1rem;
          }

          .meta-left {
            margin-inline-start: 0;

            > span {
              margin-bottom: 16px;
            }

            .icon-list {
              flex-wrap: wrap;

              > span {
                flex-direction: column;
                text-align: center;
                margin: 10px;
                width: calc(33.3% - 20px);

                i {
                  margin: 0;
                }
              }
            }
          }

          .meta-right {
            margin: auto 0 0;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;

            .buttons {
              margin: 16px 0 0;
              width: 100%;
              display: flex;
              justify-content: space-between;

              .button {
                width: 48%;
              }
            }
          }
        }
      }
    }
  }
}
</style>
