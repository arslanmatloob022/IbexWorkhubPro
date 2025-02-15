<route lang="yaml">
meta:
  requiresAuth: true
</route>

<script setup lang="ts">
const tab = ref("general");
const showModal = ref(false);
const proposaltab = ref("proposals");
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
    <div class="m-t-20">
      <div class="tabs-wrapper">
        <div class="tabs-inner">
          <div class="tabs is-boxed">
            <ul>
              <li :class="[tab === 'general' ? 'is-active' : 'not-active']">
                <a
                  tabindex="0"
                  role="button"
                  @keydown.space.prevent="tab = 'general'"
                  @click="tab = 'general'"
                  ><span>General</span></a
                >
              </li>
              <li :class="[tab === 'costCodes' ? 'is-active' : 'not-active']">
                <a
                  tabindex="0"
                  role="button"
                  @keydown.space.prevent="tab = 'costCodes'"
                  @click="tab = 'costCodes'"
                  ><span>Cost Codes</span></a
                >
              </li>
              <!-- <li
                :class="[
                  tab === 'proposalsTemplates' ? 'is-active' : 'not-active',
                ]"
              >
                <a
                  tabindex="0"
                  role="button"
                  @keydown.space.prevent="tab = 'proposalsTemplates'"
                  @click="tab = 'proposalsTemplates'"
                  ><span>Templates/Catalog</span></a
                >
              </li> -->
              <li :class="[tab === 'permissions' ? 'is-active' : 'not-active']">
                <a
                  tabindex="0"
                  role="button"
                  @keydown.space.prevent="tab = 'permissions'"
                  @click="tab = 'permissions'"
                  ><span>Users permissions</span></a
                >
              </li>
              <li
                :class="[tab === 'roleManagement' ? 'is-active' : 'not-active']"
              >
                <a
                  tabindex="0"
                  role="button"
                  @keydown.space.prevent="tab = 'roleManagement'"
                  @click="tab = 'roleManagement'"
                  ><span>Role Management</span></a
                >
              </li>
              <li :class="[tab === 'manageRole' ? 'is-active' : 'not-active']">
                <a
                  tabindex="0"
                  role="button"
                  @keydown.space.prevent="tab = 'manageRole'"
                  @click="tab = 'manageRole'"
                  ><span>Manage Role</span></a
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div v-if="tab === 'general'">General</div>
      <div v-if="tab === 'costCodes'">
        <IdentityList />
      </div>

      <div v-if="tab === 'permissions'">
        <UsersPermissions />
      </div>
      <div v-if="tab === 'roleManagement'">
        <RoleManagement />
      </div>
      <div v-if="tab === 'manageRole'">
        <ManageRole />
      </div>

      <!-- <div class="" v-if="tab === 'proposalsTemplates'">
        <div class="tabs-wrapper">
          <div class="tabs-inner">
            <div class="tabs">
              <ul>
                <li
                  :class="[
                    proposaltab === 'proposals' ? 'is-active' : 'not-active',
                  ]"
                >
                  <a
                    tabindex="0"
                    role="button"
                    @keydown.space.prevent="proposaltab = 'proposals'"
                    @click="proposaltab = 'proposals'"
                    ><span>Templates</span></a
                  >
                </li>
                <li
                  :class="[
                    proposaltab === 'Catalog' ? 'is-active' : 'not-active',
                  ]"
                >
                  <a
                    tabindex="0"
                    role="button"
                    @keydown.space.prevent="proposaltab = 'Catalog'"
                    @click="proposaltab = 'Catalog'"
                    ><span>Catalog</span></a
                  >
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="" v-if="proposaltab === 'proposals'">
          <TemplatePropsalsList />
        </div>
      </div> -->
    </div>
  </div>
</template>

<style scoped lang="scss">
.cu-vr-seperator {
  height: 60px;
  width: 4px;
  border-radius: 10px;
  background-color: #d9e4e7;
}
.cu-property {
  border-radius: 8px;
  background: radial-gradient(#ededed, #ffffff);
}
</style>
