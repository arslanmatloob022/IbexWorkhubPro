<script setup lang="ts">
import axios from "axios";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { markerColors } from "/@src/composable/useSupportElement";

const notyf = useNotyf();
const api = useApi();
const isLoading = ref(false);
const showColorContainer = ref(false);
const currentColor = ref({
  id: 0,
  hexCode: "",
});
const data = ref<any>({});
const isShow = ref(false);
const editor = shallowRef<any>();

export interface SideData {
  id: number;
  name: string;
  address: string;
  postcode: string;
  latitude: 0.0;
  longitude: 0.0;
  city: string;
  inchargeName: string;
  inchargePhoneNo: string;
  inchargeEmail: string;
  comments: string;
  geofence: object;
}
const siteData = ref({
  id: 0,
  name: "",
  address: "",
  postcode: "",
  latitude: 0.0,
  longitude: 0.0,
  city: "",
  inchargeName: "",
  inchargePhoneNo: "",
  inchargeEmail: "",
  comments: "",
  geofence: {},
  color: "#D875C7",
});

const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: null): void;
}>();

const props = defineProps<{
  AddSiteModalOpen?: boolean;
  contractId: String;
  EditSiteID: String;
}>();

const closeModalHandler = () => {
  emit("update:modalHandler", false);
};

