<script setup lang="ts">
import { ref } from "vue";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { useUserSession } from "/@src/stores/userSession";

const userSession = useUserSession();
const route = useRoute();
const router = useRouter();
const api = useApi();
const Loading = ref(false);
const notyf = useNotyf();
const combinedArray = ref([]);
const fileInput = ref<HTMLInputElement | null>(null);
const tab = ref<"personal" | "licence" | "reference">("personal");
const ratingInput = ref(0);
const hideWorkerData = ref(true);

const documentsArray = ref([
  {
    id: 59,
    documentTitle: "Document Title",
    icon: "/images/dummyShareProf/document.png",
    subTitle: "Document subtitle",
    document: "/images/dummyShareProf/sample.pdf",
    status: true,
    created_at: "2023-12-12T34:01:23.4567890",
    updated_at: "2023-12-12T34:01:23.4567890",
    worker: 1,
    companyDocument: 1,
    industry: 1,
    loading: false,
  },
  {
    id: 60,
    documentTitle: "Document Title",
    icon: "/images/dummyShareProf/document.png",
    subTitle: "Document subtitle",
    document: "/images/dummyShareProf/sample.pdf",
    status: true,
    created_at: "2023-12-12T34:01:23.4567890",
    updated_at: "2023-12-12T34:01:23.4567890",
    worker: 1,
    companyDocument: 1,
    industry: 1,
    loading: false,
  },
  {
    id: 22,
    documentTitle: "Document Title",
    icon: "/images/dummyShareProf/document.png",
    subTitle: "Document subtitle",
    arezCompany: 1,
    industry: 3,
    loading: false,
  },
  {
    id: 23,
    documentTitle: "Document Title",
    icon: "/images/dummyShareProf/document.png",
    subTitle: "Document subtitle",
    document: "/images/dummyShareProf/sample.pdf",
    arezCompany: 1,
    industry: 3,
    loading: false,
  },
  {
    id: 24,
    documentTitle: "Document Title",
    icon: "/images/dummyShareProf/document.png",
    subTitle: "Document subtitle",
    document: "/images/dummyShareProf/sample.pdf",
    arezCompany: 1,
    industry: 3,
    loading: false,
  },
  {
    id: 25,
    documentTitle: "Document Title",
    icon: "/images/dummyShareProf/document.png",
    subTitle: "Document subtitle",
    document: "/images/dummyShareProf/sample.pdf",
    arezCompany: 1,
    industry: 3,
    loading: false,
  },
  {
    id: 26,
    documentTitle: "Document Title",
    icon: "/images/dummyShareProf/document.png",
    subTitle: "Document subtitle",
    document: "/images/dummyShareProf/sample.pdf",
    arezCompany: 1,
    industry: 3,
    loading: false,
  },
  {
    id: 27,
    documentTitle: "Additional Documents of employment",
    icon: "https://arez-v3-private-documents.s3.eu-west-2.amazonaws.com/public/arez_compnay_document_logo/Additional%20Documents%20of%20employment/additional_dic.png",
    subTitle: "Please provide proof additional documents of employment.",
    arezCompany: 1,
    industry: 3,
    loading: false,
  },
  {
    id: 28,
    documentTitle: "Document Title",
    icon: "/images/dummyShareProf/document.png",
    subTitle: "Document subtitle",
    document: "/images/dummyShareProf/sample.pdf",
    industry: 3,
    loading: false,
  },
  {
    id: 29,
    documentTitle: "Document Title",
    icon: "/images/dummyShareProf/document.png",
    subTitle: "Document subtitle",
    document: "/images/dummyShareProf/sample.pdf",
    arezCompany: 1,
    industry: 3,
    loading: false,
  },
]);

