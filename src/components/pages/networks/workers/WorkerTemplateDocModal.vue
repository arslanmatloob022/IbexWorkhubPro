<script setup lang="ts">
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { useElements } from "/@src/stores/supportElements";
import { convertToFormData } from "/@src/composable/useSupportElement";
import { useCompany } from "/@src/stores/company";
const company = useCompany();
const user_action = ref("update");
const isAddMode = ref(true);
const Loading = ref(false);
const elements = useElements();
const notyf = useNotyf();
const api = useApi();
const showCaption = ref(false);

const AddCompanyDoc = ref({
  documentTitle: "",
  icon: null as File | null,
  subTitle: "",
  arezCompany: null as any,
  industry: null as any,
  step: "",
  expiryDateRequired: true,
  icon_url: "",
  template: 0,
});
const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: null): void;
}>();
const props = defineProps<{
  CompanyDocModalOpen?: boolean;
  industry?: number;
  docID?: number;
}>();
const closeModalHandler = () => {
  emit("update:modalHandler", false);
};
const getcompanydocById = async (id: any) => {
  Loading.value = true;
  const response = await api.get(`v3/api/company_document/${id}/`, {});
  AddCompanyDoc.value = response.data;
  console.log(response.data);
  Loading.value = false;
};
const AddCompanydocHandler = async () => {
  try {
    console.log("tempppp", props.industry);
    Loading.value = true;
    AddCompanyDoc.value.icon_url = elements.selectedIcon.url;
    const formDataAPI = convertToFormData(AddCompanyDoc.value, ["icon"]);
    if (props.docID) {
      const response = await api.patch(
        `/v3/api/company_document/${props.docID}/`,
        formDataAPI
      );
    } else {
      formDataAPI.append("industry", props.industry);
      formDataAPI.append("arezCompany", company.loggedCompany.id);
      const response = await api.post(`/v3/api/company_document/`, formDataAPI);
    }

    emit("update:OnSuccess", null);

    Loading.value = false;
  } catch (error) {
    console.error(error);
    notyf.error("error accur ");
  } finally {
    Loading.value = false;
  }
};

const onAddFile = (error: any, fileInfo: any) => {
  const _file = fileInfo.file as File;
  if (_file) {
    console.log(_file);
    AddCompanyDoc.value = { ...AddCompanyDoc.value, icon: _file };
  }
};

const onRemoveFile = (error: any, fileInfo: any) => {
  AddCompanyDoc.value = { ...AddCompanyDoc.value, icon: null };
};

watch(elements, (oldVal, newVal) => {
  if (elements.selectedIcon.url) {
    AddCompanyDoc.value.icon = elements.selectedIcon.url;
    console.log("add company", AddCompanyDoc.value);
    isAddMode.value = false;
  }
});

const toggleCaption = () => {
  showCaption.value = !showCaption.value;
  console.log("calling");
};

onMounted(() => {
  if (props.docID) {
    getcompanydocById(props.docID);
    isAddMode.value = false;
  }
});
</script>