let map = "";
const handlePostCodeChange = async () => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${siteData.value.postcode}&key=AIzaSyDWHedwkLGGa4_3XgPqYxIzMkFpOdKJRik`
    );
    if (response.data.status === "OK") {
      siteData.value.address = response.data.results[0].formatted_address;

      const lat = response.data.results[0].geometry.location.lat;
      siteData.value.latitude = lat;
      const lng = response.data.results[0].geometry.location.lng;
      siteData.value.longitude = lng;
      notyf.success("Address Added");
      runMaps();
    } else if (response.data.status === "ZERO_RESULTS") {
      notyf.error("Invalid Post-Code");
    }
  } catch (error) {
    notyf.error("Invalid Post-Code");
    console.error(error);
  }
};

var runMaps = function () {
  map = new google.maps.Map(document.getElementById("map"), {
    center: {
      lat: siteData.value.latitude,
      lng: siteData.value.longitude,
    },
    zoom: 18,
  });
  google.maps.event.addListener(map, "click", function (event) {
    placeMarker(event.latLng);
    console.log(event.latLng.toUrlValue(5));
  });

  // Pointer
  const marker = new google.maps.Marker({
    position: {
      lat: siteData.value.latitude ? siteData.value.latitude : 51.449927,
      lng: siteData.value.longitude ? siteData.value.longitude : -0.34712,
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

  function placeMarker(location: any) {
    var marker = new google.maps.Marker({
      position: location,
      map: map,
    });
  }
  var all_overlays = [];
  var selectedShape;
  var drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.MARKER,
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: [
        //google.maps.drawing.OverlayType.MARKER,
        google.maps.drawing.OverlayType.CIRCLE,
        google.maps.drawing.OverlayType.POLYGON,
        google.maps.drawing.OverlayType.RECTANGLE,
      ],
    },
    markerOptions: {
      icon: "images/beachflag.png",
    },
    circleOptions: {
      fillColor: "#ffff00",
      fillOpacity: 0.2,
      strokeWeight: 3,
      clickable: false,
      editable: true,
      zIndex: 1,
    },
    polygonOptions: {
      clickable: true,
      draggable: true,
      editable: true,
      fillColor: "#2aac8e",
      fillOpacity: 0.4,
    },
    rectangleOptions: {
      clickable: true,
      draggable: true,
      editable: true,
      fillColor: "#ffff00",
      fillOpacity: 0.5,
    },
  });

  function clearSelection() {
    if (selectedShape) {
      selectedShape.setEditable(false);
      selectedShape = null;
    }
  }

  function setSelection(shape) {
    clearSelection();
    selectedShape = shape;
    shape.setEditable(true);
    console.log("shpes", shape);
    getPolygonCoords(selectedShape);
    // google.maps.event.addListener(selectedShape.getPath(), 'insert_at', getPolygonCoords(shape));
    // google.maps.event.addListener(selectedShape.getPath(), 'set_at', getPolygonCoords(shape));
  }

  function deleteSelectedShape() {
    if (selectedShape) {
      selectedShape.setMap(null);
    }
  }

  function CenterControl(controlDiv: any, map: any) {
    var controlUI = document.createElement("div");
    controlUI.style.backgroundColor = "#fff";
    controlUI.style.border = "2px solid #fff";
    controlUI.style.borderRadius = "3px";
    controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
    controlUI.style.cursor = "pointer";
    controlUI.style.marginBottom = "22px";
    controlUI.style.textAlign = "center";
    controlUI.title = "Select to delete the shape";
    controlDiv.appendChild(controlUI);

    var controlText = document.createElement("div");
    controlText.style.color = "#FF0000";
    controlText.style.fontFamily = "Roboto,Arial,sans-serif";
    controlText.style.fontSize = "16px";
    controlText.style.lineHeight = "38px";
    controlText.style.paddingLeft = "5px";
    controlText.style.paddingRight = "5px";
    controlText.innerHTML = "Delete Selected Area";
    controlUI.appendChild(controlText);

    controlUI.addEventListener("click", function () {
      deleteSelectedShape();
    });
  }

  drawingManager.setMap(map);

  function getPolygonCoords(newShape: any) {
    const len = newShape.getPath().getLength();
    const coordinates = [];

    for (let i = 0; i < len; i++) {
      const coordinate = newShape.getPath().getAt(i).toUrlValue(6);
      const [lat, lng] = coordinate.split(",");
      coordinates.push({
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      });
    }
    siteData.value.geofence = coordinates;
  }

  google.maps.event.addListener(
    drawingManager,
    "polygoncomplete",
    function (event) {
      event.getPath().getLength();
      google.maps.event.addListener(event.getPath(), "insert_at", function () {
        var len = event.getPath().getLength();
        for (var i = 0; i < len; i++) {
          console.log(event.getPath().getAt(i).toUrlValue(5));
        }
      });
      google.maps.event.addListener(event.getPath(), "set_at", function () {
        var len = event.getPath().getLength();
        for (var i = 0; i < len; i++) {
          console.log(event.getPath().getAt(i).toUrlValue(5));
        }
      });
    }
  );

  google.maps.event.addListener(
    drawingManager,
    "overlaycomplete",
    function (event) {
      all_overlays.push(event);
      if (event.type !== google.maps.drawing.OverlayType.MARKER) {
        drawingManager.setDrawingMode(null);
        //Write code to select the newly selected object.

        var newShape = event.overlay;
        newShape.type = event.type;
        google.maps.event.addListener(newShape, "click", function () {
          setSelection(newShape);
        });

        setSelection(newShape);
      }
    }
  );

  var centerControlDiv = document.createElement("div");
  var centerControl = new CenterControl(centerControlDiv, map);

  centerControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(
    centerControlDiv
  );
};

const addSiteData = async () => {
  if (!siteData.value.latitude && !siteData.value.longitude) {
    return notyf.error("Please enter valid Post Code!");
  }
  isLoading.value = true;
  try {
    if (props.EditSiteID) {
      const response = await api.patch(`/v3/api/site/${props.EditSiteID}/`, {
        contract: props.contractId,
        name: siteData.value.name,
        address: siteData.value.address,
        postcode: siteData.value.postcode,
        latitude: siteData.value.latitude,
        longitude: siteData.value.longitude,
        city: siteData.value.city,
        inchargeName: siteData.value.inchargeName,
        inchargePhoneNo: siteData.value.inchargePhoneNo,
        inchargeEmail: siteData.value.inchargeEmail,
        comments: siteData.value.comments,
        color: siteData.value.color,
        geofence: JSON.stringify(siteData.value.geofence),
      });
      emit("update:OnSuccess", null);
      notyf.success("Site updated Successfuly");
      closeModalHandler();
      isLoading.value = false;
    } else {
      const response = await api.post("/v3/api/site/", {
        contract: props.contractId,
        name: siteData.value.name,
        address: siteData.value.address,
        postcode: siteData.value.postcode,
        latitude: siteData.value.latitude,
        longitude: siteData.value.longitude,
        city: siteData.value.city,
        inchargeName: siteData.value.inchargeName,
        inchargePhoneNo: siteData.value.inchargePhoneNo,
        inchargeEmail: siteData.value.inchargeEmail,
        comments: siteData.value.comments,
        color: siteData.value.color,
        geofence: JSON.stringify(siteData.value.geofence),
      });
      emit("update:OnSuccess", null);
      notyf.success("Site Added Successfuly");
      closeModalHandler();
    }
    isLoading.value = false;
  } catch (err) {
    console.log(err);
    isLoading.value = false;
  }
};

// Get Prev Info Edit Company ()

const getEditSite = async () => {
  const resp = await api.get(`/v3/api/site/${props.EditSiteID}/`);
  siteData.value = resp.data;
  data.value = resp.data;
  console.log("Data:", data.value.geofence ? data.value.geofence.length : 0);
};

// // ------Color Code Picker------->
const showColorsPellate = () => {
  showColorContainer.value = !showColorContainer.value;
};

const selecteColor = (color: any) => {
  currentColor.value = color;
  showColorContainer.value = false;
  siteData.value = { ...siteData.value, color: color.hexCode };
};

// End Color
onMounted(() => {
  if (props.EditSiteID) {
    getEditSite();
  }
  if (!props.EditSiteID) {
    runMaps();
  }
});

// -----------Test Editor------------->

const CKEditor = defineAsyncComponent(() =>
  import("@ckeditor/ckeditor5-vue").then((m) => m.default.component)
);

const editorConfig = {
  fontFamily: {
    options: ['"Montserrat", sans-serif', '"Roboto", sans-serif'],
  },
  height: "400px",
  minHeight: "400px",
  maxHeight: "600px",
};

onMounted(async () => {
  // lazy load the editor when the component is mounted
  editor.value = await import("@ckeditor/ckeditor5-build-classic").then(
    (m) => m.default
  );
});
</script>

<template>
  <VModal
    is="form"
    size="xl"
    :open="props.AddSiteModalOpen"
    :title="props.EditSiteID ? 'Update Site' : 'Add Site'"
    actions="right"
    @submit.prevent="addSiteData"
    @close="closeModalHandler"
  >
    <template #content>
      <div class="modal-form columns is-multiline">
        <div class="field column is-12 mb-0">
          <div class="field columns is-multiline mb-0 cu-all-input">
            <div class="field column is-6 mb-0">
              <div class="field column is-12 mb-0">
                <label>Site Name *</label>
                <div class="control">
                  <input
                    type="text"
                    name="title"
                    required
                    v-model="siteData.name"
                    class="input is-primary-focus"
                    placeholder="Site name"
                  />
                </div>
              </div>
              <div class="field column is-12 mb-0">
                <label>Post Code *</label>

                <div class="control" style="position: relative">
                  <VButton
                    color="primary"
                    light
                    style="
                      position: absolute;
                      right: 0.2rem;
                      top: 0.3rem;
                      z-index: 10;
                      width: 3rem;
                      border-radius: 2rem;
                    "
                    @click="
                      () => {
                        isShow = true;
                        handlePostCodeChange();
                      }
                    "
                    ><i
                      class="iconify"
                      data-icon="feather:search"
                      aria-hidden="true"
                      style="font-size: 1.5rem"
                    ></i
                  ></VButton>
                  <input
                    type="text"
                    name="postcode"
                    required
                    v-model="siteData.postcode"
                    class="input is-primary-focus"
                    placeholder="Enter post-code"
                    @blur="handlePostCodeChange"
                  />
                </div>
              </div>

              <div class="field column is-12 mb-0">
                <label>Site Address:</label>

                <div class="control">
                  <input
                    type="text"
                    name="title"
                    v-model="siteData.address"
                    class="input is-primary-focus"
                    placeholder="Site address"
                  />
                </div>
              </div>
              <!--  -->
              <div class="field column is-12 mb-0">
                <label>City</label>
                <div class="control">
                  <input
                    type="text"
                    name="city"
                    v-model="siteData.city"
                    class="input is-primary-focus"
                    placeholder="City"
                  />
                </div>
              </div>
            </div>
            <div class="field column is-6 mb-0">
              <div class="field column is-12 mb-0">
                <label>Site Manager Name</label>
                <div class="control">
                  <input
                    type="text"
                    name="title"
                    v-model="siteData.inchargeName"
                    class="input is-primary-focus"
                    placeholder="Manager Name"
                  />
                </div>
              </div>
              <div class="field column is-12 mb-0">
                <label>Phone</label>
                <div class="control">
                  <input
                    type="text"
                    name="phone"
                    v-model="siteData.inchargePhoneNo"
                    class="input is-primary-focus"
                    placeholder="Phone"
                  />
                </div>
              </div>
              <div class="field column is-12 mb-0">
                <label>Email</label>
                <div class="control">
                  <input
                    type="email"
                    name="Email"
                    v-model="siteData.inchargeEmail"
                    class="input is-primary-focus"
                    placeholder="Email"
                  />
                </div>
              </div>
              <!-- --------------Color Picker--------- -->
              <div
                class="field column is-12 mt-5"
                style="
                  position: relative;
                  margin-left: 0.4rem;
                  cursor: pointer;
                  display: flex;
                  align-items: center;
                  flex-direction: row;
                "
              >
                <div
                  class=""
                  style="
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    width: 70%;
                  "
                >
                  <div
                    class="column is-4 pb-4 cus-input-label"
                    style="
                      display: flex;
                      align-items: center;
                      gap: 0.5rem;
                      color: #bbb;
                      font-weight: 500;
                      width: 100%;
                    "
                    @click="showColorsPellate"
                  >
                    Color
                    <i
                      style="
                        color: var(--primary);
                        margin-left: 10px;
                        size: 3rem;
                      "
                      class="fas fa-paint-brush"
                      aria-hidden="true"
                    ></i>
                  </div>
                  <div class="column is-4 pb-4">
                    <div>
                      <div @click="showColorsPellate" class="color-pellate">
                        <div
                          class="current-color-div"
                          :style="{ backgroundColor: siteData.color }"
                          style="width: 5rem"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                <!--  -->
                <div
                  v-if="showColorContainer"
                  style="
                    position: absolute;
                    bottom: 3.5rem;
                    background-color: white;
                    width: 350px;
                    right: 3rem;
                    z-index: 999;
                  "
                >
                  <div class="colorContainer">
                    <div class="close-btn">
                      <i
                        @click="showColorContainer = false"
                        class="lnir lnir-close"
                        aria-hidden="true"
                      ></i>
                    </div>

                    <div
                      v-for="(color, index) in markerColors"
                      :key="color.id"
                      @click="selecteColor(color)"
                      :style="{ backgroundColor: color.hexCode }"
                      class="colorDiv"
                    >
                      <i
                        v-if="currentColor == color"
                        class="fas fa-check"
                        aria-hidden="true"
                      ></i>
                    </div>
                  </div>
                </div>
              </div>

              <!--  -->
            </div>
          </div>
        </div>
        <div class="field column is-12 mb-0">
          <div
            class=""
            style="
              display: flex;
              align-items: end;
              justify-content: end;
              margin-bottom: 0.8rem;
            "
            v-if="props.EditSiteID"
          >
            <span
              style="font-size: 1rem; color: #bbb; cursor: pointer"
              @click="
                () => {
                  isShow = !isShow;
                  handlePostCodeChange();
                }
              "
              >Edit Geofence
              <i
                class="iconify"
                data-icon="feather:edit-2"
                aria-hidden="true"
                style="color: #666; font-size: 1.2rem"
              ></i
            ></span>
          </div>
          <div>
            <div
              v-if="!props.EditSiteID || isShow === true"
              id="map"
              style="width: 100%; height: 380px; background-color: #f3f3f3"
            ></div>
            <PolygonMap
              v-if="
                props.EditSiteID && data && data.geofence && isShow === false
              "
              style="width: 100%; height: 380px"
              :siteData="data"
            />
            <!--  -->
          </div>
        </div>
        <!-- Description / Comment -->
        <div class="field column is-12 mb-0 mt-0" style="padding: 0px 20px">
          <label>Comment</label>
          <div class="columns">
            <div class="column is-12 content" style="">
              <CKEditor
                v-if="editor"
                v-model="siteData.comments"
                :editor="editor"
                :config="editorConfig"
                style="color: #fff"
              />
              <VPlaceload v-else height="500px" />
            </div>
          </div>
        </div>
        <!--  -->
      </div>
    </template>
    <template #action>
      <VButton type="submit" color="primary" :loading="isLoading" raised>{{
        props.EditSiteID ? "Update & close" : "Save & close"
      }}</VButton>
    </template>
  </VModal>
</template>
<style scoped lang="scss">
.cus-icon {
  color: var(--primary);
  display: flex;
  width: 20px;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: #ffffff;

  &.active {
    color: #ffffffec;
    background-color: var(--primary);
  }
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
    width: 5rem;
    border-radius: 8px;
  }
}
.current-color-div {
  height: 36px;
  border: 1px solid #f1f1f1;
  cursor: pointer;
  width: 5rem;
  border-radius: 8px;
}
</style>
