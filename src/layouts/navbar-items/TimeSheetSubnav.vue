<script setup lang="ts">
type TabId = 'timesheet' | 'templates'
const activeTab = ref<TabId>('timesheet')
</script>

<template>
  <div class="navbar-subnavbar-inner tabs-wrapper">
    <div class="tabs-inner">
      <div class="tabs is-centered is-3">
        <ul>
          <li :class="[activeTab === 'timesheet' && 'is-active']">
            <a
              tabindex="0"
              role="button"
              @keydown.space.prevent="activeTab = 'timesheet'"
              @click="activeTab = 'timesheet'"
            >Timesheet</a>
          </li>
        </ul>
      </div>
    </div>

    <div class="container">
      <div
        class="tab-content"
        :class="[activeTab === 'timesheet' && 'is-active']"
      >
        <div class="tab-content-inner">
          <div class="center has-slimscroll">
            <div class="columns">
              <div class="column is-4">
                <h4 class="column-heading">
                  Timesheet
                </h4>
                <ul>
                  <li>
                    <RouterLink to="/navbar/timesheet/timesheet">
                      <i
                        aria-hidden="true"
                        class="lnil lnil-analytics-alt-1"
                      />
                      <span>Timesheet</span>
                      <i
                        aria-hidden="true"
                        class="iconify"
                        data-icon="feather:circle"
                      />
                    </RouterLink>
                  </li>
                </ul>
              </div>
              <div class="column is-4">
                <h4 class="column-heading">
                  Expenses
                </h4>
                <ul>
                  <li>
                    <RouterLink to="/navbar/timesheet/expenses">
                      <i
                        aria-hidden="true"
                        class="lnil lnil-pie-chart"
                      />
                      <span>Expenses</span>
                      <i
                        aria-hidden="true"
                        class="iconify"
                        data-icon="feather:circle"
                      />
                    </RouterLink>
                  </li>
                </ul>
              </div>
    
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '/@src/scss/abstracts/all';
@import '/@src/scss/layout/navbar';
@import '/@src/scss/layout/responsive';
</style>
