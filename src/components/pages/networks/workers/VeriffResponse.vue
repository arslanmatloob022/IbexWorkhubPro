<script setup lang="ts">
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { CreateActivityLog } from "/@src/composable/useSupportElement";
import "vue3-carousel/dist/carousel.css";
import { Carousel, Navigation, Pagination, Slide } from "vue3-carousel";
import collapse from "/@src/pages/components/collapse.vue";

const route = useRoute();
const notyf = useNotyf();
const api = useApi();
const SweetAlertProps = ref({
  title: "",
  subtitle: "test",
  isSweetAlertOpen: false,
  btntext: "text",
});
const showDetail = ref(false);
const detailIdtoOpen = ref("");

const props = defineProps({
  id: {
    type: String,
    default: 0,
  },
});

const veriffMedia = ref([]);
const veriffResponse = ref([
  {
    id: 11,
    worker: "8107",
    status: "pending",
    link_id: "a20b94b9-cd2a-455d-bb2a-1007cb17ac95",
    veriff_response: null,
    created_at: "2024-03-07T08:55:40.832036Z",
    updated_at: "2024-03-07T08:55:40.832056Z",
  },
]);

const veriffRequestColumns = {
  worker: {
    label: "Last Updated",
    grow: false,
    media: true,
  },

  reference: {
    label: "Status",
  },
  link: {
    label: "Person Name",
  },

  response: {
    label: "Country",
    grow: true,
    media: true,
  },
  created: "Documents",
  updated: "",
} as const;

const faceMedia = ref([]);

const getVeriffRecord = async () => {
  try {
    const response = await api.get(
      `/v3/api/worker/veriff/${props.id}/worker/`,
      {}
    );
    console.log("resopnse data", response.data);
    let apiResponse = response.data;
    apiResponse.forEach((resp: { veriff_media: any[][] }) => {
      resp.frontDoc = resp.veriff_media.filter(
        (item: { context: string | string[] }) =>
          item.context.includes("document-front")
      );
      resp.docBack = resp.veriff_media.filter(
        (item: { context: string | string[] }) =>
          item.context.includes("document-back")
      );
      resp.face = resp.veriff_media.filter(
        (item: { context: string | string[] }) => item.context.includes("face")
      );
      faceMedia.value = resp.face;
      resp.openDetail = false;
    });
    veriffResponse.value = apiResponse;
    console.log("mediaaa", apiResponse);
  } catch (err) {
    console.log(err);
  }
};

const showDetailDiv = (id: any) => {
  showDetail.value = !showDetail.value;
  detailIdtoOpen.value = id;
};

const copyToClipBoard = (value: any) => {
  navigator.clipboard.writeText(value);
  notyf.success("Link copied");
};

const statusColor = {
  Notstarted: "warning",
  declined: "danger",
  approved: "primary",
  pending: "info",
};

onMounted(async () => {
  getVeriffRecord();
});
</script>

