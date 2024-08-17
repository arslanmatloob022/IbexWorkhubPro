<script setup lang="ts">
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { useCompany } from "/@src/stores/company";
const notyf = useNotyf();
const api = useApi();
const company = useCompany();
const selectedIndustries = ref([]);
const loading = ref(false);
const tab = ref<"company info" | "admin">("company info");
const companyId = ref("");
const showPassword = ref(false);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
const FormData = ref({
  companyName: "",
  industry: "",
  siteURL: "",
  businessAddress: "",
  postCode: "",
  country: "",
  state: "",
  yearBusinessStarted: "",
  companyPhoneNumber: "",
  billingAddress: "",
  companyEmailAddress: "",
  companyRegistrationNumber: "",
  companyRegisteredName: "",
  billingPhoneNumber: "",
  BillingEmailAddress: "",
  dailyEmailLimit: 0,
  dailySMSLimit: 0,
  noOfLicence: 0,
  compnayLogo: null as File | null,
  noOfWorkers: 0,
});
const adminData = ref({
  id: "",
  first_name: "",
  last_name: "",
  email: "",
  role: "Admin",
  jobPosition: "Administrator",
  mobileNo: "",
  phoneNo: "",
  password: "",
  department: "Management",
  company: "",
  is_active: false,
});
const emit = defineEmits<{
  (e: "update:handleUpdateAddCompanyModalOpen", value: boolean): void;
  (e: "update:getAllCompanies", value: null): void;
}>();
const props = defineProps<{
  AddCompanyModalOpen?: boolean;
}>();
const addCompanyHandler = async () => {
  try {
    if (tab.value === "admin") {
      addMemberHandler();
      return;
    }
    loading.value = true;
    FormData.value = {
      ...FormData.value,
      industry: selectedIndustries.value.map((item) => item),
    };
    const formDataAPI = new window.FormData();

    for (const key in FormData.value) {
      if (key != "compnayLogo" || FormData.value.compnayLogo != null) {
        if (key === "industry" && Array.isArray(FormData.value[key])) {
          FormData.value[key].forEach((industryId, index) => {
            formDataAPI.append(`industry`, industryId);
          });
        } else {
          formDataAPI.append(key, FormData.value[key]);
        }
      }
    }

    const response = await api.post("/v3/api/company/", formDataAPI);
    companyId.value = response.data.id;
    tab.value = "admin";
    notyf.dismissAll();
    notyf.success("New company added, New Company");
  } catch (error: any) {
    let errorObj = error.response.data ?? {};
    Object.values(errorObj).forEach((values) => {
      values.forEach((value) => {
        console.log(value);
        notyf.error(` ${value}, New Company`);
      });
    });
  } finally {
    loading.value = false;
  }
};

const addMemberHandler = async () => {
  try {
    loading.value = true;
    adminData.value = {
      ...adminData.value,
      role: "admin",
      is_active: true,
      company: companyId.value,
    };

    const formDataAPI = new window.FormData();
    for (const key in adminData.value) {
      formDataAPI.append(key, adminData.value[key]);
    }
    if (adminData.value.password.length < 6) {
      notyf.error("Password must be greater than 6 digits");
    }
    const response = await api.post("/v3/api/account/user/", formDataAPI);
    closeModalHandler();
    notyf.dismissAll();
    notyf.success("New member added, New Member");
  } catch (error: any) {
    let errorObj = error.response.data ?? {};
    Object.values(errorObj).forEach((values) => {
      values.forEach((value) => {
        console.log(value);
        notyf.error(` ${value}, New Member`);
      });
    });
  } finally {
    loading.value = false;
  }
};