const workerData = ref({
  id: 0,
  firstName: "",
  lastName: "",
  emailAddress: "",
  phoneNumber: "",
  lineManager: "",
  homeAddress: "",
  profileImageURL: null as File | null | string,
  externalID: " ",
  compnayIdCardNumber: " ",
  compnayIdCardExpiryDate: " ",
  signedDeclerationForm: " ",
  industry: {
    id: 0,
    name: "",
    industryLogo: "",
  },
  arezCompany: 1,
  status: false,
  postCode: "",
  rating: "",
  activationCode: "",
  transport: "",
});

const options = {
  weekday: "Sat",
  day: "1",
  month: "Noc",
  year: "2023",
  hour: "9",
  minute: "30",
  timeZoneName: "KTP",
};
const columns = {
  documentTitle: {
    label: "",
    grow: "lg",
    media: true,
  },
  document: {
    label: "Document",
    align: "center",
  },
  status: "Status",
  actions: {
    label: "Actions",
    align: "end",
  },
} as const;

const getWorkerSomeInfo = async () => {
  try {
    const resp = await api.get(
      `/v3/api/worker/${route.query.id}/profile-share/`
    );
    console.log(resp.data);
    workerData.value.firstName = resp.data.firstName;
    workerData.value.lastName = resp.data.lastName;
    workerData.value.arezCompany = resp.data.arezCompany;
  } catch {
    notyf.error("Invalid worker profile");
    router.push("/");
  }
};

onMounted(() => {
  getWorkerSomeInfo();
  combinedArray.value = documentsArray.value;
  if (!userSession.token) {
    hideWorkerData.value = true;
    return;
  }
  if (userSession.user.company == workerData.value.arezCompany) {
    router.push(`/sidebar/company/workers/${route.query.id}`);
    hideWorkerData.value = false;
    // getworker();
  } else {
    notyf.error("UnAuthenticated attempt to view profile");
    router.push(`/`);
  }
});
</script>

