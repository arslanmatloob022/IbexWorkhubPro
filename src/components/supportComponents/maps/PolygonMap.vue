<script setup lang="ts">
const props = defineProps<{
  siteData: any;
}>();

const drawSitePolygon = (data: any) => {
  console.log("ploygon data", data);
  const coordinates = <any>[];
  const map = new google.maps.Map(document.getElementById("plyGonMap"), {
    zoom: 14,
    center: {
      lat: data.latitude ? data.latitude : 51.449927,
      lng: data.longitude ? data.longitude : -0.34712,
    },
  });

  const marker = new google.maps.Marker({
    position: {
      lat: data.latitude ? data.latitude : 51.449927,
      lng: data.longitude ? data.longitude : -0.34712,
    },
    map: map,
    title: "Site Location",
    icon: {
      path: "M-1.547 12l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
      scale: 2.5,
      strokeWeight: 2,
      fillOpacity: 1,
      fillColor: "#FB0E03",
      anchor: new google.maps.Point(0, 20),
    },
  });

  if (Array.isArray(data.geofence)) {
    data.geofence.forEach((location: any) => {
      console.log("lat", location.lat);
      coordinates.push({ lat: location.lat, lng: location.lng });
    });
  }

  const polygon = new google.maps.Polygon({
    paths: coordinates,
    strokeColor: "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#FF0000",
    fillOpacity: 0.35,
  });

  polygon.setMap(map);
};

onMounted(() => {
  console.log("site data", props.siteData);
  drawSitePolygon(props.siteData);
});
</script>

<template>
  <div id="plyGonMap" style="border-radius: 20px; width: 100%"></div>
</template>
