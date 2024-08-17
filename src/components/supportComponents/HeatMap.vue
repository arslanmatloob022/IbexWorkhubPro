<script setup lang="ts">
import { ref, onMounted, shallowRef, watch } from "vue";

const props = defineProps<{
  activity: any;
}>();
let data = [];
let map = {};
let heatmap = <any>"";
const initMap = (events: any) => {
  var mapLocations = <any>[];
  var mapLat = 51.45047,
    mapLng = -0.34572;
  events.forEach((element) => {
    if (element.latitude != 0 && element.longitude != 0) {
      mapLocations.push(
        new google.maps.LatLng(element.latitude, element.longitude)
      );
      mapLat = element.latitude;
      mapLng = element.longitude;
    }
  });

  let map = new google.maps.Map(document.getElementById("activity_map2"), {
    zoom: 16,
    center: { lat: mapLat, lng: mapLng },
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  });
  console.log("mapp", map);
  heatmap = new google.maps.visualization.HeatmapLayer({
    data: mapLocations,
    map: map,
    radius: 20,
  });
};

onMounted(() => {
  initMap(props.activity);
  console.log("acitivity", props.activity);
});
</script>

<template>
  <div
    id="activity_map2"
    style="
      border-radius: 20px;
    "
  ></div>
</template>
