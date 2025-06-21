<route lang="yaml">
meta:
  requiresAuth: true
</route>

<script setup lang="ts">
import { useCompany } from "/@src/stores/company";

const company = useCompany();
const tab = ref("general");
</script>

<template>
  <div class="container">
    <div class="box cu-property">
      <div class="box-body">
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
          <div class="tabs is-toggle">
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
              <li :class="[tab === 'types' ? 'is-active' : 'not-active']">
                <a
                  tabindex="0"
                  role="button"
                  @keydown.space.prevent="tab = 'types'"
                  @click="tab = 'types'"
                  ><span>Cost Types</span></a
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
                  ><span>Permissions & Roles</span></a
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
      <div v-if="tab === 'types'">
        <CompanyCostTypes />
      </div>
      <div v-if="tab === 'general'">
        <CompanyInformation />
      </div>
      <div v-if="tab === 'costCodes'">
        <IdentityList />
      </div>

      <div v-if="tab === 'permissions'">
        <RolesAndPermissionsMain />
      </div>

      <div v-if="tab === 'logs'">
        <CompanyActivitylog />
      </div>
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
  background: radial-gradient(transparent, #20294412) !important;
}
</style>