<template>
  <div class="lifestyle-dashboard lifestyle-dashboard-v1">
    <div v-if="hideWorkerData" class="loginDiv">
      <button id="cus-login-button" @click="
        router.push(
          `/auth/login?redirect=/worker-profile?id=${route.query.id}&code=${route.query.code}`
        )
        ">
        Please Login
      </button>
    </div>
    <!-- Profile Header -->
    <div class="dashboard-header-wrapper">
      <div class="dashboard-header">
        <div class="avatar-container">
          <img size="medium" src="/images/avatars/placeholder.jpg" />
        </div>
        <div class="header-meta">
          <div class="username-wrap">
            <div class="username">
              <div class="user-rating">
                <h3 style="color: #f1f1f1 !important">
                  <span>{{ workerData.firstName }} {{ workerData.lastName }}</span>
                </h3>
                <div :class="hideWorkerData ? 'hide-data' : 'show-data'" class="ratings">
                  <VField>
                    <VControl>
                      <VRangeRating readonly v-model="ratingInput" />
                    </VControl>
                  </VField>
                </div>
              </div>
              <div :class="hideWorkerData ? 'hide-data' : 'show-data'">
                <div class="username">
                  <span>dummyemail@gmail.com</span>
                </div>

                <div class="user-info">
                  <div class="username">
                    <img src="/images/icons/workerProfile/whatsapp.png"
                      style="width: 16px; height: 16px; margin-right: 2px" />
                    <span>+1234567890</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="is-divider-vertical"></div>
        <div class="header-meta">
          <div :class="hideWorkerData ? 'hide-data' : 'show-data'">
            <div class="user-switch">
              <div class="username-wrap">
                <div class="switches">
                  <div class="username">
                    <span>
                      <img src="/images/icons/workerProfile/industry.png" style="width: 18px; height: 18px" />
                    </span>
                    <span>Industry:</span>
                    <span>Woker Industry</span>
                  </div>
                </div>
                <div class="switches">
                  <div class="username">
                    <span><img src="/images/icons/workerProfile/active-user.png"
                        style="width: 18px; height: 18px" /></span>
                    <span>Activation Code:</span>
                    <span>***** </span>
                  </div>
                </div>

                <div class="switches">
                  <div class="username">
                    <span>
                      <img src="/images/icons/workerProfile/account-status.png"
                        style="width: 18px; height: 18px" /></span>
                    <span> Account Status:</span>
                    <span style="color: var(--yellow); font-weight: 500">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="profile-wrapper">
      <div class="profile-body">
        <div :class="hideWorkerData ? 'hide-data' : 'show-data'">
          <div class="tabs-wrapper">
            <div class="tabs-inner">
              <div class="tabs">
                <ul>
                  <li :class="[tab === 'personal' && 'is-active']">
                    <a tabindex="0" role="button" @keydown.space.prevent="tab = 'personal'"
                      @click="tab = 'personal'"><span>Personal</span></a>
                  </li>

                  <li :class="[tab === 'licence' && 'is-active']">
                    <a tabindex="0" role="button" @keydown.space.prevent="tab = 'licence'"
                      @click="tab = 'licence'"><span>Licence</span></a>
                  </li>
                  <li :class="[tab === 'reference' && 'is-active']">
                    <a tabindex="0" role="button" @keydown.space.prevent="tab = 'reference'"
                      @click="tab = 'reference'"><span>References</span></a>
                  </li>
                  <li class="tab-naver" />
                </ul>
              </div>
            </div>
            <div v-if="tab === 'personal'" class="tab-content is-active">
              <div class="columns">
                <div class="column is-8">
                  <div class="profile-card">
                    <!--documents-->
                    <div class="profile-card-section">
                      <PlaceloadV1 v-if="Loading" />
                      <div class="section-title">
                        <h4>Documents</h4>
                      </div>
                      <input ref="fileInput" type="file" style="display: none" accept="image/*,application/pdf" />
                      <div class="section-content">
                        <div class="column">
                          <div v-if="combinedArray.length > 0" class="incoming">
                            <VFlexTable rounded :data="combinedArray" :columns="columns" class="noborder" id="doc-table">
                              <template #body-cell="{ row, column, value }">
                                <template v-if="column.key === 'documentTitle'">
                                  <VAvatar :picture="row.icon" :squared="true" />

                                  <div class="docTitles">
                                    <span class="item-name dark-inverted">{{
                                      row.documentTitle
                                    }}</span>
                                    <span class="item-meta">
                                      <span>{{ row.subTitle }}</span>
                                    </span>
                                  </div>
                                  <div></div>
                                </template>
                                <template v-else-if="column.key === 'document' && row.document
                                  ">
                                  <div v-if="row.document.includes('.pdf')">
                                    <img class="image-icon" src="/images/icons/files/pdf.svg" alt="" style="
width: 50px;
height: 50px;
cursor: pointer;
" />
                                  </div>
                                  <div v-else>
                                    <div class="png-icon">
                                      <i class="fas fa-file-image" style="
font-size: 26px;
cursor: pointer;
color: var(--primary);
"></i>
                                    </div>
                                  </div>
                                </template>
                                <template v-else-if="column.key === 'status'">
                                  <div class="navbar-item is-theme-toggle" v-if="row.worker">
                                    <label class="theme-toggle">
                                      <input id="navbar-night-toggle--daynight" v-model="row.status"
                                        data-cy="dark-mode-toggle" type="checkbox" checked disabled />
                                      <span class="toggler">
                                        <span class="dark">
                                          <i class="iconify" data-icon="feather:check" aria-hidden="true"></i>
                                        </span>
                                        <span class="light">
                                          <i class="iconify" data-icon="feather:x" aria-hidden="true"></i>
                                        </span>
                                      </span>
                                    </label>
                                  </div>
                                </template>

                                <template v-else-if="column.key === 'actions'">
                                  <VIconBox v-if="!row.loading" size="small" color="info" style="cursor: pointer" rounded>
                                    <i class="iconify" data-icon="feather:upload-cloud" aria-hidden="true"></i>
                                  </VIconBox>
                                  <VIconButton v-if="row.loading" color="primary" outlined loading circle
                                    icon="feather:plus" />
                                  <VIconBox v-if="row.worker" size="small" color="danger" class="ml-3"
                                    style="cursor: pointer" rounded>
                                    <i class="iconify" data-icon="feather:trash-2" aria-hidden="true"></i>
                                  </VIconBox>
                                </template>
                              </template>
                            </VFlexTable>
                          </div>
                          <div v-else>
                            <VTag color="solid" label="No Documents Are Available!" rounded />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div :class="hideWorkerData ? 'hide-data' : 'show-data'" class="column is-4">
                  <!--Notifications-->
                  <div class="profile-card">
                    <div class="profile-card-section no-padding">
                      <div class="section-title">
                        <h4>Notes</h4>
                        <button class="add-btn">
                          <i class="fas fa-plus" aria-hidden="true" style="
