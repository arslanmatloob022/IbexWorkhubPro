<script setup lang="ts">
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { useCompany } from "/@src/stores/company";
const company = useCompany();
const Loading = ref(false);
const GetLoadinG = ref(false);
const api = useApi();
const notyf = useNotyf();
const modalOpen = ref(false);
const currentSelectedID = ref(0);
const updateLoading = ref(false);
const functionCall = ref(0);
const docStatus = ref(true);
const templateAssignModal = ref(false);
const templateCaptchaText = ref("");
const selectedDivIdtoScroll = ref(0);
const currentTemplate = ref(0);
const CompanyDocModalOpen = ref(false);
const selectedType = ref("");
const currentAssigTempId = ref(0);
const QuestionModalOpen = ref(false);
const selectedQuestionId = ref(0);
const selectedIndustryId = ref(0);
const scrollToIndustry = ref(0);
const selectedTabOfIndustry = ref(0);
const currentSelectedIndustry = ref(0);
const companyDocs = ref([
  {
    id: 0,
    industry_id: "",
    industry_name: "",
    industry_logo: "",
    doc_count: "",
    docs: [
      {
        id: 0,
        documentTitle: "",
        icon: "",
        subTitle: "",
        arezCompany: "",
        industry: "",
        step: "",
        archived: false,
        expiryDateRequired: false,
      },
    ],
    questions: [
      {
        id: 0,
        title: "Fifth Question",
        type: "Input",
        correctAnswer: "",
        questionFor: "partner",
        created_at: "2024-03-19T10:45:58.093663Z",
        arezCompany: 0,
        industry: 0,
      },
    ],
  },
]);

const arrayForDocSeperations = ref([
  {
    id: 1,
    title: "Limited Screening",
    subtitle:
      "Limited screening documents uploads are required during worker signup",
    step: "step_1",
  },
  {
    id: 2,
    title: "Full Screening",
    subtitle:
      "Full screening documents may be uploaded after the worker's successful signup process",
    step: "step_2",
  },
]);

const SweetAlertProps = ref({
  title: "",
  alertIcon: "",
  subtitle: "test",
  isSweetAlertOpen: false,
  btntext: "text",
});

const AddCompanyDoc = ref({
  documentTitle: "",
  icon: null as File | null,
  subTitle: "",
  arezCompany: null as any,
  industry: null as any,
  step: "",
  expiryDateRequired: true,
});

const companyIndustryDocs = ref([
  {
    id: 0,
    title: "",
    created_at: "",
    doc_count: 0,
    industry: {
      id: 0,
      name: "",
      industryLogo: "",
    },
  },
]);

const props = withDefaults(
  defineProps<{
    users?: any[];
    id?: any;
    companyInfo?: any;
  }>(),
  {
    users: () => [],
  }
);

const get_comapny_documents = async () => {
  try {
    QuestionModalOpen.value = false;
    CompanyDocModalOpen.value = false;
    GetLoadinG.value = true;
    const response = await api.get(
      `v3/api/company_document/${props.id}/get_documents_of_a_company/`,
      {}
    );

    QuestionModalOpen.value = false;

    const resultArray = response.data.map((companyDoc: any) => {
      const industry = company.loggedCompany.industry.find(
        (industry: any) => industry.id === companyDoc.industry_id
      );
      return {
        ...companyDoc,
        industry_logo: industry?.industryLogo || null,
        industry_name: industry?.name || companyDoc.industry_name,
        activeTab:
          industry?.id == selectedTabOfIndustry.value
            ? "ques"
            : "docs" || "docs",
        currentSelectedIndustry: industry?.id,
      };
    });
    company.loggedCompany.industry.forEach((industry: any) => {
      if (!response.data.some((doc: any) => doc.industry_id === industry.id)) {
        resultArray.push({
          industry_id: industry.id,
          industry_name: industry.name,
          industry_logo: industry.industryLogo,
          doc_count: 0,
          docs: [],
          activeTab: "docs",
        });
      }
    });

    console.log("result array", company.loggedCompany.industry);

    companyDocs.value = resultArray;
    currentSelectedIndustry.value =
      companyDocs.value.length > 0 ? companyDocs.value[0].industry_id : 0;

    GetLoadinG.value = false;
    setTimeout(() => {
      window.location.hash = selectedDivIdtoScroll.value;
    }, 1000);
  } catch (error) {
    console.error("ok", error);
  }
};

