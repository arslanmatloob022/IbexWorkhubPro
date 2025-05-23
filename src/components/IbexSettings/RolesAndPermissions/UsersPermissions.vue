<script setup lang="ts">
const filters = ref("");
const selectedUserId = ref("");
const selectedUserIdHandler = (id: string) => {
  selectedUserId.value = id;
};
</script>

<template>
  <div>
    <div class="columns is-multiline">
      <div class="column is-4">
        <CompanyUsersList @select-module="selectedUserIdHandler" />
      </div>
      <div class="column is-8">
        <ModulePermissionsList :objectId="selectedUserId" type="user" />
      </div>
    </div>
  </div>
</template>

<style lang="scss"></style>