color: var(--primary-light-12);
font-size: 9px;
"></i>
                          Add
                        </button>
                      </div>

                      <div class="section-content"></div>
                    </div>
                  </div>

                  <!--Licence Section-->
                  <div :class="hideWorkerData ? 'hide-data' : 'show-data'" class="profile-card">
                    <div class="profile-card-section no-padding">
                      <div class="section-title">
                        <h4>License</h4>
                      </div>

                      <div class="section-content no-padding">
                        <div class="tools-wrapper">
                          <div class="banking-dashboard banking-dashboard-v1">
                            <div class="columns is-multiline">
                              <div class="" style="width: 100%">
                                <div class="dashboard-card is-credit-cards column is-12">
                                  <div class="card-block">
                                    <div class="columns is-multiline">
                                      <div style="width: 100%">
                                        <div class="card-block-inner is-dark-bordered-12">
                                          <div class="credit-card is-theme-1">
                                            <div class="shape" />
                                            <div class="top">
                                              <div class="card-number">
                                                <div>
                                                  <span>12345***********</span>

                                                  <span style="font-size: 1.1rem">louren inpsum</span>
                                                </div>
                                                <img src="/images/photo/sia.png" alt="" />
                                              </div>
                                              <div class="card-number">
                                                <span>Worker Industry</span>
                                              </div>
                                              <div class="card-number">
                                                <span>Worker desig</span>
                                              </div>
                                            </div>
                                            <div class="bottom">
                                              <span>Licence Type</span>
                                            </div>
                                          </div>
                                        </div>
                                        <div class="info-block-inner">
                                          <div class="info-block-line">
                                            <h4 class="dark-inverted">
                                              Status
                                            </h4>
                                            <span>
                                              <i aria-hidden="true" class="fas fa-circle text-success"
                                                style="color: var(--primary)" />
                                            </span>
                                          </div>
                                          <div class="info-block-line">
                                            <h4 class="dark-inverted">
                                              Expires in
                                            </h4>
                                            <!-- <span>{{ item.expiryDate }}</span> -->
                                            <span>01 Month 2***</span>
                                          </div>
                                          <div class="info-block-line">
                                            <h4 class="dark-inverted">Type</h4>
                                            <span class="has-image">
                                              louren Ipsum
                                            </span>
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
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-show="tab === 'licence'" class="tab-content is-active">
              <!--List Empty Search Placeholder -->
            </div>
            <div v-show="tab === 'reference'" class="tab-content is-active">
              <!--List Empty Search Placeholder -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "/@src/scss/abstracts/all";
@import "/@src/scss/components/profile-stats";

// profile CSS
.hide-data {
  filter: blur(3px);
  pointer-events: none;
}

.show-data {
  display: block;
}

#overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  filter: blur(10px);
  /* Adjust the blur intensity */
}

#cus-login-button {
  position: fixed;
  top: 45%;
  left: 45%;
  padding: 10px 20px;
  background-color: var(--primary);
  box-shadow: var(--primary-box-shadow);
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  z-index: 9999;
}

