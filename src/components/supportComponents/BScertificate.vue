<script setup lang="ts">
import { ref } from "vue";
const route = useRoute();
const props = defineProps({
  id: {
    type: String,
    default: 0
  }
})

const currentDate = ref<Date>(new Date());
const cerficateModal = ref(true);

const formattedDate = computed(() => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return currentDate.value.toLocaleDateString('en-US', options);
});

setInterval(() => {
  currentDate.value = new Date();
}, 1000);

const CertificateData = ref({
  id: 0,
  headerLogo1: "",
  headerLogo2: "",
  completionDate: "OF BS7858 VETTING COMPLETION ON ",
  certificateName: '',
  certificateLogo: "",
  certificateTitle:
    "FOR COMPLETING BACKGROUND CHECKS AND ELIGIBILITY TO WORK IN SECURITY ENVIROMENTS ON BOLD SECURITY GROUP SITES.",
  certificateDescription:
    "The BS7858 Standard that Bold Security Group adheres to is the code of practice released by BSI (British Standards Institution) that detail best practices and guidelines for the security screening of the individuals employed within a security enviroment.",
  signature: "M. Umer",
  otherLogos: "",
});
const printCertificate = () => {
  window.print();
};

onMounted(() => {
  // displayCurrentdate()
})
</script>
<template>
  <div style="width:100%; display:flex; justify-content:center">
    <div style="width:64%; height:100%">
      <div class="container mt-6">
        <div>
          <br />
          <div class="header">
            <!-- <img
              src="https://humanalytics.s3.eu-west-2.amazonaws.com/4/companyLogo/2022-10-18zabsxsx-Screenshot_from_2022-09-13_11-16-10.png"
              alt=""
              style="width: 95px; height: 70px"
            /> -->
            <div class="is-flex">
              <img style="width:auto; height:70px" src="/images/logos/favicon_512x512.png" />
              <div>
                <h3  style="font-size:32px; color:var(--primary); text-align:left" class="cus-stat-heading ml-3 mt-0">Arez</h3>
                <h3  style="font-size:14px;" class="cus-stat-heading ml-3 mt-0">The Compliance Manager</h3>
              </div>
            </div>
          </div>
          <br />
          <div>
            <h1 class="title-certificate">CERTIFICATE</h1>
            <p style="
                padding: 0px;
                font-size: 15px;
                color: black;
                font-weight: bold;
              ">
              {{ CertificateData.completionDate }} {{ formattedDate }}
            </p>
          </div>
          <br />
          <div>
            <p>THIS CERTIFICATE IS AWARDED TO</p>
            <h1 class="employee-name">{{ $route.query.name.replace('%20', ' ') }}</h1>
            <img style="height:78px; width:auto" class="sia-img" src="https://app.arez.io/assets/img/sia-logo.png"
              alt="" />
          </div>
          <br />
          <div>
            <p style="
                color: black;
                width: 500px;
                margin-bottom: 30px;
                font-weight: 500;
              ">
              {{ CertificateData.certificateTitle }}
            </p>
            <p style="font-weight: 400; width: 500px">
              {{ CertificateData.certificateDescription }}
            </p>
          </div>
          <br />
          <div>
            <div>
              <img
                src="https://humanalytics.s3.eu-west-2.amazonaws.com/4/operationalManagerSignature/2022-10-20lnkaikq-Signature.png"
                alt="" />
              <h5 style="font-weight: 400; font-family:sans-serif">{{ $route.query.name.replace('%20', ' ') }}</h5>
            </div>
            <br />
          </div>
          <br />
          <div class="row">
            <div>
              <img
                src="https://humanalytics.s3.eu-west-2.amazonaws.com/certifications/certificationsLogo/2022-10-24olfjhmf-SIA.png"
                alt="img1" />
            </div>
            <div>
              <img
                src="https://humanalytics.s3.eu-west-2.amazonaws.com/certifications/certificationsLogo/2022-10-24elbqqwq-iso-9001.png"
                alt="img2" />
            </div>
            <div>
              <img
                src="https://humanalytics.s3.eu-west-2.amazonaws.com/certifications/certificationsLogo/2022-10-24dncadhh-safe.png"
                alt="img3" />
            </div>
          </div>
          <div class="row">
            <div>
              <img
                src="https://humanalytics.s3.eu-west-2.amazonaws.com/certifications/certificationsLogo/2022-10-24vijcylk-RISQ.png"
                alt="img1" />
            </div>
            <div>
              <img
                src="https://humanalytics.s3.eu-west-2.amazonaws.com/certifications/certificationsLogo/2022-10-24muingcq-cyber-2.png"
                alt="img2" />
            </div>
            <div>
              <img
                src="https://humanalytics.s3.eu-west-2.amazonaws.com/certifications/certificationsLogo/2022-10-24pjciemj-LIVIING.png"
                alt="img3" />
            </div>
          </div>
        </div>
      </div>
    <div style="float:right; margin-top:14px">
      <VButton @click="printCertificate" class="print-button" color="info" raised icon="fas fa-print">Print </VButton>
      <!-- <VButton color="primary" raised icon="fas fa-download">Download</VButton> -->
    </div>
    
  </div>
</div>
</template>

<style lang="scss" scoped>
@media print {
  .print-button {
    display: none
  }
 
}

.container {
  background-image: url("https://app.arez.io/assets/img/certificate_bg_image.png");
  background-size: cover;
  display: flex;
  justify-content: center;
  text-align: center;
  align-items: center;
  background-position: center center;
}

.header {
  display: flex;
  justify-content: space-around;
}

.title-certificate {
  font-size: 45px;
  font-weight: bold;
  letter-spacing: 2px;
}

.employee-name {
  font-size: 25px;
  font-weight: bold;
}

.sia-img {
  width: 50px;
  height: 50px;
}

.row {
  display: flex;
  justify-content: center;
  width: 60%;
  margin-left: auto;
  margin-right: auto;
}

.row img {
  margin-right: 10px;
  width: 100px;
}

 @media print {
  .container {
    min-height: auto;
    overflow: visible;
    display: block;
  }
}

/*cetrificate styling end */
</style>