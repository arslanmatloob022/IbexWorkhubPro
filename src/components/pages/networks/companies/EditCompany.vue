<script setup lang="ts">
import {useApi} from '/@src/composable/useAPI'
import { useNotyf } from '/@src/composable/useNotyf'
import myUpload from 'vue-image-crop-upload';
import { useCompany } from "/@src/stores/company";
const company = useCompany();
const show = ref(false);
const cropLogo = ref(false)
const imageurl = ref('');
const notyf = useNotyf()
const api = useApi()
const allIndustries = ref([])
const Loading = ref(false)
const isUploading = ref(false)
const user_action = ref('update')
const selectedIndustries =ref([])
const FormData = ref<any>({
      companyName: '',
      industry: '',
      siteURL: '',
      businessAddress: '',
      postCode: '',
      country: '',
      state: '',
      yearBusinessStarted: '',
      companyPhoneNumber: '',
      billingAddress: '',
      companyEmailAddress: '',
      companyRegistrationNumber: '',
      companyRegisteredName: '',
      billingPhoneNumber: '',
      BillingEmailAddress: '',
      dailyEmailLimit: 0,
      dailySMSLimit: 0,
      noOfLicence: 0,
      noOfWorkers:0,
      favIcon:'',
      compnayLogo: null as File | null | string, 
    });
const formDataEdit = ref({})
const emit = defineEmits<{
  (e: 'update:handleUpdateEditCompanyModalOpen', value: boolean): void,
  (e: 'update:getAllCompanies', value: null): void,
}>()
const props = defineProps({
  EditCompanyModalOpen:{
      type:Boolean,
      default:false
    },
    id:{
      type:Number,
      default:0
    }
})
const editCompanyHandler = async()=>{
  try{
    Loading.value= true
    const formDataAPI = new window.FormData();

    for (const key in formDataEdit.value) {
        formDataAPI.append(key, formDataEdit.value[key])
    }
    // selectedIndustries.value.forEach((industryId) => {
    //   formDataAPI.append(`industry`, industryId.id);
    // });
    const response = await api.patch(`/v3/api/company/${props.id}/`,formDataAPI)
    closeModalHandler()
    notyf.dismissAll()
    Loading.value=false
    notyf.success('Company updated, Company')
    emit('update:getAllCompanies', null); // Emit an event to update the prop
  }catch(error:any) {
    let errorObj=error.response.data??{}
    Object.values(errorObj).forEach(values => {
      values.forEach(value => {
        console.log(value);
        notyf.error(` ${value}, New Company`)
      });
    });
  }  
}
const inputChangeHandler =(event:any)=>{

  if( event=='industry')
  {
    console.log("insustry tpe", FormData.value.industry.id);
    formDataEdit.value = {...formDataEdit.value, 'industry':FormData.value.industry.id}
    return
  }

  formDataEdit.value = {...formDataEdit.value, [event.target.name]:event.target.value}
}
const closeModalHandler = () =>{
    emit('update:handleUpdateEditCompanyModalOpen', false); // Emit an event to update the prop
    FormData.value ={
      companyName: '',
      industry: '',
      siteURL: '',
      businessAddress: '',
      postCode: '',
      country: '',
      state: '',
      yearBusinessStarted: '',
      companyPhoneNumber: '',
      billingAddress: '',
      companyEmailAddress: '',
      companyRegistrationNumber: '',
      companyRegisteredName: '',
      billingPhoneNumber: '',
      BillingEmailAddress: '',
      dailyEmailLimit: 0,
      dailySMSLimit: 0,
      noOfLicence: 0,
      favIcon:'',
      compnayLogo: null as File | null, 
    }
  }

const getAllIndusties = async()=>{
  try{
    const response = await api.get('/v3/api/industry/')
    allIndustries.value = response.data
  }catch(error) {
  }  
}

const getCompany = async()=>{
  try{
    Loading.value=true
      const response =await api.get(`/v3/api/company/${props.id}/`,{
      })
      let responseJson={}
      for (const key in FormData.value) {
        if (response.data.hasOwnProperty(key)) {
          responseJson[key] = response.data[key];
        }
      }
      selectedIndustries.value = response.data.industry
      Loading.value=false
      FormData.value = responseJson
  }catch(error){
      Loading.value=false
      console.error('ok',error);
  }
}
const toggleShow = () => {
  show.value = !show.value;
};

