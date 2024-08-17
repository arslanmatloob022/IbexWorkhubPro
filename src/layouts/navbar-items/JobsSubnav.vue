<script setup lang="ts">
type TabId = 'jobs' | 'templates'
const activeTab = ref<TabId>('jobs')
</script>

<template>
  <div class="navbar-subnavbar-inner tabs-wrapper">
    <div class="tabs-inner">
      <div class="tabs is-centered is-3">
        <ul>
          <li :class="[activeTab === 'jobs' && 'is-active']">
            <a
              tabindex="0"
              role="button"
              @keydown.space.prevent="activeTab = 'jobs'"
              @click="activeTab = 'jobs'"
            >Jobs</a>
          </li>
        </ul>
      </div>
    </div>

    <div class="container">
      <div
        class="tab-content"
        :class="[activeTab === 'jobs' && 'is-active']"
      >
        <div class="tab-content-inner">
          <div class="center has-slimscroll">
            <div class="columns">
              <div class="column is-4">
                <h4 class="column-heading">
                  Positions
                </h4>
                <ul>
                  <li>
                    <RouterLink to="/navbar/jobs/positions">
                      <i
                        aria-hidden="true"
                        class="lnil lnil-analytics-alt-1"
                      />
                      <span>Positions</span>
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
                  Vacancies
                </h4>
                <ul>
                  <li>
                    <RouterLink to="/navbar/jobs/vacancies">
                      <i
                        aria-hidden="true"
                        class="lnil lnil-pie-chart"
                      />
                      <span>Vacancies</span>
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
                  Placements
                </h4>
                <ul>
                  <li>
                    <RouterLink to="/navbar/jobs/placements">
                      <i
                        aria-hidden="true"
                        class="lnil lnil-stats-up"
                      />
                      <span>Placements</span>
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