const inputChangeHandler = (event: any) => {
  FormData.value = {
    ...FormData.value,
    [event.target.name]: event.target.value,
  };
};
const admininputChangeHandler = (event: any) => {
  adminData.value = {
    ...adminData.value,
    [event.target.name]: event.target.value,
  };
};
const closeModalHandler = () => {
  if (companyId.value) {
    emit("update:getAllCompanies", null); // Emit an event to update the prop
  }
  emit("update:handleUpdateAddCompanyModalOpen", false); // Emit an event to update the prop
  console.log("modal closed");

  FormData.value = {
    companyName: "",
    industry: "",
    siteURL: "",
    businessAddress: "",
    postCode: "",
    country: "",
    state: "",
    yearBusinessStarted: "",
    companyPhoneNumber: "",
    billingAddress: "",
    companyEmailAddress: "",
    companyRegistrationNumber: "",
    companyRegisteredName: "",
    billingPhoneNumber: "",
    BillingEmailAddress: "",
    dailyEmailLimit: 0,
    dailySMSLimit: 0,
    noOfLicence: 0,
    noOfWorkers: 0,
    compnayLogo: null as File | null,
  };
};
const onAddFile = (error: any, fileInfo: any) => {
  const _file = fileInfo.file as File;
  if (_file) {
    FormData.value = { ...FormData.value, compnayLogo: _file };
  }
};

const onRemoveFile = (error: any, fileInfo: any) => {
  FormData.value = { ...FormData.value, compnayLogo: null };
};

onMounted(async () => {
  // getAllIndusties()
  await company.loadIndustries();
});
</script>

