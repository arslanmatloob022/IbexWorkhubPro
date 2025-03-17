<route lang="yaml">
meta:
  requiresAuth: true
</route>

<script setup lang="ts">
import { useCompany } from "/@src/stores/company";

const company = useCompany();
const tab = ref("general");
const showModal = ref(false);

const openEditModal = () => {
  showModal.value = true;
};

const closeEditModal = () => {
  showModal.value = false;
};
</script>

<template>
  <div class="container">
    <div class="box cu-property">
      <div class="box-body">
        <!-- <div class="position-relative">
          <div class="position-absolute" style="top: 0px; right: 0px">
            <VButton
              color="primary"
              @click="openEditModal()"
              size="xsmall"
              rounded
              ><i class="fas fa-pen"></i> Edit</VButton
            >
          </div>
        </div> -->
        <div class="columns is-multiline p-5 align-items-center">
          <div class="column is-2 text-align-center">
            <img
              :src="company.currentCompany?.logo"
              style="width: 100px; border-radius: 10px"
              alt=""
              srcset=""
            />
          </div>
          <div class="column is-3">
            <h2 class="title is-5 mb-2">
              {{ company.currentCompany?.name ?? "" }}
            </h2>
            <p class="light-text mb-0 font-500">
              {{ company.currentCompany?.email ?? "" }}
            </p>
            <p class="light-text font-500">
              {{ company.currentCompany?.phone_number ?? "" }}
            </p>
          </div>
          <!-- <div class="column is-1">
            <div class="cu-vr-seperator"></div>
          </div> -->
          <!-- <div class="column is-3">
            <p class="light-text mb-0 font-400">
              <b>State:</b>
              {{
                company.currentCompany?.state
                  ? company.currentCompany?.state
                  : "N/A"
              }}
            </p>
            <p class="light-text mb-0 font-400">
              <b>City:</b>
              {{
                company.currentCompany?.city
                  ? company.currentCompany?.city
                  : "N/A"
              }}
            </p>
            <p class="light-text mb-0 font-400">
              <b>Post Code:</b>
              {{
                company.currentCompany?.zipCode
                  ? company.currentCompany?.zipCode
                  : "N/A"
              }}
            </p>
          </div>
          <div class="column is-1">
            <div class="cu-vr-seperator"></div>
          </div> -->
          <!-- <div class="column is-2">
            <p class="light-text mb-0 font-400">
              <b>Website:</b>
              {{
                company.currentCompany?.website
                  ? company.currentCompany?.website
                  : "N/A"
              }}
            </p>
            <b>Status:</b>
            <VTag color="primary" class="ml-2" rounded>Active</VTag>
          </div> -->
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
              <li :class="[tab === 'units' ? 'is-active' : 'not-active']">
                <a
                  tabindex="0"
                  role="button"
                  @keydown.space.prevent="tab = 'units'"
                  @click="tab = 'units'"
                  ><span>Units</span></a
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
              <li :class="[tab === 'logs' ? 'is-active' : 'not-active']">
                <a
                  tabindex="0"
                  role="button"
                  @keydown.space.prevent="tab = 'logs'"
                  @click="tab = 'logs'"
                  ><span>Action logs</span></a
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div v-if="tab === 'units'">
        <CompanyUnits />
      </div>
      <div v-if="tab === 'general'">
        <CompanyInformation />
      </div>
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

      <div v-if="tab === 'logs'">
        <CompanyActivitylog />
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
