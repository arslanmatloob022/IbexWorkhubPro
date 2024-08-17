<script setup lang="ts">
import { useI18n } from "vue-i18n";
import axios from "axios";
import { useCompany } from "/@src/stores/company";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import myUpload from 'vue-image-crop-upload';
import { convertToFormData } from "/@src/composable/useSupportElement";
import { useUserSession } from "/@src/stores/userSession";
const userSession = useUserSession();
const notyf = useNotyf();
const api = useApi();
const company = useCompany();
const { locale } = useI18n();
const chartColor = ref('#fff')
const currentContent = ref(1);
const VATRegistration = ref(true);
const route = useRoute()
const password = ref("")
const router = useRouter()
const Loading = ref(false)
const passwordModal = ref(true)
const isUploading = ref(false)
const user_action = ref('update')
const compnayIndustries = ref<any>([])
const showColorContainer = ref(false);
const query = ref("");
const showAddressList = ref(false);
const addressList = ref<any>([])
const currentColor = ref({
    id: 0,
    hexCode: "",
});
// -------->
const logoUrl = ref<string>("")
const cropLogo = ref(false)
// ------->
const markerColors = ref([
    { id: 1, hexCode: "#FFD700" },
    { id: 2, hexCode: "#87CEEB" },
    { id: 3, hexCode: "#98FB98" },
    { id: 4, hexCode: "#FF69B4" },
    { id: 5, hexCode: "#F0E68C" },
    { id: 6, hexCode: "#00CED1" },
    { id: 7, hexCode: "#FFA07A" },
    { id: 8, hexCode: "#ADD8E6" },
    { id: 9, hexCode: "#FF6347" },
    { id: 10, hexCode: "#00FA9A" },
    { id: 11, hexCode: "#FFE4B5" },
    { id: 12, hexCode: "#40E0D0" },
    { id: 13, hexCode: "#FF8C00" },
    { id: 14, hexCode: "#AFEEEE" },
    { id: 15, hexCode: "#FF4500" },
    { id: 16, hexCode: "#B0C4DE" },
    { id: 17, hexCode: "#FF1493" },
    { id: 18, hexCode: "#7FFFD4" },
    { id: 19, hexCode: "#FFB6C1" },
    { id: 20, hexCode: "#00BFFF" }
]);

const supplierData = <any>ref(
    {
        id: 0,
        supplierName: '',
        country: 'UK',
        partnerLogo: null as File | null,
        noOfEmployees: '',
        supplierPhoneNumber: '',
        address: '',
        registrationNumber: '',
        postCode: '',
        color: '',
        registeredName: '',
        supplierEmailAddress: '',
        approved_till: '',
        vatNumber: '',
        taxReference: '',
        bankCountry: '',
        bankName: '',
        accountName: '',
        sortCode: '',
        accountNumber: '',
        accountReference: '',
        website: '',
        contactEmail: '',
        contactPhoneNumber: '',
        postalAddress: '',
        status: false,
        businessArea: '',
        contactPerson: '',
        tradingName: '',
        relationShip: '',
        industry: 0,
        company: 0,
        latitude: '',
        longitude: '',
        profileStats: {
    percentage: 0
  },
    }
)

const showContent = (contentNumber: number) => {
    currentContent.value = contentNumber;
};

const showColorsPellate = () => {
    showColorContainer.value = !showColorContainer.value;
};
const selecteColor = (color: any) => {
    currentColor.value = color;
    supplierData.value = { ...supplierData.value, color: color.hexCode };
    showColorContainer.value= false
};