<template>
  <div>
    <div class="tab-content is-active">
      <div class="columns mt-1">
        <div class="column is-12" v-if="veriffResponse.length > 0">
          <div class="row">
            <div class="columns is-multiline mb-1" style="padding: 0px 4px">
              <div class="box-cell column is-2">
                <h1 style="color: var(--light-text)">Last Updated</h1>
              </div>
              <div class="box-cell column is-2">
                <h1 style="color: var(--light-text)">Status</h1>
              </div>
              <div class="box-cell column is-2">
                <h1 style="color: var(--light-text)">Person Name</h1>
              </div>
              <div class="box-cell column is-2">
                <h1 style="color: var(--light-text)">Country</h1>
              </div>
              <div class="box-cell column is-2">
                <h1 style="color: var(--light-text)">Documents</h1>
              </div>
              <div class="box-cell column is-2">
                <h1 style="color: var(--light-text)">Detail</h1>
              </div>
            </div>
          </div>
          <div
            v-for="(item, index) in veriffResponse"
            :key="index"
            class="cus-card mb-3"
            style="padding-left: 16px"
          >
            <div class="row">
              <div class="columns is-multiline cu-flex-center">
                <div class="box-cell column is-2">
                  <h3>{{ item.updated_at ? item.updated_at.slice(0, 10) : '-----' }}</h3>
                </div>
                <div class="box-cell column is-2">
                  <VButton
                    :color="statusColor[item.status.replace(' ', '')]"
                    style="width: max-content"
                    light
                    >{{
                      item.status ? item.status.replace(/^\w/, (c) => c.toUpperCase()) : '-- --'
                    }}</VButton
                  >
                </div>
                <div class="box-cell column is-2">
                  <h3>
                    {{
                      item.veriff_response
                        ? item.veriff_response.verification.person.firstName
                        : "Not found"
                    }}
                  </h3>
                </div>
                <div class="box-cell column is-2">
                  <h3>
                    {{
                      item.veriff_response
                        ? item.veriff_response.verification.document.country
                        : "----"
                    }}
                  </h3>
                </div>
                <div class="box-cell column is-2">
                  <h3>
                    {{
                      item.veriff_response
                        ? item.veriff_response.verification.document.type
                        : "----"
                    }}
                  </h3>
                </div>
                <div class="box-cell column is-2">
                  <VButton
                    :color="item.veriff_response ? 'primary' : 'light'"
                    light
                    :disable="item.veriff_response ? false : true"
                    @click="
                      () => {
                        if (item.veriff_response)
                          item.openDetail = !item.openDetail;
                      }
                    "
                    >View
                    <i
                      :class="
                        item.openDetail
                          ? 'lnir lnir-chevron-up ml-2'
                          : 'lnir lnir-chevron-down ml-2'
                      "
                      aria-hidden="true"
                    ></i>
                  </VButton>
                </div>
              </div>

              <div v-if="item.openDetail" clas="detail-info ">
                <div class="row mb-1">
                  <h1 style="font-size:14px" class="light-text ml-4">Response</h1>
                </div>
                <div class="row mb-6">
                  <div class="columns is-multiline">
                    <div class="box-cell column is-1">
                      <div class="is-flex">
                        <img
                          style="
                            width: 60px;
                            margin-left: 14px;
                            margin-top: 8px;
                          "
                          src="/images/Logo.svg"
                        />
                      </div>
                    </div>
                    <div class="box-cell column is-2">
                      <div class="is-flex mt-2">
                        <h1 class="mt-0" style="color: #52c528" >
                          {{
                            item.veriff_response.verification.status ? item.veriff_response.verification.status.replace(
                              /^\w/,
                              (c) => c.toUpperCase()
                            ) : ''
                          }}
                        </h1>
                      </div>
                      <div class="is-flex weighted">
                        {{ item.veriff_response.verification.reason }}
                      </div>
                    </div>
                  </div>
                  <div style="margin-left:14px; border-radius:6px; background-color:var(--primary); padding:2px; width:3%"></div>
                </div>

                <div class="row p-4" style="margin-bottom: 20px">
                  <div class="columns is-multiline">
                    <div class="column is-5 ">
                      <div class="columns is-multiline">
                        <div class="box-cell column is-4">
                          <div>
                            <div class="is-flex mb-1">
                              <div class="light-text">Name:</div>
                            </div>
                            <div class="is-flex mb-2">
                              <span style="font-size:14px">
                                {{
                                  item.veriff_response
                                    ? item.veriff_response.verification.person
                                        .firstName
                                    : "Pending"
                                }}</span
                              >
                            </div>
                          </div>
    
                          <div>
                            <div class="is-flex mb-1">
                              <div class="light-text">Date of birth:</div>
                            </div>
                            <div class="is-flex mb-2">
                              <span style="font-size:14px">
                                {{
                                  item.veriff_response
                                    ? item.veriff_response.verification.person
                                        .dateOfBirth
                                    : "Pending"
                                }}</span
                              >
                            </div>
                          </div>
    
                          <div>
                            <div class="is-flex mb-1">
                              <div class="light-text">Nationality:</div>
                            </div>
                            <div class="is-flex mb-2">
                              <span style="font-size:14px">
                                {{
                                  item.veriff_response &&
                                  item.veriff_response.verification.person
                                    .nationality
                                    ? item.veriff_response.verification.person
                                        .nationality
                                    : "Not found"
                                }}</span
                              >
                            </div>
                          </div>
                          <div>
                            <div class="is-flex mb-1">
                              <div class="light-text">PEP Sanction:</div>
                            </div>
    
                            <div class="is-flex mb-2">
                              <span style="font-size:14px">
                                {{
                                  item.veriff_response &&
                                  item.veriff_response.verification.person
                                    .pepSanctionMatch
                                    ? "Match"
                                    : "No match"
                                }}</span
                              >
                            </div>
                          </div>
                        </div>
    
                        <div class="box-cell column is-4">
                          <div>
                            <div class="is-flex mb-1">
                              <div class="light-text">Type:</div>
                            </div>
                            <div class="is-flex mb-2">
                              <span style="font-size:14px">
                                {{
                                  item.veriff_response
                                    ? item.veriff_response.verification.document
                                        .type
                                    : "Pending"
                                }}</span
                              >
                            </div>
                          </div>
                          <div>
                            <div class="is-flex mb-1">
                              <div class="light-text">Number:</div>
                            </div>
                            <div class="is-flex mb-2">
                              <span style="font-size:14px">
                                {{
                                  item.veriff_response
                                    ? item.veriff_response.verification.document
                                        .number
                                    : "Pending"
                                }}</span
                              >
                            </div>
                          </div>
                          <div>
                            <div class="is-flex mb-1">
                              <div class="light-text">Country:</div>
                            </div>
                            <div class="is-flex mb-2">
                              <span style="font-size:14px">
                                {{
                                  item.veriff_response &&
                                  item.veriff_response.verification.document.country
                                    ? item.veriff_response.verification.document
                                        .country
                                    : "Not found"
                                }}</span
                              >
                            </div>
                          </div>
                          <div>
                            <div class="is-flex mb-1">
                              <div class="light-text">Valid Until:</div>
                            </div>
                            <div class="is-flex mb-2">
                              <span style="font-size:14px">
                                {{
                                  item.veriff_response &&
                                  item.veriff_response.verification.document
                                    .validUntil
                                    ? item.veriff_response.verification.document
                                        .validUntil
                                    : "No match"
                                }}</span
                              >
                            </div>
                          </div>
                        </div>
    
                        <div class="box-cell column is-4">
                          <div>
                            <div class="is-flex mb-1">
                              <div class="light-text">IP:</div>
                            </div>
                            <div class="is-flex mb-2">
                              <span style="font-size:14px">
                                {{
                                  item.veriff_response.technicalData.ip
                                    ? item.veriff_response.technicalData.ip
                                    : "Not found"
                                }}</span
                              >
                            </div>
                          </div>
    
                          <div>
                            <div class="is-flex mb-1">
                              <div class="light-text">Accepted Time:</div>
                            </div>
                            <div class="is-flex mb-2">
                              <span style="font-size:14px">
                                {{
                                  item.veriff_response.verification.acceptanceTime ?  item.veriff_response.verification.acceptanceTime.slice(
                                    0,
                                    10
                                  ) : '-----'
                                }}
                                -
                                {{
                                  item.veriff_response.verification.acceptanceTime ? item.veriff_response.verification.acceptanceTime.slice(
                                    11,
                                    16
                                  ) : '-- -- '
                                }}</span
                              >
                            </div>
                          </div>
                          <div>
                            <div class="is-flex mb-1">
                              <div class="light-text">Decision Time:</div>
                            </div>
                            <div class="is-flex mb-2">
                              <span style="font-size:14px"> 
                                {{
                                   item.veriff_response.verification.decisionTime ? item.veriff_response.verification.decisionTime.slice(
                                    0,
                                    10
                                  ) : '-- ----'
                                }}
                                -
                                {{
                                   item.veriff_response.verification.decisionTime ? item.veriff_response.verification.decisionTime.slice(
                                    11,
                                    16
                                  ) : '-- ----'
                                }}</span
                              >
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="column is-7 ">
                      <div class="columns is-multiline">
                        <div class="column box-cell column is-4">
                          <h1 style="text-align: center">Portrait</h1>
                          <carousel
                            v-if="item.face.length"
                            style="overflow-x: clip"
                            :items-to-show="1"
                          >
                            <slide
                              style="height: 300px; overflow-x: clip"
                              v-for="slide in item.face"
                              :key="slide.id"
                            >
                              <div style="height: 300px">
                                <img style="height: 300px" :src="slide.media" />
                              </div>
                            </slide>
                            <template #addons>
                              <navigation />
                              <pagination />
                            </template>
                          </carousel>
                          <h2 v-else>No image found</h2>
                        </div>
    
                        <div class="box-cell column is-4">
                          <h1 style="text-align: center">Document front</h1>
                          <carousel
                            v-if="item.frontDoc.length"
                            style="overflow-x: clip"
                            :items-to-show="1"
                          >
                            <slide
                              style="height: 300px; overflow-x: clip"
                              v-for="slide in item.frontDoc"
                              :key="slide.id"
                            >
                              <div style="height: 300px">
                                <img style="height: 300px" :src="slide.media" />
                              </div>
                            </slide>
                            <template #addons>
                              <navigation />
                              <pagination />
                            </template>
                          </carousel>
                          <h2 v-else>No image found</h2>
                        </div>
    
                        <div class="box-cell column is-4">
                          <h1 style="text-align: center">Document Back</h1>
                          <carousel
                            v-if="item.docBack.length"
                            style="overflow-x: clip"
                            :items-to-show="1"
                          >
                            <slide
                              style="height: 300px; overflow-x: clip"
                              v-for="slide in item.docBack"
                              :key="slide.id"
                            >
                              <div style="height: 300px">
                                <img style="height: 300px" :src="slide.media" />
                              </div>
                            </slide>
                            <template #addons>
                              <navigation />
                              <pagination />
                            </template>
                          </carousel>
                          <h2 v-else>No image found</h2>
                        </div>
                      </div>
                    </div>

                   


                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style="width: 100%; display: flex; justify-content: center" v-else>
          <VTag class="cus-main-heading" color="info" style="text-align: center"
            >No resquest sent yet !</VTag
          >
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
@import "/@src/scss/abstracts/all";
@import "/@src/scss/components/profile-stats";

