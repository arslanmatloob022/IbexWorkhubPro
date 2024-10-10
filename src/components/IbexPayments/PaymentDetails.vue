<route lang="yaml">
meta:
  requiresAuth: true
  isManagerAllowed: false
  # isPartnerAllowed: false
  # isContractorAllowed: false
  # isWorkerAllowed: false
  # isClientAllowed: false
</route>
<script setup lang="ts">
import sleep from "/@src/utils/sleep";
import { useNotyf } from "/@src/composable/useNotyf";
import { useApi } from "/@src/composable/useAPI";

import { popovers } from "/@src/data/users/userPopovers";
import { formatDateTime } from "/@src/composable/useSupportElement";

const notyf = useNotyf();
const router = useRouter();
const api = useApi();
const route = useRoute();
const isLoading = ref(false);
const paymentDetail = ref({
  id: "e07eb0c8-e2d4-4373-8cf7-281c7966d8a0",
  client_info: null,
  created_by_info: {
    id: "64d52243-a2f7-48ec-a4af-46e4ec81d6d8",
    username: "Krystal",
    email: "krystal@ibexbuilderstudios.com",
    role: "admin",
    avatar:
      "https://res.cloudinary.com/dcqeugna3/image/upload/v1/media/static/users_avatars/confident-2362133_1280-removebg-preview_vkihy1",
  },
  amount: 94.0,
  response: {
    id: "PAYID-M4BF44I2Y949776H29175308",
    cart: "7CB39354499642142",
    links: [
      {
        rel: "self",
        href: "https://api.sandbox.paypal.com/v1/payments/payment/PAYID-M4BF44I2Y949776H29175308",
        method: "GET",
      },
    ],
    payer: {
      status: "UNVERIFIED",
      payer_info: {
        email: "julio@gmail.com",
        phone: "7203395598",
        payer_id: "WHRSNDB5FP7Q4",
        last_name: "Adams",
        first_name: "Julio",
        country_code: "US",
        shipping_address: {
          city: "Lahore",
          line1: "157 / C-Block, Main Boulevard, Guldasht Town",
          state: "AL",
          postal_code: "54000",
          country_code: "US",
          recipient_name: "Julio Adams",
        },
      },
      payment_method: "paypal",
    },
    state: "approved",
    intent: "sale",
    create_time: "2024-10-06T09:54:57Z",
    update_time: "2024-10-06T10:25:03Z",
    transactions: [
      {
        payee: {
          email: "sb-jcewl33176163@business.example.com",
          merchant_id: "6G3AKS3EQZELQ",
        },
        amount: {
          total: "94.00",
          details: {
            discount: "0.00",
            shipping: "0.00",
            subtotal: "94.00",
            insurance: "0.00",
            handling_fee: "0.00",
            shipping_discount: "0.00",
          },
          currency: "USD",
        },
        item_list: {
          shipping_address: {
            city: "Lahore",
            line1: "157 / C-Block, Main Boulevard, Guldasht Town",
            state: "AL",
            postal_code: "54000",
            country_code: "US",
            recipient_name: "Julio Adams",
          },
        },
        description: "success",
        soft_descriptor: "PAYPAL *TEST STORE",
        related_resources: [
          {
            sale: {
              id: "85377044MH420592J",
              links: [
                {
                  rel: "self",
                  href: "https://api.sandbox.paypal.com/v1/payments/sale/85377044MH420592J",
                  method: "GET",
                },
                {
                  rel: "refund",
                  href: "https://api.sandbox.paypal.com/v1/payments/sale/85377044MH420592J/refund",
                  method: "POST",
                },
                {
                  rel: "parent_payment",
                  href: "https://api.sandbox.paypal.com/v1/payments/payment/PAYID-M4BF44I2Y949776H29175308",
                  method: "GET",
                },
              ],
              state: "completed",
              amount: {
                total: "94.00",
                details: {
                  discount: "0.00",
                  shipping: "0.00",
                  subtotal: "94.00",
                  insurance: "0.00",
                  handling_fee: "0.00",
                  shipping_discount: "0.00",
                },
                currency: "USD",
              },
              receipt_id: "1959624121915991",
              create_time: "2024-10-06T10:25:03Z",
              update_time: "2024-10-06T10:25:03Z",
              payment_mode: "INSTANT_TRANSFER",
              parent_payment: "PAYID-M4BF44I2Y949776H29175308",
              soft_descriptor: "PAYPAL *TEST STORE",
              transaction_fee: {
                value: "3.77",
                currency: "USD",
              },
              protection_eligibility: "ELIGIBLE",
              protection_eligibility_type:
                "ITEM_NOT_RECEIVED_ELIGIBLE,UNAUTHORIZED_PAYMENT_ELIGIBLE",
            },
          },
        ],
      },
    ],
  },
  PayementId: "PAYID-M4BF44I2Y949776H29175308",
  status: "approved",
  created_at: "2024-10-06T09:54:57.669752Z",
  created_by: "64d52243-a2f7-48ec-a4af-46e4ec81d6d8",
  client: null,
});

