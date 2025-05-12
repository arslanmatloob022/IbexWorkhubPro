<script setup lang="ts">
const filters = ref("");
const selectedObjectId = ref("");
const selectedObjectIdHandler = (id: string) => {
  selectedObjectId.value = id;
};
</script>

<template>
  <div>
    <div class="columns is-multiline">
      <div class="column is-4">
        <CompanyUsersList @select-module="selectedObjectIdHandler" />
      </div>
      <div class="column is-8">
        <ModulePermissionsList :objectId="selectedObjectId" />
      </div>
    </div>
  </div>
</template>

<style lang="scss"></style>
