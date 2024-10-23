<script setup lang="ts">
import { useApi } from "/@src/composable/useAPI";
import { formatDateTime } from "/@src/composable/useSupportElement";
import { useNotyf } from "/@src/composable/useNotyf";
const notyf = useNotyf();
const api = useApi();
const router = useRouter();
const paymentsLoading = ref(false);
const paymentsList = ref([
  {
    id: "792d596a-beb6-4045-8852-574a544de0a2",
    client_info: {
      id: "64d52243-a2f7-48ec-a4af-46e4ec81d6d8",
      username: "Krystal",
      email: "krystal@ibexbuilderstudios.com",
      role: "admin",
      avatar:
        "https://res.cloudinary.com/dcqeugna3/image/upload/v1/media/static/users_avatars/confident-2362133_1280-removebg-preview_vkihy1",
    },
    description: "",
    checkoutLink: "",
    type: "",
    created_by_info: {
      id: "64d52243-a2f7-48ec-a4af-46e4ec81d6d8",
      username: "Krystal",
      email: "krystal@ibexbuilderstudios.com",
      role: "admin",
      avatar:
        "https://res.cloudinary.com/dcqeugna3/image/upload/v1/media/static/users_avatars/confident-2362133_1280-removebg-preview_vkihy1",
    },
    amount: 10.0,

    status: "created",
    created_at: "2024-10-06T06:59:43.151276Z",
    created_by: "64d52243-a2f7-48ec-a4af-46e4ec81d6d8",
    client: null,
  },
]);

const filters = ref("");
const tab = ref("paid");

const columns = {
  description: "Description",
  picture: {
    label: "Created by",
    grow: true,
    media: true,
  },
  amount: "Amount",
  client: {
    label: "Client",
    grow: true,
    media: true,
  },

  status: "Status",
  team: {
    label: "Method",
  },
  // actions: {
  //   label: "Actions",
  //   align: "end",
  // },
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
        item.type.match(filterRe) ||
        item.description.match(filterRe)
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
const moveToDetail = (item: any) => {
  if (item.status !== "succeeded") {
    return;
  } else {
    const url = `https://dashboard.stripe.com/test/payments/${item.response?.id}`;
    window.open(url, "_blank"); // Opens the URL in a new tab
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

        <!-- <div class="tabs-inner">
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
        </div> -->
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
                >
                  <VFlexTableCell>
                    <div>
                      <p
                        class="light-text text-overflow"
                        :class="item.status === 'succeeded' ? 'is-link' : ''"
                        @click="moveToDetail(item)"
                      >
                        {{ item.description }}
                      </p>
                      <p class="mt-2" @click="copyLink(item.checkoutLink)">
                        Checkout link
                        <i
                          style="color: var(--info)"
                          class="fas fa-copy cu-pointer"
                          aria-hidden="true"
                        ></i>
                      </p>
                    </div>
                  </VFlexTableCell>
                  <VFlexTableCell :column="{ media: true, grow: true }">
                    <!-- <VAvatar :picture="item.picture" /> -->
                    <div>
                      <span class="item-name dark-inverted"
                        >{{ item?.created_by_info?.username }}
                      </span>
                      <span class="item-meta">
                        <span> {{ item.created_by_info?.email }}</span>
                      </span>
                      <span class="light-text mt-2"
                        >At: {{ formatDateTime(item.created_at) }}</span
                      >
                    </div>
                  </VFlexTableCell>

                  <VFlexTableCell>
                    <span class="" style="font-size: 600; font-size: 18px"
                      >${{ item.amount }}</span
                    >
                  </VFlexTableCell>

                  <VFlexTableCell :column="{ media: true, grow: true }">
                    <!-- <VAvatar :picture="item.picture" /> -->
                    <div>
                      <span class="item-name dark-inverted"
                        >{{
                          item?.client_info?.username
                            ? item?.client_info?.username
                            : "N/A"
                        }}
                      </span>
                      <span class="item-meta">
                        <span> {{ item.client_info?.email }}</span>
                      </span>
                    </div>
                  </VFlexTableCell>

                  <VFlexTableCell>
                    <VTag>
                      <p
                        style="
                          font-size: 1rem;
                          font-weight: 600;
                          text-transform: uppercase;
                        "
                      >
                        {{ item.status }}
                      </p>
                    </VTag>
                  </VFlexTableCell>
                  <VFlexTableCell>
                    <VAvatar
                      v-if="item.type == 'Stripe'"
                      picture="/icons/stripe-48.png"
                      squared
                      size="medium"
                    ></VAvatar>
                    <VAvatar
                      v-else
                      picture="/icons/paypal-48.png"
                      squared
                      size="medium"
                    ></VAvatar>
                  </VFlexTableCell>
                  <!-- <VFlexTableCell :column="{ align: 'end' }">
                    <ProjectListDropdown />
                  </VFlexTableCell> -->
                </div>
                <!-- public/icons/stripe-48.png -->
              </TransitionGroup>
            </template>
          </VFlexTable>

          <!--Table Pagination-->
          <!-- <VFlexPagination
            v-if="filteredData.length > 5"
            :item-per-page="10"
            :total-items="90"
            :current-page="1"
            :max-links-displayed="5"
          /> -->
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.is-link {
  color: var(--info);
  text-decoration: underline;
  cursor: pointer;
}
.has-top-nav {
  .flex-list-wrapper,
  .list-flex-toolbar {
    max-width: 880px;
    margin-inline-end: auto;
    margin-inline-start: auto;
  }
}
p {
  font-weight: 500;
}

.text-overflow {
  width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