const addNewSupplier = async () => {
    try {

        const formDataAPI =  convertToFormData(supplierData.value, ['partnerLogo']);
        
        formDataAPI.delete('companyIndustries')
        const response = await api.patch(`/v3/api/supplier/${supplierData.value.id}/partial-update/`, formDataAPI);
        // supplierData.value.id = response.data.id;
        notyf.success("Partner updated Succesfully.");
        currentContent.value == 4 ? router.push("/") : currentContent.value += 1;


    } catch (err) {
        console.log(err)
    }
}
const handlePostCodeChange = async () => {
    try {
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${supplierData.value.postCode}&key=AIzaSyDWHedwkLGGa4_3XgPqYxIzMkFpOdKJRik`
        );
        if (response.data.status === "OK") {
            supplierData.value.address = response.data.results[0].formatted_address;
            logoUrl.value = response.data.results[0].partnerLogo

            supplierData.value.latitude = response.data.results[0].geometry.location.lat;
            supplierData.value.longitude = response.data.results[0].geometry.location.lng;
            drawmap(parseFloat(response.data.results[0].geometry.location.lat), parseFloat(response.data.results[0].geometry.location.lng))
            notyf.success("Address Added");

        } else if (response.data.status === "ZERO_RESULTS") {
            notyf.error("Invalid Post-Code");
        }
    } catch (error) {
        notyf.error("Invalid Post-Code");
        console.error(error);
    }
};


const isValidSupplierToken = async () => {
    try {
        Loading.value = true
        const response = await api.post(
            "v3/api/supplier/get_supplier_from_token/",
            {
                'token': route.query.token,
                'password': password.value
            }
        );
        passwordModal.value = false
        supplierData.value = response.data
        userSession.setCode(response.data.token)
        logoUrl.value = response.data.partnerLogo
        console.log(response.data.companyIndustries, "industries")
        compnayIndustries.value = response.data.companyIndustries
        console.log(compnayIndustries.value, "company industries")
        console.log(response.data);

    } catch {
        notyf.error("Partner Invitation link is expired or Invalid password");
        // router.push("/");
    } finally {
        Loading.value = false
    }
}

// google map 
const drawmap = (lat:any, lng:any) => {
    let map = new google.maps.Map(document.getElementById("partnerMap"), {
        center: { lat: lat, lng: lng },
        scrollwheel: false,
        mapTypeId: google.maps.MapTypeId.Satellite,
        zoom: 7,

    });
    const marker = new google.maps.Marker({
        position: { lat: lat, lng: lng },
        map: map,
        title: 'Supplier Location'
    });
    console.log(supplierData.value.latitude)
}





const handleClickOutside = () => {
    showAddressList.value = false;
};

// ---------------------Cropy Logo------------------>
const cropSuccessLogo = (imgDataUrl: any) => {

const file = DataURIToBlob(imgDataUrl)
supplierData.value.partnerLogo = file
logoUrl.value  = imgDataUrl
console.log("Image URl:",imgDataUrl)
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


onMounted(() => {
    //    isValidSupplierToken() 
    drawmap()
})
</script>
<template >
    <div class="parent-div">
        <div style="position: absolute; right:10px; top:10px; display:flex; align-items:center; gap:8px">
            <span><p style="color:var(--primary-light-12); font-weight: 400;"> <span style="font-size: 24px; font-weight: 500;">{{ supplierData.remaining_days ? supplierData.remaining_days : 0 }} </span> day's remaining</p></span>
        </div>
        <div class="cus-sidebar">
            <ul>
                <li>
                    <div @click="showContent(1)" :class="{ 'active': currentContent === 1 }"
                        class="cus-single-link cu-pointer">
                        <span class="cus-icon" :class="{ 'active': currentContent === 1 }">
                            1
                        </span>
                        Partner Infomation
                    </div>
                </li>
                <li>
                    <div @click="showContent(2)" :class="{ 'active': currentContent === 2 }"
                        class="cus-single-link cu-pointer">
                        <span class="cus-icon" :class="{ 'active': currentContent === 2 }">
                            2
                        </span>
                        Partner Documents
                    </div>
                </li>
                <li>
                    <div @click="showContent(3)" :class="{ 'active': currentContent === 3 }"
                        class="cus-single-link cu-pointer">
                        <span class="cus-icon" :class="{ 'active': currentContent === 3 }">
                            3
                        </span>
                        Bank / Tax Details
                    </div>
                </li>
                <li>
                    <div @click="showContent(4)" :class="{ 'active': currentContent === 4 }"
                        class="cus-single-link cu-pointer">
                        <span class="cus-icon" :class="{ 'active': currentContent === 4 }">
                            4
                        </span>
                        Contact Details
                    </div>
                </li>
            </ul>
            <div >
              <ApexChart :Statvalue="supplierData.profileStats?.percentage" :color="chartColor"/>
            </div>
        </div>

        <!-- ------------------1------------- -->
        <div class="form-content">
            <div class="content-box" v-show="currentContent === 1">
                <div class="modal-form columns is-multiline" @click="handleClickOutside">
                    <div class="column is-12 mb-6">
                        <div class="is-flex is-justify-content-space-between ">

                            <h2 class="section-heading"><i style="margin-right: 10px;" class="fas fa-building"
                                    aria-hidden="true"></i>Partner Infomation</h2>
                            
                        </div>

                    </div>

                    <form @submit.prevent="addNewSupplier">
                        <div class="column is-12">
                            <div class="column is-12">
                                <div class="columns mb-4 p-0">
                                    <div class="column is-8">
                                      <div class="field columns mb-4 p-0">
                                        <div class="column is-6 pb-4 cus-input-label">
                                          Company Name
                                        </div>
                                        <div class="column is-7 pb-4">
                                          <VField>
                                          <input
                                          type="text"
                                          required
                                          name="supplierName"
                                          v-model="supplierData.supplierName"
                                          class="mb-2 input is-primary-focus is-primary-focus"
                                          placeholder="Company Name"
                                          />
                                        </VField>
                                        </div>
                                      </div>

                                        <div class="columns mb-4 p-0">
                                            <div class="column is-6 pb-4 cus-input-label">Company House Registration</div>
                                            <div class="column is-7 pb-4">
                                                <VField>
                                                    <input v-model="supplierData.registrationNumber"
                                                        name="registrationNumber" type="text"
                                                        class="mb-2 input is-primary-focus is-primary-focus"
                                                        placeholder="Registration Number" />
                                                </VField>
                                            </div>
                                        </div>

                                        <!-- phone number -->
                                        <div class="columns mb-2 p-0">
                                          <div class="column is-6 pb-4 cus-input-label">
                                            Phone Number
                                          </div>
                                          <div class="column is-8 pb-4">
                                            <VField>
                                           
                                              <VControl expanded>
                                                <VInput
                                                  v-model="supplierData.supplierPhoneNumber"
                                                  name="contactPhoneNumber"
                                                  type="phone"
                                                  placeholder="Phone number"
                                                />
                                              </VControl>
                                            </VField>
                                          </div>
                                        </div>
                                    </div>
                                    <!-- Company logo -->
                                    <div class="column is-6 pb-8">
                                        <div class="columns mb-4 ">
                                           <!-- Company logo -->
                  <VField class="column is-8">
                    <VControl class="is-flex is-justify-content-center mt-0">
                      <VAvatar size="xl" class="profile-v-avatar mt-0">
                        <template #avatar>
                          <img
                            v-if="!isUploading"
                            class="avatar"
                            :src="!logoUrl ? '/images/logoplaceholder.png' : logoUrl"
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
                          @click="()=>{cropLogo = !cropLogo}"
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
                    </VControl>
                    <label style="display: flex; justify-content: center"
                      >Company logo</label
                    >
                  </VField>
                  <my-upload field="img" @crop-success="cropSuccessLogo"  v-model="cropLogo" :noRotate=false :noSquare=false
                 langType="en" img-format="png/jpg"></my-upload>
    
                  
                                        </div>
                                    </div>
                                </div>
                            </div>

                            
                            <div class="">
                                <div class="columns mb-0 p-0">
                                    <div class="column is-8">
                                      <div class="columns mb-4 p-0">
                              <div class="column is-6 pb-4 cus-input-label">
                                Country
                                </div>
          
                                <!-- country here -->
                                <VField class="column is-6 pb-4">
                                  <VControl>
                                    <VSelect
                                      v-model="supplierData.country"
                                      class="is-rounded"
                                    >
                                      <VOption selected disabled value=""
                                        >Select country</VOption
                                      >
                                      <VOption value="United Kingdom"
                                        >United Kingdom</VOption
                                      >
                                      <VOption value="United States"
                                        >United States</VOption
                                      >
                                    </VSelect>
                                  </VControl>
                                </VField>


                            </div>
                                        <!-- industry -->
                                        <div class="columns mb-4 p-0">
                                            <div class="column is-6 pb-4 cus-input-label">
                                                Industry
                                            </div>
                                            <VField class="column is-6 pb-4">
                                                <VControl>
                                                    <VSelect v-model="supplierData.industry" class="is-rounded">
                                                        <VOption selected disabled value="">Select industry</VOption>
                                                        <VOption v-for="(item, index) in compnayIndustries" :key="index"
                                                            :value="item.id">{{ item.name }}
                                                        </VOption>
                                                    </VSelect>
                                                </VControl>
                                            </VField>
                                        </div>

                                        <!-- employees -->
                                        <div class="columns mb-8 p-0">
                                            <div class="column is-6 pb-4 cus-input-label">
                                                Number of employees
                                            </div>
                                            <VField class="column is-6 pb-4" >
                                                <VControl>
                                                    <VSelect v-model="supplierData.noOfEmployees" class="is-rounded">
                                                        <VOption selected disabled value="">No of employees</VOption>
                                                        <VOption value="50">0 - 50</VOption>
                                                        <VOption value="100">50 - 100</VOption>
                                                        <VOption value="200">100 - 200</VOption>
                                                        <VOption value="300">200 - 300</VOption>
                                                        <VOption value="500">300 - 500</VOption>
                                                        <VOption value="1000">500 - 1000</VOption>
                                                    </VSelect>
                                                </VControl>
                                            </VField>
                                        </div>

                                        
                                    </div>
                                    <!-- map -->
                                    <div class="column is-4 pb-2">
                                        <div class="revenue-stat">
                                            <div id="partnerMap" style="height: 220px; width:300px; border-radius: 10px">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- postcode -->
                            <div class="columns mb-4 p-0">
                              <div class="column is-4 pb-4 cus-input-label">Post Code</div>
                              <div class="column is-8 pb-4">
                                <VField addons>
                                  <VControl icon="lnir lnir-search-alt">
                                    <VInput
                                      type="text"
                                      name="postCode"
                                      autocomplete="off"
                                      :loading="isLoading"
                                      v-model="supplierData.postCode"
                                      
                                      class="mb-2 input is-primary-focus is-primary-focus"
                                      placeholder="Post code"
                                    />
                                  </VControl>
                                  <VControl>
                                    <VButton @click="handlePostCodeChange" color="primary" rounded>
                                      Search
                                    </VButton>
                                  </VControl>
                                </VField>
                              </div>
                            </div>

              <div class="columns mb-4 p-0">
                <div class="column is-4 pb-4 cus-input-label">Address</div>
                <div class="column is-7 pb-4">
                  <VField>
                    <VControl>
                      <VTextarea
                        v-model="supplierData.address"
                        type="text"
                        name="address"
                        class="is-primary-focus"
                        rows="2"
                        placeholder="Full Address"
                      >
                      </VTextarea>
                    </VControl>
                  </VField>
                </div>
              </div>

                            <!-- --------------Color------------ -->

                            <div class="columns mb-4 p-0">
                                <div class="column is-4 pb-4 cus-input-label">Marker Color <i
                                        style="color: var(--primary); margin-left: 10px" @click="showColorsPellate"
                                        class="fas fa-paint-brush" aria-hidden="true"></i></div>
                                <div class="column is-4 pb-4 ">
                                    <div>
                                        <div @click="showColorsPellate" class="color-pellate">
                                            <div class="current-color-div" :style="{ backgroundColor: supplierData.color }">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="showColorContainer" style="position: absolute; bottom: 80px;
                                            background-color: white;
                                            width: 350px;
            ">
                                    <div class="colorContainer">
                                        <div class="close-btn">
                                            <i @click="showColorsPellate" class="lnir lnir-close" aria-hidden="true"></i>
                                        </div>

                                        <div v-for="(color, index) in markerColors" :key="color.id"
                                            @click="selecteColor(color)" :style="{ backgroundColor: color.hexCode }"
                                            class="colorDiv">
                                            <i v-if="currentColor == color" class="fas fa-check" aria-hidden="true"></i>
                                        </div>
                                    </div>
                                </div>
                                <div class="column is-4 pb-4">
                                    <VButton type="submit" class="next-tag" rounded>
                                        Save & Continue
                                    </VButton>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <!-- --------------------2--------------- -->

      <div class="content-box" v-show="currentContent == 2">
        <SupplierDocuments @update:OnSuccess="isValidSupplierToken" :id="supplierData.id"  v-if="currentContent == 2" />
        <QuestionsOfMembers v-if="supplierData.id" type="partner" :memberId="supplierData.id" />
        <VButton
          @click="
            () => { addNewSupplier()}"
          style="float: right"
          rounded
          class="next-tag"
          
        >
          Continue
        </VButton>
      </div>

            <!-- -------------------3-------------------------- -->

            <div class="content-box" v-show="currentContent === 3">
        <div class="column is-12 mb-6">
          <h2 class="section-heading">
            <i
              style="margin-right: 10px"
              class="lnir lnir-graph-increase"
              aria-hidden="true"
            ></i>
            Bank / Tax Details
          </h2>
        </div>
        <form @submit.prevent="addNewSupplier" style="overflow: hidden;">
          <div class="modal-form columns is-multiline" style="overflow: hidden;">
            <div class="column is-12" >
              <div class="columns mb-2 p-0">
                <div class="column is-4 pb-4 cus-input-label">
                  VAT Registered
                </div>
                <div class="column is-6 pb-4">
                  <VField>
                    <VControl>
                      <VSwitchBlock
                        @click="supplierData.vatNumber = ''"
                        v-model="VATRegistration"
                        label="Yes"
                      />
                    </VControl>
                  </VField>
                </div>
              </div>
              <div v-if="VATRegistration" class="columns mb-2 p-0">
                <div class="column is-4 pb-4 cus-input-label">VAT Number</div>
                <div class="column is-4 pb-4">
                  <VField>
                    <input
                      v-model="supplierData.vatNumber"
                      type="text"
                      class="mb-2 input is-primary-focus is-primary-focus"
                      placeholder="VAT number"
                    />
                  </VField>
                </div>
              </div>

              <div class="columns mb-2 p-0">
                <div class="column is-4 pb-4 cus-input-label">
                  Unique Tax Reference
                </div>
                <div class="column is-5 pb-4">
                  <VField>
                    <input
                      v-model="supplierData.taxReference"
                      type="text"
                      class="mb-2 input is-primary-focus is-primary-focus"
                      placeholder="Tax Reference"
                    />
                  </VField>
                </div>
                <!-- <div class="column is-4 pb-4">
                  <VButton rounded type="submit" class="next-tag">
                    Save & Continue
                  </VButton>
                </div> -->
              </div>
              <!--  Bank Details  -->
              <!-- 1 -->
              <div class="columns mb-2 p-0">
                <div class="column is-4 pb-4 cus-input-label">Country</div>
                <VField class="column is-5 pb-4">
                  <VControl>
                    <VSelect
                      v-model="supplierData.bankCountry"
                      class="is-rounded"
                    >
                      <VOption selected disabled value=""
                        >Select country</VOption
                      >
                      <VOption value="United Kingdom">United Kingdom</VOption>
                      <VOption value="United States">United States</VOption>
                    </VSelect>
                  </VControl>
                </VField>
              </div>
              <!-- 2 -->
              <div class="columns mb-2 p-0">
                <div class="column is-4 pb-4 cus-input-label">Bank Name</div>
                <div class="column is-5 pb-4">
                  <VField>
                    <input
                      v-model="supplierData.bankName"
                      type="text"
                      class="mb-2 input is-primary-focus is-primary-focus"
                      placeholder="Bank Name"
                    />
                  </VField>
                </div>
              </div>
              <!-- 3 -->
              <div class="columns mb-2 p-0">
                <div class="column is-4 pb-4 cus-input-label">Account Name</div>
                <div class="column is-5 pb-4">
                  <VField>
                    <input
                      type="text"
                      v-model="supplierData.accountName"
                      class="mb-2 input is-primary-focus is-primary-focus"
                      placeholder="Account name
"
                    />
                  </VField>
                </div>
              </div>
              <div class="columns mb-2 p-0">
                <div class="column is-4 pb-4 cus-input-label">Sort Code</div>
                <div class="column is-5 pb-4">
                  <VField>
                    <input
                      v-model="supplierData.sortCode"
                      type="text"
                      class="mb-2 input is-primary-focus is-primary-focus"
                      placeholder="Sort code"
                    />
                  </VField>
                </div>
              </div>
              <div class="columns mb-2 p-0">
                <div class="column is-4 pb-4 cus-input-label">
                  Account Number
                </div>
                <div class="column is-5 pb-4">
                  <VField>
                    <input
                      type="text"
                      v-model="supplierData.accountNumber"
                      class="mb-2 input is-primary-focus is-primary-focus"
                      placeholder="Account number"
                    />
                  </VField>
                </div>
              </div>
              <div class="columns mb-2 p-0">
                <div class="column is-4 pb-4 cus-input-label">
                  Account Reference
                </div>
                <div class="column is-5 pb-4">
                  <VField>
                    <input
                      v-model="supplierData.accountReference"
                      type="text"
                      class="mb-2 input is-primary-focus is-primary-focus"
                      placeholder="Account reference"
                    />
                  </VField>
                </div>
                <!-- addNewSupplier(), -->
                <div class="column is-6 pb-4">
                  <VButton  rounded class="next-tag"   @click="() => { addNewSupplier()}" >
                    Save & Continue
                  </VButton>
                </div>
              </div>

            </div>
          </div>
        </form>
        
      </div>
           <!-----------------------4----------------------  -->
            <div class="content-box" v-show="currentContent === 4">
                <div class="modal-form columns is-multiline">
                    <div class="column is-12 mb-6">
                        <h2 class="section-heading"> <i style="margin-right: 10px;" class="lnir lnir-phone"
                                aria-hidden="true"></i> Contact Details</h2>
                    </div>
                    <form @submit.prevent="addNewSupplier">
                        <div class="column is-12">
                            <div class="columns mb-4 p-0">
                                <div class="column is-6 pb-4 cus-input-label">Website</div>
                                <div class="column is-8 pb-4">
                                    <VField>
                                        <input v-model="supplierData.website" type="url"
                                            class="mb-2 input is-primary-focus is-primary-focus" placeholder="Website" />
                                    </VField>
                                </div>
                            </div>
                            <div class="columns mb-4 p-0">
                                <div class="column is-6 pb-4 cus-input-label">Email</div>
                                <div class="column is-8 pb-4">
                                    <VField>
                                        <input v-model="supplierData.contactEmail" type="email"
                                            class="mb-2 input is-primary-focus is-primary-focus" placeholder="Email
                                " />
                                    </VField>
                                </div>

                            </div>
                            <div class="columns mb-4 p-0">
                                <div class="column is-6 pb-4 cus-input-label">Phone Number</div>
                                <div class="column is-8 pb-4">
                                    <VField>
                                        <input v-model="supplierData.contactPhoneNumber" type="phone"
                                            class="mb-2 input is-primary-focus is-primary-focus"
                                            placeholder="Phone number" />
                                    </VField>
                                </div>
                                <div class="column is-4 pb-4">
                                  <VButton type="submit" class="next-tag" rounded>
                                      Submit
                                  </VButton>
                              </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <VModal is="form" :open="passwordModal" title="Password" size="small" actions="right"
        @submit.prevent="isValidSupplierToken" noclose>
        <template #content>
            <div class="modal-form columns is-multiline">
                <div class="column is-12">
                    <div class="field">
                        <label>Password:</label>
                        <div class="control">
                            <input type="password" name="password" v-model="password" required class="input "
                                placeholder="password" />
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template #action>
            <VButton type="submit" :loading="Loading" color="primary" raised>Confirm</VButton>
        </template>
        <template #cancel>
            <VButton type="submit" style="display: none;" color="primary" raised>Confirm</VButton>
        </template>
    </VModal>
</template>
<style lang="scss" scoped>
.parent-div {
    display: flex;
    position: absolute;
    width: 100%;
    min-height: 80vh;
    border-radius: 8px;
    background-color: #fafafa;
    box-shadow: 0px 1px 6px 1px #898989;
}

.cus-sidebar {
    height: auto;
    width: 25%;
    padding: 20px;
    border-radius: 8px 0 0 8px;
    background: #2aac8e;
    background: -webkit-linear-gradient(to top, #129769, #2aac8e);
    background: linear-gradient(to top, #1D976C, #2aac8e);

    .cus-single-link {
        color: #f1f1f1;
        margin: 16px;
        display: flex;
        gap: 16px;
        padding: 16px;
        border-radius: 8px;
        border: 1px solid #e9e9e952;

        &:hover {
            color: var(--primary);
            background-color: #ffffffb7;
        }

        &.active {
            color: var(--primary);
            background-color: #fffffffb;
        }

    }
}


.form-content {
    height: 100%;
    width: 72%;
    padding: 15px 2%;
    border-radius: 0 8px 8px 0;
    box-sizing: border-box;
    background-color: #fafafa;

    .section-heading {
        margin-left: 24px;
        font-size: 24px;
        color: #888888;
    }
}

.next-tag {
    padding: 10px 14px !important;
    color: #ffffff;
    height: max-content;
    cursor: pointer;
    background-color: var(--primary)
}

.close-icon {
    position: absolute;
    right: 10px;
    top: 10px;
    font-size: 16px;
    color: var(--primary);
    cursor: pointer;
}

.cus-input-label {
    padding-left: 36px;
    font-size: 18px;
    color: #777777;
}

.cus-set-optional {
    font-size: 10px;
    color: #777777;
}

.cus-icon {
    color: #666666;
    display: flex;
    width: 20px;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background-color: #e2e2e2;

    &.active {
        color: #ffffff;
        background-color: #979797ec;
    }
}

.rem-days::after {
    content: attr(data-remaining-days);
    position: absolute;
    top: 10px;
    font-size: 20px;
    color: black;
}
.colorContainer {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    border-radius: 12px;
    padding: 10px 4px;
    padding-top: 40px;
    border: 3px solid var(--primary);

    .colorDiv {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 40px;

        color: #ffffff;
        cursor: pointer;
        width: 22.5%;
        box-sizing: border-box;
        border-radius: 5px;
        margin: 4px;
    }

    .cus-selected {
        height: 40px;
        border: 3px solid var(--primary);
        cursor: pointer;
        width: 22.5%;
        box-sizing: border-box;
        border-radius: 12px;
        margin: 4px;
    }

    .close-btn {
        position: absolute;
        right: 16px;
        top: 10px;

        height: 20px;
        color: var(--primary-light);
        cursor: pointer;
        width: 20px;
    }
}

.color-pellate {
    display: flex;

    i {
        color: var(--primary);
        cursor: pointer;
    }

    .current-color-div {
        height: 36px;
        border: 1px solid #f1f1f1;
        cursor: pointer;
        width: 100%;
        border-radius: 8px;
    }
}
</style>