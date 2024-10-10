<script setup lang="ts">
import { useApi } from "/@src/composable/useAPI";
import { formatDateTime } from "/@src/composable/useSupportElement";

const api = useApi();
const router = useRouter();
const paymentsLoading = ref(false);
const paymentsList = ref({
  payments: [
    {
      id: "PAYID-M4BD4QA3HL91495G5861534C",
      intent: "sale",
      state: "approved",
      cart: "92164923VY966505S",
      payer: {
        payment_method: "paypal",
        status: "UNVERIFIED",
        payer_info: {
          email: "raoarslan263@gmail.com",
          first_name: "Krystal",
          last_name: "Tamayo",
          payer_id: "WHRSNDB5FP7Q4",
          shipping_address: {
            recipient_name: "Krystal Tamayo",
            line1: "157 / C-Block, Main Boulevard, Guldasht Town",
            city: "Lahore",
            state: "AL",
            postal_code: "54000",
            country_code: "US",
          },
          phone: "7203395598",
          country_code: "US",
        },
      },
      transactions: [
        {
          amount: {
            total: "100.00",
            currency: "USD",
            details: {
              subtotal: "100.00",
              shipping: "0.00",
              insurance: "0.00",
              handling_fee: "0.00",
              shipping_discount: "0.00",
              discount: "0.00",
            },
          },
          payee: {
            merchant_id: "6G3AKS3EQZELQ",
            email: "sb-jcewl33176163@business.example.com",
          },
          description: "descripouoi",
          soft_descriptor: "PAYPAL *TEST STORE",
          item_list: {
            shipping_address: {
              recipient_name: "Krystal Tamayo",
              line1: "157 / C-Block, Main Boulevard, Guldasht Town",
              city: "Lahore",
              state: "AL",
              postal_code: "54000",
              country_code: "US",
            },
          },
          related_resources: [
            {
              sale: {
                id: "31056414FW787851J",
                state: "completed",
                amount: {
                  total: "100.00",
                  currency: "USD",
                  details: {
                    subtotal: "100.00",
                    shipping: "0.00",
                    insurance: "0.00",
                    handling_fee: "0.00",
                    shipping_discount: "0.00",
                    discount: "0.00",
                  },
                },
                payment_mode: "INSTANT_TRANSFER",
                protection_eligibility: "ELIGIBLE",
                protection_eligibility_type:
                  "ITEM_NOT_RECEIVED_ELIGIBLE,UNAUTHORIZED_PAYMENT_ELIGIBLE",
                transaction_fee: {
                  value: "3.98",
                  currency: "USD",
                },
                receipt_id: "598993213068301",
                parent_payment: "PAYID-M4BD4QA3HL91495G5861534C",
                create_time: "2024-10-06T09:19:57Z",
                update_time: "2024-10-06T09:19:57Z",
                links: [
                  {
                    href: "https://api.sandbox.paypal.com/v1/payments/sale/31056414FW787851J",
                    rel: "self",
                    method: "GET",
                  },
                  {
                    href: "https://api.sandbox.paypal.com/v1/payments/sale/31056414FW787851J/refund",
                    rel: "refund",
                    method: "POST",
                  },
                  {
                    href: "https://api.sandbox.paypal.com/v1/payments/payment/PAYID-M4BD4QA3HL91495G5861534C",
                    rel: "parent_payment",
                    method: "GET",
                  },
                ],
                soft_descriptor: "PAYPAL *TEST STORE",
              },
            },
          ],
        },
      ],
      create_time: "2024-10-06T07:37:36Z",
      update_time: "2024-10-06T09:19:57Z",
      links: [
        {
          href: "https://api.sandbox.paypal.com/v1/payments/payment/PAYID-M4BD4QA3HL91495G5861534C",
          rel: "self",
          method: "GET",
        },
      ],
    },
  ],
  count: 2,
});

const filters = ref("");
const tab = ref("paid");

const columns = {
  picture: {
    label: "Payer",
    grow: true,
    media: true,
  },
  customer: "Created At",
  industry: "Amount",
  status: "Status",
  team: {
    label: "Method",
  },
  actions: {
    label: "Actions",
    align: "end",
  },
} as const;

const filteredData = computed(() => {
  if (!filters.value) {
    return paymentsList.value.payments;
  } else {
    const filterRe = new RegExp(filters.value, "i");

    return paymentsList.value.payments.filter((item) => {
      return (
        item.id.match(filterRe) ||
        item.payer?.payer_info?.first_name.match(filterRe) ||
        item.payer.payer_info.last_name.match(filterRe) ||
        item.payer.payer_info.email.match(filterRe) ||
        item.payer.payer_info.payer_id.match(filterRe)
      );
    });
  }
});

