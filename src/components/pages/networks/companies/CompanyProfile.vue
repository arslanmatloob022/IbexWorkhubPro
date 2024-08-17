<script setup lang="ts">
import { useApi } from '/@src/composable/useAPI'
import { useCompany } from '/@src/stores/company'
import { useNotyf } from "/@src/composable/useNotyf";
const company = useCompany()
const api = useApi();
const notyf = useNotyf()
const route = useRoute()
const sanctionLoading = ref(false)
const tab = ref<'about' | 'docs' | 'partner-doc' | 'workers' | 'setting'>('about');
const id = company.loggedCompany.id;
const EditCompanyModalOpen = ref(false);
const companyData = ref<any>({
});

const activeValue = computed(() => {
  return route.query.tab ? route.query.tab : 'about'
})

const checkWorkerSanctions = async () => {
  try {
    sanctionLoading.value = true;
    const response = await api.post(`/v3/api/worker/sanction/update-workers/`, {
      company: id,
    });
    console.log('sanctions', response)
    sanctionLoading.value = false;
    notyf.success('Worker sanctions list updated successfuly')
  } catch (err) {
    notyf.error(err)
  } finally {
    sanctionLoading.value = false;

  }
}

console.log('active value ' + activeValue.value);

const openEditCompanyModal = () => {
  EditCompanyModalOpen.value = true;
}

const getCompany = async () => {

  company.loadCompany(company.loggedCompany.id)
}

onMounted(() => {


})
</script>