<template>
  <VModal :open="props.AddCompanyModalOpen" title="New Company" size="big" actions="right" @close="closeModalHandler"
    noclose>
    <template #content>
      <div class="modal-form">
        <div class="tabs-inner column is-12">
          <div class="tabs">
            <ul>
              <li :class="[tab === 'company info' && 'is-active']">
                <a tabindex="0" role="button"><span>Company Info</span></a>
              </li>
              <li :class="[tab === 'admin' && 'is-active']">
                <a tabindex="0" role="button"><span> Admin</span></a>
              </li>
              <li class="tab-naver" />
            </ul>
          </div>
        </div>
        <div v-if="tab === 'company info'" class="tab-content is-active">
          <form @submit.prevent="addCompanyHandler" id="company-from">
            <div class="columns is-multiline">
              <div class="field column is-6 mb-0">
                <label>Company Name: *</label>
                <div class="control">
                  <input type="text" name="companyName" v-model="FormData.companyName"
                    @change="(e) => inputChangeHandler(e)" required class="input is-primary-focus is-primary-focus"
                    placeholder="Company Name" />
                </div>
              </div>

              <!-- Site URL -->
              <div class="field column is-6 mb-0">
                <label>Site URL: *</label>
                <div class="control">
                  <input type="url" name="siteURL" v-model="FormData.siteURL" @change="(e) => inputChangeHandler(e)"
                    required class="input is-primary-focus" placeholder="Site URL" />
                </div>
              </div>

              <!-- Business Address -->
              <div class="field column is-6 mb-0">
                <label>Business Address: *</label>
                <div class="control">
                  <input name="businessAddress" v-model="FormData.businessAddress" @change="(e) => inputChangeHandler(e)"
                    required class="input is-primary-focus" placeholder="Business Address" />
                </div>
              </div>

              <!-- Post Code -->
              <div class="field column is-6 mb-0">
                <label>Post Code: *</label>
                <div class="control">
                  <input type="text" name="postCode" v-model="FormData.postCode" @change="(e) => inputChangeHandler(e)"
                    required class="input is-primary-focus" placeholder="Post Code" />
                </div>
              </div>

              <!-- Country -->
              <div class="field column is-6 mb-0">
                <label>Country: *</label>
                <div class="control">
                  <input type="text" name="country" v-model="FormData.country" @change="(e) => inputChangeHandler(e)"
                    required class="input is-primary-focus" placeholder="Country" />
                </div>
              </div>

              <!-- State -->
              <div class="field column is-6 mb-0">
                <label>State: *</label>
                <div class="control">
                  <input type="text" name="state" v-model="FormData.state" @change="(e) => inputChangeHandler(e)" required
                    class="input is-primary-focus" placeholder="State" />
                </div>
              </div>

              <!-- Year Business Started -->
              <div class="field column is-6 mb-0">
                <label>Year Business Started: *</label>
                <div class="control">
                  <input type="text" name="yearBusinessStarted" v-model="FormData.yearBusinessStarted"
                    @change="(e) => inputChangeHandler(e)" required class="input is-primary-focus"
                    placeholder="Year Business Started" />
                </div>
              </div>

              <!-- Company Phone Number -->
              <div class="field column is-6 mb-0">
                <label>Company Phone Number: *</label>
                <div class="control">
                  <input type="tel" name="companyPhoneNumber" v-model="FormData.companyPhoneNumber"
                    @change="(e) => inputChangeHandler(e)" required class="input is-primary-focus"
                    placeholder="Company Phone Number" />
                </div>
              </div>

              <!-- Billing Address -->
              <div class="field column is-6 mb-0">
                <label>Billing Address: *</label>
                <div class="control">
                  <input type="text" name="billingAddress" v-model="FormData.billingAddress"
                    @change="(e) => inputChangeHandler(e)" required class="input is-primary-focus"
                    placeholder="Billing Address" />
                </div>
              </div>

              <!-- Company Email Address -->
              <div class="field column is-6 mb-0">
                <label>Company Email Address: *</label>
                <div class="control">
                  <input type="email" name="companyEmailAddress" v-model="FormData.companyEmailAddress"
                    @change="(e) => inputChangeHandler(e)" required class="input is-primary-focus"
                    placeholder="Company Email Address" />
                </div>
              </div>

              <!-- Company Registration Number -->
              <div class="field column is-6 mb-0">
                <label>Company Registration Number: *</label>
                <div class="control">
                  <input type="text" name="companyRegistrationNumber" v-model="FormData.companyRegistrationNumber"
                    @change="(e) => inputChangeHandler(e)" required class="input is-primary-focus"
                    placeholder="Company Registration Number" />
                </div>
              </div>

              <!-- Company Registered Name -->
              <div class="field column is-6 mb-0">
                <label>Company Registered Name: *</label>
                <div class="control">
                  <input type="text" name="companyRegisteredName" v-model="FormData.companyRegisteredName"
                    @change="(e) => inputChangeHandler(e)" required class="input is-primary-focus"
                    placeholder="Company Registered Name" />
                </div>
              </div>

              <!-- Billing Phone Number -->
              <div class="field column is-6 mb-0">
                <label>Billing Phone Number: *</label>
                <div class="control">
                  <input type="tel" name="billingPhoneNumber" v-model="FormData.billingPhoneNumber"
                    @change="(e) => inputChangeHandler(e)" required class="input is-primary-focus"
                    placeholder="Billing Phone Number" />
                </div>
              </div>

              <!-- Billing Email Address -->
              <div class="field column is-6 mb-0">
                <label>Billing Email Address: *</label>
                <div class="control">
                  <input type="email" name="BillingEmailAddress" v-model="FormData.BillingEmailAddress"
                    @change="(e) => inputChangeHandler(e)" required class="input is-primary-focus"
                    placeholder="Billing Email Address" />
                </div>
              </div>
              <!-- Daily Email Limit -->
              <div class="field column is-3 mb-0">
                <label>Daily Email Limit: *</label>
                <div class="control">
                  <input type="number" name="dailyEmailLimit" v-model="FormData.dailyEmailLimit"
                    @change="(e) => inputChangeHandler(e)" required class="input is-primary-focus"
                    placeholder="Daily Email Limit" />
                </div>
              </div>
              <!-- Daily SMS Limit -->
              <div class="field column is-3 mb-0">
                <label>Daily SMS Limit: *</label>
                <div class="control">
                  <input type="number" name="dailySMSLimit" v-model="FormData.dailySMSLimit"
                    @change="(e) => inputChangeHandler(e)" required class="input is-primary-focus"
                    placeholder="Daily SMS Limit" />
                </div>
              </div>

              <!-- Number of Licenses -->
              <div class="field column is-3 mb-0">
                <label>Number of Licenses: *</label>
                <div class="control">
                  <input type="number" name="noOfLicence" v-model="FormData.noOfLicence"
                    @change="(e) => inputChangeHandler(e)" required class="input is-primary-focus"
                    placeholder="Number of Licenses" />
                </div>
              </div>

              <!-- Number of Workers -->
              <div class="field column is-3 mb-0">
                <label>Number of Workers: *</label>
                <div class="control">
                  <input type="number" name="noOfWorkers" v-model="FormData.noOfWorkers"
                    @change="(e) => inputChangeHandler(e)" required class="input is-primary-focus"
                    placeholder="Number of Workers" />
                </div>
              </div>

              <div class="column is-12">
                <div class="columns mb-0">
                  <div class="column is-6 mb-0">
                    <!-- Industry -->
                    <div class="field column is-12 mb-0">
                      <label>Industry: *</label>
                      <VField>
                        <VControl>
                          <VSelect v-model="selectedIndustries" name="industry" multiple required class="is-rounded">
                            <VOption v-for="(item, index) in company.industries" :value="item.id">{{ item.name }}
                            </VOption>
                          </VSelect>
                        </VControl>
                      </VField>
                      <VField id="interests" class="pb-4" label="Press Ctrl to select multiple industries">
                      </VField>
                    </div>
                  </div>
                  <VField class="column is-6">
                    <label>Company Logo:</label>
                    <VControl class="is-flex is-justify-content-center mt-5">
                      <VFilePond class="profile-filepond" name="profile_filepond" :chunk-retry-delays="[500, 1000, 3000]"
                        label-idle="<i class='lnil lnil-cloud-upload'></i>" :accepted-file-types="[
                          'image/png',
                          'image/jpeg',
                          'image/gif',
                          'application/pdf',
                        ]" :image-preview-height="240" :image-resize-target-width="240" :image-resize-target-height="240"
                        image-crop-aspect-ratio="1:1" style-panel-layout="compact circle"
                        style-load-indicator-position="center bottom" style-progress-indicator-position="right bottom"
                        style-button-remove-item-position="left bottom" style-button-process-item-position="right bottom"
                        @addfile="onAddFile" @removefile="onRemoveFile" />
                    </VControl>
                  </VField>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div v-if="tab === 'admin'" class="tab-content is-active">
          <form @submit.prevent="addMemberHandler" id="admin-from">
            <div class="modal-form columns is-multiline">
              <div class="field column is-6 mb-0">
                <label>Fist name: *</label>
                <div class="control">
                  <input type="text" name="first_name" v-model="adminData.first_name"
                    @change="(e) => admininputChangeHandler(e)" required class="input" placeholder="first name" />
                </div>
              </div>
              <div class="field column is-6 mb-0">
                <label>Last name: </label>
                <div class="control">
                  <input type="text" name="last_name" v-model="adminData.last_name"
                    @change="(e) => admininputChangeHandler(e)" class="input" placeholder="last name" />
                </div>
              </div>
              <div class="field column is-6 mb-0">
                <label>Email: *</label>
                <div class="control">
                  <input type="email" name="email" autocomplete="false" v-model="adminData.email"
                    @change="(e) => admininputChangeHandler(e)" required class="input" placeholder="Email Address" />
                </div>
              </div>
              <div class="field column is-6 mb-0">
                <label>Password: *</label>
                <div class="control">
                  <VField addons>
                    <VControl expanded>
                      <VInput :type="showPassword ? 'text' : 'password'" class="input" placeholder="Enter Password"
                        autocomplete="off" name="password" v-model="adminData.password"
                        @change="(e) => admininputChangeHandler(e)" required />
                    </VControl>
                    <VControl>
                      <VButton color="primary" @click="togglePasswordVisibility"><i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'
                        " aria-hidden="true"></i></VButton>
                    </VControl>
                  </VField>
                  <!-- <input :type="showPassword ? 'text' : 'password'" autocomplete="off" name="password"
v-model="adminData.password" @change="(e) => admininputChangeHandler(e)" required
class="input paswrdinput" placeholder="Password" /> -->
                  <!-- <VControl raw subcontrol>
<VCheckbox
v-model="showPassword"
label="Show Password"
color="success"
/>
</VControl> -->
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </template>
    <template #action>
      <VButton type="submit" :form="tab == 'admin' ? 'admin-from' : 'company-from'" :loading="loading" color="primary"
        icon="fas fa-plus" raised>
        {{ tab == "admin" ? "Create admin" : "Create & proceed" }}
      </VButton>
    </template>
  </VModal>
</template>

