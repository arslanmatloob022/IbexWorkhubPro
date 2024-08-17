<script setup lang="ts">
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { CreateActivityLog } from '/@src/composable/useSupportElement';
const route = useRoute();
const api = useApi();
const notyf = useNotyf();
const props = defineProps({
  id: {
    type: String,
    default: 0,
  },
});
const currentSelectedID = ref(0);
const addLicencModal = ref(false);
const selectedLicenceType = ref(0);
const Loading = ref(false);
const siaNumber = ref("");
const showCertificate = ref(false)
const SweetAlertProps = ref({
  title: "",
  subtitle: "test",
  isSweetAlertOpen: false,
  btntext: "text",
});

const SIAdata = ref([
  {
    id: 0,
    firstName: "",
    surName: "",
    licenceNumber: "",
    role: "",
    licenceSector: "",
    expiryDate: "",
    status: false,
    statusExplanation: "",
    additionalLicenceConditions: "",
    isDefault: false,
    created_at: "",
    worker: "",
  },
]);

const verifySIA = async (siaNum: string) => {
  try {
    const response = await api.post(
      `v3/api/worker/worker_sia/${route.params.id}/verify-sia-number/`,{'siaNumber':siaNum}
    );
    if (response.data) {
      notyf.success("Licence Verified, Verify");
    }
  } catch (error) {
    notyf.error("Licence Unverified");
  }
};

const LicenctTypes = [
  {
    name: "Security",
    icon: "/images/photo/Security-Guarding.png",
  },
  {
    name: "CIVT",
    icon: "/images/photo/CVIT.png",
  },
  {
    name: "CCTV",
    icon: "/images/photo/CCTV.png",
  },
  {
    name: "Door Supervisor",
    icon: "/images/photo/Door-Supervision.png",
  },
  {
    name: "Close Protection",
    icon: "/images/photo/Close-Protection.png",
  },
  {
    name: "Key Holding",
    icon: "/images/photo/Key-Holding.png",
  },
  {
    name: "Veichile Immoblishing",
    icon: "/images/photo/Vehicle-Immobilising.png",
  },
  {
    name: "K9",
    icon: "/images/photo/K9.png",
  },
];
const AddLicence = async () => {
  try {
    if (siaNumber.value.length < 16) {
      notyf.error("Please enter valid SIA");
      return;
    }
    Loading.value = true;
    const response = await api.post(
      `/v3/api/worker/worker_sia/${props.id}/add_sia_licence/`,
      {
        siaNumber: siaNumber.value,
      }
    );
    notyf.success("worker updated, worker");
    CreateActivityLog({ message: `added worker <b>licence</b>`, objectId: route.params.id, method: "patch" });
    Loading.value = false;
    addLicencModal.value = false;
    siaNumber.value = "";
    getWorkerSiaLicences();
  } catch (error) {
    Loading.value = false;
    notyf.error("Invalid SIA or worker with this SIA already register");
  }
};
const OpenDeleteSweetAlert = (id: number) => {
  currentSelectedID.value = id;
  SweetAlertProps.value = {
    title: "Are you sure?",
    subtitle: "You will not be able to recover this Worker Document!",
    btntext: "Yes, Delete it",
    isSweetAlertOpen: true,
  };
};
const deleteLicenceHandler = async () => {
  try {
    SweetAlertProps.value.isSweetAlertOpen = false;
    const response = await api.delete(
      `/v3/api/worker/worker_sia/${currentSelectedID.value}/`,
      {}
    );
    notyf.dismissAll();
    notyf.success("Delete worker licence, Worker");
    getWorkerSiaLicences();
  } catch { }
};
const getWorkerSiaLicences = async () => {
  try {
    SIAdata.value = [];
    const response = await api.get(
      `/v3/api/worker/worker_sia/${props.id}/get-worker-sia/`,
      {}
    );
    SIAdata.value = response.data;
    console.log(response.data);
  } catch (error) {
    console.error("ok", error);
  }
};

onMounted(() => {
  getWorkerSiaLicences();
});
</script>