<template>
  <div class="profile-wrapper">
    <div
    :style="{ backgroundImage: `linear-gradient(to right, ${company.loggedCompany.color}50, ${company.loggedCompany.color}30, ${company.loggedCompany.color}10)` }"
    style="padding:20px 10px; display:flex; margin-bottom:12px;height:180px; border-radius:16px; border:1px solid rgba(85, 85, 85, 0.164)">
      <div class="is-flex">
        <img class="m-3" :src="company.loggedCompany.compnayLogo ? company.loggedCompany.compnayLogo : '/images/dummyShareProf/logo-placeholder.png' " alt="logo"
          style="width:120px; height:auto;border-radius:16px;" />
        <div>
          <h3 class="title is-4 is-narrow ml-4 mt-4 mb-4">
            {{ company.loggedCompany.companyName && company.loggedCompany.companyName }}
            <i @click="openEditCompanyModal()" aria-hidden="true" class="lnil lnil-pencil"
              style="cursor: pointer;font-size: 16px;color: var(--primary);" />
          </h3>
          <div style="display:flex; padding-left:10px; margin-left:10px">
            <div class=" mb-1 ml-0 p-0" style="display:flex;flex-direction:column; gap:10px">
              <div class="profile-stat">
                <span class="mr-1"  style="color:var(--primary)">Name: </span>
                <span style="color:var(--light-text)"> {{ company.loggedCompany.companyRegisteredName }} </span>
              </div>
              <div class="profile-stat">
                <span class="mr-1"  style="color:var(--primary)">Email: </span>
                <span style="color:var(--light-text)"> {{ company.loggedCompany.companyEmailAddress }} </span>
              </div>
            </div>

            <div class="mb-1 ml-4 p-0" style="display:flex;flex-direction:column; gap:10px">
              <div class="profile-stat mr-2">
                <span class="mr-1"  style="color:var(--primary)">Status: </span>
                <span style="color:var(--light-text)"> {{ company.loggedCompany.activationStatus ? 'Active' : 'In-Active' }} </span>
              </div>
              <div class="profile-stat mr-3">
                <span class="mr-1"  style="color:var(--primary)">Phone: </span>
                <span style="color:var(--light-text)"> {{ company.loggedCompany.companyPhoneNumber }} </span>
              </div>
            </div>

            <div class="mb-1 ml-4 p-0" style="display:flex; flex-direction:column; gap:10px">
              <div class="profile-stat">
                <span style="color:var(--primary)">Licences: </span>
                <span style="color:var(--light-text)">{{ company.loggedCompany.current_licence }}+ </span> 
              </div>
              <div class="profile-stat">
                <span class="mr-1"  style="color:var(--primary)">Workers: </span>
                <span @click="() => { activeValue = 'workers' }" style="color:var(--light-text)">{{
                  company.loggedCompany.managed_workers
                }}
                  Workers</span>
              </div>
            </div>
              <div class="profile-stat">
                <span style="color:var(--primary)">Check workers Sanctions: </span>
                <VIconButton @click="checkWorkerSanctions"
                  style="padding:2px; width:22px; height:22px; padding-top: 4px;" color="primary" outlined
                  :loading="sanctionLoading" circle icon="fas fa-sync-alt" />
              </div>
          </div>
        </div>
      </div>
    </div>
    <VTabs :selected="activeValue" class="mt-4" type="toggle" :tabs="[
      { label: 'Home', value: 'about', icon: 'lnil lnil-home' },
      { label: 'Worker Compliance', value: 'docs', icon: 'lnil lnil-licencse' },
      {label: 'Partner Compliance', value: 'partner-doc', icon: 'fas fa-users' },
      /* { label: 'Workers', value: 'workers', icon: 'lnil lnil-users' }, */
      { label: 'Controllers', value: 'team-members', icon: 'lnil lnil-users' },
    ]">
      <template #tab="{ activeValue }">
        <div v-if="activeValue === 'about'">
          <div class="profile-body">
            <div class="columns">
              <div class="column is-8">

                <div class="profile-card">
                  <div class="profile-card-section">
                    <div class="columns">
                      <div class="column is-3">
                        <div class="profile-card" style="padding: 10px 0px 0px 0px;    background: #e3ffe3;">
                          <div class="profile-card-section no-padding">
                            <div class="section-title is-block" style="text-align: center;">

                              <h4 style="color: #4e4e4e;font-size: 14px;">20</h4>

                              <h4 class="mt-1" style="color: #4e4e4e;"> Active Team Members</h4>

                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="column is-3">
                        <div class="profile-card" style="padding: 10px 0px 0px 0px;background: #ffe3e3;">
                          <div class="profile-card-section no-padding">
                            <div class="section-title is-block" style="text-align: center;">
                              <h4 style="color: #4e4e4e;font-size: 14px;">10</h4>
                              <h4 class="mt-1" style="color: #4e4e4e;"> Not-active Team Members</h4>

                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="column is-3">
                        <div class="profile-card" style="padding: 10px 0px 0px 0px;background: #6c31a34a;">
                          <div class="profile-card-section no-padding">
                            <div class="section-title is-block" style="text-align: center;">
                              <h4 style="color: #4e4e4e;font-size: 14px;">30</h4>

                              <h4 class="mt-1" style="color: #4e4e4e;">Total Team Members</h4>

                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="column is-3">
                        <div class="profile-card" style="padding: 10px 0px 0px 0px;background: #42d04d78;">
                          <div class="profile-card-section no-padding">
                            <div class="section-title is-block" style="text-align: center;">
                              <h4 style="color: #4e4e4e;font-size: 14px;">100</h4>

                              <h4 class="mt-1" style="color: #4e4e4e;">Total Registered Workers</h4>

                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <CompanyRegisterWorkerChart />
                  </div>


                </div>
              </div>
              <div class="column is-4">
                <!--Tools-->
                <div class="profile-card">
                  <div class="profile-card-section no-padding">
                    <div class="section-title">
                      <h4>Industries</h4>
                    </div>
                    <div class="section-content">
                      <div class="tools-wrapper">
                        <!--Tool-->
                        <div class="tools-item" v-for="item in company.loggedCompany.industry">
                          <VIconWrap v-if="item.id" :picture="item.industryLogo" alt="img">
                            <template #after>
                              <VPeity type="pie" :values="[100, 100]" :fill="['var(--primary)', 'transparent']"
                                :height="50" :inner-radius="22" :width="50" />
                            </template>
                          </VIconWrap>

                          <div class="meta">
                            <span class="dark-inverted">{{ item.name }}</span>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- <div v-if="activeValue === 'suppliers'">
          <CompanySupplier :id="id" />

        </div> -->
        <div v-if="activeValue === 'docs' || route.query.compliance ? 'docs' : ''">
          <CompanyDocuments :id="id" />
        </div>
        <div v-if="activeValue === 'partner-doc' || route.query.compliance ? 'partner-doc' : ''">
          <PertnerCompanyDocuments :id="id" />
        </div>

        <!-- <div v-if="activeValue === 'workers'">
          <WorkersNetwork/>
        </div> -->
        <div v-if="activeValue === 'team-members'">
          <TeamMembaresNetwork />
        </div>

        <!-- <div v-if="activeValue === 'setting'">
          <CompanySettings/>
        </div> -->
      </template>
    </VTabs>

    <!-- Edit Company -->
    <EditCompany v-if="EditCompanyModalOpen" :EditCompanyModalOpen="EditCompanyModalOpen" :id="id"
      @update:handleUpdateEditCompanyModalOpen="(value) => (EditCompanyModalOpen = value)
        " @update:getAllCompanies="getCompany" />


  </div>