const clearData = () => {
  modalOpen.value = false;
  AddCompanyDoc.value = {
    documentTitle: "",
    icon: null as File | null,
    subTitle: "",
    arezCompany: null as any,
    industry: null as any,
  };
};

const OpenArchiveTempSweetAlert = (id: number, status: boolean) => {
  currentSelectedID.value = id;
  docStatus.value = status;
  console.log("the id " + id);
  functionCall.value = 3;
  SweetAlertProps.value = {
    title: "Archive this document?",
    alertIcon: "lnir lnir-alarm-2",
    subtitle:
      "This document will be archived, and it will be deleted  permanently after 30 days",
    btntext: "Yes, Archive it",
    isSweetAlertOpen: true,
  };
};

const getCompanyIndustryDocs = async () => {
  try {
    const resp = await api.get(
      `/v3/api/compliance/template/get-company-indutries-tmeplates/${props.id}/`
    );
    companyIndustryDocs.value = resp.data;
    console.log(resp.data);
  } catch (err) {
    console.log(err);
  }
};

const commonFunction = () => {
  if (functionCall.value == 1) {
    deleteCompanyDocHandler();
  } else if (functionCall.value == 2) {
    AssignTemToIdustry();
  } else if (functionCall.value == 3) {
    archiveCompanyDoc();
  }
};

const deleteQuestion = async (questionId: any) => {
  try {
    const response = await api.delete(
      `/v3/api/partner/questions/${questionId}/`
    );
    notyf.error("Question deleted successfuly");
    get_comapny_documents();
  } catch (err) {
    console.log(err);
  }
};

const AssignTemToIdustry = async () => {
  try {
    if (templateCaptchaText.value != "Assign This Template") {
      notyf.error("Invalid Captcha Text");
      return;
    }
    updateLoading.value = true;
    SweetAlertProps.value.isSweetAlertOpen = false;
    const resp = await api.post(
      "/v3/api/compliance/template/assign-template-to-company/",
      {
        company: props.id,
        template: currentAssigTempId.value,
      }
    );
    templateAssignModal.value = false;
    notyf.success(resp.data);
    get_comapny_documents();
  } catch (err) {
    notyf.error("Server error while assigning the template");
  } finally {
    updateLoading.value = false;
    templateCaptchaText.value = "";
  }
};

const deleteCompanyDocHandler = async () => {
  try {
    SweetAlertProps.value.isSweetAlertOpen = false;
    const response = await api.delete(
      `/v3/api/company_document/${currentSelectedID.value}/`,
      {}
    );
    get_comapny_documents();
    notyf.dismissAll();
    notyf.success("Delete company document, Company Document");
  } catch (error) {
    console.error("ok", error);
  }
};

const archiveCompanyDoc = async () => {
  try {
    SweetAlertProps.value.isSweetAlertOpen = false;
    const response = await api.patch(
      `/v3/api/company_document/${currentSelectedID.value}/archive-company-document/`,
      {
        archived: docStatus.value,
      }
    );
    get_comapny_documents();
    notyf.warning("Document archived");
  } catch (err) {
    console.log(err);
  }
};

const switchIndustry = (industryId: any) => {
  currentSelectedIndustry.value = 0;
  currentSelectedIndustry.value = industryId;
};

onMounted(() => {
  get_comapny_documents();
  getCompanyIndustryDocs();
});
</script>

