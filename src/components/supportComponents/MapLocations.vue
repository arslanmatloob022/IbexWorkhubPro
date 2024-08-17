<script setup lang="ts">
import { useNotyf } from "/@src/composable/useNotyf";
import { useCompany } from "/@src/stores/company";
import { useApi } from "/@src/composable/useAPI";
import { useI18n } from "vue-i18n";

const api = useApi();
const compnay = useCompany()
let map ={}
const notyf = useNotyf();
const workers =[


  {
    "id": 4970,
    "firstName": "Reece",
    "lastName": "Cole",
    "latitude": 54.36128611626928,
    "longitude": -7.879033993639625,
    "postCode": "DH23 0JZ",
    "phoneNumber": "+4420 7496 0078",
    "emailAddress": "michelleoliver@example.com"
  },
  {
    "id": 4969,
    "firstName": "Anthony",
    "lastName": "Harris",
    "latitude": 55.14902355894821,
    "longitude": -0.022829995614303655,
    "postCode": "M2 6RQ",
    "phoneNumber": "+44(0)114 496 0615",
    "emailAddress": "nharrison@example.org"
  },
  {
    "id": 4968,
    "firstName": "Graham",
    "lastName": "Phillips",
    "latitude": 55.72712175348903,
    "longitude": -1.4423235916851844,
    "postCode": "LL8 8QA",
    "phoneNumber": "01632960268",
    "emailAddress": "johnjones@example.net"
  },
  {
    "id": 4967,
    "firstName": "Eric",
    "lastName": "Lee",
    "latitude": 58.09056405646173,
    "longitude": -0.4705354714978025,
    "postCode": "N1 0SQ",
    "phoneNumber": "0306 9990976",
    "emailAddress": "claresmith@example.com"
  },
  {
    "id": 4966,
    "firstName": "Amy",
    "lastName": "French",
    "latitude": 56.98808533212379,
    "longitude": -0.32353791668947274,
    "postCode": "B22 8XB",
    "phoneNumber": "+44(0)2074960874",
    "emailAddress": "paulinearnold@example.net"
  },
  {
    "id": 4965,
    "firstName": "Luke",
    "lastName": "Brooks",
    "latitude": 58.783241363112374,
    "longitude": -5.512144084722267,
    "postCode": "L7D 1WY",
    "phoneNumber": "+441614960224",
    "emailAddress": "iedwards@example.net"
  },
  {
    "id": 4964,
    "firstName": "Leonard",
    "lastName": "Jones",
    "latitude": 52.136268489636414,
    "longitude": -8.891053719830207,
    "postCode": "G52 6GJ",
    "phoneNumber": "(0113) 496 0281",
    "emailAddress": "cmarshall@example.org"
  },
  {
    "id": 4963,
    "firstName": "Robert",
    "lastName": "Johnson",
    "latitude": 56.305041267083006,
    "longitude": -5.836712456312856,
    "postCode": "DN7P 8WF",
    "phoneNumber": "(0114)4960060",
    "emailAddress": "khanvincent@example.com"
  },
  {
    "id": 4962,
    "firstName": "Eileen",
    "lastName": "Norris",
    "latitude": 57.596223931521045,
    "longitude": -3.7360281280856062,
    "postCode": "KY3 9DU",
    "phoneNumber": "01134960099",
    "emailAddress": "sheilaball@example.com"
  },
  {
    "id": 4961,
    "firstName": "Abbie",
    "lastName": "Jones",
    "latitude": 58.18991214325568,
    "longitude": -8.859018512143663,
    "postCode": "LD35 7PL",
    "phoneNumber": "+44(0)1614960989",
    "emailAddress": "powellryan@example.org"
  },
  {
    "id": 4960,
    "firstName": "Elaine",
    "lastName": "Page",
    "latitude": 55.87374813081417,
    "longitude": -7.796142770834104,
    "postCode": "EX1R 3ND",
    "phoneNumber": "0113 496 0332",
    "emailAddress": "rmistry@example.com"
  }]

const props = defineProps<{
    industry?: number;
}>();



const drawMap = (workers: any) => {
    let center = { lat: 51.44979840, lng: -0.34644890 };
    map = new google.maps.Map(document.getElementById("myMap"), {
        center: center,
        scrollwheel: false,
        mapTypeId: google.maps.MapTypeId.Satellite,
        zoom: 6,
    });

    workers.forEach((item: any, index: any) => {


        console.log("inside loop");
    

        // Create marker for each worker
        const marker = new google.maps.Marker({
            position: { lat: item.latitude, lng: item.longitude },
            map: map,
            title: "Worker", // Set a title for the marker if needed
        });
    });
};



const getWorkers = async () => {
    try {
        const response = await api.get(`/v3/api/worker/${compnay.loggedCompany.id}/sdfdsfdsfworker-short-info/`,);
        // notyf.success("Invitation SMS sent successfully")
        drawMap(response.data)
    } catch {
        // notyf.error("Invalid data")
    } finally {
  
    }
}

onMounted(() => {
    getWorkers()
});
</script>
<template>
        <!-- <Transition name="fade-slow"> -->
            <div >
              
                <div id="myMap" style="height: 650px; width:80vw; border-radius: 10px"></div>

            </div>
        <!-- </Transition> -->

</template>
<style lang="scss" scoped>
</style>