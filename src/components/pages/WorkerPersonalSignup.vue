<script setup lang="ts">
import { useNotyf } from '/@src/composable/useNotyf'
import {useApi} from '/@src/composable/useAPI'
import { useCompany } from '/@src/stores/company'
const company = useCompany
const isLoading = ref(false)
const api = useApi()
const experience = ref('')
const notyf = useNotyf()
const route = useRoute()
const router= useRouter()
const { y } = useWindowScroll()
const tokenData =ref({company:'', id:'', token:''})
const FormData = ref({
    id:'',
    firstName: '',
    lastName: '',
    emailAddress: '',
    phoneNumber: '',
    lineManager : '',
    homeAddress : '',
    profileImageURL: null as File | null, 
    externalID: '',
    compnayIdCardNumber: '',
    compnayIdCardExpiryDate: '',
    industry:'',
    arezCompany:''
    });

const inputChangeHandler =(event:any)=>{  
  FormData.value = {...FormData.value, [event.target.name]:event.target.value}
}
const isScrolling = computed(() => {
  return y.value > 30
})

const addWorkerHandler = async()=>{
  isLoading.value = true
  try{
    const formDataAPI = new window.FormData();
    for (const key in FormData.value) {
      if (key !== 'profileImageURL' || FormData.value.profileImageURL !== null) {
          formDataAPI.append(key, FormData.value[key]);
      }
    }
    formDataAPI.append('company', tokenData.value.company)
    formDataAPI.append('invitationToken', tokenData.value.token)
    const response = await api.post('/v3/api/worker/', formDataAPI);
    notyf.success('User added successfully')
    router.push('/')
  }catch(error:any) {
    let errorObj=error.response.data??{}
    Object.values(errorObj).forEach((values) => {
      values.forEach(value => {
        console.log(value);
        notyf.error(` ${value}, New Worker`)
      });
    });
  }finally{
    isLoading.value = false
  }  
}

const onAddFile = (error: any, fileInfo: any) => {
  const _file = fileInfo.file as File
  if (_file) {
    FormData.value = {...FormData.value, profileImageURL:_file}
  }
}

const onRemoveFile = (error: any, fileInfo: any) => {
  FormData.value = {...FormData.value, profileImageURL:null}
}


const checkLinkToken=async()=>{
  console.log(route.params.token ,"token")
  try{
      const response = await api.post('v3/api/worker/worker_invitation/check-worker-invitation-token/', {"token":route.params.token})
      tokenData.value = response.data
  }catch{
    notyf.error("Invitation link is expired or invalid")
    router.push('/')
  }
}

onMounted(async ()=>{
  checkLinkToken()
})
</script>