const getPaymentsDetail = async () => {
  try {
    paymentsLoading.value = true;
    const resp = await api.get(`/api/paypal/payments/`);
    paymentsList.value = resp.data;
  } catch (err) {
    console.log(err);
  } finally {
    paymentsLoading.value = false;
  }
};
const gotoPaymentDetail = (id: any) => {
  router.push({
    path: `/sidebar/dashboard/received-payments/${id}`,
  });
};

onMounted(() => {
  getPaymentsDetail();
});
</script>

<template>
  <PlaceloadV1 v-if="paymentsLoading" />

  <div v-else class="is-relative tabs-wrapper is-slider is-squared">
    <div class="page-content-inner">
      <div class="list-flex-toolbar is-reversed">
        <VControl icon="feather:search">
          <input
            v-model="filters"
            class="input custom-text-filter"
            placeholder="Search..."
          />
        </VControl>

        <div class="tabs-inner">
          <div class="tabs">
            <ul>
              <li :class="[tab === 'paid' && 'is-active']">
                <a
                  tabindex="0"
                  role="button"
                  @keydown.space.prevent="tab = 'paid'"
                  @click="tab = 'paid'"
                  ><span>Paid</span></a
                >
              </li>
              <li :class="[tab === 'pending' && 'is-active']">
                <a
                  tabindex="0"
                  role="button"
                  @keydown.space.prevent="tab = 'pending'"
                  @click="tab = 'pending'"
                  ><span>Pending</span></a
                >
              </li>
              <li class="tab-naver" />
            </ul>
          </div>
        </div>
      </div>

      <div class="flex-list-v2">
        <!--List Empty Search Placeholder -->
        <VPlaceholderPage
          v-if="filteredData.length === 0"
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

        <!--Active Tab-->
        <div v-if="tab === 'paid'" class="tab-content is-active">
          <VFlexTable
            v-if="filteredData.length"
            :data="filteredData"
            :columns="columns"
            rounded
          >
            <template #body>
              <TransitionGroup name="list" tag="div" class="flex-list-inner">
                <!--Table item-->
                <div
                  v-for="item in filteredData"
                  :key="item.id"
                  class="flex-table-item"
                  @click="gotoPaymentDetail(item.id)"
                >
                  <VFlexTableCell :column="{ media: true, grow: true }">
                    <!-- <VAvatar :picture="item.picture" /> -->
                    <div>
                      <span class="item-name dark-inverted"
                        >{{ item?.payer?.payer_info?.first_name }}
                        {{ item?.payer?.payer_info?.last_name }}
                      </span>
                      <span class="item-meta">
                        <span> {{ item?.payer?.payer_info?.email }}</span>
                      </span>
                    </div>
                  </VFlexTableCell>
                  <VFlexTableCell>
                    <span class="light-text">{{
                      formatDateTime(item.create_time)
                    }}</span>
                  </VFlexTableCell>
                  <VFlexTableCell>
                    <span
                      v-for="transaction in item.transactions"
                      class="light-text"
                      >${{ transaction.amount.total }}</span
                    >
                  </VFlexTableCell>
                  <VFlexTableCell>
                    <VTag
                      :color="item.state == 'approved' ? 'primary' : 'info'"
                      rounded
                    >
                      {{ item.state }}
                    </VTag>
                  </VFlexTableCell>
                  <VFlexTableCell>
                    <span class="light-text">{{
                      item?.payer?.payment_method
                    }}</span>
                  </VFlexTableCell>
                  <VFlexTableCell :column="{ align: 'end' }">
                    <ProjectListDropdown />
                  </VFlexTableCell>
                </div>
              </TransitionGroup>
            </template>
          </VFlexTable>

          <!--Table Pagination-->
          <VFlexPagination
            v-if="filteredData.length > 5"
            :item-per-page="10"
            :total-items="90"
            :current-page="1"
            :max-links-displayed="5"
          />
        </div>

        <!--inactive Tab-->
        <div v-else-if="tab === 'pending'" class="tab-content is-active">
          <!--Empty placeholder-->
          <VPlaceholderPage
            title="No closed projects."
            subtitle="Looks like you don't have any closed project yet. When you'll
              start closing off projects, they will be showing up in here."
          >
            <template #image>
              <img
                class="light-image is-larger"
                src="/@src/assets/illustrations/placeholders/projects.svg"
                alt=""
              />
              <img
                class="dark-image is-larger"
                src="/@src/assets/illustrations/placeholders/projects-dark.svg"
                alt=""
              />
            </template>
          </VPlaceholderPage>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.has-top-nav {
  .flex-list-wrapper,
  .list-flex-toolbar {
    max-width: 880px;
    margin-inline-end: auto;
    margin-inline-start: auto;
  }
}
</style>
