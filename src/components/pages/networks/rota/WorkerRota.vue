<script setup lang="ts">

import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { useCompany } from "/@src/stores/company";

const company = useCompany();
const Loading = ref(false);
const notyf = useNotyf();
const api = useApi();

const selectWorkerOptions = ref("");

let selectWorkerSlotOptions = ref<any[]>([]);

// -------Getting All Workers-------->
const getWorkers = async () => {
  try {
    const response = await api.get(
      `/v3/api/worker/${company.loggedCompany.id}/worker-short-info/`
    );

    selectWorkerSlotOptions.value = response.data.map((worker:any) => {
      return {
        value: worker.id.toString(),
        name: `${worker.firstName} ${worker.lastName}`,
        icon: worker.profileImageURL,
      };
    });
    if (response.data) {
        selectWorkerOptions.value = response.data[0].id;
  }
    // selectWorkerOptions.value = props.workerId;
  } catch {
    notyf.error("Invalid data");
  } finally {
    Loading.value = false;
  }
};

const workerId = computed(() => parseInt(selectWorkerOptions.value));

onMounted(() => {
  getWorkers();
});



</script>
<!-- -------------------Template--------------- -->
<template>
    <!-- ----------Company DropDown-------- -->
  <div class="columns mt-5" style="margin-bottom: 3rem">
    <VField v-slot="{ id }" class="pl-2">
      <VControl>
        <Multiselect
          style="width: 280px; height: 55px; border-radius: 1rem"
          v-model="selectWorkerOptions"
          :attrs="{ id }"
          placeholder="Select a Worker"
          label="name"
          :options="selectWorkerSlotOptions"
          :searchable="true"
          track-by="name"
          :height="300"
          class="lg-multiselect"
        >
          <template #singlelabel="{ value }">
            <div class="multiselect-single-label">
              <img
                style="width: 38px; height: 42px; border-radius: .5rem;"
                class="select-label-icon mr-2"
                :src="value.icon?value.icon:'/images/avatars/placeholder.jpg'"
                alt=""
              />
              {{ value.name }}
            </div>
          </template>

          <template #option="{ option }">
            <img
              style="width: 38px; height: 42px; border-radius: .5rem; overflow: hidden;"
              class="select-option-icon mr-2"
              :src="option.icon ? option.icon : '/images/avatars/placeholder.jpg'"
              alt=""
            />
            {{ option.name }}
          </template>
        </Multiselect>
      </VControl>
    </VField>
  </div>
  <!------------End----------->
    <!-- -------------Contracts------------- -->
    <div class="" v-if="selectWorkerOptions">
    <!-- <CompanyContract :customerCompanyId="selectWorkerOptions" /> -->
     <RotaView :workerId="workerId" calendarView="dayGridMonth"  />
  </div>
</template>

<!-- --------------------Style----------------- -->
<style lang="scss" scoped></style>
