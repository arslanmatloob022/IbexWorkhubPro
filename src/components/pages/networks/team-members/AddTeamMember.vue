<script setup lang="ts">

import {useApi} from '/@src/composable/useAPI'
import { useNotyf } from '/@src/composable/useNotyf'
import {useCompany} from '/@src/stores/company'
const notyf = useNotyf()
const api = useApi()
const selectedRole = ref('admin')
const company = useCompany()
const loading = ref(false)
const FormData=ref({
  id:'',
  first_name:'',
  last_name:'',
  email:'',
  role:'manager',
  profileImage: null as File | null, 
  jobPosition:'',
  mobileNo:'',
  phoneNo:'',
  password:'testpass12',
  department:'',
  company:'',
  is_active:false
})
const emit = defineEmits<{
  (e: 'update:handleUpdateAddMemberModalOpen', value: boolean): void,
  (e: 'update:getTeamMembers', value: null): void,
}>()
const props = defineProps<{
    AddMemberModalOpen?: boolean
}>()
const addMemberHandler = async()=>{
  try{
    loading.value = true
    FormData.value = {...FormData.value, role:selectedRole.value, is_active:true}
    FormData.value = {...FormData.value,  company: company.loggedCompany.id}
    
    const formDataAPI = new window.FormData();
    for (const key in FormData.value) {
      if (key !== 'profileImage' || FormData.value.profileImage !== null) {
      formDataAPI.append(key, FormData.value[key])
      }
    }
    const response = await api.post('/v3/api/account/user/',formDataAPI)
    closeModalHandler()
    notyf.dismissAll()
    notyf.success('New member added, New Member')
    emit('update:getTeamMembers', null); // Emit an event to update the prop
  }catch(error:any) {
    notyf.error('Controller with this email already exist or  something went wrong!');
  }finally{
    loading.value = false
  }
}
const inputChangeHandler =(event:any)=>{
  FormData.value = {...FormData.value, [event.target.name]:event.target.value}
}
const closeModalHandler = () =>{
    emit('update:handleUpdateAddMemberModalOpen', false); // Emit an event to update the prop
console.log("modal closed");

  FormData.value={
    first_name:'',
    last_name:'',
    email:'',
    role:'manager',
    profileImage:null,
    jobPosition:'',
    mobileNo:'',
    phoneNo:'',
    password:'testpass12',
    department:''
  }
}
const onAddFile = (error: any, fileInfo: any) => {
  const _file = fileInfo.file as File
  if (_file) {
    console.log(_file);
    FormData.value = {...FormData.value, profileImage:_file}
  }
}

const onRemoveFile = (error: any, fileInfo: any) => {
  FormData.value = {...FormData.value, profileImage:null}
}


</script>

<template>
    <VModal
      is="form"
      :open="props.AddMemberModalOpen"
      title="New Team Member"
      size="large"
      actions="right"
      @submit.prevent="addMemberHandler"
      @close="closeModalHandler"
      noclose
    >
      <template #content>
        <div class="modal-form columns is-multiline cu-all-input">
         

            <div class="field column is-6 mb-0">
              <label>Fist name: *</label>
              <div class="control">
                <input type="text"  name="first_name" v-model="FormData.first_name" @change="(e)=>inputChangeHandler(e)" required class="input " placeholder="first name" />
              </div>
            </div>
            <div class="field column is-6 mb-0">
              <label>Last name: </label>
              <div class="control">
                <input type="text" name="last_name" v-model="FormData.last_name" @change="(e)=>inputChangeHandler(e)"  class="input " placeholder="last name" />
              </div>
            </div>
            <div class="field column is-6 mb-0">
              <label>Email: *</label>
              <div class="control">
                <input type="text" name="email" v-model="FormData.email" @change="(e)=>inputChangeHandler(e)" required class="input " placeholder="Email Address" />
              </div>
            </div>
      
          <div class="field column is-6 mb-0">
            <label>Job title:  </label>
            <div class="control">
              <input type="text" name="jobPosition"  v-model="FormData.jobPosition" @change="(e)=>inputChangeHandler(e)"  class="input " placeholder="job title" />
            </div>
          </div>
         
          <div class="field column is-6 mb-0">
            <label>Department: </label>
            <div class="control">
              <input type="text"  name="department" v-model="FormData.department" @change="(e)=>inputChangeHandler(e)"  class="input"  placeholder="Department" />
            </div>
          </div>
          <div class="field column is-6 mb-0">
            <label>Phone no:</label>
            <div class="control">
              <input type="tel"  name="mobileNo" v-model="FormData.phoneNo" @change="(e)=>inputChangeHandler(e)"  class="input " placeholder="Mobile no" />
            </div>
          </div>
          

          <VField class="column is-6">
            <label>Role:</label>
            <VControl>
              <div>
                <VRadio
                v-model="selectedRole"
                value="admin"
                label="Administrator"
                name="outlined_radio"
                color="success"
                />
              </div>
              <div>
                <VRadio
                v-model="selectedRole"
                value="consultant"
                label="Consultant"
                name="outlined_radio"
                color="success"
                />
              </div>
              <div>
                <VRadio
                v-model="selectedRole"
                value="manager"
                label="Project Manager"
                name="outlined_radio"
                color="success"
                />
              </div>
              <div>
                <VRadio
                v-model="selectedRole"
                value="finance"
                label="Finance"
                name="outlined_radio"
                color="success"
                />
              </div>
              <div>
                <VRadio
                v-model="selectedRole"
                value="sales"
                label="Sales"
                name="outlined_radio"
                color="success"
                />
              </div>

            </VControl>
          </VField>
          
          <div class="column is-6">
            <!-- <div class="field">
              <label>Phone no:</label>
              <div class="control">
                <input type="tel"  name="phoneNo" v-model="FormData.phoneNo" @change="(e)=>inputChangeHandler(e)"  class="input " placeholder="Phone no" />
            </div>
          </div> -->
            <VField >
              <label>Profile Image:</label>
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
     
        </div>
      </template>
      <template #action>
        <VButton type="submit" :loading="loading" color="primary" raised>Create</VButton>
      </template>
    </VModal>
  </template>