.carousel__viewport {
  overflow-x: hidden !important;
  overflow-y: clip !important;
}

.detail-info {
  transition: width 1.5s ease-in-out;
  transition: height 1.5s ease-in-out;
}

.cus-card {
  background-color: #fff;
  border: 1px solid #89898960;
  border-radius: 8px;
  padding: 16px 16px;
  margin-bottom: 12px;
  transition: width 1.5s ease-in-out;
  transition: height 1.5s ease-in-out;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.01);
  }
}

.box-cell {
  display: flex;
  flex-direction: column;
  gap: 14px;

  h1 {
    font-weight: 500;
    font-size: 16px;
    color: #313131;
  }

  h3 {
    font-size: 12px;
    color: #686868;
  }
}

ol > li {
  height: 60px;
}

.cus-del-icon {
  color: #989898;
  transition: all 0.1s ease-in-out;

  &:hover {
    color: var(--danger);
    transform: scale(1.06);
  }
}

.carousel__item {
  min-height: 300px;
  width: 100%;
  background-color: var(--vc-clr-primary);
  color: var(--vc-clr-white);
  font-size: 20px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.carousel__slide {
  padding: 10px;
}

.carousel__prev,
.carousel__next {
  box-sizing: content-box;
  border: 5px solid white;
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
        justify-content: space-between;
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

              > span {
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

              > span {
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

            > .v-avatar {
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
                transform: translate(
                  calc(var(--transform-direction) * -50%),
                  -50%
                );
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

              > span {
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

              > span {
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
</style>
