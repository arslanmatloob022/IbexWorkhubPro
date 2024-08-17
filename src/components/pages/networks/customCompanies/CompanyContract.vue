<script setup lang="ts">
import { ref } from "vue";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";

// --------------->
const api = useApi();
const route = useRoute();
const notyf = useNotyf();
const openCustomCompany = ref(false);
const EditContractID = ref<any>("");
const contractLength = ref(0);
const currentSelectedID = ref(0);
const loading = ref(false);

const SweetAlertProps = ref({
  title: "",
  subtitle: "test",
  isSweetAlertOpen: false,
  btntext: "text",
});
const contractId = ref("");
const contractShow = ref(false);
const customerCompanyId = ref("");

const props = defineProps({
  customerCompanyId: String,
  companyLogo: null as File | null,
  companyName: String,
});

export interface ContractData {
  id: string;
  charge_rate: 0;
  total_hours: string;
  start_date: string;
  end_date: string;
  incharge_name: string;
  incharge_phone: string;
  incharge_email: string;
  over_rate: 0;
  description: string;
  color: string;
  company: 0;
  customer_company: 0;
  name: string;
}

const FormData = ref<ContractData[]>([
  {
    id: "",
    charge_rate: 0,
    total_hours: "",
    start_date: "",
    end_date: "",
    incharge_name: "",
    incharge_phone: "",
    incharge_email: "",
    over_rate: 0,
    description: "",
    color: "",
    company: 0,
    customer_company: 0,
    name: "",
  },
]);

// --------Open Custom Large Model----->
const openCustomLargModal = (id: number = 0) => {
  EditContractID.value = id;
  openCustomCompany.value = true;
};

// Get All Contracts
const getContract = async () => {
  loading.value = true;
  contractId.value = "";
  const resp = await api.get(
    `/v3/api/contract/customer-company/${
      props.customerCompanyId || route.params.id
    }/`
  );
  FormData.value = resp.data;
  contractLength.value = resp.data.length;
  loading.value = false;
};

// Delete Contract
const OpenDeleteSweetAlert = (id: number) => {
  currentSelectedID.value = id;
  SweetAlertProps.value = {
    title: "Are you sure?",
    subtitle: "You will not be able to recover this contract!",
    btntext: "Yes, Delete it",
    isSweetAlertOpen: true,
  };
};

const DeleteWorkerHandler = async () => {
  try {
    SweetAlertProps.value.isSweetAlertOpen = false;
    const response = await api.delete(
      `/v3/api/contract/${currentSelectedID.value}/`,
      {}
    );
    getContract();
    notyf.dismissAll();
    notyf.success("Contract Delete");
  } catch (error) {
    console.error("ok", error);
  }
};

watch(props, (oldVal, newVal) => {
  getContract();
});

onMounted(() => {
  getContract();
});
</script>

