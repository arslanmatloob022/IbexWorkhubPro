<script setup lang="ts">
import axios from "axios";
import { start } from "nprogress";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { useCompany } from "/@src/stores/company";

const company = useCompany();
const Loading = ref(false);
const notyf = useNotyf();
const api = useApi();
const rotaDetail = ref("");
const selectSiteSlotValue = ref("");
let selectSiteSlotOptions = ref<any[]>([]);
const selectCustomerSlotValue = ref("");
let selectSlotOptions = ref<any[]>([]);
const selectWorkerSlotValue = ref("");
let selectWorkerSlotOptions = ref<any[]>([]);

const workers = ref([
  {
    id: 0,
    firstName: "",
    lastName: "",
    profileImageURL: "",
  },
]);

const data = [
  {
    title: "Additional Information",
    content: "Add additional information about rota, rate or worker",
  },
];
const rotaData = ref({
  dates: [],
  id: 0,
  start: "",
  end: "",
  hours: 0,
  shift: "",
  hourlyRate: 0,
  notes: "",
  createdBy: "",
  UpdatedAt: "",
  updatedBy: "",
  company: "",
  site: "",
  worker: "",
  customerCompany: "",
  job: "",
});

const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: null): void;
}>();

const props = defineProps<{
  editRotaModalOpen?: boolean;
  rotaId: {
    type: number;
    default: 0;
  };
}>();

const closeModalHandler = () => {
  emit("update:modalHandler", false);
};

const addRota = async () => {
  Loading.value = true;
  try {
    rotaData.value.shift = "day";
    const response = await api.patch(
      `/v3/api/rota/${props.rotaId}/`,
      rotaData.value
    );
    console.log("rota resopmse", response.data);
    emit("update:OnSuccess", null);
    notyf.success("Rota Added Successfuly");
    Loading.value = false;
    closeModalHandler();
  } catch (err) {
    console.log(err);
    Loading.value = false;
  }
};

const getRotaHandler = async () => {
  try {
    const resp = await api.get(`/v3/api/rota/${props.rotaId}/`);
    rotaData.value = resp.data;
  } catch (err) {
    console.log(err);
  }
};

const getSitesOfCustomer = async (value: any) => {
  try {
    const resp = await api.get(
      `/v3/api/site/customer-company/${value || selectCustomerSlotValue.value}/`
    );
    selectSiteSlotOptions.value = resp.data.map((site: any) => {
      return {
        value: site.id.toString(),
        name: site.name,
      };
    });
  } catch (err) {
    console.log(err);
  }
};
const changeCompany = (value: any) => {
  getSitesOfCustomer(value);
};

watch(selectCustomerSlotValue, (newValue, oldValue) => {
  getSitesOfCustomer(newValue);
});

const getAllCompanies = async () => {
  Loading.value = true;
  const resp = await api.get(
    `/v3/api/customer-company/company/${company.loggedCompany.id}`
  );
  //   Companies
  selectSlotOptions.value = resp.data.map((item) => {
    return {
      value: item.id.toString(),
      name: item.name,
      icon: item.logo ? item.logo : "/default/icon.png",
    };
  });
  if (resp.data) {
    selectCustomerSlotValue.value = resp.data[0].id;
  }
  Loading.value = false;
};

const getWorkers = async () => {
  try {
    const response = await api.get(
      `/v3/api/worker/${company.loggedCompany.id}/worker-short-info/`
    );

    selectWorkerSlotOptions.value = response.data.map((worker) => {
      return {
        value: worker.id.toString(),
        name: `${worker.firstName} ${worker.lastName}`,
        icon: worker.profileImageURL,
      };
    });
    rotaDetail.value = props.workerId;
  } catch {
    notyf.error("Invalid data");
  } finally {
    Loading.value = false;
  }
};

onMounted(() => {
  getRotaHandler();
  getWorkers();
  getAllCompanies();
});
</script>