<template>
  <VFlex
    jusitfy-content="center"
    align-content="center"
    class="is-block"
    align-items="start"
    column-gap="20px"
    row-gap="20px"
    flex-wrap="wrap"
    styl="just"
  >
    <h1 class="cus-stat-heading mb-3">
      Selecte industry to view related compliance template
    </h1>
    <div class="tabs-inner">
      <div class="tabs is-boxed">
        <ul>
          <li
            v-for="(item, index) in companyDocs"
            :key="index"
            :id="item.industry_id"
            :class="[
              item.industry_id === currentSelectedIndustry
                ? 'is-active'
                : 'not-active',
            ]"
          >
            <a
              tabindex="0"
              role="button"
              @click="switchIndustry(item.industry_id)"
              ><span>{{ item.industry_name }}</span></a
            >
          </li>
        </ul>
      </div>
    </div>
    <VFlexItem
      v-if="companyDocs.length != 0"
      v-for="(item, index) in companyDocs"
      :key="index"
      :id="item.industry_id"
    >
      <div
        v-if="!GetLoadinG && item.industry_id == currentSelectedIndustry"
        style="background-color: transparent; border: none"
        class="list-widget is-straight mt-0 mb-4"
      >
        <div class="widget-head">
          <h3 class="dark-inverted">
            {{ item.industry_name }}
          </h3>
        </div>
        <div class="profile-body">
          <div class="tabs-wrapper is-flex space-between">
            <div class="tabs-inner">
              <div class="tabs">
                <ul>
                  <li
                    :class="[
                      item.activeTab === 'docs' ? 'is-active' : 'not-active',
                    ]"
                  >
                    <a
                      tabindex="0"
                      role="button"
                      @click="
                        () => {
                          item.activeTab = 'docs';
                          selectedTabOfIndustry = 0;
                        }
                      "
                      ><span>Documents ({{ item.doc_count }})</span></a
                    >
                  </li>
                  <li
                    :class="[
                      item.activeTab === 'ques' ? 'is-active' : 'not-active',
                    ]"
                  >
                    <a
                      tabindex="0"
                      role="button"
                      @click="
                        () => {
                          item.activeTab = 'ques';
                          selectedTabOfIndustry = item.industry_id;
                        }
                      "
                      ><span
                        >Questions ({{
                          item.questions ? item.questions.length : 0
                        }})</span
                      ></a
                    >
                  </li>
                </ul>
              </div>
            </div>

            <div class="is-flex cus-align-center">
              <VButton
                v-if="item.activeTab == 'ques'"
                light
                color="primary"
                icon="fas fa-plus"
                @click="
                  () => {
                    selectedType = 'worker';
                    selectedIndustryId = item.industry_id;
                    QuestionModalOpen = true;
                    selectedQuestionId = 0;
                  }
                "
                style="height: 34px; font-size: 12px"
              >
                Question
              </VButton>
              <VButton
                v-if="item.activeTab == 'docs'"
                class="mr-4"
                light
                color="primary"
                icon="fas fa-plus"
                @click="
                  () => {
                    currentSelectedID = 0;
                    currentTemplate = item.industry_id;
                    CompanyDocModalOpen = true;
                    scrollToIndustry = item.industry_id;
                  }
                "
                style="height: 34px; font-size: 12px"
              >
                Document
              </VButton>
              <div
                v-if="item.activeTab == 'docs'"
                style="display: flex; gap: 16px; align-items: center"
              >
                <VDropdown
                  title="Compliance Template"
                  color="primary"
                  right
                  spaced
                >
                  <template #content>
                    <div
                      v-for="tempItem in companyIndustryDocs"
                      :key="tempItem.id"
                    >
                      <a
                        @click="
                          () => {
                            currentAssigTempId = tempItem.id;
                            selectedDivIdtoScroll = item.industry_id;
                            templateAssignModal = true;
                          }
                        "
                        v-if="tempItem.industry.id === item.industry_id"
                        class="dropdown-item is-media"
                      >
                        <img
                          class="item-img"
                          :src="tempItem.industry.industryLogo"
                          alt=""
                        />
                        <div class="meta">
                          <span>{{ tempItem.title }}</span>
                          <span
                            >{{ tempItem.industry.name }}
                            {{
                              -tempItem.doc_count
                                ? `(${tempItem.doc_count})`
                                : ""
                            }}</span
                          >
                        </div>
                      </a>
                    </div>
                  </template>
                </VDropdown>
              </div>
            </div>
          </div>
        </div>
        <div v-if="item.activeTab == 'docs'" class="tab-content is-active">
          <div
            v-for="seperation in arrayForDocSeperations"
            :key="seperation.id"
          >
            <h2 class="cus-stat-heading">({{ seperation.title }})</h2>
            <p class="light-text">{{ seperation.subtitle }}</p>
            <div class="mt-2 mb-2" style="display: flex; flex-wrap: wrap">
              <div v-for="(doc, index) in item.docs" :key="doc.id" class="">
                <VBlock
                  v-if="
                    item.docs[index].archived == false &&
                    item.docs[index].step == seperation.step
                  "
                  center
                  lighter
                  style="
                    background-color: #fff;
                    margin: 10px;
                    border-radius: 8px;
                    padding: 12px;
                    width: 590px;
                    margin-left: 50px;
                    border: 1px solid #89898930;
                  "
                >
                  <template #icon>
                    <VAvatar
                      :picture="doc.icon"
                      :squared="true"
                      style="border-radius: 8px; padding: 2px"
                    />
                  </template>

                  <template #action>
                    <VDropdown icon="feather:more-vertical" spaced right>
                      <template #content>
                        <a
                          role="menuitem"
                          href="#"
                          class="dropdown-item is-media"
                          @click="
                            () => {
                              currentSelectedID = doc.id;
                              CompanyDocModalOpen = true;
                              scrollToIndustry = item.industry_id;
                            }
                          "
                        >
                          <div class="icon">
                            <i
                              class="lnil lnil-message-edit"
                              aria-hidden="true"
                            ></i>
                          </div>
                          <div class="meta">
                            <span>Edit</span>
                            <span>Edit Info</span>
                          </div>
                        </a>

                        <hr class="dropdown-divider" />

                        <a
                          role="menuitem"
                          href="#"
                          class="dropdown-item is-media"
                          @click="OpenArchiveTempSweetAlert(doc.id, true)"
                        >
                          <div class="icon">
                            <i aria-hidden="true" class="lnil lnil-trash" />
                          </div>
                          <div class="meta">
                            <span>Archive</span>
                            <span>Remove from list</span>
                          </div>
                        </a>
                      </template>
                    </VDropdown>
                  </template>

                  <a href="#"></a>
                  <span
                    class="is-flex"
                    style="
                      display: flex;
                      justify-content: space-between;
                      width: 100%;
                    "
                    >{{ doc.documentTitle }}</span
                  >
                  <a
                    class="mt-1"
                    href="#"
                    style="color: var(--light-text); font-size: 12px"
                    >{{ doc.subTitle ? doc.subTitle.slice(0, 190) : "...." }}
                    {{
                      doc.subTitle && doc.subTitle.length > 190 ? "..." : ""
                    }}</a
                  >
                  <div class="cus-align-center mt-2">
                    <a
                      href="#"
                      style="
                        font-size: 12px;
                        color: #333;
                        display: flex;
                        gap: 4px;
                      "
                      >Expiry date:
                      <p style="color: var(--light-text); font-size: 12px">
                        {{
                          doc.expiryDateRequired ? "Required" : " Not required"
                        }}
                      </p>
                    </a>

                    <a
                      href="#"
                      style="
                        font-size: 12px;
                        color: #333;
                        display: flex;
                        gap: 4px;
                      "
                      >Document level:
                      <p style="color: var(--light-text); font-size: 12px">
                        {{ doc.step == "step_1" ? "Mandatory" : "Optional" }}
                      </p>
                    </a>
                  </div>
                </VBlock>
              </div>
            </div>
          </div>

          <hr />
          <h2 class="cus-stat-heading">(Archived)</h2>
          <div style="display: flex; flex-wrap: wrap">
            <div v-for="(doc, index) in item.docs" :key="doc.id" class="">
              <VBlock
                v-if="item.docs[index].archived == true"
                center
                lighter
                style="
                  margin: 10px;
                  border-radius: 8px;
                  padding: 12px;
                  width: 590px;
                  margin-left: 50px;
                  background-color: #fff;
                  border: 1px solid rgba(110, 110, 110, 0.1);
                "
              >
                <template #icon>
                  <VAvatar
                    :picture="doc.icon"
                    :squared="true"
                    style="border-radius: 8px; padding: 2px"
                  />
                </template>

                <template #action>
                  <VDropdown icon="feather:more-vertical" spaced right>
                    <template #content>
                      <a
                        role="menuitem"
                        href="#"
                        class="dropdown-item is-media"
                        @click="OpenArchiveTempSweetAlert(doc.id, false)"
                      >
                        <div class="icon">
                          <i aria-hidden="true" class="lnil lnil-trash" />
                        </div>
                        <div class="meta">
                          <span>Un-Archive</span>
                          <span>Remove from list</span>
                        </div>
                      </a>
                    </template>
                  </VDropdown>
                </template>

                <a href="#"></a>
                <span
                  class="is-flex mb-1"
                  style="
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                  "
                  >{{ doc.documentTitle }}</span
                >
                <a href="#" style="color: var(--light-text); font-size: 12px"
                  >{{ doc.subTitle.slice(0, 190) }}
                  {{ doc.subTitle.length > 190 ? "..." : "" }}</a
                >
                <div class="cus-align-center mt-2">
                  <a
                    href="#"
                    style="
                      font-size: 12px;
                      color: #333;
                      display: flex;
                      gap: 4px;
                    "
                    >Expiry date:
                    <p style="color: var(--light-text); font-size: 12px">
                      {{
                        doc.expiryDateRequired ? "Required" : " Not required"
                      }}
                    </p>
                  </a>

                  <a
                    href="#"
                    style="
                      font-size: 12px;
                      color: #333;
                      display: flex;
                      gap: 4px;
                    "
                    >Document level:
                    <p style="color: var(--light-text); font-size: 12px">
                      {{ doc.step == "step_1" ? "Mandatory" : "Optional" }}
                    </p>
                  </a>
                </div>
              </VBlock>
            </div>
          </div>
          <div v-if="!item.docs.length">
            <p class="">No document added for this industry</p>
          </div>
        </div>
        <div v-if="item.activeTab == 'ques'" class="tab-content is-active">
          <div style="display: flex; flex-wrap: wrap">
            <div
              v-for="(question, index) in item.questions"
              :key="question.id"
              class=""
            >
              <VBlock
                center
                lighter
                style="
                  background-color: #fff;
                  margin: 10px;
                  border-radius: 8px;
                  padding: 12px;
                  width: 400px;
                  margin-left: 50px;
                  border: 2px solid rgba(110, 110, 110, 0.247);
                "
              >
                <template #action>
                  <VDropdown icon="feather:more-vertical" spaced right>
                    <template #content>
                      <a
                        role="menuitem"
                        class="dropdown-item is-media"
                        @click="
                          () => {
                            selectedType = 'worker';
                            selectedQuestionId = question.id;
                            selectedIndustryId = item.industry_id;
                            QuestionModalOpen = true;
                          }
                        "
                      >
                        <div class="icon">
                          <i aria-hidden="true" class="lnil lnil-pencil" />
                        </div>
                        <div class="meta">
                          <span>Edit</span>
                          <span>Edit question</span>
                        </div>
                      </a>
                      <a
                        role="menuitem"
                        href="#"
                        class="dropdown-item is-media"
                        @click="deleteQuestion(question.id)"
                      >
                        <div class="icon">
                          <i aria-hidden="true" class="lnil lnil-trash" />
                        </div>
                        <div class="meta">
                          <span>Delete</span>
                          <span>Delete question</span>
                        </div>
                      </a>
                    </template>
                  </VDropdown>
                </template>

                <a href="#"></a>
                <span
                  class="is-flex"
                  style="
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                  "
                  >{{ question.title.slice(0, 36) }}</span
                >
                <a href="#" style="color: var(--light-text); font-size: 12px">
                  Type: {{ question.type }}
                </a>
                <div v-if="question.correctAnswer" class="is-flex">
                  <span
                    href="#"
                    class="mr-1"
                    style="color: var(--light-text);font-size:12px; is-flex"
                  >
                    Correct Answer:
                  </span>
                  <a
                    style="font-size: 13px"
                    :style="{
                      color:
                        question.correctAnswer == 'true'
                          ? 'var(--primary)'
                          : 'var(--danger)',
                    }"
                    >{{ question.correctAnswer == "true" ? "Yes" : "No" }}</a
                  >
                </div>
                <div v-else>
                  <span
                    href="#"
                    class="mr-1"
                    style="color: var(--light-text);font-size:12px; is-flex"
                  >
                    Correct Answer: ------
                  </span>
                </div>
              </VBlock>
            </div>
          </div>
          <div v-if="!item.docs.length">
            <p class="">No question added for this industry</p>
          </div>
        </div>
      </div>
    </VFlexItem>

    <VFlex
      v-if="GetLoadinG"
      jusitfy-content="center"
      class="is-block"
      align-items="start"
      column-gap="20px"
      row-gap="20px"
      flex-wrap="wrap"
    >
      <div class="list-widget is-straight" v-for="key in [0, 1, 2]" :key="key">
        <div class="widget-head">
          <h3 class="dark-inverted">Industry</h3>
          <VButton
            color="primary"
            icon="fas fa-plus"
            rounded
            style="height: 27px; font-size: 10px"
          >
            Document
          </VButton>
        </div>

        <div v-for="key in 2" :key="key" class="inner-list">
          <div class="tile-grid-item">
            <div class="tile-grid-item-inner placeload-wrap is-flex">
              <VPlaceloadAvatar size="medium" />
              <VPlaceloadText width="80%" last-line-width="60%" class="mx-2" />
            </div>
          </div>
        </div>
      </div>
    </VFlex>
    <VPlaceholderPage
      v-if="companyDocs.length == 0"
      title="No Industry added to this company yet !"
      subtitle="Too bad. Looks like we couldn't find any matching results for the
      search terms you've entered. Please try different search terms or
      criteria."
      larger
    >
      <template #image>
        <img
          class="light-image"
          src="/@src/assets/illustrations/placeholders/search-4.svg"
          alt=""
        />
        <img
          class="dark-image"
          src="/@src/assets/illustrations/placeholders/search-4-dark.svg"
          alt=""
        />
      </template>
    </VPlaceholderPage>
  </VFlex>

  <SweetAlert
    v-if="SweetAlertProps.isSweetAlertOpen"
    :isSweetAlertOpen="SweetAlertProps.isSweetAlertOpen"
    :title="SweetAlertProps.title"
    :subtitle="SweetAlertProps.subtitle"
    :btntext="SweetAlertProps.btntext"
    :alertIcon="SweetAlertProps.alertIcon"
    :onConfirm="commonFunction"
    :onCancel="() => (SweetAlertProps.isSweetAlertOpen = false)"
  />

  <VModal
    :open="templateAssignModal"
    title="Assign Template"
    actions="right"
    @close="templateAssignModal = false"
  >
    <template #content>
      <div class="cus-justify-center">
        <i
          class="lnir lnir-alarm-2 m-4"
          style="font-size: 60px; color: var(--danger)"
        ></i>
        <div class="modal-form columns is-multiline">
          <div class="field column is-12 mb-0">
            <div
              class="content"
              style="
                background-color: #ececec71;
                padding: 6px;
                border-radius: 8px;
              "
            >
              <p style="font-size: 14px">
                <span
                  style="
                    color: var(--danger);
                    font-size: 17px;
                    font-weight: 500;
                  "
                  >Caution:
                </span>

                Introducing a new template document to our industry without
                affecting existing files. This action adds new documents and
                removes all other current ones.
                <br />
              </p>
            </div>
          </div>
          <div class="field column is-12 mb-0">
            <label
              >To assign, type:
              <span style="font-weight: 500">Assign This Template</span>
              below:</label
            >
            <div class="control">
              <input
                type="text"
                name="documentTitle"
                v-model="templateCaptchaText"
                required
                class="input is-primary-focus"
                placeholder="Enter captcha text"
              />
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #cancel>
      <VButton style="display: none" rounded color="light" raised
        >Close</VButton
      >
    </template>
    <template #action>
      <VButton
        type="submit"
        @click="AssignTemToIdustry"
        color="primary"
        :loading="updateLoading"
        raised
        >Assign it
      </VButton>
    </template>
  </VModal>

  <WorkerTemplateDocModal
    v-if="CompanyDocModalOpen"
    :docID="currentSelectedID"
    :industry="currentTemplate"
    :CompanyDocModalOpen="CompanyDocModalOpen"
    @update:modalHandler="
      () => {
        CompanyDocModalOpen = !CompanyDocModalOpen;
      }
    "
    @update:OnSuccess="
      () => {
        get_comapny_documents();
      }
    "
  />
  <TemplateIcons />

  <WorkerQuestion
    v-if="QuestionModalOpen"
    :questionId="selectedQuestionId"
    :type="selectedType"
    :industryID="selectedIndustryId"
    :QuestionModalOpen="QuestionModalOpen"
    @update:modalHandler="
      () => {
        QuestionModalOpen = !QuestionModalOpen;
      }
    "
    @update:OnSuccess="get_comapny_documents"
  />
