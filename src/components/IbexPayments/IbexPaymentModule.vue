<script setup lang="ts">
import ApexChart from "vue3-apexcharts";
import { useApi } from "/@src/composable/useAPI";
import { useIncomeHistoryChart } from "/@src/data/dashboards/banking-v1/incomeHistoryChart";
import { popovers } from "/@src/data/users/userPopovers";
import { useNotyf } from "/@src/composable/useNotyf";
const api = useApi();
const notyf = useNotyf();
const linkData = ref({
  amount: "",
  description: "",
  client: "",
  type: "Stripe",
});
const paymentsLoading = ref(false);
const paymentsDetails = ref({
  payments: [],
  count: 0,
});

const createdLink = ref("");
const selectSlotOptions = ref([]);
const loading = ref(false);
const linkLoading = ref(false);

const optionsSingle = [
  "Last 10 days",
  "Last month",
  "Last 3 months",
  "Last 6 months",
];

const getClientHandler = async () => {
  try {
    loading.value = true;
    const response = await api.get("/api/users/by-role/client/", {});
    selectSlotOptions.value = response.data.map((item) => {
      return {
        value: item.id,
        name: item.username,
        icon: item.avatar,
      };
    });
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const copyLink = (link: any) => {
  // const linkToCopy = PayPalLinkData.value.approved_url;

  if (link) {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        notyf.success("Link copied to clipboard!");
      })
      .catch((err) => {
        notyf.error("Failed to copy the link: ", err);
      });
  } else {
    notyf.error("No link to copy!");
  }
};

const createPayPalLink = async () => {
  try {
    linkLoading.value = true;
    const response = await api.post("/api/paypal/stripe-session/", {
      amount: linkData.value.amount,
      description: linkData.value.description,
      client: linkData.value.client,
    });
    createdLink.value = response.data.url;
    notyf.success("link Created");
  } catch (err) {
    notyf.success("Something went wrong");
  } finally {
    linkLoading.value = false;
  }
};

onMounted(() => {
  getClientHandler();
});
</script>