.user-rating {
  display: flex;
  align-items: center;
  gap: 16px;

  .ratings {
    margin-top: 13px;
  }
}

.userIndustry {
  display: flex;
  gap: 10px;
  margin-top: 12px;
}

.user-info {
  margin-top: 10px;

  .username {
    display: flex;
    align-items: center;
  }

  span {
    margin-top: 4px;
  }
}

.activation {
  margin-top: 14px;
}

.user-switch {
  display: flex;
  margin-top: 12px;
  gap: 10px;

  .switches {
    width: max-content;
    display: flex;
    gap: 4px;
    margin-bottom: 4px;
    padding-right: 12px;

    .username {
      display: flex;
      gap: 5px;
      margin-top: 4px;
      color: #f1f1f1;
    }
  }
}

.margin {
  margin-top: 10px;
}

.user-status {
  display: flex;
  margin-right: 6px;
}

.DelBtn {
  height: min-content;
  padding: 4px;
  border: none;
  background-color: transparent;
  margin-top: 4px;
  cursor: pointer;
}

.noteInput {
  margin-top: 10px;
}

.noteBlock {
  display: flex;
  justify-content: space-between;
  padding: 2px 8px;
  border-radius: 5px;
  margin-bottom: 6px;
  background-color: rgb(205 197 197 / 15%);
  transition: all ease-in-out 0.3s;

  .noteContent {
    display: flex;
    flex-direction: column;

    p:first-child {
      color: #292929;
    }
  }

  p {
    margin-top: 4px;
  }

  &:hover {
    transform: scale(1.01);
  }
}

.edit-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  border: none;
  color: #fff;
  background-color: transparent;
  height: min-content;
}

.share-btn {
  position: absolute;
  top: 10px;
  right: 46px;
  cursor: pointer;
  border: none;
  color: #fff;
  background-color: transparent;
  height: min-content;
}

.add-btn {
  cursor: pointer;
  border: none;
  color: var(--primary-light-10);
  background-color: transparent;
  height: min-content;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.docTitles {
  width: 100% !important;
  overflow: hidden;
}

.png-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  border-radius: 8px;
  background-color: #09787823;
}

.flex-table-cell {
  white-space: wrap !important;
}