</template>

<style scoped lang="scss">
@import "/@src/scss/abstracts/all";

.cus-color-div {
  width: 30px;
  border-radius: 4px;
  height: 20px;
  margin: 0px 16px;
}

.tabs-wrapper.is-slider > .tabs-inner > .tabs,
.tabs-wrapper-alt.is-slider {
  max-width: 260px !important;
}

.mandatory {
  background-color: #d92f0d84;
}

.optional {
  background-color: #17d90d98;
}

.list-widget {
  @include vuero-l-card;

  padding: 30px;

  &:not(:last-child) {
    margin-bottom: 1.5rem;
  }

  &.is-straight {
    @include vuero-s-card;
  }

  .widget-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 32px;
    margin-bottom: 10px;

    h3 {
      color: var(--dark-text);
      font-size: 1.1rem;
      font-weight: 500;
    }
  }

  .inner-list {
    padding: 10px 0;

    .inner-list-item {
      + .inner-list-item {
        margin-top: 24px;
      }
    }
  }
}

.is-dark {
  .list-widget {
    @include vuero-card--dark;
  }
}

.list-widget {
  .go-icon {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 36px;
    width: 36px;
    border-radius: var(--radius-rounded);
    background: var(--widget-grey);
    color: var(--light-text);

    &::before {
      content: attr(data-content);
      position: absolute;
      inset-inline-start: -45px;
      font-family: var(--font);
      font-size: 0.95rem;
      font-weight: 500;
    }

    &.is-squared {
      border-radius: 10px;
    }

    &.is-up {
      &::before {
        color: var(--green);
      }
    }

    &.is-down {
      &::before {
        color: var(--red);
      }
    }

    svg {
      height: 16px;
      width: 16px;
      stroke-width: 3px;
    }
  }
}

.is-dark {
  .list-widget {
    .go-icon {
      background: var(--dark-sidebar-light-3);
      border: 1px solid var(--dark-sidebar-light-12);
    }
  }
}
</style>
