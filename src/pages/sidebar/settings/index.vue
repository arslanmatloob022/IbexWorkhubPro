<route lang="yaml">
meta:
  requiresAuth: true
</route>

<script setup lang="ts">
import { useLayoutSwitcher } from "/@src/stores/layoutSwitcher";
import { useViewWrapper } from "/@src/stores/viewWrapper";

const layoutSwitcher = useLayoutSwitcher();
const viewWrapper = useViewWrapper();
viewWrapper.setPageTitle("Settings");

useHead(() => ({
  title: "Settings",
}));

const showModal = ref(false);
const company = reactive({
  name: "ABC Corp",
  website: "https://example.com",
  phone: "123-456-7890",
  address: {
    street: "123 Main St",
    city: "Evergreen",
    state: "CO",
    zipCode: "80437-0242",
  },
});

const openEditModal = () => {
  showModal.value = true;
};

const closeEditModal = () => {
  showModal.value = false;
};

const updateCompany = (updatedCompany: typeof company) => {
  Object.assign(company, updatedCompany);
  closeEditModal();
};
</script>

<template>
  <div class="container">
    <div class="box cu-property">
      <div class="box-body">
        <div class="position-relative">
          <div class="position-absolute" style="top: 0px; right: 0px">
            <VButton
              color="primary"
              @click="openEditModal()"
              size="xsmall"
              rounded
              ><i class="fas fa-pen"></i> Edit</VButton
            >
          </div>
        </div>
        <div class="columns is-multiline p-5 align-items-center">
          <div class="column is-2 text-align-center">
            <img
              src="/images/homePlaceholder.png"
              style="width: 140px; border-radius: 10px"
              alt=""
              srcset=""
            />
          </div>
          <div class="column is-3">
            <h2 class="title is-5 mb-2">{{ company.name }}</h2>
            <p class="light-text mb-0 font-500">TexhoIbex@gmial.com</p>
            <p class="light-text font-500">{{ company.phone }}</p>
          </div>
          <div class="column is-1">
            <div class="cu-vr-seperator"></div>
          </div>
          <div class="column is-3">
            <p class="light-text mb-0 font-400">
              <b>State:</b>
              {{ company?.address?.state ? company?.address?.state : "N/A" }}
            </p>
            <p class="light-text mb-0 font-400">
              <b>City:</b>
              {{ company?.address?.city ? company?.address?.city : "N/A" }}
            </p>
            <p class="light-text mb-0 font-400">
              <b>PoctCode:</b>
              {{
                company?.address?.zipCode ? company?.address?.zipCode : "N/A"
              }}
            </p>
          </div>
          <div class="column is-1">
            <div class="cu-vr-seperator"></div>
          </div>
          <div class="column is-2">
            <p class="light-text mb-0 font-400">
              <b>Website:</b>
              {{ company?.website ? company?.website : "N/A" }}
            </p>
            <b>Status:</b>
            <VTag color="primary" class="ml-2" rounded>Active</VTag>
          </div>
        </div>
      </div>
    </div>
    <div class="m-t-40">
      <VTabs
        slider
        type="rounded"
        selected="team"
        :tabs="[
          { label: 'Team', value: 'team' },
          { label: 'Projects', value: 'projects' },
          { label: 'Tasks', value: 'tasks' },
        ]"
      >
        <template #tab="{ activeValue }">
          <p v-if="activeValue === 'team'">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quid
            iudicant sensus? Primum quid tu dicis breve? Etiam beatissimum? Ne
            discipulum abducam, times. Quae diligentissime contra Aristonem
            dicuntur a Chryippo. Duo Reges: constructio interrete.
          </p>
          <p v-else-if="activeValue === 'projects'">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quid
            iudicant sensus? Primum quid tu dicis breve? Etiam beatissimum? Ne
            discipulum abducam, times. Quae diligentissime contra Aristonem
            dicuntur a Chryippo. Duo Reges: constructio interrete.
          </p>
          <p v-else-if="activeValue === 'tasks'">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quid
            iudicant sensus? Primum quid tu dicis breve? Etiam beatissimum? Ne
            discipulum abducam, times. Quae diligentissime contra Aristonem
            dicuntur a Chryippo. Duo Reges: constructio interrete.
          </p>
        </template>
      </VTabs>
    </div>
  </div>
  <!-- <EditCompanyModal
    v-if="showModal"
    :company="company"
    :show="showModal"
    @close="closeEditModal"
    @save="updateCompany"
  /> -->
</template>



<style scoped lang="scss">
.cu-vr-seperator {
  height: 60px;
  width: 4px;
  border-radius: 10px;
  background-color: #d9e4e7;
}
.cu-property {
  border-radius: 18px;
  background: radial-gradient(#ededed, #ffffff);
}
</style>

