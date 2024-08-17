<script setup lang="ts">
type TabId = 'networks' | 'templates'
const activeTab = ref<TabId>('networks')
</script>

<template>
  <div class="navbar-subnavbar-inner tabs-wrapper">
    <div class="tabs-inner">
      <div class="tabs is-centered is-3">
        <ul>
          <li :class="[activeTab === 'networks' && 'is-active']">
            <a
              tabindex="0"
              role="button"
              @keydown.space.prevent="activeTab = 'networks'"
              @click="activeTab = 'networks'"
            >Network</a>
          </li>
        </ul>
      </div>
    </div>

    <div class="container">
      <div
        class="tab-content"
        :class="[activeTab === 'networks' && 'is-active']"
      >
        <div class="tab-content-inner">
          <div class="center has-slimscroll">
            <div class="columns">
              <div class="column is-4">
                <h4 class="column-heading">
                  Team Members
                </h4>
                <ul>
                  <li>
                    <RouterLink to="/navbar/networks/team-members">
                      <i
                        aria-hidden="true"
                        class="lnil lnil-analytics-alt-1"
                      />
                      <span>Team Members</span>
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
                  Business
                </h4>
                <ul>
                  <li>
                    <RouterLink to="/navbar/networks/businesses">
                      <i
                        aria-hidden="true"
                        class="lnil lnil-pie-chart"
                      />
                      <span>Business</span>
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
                  Sites
                </h4>
                <ul>
                  <li>
                    <RouterLink to="/navbar/networks/sites">
                      <i
                        aria-hidden="true"
                        class="lnil lnil-stats-up"
                      />
                      <span>Sites</span>
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
