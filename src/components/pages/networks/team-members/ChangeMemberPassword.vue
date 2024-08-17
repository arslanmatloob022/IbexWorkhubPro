<script setup lang="ts">
import {useApi} from '/@src/composable/useAPI'
import { useNotyf } from '/@src/composable/useNotyf'
const notyf = useNotyf()
const api = useApi()
const Loading = ref(false)
const Password = ref("");
const confirmPassword =ref("")
const router = useRouter();
const showPassword = ref(false)



const emit = defineEmits<{
  (e: 'update:handleChangePasswordModalOpen', value: boolean): void,
  (e: 'update:getTeamMembers', value: null): void,
}>()
const props = defineProps({
    ChangePasswordModalOpen:{
      type:Boolean,
      default:false
  },
    id:{
      type:Number,
      default:0
    }
})



const handleSubmit = async () => {
  if (!Loading.value) {
    if(Password.value!=confirmPassword.value)
    {
      notyf.error("Both password and confirm password  must be matched");
      return
    }
    Loading.value = true;
    try {
      const response = await api.post(`/v3/api/account/auth/change-team-member-password/`, {
        password: Password.value,
        confirm_password: confirmPassword.value,
        user: props.id
      });
      onSuccess();
    } catch (error) {
      Loading.value = false;
      notyf.dismissAll();
      notyf.error("Inavlid link or expired, password update");
    }
  }
};
const onSuccess = () => {
  Loading.value = false;
  notyf.dismissAll();
  notyf.success("Password updated successfully");
  closeModalHandler();
  // router.push("/sidebar/company/team-members")
};


const closeModalHandler = () =>{
    emit('update:handleChangePasswordModalOpen', false); // Emit an event to update the prop
  
}

const handleShow= ()=>{
  showPassword.value = !showPassword.value;
}


onMounted(()=>{
})
</script>


<template>
    <VModal
      is="form"
      :open="props.ChangePasswordModalOpen"
      title="Change Password"
      size="small"
      actions="right"
      @submit.prevent="handleSubmit"
      @close="closeModalHandler"
      noclose
    >
      <template #content>
        <div class="modal-form columns is-multiline">
            <div class="column is-12">
                <div class="field">
                <label>New Password:</label>
                <div class="control">
                    <input :type="showPassword?'text':'password'"  name="password" minlength="8"  v-model="Password" required  class="input " placeholder="New password" />
                </div>
                </div>
            </div>
            <div class="column is-12">
                <div class="field">
                <label>Confirm Password:</label>
                <div class="control">
                    <input :type="showPassword?'text':'password'"  name="confirmPassword" minlength="8"  v-model="confirmPassword" required  class="input " placeholder="Confirm password" />
                </div>
                </div>
            </div>
            <!--  -->
            <div class="column is-12">
          <div class="field" style="display: flex; align-items: center; gap:.5rem; ">
            <div class="control">
              <input
              type="checkbox"
              class="checkbox"
              @click="handleShow"
              />
            </div>
            <label>Show Password:</label>
          </div>
        </div>
        <!--  -->
        </div>
      </template>
      <template #action>
        <VButton  type="submit" :loading="Loading" color="primary" raised>Change Password</VButton>
      </template>
    </VModal>
  </template>
