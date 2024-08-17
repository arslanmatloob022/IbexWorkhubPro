<script setup lang="ts">
import { useNotyf } from "/@src/composable/useNotyf";
import { useCompany } from "/@src/stores/company";
import { useApi } from "/@src/composable/useAPI";
import { useI18n } from "vue-i18n";
import { useUserSession } from "/@src/stores/userSession";

const userSession = useUserSession();
const route = useRoute();
const router = useRouter();
const company = useCompany();
const api = useApi();
let map = {};
const notyf = useNotyf();

const props = defineProps<{
  industry?: number;
}>();

const getWorkers = async () => {
  try {
    const response = await api.get(
      `/v3/api/worker/${company.loggedCompany.id}/worker-short-info/`
    );
    drawMap(response.data);
  } catch {
    notyf.error("Invalid data");
  } finally {
  }
};


const drawMap = (workers: any) => {
  var infowindow = new google.maps.InfoWindow();
  let center = { lat: 51.4497984, lng: -0.3464489 };
  map = new google.maps.Map(document.getElementById("myMap"), {
    center: center,
    scrollwheel: false,
    mapTypeId: google.maps.MapTypeId.Satellite,
    zoom: 5,
  });

  workers.forEach((item: any, index: any) => {
    const marker = new google.maps.Marker({
      position: {
        lat: item.latitude ? item.latitude : 0.0,
        lng: item.longitude ? item.longitude : 0.0,
      },
      map: map,
      title: "Worker",
      icon: {
        url: "/images/marker_new.png",
        scaledSize: new google.maps.Size(20, 30),
      },
    });

    marker.addListener("click", () => {
      var html = `<a href="/sidebar/company/workers/${item.id}"  target="_blank" >
    <div style="display:flex; gap:16px" >
      <div style="display:flex; flex-direction:column; justify-content:center; gap:6px">
        <img src="${
          item.profileImageURL
        }" style="width:34px; height:34px; border-radius:50%" />
        <h4 style="color:#898989; font-size:10px">${item.postCode}</h4>
      </div>
      <div>
        <h6 style="color:#010101; font-weight:500">${
          item.firstName + " " + item.lastName
        }</h6>
        <div style="display:flex; align-items:center; gap:6px; color:#898989; font-size:12px; margin-top:6px">
          <i style="font-size:10px" class="fa fa-envelope-open"></i>
          <h4 style="color:#898989; font-size:12px">${item.emailAddress}</h4>
        </div>
        <div style="display:flex; align-items:center; gap:6px; color:#898989; font-size:12px; margin-top:4px">
          <i style="font-size:10px" class="fa fa-phone"></i>
          <h4 style="color:#898989; font-size:12px">${item.phoneNumber}</h4>
        </div>
      </div>
    </div>
  </a>`;

      infowindow.setContent(html);
      infowindow.open(map, marker);
    });
  });
};

onMounted(() => {
  getWorkers();
});
</script>
<template>
  <div>
    <div
      id="myMap"
      style="height: 650px; width: 80vw; border-radius: 10px"
    ></div>
  </div>
</template>
<style lang="scss" scoped></style>
