<script setup lang="ts">
import sleep from "/@src/utils/sleep";
import { useNotyf } from "/@src/composable/useNotyf";
import { popovers } from "/@src/data/users/userPopovers";
import { useApi } from "../composable/useAPI";

const api = useApi();
const notyf = useNotyf();
const router = useRouter();
const route = useRoute();

const isLoading = ref(false);

const verifyPaymentSuccess = async () => {
  try {
    isLoading.value = true;
    const resp = await api.get(`/api/paypal/success/${route.query.paymentId}/`);
    notyf.success("Invitation for Banking Solution Website accepted");
    router.push("/sidebar/dashboards/banking-1");
  } catch (err) {
    console.log("Something went wrong");
  } finally {
    isLoading.value = false;
  }
};

const gotoIbex = () => {};
onMounted(() => {
  verifyPaymentSuccess();
});
</script>

<template>
  <div class="action-page-wrapper action-page-v1">
    <div class="wrapper-inner">
      <div class="action-box">
        <div class="box-content">
          <VAvatar
            size="big"
            picture="/logos/IbexFaviconDark.png"
            badge="/icons/paypal.png"
          />

          <h3 class="dark-inverted">
            <span class="is-dark-primary">Payment successful!</span>
          </h3>

          <div class="sender-message is-dark-card-bordered is-dark-bg-4">
            <h4 class="dark-inverted">Payment Message</h4>
            <p>
              Thank you for your payment! We are pleased to inform you that your
              transaction has been successfully completed. Your support helps us
              at Ibex Builders Studios continue to provide top-quality services.
              You will soon receive a confirmation email with the details of
              your transaction. If you have any questions or need further
              assistance, feel free to reach out to our support team. We
              appreciate your trust in us and look forward to working with you
              on your project! Best regards, The Ibex Builders Studios Team
            </p>
          </div>

          <div class="buttons">
            <VButton dark-outlined> Decline </VButton>
            <VButton
              color="primary"
              :loading="isLoading"
              raised
              tabindex="0"
              @click="gotoIbex()"
            >
              Confirm
            </VButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "/@src/scss/abstracts/all";

.action-page-wrapper {
  &.action-page-v1 {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 540px;
    min-height: 560px;
    margin: 0 auto;

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
    &.action-page-v1 {
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
    &.action-page-v1 {
      .wrapper-inner {
        .action-box {
          padding: 20px;

          .box-content {
            .buttons {
              .button {
                min-width: 130px;
              }
            }
          }
        }
      }
    }
  }
}

@media only screen and (width >= 768px) and (width <= 1024px) and (orientation: portrait) {
  .action-page-wrapper {
    &.action-page-v1 {
      .wrapper-inner {
        .action-box {
          .box-content {
            .buttons {
              .button {
                min-width: 130px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
