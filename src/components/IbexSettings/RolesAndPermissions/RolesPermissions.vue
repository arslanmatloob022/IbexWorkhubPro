<script setup lang="ts">
const filters = ref("");
const selectedRole = ref("");

const selectedRoleHandler = (id: string) => {
  selectedRole.value = id;
};
</script>

<template>
  <div>
    <div class="columns is-multiline">
      <div class="column is-4">
        <RolesList @select-role="selectedRoleHandler" />
      </div>
      <div class="column is-8">
        <ModulePermissionsList :objectId="selectedRole" type="role" />
      </div>
    </div>
  </div>
</template>

<style lang="scss"></style>
