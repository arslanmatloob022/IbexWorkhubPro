<script setup lang="ts">
import { useApi } from "/@src/composable/useAPI";
import {
  changeFavicon,
  convertToFormData,
  formatDate,
} from "/@src/composable/useSupportElement";
// import notyf from "/@src/plugins/notyf";
import { useNotyf } from "/@src/composable/useNotyf";
import { stat } from "node:fs";

const notyf = useNotyf();
const loading = ref(false);
const api = useApi();
const filters = ref("");
const openCostCodeModal = ref(false);
const companyInformation = ref({
  id: "",
  name: "",
  trade_name: "",
  zipCode: null,
  city: "",
  state: null,
  country: null,
  address: null,
  phone_number: null,
  email: null,
  website: null,
  logo: null as File | null | string,
  created_at: "",
  updated_at: "",
  sidebar_logo: "",
  favicon: null as File | null | String,
  invoice_header_logo: null as File | null | string,
  login_page_logo: "",
  branding_line: "",
});

const getCompanyInfoHandler = async () => {
  try {
    loading.value = true;
    const response = await api.get(
      `/api/company-information/9cc43feb-b736-4d18-bd87-5d8511b28dea/`
    );
    companyInformation.value = response.data;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const updateCompanyInfoHandler = async () => {
  try {
    loading.value = true;
    const payload = convertToFormData(companyInformation.value, [
      "logo",
      "favicon",
      "invoice_header_logo",
    ]);
    const response = await api.patch(
      `/api/company-information/9cc43feb-b736-4d18-bd87-5d8511b28dea/`,
      payload
    );
    companyInformation.value = response.data;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const updateCustomCompanyInfoHandler = async (payload: any) => {
  try {
    loading.value = true;
    const response = await api.patch(
      `/api/company-information/9cc43feb-b736-4d18-bd87-5d8511b28dea/`,
      payload
    );
    getCompanyInfoHandler();
    companyInformation.value = response.data;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const onAddLogo = (error: any, fileInfo: any) => {
  if (error) {
    console.error(error);
    return;
  }
  const _file = fileInfo.file as File;
  if (_file) {
    companyInformation.value.logo = _file;
    updateCustomCompanyInfoHandler({ logo: _file });
  }
};

const onRemoveLogo = (error: any, fileInfo: any) => {
  if (error) {
    console.error(error);
    return;
  }
  console.log(fileInfo);
  companyInformation.value.logo = null;
};

const onAddFavicon = (error: any, fileInfo: any) => {
  if (error) {
    console.error(error);
    return;
  }
  const _file = fileInfo.file as File;
  if (_file) {
    companyInformation.value.favicon = _file;
    updateCustomCompanyInfoHandler({ favicon: _file });
    changeFavicon(companyInformation.value.favicon);
  }
};

const onRemoveFavicon = (error: any, fileInfo: any) => {
  if (error) {
    console.error(error);
    return;
  }
  console.log(fileInfo);
  companyInformation.value.favicon = null;
};

const onAddProposalLogo = (error: any, fileInfo: any) => {
  if (error) {
    console.error(error);
    return;
  }
  const _file = fileInfo.file as File;
  if (_file) {
    companyInformation.value.invoice_header_logo = _file;
    updateCustomCompanyInfoHandler({ invoice_header_logo: _file });
  }
};

const onRemoveProposalLogo = (error: any, fileInfo: any) => {
  if (error) {
    console.error(error);
    return;
  }
  console.log(fileInfo);
  companyInformation.value.invoice_header_logo = null;
};

onMounted(() => {
  getCompanyInfoHandler();
});
</script>

<template>
  <div>
    <div class="list-flex-toolbar flex-list-v1">
      <!-- <VField>
        <VControl icon="feather:search">
          <input
            v-model="filters"
            class="input custom-text-filter"
            placeholder="Search..."
          />
        </VControl>
      </VField> -->
      <!-- <VButtons>
        <VButton
          color="primary"
          @click="openCostCodeModal = !openCostCodeModal"
          icon="fas fa-plus"
          raised
          size="small"
          outlined
          elevated
        >
          Edit
        </VButton>
      </VButtons> -->
    </div>

    <div class="page-content-inner">
      <VPlaceholderPage
        v-if="!companyInformation.name"
        title="We couldn't find any matching results."
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

      <div class="columns is-multiline">
        <div class="column is-6">
          <VField>
            <VLabel>Company Name</VLabel>
            <VControl>
              <VInput
                v-model="companyInformation.name"
                type="text"
                placeholder="Company Name"
                @blur="
                  updateCustomCompanyInfoHandler({
                    name: companyInformation.name,
                  })
                "
              />
            </VControl>
          </VField>
        </div>
        <div class="column is-6">
          <VField>
            <VLabel>Trade Name</VLabel>
            <VControl>
              <VInput
                v-model="companyInformation.trade_name"
                type="text"
                placeholder="Trade Name"
                @blur="
                  updateCustomCompanyInfoHandler({
                    trade_name: companyInformation.trade_name,
                  })
                "
              />
            </VControl>
          </VField>
        </div>
        <div class="column is-6">
          <VField>
            <VLabel>Email Address</VLabel>
            <VControl>
              <VInput
                v-model="companyInformation.email"
                type="text"
                placeholder="Company Email"
                @blur="
                  updateCustomCompanyInfoHandler({
                    email: companyInformation.email,
                  })
                "
              />
            </VControl>
          </VField>
        </div>
        <div class="column is-6">
          <VField>
            <VLabel>Phone Number</VLabel>
            <VControl>
              <VInput
                v-model="companyInformation.phone_number"
                type="text"
                placeholder="Phone Number"
                @blur="
                  updateCustomCompanyInfoHandler({
                    phone_number: companyInformation.phone_number,
                  })
                "
              />
            </VControl>
          </VField>
        </div>
        <div class="column is-12">
          <VField>
            <VLabel>Company Website</VLabel>
            <VControl>
              <VInput
                v-model="companyInformation.website"
                type="url"
                placeholder="Website URL"
                @blur="
                  updateCustomCompanyInfoHandler({
                    website: companyInformation.website,
                  })
                "
              />
            </VControl>
          </VField>
        </div>
        <div class="column is-3">
          <VField>
            <VLabel>Zip Code</VLabel>
            <VControl>
              <VInput
                v-model="companyInformation.zipCode"
                type="text"
                placeholder="Zip Code"
                @blur="
                  updateCustomCompanyInfoHandler({
                    zipCode: companyInformation.zipCode,
                  })
                "
              />
            </VControl>
          </VField>
        </div>
        <div class="column is-3">
          <VField>
            <VLabel>City </VLabel>
            <VControl>
              <VInput
                v-model="companyInformation.city"
                type="text"
                placeholder="City"
                @blur="
                  updateCustomCompanyInfoHandler({
                    city: companyInformation.city,
                  })
                "
              />
            </VControl>
          </VField>
        </div>
        <div class="column is-3">
          <VField>
            <VLabel>State</VLabel>
            <VControl>
              <VInput
                v-model="companyInformation.state"
                type="text"
                placeholder="State"
                @blur="
                  updateCustomCompanyInfoHandler({
                    state: companyInformation.state,
                  })
                "
              />
            </VControl>
          </VField>
        </div>
        <div class="column is-3">
          <VField>
            <VLabel>Country</VLabel>
            <VControl>
              <VInput
                v-model="companyInformation.country"
                type="text"
                placeholder="Country"
                @blur="
                  updateCustomCompanyInfoHandler({
                    country: companyInformation.country,
                  })
                "
              />
            </VControl>
          </VField>
        </div>
        <div class="column is-6">
          <VField>
            <VLabel>Complete Address</VLabel>
            <VControl>
              <VInput
                v-model="companyInformation.address"
                type="text"
                placeholder="Address"
                @blur="
                  updateCustomCompanyInfoHandler({
                    address: companyInformation.address,
                  })
                "
              />
            </VControl>
          </VField>
        </div>
        <div class="column is-6">
          <VField>
            <VLabel>Company One Liner</VLabel>
            <VControl>
              <VInput
                v-model="companyInformation.branding_line"
                type="text"
                placeholder="john.doe"
                @blur="
                  updateCustomCompanyInfoHandler({
                    branding_line: companyInformation.branding_line,
                  })
                "
              />
            </VControl>
          </VField>
        </div>
      </div>

      <div class="columns is-multiline">
        <div class="column is-12">
          <h1 class="title is-4">Company Logos</h1>
        </div>
        <div class="column is-4 is-flex">
          <VField label="Sidebar logo">
            <VAvatar
              size="xl"
              :picture="companyInformation.logo"
              color="primary"
              :initials="companyInformation.name.slice(0, 2)"
            />
          </VField>
          <VField class="ml-3" label="Upload new">
            <VControl>
              <VFilePond
                class="profile-filepond"
                name="profile_filepond"
                :chunk-retry-delays="[500, 1000, 3000]"
                label-idle="<i class='lnil lnil-cloud-upload'></i>"
                :accepted-file-types="['image/png', 'image/jpeg', 'image/gif']"
                :image-preview-height="140"
                :image-resize-target-width="140"
                :image-resize-target-height="140"
                image-crop-aspect-ratio="1:1"
                style-panel-layout="compact circle"
                style-load-indicator-position="center bottom"
                style-progress-indicator-position="right bottom"
                style-button-remove-item-position="left bottom"
                style-button-process-item-position="right bottom"
                @addfile="onAddLogo"
                @removefile="onRemoveLogo"
              />
            </VControl>
          </VField>
        </div>

        <div class="column is-4 is-flex">
          <VField label="Proposal Logo">
            <VAvatar
              size="xl"
              :picture="companyInformation.invoice_header_logo"
              color="primary"
              :initials="companyInformation.name.slice(0, 2)"
            />
          </VField>
          <VField class="ml-3" label="Upload new">
            <VControl>
              <VFilePond
                class="profile-filepond"
                name="profile_filepond"
                :chunk-retry-delays="[500, 1000, 3000]"
                label-idle="<i class='lnil lnil-cloud-upload'></i>"
                :accepted-file-types="['image/png', 'image/jpeg', 'image/gif']"
                :image-preview-height="140"
                :image-resize-target-width="140"
                :image-resize-target-height="140"
                image-crop-aspect-ratio="1:1"
                style-panel-layout="compact circle"
                style-load-indicator-position="center bottom"
                style-progress-indicator-position="right bottom"
                style-button-remove-item-position="left bottom"
                style-button-process-item-position="right bottom"
                @addfile="onAddProposalLogo"
                @removefile="onRemoveProposalLogo"
              />
            </VControl>
          </VField>
        </div>

        <div class="column is-4 is-flex">
          <VField label="Favicon">
            <VAvatar
              size="large"
              color="primary"
              :picture="companyInformation.favicon"
              :initials="companyInformation.name.slice(0, 2)"
            />
          </VField>
          <VField class="ml-3" label="Upload new">
            <VControl>
              <VFilePond
                size="tiny"
                class="profile-filepond"
                name="profile_filepond"
                :chunk-retry-delays="[500, 1000, 3000]"
                label-idle="<i class='lnil lnil-cloud-upload'></i>"
                :accepted-file-types="['image/png', 'image/jpeg', 'image/gif']"
                :image-preview-height="80"
                :image-resize-target-width="80"
                :image-resize-target-height="80"
                image-crop-aspect-ratio="1:1"
                style-panel-layout="compact circle"
                style-load-indicator-position="center bottom"
                style-progress-indicator-position="right bottom"
                style-button-remove-item-position="left bottom"
                style-button-process-item-position="right bottom"
                @addfile="onAddFavicon"
                @removefile="onRemoveFavicon"
              />
            </VControl>
          </VField>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.has-top-nav {
  .flex-list-wrapper,
  .list-flex-toolbar {
    width: 100%;
    // margin-inline-end: auto;
    // margin-inline-start: auto;
  }
}

.cost-codes-container {
  width: 100%;
  margin: auto;
}

/* Header styles */
.cost-codes-header {
  width: 100%;
  display: grid;
  grid-template-columns: 2fr 3fr 2fr 1fr;
  background: var(--primary);
  color: white;
  padding: 10px;
  font-weight: bold;
  border-radius: 5px;
}
.col-title {
  :nth-child(2) {
    font-weight: 600;
  }
}

/* List styles */
.cost-codes-list {
  list-style: none;
  padding: 0;
}

.cost-code-item,
.sub-item,
.child-item {
  border-bottom: 1px solid #ddd;
  padding: 10px;
}

.cost-code-row {
  width: 100%;
  display: grid;
  grid-template-columns: 2fr 3fr 2fr 1fr;
  align-items: center;
}

.cost-code-row span {
  padding: 5px 10px;
}

/* Nested lists */
.sub-list,
.child-list {
  list-style: none;
  margin-left: 10px;
  padding-left: 5px;
  border-left: 2px solid #ccc;
}

/* Buttons */
.col-actions {
  display: flex;
  gap: 5px;
}

.edit-btn,
.delete-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 16px;
}

.edit-btn {
  color: #4caf50;
}

.delete-btn {
  color: #f44336;
}
</style>