const cropSuccess = (imgDataUrl: any, field) => {

  const file = DataURIToBlob(imgDataUrl)
  formDataEdit.value.favIcon = file
  imageurl.value = imgDataUrl

};

const cropSuccessLogo = (imgDataUrl: any) => {

const file = DataURIToBlob(imgDataUrl)
formDataEdit.value.compnayLogo = file
FormData.value.compnayLogo = imgDataUrl
};

function DataURIToBlob(dataURI: string) {
  const splitDataURI = dataURI.split(',')
  const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
  const mimeString = splitDataURI[0].split(':')[1].split(';')[0]
  const ia = new Uint8Array(byteString.length)
  for (let i = 0; i < byteString.length; i++)
    ia[i] = byteString.charCodeAt(i)
  return new Blob([ia], { type: mimeString })
}

onMounted(()=>{
  getAllIndusties()
  selectedIndustries.value = company.loggedCompany.industry;
  FormData.value = company.loggedCompany;
  // getCompany()
})

</script>


<template>
    <VModal
      is="form"
      :open="props.EditCompanyModalOpen"
      title="Edit Company"
      size="big"
      actions="right"
      @submit.prevent="editCompanyHandler"
      @close="closeModalHandler"
      noclose
    >
      <template #content>
        <div class="modal-form columns cu-all-input  cus-scrollbary is-multiline">
          <div class="field column is-6 mb-0">
            <label>Company Name: *</label>
            <div class="control">
              <input type="text" name="companyName" v-model="FormData.companyName" @change="(e) => inputChangeHandler(e)" required class="input is-primary-focus is-primary-focus" placeholder="Company Name" />
            </div>
          </div>
      

          <!-- Site URL -->
          <div class="field column is-6 mb-0">
            <label>Site URL: </label>
            <div class="control">
              <input type="text" name="siteURL" v-model="FormData.siteURL" @change="(e) => inputChangeHandler(e)"  class="input is-primary-focus" placeholder="Site URL" />
            </div>
          </div>
      
          <!-- Business Address -->
          <div class="field column is-6 mb-0">
            <label>Business Address: </label>
            <div class="control">
              <input name="businessAddress" v-model="FormData.businessAddress" @change="(e) => inputChangeHandler(e)"  class="input is-primary-focus" placeholder="Business Address"/>
            </div>
          </div>
      
          <!-- Post Code -->
          <div class="field column is-6 mb-0">
            <label>Post Code: </label>
            <div class="control">
              <input type="text" name="postCode" v-model="FormData.postCode" @change="(e) => inputChangeHandler(e)"  class="input is-primary-focus" placeholder="Post Code" />
            </div>
          </div>
      
          <!-- Country -->
          <div class="field column is-6 mb-0">
            <label>Country: </label>
            <div class="control">
              <input type="text" name="country" v-model="FormData.country" @change="(e) => inputChangeHandler(e)"  class="input is-primary-focus" placeholder="Country" />
            </div>
          </div>
      
          <!-- State -->
          <div class="field column is-6 mb-0">
            <label>State: </label>
            <div class="control">
              <input type="text" name="state" v-model="FormData.state" @change="(e) => inputChangeHandler(e)"  class="input is-primary-focus" placeholder="State" />
            </div>
          </div>
      
          <!-- Year Business Started -->
          <div class="field column is-6 mb-0">
            <label>Year Business Started: </label>
            <div class="control">
              <input type="text" name="yearBusinessStarted" v-model="FormData.yearBusinessStarted" @change="(e) => inputChangeHandler(e)"  class="input is-primary-focus" placeholder="Year Business Started" />
            </div>
          </div>
      
          <!-- Company Phone Number -->
          <div class="field column is-6 mb-0">
            <label>Company Phone Number: </label>
            <div class="control">
              <input type="tel" name="companyPhoneNumber" v-model="FormData.companyPhoneNumber" @change="(e) => inputChangeHandler(e)"  class="input is-primary-focus" placeholder="Company Phone Number" />
            </div>
          </div>
      
          <!-- Billing Address -->
          <!-- <div class="field column is-6 mb-0">
            <label>Billing Address: *</label>
            <div class="control">
              <input type="text" name="billingAddress" v-model="FormData.billingAddress" @change="(e) => inputChangeHandler(e)" required class="input is-primary-focus" placeholder="Billing Address" />
            </div>
          </div> -->
      
          <!-- Company Email Address -->
          <div class="field column is-6 mb-0">
            <label>Company Email Address: </label>
            <div class="control">
              <input type="email" name="companyEmailAddress" v-model="FormData.companyEmailAddress" @change="(e) => inputChangeHandler(e)"  class="input is-primary-focus" placeholder="Company Email Address" />
            </div>
          </div>

          <!-- Company Registration Number -->
          <div class="field column is-6 mb-0">
            <label>Company Registration Number: </label>
            <div class="control">
              <input type="text" name="companyRegistrationNumber" v-model="FormData.companyRegistrationNumber" @change="(e) => inputChangeHandler(e)"  class="input is-primary-focus" placeholder="Company Registration Number" />
            </div>
          </div>
      
          <!-- Company Registered Name -->
          <div class="field column is-6 mb-0">
            <label>Company Registered Name: </label>
            <div class="control">
              <input type="text" name="companyRegisteredName" v-model="FormData.companyRegisteredName" @change="(e) => inputChangeHandler(e)"  class="input is-primary-focus" placeholder="Company Registered Name" />
            </div>
          </div>
      
          <!-- Billing Phone Number -->
          <!-- <div class="field column is-6 mb-0">
            <label>Billing Phone Number: *</label>
            <div class="control">
              <input type="tel" name="billingPhoneNumber" v-model="FormData.billingPhoneNumber" @change="(e) => inputChangeHandler(e)" required class="input is-primary-focus" placeholder="Billing Phone Number" />
            </div>
          </div> -->
      
          <!-- Billing Email Address -->
          <!-- <div class="field column is-6 mb-0">
            <label>Billing Email Address: *</label>
            <div class="control">
              <input type="email" name="BillingEmailAddress" v-model="FormData.BillingEmailAddress" @change="(e) => inputChangeHandler(e)" required class="input is-primary-focus" placeholder="Billing Email Address" />
            </div>
          </div> -->
          <div class="column is-12">
            <div class="columns  mb-0">
              <VField class="column is-3">
                <label>Company Logo:</label>
                <div class="control">
                  <VAvatar size="xl" class="profile-v-avatar mt-4">
                    <template #avatar>
                      <img
                        v-if="!isUploading"
                        class="avatar"
                        :src="FormData.compnayLogo == null ? '/images/avatars/placeholder.jpg' : FormData.compnayLogo"
                        alt=""              
                      />

                     <!-- Upload & Edit btn -->
                      <span v-if="user_action == 'update'">
                        <VIconButton style="position: absolute;top:60%;right:-3%"
                          v-if="!isUploading"
                          icon="feather:edit-2"
                          class="edit-button is-edit"
                          circle
                          tabindex="0"
                          @keydown.space.prevent="isUploading = true"
                          @click="()=>{cropLogo = ! cropLogo}"
                        />

                        <VIconButton style="position: absolute;top:60%;right:-3%"
                          v-else
                          icon="feather:arrow-left"
                          class="edit-button is-back"
                          circle
                          tabindex="0"
                          @keydown.space.prevent="isUploading = false"
                          @click="isUploading = false"
                        />
                       
                      </span>

                    </template>
                  </VAvatar>
                </div>
              </VField>
              <!-- Logo -->
              <my-upload field="img" @crop-success="cropSuccessLogo"  v-model="cropLogo" :noRotate=false :noSquare=false
                 langType="en" img-format="png/jpg"></my-upload>
                 <!-- Icon -->
              <VField class="column is-3">
                <VSnack @click="toggleShow" color="primary" title="Favicon" primary icon="fas fa-cloud-upload-alt">
                  <i class="iconify" data-icon="feather:plus" />
                </VSnack>

                <my-upload field="img" @crop-success="cropSuccess"  v-model="show" :noRotate=false :noSquare=false
                 langType="en" img-format="png/jpg"></my-upload>
                <img :src="imageurl ? imageurl : company.loggedCompany.favIcon"
                  style="width:100px; height:100px; border-radius:50%; margin:10px" />
              </VField>
            </div>
          </div>     
        </div>
      </template>
      <template #action>
        <VButton type="submit" :loading="Loading" color="primary"  raised>Update</VButton>
      </template>
    </VModal>
  </template>
