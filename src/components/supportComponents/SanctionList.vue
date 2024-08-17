<script setup lang="ts">
import { useApi } from "/@src/composable/useAPI";
const api = useApi();
const sanctionsDetailView = ref(true)
const loading = ref(false);
const sanctionDetail = ref({
  id: 0,
  last_updated: "",
  date_designated: "",
  unique_id: "",
  ofsi_group_id: 0,
  un_reference_number: "",
  regime_name: "",
  individual_entity_ship: "",
  designation_source: "",
  sanctions_imposed: "",
  other_information: "",
  names: [

  ],
  addresses: [
  ]

});

const props = defineProps<{
  openSanctionModal?: boolean;
  firstName: {
    type: String;
    default: '';
  };
  lastName: {
    type: String;
    default: '';
  }
}>();

const emit = defineEmits<{
  (e: "update:openSanctionModal", value: boolean): void;
}>();
const closeModalHandler = () => {
  emit("update:openSanctionModal", false);
};

const getSanctionDetail = async () => {
  try {
    loading.value = true;
    const resp = await api.get(`/v3/api/worker/sanction/detail-through-name/${props.firstName} ${props.lastName}/`);
    sanctionDetail.value = resp.data.sanction;
    sanctionsDetailView.value = true;
    loading.value = false;
  } catch (err) {
    console.log(err)
  }
}

onMounted(async () => {
  await getSanctionDetail()
})

</script>
<template>

  <VModal is="form" :open="sanctionsDetailView" title="Sanctions Detail" size="big" actions="right"
    @close="closeModalHandler">
    <template #content>
      <div class="form-layout is-separate">
        <div class="form-outer">
          <div class="form-body">
            <div class="form-section p-4">
              <!-- <div class="form-section-inner"> -->
              <div class="columns is-multiline">
                <div class="column is-12 is-flex">
                  <img style="width:auto; height:40px" src="/images/logos/favicon_512x512.png" />
                  <div>
                    <h3 style="font-size:20px; color:var(--primary)" class="cus-stat-heading ml-4 mt-0">Arez</h3>
                    <h3 style="font-size:12px;" class="cus-stat-heading ml-4 mt-0">The Compliance Manager</h3>
                  </div>
                </div>
                <div class="column is-6">
                  <!-- <h3 class="">Reference Number</h3> -->
                </div>
              </div>
              <!-- </div> -->
            </div>
          </div>
        </div>
      </div>
      <div class="columns is-multiline px-5">
        <div v-if="!loading" class="column is-6 is-flex">
          <h1 class="is-bold">Unique ID: </h1>
          <p class="is-bold ml-2"> {{ sanctionDetail.unique_id }}</p>
        </div>
        <div v-if="loading" class="column is-6 is-flex">
          <VPlaceload height="20px" width="40%" class="mx-2" />
          <VPlaceload height="20px" width="40%" class="mx-2 ml-2" />
        </div>
        <div v-if="!loading" class="column is-6 is-flex">
          <h1 class="is-bold">Designated At: </h1>
          <p class="is-bold ml-2"> {{ sanctionDetail.date_designated ? sanctionDetail.date_designated.slice(0, 10) :
    'Not mentioned' }}</p>
        </div>
        <div v-if="loading" class="column is-6 is-flex">
          <VPlaceload height="20px" width="40%" class="mx-2" />
          <VPlaceload height="20px" width="40%" class="mx-2 ml-2" />
        </div>
        <div v-if="!loading" class="column is-6 is-flex">
          <h1 class="is-bold">Updated At: </h1>
          <p class="is-bold ml-2"> {{ sanctionDetail.last_updated }}</p>
        </div>
        <div v-if="loading" class="column is-6 is-flex">
          <VPlaceload height="20px" width="40%" class="mx-2" />
          <VPlaceload height="20px" width="40%" class="mx-2 ml-2" />
        </div>
        <div v-if="!loading" class="column is-6 is-flex">
          <h1 class="is-bold">UN Reference Number:</h1>
          <p class="is-bold ml-2">{{ sanctionDetail.un_reference_number }}</p>
        </div>
        <div v-if="loading" class="column is-6 is-flex">
          <VPlaceload height="20px" width="40%" class="mx-2" />
          <VPlaceload height="20px" width="40%" class="mx-2 ml-2" />
        </div>
        <div class="column is-12 is-flex">
          <h1 class="is-bold">Regime Name:</h1>
          <p class="is-bold ml-2">{{ sanctionDetail.regime_name }}</p>
        </div>
        <div v-if="loading" class="column is-12 is-flex">
          <VPlaceload height="20px" width="20%" class="mx-2" />
          <VPlaceload height="20px" width="70%" class="mx-2 ml-2" />
        </div>
        <div v-if="!loading" class="column is-6 is-flex">
          <h1 class="is-bold">Individual Entity Ship:</h1>
          <p class="is-bold ml-2">{{ sanctionDetail.individual_entity_ship }}</p>
        </div>
        <div v-if="loading" class="column is-6 is-flex">
          <VPlaceload height="20px" width="40%" class="mx-2" />
          <VPlaceload height="20px" width="40%" class="mx-2 ml-2" />
        </div>
        <div class="column is-6 is-flex">
          <h1 class="is-bold">Designated source:</h1>
          <p class="is-bold ml-2">{{ sanctionDetail.designation_source }}</p>
        </div>
        <div v-if="loading" class="column is-6 is-flex">
          <VPlaceload height="20px" width="40%" class="mx-2" />
          <VPlaceload height="20px" width="40%" class="mx-2 ml-2" />
        </div>
        <div class="column is-12 is-flex">
          <h1 class="is-bold">Sanctions imposed:</h1>
          <p class="is-bold ml-2">{{ sanctionDetail.sanctions_imposed }}</p>
        </div>
        <div v-if="loading" class="column is-6 is-flex">
          <VPlaceload height="20px" width="20%" class="mx-2" />
          <VPlaceload height="20px" width="70%" class="mx-2 ml-2" />
        </div>
        <div v-if="!loading" class="column is-12">
          <h1 class="is-bold">Names:</h1>
          <div class="is-flex" style="flex-wrap:wrap">
            <div v-for="name in sanctionDetail.names" :key="name">
              <p class="is-bold" style="white-space:nowrap">{{ name }} ,</p>
            </div>
          </div>
        </div>
        <div v-if="loading" class="column is-12 is-flex">
          <VPlaceloadText
          :lines="2"
          width="90%"
          last-line-width="25%"
        />
        </div>
        <div v-if="!loading" class="column is-12">
          <h1 class="is-bold">Addresses:</h1>
          <p v-for="address in sanctionDetail.addresses" :key="address" class="is-bold">{{ address }},</p>
        </div>
        <div v-if="loading" class="column is-12 is-flex">
          <VPlaceloadText
    :lines="2"
    width="90%"
    last-line-width="50%"
  />
        </div>
        <div v-if="!loading" class="column is-12">
          <h1 class="is-bold">Other information:</h1>
          <p class="is-bold">{{ sanctionDetail.other_information }}</p>
        </div>
        <div v-if="loading" class="column is-12 is-flex">
          <VPlaceloadText
    :lines="4"
    width="75%"
    last-line-width="25%"
  />
        </div>
      </div>
    </template>
    <template #cancel>
      <VButton type="submit" style="display: none" color="primary" raised>Close</VButton>
    </template>
  </VModal>

</template>
<style lang="scss"></style>