</template>

<style lang="scss">
@import '/@src/scss/abstracts/all';
@import '/@src/scss/components/profile-stats';

.is-navbar {
  .profile-wrapper {
    
    margin-top: 30px;
  }
}

.tabs li a .lnil {
  font-size: 14px;
}

.profile-wrapper {
  width:100% !important;
  margin: 0 auto;

  .profile-header {
    text-align: center;

    >img {
      display: block;
      margin: 0 auto;
      max-width: 300px;

    }

    .v-avatar {
      margin: 0 auto 12px;
    }

    .anim-icon {
      margin-bottom: 12px;
    }

    .title {
      margin-bottom: 6px;
    }

    p {
      font-size: 1rem;
      max-width: 540px;
      margin: 0 auto;
      line-height: 1.3;
    }
  }

  .profile-body {
    padding: 10px 0 20px;

    .profile-card {
      @include vuero-s-card;

      padding: 30px;

      &:not(:last-child) {
        margin-bottom: 20px;
      }

      .profile-card-section {
        padding-bottom: 20px;

        &:not(:last-child) {
          margin-bottom: 20px;
          border-bottom: 1px solid var(--fade-grey-dark-4);
        }

        &.no-padding {
          padding-bottom: 0;
        }

        .section-title {
          display: flex;
          align-items: center;
          margin-bottom: 12px;

          h4 {
            font-family: var(--font-alt);
            font-weight: 600;
            font-size: 0.8rem;
            text-transform: uppercase;
            color: var(--dark-text);
            margin-inline-end: 6px;
          }

          i {
            color: var(--primary);
          }

          .action-link {
            position: relative;
            top: -2px;
            margin-inline-start: auto;
            text-transform: uppercase;
            font-size: 0.8rem;
          }

          .control {
            margin-inline-start: auto;

            .form-switch {
              transform: scale(0.8);
            }
          }
        }

        .section-content {
          .description {
            font-size: 0.95rem;
          }

          .experience-wrapper {
            display: flex;
            flex-wrap: wrap;
            margin-inline-start: -8px;
            margin-inline-end: -8px;

            .experience-item {
              display: flex;
              align-items: center;
              width: calc(50% - 16px);
              margin: 8px;

              img {
                display: block;
                width: 50px;
                min-width: 50px;
                height: 50px;
                border-radius: var(--radius-rounded);
                border: 1px solid var(--fade-grey-dark-4);
              }

              .meta {
                margin-inline-start: 10px;

                >span {
                  font-family: var(--font);
                  display: block;

                  &:first-child {
                    font-family: var(--font-alt);
                    font-weight: 600;
                    color: var(--dark-text);
                    font-size: 0.85rem;
                  }

                  &:nth-child(2),
                  &:nth-child(3) {
                    font-size: 0.85rem;
                    color: var(--light-text);

                    i {
                      position: relative;
                      top: -2px;
                      font-size: 4px;
                      margin: 0 6px;
                    }
                  }

                  &:nth-child(3) {
                    color: var(--primary);
                  }

                  span {
                    display: inline-block;
                  }
                }
              }
            }
          }

          .languages-wrapper {
            display: flex;
            flex-wrap: wrap;
            margin-inline-start: -8px;
            margin-inline-end: -8px;

            .languages-item {
              display: flex;
              align-items: center;
              width: calc(50% - 16px);
              margin: 8px;

              .icon-wrap {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 50px;
                min-width: 50px;
                height: 50px;

                img {
                  position: absolute;
                  top: 50%;
                  inset-inline-start: 50%;
                  transform: translate(-50%, -50%);
                  display: block;
                  width: 32px;
                  min-width: 32px;
                  height: 32px;
                  border-radius: var(--radius-rounded);
                  border: 1px solid var(--fade-grey-dark-4);
                }
              }

              .meta {
                margin-inline-start: 10px;

                >span {
                  display: block;
                  font-family: var(--font);

                  &:first-child {
                    font-family: var(--font-alt);
                    font-weight: 600;
                    color: var(--dark-text);
                    font-size: 0.9rem;
                  }

                  &:nth-child(2) {
                    font-size: 0.85rem;
                    color: var(--light-text);
                  }

                  span {
                    display: inline-block;
                  }
                }
              }
            }
          }

          .skills-wrapper {
            .skills-item {
              display: flex;
              align-items: center;

              &:not(:last-child) {
                margin-bottom: 16px;
              }

              .icon-wrap {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 42px;
                min-width: 42px;
                height: 42px;
                border-radius: var(--radius-rounded);
                border: 1px solid var(--primary);

                &.has-icon {
                  background: var(--fade-grey-light-2);
                  border: 1px solid var(--fade-grey-dark-3);
                  color: var(--light-text);

                  i {
                    font-size: 1.4rem;
                  }
                }

                img {
                  display: block;
                  width: 34px;
                  min-width: 34px;
                  height: 34px;
                  border-radius: var(--radius-rounded);
                  border: 1px solid var(--fade-grey-dark-4);
                }

                .count {
                  position: absolute;
                  bottom: 0;
                  inset-inline-end: -4px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  width: 22px;
                  height: 22px;
                  border-radius: var(--radius-rounded);
                  background: var(--white);
                  border: 1px solid var(--primary);

                  span {
                    font-family: var(--font);
                    font-weight: 500;
                    font-size: 0.75rem;
                  }
                }
              }

              .skill-info {
                font-family: var(--font);
                margin-inline-start: 12px;
                line-height: 1.3;

                span {
                  display: block;

                  &:first-child {
                    font-family: var(--font-alt);
                    font-weight: 600;
                    color: var(--dark-text);
                    font-size: 0.9rem;
                  }

                  &:nth-child(2) {
                    font-size: 0.9rem;
                    color: var(--light-text);
                  }
                }
              }

              .people {
                margin-inline-start: auto;
                display: flex;
                justify-content: flex-end;

                .v-avatar {
                  margin: 0 4px;
                }
              }
            }
          }

          .recommendations-wrapper {
            display: flex;
            flex-wrap: wrap;
            margin-inline-start: -8px;
            margin-inline-end: -8px;

            .recommendations-item {
              width: calc(50% - 16px);
              margin: 8px;
              background: var(--fade-grey-light-3);
              text-align: center;
              padding: 30px 20px;
              border-radius: var(--radius);

              >.v-avatar {
                display: block;
                margin: 0 auto 8px;
              }

              h3 {
                font-size: 1rem;
                font-family: var(--font-alt);
                font-weight: 600;
                color: var(--dark-text);
                margin-bottom: 8px;
              }

              p {
                font-size: 0.85rem;
                margin-bottom: 16px;
              }

              .meta {
                span {
                  display: block;

                  &:first-child {
                    font-weight: 600;
                    font-family: var(--font-alt);
                    font-size: 0.95rem;
                    color: var(--primary);
                  }

                  &:nth-child(2) {
                    font-size: 0.9rem;
                    color: var(--light-text);
                  }
                }
              }
            }
          }

          .network-notifications {
            h3 {
              font-family: var(--font-alt);
              font-size: 0.9rem;
              margin-bottom: 6px;
            }

            p {
              font-size: 0.9rem;
              max-width: 480px;
            }
          }

          .tools-wrapper {
            padding-top: 12px;

            .tools-item {
              display: flex;
              align-items: center;
              margin-bottom: 16px;

              &:last-child {
                margin-bottom: 0;
              }

              .icon-wrap {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 50px;
                min-width: 50px;
                height: 50px;

                img {
                  position: absolute;
                  top: 50%;
                  inset-inline-start: 50%;
                  transform: translate(calc(var(--transform-direction) * -50%), -50%);
                  display: block;
                  width: 32px;
                  min-width: 32px;
                  height: 32px;
                  border-radius: var(--radius-rounded);
                  border: 1px solid transparent;
                }
              }

              .meta {
                margin-inline-start: 10px;

                >span {
                  display: block;
                  font-family: var(--font);

                  &:first-child {
                    font-family: var(--font-alt);
                    font-weight: 600;
                    color: var(--dark-text);
                    font-size: 0.9rem;
                  }

                  &:nth-child(2) {
                    font-size: 0.85rem;
                    color: var(--light-text);
                  }

                  span {
                    display: inline-block;
                  }
                }
              }
            }
          }

          .people-wrapper {
            padding-top: 12px;

            .people-item {
              display: flex;
              align-items: center;
              margin-bottom: 16px;

              &:last-child {
                margin-bottom: 0;
              }

              .meta {
                margin-inline-start: 10px;

                >span {
                  display: block;
                  font-family: var(--font);

                  &:first-child {
                    font-family: var(--font-alt);
                    font-weight: 600;
                    color: var(--dark-text);
                    font-size: 0.9rem;
                  }

                  &:nth-child(2) {
                    font-size: 0.85rem;
                    color: var(--light-text);
                  }

                  span {
                    display: inline-block;
                  }
                }
              }
            }
          }

          .more-button {
            padding-top: 16px;

            .button {
              min-width: 180px;
              font-family: var(--font);
              text-transform: uppercase;
              font-size: 0.8rem;
              font-weight: 500;
              margin: 0 auto;
              color: var(--light-text);
            }
          }
        }
      }
    }
  }
}