<template>
  <div class="banking-dashboard banking-dashboard-v1">
    <div class="columns is-multiline">
      <!--Credit Cards-->
      <div class="column is-12">
        <div class="dashboard-card is-credit-cards">
          <div class="title-wrap">
            <h3 class="dark-inverted">My Licences</h3>
            <div>
              <VButton color="primary" icon="fas fa-plus" elevated @click="addLicencModal = true">
                Licence
              </VButton>
            </div>
          </div>

          <div class="card-block">
            <div class="columns is-multiline">
              <!--Credit Cards-->
              <div v-for="(item, index) in SIAdata" :key="index" class="column is-4">
                <div style="display: flex;
                flex-direction: column;
                align-items: center;margin-bottom:18px">
                  <WorkerSiaCard style="width:400px" :sia-card="item" />
                </div>
                <div class="info-block-inner">
                  <div class="info-block-line">
                    <h4 class="dark-inverted">Verify</h4>
                    <span @click="verifySIA(item.licenceNumber)">
                      <i class="iconify" data-icon="feather:refresh-ccw" aria-hidden="true" style="
                        color: var(--primary);
                        margin-right: 8px;
                        cursor: pointer;
                        "></i>
                      Verify again
                      <!-- {{ item.status ? "Active" : "InActive" }} -->
                    </span>
                  </div>
                  <div class="info-block-line">
                    <h4 class="dark-inverted">Status</h4>
                    <span>
                      <i aria-hidden="true" class="fas fa-circle text-success" style="color: var(--primary)" />
                      {{ item.status ? "Active" : "InActive" }}
                    </span>
                  </div>
                  <div class="info-block-line">
                    <h4 class="dark-inverted">Expires in</h4>
                    <span>{{ item.expiryDate }}</span>
                  </div>
                  <div class="info-block-line">
                    <h4 class="dark-inverted">Type</h4>
                    <span class="has-image"> SIA card </span>
                  </div>
                </div>
              </div>
              <div class="column is-12 pb-5">
                <VPlaceholderPage v-if="SIAdata.length == 0" title="No Licence is added for this employee." subtitle="Too bad. Looks like we couldn't find any matching results for the
search terms you've entered. Please try different search terms or
criteria." larger>
                  <template #image>
                    <img class="light-image" src="/@src/assets/illustrations/placeholders/search-4.svg" alt="" />
                    <img class="dark-image" src="/@src/assets/illustrations/placeholders/search-4-dark.svg" alt="" />
                  </template>
                </VPlaceholderPage>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <BScertificate v-if="showCertificate"></BScertificate>

  <VModal is="form" :open="addLicencModal" @submit.prevent="AddLicence" title="Add Licence" size="big" actions="right"
    @close="addLicencModal = false">
    <template #content>
      <div class="modal-form">
        <div class="stats-wrapper">
          <div class="columns is-multiline is-flex-tablet-p">
            <div v-for="(item, index) in LicenctTypes" :key="index" class="column is-3">
              <div class="dashboard-card" style="height: 150px" @click="selectedLicenceType = index"
                :class="selectedLicenceType == index ? 'active-licence' : ''">
                <VBlock style="
cursor: pointer;
flex-direction: column;
align-items: center;
justify-content: center;
text-align: center;
gap: 10px;
font-size: 0.75rem;
" :title="item.name" center>
                  <template #icon>
                    <img :src="item.icon" alt="" />
                  </template>
                </VBlock>
              </div>
            </div>
            <VField v-slot="{ id }" class="column is-6">
              <label for="">SIA Licence Number *</label>
              <VControl>
                <VIMaskInput :id="id" v-model="siaNumber" autocomplete="cc-csc" required class="input" :options="{
                mask: '0000000000000000',
              }" placeholder="SIA Number" />
              </VControl>
            </VField>
          </div>
        </div>
      </div>
    </template>
    <template #action>

      <VButton type="submit" color="primary" :loading="Loading" icon="fa fa-plus" raised>Licence</VButton>
    </template>
  </VModal>
  <SweetAlert v-if="SweetAlertProps.isSweetAlertOpen" :isSweetAlertOpen="SweetAlertProps.isSweetAlertOpen"
    :title="SweetAlertProps.title" :subtitle="SweetAlertProps.subtitle" :btntext="SweetAlertProps.btntext"
    :onConfirm="deleteLicenceHandler" :onCancel="() => (SweetAlertProps.isSweetAlertOpen = false)" />
</template>

<style lang="scss">
@import "/@src/scss/abstracts/all";

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
            width: 280px;
            min-width: 120px;
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
</style>
