<script setup lang="ts">
import { useApi } from "/@src/composable/useAPI";
import { formatDateTime } from "/@src/composable/useSupportElement";
import { useNotyf } from "/@src/composable/useNotyf";
const selectedPayID = ref("");
const loading = ref(false);
const notyf = useNotyf();
const api = useApi();
const router = useRouter();
const paymentsLoading = ref(false);
const paymentsList = ref([
  {
    id: "",
    client_info: {
      id: "",
      username: "",
      email: "",
      role: "",
      avatar: "",
    },
    description: "",
    checkoutLink: "",
    type: "",
    created_by_info: {
      id: "",
      username: "",
      email: "",
      role: "",
      avatar: "",
    },
    amount: 0.0,

    status: "",
    created_at: "",
    created_by: "",
    client: null,
  },
]);

const filters = ref("");
const tab = ref("paid");

const columns = {
  description: {
    label: "Description",
    grow: true,
    media: true,
  },
  picture: {
    label: "Created by",
    grow: true,
    media: true,
  },
  amount: {
    label: "Amount",
    align: "center",
  },
  client: {
    label: "Client",
    align: "center",
    grow: true,
  },

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
        item.type.match(filterRe) ||
        item.description.match(filterRe)
      );
    });
  }
});

const getPaymentsList = async () => {
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

const SweetAlertProps = ref({
  title: "",
  subtitle: "test",
  isSweetAlertOpen: false,
  btntext: "text",
});

const openDeleteAlert = (id: any) => {
  selectedPayID.value = id;
  SweetAlertProps.value = {
    title: "Are you sure?",
    subtitle: "You will not be able to recover this Payment again!",
    btntext: "Yes, Delete it",
    isSweetAlertOpen: true,
  };
};

const deletePayment = async () => {
  try {
    loading.value = true;
    const resp = await api.delete(`/api/paypal/${selectedPayID.value}/`);
    SweetAlertProps.value.isSweetAlertOpen = false;
    notyf.success("Payment deleted successfully");
    getPaymentsList();
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
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
  getPaymentsList();
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
      </div>

      <div class="flex-list-v2">
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

                  <VFlexTableCell>
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
                  <VFlexTableCell :column="{ align: 'end' }">
                    <VIconWrap
                      @click="openDeleteAlert(item.id)"
                      color="danger"
                      class="cu-pointer"
                      icon="lucide:trash"
                    />
                  </VFlexTableCell>
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
    <SweetAlert
      v-if="SweetAlertProps.isSweetAlertOpen"
      :isSweetAlertOpen="SweetAlertProps.isSweetAlertOpen"
      :title="SweetAlertProps.title"
      :loading="false"
      :subtitle="SweetAlertProps.subtitle"
      :btntext="SweetAlertProps.btntext"
      :onConfirm="deletePayment"
      :onCancel="() => (SweetAlertProps.isSweetAlertOpen = false)"
    />
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