<template>
  <div class="account-box is-form is-footerless">
    <div
      class="form-head stuck-header"
      :class="[isScrolling && 'is-stuck']"
    >
      <div class="form-head-inner">
        <div class="left">
          <h3>General Info</h3>
          <p>Edit your account's general information</p>
        </div>

      </div>
    </div>
    <div class="form-body">
      <!--Fieldset-->
      <div class="fieldset">
        <div class="fieldset-heading">
          <h4>Profile Picture</h4>
          <p>This is how others will recognize you</p>
        </div>

        <VField class="column is-12">

        <VControl class="is-flex is-justify-content-center mt-5">
            <VFilePond
            class="profile-filepond"
            name="profile_filepond"
            :chunk-retry-delays="[500, 1000, 3000]"
            label-idle="<i class='lnil lnil-cloud-upload'></i>"
            :accepted-file-types="['image/png', 'image/jpeg', 'image/gif']"
            :image-preview-height="240"
            :image-resize-target-width="240"
            :image-resize-target-height="240"
            image-crop-aspect-ratio="1:1"
            style-panel-layout="compact circle"
            style-load-indicator-position="center bottom"
            style-progress-indicator-position="right bottom"
            style-button-remove-item-position="left bottom"
            style-button-process-item-position="right bottom"
            @addfile="onAddFile"
            @removefile="onRemoveFile"
            />
        </VControl>
        </VField>  
      </div>

      <!--Fieldset-->
    <form @submit.prevent="addWorkerHandler()">
      <div class="fieldset">
        <div class="fieldset-heading">
          <h4>Personal Info</h4>
          <p>Others diserve to know you more</p>
        </div>

        <div class="columns is-multiline">
          <!--Field-->
          <div class="column is-6">
            <VField>
              <VControl icon="feather:user">
                <VInput
                  type="text"
                  name="firstName" v-model="FormData.firstName" @change="(e) => inputChangeHandler(e)"
                  required
                  placeholder="First Name"
                  autocomplete="given-name"
                />
              </VControl>
            </VField>
          </div>
          <!--Field-->
          <div class="column is-6">
            <VField>
              <VControl icon="feather:user">
                <VInput
                  type="text"
                  name="lastName" v-model="FormData.lastName" @change="(e) => inputChangeHandler(e)"
                  required
                  placeholder="Last Name"
                  autocomplete="family-name"
                />
              </VControl>
            </VField>
          </div>
            <!--Field-->
            <div class="column is-6">
            <VField>
              <VControl icon="feather:phone">
                <VInput
                  type="tel"
                  required
                  name="phoneNumber" v-model="FormData.phoneNumber" @change="(e) => inputChangeHandler(e)"
                  placeholder="Phone"
                  autocomplete="family-name"
                />
              </VControl>
            </VField>
          </div>
          <!--Field-->
          <div class="column is-6">
            <VField>
              <VControl icon="feather:mail">
                
                <VInput
                  type="email"
                  required
                  name="emailAddress" v-model="FormData.emailAddress" @change="(e) => inputChangeHandler(e)"
                  placeholder="Email"
                  autocomplete="organization-title"
                />
              </VControl>
            </VField>
          </div>
          <!--Field-->
          <div class="column is-12">
            <VField>
              <VControl icon="feather:map-pin">
                <VInput
                  type="text"
                  name="homeAddress" v-model="FormData.homeAddress" @change="(e) => inputChangeHandler(e)"
                  placeholder="Location"
                  autocomplete="country-name"
                />
              </VControl>
            </VField>
          </div>
  
        </div>
      </div>

      <!--Fieldset-->
      <div class="fieldset">
        <div class="fieldset-heading">
          <h4>Professional Info</h4>
          <p>This can help you to win some opportunities</p>
        </div>
        <div class="columns is-multiline">
            <div class="column is-6">
            <VField>
              <VControl icon="feather:user">
                <VInput
                  type="tel"
                  name="lineManager" v-model="FormData.lineManager" @change="(e) => inputChangeHandler(e)"
                  
                  placeholder="Line manager"
                  autocomplete="family-name"
                />
              </VControl>
            </VField>
          </div>

          <div class="column is-6">
            <VField>
              <VControl icon="feather:credit-card">
                <VInput
                  type="text"
                  name="compnayIdCardNumber" v-model="FormData.compnayIdCardNumber" @change="(e) => inputChangeHandler(e)"
                  
                  placeholder="Company id card"
                  autocomplete="family-name"
                />
              </VControl>
            </VField>
          </div>
          <div class="column is-6">
            <VField>
              <VControl icon="feather:calendar">
                <VInput
                  type="date"
                  name="compnayIdCardExpiryDate" v-model="FormData.compnayIdCardExpiryDate" @change="(e) => inputChangeHandler(e)"
                  
                  placeholder="Company id card"
                  autocomplete="family-name"
                />
              </VControl>
            </VField>
          </div>


        </div>
      </div>
      <div class="right">
        <div class="buttons is-justify-content-end">
            
            <VButton
            type="submit"
            color="primary"
            raised
            :loading="isLoading"
            >
            Save 
            </VButton>
        </div>
        </div>
    </form>
    </div>
  </div>
</template>