<!-- Template -->
<template>
  <div class="contract-wrapper" style="margin-top: -1.5rem">
    <!-- -----------------Content Details------------- -->
    <div
      v-if="!contractId"
      style="display: flex; flex-direction: column; gap: 1rem; margin-top: 3rem"
    >
      <div
        class=""
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
        "
      >
        <div class="" style="display: flex; align-items: center; gap: 0.7rem">
          <h3 style="font-size: 1.4rem; font-weight: 500">Contract</h3>
          <span
            style="
              padding: 0.4rem 0.5rem;
              border-radius: 0.8rem;
              background: #000;
              color: #fff;
              font-size: 1.1rem;
            "
            >{{
              contractLength < 10 && contractLength > 0
                ? "0" + contractLength
                : contractLength
            }}</span
          >
        </div>
        <div class="header-right">
          <VButton
            color="primary"
            style="
              border-radius: 1.5rem;
              display: flex;
              align-items: center;
              gap: 0.5rem;
            "
            @click="openCustomLargModal"
          >
            <i class="iconify" data-icon="feather:plus" aria-hidden="true"></i>
            Add New Contract
          </VButton>
        </div>
      </div>
      <!----------Contracts----------->
      <div class="contracts-section1">
        <PlaceloadV3 v-if="loading" />
        <div
          class="contracts-section"
          v-for="(item, index) in FormData"
          :key="item.id"
        >
          <div
            class="contracts-list"
            :style="{
              backgroundImage: `linear-gradient(-175deg, white 60%, ${item.color}30)`,
            }"
          >
            <div
              class=""
              style="
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
              "
            >
              <span
                style="
                  font-size: 1rem;
                  font-weight: 500;
                  display: flex;
                  align-items: center;
                  gap: 0.4rem;
                  color: #111;
                "
              >
                <img
                  :src="
                    props.companyLogo
                      ? props.companyLogo
                      : '/demo/placeholder.jpg'
                  "
                  alt=""
                  style="
                    position: relative;
                    width: 3rem;
                    height: 3rem;
                    border-radius: 50%;
                    border: 2px solid #25b190;
                  "
                />

                {{ props.companyName }}</span
              >
              <VDropdown
                style="position: relative"
                class="is-pushed-mobile"
                icon="feather:more-vertical"
                spaced
                right
              >
                <template #content>
                  <a
                    role="menuitem"
                    href="#"
                    class="dropdown-item is-media"
                    @click="openCustomLargModal(item.id)"
                  >
                    <div class="icon">
                      <i aria-hidden="true" class="lnil lnil-pencil" />
                    </div>
                    <div class="meta">
                      <span>Edit</span>
                      <span>Edit contract details</span>
                    </div>
                  </a>

                  <hr class="dropdown-divider" />

                  <a
                    role="menuitem"
                    href="#"
                    class="dropdown-item is-media"
                    @click="OpenDeleteSweetAlert(item.id)"
                  >
                    <div class="icon">
                      <i aria-hidden="true" class="lnil lnil-trash-can-alt" />
                    </div>
                    <div class="meta">
                      <span>Delete</span>
                      <span>Delete from list</span>
                    </div>
                  </a>
                </template>
              </VDropdown>
            </div>
            <!-- Contract Name -->
            <div
              class=""
              style="
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
              "
            >
              <span
                style="
                  font-size: 1rem;
                  font-weight: 500;
                  display: flex;
                  align-items: center;
                  gap: 0.4rem;
                  color: #444;
                "
              >
                {{ item.name }}</span
              >
            </div>
            <div
              class=""
              style="
                display: flex;
                flex-direction: column;
                gap: 0.8rem;
                color: #444;
              "
              @click="contractId = item.id"
            >
              <div
                class=""
                style="
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                "
              >
                <span
                  class="Genevieve-Hodges-Copy"
                  style="
                    font-size: 13px;
                    margin-top: 0.5rem;
                    font-weight: 400;
                    color: #666;
                  "
                  ><b style="font-weight: 500">Total Hours:</b>
                  {{ item.total_hours }} Hours</span
                >
                <span
                  class="Genevieve-Hodges-Copy"
                  style="
                    font-size: 13px;
                    margin-top: 0.5rem;
                    font-weight: 400;
                    color: #666;
                  "
                  ><b style="font-weight: 500">Total Sites:</b>
                  <span
                    :style="{ backgroundImage: `url('${item.color}')` }"
                    style="
                      margin-left: 0.3rem;
                      padding: 0.3rem 0.6rem;
                      border-radius: 0.6rem;
                      background: #444;
                      color: #fff;
                      font-size: 1rem;
                    "
                    >{{ item.sitesCount }}</span
                  >
                </span>
              </div>
              <div
                class=""
                style="
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                "
              >
                <span
                  class="-Euston-Road-Lond"
                  style="font-size: 13px; font-weight: 400; color: #666"
                  ><b style="font-weight: 500">Change Rate:</b>
                  {{ item.charge_rate }} (£)</span
                >
                <span
                  class="-Euston-Road-Lond"
                  style="font-size: 13px; font-weight: 400; color: #666"
                  ><b style="font-weight: 500">Overtime Rate:</b>
                  {{ item.over_rate }} (£)</span
                >
              </div>
              <div
                style="
                  font-size: 1rem;
                  font-weight: 400;
                  display: flex;
                  align-items: center;
                  gap: 1rem;
                "
              >
                <span
                  ><b style="font-weight: 500; color: #666">From Date:</b>
                  {{ item.start_date }}</span
                >
                <span
                  ><b style="font-weight: 500; color: #666">End Date:</b>
                  {{ item.end_date }}</span
                >
              </div>
            </div>
            <!--  -->
          </div>
        </div>
        <!-- Place Holder -->
        <VPlaceholderPage
          v-if="FormData.length == 0"
          title="No Contract is added for this Business."
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
        <!--  -->
      </div>

      <!-- Delete Supplier-->
      <SweetAlert
        v-if="SweetAlertProps.isSweetAlertOpen"
        :isSweetAlertOpen="SweetAlertProps.isSweetAlertOpen"
        :title="SweetAlertProps.title"
        :subtitle="SweetAlertProps.subtitle"
        :btntext="SweetAlertProps.btntext"
        :onConfirm="DeleteWorkerHandler"
        :onCancel="() => (SweetAlertProps.isSweetAlertOpen = false)"
      />
    </div>
    <!-- -------------------Contract Details-------------- -->
    <div v-if="contractId">
      <div style="margin-top: 0.5rem">
        <ContractDetails
          :contractId="contractId"
          :getContract="getContract"
          :colors="FormData.color"
          :customerCompanyId="customerCompanyId"
        />
      </div>
    </div>

    <!-- Edit Company Model (ContractModal) -->

    <ContractModal
      v-if="openCustomCompany"
      :id="EditContractID"
      :customerCompanyId="props.customerCompanyId"
      :openCustomCompany="openCustomCompany"
      @update:modalHandler="(value: boolean) => (openCustomCompany = value)"
      @update:OnSuccess="getContract"
    ></ContractModal>
  </div>
</template>

<!-- Styling -->
<style lang="scss" scoped>
.contract-wrapper {
  width: 100%;
}
.contract-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.contracts-section1 {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding-bottom: 4rem;
}
.contracts-section {
  grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
  grid-gap: 1.5rem;
  margin-top: 1rem;
}
.contracts-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  border-radius: 1rem;
  background: #fff;
  padding: 1.5rem 1rem;
  box-shadow: 0.1rem 0.1rem 0.1rem rgba(0, 0, 0, 0.1);
  transition: 0.2s ease-in-out;
  max-width: 27rem;
  min-width: 22rem;
  border: 1px solid #eee;
  cursor: pointer;
}
.contracts-list:hover {
  box-shadow: 0.2rem 0.2rem 0.2rem rgba(0, 0, 0, 0.3);
  transform: scale(1.01);
}
.contracts-list:active {
  box-shadow: 0.1rem 0.1rem 0.1rem rgba(0, 0, 0, 0.1);
  transform: scale(1);
}
.contract-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.1rem;
  border-radius: 0.5rem;
  background: #ccc;
  cursor: pointer;
}
</style>
