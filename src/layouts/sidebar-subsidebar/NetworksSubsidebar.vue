<script setup lang="ts">
const openSubsidebarLinks = ref('')
const emit = defineEmits(['close'])
</script>

<template>
  <div class="sidebar-panel is-generic">
    <div class="subpanel-header">
      <ProjectsQuickDropdown />
      <h3 class="no-mb">
        Networks
      </h3>
      <div
        class="panel-close"
        tabindex="0"
        role="button"
        @keydown.space.prevent="emit('close')"
        @click="emit('close')"
      >
        <i
          aria-hidden="true"
          class="iconify"
          data-icon="feather:x"
        />
      </div>
    </div>
    <div
      class="inner"
      data-simplebar
    >
      <ul>
        <li>
          <RouterLink to="/sidebar/networks/dashboard">
            Dashboard
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/sidebar/networks/companies">
            Companies
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/sidebar/networks/industry">
            Industries
          </RouterLink>
        </li>
     
        <li>
          <RouterLink to="/sidebar/networks/businesses">
            Business
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/sidebar/networks/sites">
            Sites
          </RouterLink>
        </li>

      </ul>
    </div>
  </div>
</template>

<style lang="scss">
@import '/@src/scss/layout/sidebar-panel';
</style>