<template>
  <VModal
    is="form"
    size="xl"
    :open="props.editRotaModalOpen"
    title="Edit Rota"
    actions="right"
    @submit.prevent="addRota"
    @close="closeModalHandler"
  >
    <template #content>
      <div class="modal-form columns is-multiline" id="addRota">
        <div class="field column is-12 mb-0">
          <div class="columns is-multiline mb-3">
            <div class="field column is-6 mb-0">
              <label>Select customer company*</label>
              <VField v-slot="{ id }" class="pl-2">
                <VControl>
                  <Multiselect
                    required
                    v-model="rotaData.customerCompany"
                    :attrs="{ id }"
                    placeholder="Select customer company"
                    label="name"
                    :options="selectSlotOptions"
                    :searchable="true"
                    track-by="name"
                    :height="300"
                    class="lg-multiselect"
                    @input="changeCompany"
                  >
                    <template #singlelabel="{ value }">
                      <div class="multiselect-single-label">
                        <img
                          style="width: 30px"
                          class="select-label-icon mr-2"
                          :src="value.icon"
                          alt=""
                        />
                        {{ value.name }}
                      </div>
                    </template>

                    <template #option="{ option }">
                      <img
                        style="width: 40px; padding-right: 6px"
                        class="select-option-icon mr-2"
                        :src="option.icon"
                        alt=""
                      />
                      {{ option.name }}
                    </template>
                  </Multiselect>
                </VControl>
              </VField>
            </div>
            <div class="field column is-6 mb-0">
              <label>Select Site *</label>
              <VField v-slot="{ id }" class="pl-2">
                <VControl>
                  <Multiselect
                    required
                    v-model="rotaData.site"
                    :attrs="{ id }"
                    placeholder="Select a site"
                    label="name"
                    :options="selectSiteSlotOptions"
                    :searchable="true"
                    track-by="name"
                    :height="400"
                  >
                    <template #singlelabel="{ value }">
                      <div class="multiselect-single-label">
                        {{ value.name }}
                      </div>
                    </template>

                    <template #option="{ option }">
                      {{ option.name }}
                    </template>
                  </Multiselect>
                </VControl>
              </VField>
            </div>
            <div class="field column is-6 mb-0">
              <label class="mb-2">Select Worker *</label>
              <VField v-slot="{ id }" class="">
                <VControl>
                  <Multiselect
                    required
                    v-model="rotaData.worker"
                    :attrs="{ id }"
                    placeholder="Select worker"
                    label="name"
                    :options="selectWorkerSlotOptions"
                    :searchable="true"
                    track-by="name"
                    :height="400"
                  >
                    <template #singlelabel="{ value }">
                      <div class="multiselect-single-label">
                        <img
                          style="width: 24px; height: 24px"
                          class="select-label-icon mr-2"
                          :src="value.icon"
                          alt=""
                        />
                        {{ value.name }}
                      </div>
                    </template>

                    <template #option="{ option }">
                      <img
                        style="width: 30px; padding-right: 6px"
                        class="select-option-icon mr-2"
                        :src="option.icon"
                        alt=""
                      />
                      {{ option.name }}
                    </template>
                  </Multiselect>
                </VControl>
              </VField>
            </div>

            <div class="field column is-3 mb-0">
              <VField>
                <VLabel>Start Time *</VLabel>
                <VControl>
                  <VInput required v-model="rotaData.start" type="time" />
                </VControl>
              </VField>
            </div>

            <div class="field column is-3 mb-0">
              <VField>
                <VLabel>End Time *</VLabel>
                <VControl>
                  <VInput required v-model="rotaData.end" type="time" />
                </VControl>
              </VField>
            </div>
          </div>

          <VCollapse :items="data" with-chevron style="border-radius: 14px">
            <template #collapse-item-head="item">
              <div class="head-info">
                <div class="head-progress"></div>
              </div>
            </template>

            <template #collapse-item-content="item">
              <div class="body-inner-content">
                <div class="field columns is-multiline mb-0">
                  <div class="column is-12">
                    <div class="columns is-multiline space-around">
                      <div class="field column is-5 mb-0">
                        <label>Charge Rate</label>
                        <div class="control">
                          <input
                            type="number"
                            name="rate"
                            v-model="rotaData.hourlyRate"
                            class="input is-primary-focus"
                            placeholder="Rate per hour"
                          />
                        </div>
                      </div>
                      <div class="field column is-5 mb-0">
                        <label>Charge Hours</label>
                        <div class="control">
                          <input
                            type="number"
                            name="rate"
                            v-model="rotaData.hours"
                            class="input is-primary-focus"
                            placeholder="Rate per hour"
                          />
                        </div>
                      </div>
                      <div class="field column is-11 mb-0">
                        <label>Notes</label>
                        <div class="control">
                          <input
                            type="text"
                            name="note"
                            v-model="rotaData.notes"
                            class="input is-primary-focus"
                            placeholder="Enter Note"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </VCollapse>
        </div>
      </div>
    </template>
    <template #action>
      <VButton type="submit" color="primary" :loading="Loading" raised
        >Save</VButton
      >
    </template>
  </VModal>
</template>

<style lang="scss">
#addRota {
  .multiselect-dropdown {
    max-height: 300px !important;
  }
}
</style>
<style scoped lang="scss">
.cus-icon {
  color: var(--primary);
  display: flex;
  width: 20px;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: #ffffff;

  &.active {
    color: #ffffffec;
    background-color: var(--primary);
  }
}

.colorContainer {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  border-radius: 12px;
  padding: 10px 4px;
  padding-top: 40px;
  border: 3px solid var(--primary);

  .colorDiv {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;

    color: #ffffff;
    cursor: pointer;
    width: 22.5%;
    box-sizing: border-box;
    border-radius: 5px;
    margin: 4px;
  }

  .cus-selected {
    height: 40px;
    border: 3px solid var(--primary);
    cursor: pointer;
    width: 22.5%;
    box-sizing: border-box;
    border-radius: 12px;
    margin: 4px;
  }

  .close-btn {
    position: absolute;
    right: 16px;
    top: 10px;

    height: 20px;
    color: var(--primary-light);
    cursor: pointer;
    width: 20px;
  }
}

.color-pellate {
  display: flex;

  i {
    color: var(--primary);
    cursor: pointer;
  }

  .current-color-div {
    height: 36px;
    border: 1px solid #f1f1f1;
    cursor: pointer;
    width: 5rem;
    border-radius: 8px;
  }
}
.current-color-div {
  height: 36px;
  border: 1px solid #f1f1f1;
  cursor: pointer;
  width: 5rem;
  border-radius: 8px;
}
</style>