.banking-dashboard-v1 {
  .columns {
    .column {
      height: fit-content;
    }
  }

  .dashboard-card {
    @include vuero-s-card;

    &:not(:last-child) {
      margin-bottom: 1.5rem;
    }

    &.is-credit-cards {
      padding: 0;

      .title-wrap {
        padding: 20px 20px 10px;
        margin-bottom: 0;
      }

      .card-block {
        .card-block-inner {
          display: flex;
          align-items: flex-start;
          padding: 20px;

          &:not(:first-child) {
            border-top: 1.6px dashed var(--fade-grey-dark-4);
          }

          .credit-card {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 140px;
            width: 100%;
            background: var(--fade-grey);
            border-radius: 10px;
            padding: 6px 10px 8px;
            overflow: hidden;

            &.is-theme-1 {
              background: var(--primary);
              box-shadow: var(--primary-box-shadow);
            }

            &.is-theme-2 {
              background: var(--info);
              box-shadow: var(--info-box-shadow);
            }

            .top {
              .card-number {
                display: flex;
                justify-content: space-between;
                align-items: center;

                span {
                  font-family: var(--font);
                  font-size: 0.8rem;
                  font-weight: 500;
                  color: var(--smoke-white);
                  display: block;
                }

                img {
                  display: block;
                  width: 100%;
                  max-width: 50px;
                }
              }
            }

            .bottom {
              font-family: var(--font);
              font-size: 0.7rem;
              font-weight: 500;
              color: var(--smoke-white);
            }

            .shape {
              position: absolute;
              bottom: -10px;
              inset-inline-end: -10px;
              height: 46px;
              width: 46px;
              background: var(--white);
              border-radius: var(--radius-rounded);
              opacity: 0.15;
            }
          }

          .credit-card-meta {
            margin-inline-start: 16px;

            span {
              display: block;
              font-family: var(--font);

              &:first-child {
                font-size: 0.9rem;
                color: var(--light-text);
              }

              &:nth-child(2) {
                color: var(--dark-text);
                font-size: 1.6rem;
                font-weight: 600;
                line-height: 1.2;
              }
            }
          }

          .credit-card-end {
            margin-inline-start: auto;
          }
        }

        .info-block-inner {
          padding: 10px 20px 20px;

          .title-wrap {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0;
            margin-bottom: 12px;

            h3 {
              font-size: 1rem;
              color: var(--dark-text);
              font-weight: 500;
            }

            .action-link {
              font-size: 0.9rem;
            }
          }

          .info-block-line {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1px 0;

            h4 {
              font-family: var(--font);
              font-weight: 500;
              color: var(--dark-text);
              font-size: 0.9rem;
              line-height: 2;
            }

            span {
              color: var(--light-text);
              font-size: 0.9rem;

              &.has-image {
                display: flex;
                justify-content: flex-end;
                align-items: center;
                flex-grow: 2;

                img {
                  max-width: 28px;
                  margin-inline-end: 6px;
                }
              }

              i {
                position: relative;
                top: 0;
                font-size: 10px;
                margin-inline-end: 8px;
              }
            }
          }
        }
      }
    }

    &.is-contacts {
      display: flex;
      flex-direction: column;
      height: 372px;

      .people-wrap {
        .people {
          display: flex;
          padding: 10px 0;

          .v-avatar {
            margin: 0 4px;
          }
        }

        .actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: var(--font);
          padding: 0 4px;

          span {
            font-size: 0.9rem;
            color: var(--light-text);
          }

          a {
            color: var(--light-text);

            &:hover,
            &:focus {
              color: var(--primary);
            }

            svg {
              height: 16px;
              width: 16px;
            }
          }
        }
      }

      .transfer-form {
        margin-top: auto;
      }
    }

    &.is-transactions {
      .transactions {
        padding: 10px 0;

        .media-flex-center {
          .flex-meta {
            span {
              &:nth-child(2) {
                font-size: 0.85rem;
              }
            }
          }

          .flex-end {
            font-family: var(--font);
            font-size: 1rem;
            font-weight: 500;
            color: var(--dark-text);
          }
        }
      }
    }

    &.is-income {
      position: relative;

      .field {
        position: absolute;
        top: 12px;
        inset-inline-end: 16px;
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

    >.title-wrap {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
      font-family: var(--font);

      h3 {
        font-family: var(--font-alt);
        font-size: 1rem;
        font-weight: 600;
        color: var(--dark-text);
      }

      .title-meta {
        font-size: 1rem;
        font-weight: 500;
        color: var(--dark-text);
      }

      .action-link {
        font-size: 0.9rem;
      }
    }

    .context-text {
      font-size: 0.9rem;
      margin-bottom: 10px;
    }
  }
}

.is-dark {
  .banking-dashboard-v1 {
    .dashboard-card {
      @include vuero-card--dark;
    }
  }
}

.dashboard-card {
  @include vuero-l-card;

  font-family: var(--font);

  &:not(:last-child) {
    margin-bottom: 1.5rem;
  }

  &.is-welcome {
    background: var(--widget-grey);
    border: none;
    padding: 40px;

    .welcome-title {
      h3 {
        font-family: var(--font-alt);
        font-weight: 700;
        font-size: 2rem;
        color: var(--dark-text);
      }
    }

    .welcome-progress {
      display: flex;
      align-items: center;
      padding: 10px 0;

      .meta {
        margin-inline-start: 16px;

        span {
          display: block;

          &:first-child {
            color: var(--light-text);
            font-size: 0.95rem;
          }

          &:nth-child(2) {
            font-family: var(--font-alt);
            font-size: 1.1rem;
            font-weight: 600;
            color: var(--dark-text);
          }
        }
      }
    }

    .button-wrap {
      .v-button {
        height: 44px;
        border-radius: 10px;
      }
    }
  }

  &.is-interview {
    &:not(:last-child) {
      margin-bottom: 0.75rem;
    }

    .flex-end {
      svg {
        height: 18px;
        width: 18px;
        color: var(--light-text);
      }
    }
  }
}

.active-licence {
  background-color: ghostwhite;
  border: 2px solid var(--primary);
  // box-shadow: var(--info-box-shadow);
}

/*================================*/
/* page styling*/
/*================================*/
.is-navbar {
  .profile-wrapper {
    margin-top: 30px;
  }
}

#doc-table>.flex-table-item {
  border: none !important;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 4px !important;
  transition: all ease-in-out 0.4s;
  transition: all ease-in-out 0.4s;

  &:hover {
    box-shadow: rgba(0, 0, 0, 0.24) 0px 5px 8px !important;
    transform: scaleZ(1.06);
    transform: scale(1.01);
  }
}

