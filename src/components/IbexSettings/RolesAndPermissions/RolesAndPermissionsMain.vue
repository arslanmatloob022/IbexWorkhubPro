<script lang="ts" setup>
import { ref } from "vue";

const tab = ref("rolesPermissions");
</script>

<template>
  <div class="columns is-multiline">
    <div class="tabs-wrapper">
      <div class="tabs-inner">
        <div class="tabs is-boxed">
          <ul>
            <li
              :class="[tab === 'rolesPermissions' ? 'is-active' : 'not-active']"
            >
              <a
                tabindex="0"
                role="button"
                @keydown.space.prevent="tab = 'rolesPermissions'"
                @click="tab = 'rolesPermissions'"
                ><span>Roles Permissions</span></a
              >
            </li>
            <li
              :class="[tab === 'userPermissions' ? 'is-active' : 'not-active']"
            >
              <a
                tabindex="0"
                role="button"
                @keydown.space.prevent="tab = 'userPermissions'"
                @click="tab = 'userPermissions'"
                ><span>Users Permissions</span></a
              >
            </li>
            <li
              :class="[
                tab === 'modulePermissions' ? 'is-active' : 'not-active',
              ]"
            >
              <a
                tabindex="0"
                role="button"
                @keydown.space.prevent="tab = 'modulePermissions'"
                @click="tab = 'modulePermissions'"
                ><span>Modules & Permissions</span></a
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div v-if="tab === 'rolesPermissions'" class="column is-12">
      <RolesPermissions />
    </div>
    <div v-if="tab === 'userPermissions'" class="column is-12">
      <UsersPermissions />
    </div>
    <div v-if="tab === 'modulePermissions'" class="column is-12">
      <ModuleAndPermissions />
    </div>
  </div>
</template>
