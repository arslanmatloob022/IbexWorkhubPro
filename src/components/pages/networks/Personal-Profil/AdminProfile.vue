<script setup lang="ts">
import { convertToFormData } from "/@src/composable/useSupportElement";
import ApexChart from "vue3-apexcharts";
import { useUserSession } from "/@src/stores/userSession";
import { useNotyf } from "/@src/composable/useNotyf";
import { useApi } from "/@src/composable/useAPI";
import { useEnergyChart } from "/@src/data/dashboards/lifestyle-v3/energyChart";
import { useOverallChart } from "/@src/data/dashboards/lifestyle-v3/overallChart";
import { useOxygenChart } from "/@src/data/dashboards/lifestyle-v3/oxygenChart";
import { useProgressChart } from "/@src/data/dashboards/lifestyle-v3/progressChart";
import { followersList } from "/@src/data/widgets/ui/followers";
import { usePersonalScoreGauge } from "/@src/data/widgets/charts/personalScoreGauge";
const { personalScoreGaugeOptions, onPersonalScoreGaugeReady } =
  usePersonalScoreGauge();
const { energyChartOptions } = useEnergyChart();
const { overallChartOptions } = useOverallChart();
const { oxygenChartOptions } = useOxygenChart();
const { progressChartOptions } = useProgressChart();
const userSession = useUserSession();
const edit_mode = ref(false);
const api = useApi();
const notyf = useNotyf();
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
const selectedIdToChangeStatus = ref(null);
const selectedStatus = ref(true);
const showPassword = ref(false);
const loading = ref(false);
const preview = ref<any>(null);
const editpreview = ref<any>(null);
const selectedIdToDelete = ref(0);
const linkLoading = ref(false);
const openPasswordChangeModal = ref(false);

const adminsData = ref([]);

// Form Data
const userData = ref({
  id: 0,
  username: "",
  email: "",
  is_active: true,
  phoneNumber: "",
  avatar: null,
});

const adminFormData = ref({
  username: "",
  email: "",
  password: "",
  status: "",
  role: "admin",
  phoneNumber: "",
  avatar: null,
});

const Password = ref({
  newPassword: "",
  confirmPassword: "",
});

const PayPalLinkData = ref({
  success: false,
  msg: "",
  approved_url: "",
});

// Methods
const closeAdminModal = () => {
  adminFormData.value = {
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
    avatar: null,
  };
};

const openStatusAlert = (user: any) => {
  selectedIdToChangeStatus.value = user.id;
  selectedStatus.value = user.is_active;
};

const copyLinkToClipBoard = (url: any) => {
  navigator.clipboard
    .writeText(url)
    .then(() => {
      notyf.success("Link Copied");
    })
    .catch((err) => {
      notyf.success("Something Went Wrong");
    });
};

const createPayPalLink = async () => {
  try {
    linkLoading.value = true;
    const response = await api.post("/api/paypal/create-link/", {});
    PayPalLinkData.value = response.data;
    notyf.success("link Created");
  } catch (err) {
    notyf.success("Something went wrong");
  } finally {
    linkLoading.value = false;
  }
};

const changeUserStatus = async () => {
  try {
    const resp = await api.patch(
      `/api/users/${selectedIdToChangeStatus.value}/`,
      {
        is_active: !selectedStatus.value,
      }
    );
    getManagershandler();
    notyf.success("Manager set active successfully");
  } catch (err) {
    console.error(err);
  }
};

const closePasswordModal = () => {
  Password.value.newPassword = "";
  Password.value.confirmPassword = "";
};