.profile-wrapper {
  margin: 0 auto;

  .profile-header {
    text-align: center;

    >img {
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
          justify-content: space-between;
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

                >span {
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

                >span {
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

              >.v-avatar {
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
                  transform: translate(calc(var(--transform-direction) * -50%),
                      -50%);
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

                >span {
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

                >span {
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
              >img {
                border-color: var(--dark-sidebar-light-12) !important;
              }
            }

            .experience-wrapper {
              .experience-item {
                >img {
                  border-color: var(--dark-sidebar-light-12);
                }

                .meta {
                  >span {
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

@media only screen and (width <=767px) {
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
    width: 54px;
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

      &:checked~.toggler {
        border-color: var(--primary);

        .dark,
        .light {
          transform: translateX(calc(var(--transform-direction) * 100%)) rotate(360deg);
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
      height: 31px;
      width: 53px;
      border: 2px solid var(--danger);
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
        top: 2px;
        inset-inline-start: 2px;
        height: 22px;
        width: 22px;
        border-radius: var(--radius-rounded);
        background: black;
        display: flex;
        justify-content: center;
        align-items: center;
        transform: translateX(calc(var(--transform-direction) * 0)) rotate(calc(var(--transform-direction) * 0));
        transition: all 0.3s ease;

        svg {
          color: var(--white) !important;
          height: 14px !important;
          width: 14px !important;
          opacity: 1 !important;
        }
      }

      .light {
        background: var(--danger);
        border-color: var(--danger);
        opacity: 1;
        z-index: 1;
      }

      .dark {
        background: var(--primary);
        border-color: var(--primary);
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

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

.list-widget {
  .image-icon {
    cursor: pointer;
    height: 40px;
    width: 40px;
  }
}

.dashboard-header-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  height: 220px;
  z-index: 1;
  border-radius: 22px;
  padding: 50px 40px;
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;

  .dashboard-header {
    display: flex;
    width: 100%;

    .avatar-container {
      position: relative;
      height: 156px;
      width: 156px;
      min-width: 140px;
      padding: 6px;
      background-color: transparent;
      border: 4px solid #ffffff;
      border-radius: var(--radius-rounded);
      display: flex;
      justify-content: center;
      align-items: center;

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
        flex-direction: column;

        .username {
          h3 {
            font-family: var(--font-alt);
            color: #ffffff;
            font-size: 1.2rem;
            font-weight: 700;
            margin-top: 10px;

            i {
              font-size: 1.2rem;
              margin-inline-start: 5px;
              color: var(--yellow);
            }
          }

          >span {
            margin-right: 4px;
            color: #f2f2f2;
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

@media only screen and (width <=767px) {
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

@media only screen and (width <=767px) {
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

@media only screen and (width >=768px) and (width <=1024px) and (orientation: portrait) {
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