const accept = async () => {
  isLoading.value = true;
  notyf.success("Transaction is accepted");

  await sleep();
  router.push("/sidebar/dashboard/received-payments");

  isLoading.value = false;
};

const copyLink = (link: any) => {
  if (link) {
    navigator.clipboard.writeText(link);
    notyf.success("Link Copied");
  }
};

const getPaymentDetail = async () => {
  try {
    isLoading.value = true;
    const resp = await api.get(`/api/paypal/${route.params.id}`);
    paymentDetail.value = resp.data;
  } catch (err) {
    console.log(err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  getPaymentDetail();
});
</script>

<template>
  <div class="action-page-wrapper action-page-v2">
    <div class="wrapper-outer">
      <div class="wrapper-inner">
        <div class="action-box">
          <div class="box-content">
            <VAvatar
              size="big"
              picture="/icons/paypal.png"
              badge="/icons/paypal-48.png"
            />

            <h3 class="dark-inverted">
              {{ paymentDetail.id }}
              <VTag
                light
                rounded
                :color="
                  paymentDetail.status == 'created'
                    ? 'info'
                    : paymentDetail.status == 'cancel'
                    ? 'danger'
                    : 'primary'
                "
                >{{ paymentDetail.status }}</VTag
              >
            </h3>
            <div class="sender-message is-dark-card-bordered is-dark-bg-4">
              <h4 class="dark-inverted">Payer Information</h4>
              <p>
                Name:
                <span class="dark-text"
                  >{{ paymentDetail?.response?.payer?.payer_info?.first_name }}
                  {{
                    paymentDetail?.response?.payer?.payer_info?.last_name
                  }}</span
                >
              </p>
              <p>
                Email:
                <span class="dark-text"
                  >{{ paymentDetail?.response?.payer?.payer_info?.email }}
                </span>
              </p>
              <p>
                Id:
                <span class="dark-text"
                  >{{ paymentDetail?.response?.payer?.payer_info?.payer_id }}
                </span>
              </p>
              <p>
                Status:
                <span class="dark-text"
                  >{{ paymentDetail?.response?.payer?.status }}
                </span>
              </p>
            </div>

            <div class="sender-message is-dark-card-bordered is-dark-bg-4 mt-3">
              <h4 class="dark-inverted">Shipping Address</h4>
              <p>
                Line1:
                <span class="dark-text"
                  >{{
                    paymentDetail?.response?.payer?.payer_info?.shipping_address
                      ?.line1
                  }}
                </span>
              </p>
              <p>
                City:
                <span class="dark-text"
                  >{{
                    paymentDetail?.response?.payer?.payer_info?.shipping_address
                      ?.city
                  }}
                </span>
              </p>
              <p>
                State:
                <span class="dark-text"
                  >{{
                    paymentDetail?.response?.payer?.payer_info?.shipping_address
                      ?.state
                  }}
                </span>
              </p>
              <p>
                Postal Code:
                <span class="dark-text"
                  >{{
                    paymentDetail?.response?.payer?.payer_info?.shipping_address
                      ?.postal_code
                  }}
                </span>
              </p>
              <p>
                Country:
                <span class="dark-text"
                  >{{
                    paymentDetail?.response?.payer?.payer_info?.shipping_address
                      ?.country_code
                  }}
                </span>
              </p>
            </div>

            <div class="buttons">
              <VButton @click="router.go(-1)" dark-outlined> Back </VButton>
              <VButton
                color="primary"
                :loading="isLoading"
                raised
                tabindex="0"
                @keydown.space.prevent="accept"
                @click="accept"
              >
                Verify
              </VButton>
            </div>
          </div>
        </div>
      </div>

      <div class="side-wrapper">
        <div class="side-inner">
          <div class="side-title">
            <h3 class="dark-inverted">Payment Receipt</h3>
            <p>
              Created at:
              <span class="dark-text">{{
                formatDateTime(paymentDetail.response.create_time)
              }}</span>
            </p>
          </div>

          <div class="action-list">
            <div class="side-title">
              <h3 class="dark-inverted">Amount</h3>
            </div>
            <div class="mb-3">
              <p>
                Total:
                <span class="dark-text"> {{ paymentDetail?.amount }}</span>
              </p>
              <p>
                Currency:
                <span class="dark-text">USD</span>
              </p>
            </div>
            <div class="side-title">
              <h3 class="dark-inverted">Links</h3>
            </div>
            <VBlock
              v-for="link in paymentDetail?.response.links"
              :title="link.rel"
            >
              <p>
                {{
                  link?.href.length > 20 ? link?.href.slice(12, 40) : link?.href
                }}
              </p>

              <template #icon>
                <VIconWrap
                  @click="copyLink(link?.href)"
                  icon="fas fa-copy"
                  class="cu-pointer"
                  dark="3"
                  dark-primary
                  dark-card-bordered
                />
              </template>
            </VBlock>
          </div>
          <div class="action-list mt-4">
            <div class="side-title">
              <h3 class="dark-inverted">Transactions</h3>
            </div>

            <!-- <div class="side-title">
              <h3 class="dark-inverted">Links</h3>
            </div> -->
            <p>Details</p>
            <VBlock
              v-for="link in paymentDetail?.response?.transactions"
              :title="link?.payee?.merchant_id"
            >
              <p>Amount: ${{ link?.amount?.total }}</p>
              <p>Discount: {{ link?.amount?.details?.discount }}</p>
              <p>Shipping: {{ link?.amount?.details?.shipping }}</p>
              <p>Subtotal: {{ link?.amount?.details?.subtotal }}</p>
              <p>Handling fee: {{ link?.amount?.details?.handling_fee }}</p>
              <p>Descriptor: {{ link?.soft_descriptor }}</p>
              <p>State: {{ link?.related_resources[0]?.sale?.state }}</p>

              <!-- <template #icon>
                <VIconWrap
                  @click="copyLink(link?.href)"
                  icon="fas fa-copy"
                  class="cu-pointer"
                  dark="3"
                  dark-primary
                  dark-card-bordered
                />
              </template> -->
            </VBlock>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "/@src/scss/abstracts/all";

.action-page-wrapper {
  &.action-page-v2 {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 840px;
    min-height: 560px;
    margin: 0 auto;

    .wrapper-outer {
      @include vuero-s-card;

      display: flex;
      padding: 0;

      .wrapper-inner {
        .action-box {
          border: none;
          background: none;
          border-radius: 0;
          border-inline-end: 1px solid var(--fade-grey-dark-3);
        }
      }

      .side-wrapper {
        flex-grow: 2;
        padding: 40px;

        .side-inner {
          .side-title {
            font-family: var(--font);
            margin-bottom: 16px;

            h3 {
              font-family: var(--font-alt);
              font-weight: 600;
              color: var(--dark-text);
            }

            p {
              font-size: 0.9rem;
            }
          }

          .action-list {
            .media-flex {
              .icon-wrap {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 32px;
                width: 32px;
                min-width: 32px;
                border-radius: var(--radius-rounded);
                background: var(--white);
                border: 1px solid var(--fade-grey-dark-3);
                box-shadow: var(--light-box-shadow);
                color: var(--primary);

                svg {
                  width: 16px;
                  height: 16px;
                  stroke-width: 3px;
                }
              }

              .flex-meta {
                span {
                  font-weight: 400;
                  font-size: 0.9rem;
                }

                p {
                  font-size: 0.9rem;
                  max-width: 240px;
                }
              }
            }
          }
        }
      }
    }

    .wrapper-inner {
      .action-box {
        @include vuero-s-card;

        padding: 40px;

        .box-content {
          text-align: center;
          font-family: var(--font);

          .v-avatar {
            display: block;
            margin: 0 auto 8px;
          }

          h3 {
            font-family: var(--font-alt);
            font-weight: 600;
            max-width: 320px;
            margin: 0 auto 16px;

            span {
              color: var(--primary);
            }
          }

          .sender-message {
            text-align: inset-inline-start;
            padding: 20px;
            border: 1px solid var(--fade-grey-dark-3);
            max-width: 360px;
            margin: 0 auto;
            border-radius: var(--radius-large);
            box-shadow: var(--light-box-shadow);

            h4 {
              font-family: var(--font-alt);
              font-size: 0.7rem;
              font-weight: 500;
              color: var(--dark-text);
              text-transform: uppercase;
              margin-bottom: 6px;
            }

            p {
              text-align: left;
              font-size: 0.9rem;
            }
          }

          .people-wrap {
            .people {
              display: flex;
              justify-content: center;
              padding: 16px 0 8px;

              .v-avatar {
                margin: 0 4px;
              }
            }

            .people-text {
              p {
                font-size: 0.9rem;
              }
            }
          }

          .buttons {
            margin: 0 auto;
            display: flex;
            justify-content: center;
            padding-top: 30px;

            .button {
              margin: 0 4px;
              min-width: 150px;
            }
          }
        }
      }
    }
  }
}

.is-dark {
  .action-page-wrapper {
    &.action-page-v2 {
      .wrapper-inner {
        .action-box {
          @include vuero-card--dark;
        }
      }

      .wrapper-outer {
        @include vuero-card--dark;
      }
    }
  }
}

/* ==========================================================================
3. Media Queries
========================================================================== */

@media only screen and (width <= 767px) {
  .action-page-wrapper {
    &.action-page-v2 {
      .wrapper-outer {
        flex-direction: column;

        .wrapper-inner {
          .action-box {
            padding: 20px 20px 40px;
            border-inline-end: none;
            border-bottom: 1px solid var(--fade-grey-dark-3);

            .box-content {
              .buttons {
                .button {
                  min-width: 130px;
                }
              }
            }
          }
        }

        .side-wrapper {
          padding: 40px 20px;
        }
      }
    }
  }
}

@media only screen and (width >= 768px) and (width <= 1024px) and (orientation: portrait) {
  .action-page-wrapper {
    &.action-page-v2 {
      .wrapper-outer {
        .wrapper-inner {
          .action-box {
            padding: 30px;

            .box-content {
              .buttons {
                .button {
                  min-width: 130px;
                }
              }
            }
          }
        }

        .side-wrapper {
          padding: 30px;
        }
      }
    }
  }
}
</style>
