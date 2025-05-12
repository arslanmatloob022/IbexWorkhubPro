<script setup lang="ts">
const filters = ref("");
const selectedModuleId = ref("");

const selectedModuleIdHandler = (id: string) => {
  selectedModuleId.value = id;
};
</script>

<template>
  <div>
    <div class="columns is-multiline">
      <div class="column is-4">
        <ModulesList @select-module="selectedModuleIdHandler" />
      </div>
      <div class="column is-8">
        <PermissionsList :moduleId="selectedModuleId" />
      </div>
    </div>
  </div>
</template>

<style lang="scss"></style>