<template>
  <div class="banking-dashboard banking-dashboard-v1">
    <div class="columns is-multiline">
      <div class="column is-12">
        <div class="columns is-multiline">
          <div class="column is-6">
            <div class="dashboard-card is-contacts">
              <div class="title-wrap">
                <h3 class="dark-inverted">Create link</h3>
              </div>

              <form action="" v-on:submit.prevent="createPayPalLink">
                <div class="transfer-form">
                  <VField class="is-image-select has-curved-images">
                    <label for=""> Client</label>
                    <VControl>
                      <Multiselect
                        v-model="linkData.client"
                        placeholder="Select a client"
                        label="name"
                        :max-height="145"
                        :options="selectSlotOptions"
                      >
                        <template #singlelabel="{ value }">
                          <div class="multiselect-single-label">
                            <VAvatar
                              class="select-option-icon"
                              size="xs"
                              squared
                              :picture="value.icon"
                            ></VAvatar>
                            <span class="select-label-text">
                              {{ value.name }}
                            </span>
                          </div>
                        </template>
                        <template #option="{ option }">
                          <VAvatar
                            class="select-option-icon"
                            size="xs"
                            squared
                            :picture="option.icon"
                          ></VAvatar>

                          <span class="select-label-text">
                            {{ option.name }}
                          </span>
                        </template>
                      </Multiselect>
                    </VControl>
                  </VField>
                  <!-- <div class="columns is-multiple"> -->
                  <div class="field column is-12">
                    <label>Amount *</label>
                    <div class="field has-addons">
                      <div class="field-addon-body">
                        <div class="control">
                          <span class="select currency-select">
                            <select>
                              <option>$</option>
                              <!-- <option>£</option>
                            <option>€</option> -->
                            </select>
                          </span>
                        </div>
                        <div class="control is-expanded">
                          <input
                            v-model="linkData.amount"
                            required
                            min="2"
                            class="input"
                            type="number"
                            placeholder="Amount of money"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- <div class="field mt-2 cloumn is-2">
                      <VField>
                        <VLabel for="">Type</VLabel>
                        <VSelect v-model="linkData.type">
                          <VOption value="Stripe">Stripe</VOption>
                          <VOption value="PayPal">PayPal</VOption>
                        </VSelect>
                      </VField>
                    </div> -->
                  <!-- </div> -->
                  <div class="field">
                    <label>Description *</label>
                    <VField>
                      <VControl>
                        <VTextarea
                          required
                          v-model="linkData.description"
                          class="is-primary-focus"
                          rows="2"
                          placeholder="Description..."
                        />
                      </VControl>
                    </VField>
                  </div>

                  <div class="submit-wrap mt-5">
                    <VButton
                      type="submit"
                      color="info"
                      size="big"
                      fullwidth
                      :loading="linkLoading"
                      raised
                      bold
                    >
                      Create Payment link
                    </VButton>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div class="column is-6">
            <div class="dashboard-card">
              <div class="title-wrap">
                <h3 class="dark-inverted">Payment links</h3>
              </div>
              <!-- <VField label="Checkout link" addons>
                <VControl expanded>
                  <VInput
                    type="text"
                    v-model="createdLink"
                    class="input"
                    placeholder="link..."
                  />
                </VControl>
                <VControl>
                  <VButton
                    @click="copyLink(createdLink)"
                    class="cu-pointer"
                    color="primary"
                    icon="fas fa-envelope"
                  >
                    Send
                  </VButton>
                </VControl>
              </VField> -->
              <VField label="Checkout link" addons>
                <VControl expanded>
                  <VInput
                    type="text"
                    v-model="createdLink"
                    class="input"
                    placeholder="link..."
                  />
                </VControl>
                <VControl>
                  <VButton
                    icon="fas fa-copy"
                    @click="copyLink(createdLink)"
                    class="cu-pointer"
                    color="primary"
                  >
                    Copy
                  </VButton>
                </VControl>
              </VField>
              <!-- <VField label="Check Status Link" addons>
                <VControl expanded>
                  <VInput
                    type="text"
                    v-model="PayPalLinkData.resp.links[0].href"
                    class="input"
                    placeholder="Approved link..."
                  />
                </VControl>
                <VControl>
                  <VButton
                    icon="fas fa-refresh"
                    class="cu-pointer"
                    color="primary"
                  >
                    Verify
                  </VButton>
                </VControl>
              </VField> -->

              <p class="context-text" v-if="createdLink">
                payment link has been successfully created
              </p>
              <!-- <div class="submit-wrap">
                <VButton
                  @click="clearLinks"
                  color="warning"
                  size="big"
                  fullwidth
                  :loading="linkLoading"
                  raised
                  bold
                >
                  Clear all information
                </VButton>
              </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
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
          align-items: center;
          padding: 20px;

          &:not(:first-child) {
            border-top: 1.6px dashed var(--fade-grey-dark-4);
          }

          .credit-card {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 80px;
            width: 120px;
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
                  max-width: 28px;
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
            padding: 6px 0;

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

    > .title-wrap {
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
      font-size: 1rem;
      color: var(--info);
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

@media only screen and (width >= 768px) and (width <= 1024px) and (orientation: landscape) {
  .banking-dashboard-v1 {
    .dashboard-card {
      &.is-credit-cards {
        .card-block {
          .card-block-inner {
            .credit-card {
              height: 67px;
              width: 100px;
              min-width: 100px;
            }

            .credit-card-meta {
              span {
                &:nth-child(2) {
                  font-size: 1.3rem;
                }
              }
            }
          }
        }
      }

      &.is-contacts {
        height: 400px;
      }

      .context-text {
        font-size: 0.8rem;
      }
    }
  }
}
</style>