const getManagershandler = async () => {
  try {
    loading.value = true;
    const response = await api.get("/api/users/by-role/admin/", {});
    adminsData.value = response.data;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const deletAdmin = async () => {
  try {
    loading.value = true;
    await api.delete(`/api/users/${selectedIdToDelete.value}/`);
    getManagershandler();
    notyf.success("tianager");
  } catch (err) {
    notyf.success("something went wrong");
  } finally {
    loading.value = false;
  }
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  userData.value.avatar = file;
  adminFormData.value.avatar = file;

  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.value = e.target.result;
      editpreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const addNewAdmin = async () => {
  try {
    loading.value = true;
    let formData = convertToFormData(adminFormData.value, ["avatar"]);
    const response = await api.post("/api/users/", formData);
    notyf.success("  Admin Added");
    getManagershandler();
    closeAdminModal();
  } catch (err) {
    notyf.success("tiomething went wrong");
  } finally {
    loading.value = false;
  }
};

const editselfProfile = async () => {
  try {
    loading.value = true;
    let formData = convertToFormData(userData.value, ["avatar"]);
    const resp = await api.patch(`/api/users/${userData.value.id}/`, formData);

    userSession.setUser(resp.data);
    notyf.success("tirofile updated");
  } catch (err) {
    notyf.success("tiomething went wrong");
  } finally {
    loading.value = false;
  }
};

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
// Lifecycle Hooks
onMounted(() => {
  userData.value = userSession.user;
  getManagershandler();
});
</script>

<template>
  <div class="lifestyle-dashboard lifestyle-dashboard-v3">
    <div class="illustration-header">
      <div class="header-image">
        <img
          :src="
            CustomUserData.avatar
              ? CustomUserData.avatar
              : '/@src/assets/illustrations/dashboards/lifestyle/doctor.svg'
          "
          alt=""
        />
      </div>
      <div class="header-meta">
        <h3>{{ CustomUserData.username }}</h3>
        <p>({{ CustomUserData.role }})</p>
        <div class="summary-stats">
          <div class="summary-stat">
            <span>{{ CustomUserData.email }}</span>
            <span>Email</span>
          </div>
          <div class="summary-stat">
            <span>{{ CustomUserData.phoneNumber }}</span>
            <span>Phone</span>
          </div>
          <div class="summary-stat">
            <span>{{
              CustomUserData.is_sentMail ? "Active" : "In-active"
            }}</span>
            <span>Email Notification</span>
          </div>
          <div class="summary-stat">
            <span>Edit</span>
            <span>Profile</span>
          </div>
          <div class="summary-stat">
            <span
              @click="openPasswordChangeModal = !openPasswordChangeModal"
              class="cu-pointer"
              >Change</span
            >
            <span>Password</span>
          </div>
        </div>
      </div>
    </div>

    <div class="columns is-multiline is-flex-tablet-p">
      <!--Tile-->
      <div class="column is-3">
        <div class="health-tile">
          <div class="tile-head">
            <VIconBox color="primary">
              <i aria-hidden="true" class="fas fa-tint" />
            </VIconBox>
            <h4>
              <span class="dark-inverted">114/90</span>
              <span @click="createPayPalLink()">Min/Max</span>
            </h4>
          </div>
          <h3 class="dark-inverted">Blood</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit Illis
            videtur.
          </p>
        </div>
      </div>

      <!--Tile-->
      <div class="column is-3">
        <div class="health-tile">
          <div class="tile-head">
            <VIconBox color="primary">
              <i aria-hidden="true" class="fas fa-heart" />
            </VIconBox>
            <h4>
              <span class="dark-inverted">112</span>
              <span>Bpm</span>
            </h4>
          </div>
          <h3 class="dark-inverted">Heart Rate</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit Illis
            videtur.
          </p>
        </div>
      </div>

      <!--Tile-->
      <div class="column is-3">
        <div class="health-tile">
          <div class="tile-head">
            <VIconBox color="primary">
              <i aria-hidden="true" class="fas fa-pump-medical" />
            </VIconBox>
            <h4>
              <span class="dark-inverted">12/14</span>
              <span>units</span>
            </h4>
          </div>
          <h3 class="dark-inverted">Blood Pressure</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit Illis
            videtur.
          </p>
        </div>
      </div>

      <!--Tile-->
      <div class="column is-3">
        <div class="health-tile">
          <div class="tile-head">
            <VIconBox color="primary">
              <i aria-hidden="true" class="fas fa-weight" />
            </VIconBox>
            <h4>
              <span class="dark-inverted">60.4</span>
              <span>lbs</span>
            </h4>
          </div>
          <h3 class="dark-inverted">Weight</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit Illis
            videtur.
          </p>
        </div>
      </div>
    </div>

    <div class="columns is-multiline">
      <div class="column is-9">
        <div class="columns is-multiline">
          <!--Dashboard Card-->
          <div class="column is-6">
            <div class="dashboard-card">
              <div class="card-head">
                <h3 class="dark-inverted">Overall Condition</h3>
                <WidgetDropdown />
              </div>
              <div class="chart-meta">
                <p>
                  <i
                    aria-hidden="true"
                    class="iconify"
                    data-icon="feather:help-circle"
                  />
                  Your overall condition is very good. Make it even better.
                  <a class="is-dark-primary">Read how</a>
                </p>
              </div>
              <ApexChart
                id="overall-chart"
                :height="overallChartOptions.chart.height"
                :type="overallChartOptions.chart.type"
                :series="overallChartOptions.series"
                :options="overallChartOptions"
              />
            </div>
          </div>

          <!--Dashboard Card-->
          <div class="column is-6">
            <div class="dashboard-card">
              <div class="card-head">
                <h3 class="dark-inverted">Energy Report</h3>
                <WidgetDropdown />
              </div>
              <div class="chart-meta">
                <p>
                  <i
                    aria-hidden="true"
                    class="iconify"
                    data-icon="feather:help-circle"
                  />
                  Your energy seems a bit unstable. You can improve it.
                  <a class="is-dark-primary">Read how</a>
                </p>
              </div>
              <ApexChart
                id="energy-chart"
                :height="energyChartOptions.chart.height"
                :type="energyChartOptions.chart.type"
                :series="energyChartOptions.series"
                :options="energyChartOptions"
              />
            </div>
          </div>

          <!--Dashboard Card-->
          <div class="column is-6">
            <div class="dashboard-card">
              <div class="card-head">
                <h3 class="dark-inverted">Oxygenation</h3>
                <WidgetDropdown />
              </div>
              <div class="chart-meta">
                <p>
                  <i
                    aria-hidden="true"
                    class="iconify"
                    data-icon="feather:help-circle"
                  />
                  Your oxygen seems a bit unstable. You can improve it.
                  <a class="is-dark-primary">Read how</a>
                </p>
              </div>
              <ApexChart
                id="overall-chart"
                :height="oxygenChartOptions.chart.height"
                :type="oxygenChartOptions.chart.type"
                :series="oxygenChartOptions.series"
                :options="oxygenChartOptions"
              />
            </div>
          </div>

          <!--Dashboard Card-->
          <div class="column is-6">
            <div class="dashboard-card">
              <div class="card-head">
                <h3 class="dark-inverted">Overall Progress</h3>
                <WidgetDropdown />
              </div>
              <div class="chart-meta">
                <p>
                  <i
                    aria-hidden="true"
                    class="iconify"
                    data-icon="feather:help-circle"
                  />
                  Your overall condition is very good. Make it even better.
                  <a class="is-dark-primary">Read how</a>
                </p>
              </div>
              <ApexChart
                id="progress-chart"
                :height="progressChartOptions.chart.height"
                :type="progressChartOptions.chart.type"
                :series="progressChartOptions.series"
                :options="progressChartOptions"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="column is-3">
        <!--Widget-->
        <UIWidget class="search-widget">
          <template #body>
            <div class="field">
              <div class="control">
                <input type="text" class="input" placeholder="Search..." />
                <button class="searcv-button">
                  <i
                    aria-hidden="true"
                    class="iconify"
                    data-icon="feather:search"
                  />
                </button>
              </div>

              <div class="topics">
                <a>#Health</a>
                <a>#Cardio</a>
                <a>#Nutrition</a>
              </div>
            </div>
          </template>
        </UIWidget>

        <!--Widget-->
        <UIWidget class="picker-widget">
          <template #header>
            <div class="widget-toolbar">
              <div class="left">
                <a class="action-icon">
                  <i
                    aria-hidden="true"
                    class="iconify ltr-hidden"
                    data-icon="feather:chevron-right"
                  />
                  <i
                    aria-hidden="true"
                    class="iconify rtl-hidden"
                    data-icon="feather:chevron-left"
                  />
                </a>
              </div>
              <div class="center">
                <h3>October 2020</h3>
              </div>
              <div class="right">
                <a class="action-icon">
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
                </a>
              </div>
            </div>
          </template>
          <template #body>
            <table class="calendar">
              <thead>
                <tr>
                  <th scope="col">Mon</th>
                  <th scope="col">Tue</th>
                  <th scope="col">Wed</th>
                  <th scope="col">Thu</th>
                  <th scope="col">Fri</th>
                  <th scope="col">Sat</th>
                  <th scope="col">Sun</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td class="prev-month">29</td>
                  <td class="prev-month">30</td>
                  <td class="prev-month">31</td>
                  <td>1</td>
                  <td>2</td>
                  <td>3</td>
                  <td>4</td>
                </tr>

                <tr>
                  <td>5</td>
                  <td>6</td>
                  <td>7</td>
                  <td>8</td>
                  <td>9</td>
                  <td>10</td>
                  <td>11</td>
                </tr>

                <tr>
                  <td>12</td>
                  <td>13</td>
                  <td>14</td>
                  <td>15</td>
                  <td>16</td>
                  <td>17</td>
                  <td class="current-day">18</td>
                </tr>

                <tr>
                  <td>19</td>
                  <td>20</td>
                  <td>21</td>
                  <td>22</td>
                  <td>23</td>
                  <td>24</td>
                  <td>25</td>
                </tr>

                <tr>
                  <td>26</td>
                  <td>27</td>
                  <td>28</td>
                  <td>29</td>
                  <td>30</td>
                  <td>31</td>
                  <td class="next-month">1</td>
                </tr>
              </tbody>
            </table>
          </template>
        </UIWidget>

        <!--Widget-->
        <UIWidget class="gauge-widget">
          <template #header>
            <UIWidgetToolbarDropdown title="Gauge Widget" />
          </template>
          <template #body>
            <div class="gauge-wrap">
              <VBillboardJS
                class="gauge-holder"
                :options="personalScoreGaugeOptions"
                @ready="onPersonalScoreGaugeReady"
              />
            </div>
            <div class="widget-content">
              <p>Your score has been calculated based on the latest metrics</p>
            </div>
          </template>
        </UIWidget>

        <!--Widget-->
        <UIWidget class="text-widget">
          <template #header>
            <UIWidgetToolbarFollowers
              title="New Friends"
              :avatars="followersList"
            />
          </template>
          <template #body>
            <div class="widget-content">
              <p>
                Great News! <span>{{ followersList[0].name }}</span
                >, <span>{{ followersList[1].name }}</span> and
                <span>{{ followersList[2].name }}</span> are now friends with
                you. Take some time to look at their profile.
              </p>
            </div>
          </template>
        </UIWidget>
      </div>
    </div>
  </div>
  <ChangePasswordModal
    v-if="openPasswordChangeModal"
    :isModalOpen="openPasswordChangeModal"
    :userId="userSession.user.id"
    @update:close-modal-handler="openPasswordChangeModal = false"
  />
</template>

<style lang="scss">
@import "/@src/scss/abstracts/all";

.lifestyle-dashboard-v3 {
  .illustration-header {
    display: flex;
    align-items: center;
    padding: 10px;
    border-radius: 16px;
    background: var(--primary-dark-24);
    font-family: var(--font);
    margin-bottom: 30px;

    .header-image {
      position: relative;
      height: 220px;
      width: 280px;

      img {
        position: absolute;

        inset-inline-start: -30px;
        display: block;
        pointer-events: none;
      }
    }

    .header-meta {
      margin-inline-start: 0;

      h3 {
        color: var(--smoke-white);
        font-family: var(--font-alt);
        font-weight: 700;
        font-size: 1.3rem;
      }

      p {
        font-weight: 400;
        color: var(--smoke-white-dark-16);
        margin-bottom: 16px;
      }

      .summary-stats {
        display: flex;

        .summary-stat {
          margin-inline-end: 30px;

          span {
            font-family: var(--font);
            display: block;

            &:first-child {
              font-size: 1.1rem;
              font-family: var(--font-alt);
              color: var(--smoke-white);
            }

            &:nth-child(2) {
              color: var(--primary-light-18);
              font-size: 0.85rem;
            }
          }
        }
      }

      .action-link {
        span {
          font-size: 0.8rem;
          text-transform: uppercase;
          margin-inline-end: 6px;
        }

        i {
          font-size: 12px;
        }
      }
    }
  }

  .health-tile {
    font-family: var(--font);

    .tile-head {
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      .v-icon {
        margin-inline-end: 10px;
      }

      h4 {
        span {
          &:first-child {
            font-size: 1.2rem;
            font-weight: 600;
            color: var(--dark-text);
            margin-inline-end: 0.25rem;
          }

          &:nth-child(2) {
            font-size: 0.95rem;
            color: var(--light-text);
          }
        }
      }
    }

    h3 {
      font-family: var(--font-alt);
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--dark-text);
    }

    p {
      font-size: 0.95rem;
    }
  }

  .dashboard-card {
    @include vuero-l-card;

    .card-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;

      h3 {
        color: var(--dark-text);
        font-size: 1.2rem;
        font-weight: 500;
      }
    }

    .chart-meta {
      p {
        font-size: 0.95rem;
        max-width: 80%;

        svg {
          position: relative;
          top: 2px;
          height: 16px;
          width: 16px;
          color: var(--light-text);
        }

        a {
          color: var(--primary);
          font-weight: 500;
        }
      }
    }
  }
}

.is-dark {
  .lifestyle-dashboard-v3 {
    .dashboard-card {
      @include vuero-card--dark;
    }
  }
}

@media only screen and (width <= 767px) {
  .lifestyle-dashboard-v3 {
    .illustration-header {
      flex-direction: column;
      text-align: center;

      .header-image {
        height: auto;
        width: 100%;

        img {
          position: relative;
          width: 100%;
          max-width: 260px;
          margin: 0 auto;
          top: 0;
          margin-top: -75px;
        }
      }

      .header-meta {
        padding: 20px;

        > p {
          max-width: 280px;
          margin-inline-start: auto;
          margin-inline-end: auto;
        }

        .summary-stats {
          flex-wrap: wrap;

          .summary-stat {
            margin: 10px;
            min-width: calc(33.3% - 20px);
          }
        }
      }
    }

    .health-tile {
      padding: 20px;
      background: var(--white);
      border: 1px solid var(--fade-grey-dark-3);
      border-radius: 10px;
    }
  }

  .is-dark {
    .lifestyle-dashboard-v3 {
      .health-tile {
        background: var(--dark-sidebar-light-6);
        border-color: var(--dark-sidebar-light-12);
      }
    }
  }
}

@media only screen and (width >= 768px) and (width <= 1024px) and (orientation: portrait) {
  .lifestyle-dashboard-v3 {
    .illustration-header {
      .header-image {
        width: 250px;
      }
    }
  }
}
</style>
