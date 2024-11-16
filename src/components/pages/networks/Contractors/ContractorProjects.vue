<script setup lang="ts">
import { retails } from "/@src/data/layouts/view-list-v2";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { useUserSession } from "/@src/stores/userSession";

const userSession = useUserSession();
const api = useApi();
const notyf = useNotyf();
const loading = ref(false);
const query = ref("");
const filters = ref("");
const activeFilter = ref("all");
const HomeRating = ref(4);
const projectIdDeleteTobe = ref(0);
const projects = ref([]);
const SweetAlertProps = ref({
  title: "",
  subtitle: "test",
  isSweetAlertOpen: false,
  btntext: "text",
});

const props = defineProps<{
  contractorId?: string;
}>();

const filteredProjects = ref([
  {
    title: "",
    description: "",
    total_tasks: 2,
    percentage: 50.0,
    project_tasks: [],
    image: null as File | null,
    startDate: "",
    endDate: "",
    color: "#58cd32",
    status: "completed",
    wifiAvaliabe: false,
    parkingAvaliable: false,
    property_features: null,
    uploaded_files: [],
    contractor: "",
    is_active: false,
    managers: [],
    client: {
      id: 0,
      username: "",
      email: "",
      role: "",
      avatar: "",
    },
    contractor: {
      id: 0,
      username: "",
      email: "",
      role: "",
      avatar: "",
    },
  },
]);

const filterProject = (filterType: string | null) => {
  if (query.value && filterType == null) {
    activeFilter.value = "all";
    filteredProjects.value = projects.value.filter((project) =>
      project.title.toLowerCase().includes(query.value.toLowerCase())
    );
    return;
  } else if (!query.value && filterType == null) {
    filteredProjects.value = projects.value;
    return;
  } else {
    query.value = "";
  }
  activeFilter.value = filterType;
  if (activeFilter.value != "all") {
    const data = projects.value.filter(
      (project) => project.status == activeFilter.value
    );
    filteredProjects.value = data;
  } else {
    filteredProjects.value = projects.value;
  }
};

const openDeleteAlert = (id: any) => {
  projectIdDeleteTobe.value = id;
  SweetAlertProps.value.title = "Delete Project";
  SweetAlertProps.value.subtitle =
    "As you delete this project you won't be able to recover it again";
  SweetAlertProps.value.btntext = "Delete it";
  SweetAlertProps.value.isSweetAlertOpen = true;
};