<template>
  <VModal
    is="form"
    :open="props.CompanyDocModalOpen"
    title="Compliance Document"
    actions="right"
    @submit.prevent="AddCompanydocHandler"
    @close="closeModalHandler"
  >
    <template #content>
      <div class="modal-form columns is-multiline cu-all-input">
        <div
          class="field column is-12 mb-0"
          style="display: flex; justify-content: center"
        >
          <VField class="column is-6">
            <div class="field cu-align-center">
              <label class="light-weight" >Icon:</label>
              <a
                class="search-link"
                tabindex="0"
                role="button"
                @click="
                  () => {
                    elements.openTemplateModal();
                  }
                "
              >
                <i
                  style="font-size: 16px; font-weight: 500; margin-top: 5px"
                  aria-hidden="true"
                  class="iconify sidebar-svg"
                  data-icon="feather-plus"
                />
              </a>
            </div>
            <div class="control is-flex is-justify-content-center">
              <VAvatar size="xl" class="profile-v-avatar mt-4">
                <template #avatar>
                  <!-- <img v-if="elements.selectedIcon.url" class="avatar"
                                        :src="elements.selectedIcon.url"
                                        alt="" /> -->
                  <img
                    v-if="!isAddMode"
                    class="avatar"
                    :src="
                      AddCompanyDoc.icon == null
                        ? '/images/avatars/placeholder.jpg'
                        : AddCompanyDoc.icon
                    "
                    alt=""
                  />

                  <VFilePond
                    v-else
                    class="profile-filepond"
                    name="profile_filepond"
                    :chunk-retry-delays="[500, 1000, 3000]"
                    label-idle="<i class='fas fa-cloud-upload-alt' style='font-size:27px'></i>"
                    :accepted-file-types="[
                      'image/png',
                      'image/jpeg',
                      'image/gif',
                    ]"
                    :image-preview-height="140"
                    :image-resize-target-width="140"
                    :image-resize-target-height="140"
                    image-crop-aspect-ratio="1:1"
                    style-panel-layout="compact circle"
                    style-load-indicator-position="center bottom"
                    style-progress-indicator-position="right bottom"
                    style-button-remove-item-position="left bottom"
                    style-button-process-item-position="right bottom"
                    @addfile="onAddFile"
                    @removefile="onRemoveFile"
                  />

                  <span v-if="user_action == 'update'">
                    <VIconButton
                      style="position: absolute; top: 60%; right: -3%"
                      v-if="!isAddMode"
                      icon="feather:edit-2"
                      class="edit-button is-edit"
                      circle
                      tabindex="0"
                      @keydown.space.prevent="isAddMode = true"
                      @click="isAddMode = true"
                    />

                    <VIconButton
                      style="position: absolute; top: 60%; right: -3%"
                      v-else
                      icon="feather:arrow-left"
                      class="edit-button is-back"
                      circle
                      tabindex="0"
                      @keydown.space.prevent="isAddMode = false"
                      @click="isAddMode = false"
                    />
                  </span>
                </template>
              </VAvatar>
            </div>
          </VField>
        </div>
        <div class="field column is-12 mb-0">
          <label class="light-weight" >Document Title: *</label>
          <div class="control">
            <input
              type="text"
              name="documentTitle"
              v-model="AddCompanyDoc.documentTitle"
              required
              class="input is-primary-focus"
              placeholder="Title"
            />
          </div>
        </div>

        <div class="column is-12">
          <div class="columns mb-0">
            <div class="field column is-12 mb-0">
              <label class="light-weight" >Subtitle:</label>
              <VControl>
                <VTextarea
                  style="
                    border-radius: 15px !important;
                    background-color: #f5f5f5 !important;
                    border: none !important;
                    padding: 16px 20px !important;
                  "
                  v-model="AddCompanyDoc.subTitle"
                  class="is-primary-focus"
                  rows="2"
                  placeholder="Description..."
                ></VTextarea>
              </VControl>
            </div>
          </div>
          <!-- <iconify-icon icon="mingcute:question-fill"></iconify-icon> -->
        </div>
        <div class="field column is-12 mb-0">
          <div
            class="field columns space-between cu-align-center"
            style="padding: 12px; border-radius: 8px"
          >
            <div class="field cu-align-center">
              <label class="light-weight">Document level:</label>
              <a
                class="search-link light-text"
                tabindex="0"
                role="button"
                @click="toggleCaption"
              >
                <i
                  style="font-size: 18px; font-weight: 500"
                  class="iconify cu-pointer mt-1 ml-2"
                  data-icon="mingcute:question-fill"
                />
              </a>
            </div>

            <VControl class="mt-2 is-flex" raw subcontrol>
              <VTag
                style="
                  cursor: pointer;
                  margin-right: 22px;
                  color: var(--light-text);
                  border: 1px solid #2aac8e;
                  width: 80px;
                  height: 34px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                "
                label="Mandatory"
                rounded
                :style="{
                  backgroundColor:
                    AddCompanyDoc.step === 'step_1' ? '#2aac8e' : 'white',
                  color: AddCompanyDoc.step === 'step_1' ? 'white' : '',
                }"
                @click="
                  () => {
                    AddCompanyDoc.step = 'step_1';
                  }
                "
              />

              <VTag
                style="
                  cursor: pointer;
                  color: var(--light-text);
                  border: 1px solid #2aac8e;
                  width: 80px;
                  height: 34px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                "
                label="Optional"
                rounded
                :style="{
                  backgroundColor:
                    AddCompanyDoc.step === 'step_2' ? '#2aac8e' : 'white',
                  color: AddCompanyDoc.step === 'step_2' ? 'white' : '',
                }"
                @click="
                  () => {
                    AddCompanyDoc.step = 'step_2';
                  }
                "
              />
            </VControl>
          </div>
        </div>
        <div v-if="!showCaption" class="field column is-12 mb-0">
          <div
            class="field columns space-between cu-align-center"
            style="padding: 12px; border-radius: 8px"
          >
            <label class="light-weight">Expiry Date Required:</label>
            <VControl class="mt-2 is-flex" raw subcontrol>
              <VTag
                style="
                  cursor: pointer;
                  margin-right: 22px;
                  color: var(--light-text);
                  border: 1px solid #2aac8e;
                  width: 80px;
                  height: 34px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                "
                label="No"
                rounded
                :style="{
                  backgroundColor:
                    AddCompanyDoc.expiryDateRequired === false
                      ? '#2aac8e'
                      : 'white',
                  color:
                    AddCompanyDoc.expiryDateRequired === false ? 'white' : '',
                }"
                @click="
                  () => {
                    AddCompanyDoc.expiryDateRequired = false;
                  }
                "
              />

              <VTag
                style="
                  cursor: pointer;
                  color: var(--light-text);
                  border: 1px solid #2aac8e;
                  width: 80px;
                  height: 34px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                "
                label="Yes"
                rounded
                :style="{
                  backgroundColor:
                    AddCompanyDoc.expiryDateRequired === true
                      ? '#2aac8e'
                      : 'white',
                  color:
                    AddCompanyDoc.expiryDateRequired === true ? 'white' : '',
                }"
                @click="
                  () => {
                    AddCompanyDoc.expiryDateRequired = true;
                  }
                "
              />
            </VControl>
          </div>
        </div>
        <div v-if="showCaption" class="field column is-12 mb-0">
          <div
            class="content"
            style="
              background-color: #ececec71;
              padding: 6px;
              border-radius: 8px;
            "
          >
            <p style="font-size: 12px">
              <span
                style="color: var(--primary); font-size: 14px; font-weight: 500"
                >Mandatory:
              </span>
              Mandatory document uploads are required during worker signup.
              <br />
              <span
                style="color: var(--primary); font-size: 14px; font-weight: 500"
                >Optional:
              </span>
              Documents may be uploaded after the worker's successful signup
              process.
            </p>
          </div>
        </div>
      </div>
    </template>
    <template #action>
      <VButton type="submit" color="primary" light :loading="Loading" raised
        >Save</VButton
      >
    </template>
  </VModal>
  <TemplateIcons />
</template>
<style scoped lang="scss"></style>
