<script setup lang="ts">
import { useApi } from "/@src/composable/useAPI";
import { formatDateTime } from "/@src/composable/useSupportElement";

const api = useApi();
const router = useRouter();
const paymentsLoading = ref(false);
const paymentsList = ref([
  {
    id: "792d596a-beb6-4045-8852-574a544de0a2",
    client_info: null,
    created_by_info: {
      id: "64d52243-a2f7-48ec-a4af-46e4ec81d6d8",
      username: "Krystal",
      email: "krystal@ibexbuilderstudios.com",
      role: "admin",
      avatar:
        "https://res.cloudinary.com/dcqeugna3/image/upload/v1/media/static/users_avatars/confident-2362133_1280-removebg-preview_vkihy1",
    },
    amount: 10.0,
    response: {
      id: "PAYID-M4BDKXQ7KM686468E089260P",
      links: [
        {
          rel: "self",
          href: "https://api.sandbox.paypal.com/v1/payments/payment/PAYID-M4BDKXQ7KM686468E089260P",
          method: "GET",
        },
        {
          rel: "approval_url",
          href: "https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=EC-5JE23537U81489105",
          method: "REDIRECT",
        },
        {
          rel: "execute",
          href: "https://api.sandbox.paypal.com/v1/payments/payment/PAYID-M4BDKXQ7KM686468E089260P/execute",
          method: "POST",
        },
      ],
      payer: {
        payment_method: "paypal",
      },
      state: "created",
      intent: "sale",
      create_time: "2024-10-06T06:59:42Z",
      transactions: [
        {
          amount: {
            total: "10.00",
            currency: "USD",
          },
          description: "string",
          related_resources: [],
        },
      ],
    },
    status: "created",
    created_at: "2024-10-06T06:59:43.151276Z",
    created_by: "64d52243-a2f7-48ec-a4af-46e4ec81d6d8",
    client: null,
  },
]);

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
    return paymentsList.value;
  } else {
    const filterRe = new RegExp(filters.value, "i");

    return paymentsList.value.filter((item) => {
      return (
        item.id.match(filterRe) ||
        item.created_by_info.username.match(filterRe) ||
        item.created_by_info.email.match(filterRe) ||
        item.created_by_info.role.match(filterRe)
      );
    });
  }
});

const getPaymentsDetail = async () => {
  try {
    paymentsLoading.value = true;
    const resp = await api.get(`/api/paypal/`);
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
  <div class="is-relative tabs-wrapper is-slider is-squared">
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
                  @click="gotoPaymentDetail(item.response.id)"
                >
                  <VFlexTableCell :column="{ media: true, grow: true }">
                    <!-- <VAvatar :picture="item.picture" /> -->
                    <div>
                      <span class="item-name dark-inverted"
                        >{{ item?.created_by_info?.username }}
                      </span>
                      <span class="item-meta">
                        <span> {{ item.created_by_info?.email }}</span>
                      </span>
                    </div>
                  </VFlexTableCell>
                  <VFlexTableCell>
                    <span class="light-text">{{
                      formatDateTime(item.created_at)
                    }}</span>
                  </VFlexTableCell>
                  <VFlexTableCell>
                    <span class="light-text">${{ item.amount }}</span>
                  </VFlexTableCell>
                  <VFlexTableCell>
                    <VTag
                      :color="item.status == 'approved' ? 'primary' : 'info'"
                      rounded
                    >
                      {{ item.status }}
                    </VTag>
                  </VFlexTableCell>
                  <VFlexTableCell>
                    <span class="light-text">{{
                      item?.response?.payer?.payment_method
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