const getContractorsProjectHandler = async () => {
  try {
    loading.value = true;
    const response = await api.get(
      `/api/project/${props.contractorId}/contractor-projects/`,
      {}
    );
    // projects.value = response.data;
    filteredProjects.value = response.data;
    // .filter((project) => {
    //   return project.status !== "completed";
    // });
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const deleteProject = async () => {
  try {
    loading.value = true;
    await api.delete(`/api/project/${projectIdDeleteTobe.value}/`);
    getContractorsProjectHandler();
    notyf.success("Project has been deleted");
  } catch (err) {
    console.log(err);
  } finally {
    getContractorsProjectHandler();
    loading.value = false;
  }
};

// Lifecycle hook
onMounted(() => {
  // setTooltip();
  getContractorsProjectHandler();
});

const filteredData = computed(() => {
  if (!filters.value) {
    return retails;
  } else {
    return retails.filter((item) => {
      return (
        item.name.match(new RegExp(filters.value, "i")) ||
        item.location.match(new RegExp(filters.value, "i")) ||
        ("parking".match(new RegExp(filters.value, "i")) &&
          item.comodities.parking) ||
        ("wifi".match(new RegExp(filters.value, "i")) &&
          item.comodities.wifi) ||
        ("heater".match(new RegExp(filters.value, "i")) &&
          item.comodities.heater) ||
        ("cleaning".match(new RegExp(filters.value, "i")) &&
          item.comodities.cleaning)
      );
    });
  }
});
</script>

<template>
  <PlaceloadV1 v-if="loading" />
  <div v-else>
    <div class="list-view-toolbar">
      <VField>
        <VControl icon="feather:search">
          <input
            @input="filterProject(null)"
            v-model="query"
            class="input custom-text-filter"
            placeholder="Search..."
          />
        </VControl>
      </VField>

      <!-- <div class="tabs-inner">
        <VButton
          color="primary"
          to="/sidebar/dashboard/projects/add-project"
          elevated
          >Add Project</VButton
        >
      </div> -->
    </div>

    <div class="page-content-inner">
      <!--List-->
      <div class="list-view list-view-v2">
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
              src="/@src/assets/illustrations/placeholders/search-2.svg"
              alt=""
            />
            <img
              class="dark-image"
              src="/@src/assets/illustrations/placeholders/search-2-dark.svg"
              alt=""
            />
          </template>
        </VPlaceholderPage>

        <!--Active Tab-->

        <div class="list-view-inner">
          <TransitionGroup name="list-complete" tag="div">
            <div
              v-for="item in filteredProjects"
              :key="item.id"
              class="list-view-item"
            >
              <div class="list-view-item-inner">
                <img
                  :src="item.image ? item.image : '/images/homePlaceholder.png'"
                  alt="Sample home"
                />
                <div class="meta-left">
                  <h3>
                    <span>{{ item.title }}</span>
                    <!-- <VRangeRating v-model="HomeRating" class="is-inline">
                      <i class="fas fa-star" aria-hidden="true" />
                    </VRangeRating> -->
                  </h3>
                  <p>
                    <i
                      aria-hidden="true"
                      class="iconify"
                      data-icon="feather:map-pin"
                    />
                    <span>{{ item.address ? item.address : "" }}</span>
                  </p>
                  <p>
                    <!-- <span>{{ item.description ? item.description : "" }}</span> -->
                  </p>
                  <span>
                    <!-- <span>
                      {{
                        item.managers.length
                          ? `${item.managers.length} `
                          : `${item.managers.length} `
                      }}
                      Managers
                    </span> -->

                    <span>
                      {{
                        item.uploaded_files.length
                          ? `${item.uploaded_files.length} `
                          : `${item.uploaded_files.length} `
                      }}
                      Files
                    </span>
                    <i
                      aria-hidden="true"
                      class="fas fa-circle icon-separator"
                    />
                    <span>
                      {{
                        item.managers.length > 1
                          ? `${item.managers.length} `
                          : `${item.managers.length} `
                      }}
                      Managers
                    </span>
                    <i
                      aria-hidden="true"
                      class="fas fa-circle icon-separator"
                    />
                  </span>

                  <div class="icon-list">
                    <span>
                      <i
                        aria-hidden="true"
                        :class="
                          item.parkingAvaliable ? 'primary-text' : 'danger-text'
                        "
                        class="lnil lnil-car"
                      />
                      <span
                        :class="
                          item.parkingAvaliable ? 'primary-text' : 'danger-text'
                        "
                        >Parking</span
                      >
                    </span>
                    <span>
                      <i
                        aria-hidden="true"
                        :class="
                          item.wifiAvaliabe ? 'primary-text' : 'danger-text'
                        "
                        class="lnil lnil-signal"
                      />
                      <span
                        :class="
                          item.wifiAvaliabe ? 'primary-text' : 'danger-text'
                        "
                        >Wifi</span
                      >
                    </span>
                    <!-- <span class="text-danger danger-text">
                      <i
                        aria-hidden="true"
                        class="text-danger danger-text lnil lnil-air-flow"
                      ></i>
                      <span>Heater</span>
                    </span> -->
                    <!-- <span>
                      <i aria-hidden="true" class="lnil lnil-sun" />
                      <span>Cleaning</span>
                    </span> -->
                    <!-- <span
                      v-if="
                        item.comodities.other &&
                        item.comodities.otherThing &&
                        item.comodities.otherCoolThing &&
                        item.comodities.otherGreatCoolThing
                      "
                    >
                      <i aria-hidden="true" class="lnil lnil-more" />
                      <span>4 more</span>
                    </span>
                    <span
                      v-else-if="
                        item.comodities.other &&
                        item.comodities.otherThing &&
                        item.comodities.otherCoolThing
                      "
                    >
                      <i aria-hidden="true" class="lnil lnil-more" />
                      <span>3 more</span>
                    </span>
                    <span
                      v-else-if="
                        item.comodities.other && item.comodities.otherThing
                      "
                    >
                      <i aria-hidden="true" class="lnil lnil-more" />
                      <span>2 more</span>
                    </span>
                    <span v-else-if="item.comodities.other">
                      <i aria-hidden="true" class="lnil lnil-more" />
                      <span>1 more</span>
                    </span> -->
                  </div>
                </div>
                <div class="meta-right">
                  <div class="buttons">
                    <VButton
                      :to="`/sidebar/contractor/projects/${item.id}`"
                      light
                    >
                      View Details
                    </VButton>
                    <VButton
                      v-if="
                        userSession.user.role == 'admin' ||
                        userSession.user.role == 'manager'
                      "
                      @click="openDeleteAlert(item.id)"
                      color="danger"
                      raised
                    >
                      Delete
                    </VButton>
                  </div>
                </div>
              </div>
            </div>
          </TransitionGroup>
        </div>

        <VFlexPagination
          v-if="filteredProjects.length > 5"
          :item-per-page="10"
          :total-items="873"
          :current-page="42"
          :max-links-displayed="5"
        />

        <!--Inactive Tab-->
        <div
          id="inactive-items-tab"
          class="tab-content"
          :class="[activeTab === 'inactive' && 'is-active']"
        >
          <div class="list-view-inner">
            <!--Empty placeholder-->
            <VPlaceholderPage
              title="There are no inactive properties."
              subtitle="Looks like there are no inactive properties to display. You can
                disable and also enable a property from the property settings."
              larger
            >
              <template #image>
                <img
                  class="light-image"
                  src="/@src/assets/illustrations/placeholders/having-coffee.svg"
                  alt=""
                />
                <img
                  class="dark-image"
                  src="/@src/assets/illustrations/placeholders/having-coffee-dark.svg"
                  alt=""
                />
              </template>
            </VPlaceholderPage>
          </div>
        </div>
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
              //   color: var(--dark-text);
            }

            i {
              font-size: 1.2rem;
              margin-inline-end: 6px;
              //   color: var(--light-text);
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