.is-dark {
  .profile-wrapper {
    .profile-header {
      .v-avatar {
        .badge {
          border-color: var(--dark-sidebar-light-6);
        }
      }
    }

    .profile-body {
      .profile-card {
        @include vuero-card--dark;

        .profile-card-section {
          border-color: var(--dark-sidebar-light-12);

          .section-title {
            h4 {
              color: var(--dark-dark-text);
            }

            i {
              color: var(--primary);
            }
          }

          .section-content {
            .icon-wrap {
              >img {
                border-color: var(--dark-sidebar-light-12) !important;
              }
            }

            .experience-wrapper {
              .experience-item {
                >img {
                  border-color: var(--dark-sidebar-light-12);
                }

                .meta {
                  >span {
                    &:nth-child(3) {
                      color: var(--primary);
                    }
                  }
                }
              }
            }

            .skills-wrapper {
              .skills-item {
                .icon-wrap {
                  border-color: var(--primary) !important;

                  &.has-icon,
                  &.has-img {
                    background: var(--dark-sidebar-light-2) !important;
                    border-color: var(--dark-sidebar-light-12) !important;
                  }
                }

                .people {
                  .v-avatar {
                    &:last-child {
                      .is-fake {
                        background: var(--dark-sidebar-light-2);
                        border: 1px solid var(--dark-sidebar-light-12);
                      }
                    }
                  }
                }
              }
            }

            .recommendations-wrapper {
              .recommendations-item {
                background: var(--dark-sidebar-light-2);
                border-color: var(--dark-sidebar-light-12);

                .meta {
                  span {
                    &:first-child {
                      color: var(--primary);
                    }
                  }
                }
              }
            }

            .more-button {
              .button {
                background: var(--dark-sidebar-light-2);
                border-color: var(--dark-sidebar-light-12);
              }
            }
          }
        }
      }
    }
  }

  .icon-wrap,
  .icon-wrap.is-placeholder {
    background: var(--dark-sidebar-light-2) !important;
    border-color: var(--dark-sidebar-light-12) !important;
  }
}


@media only screen and (width <=767px) {
  .profile-wrapper {
    .profile-body {
      .profile-card {
        padding: 20px;

        .profile-card-section {
          .section-content {

            .experience-wrapper,
            .languages-wrapper,
            .recommendations-wrapper {

              .experience-item,
              .languages-item,
              .recommendations-item {
                width: calc(100% - 16px);
              }
            }

            .skills-wrapper {
              .skills-item {
                .people {
                  .v-avatar {
                    &:not(:last-child) {
                      display: none !important;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>