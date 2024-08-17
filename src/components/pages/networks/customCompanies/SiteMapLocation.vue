<script setup lang="ts">
let map = {};

const props = defineProps<{
  companyId: String;
  sites: {
    type: Array;
    default: [];
  };
}>();

const drawMap = (workers: any) => {
  var infowindow = new google.maps.InfoWindow();
  let center = { lat: 51.4497984, lng: -0.3464489 };
  map = new google.maps.Map(document.getElementById("myMap"), {
    center: center,
    scrollwheel: false,
    mapTypeId: google.maps.MapTypeId.Satellite,
    zoom: 8,
  });

  workers.forEach((item: any, index: any) => {
    const marker = new google.maps.Marker({
      position: { lat: item.latitude, lng: item.longitude },
      map: map,
      title: "Worker",
      icon: {
        url: "/images/marker_new.png",
        scaledSize: new google.maps.Size(20, 30),
      },
    });

    marker.addListener("click", () => {
      var html = `<div style="display:flex; flex-direction: column;  gap:16px">
                <div>
                <h3 style="color:#010101; font-size:20px font-weight:500">${item.name}</h3>
                </div>
                <div style="display:flex; flex-direction:column; justify-content:center;  gap:6px">
                    <h4 style="color:#898989; font-size:14px font-weight:500 "> Post Code: ${item.postcode}</h4>
                    <h4 style="color:#898989; font-size:14px font-weight:500 "> Latitude: ${item.latitude}</h4>
                    <h4 style="color:#898989; font-size:14px font-weight:500 "> Longitude: ${item.longitude}</h4>
                    <h4 style="color:#898989; font-size:14px font-weight:500 "> Manager: ${item.inchargeName}</h4>
                    <h4 style="color:#898989; font-size:14px font-weight:500 "> Phone No: ${item.inchargePhoneNo}</h4>
                </div>
            
            </div>`;
      infowindow.setContent(html);
      infowindow.open(map, marker);
    });
  });
};

onMounted(() => {
  // getWorkers();
  drawMap(props.sites);
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
