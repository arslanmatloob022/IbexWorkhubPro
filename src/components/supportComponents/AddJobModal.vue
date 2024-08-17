<script setup lang="ts">
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { useCompany } from "/@src/stores/company";
import { convertToFormData } from "/@src/composable/useSupportElement";
import { markerColors } from "/@src/composable/useSupportElement";
const notyf = useNotyf();
const api = useApi();
const isLoading = ref(false);
const company = useCompany();
const editor = shallowRef<any>();
const route = useRoute();
const showColorContainer = ref(false);
const jobShift = ref("longTerm");
const availabilityDays = ref([]);
const approval = ref(false);
const currentColor = ref({
  id: 0,
  hexCode: "",
});

const props = defineProps<{
  openSiteJobModel?: boolean;
  id: {
    type: String;
    default: 0;
  };
  siteID: String;
}>();
// ----------->  siteID

const wizard = ref({
  step: 1,
  stepTitle: "Contact Info",
  data: <any>{},
});
// ------------>

const FormData = ref({
  id: "",
  jobName: "",
  description: "",
  shift: "",
  startDate: "",
  endDate: "",
  startTime: "",
  endTime: "",
  hourlyRate: 0,
  overtimeRate: 0,
  jobType: "",
  site: props.siteID,
  color: "#D875C7",
  workingDays: [],
  isApproval: false,
});
// computed(() => JSON.stringify(availabilityDays.value))
// <--------------Industry------------->

const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: null): void;
}>();

const addJobHandler = async () => {
  FormData.value.isApproval = approval.value;
  FormData.value.workingDays = JSON.stringify(availabilityDays.value);
  FormData.value.jobType = jobShift.value;

  try {
    isLoading.value = true;
    const formDataAPI = convertToFormData(FormData.value, ["logo"]);
    formDataAPI.append("arezCompany", company.loggedCompany.id);

    if (FormData.value.id) {
      const response = await api.patch(
        `/v3/api/jobs/${FormData.value.id}/`,
        formDataAPI
      );
      notyf.success("Job edit succesfully.");
      closeModalHandler();
    } else {
      if (!FormData.value.site) {
        return notyf.error("Contract Site Id required!");
      }
      const response = await api.post("/v3/api/jobs/", formDataAPI);
      closeModalHandler();
      notyf.dismissAll();
      notyf.success("New Job added");
    }

    emit("update:OnSuccess", null); // Emit an event to update the prop
  } catch (error: any) {
    let errorObj = error.response.data ?? {};
    Object.values(errorObj).forEach((values) => {
      values.forEach((value: any) => {
        notyf.error(` ${value}, New Contract`);
      });
    });
  } finally {
    isLoading.value = false;
  }
};

const closeModalHandler = () => {
  emit("update:modalHandler", false); // Emit an event to update the prop
  console.log("modal closed");
  FormData.value = {
    jobName: "",
    description: "",
    shift: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    hourlyRate: 0,
    overtimeRate: 0,
    jobType: "",
    color: "",
  };
};

// Get Prev Info Edit Company ()

const getContract = async () => {
  const resp = await api.get(`/v3/api/jobs/${props.id}/`);
  FormData.value = resp.data;

  console.log("Get Jobs:",resp.data)
  jobShift.value = resp.data.jobType
  availabilityDays.value = resp.data.workingDays
  approval.value = resp.data.isApproval
  // 
  // FormData.value.jobType = resp.data.jobs.jobType
  // FormData.value.workingDays = resp.data.jobs.workingDays
  // FormData.value.isApproval = resp.data.jobs.isApproval
};

// ------Color Code Picker------->
const showColorsPellate = () => {
  showColorContainer.value = !showColorContainer.value;
};

const selecteColor = (color: any) => {
  currentColor.value = color;
  showColorContainer.value = false;
  FormData.value = { ...FormData.value, color: color.hexCode };
};

onMounted(async () => {
  if (props.id) {
    await getContract();
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

const shift = ["day", "night"];
const jobType = ["fullTime", "partTime"];

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
    :open="props.openSiteJobModel"
    :title="FormData.id ? 'Edit Job Placement Details' : 'Job Placement Details'"
    size="xl"
    actions="right"
    @submit.prevent="addJobHandler"
    @close="closeModalHandler"
    noclose
  >
    <template #content>
      <!--------------- Section 1 (Contact Info) ------------- -->
      <div class="" v-show="wizard.step === 1">
        <div class="" v-show="wizard.step === 1">
          <div class="modal-form columns cu-all-input is-multiline">
            <div class="column is-12" style="margin-top: -1rem">
              <!-- Content -->
              <div
                class="column is-12 mb-0 p-0"
                style="display: flex; flex-direction: row; flex-wrap: wrap"
              >
                <!-- Job Type -->
                <div class="field column is-12 mb-0">
                  <label>Job Type <span style="color: red">*</span></label>
                  <div
                    class=""
                    style="
                      display: flex;
                      align-items: center;
                      gap: 2rem;
                      margin-top: 0.5rem;
                    "
                  >
                    <label
                      style="
                        display: flex;
                        align-items: center;
                        gap: 0.2rem;
                        color: #888;
                      "
                    >
                      <input
                        type="radio"
                        name="jobname"
                        v-model="jobShift"
                        value="longTerm"
                        style="width: fit-content"
                      />
                      Long Term
                    </label>
                    <label
                      style="
                        display: flex;
                        align-items: center;
                        gap: 0.2rem;
                        color: #888;
                      "
                    >
                      <input
                        type="radio"
                        name="jobname"
                        v-model="jobShift"
                        value="contract"
                        style="width: auto"
                      />
                      Contract
                    </label>
                    <label
                      style="
                        display: flex;
                        align-items: center;
                        gap: 0.2rem;
                        color: #888;
                      "
                    >
                      <input
                        type="radio"
                        name="jobname"
                        v-model="jobShift"
                        value="temporary"
                        style="width: auto"
                      />
                      <span style="width: fit-content; display: flex"
                        >Temporary (Shifts)</span
                      >
                    </label>
                  </div>
                </div>

                <!-- Job Name -->
                <div class="field column is-4 mb-0">
                  <label>Job Name <span style="color: red">*</span></label>
                  <div class="control">
                    <input
                      type="text"
                      name="jobname"
                      v-model="FormData.jobName"
                      required
                      class="input is-primary-focus is-primary-focus"
                      placeholder="Job Name"
                      style="width: 100%"
                    />
                  </div>
                </div>
                <!-- From Date -->
                <div class="field column is-4 mb-0">
                  <label>Start Date <span style="color: red">*</span></label>
                  <div class="control">
                    <input
                      type="date"
                      name="StartDate"
                      required
                      v-model="FormData.startDate"
                      class="input is-primary-focus is-primary-focus"
                      placeholder="Start Date"
                      style="width: 100%"
                    />
                  </div>
                </div>

                <!-- End date -->
                <div
                  class="field column is-4 mb-0"
                  v-if="jobShift != 'longTerm'"
                >
                  <label>End Date <span style="color: red">*</span> </label>
                  <div class="control">
                    <input
                      type="date"
                      name="endDate"
                      required
                      v-model="FormData.endDate"
                      class="input is-primary-focus is-primary-focus"
                      placeholder="End date"
                    />
                  </div>
                </div>

                <!--  Start Time -->
                <div class="field column is-4 mb-0">
                  <label>Start Time <span style="color: red">*</span></label>
                  <div class="control">
                    <input
                      type="time"
                      name="startTime"
                      required
                      v-model="FormData.startTime"
                      class="input is-primary-focus is-primary-focus"
                      placeholder="Start Time"
                    />
                  </div>
                </div>

                <!--  End Time -->
                <div class="field column is-4 mb-0">
                  <label>End Time <span style="color: red">*</span></label>
                  <div class="control">
                    <input
                      type="time"
                      name="endTime"
                      required
                      v-model="FormData.endTime"
                      class="input is-primary-focus is-primary-focus"
                      placeholder="End Time"
                    />
                  </div>
                </div>

                <!-- JobType -->
                <!-- <div
                  class="field column is-4 mb-0"
                  style="display: flex; flex-direction: column; gap: 0.2rem"
                >
                  <label>Job Type </label>
                  <VField>
                    <VControl>
                      <VSelect
                        v-model="FormData.jobType"
                        name="business_type"
                        class="is-rounded"
                      >
                        <VOption value="">Please select</VOption>
                        <VOption
                          v-for="(business, index) in jobType"
                          :value="business"
                          :key="index"
                          >{{ business }}
                        </VOption>
                      </VSelect>
                    </VControl>
                  </VField>
                  <VField id="interests" class="pb-4" label=""> </VField>
                </div> -->
                <!-- Rate -->
                <div class="field column is-4 mb-0">
                  <label>Hourly Rate (£) </label>
                  <div class="control">
                    <input
                      type="number"
                      name="changeRate"
                      v-model="FormData.hourlyRate"
                      class="input is-primary-focus is-primary-focus"
                      placeholder="Charge Rate (£)"
                    />
                  </div>
                </div>
                <!-- OverTime -->
                <div class="field column is-4 mb-0">
                  <label>Overtime Rate (£)</label>
                  <div class="control">
                    <input
                      type="number"
                      name="overtime"
                      v-model="FormData.overtimeRate"
                      class="input is-primary-focus is-primary-focus"
                      placeholder="Overtime Rate (£)"
                    />
                  </div>
                </div>

                <!-- Shift -->
                <div
                  class="field column is-4 mb-0"
                  style="
                    display: flex;
                    align-items: center;
                    flex-direction: row;
                    margin-top: 1rem;
                    gap: 1rem;
                  "
                >
                  <label style="margin-bottom: 1rem">Approval Required</label>
                  <VField>
                    <VControl subcontrol class="mr-2">
                      <VSwitchBlock
                        color="primary"
                        v-model="approval"
                        label="Yes"
                        @click="() => { approval = !approval }"
                      />
                    </VControl>
                  </VField>
                  <VField id="interests" class="pb-4" label=""></VField>
                </div>

                <!-- --------------Color Picker--------- -->
                <div
                  class="field column is-3 mt-3"
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
                          :style="{ backgroundColor: FormData.color }"
                        ></div>
                      </div>
                    </div>
                  </div>
                  <!--  -->
                  <div
                    v-if="showColorContainer"
                    :style="{
                      right:
                        jobShift === 'contract' || jobShift === 'temporary'
                          ? '12rem'
                          : '-14rem',
                    }"
                    style="
                      position: absolute;
                      top: -19rem;
                      background-color: white;
                      width: 350px;

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

                <!-- Week Availability -->
                <div
                  class="field column is-6"
                  v-if="jobShift == 'temporary'"
                  style="margin-left: 0rem"
                >
                  <label>Week Availability</label>
                  <div
                    class=""
                    style="
                      display: flex;
                      align-items: center;
                      gap: 2rem;
                      margin-top: 0.5rem;
                    "
                  >
                    <label
                      v-for="(day, index) in [
                        'monday',
                        'tuesday',
                        'wednesday',
                        'thursday',
                        'friday',
                        'saturday',
                        'sunday',
                      ]"
                      :key="index"
                      style="
                        display: flex;
                        align-items: center;
                        gap: 0.2rem;
                        color: #888;
                        font-size: 1.1rem;
                      "
                    >
                      <input
                        type="checkbox"
                        name="availability"
                        :value="day"
                        v-model="availabilityDays"
                        style="width: auto; font-size: 1.1rem"
                      />
                      {{ day.charAt(0).toUpperCase() + day.slice(1) }}
                    </label>
                  </div>
                </div>

                <!-- -----Text Editor-- -->
                <div class="field column is-12 mb-0">
                  <label style="margin-bottom: 0.5rem">Description</label>
                  <div class="page-content-inner">
                    <div class="columns is-multiline">
                      <div class="column is-12">
                        <div class="columns">
                          <div class="column is-12 content" style="">
                            <CKEditor
                              v-if="editor"
                              v-model="FormData.description"
                              :editor="editor"
                              :config="editorConfig"
                              style="color: #fff"
                            />
                            <VPlaceload v-else height="500px" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- End -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #cancel>
      <VButton
        :loading="isLoading"
        type="button"
        color="primary"
        light
        style="float: right; border: 1xp solid #ccc; display: none"
        >Previous</VButton
      >
    </template>

    <template #action>
      <VButton
        :loading="isLoading"
        type="submit"
        color="primary"
        raised
        :style="{ float: 'right' }"
        >Save & close</VButton
      >
    </template>
  </VModal>
</template>

<style lang="scss" scoped>
/* Style the date icon */
.input[type="date"]::-webkit-calendar-picker-indicator {
  position: absolute;
  right: 5px;
  top: calc(50% - 7px);
  color: #495057;
  font-size: 16px;
  cursor: pointer;
}

.input[type="time"]::-webkit-calendar-picker-indicator {
  position: absolute;
  right: 5px;
  top: calc(50% - 7px);
  color: #495057;
  font-size: 16px;
  cursor: pointer;
}

.parent-div {
  display: flex;
  position: fixed;
  left: 10%;
  top: 5%;
  width: 80%;
  height: 90dvh;
  z-index: 99;
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
  background: linear-gradient(to top, #1d976c, #2aac8e);

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
  padding: 3% 2%;
  border-radius: 0 8px 8px 0;
  overflow-y: auto;
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
  background-color: var(--primary);
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
  padding-left: 0.5rem;
  font-size: 14px;
  color: #999;
}

.cus-set-optional {
  font-size: 10px;
  color: #777777;
}

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
    width: 4rem;
    border-radius: 8px;
  }
}

@import "/@src/scss/abstracts/all";
@import "/@src/scss/components/profile-stats";

.wrapper-anim {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -1;
}

.box-anim div {
  position: absolute;
  width: 30px;
  height: 30px;
  background-color: transparent;
  border: 3px solid rgba(151, 179, 161, 0.5);
}

.box-anim div:nth-child(1) {
  top: 12%;
  left: 42%;
  animation: animate 10s linear infinite;
}

.box-anim div:nth-child(2) {
  top: 70%;
  left: 50%;
  animation: animate 7s linear infinite;
}

.box-anim div:nth-child(3) {
  top: 17%;
  left: 6%;
  animation: animate 9s linear infinite;
}

.box-anim div:nth-child(4) {
  top: 20%;
  left: 60%;
  animation: animate 10s linear infinite;
}

.box-anim div:nth-child(5) {
  top: 67%;
  left: 10%;
  animation: animate 6s linear infinite;
}

.box-anim div:nth-child(6) {
  top: 80%;
  left: 70%;
  animation: animate 12s linear infinite;
}

.box-anim div:nth-child(7) {
  top: 60%;
  left: 80%;
  animation: animate 15s linear infinite;
}

.box-anim div:nth-child(8) {
  top: 32%;
  left: 25%;
  animation: animate 16s linear infinite;
}

.box-anim div:nth-child(9) {
  top: 90%;
  left: 25%;
  animation: animate 9s linear infinite;
}

.box-anim div:nth-child(10) {
  top: 20%;
  left: 80%;
  animation: animate 5s linear infinite;
}

.box-anim div:nth-child(11) {
  top: 50%;
  left: 60%;
  animation: animate 5s linear infinite;
}

@keyframes animate {
  0% {
    transform: scale(0) translateY(-90px) rotate(360deg);
    opacity: 1;
  }

  100% {
    transform: scale(1.3) translateY(-90px) rotate(-180deg);
    border-radius: 50%;
    opacity: 0;
  }
}

.cus-comment {
  max-height: 300px;
  overflow-y: scroll;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: #0a8367 #32a7768f;

  &.cus-comment::-webkit-scrollbar {
    width: 5px;
    border-radius: 8px;
  }

  &.cus-comment::-webkit-scrollbar-thumb {
    background-color: #2aac8e;
    border-radius: 8px;
  }
}

// profile CSS
.cus-default {
  cursor: not-allowed;
  pointer-events: none;
}

.cus-blur {
  filter: brightness(80%);
}

#cus-toggler {
  position: relative;
  display: block;
  height: 31px;
  width: 53px;
  border: 2px solid var(--info);
  border-radius: 100px;
  transition:
    color 0.3s,
    background-color 0.3s,
    border-color 0.3s,
    height 0.3s,
    width 0.3s;
}

#cus-toggle-center {
  width: 100% !important;
  display: flex !important;
  justify-content: center !important;
}

.link-message {
  position: absolute;
  top: 30px;
  right: 12px;
  padding: 0;
}

.copyLinkStyle {
  height: 100% !important;
  border: 1px solid var(--primary) !important;
  padding: 0 !important;
}

.user-rating {
  display: flex;
  align-items: center;
  gap: 16px;

  .ratings {
    margin-top: 13px;
  }
}

.not-active {
  a {
    span {
      color: #818181;
    }
  }
}

.userIndustry {
  display: flex;
  gap: 10px;
  margin-top: 12px;
}

.user-info {
  margin-top: 10px;

  .username {
    display: flex;
    align-items: center;
  }

  span {
    margin-top: 4px;
  }
}

.activation {
  margin-top: 14px;
}

.user-switch {
  display: flex;
  margin-top: 12px;
  gap: 10px;

  .switches {
    width: max-content;
    display: flex;
    gap: 4px;
    margin-bottom: 4px;
    padding-right: 12px;

    .username {
      display: flex;
      gap: 5px;
      margin-top: 4px;
      color: #f1f1f1;
    }
  }
}

.margin {
  margin-top: 10px;
}

.user-status {
  display: flex;
  margin-right: 6px;
}

.DelBtn {
  height: min-content;
  padding: 4px;
  border: none;
  background-color: transparent;
  margin-top: 4px;
  cursor: pointer;
}

.edit-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  border: none;
  color: #fff;
  background-color: transparent;
  height: min-content;
}

.share-btn {
  position: absolute;
  top: 10px;
  right: 58px;
  cursor: pointer;
  border: none;
  color: #fff;
  background-color: transparent;
  height: min-content;
}

.add-btn {
  cursor: pointer;
  border: none;
  color: var(--primary-light-10);
  background-color: transparent;
  height: min-content;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.cus-docTitles {
  width: 250px !important;
  text-wrap: pretty !important;
}

.flex-table-cell {
  white-space: wrap !important;
}

.png-icon {
  display: flex;
  margin-right: 10px;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;

  border-radius: 50%;
  background-color: #09787823;
}

.flex-table-cell {
  white-space: wrap !important;
}

.is-dark {
  .banking-dashboard-v1 {
    .dashboard-card {
      @include vuero-card--dark;
    }
  }
}

.active-licence {
  background-color: ghostwhite;
  border: 2px solid var(--primary);
  // box-shadow: var(--info-box-shadow);
}

/*================================*/
/* page styling*/
/*================================*/
.is-navbar {
  .profile-wrapper {
    margin-top: 30px;
  }
}

#doc-table > .flex-table-item {
  border: none !important;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 4px !important;
  transition: all ease-in-out 0.4s;
  transition: all ease-in-out 0.4s;

  &:hover {
    box-shadow: rgba(0, 0, 0, 0.24) 0px 5px 8px !important;
    transform: scaleZ(1.06);
    transform: scale(1.01);
  }
}

.profile-wrapper {
  margin: 0 auto;

  .profile-header {
    text-align: center;

    > img {
      display: block;
      margin: 0 auto;
      max-width: 300px;
    }

    .v-avatar {
      margin: 0 auto 12px;
    }

    .anim-icon {
      margin-bottom: 12px;
    }

    .title {
      margin-bottom: 6px;
    }

    p {
      font-size: 1rem;
      max-width: 540px;
      margin: 0 auto;
      line-height: 1.3;
    }
  }

  .profile-body {
    padding: 10px 0 20px;

    .profile-card {
      @include vuero-s-card;

      padding: 30px;

      &:not(:last-child) {
        margin-bottom: 20px;
      }

      .profile-card-section {
        padding-bottom: 20px;

        &:not(:last-child) {
          margin-bottom: 20px;
          border-bottom: 1px solid var(--fade-grey-dark-4);
        }

        &.no-padding {
          padding-bottom: 0;
        }

        .section-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;

          h4 {
            font-family: var(--font-alt);
            font-weight: 600;
            font-size: 0.8rem;
            text-transform: uppercase;
            color: var(--dark-text);
            margin-inline-end: 6px;
          }

          i {
            color: var(--primary);
          }

          .action-link {
            position: relative;
            top: -2px;
            margin-inline-start: auto;
            text-transform: uppercase;
            font-size: 0.8rem;
          }

          .control {
            margin-inline-start: auto;

            .form-switch {
              transform: scale(0.8);
            }
          }
        }

        .section-content {
          .description {
            font-size: 0.95rem;
          }

          .experience-wrapper {
            display: flex;
            flex-wrap: wrap;
            margin-inline-start: -8px;
            margin-inline-end: -8px;

            .experience-item {
              display: flex;
              align-items: center;
              width: calc(50% - 16px);
              margin: 8px;

              img {
                display: block;
                width: 50px;
                min-width: 50px;
                height: 50px;
                border-radius: var(--radius-rounded);
                border: 1px solid var(--fade-grey-dark-4);
              }

              .meta {
                margin-inline-start: 10px;

                > span {
                  font-family: var(--font);
                  display: block;

                  &:first-child {
                    font-family: var(--font-alt);
                    font-weight: 600;
                    color: var(--dark-text);
                    font-size: 0.85rem;
                  }

                  &:nth-child(2),
                  &:nth-child(3) {
                    font-size: 0.85rem;
                    color: var(--light-text);

                    i {
                      position: relative;
                      top: -2px;
                      font-size: 4px;
                      margin: 0 6px;
                    }
                  }

                  &:nth-child(3) {
                    color: var(--primary);
                  }

                  span {
                    display: inline-block;
                  }
                }
              }
            }
          }

          .languages-wrapper {
            display: flex;
            flex-wrap: wrap;
            margin-inline-start: -8px;
            margin-inline-end: -8px;

            .languages-item {
              display: flex;
              align-items: center;
              width: calc(50% - 16px);
              margin: 8px;

              .icon-wrap {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 50px;
                min-width: 50px;
                height: 50px;

                img {
                  position: absolute;
                  top: 50%;
                  inset-inline-start: 50%;
                  transform: translate(-50%, -50%);
                  display: block;
                  width: 32px;
                  min-width: 32px;
                  height: 32px;
                  border-radius: var(--radius-rounded);
                  border: 1px solid var(--fade-grey-dark-4);
                }
              }

              .meta {
                margin-inline-start: 10px;

                > span {
                  display: block;
                  font-family: var(--font);

                  &:first-child {
                    font-family: var(--font-alt);
                    font-weight: 600;
                    color: var(--dark-text);
                    font-size: 0.9rem;
                  }

                  &:nth-child(2) {
                    font-size: 0.85rem;
                    color: var(--light-text);
                  }

                  span {
                    display: inline-block;
                  }
                }
              }
            }
          }

          .skills-wrapper {
            .skills-item {
              display: flex;
              align-items: center;

              &:not(:last-child) {
                margin-bottom: 16px;
              }

              .icon-wrap {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 42px;
                min-width: 42px;
                height: 42px;
                border-radius: var(--radius-rounded);
                border: 1px solid var(--primary);

                &.has-icon {
                  background: var(--fade-grey-light-2);
                  border: 1px solid var(--fade-grey-dark-3);
                  color: var(--light-text);

                  i {
                    font-size: 1.4rem;
                  }
                }

                img {
                  display: block;
                  width: 34px;
                  min-width: 34px;
                  height: 34px;
                  border-radius: var(--radius-rounded);
                  border: 1px solid var(--fade-grey-dark-4);
                }

                .count {
                  position: absolute;
                  bottom: 0;
                  inset-inline-end: -4px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  width: 22px;
                  height: 22px;
                  border-radius: var(--radius-rounded);
                  background: var(--white);
                  border: 1px solid var(--primary);

                  span {
                    font-family: var(--font);
                    font-weight: 500;
                    font-size: 0.75rem;
                  }
                }
              }

              .skill-info {
                font-family: var(--font);
                margin-inline-start: 12px;
                line-height: 1.3;

                span {
                  display: block;

                  &:first-child {
                    font-family: var(--font-alt);
                    font-weight: 600;
                    color: var(--dark-text);
                    font-size: 0.9rem;
                  }

                  &:nth-child(2) {
                    font-size: 0.9rem;
                    color: var(--light-text);
                  }
                }
              }

              .people {
                margin-inline-start: auto;
                display: flex;
                justify-content: flex-end;

                .v-avatar {
                  margin: 0 4px;
                }
              }
            }
          }

          .recommendations-wrapper {
            display: flex;
            flex-wrap: wrap;
            margin-inline-start: -8px;
            margin-inline-end: -8px;

            .recommendations-item {
              width: calc(50% - 16px);
              margin: 8px;
              background: var(--fade-grey-light-3);
              text-align: center;
              padding: 30px 20px;
              border-radius: var(--radius);

              > .v-avatar {
                display: block;
                margin: 0 auto 8px;
              }

              h3 {
                font-size: 1rem;
                font-family: var(--font-alt);
                font-weight: 600;
                color: var(--dark-text);
                margin-bottom: 8px;
              }

              p {
                font-size: 0.85rem;
                margin-bottom: 16px;
              }

              .meta {
                span {
                  display: block;

                  &:first-child {
                    font-weight: 600;
                    font-family: var(--font-alt);
                    font-size: 0.95rem;
                    color: var(--primary);
                  }

                  &:nth-child(2) {
                    font-size: 0.9rem;
                    color: var(--light-text);
                  }
                }
              }
            }
          }

          .network-notifications {
            h3 {
              font-family: var(--font-alt);
              font-size: 0.9rem;
              margin-bottom: 6px;
            }

            p {
              font-size: 0.9rem;
              max-width: 480px;
            }
          }

          .tools-wrapper {
            padding-top: 12px;

            .tools-item {
              display: flex;
              align-items: center;
              margin-bottom: 16px;

              &:last-child {
                margin-bottom: 0;
              }

              .icon-wrap {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 50px;
                min-width: 50px;
                height: 50px;

                img {
                  position: absolute;
                  top: 50%;
                  inset-inline-start: 50%;
                  transform: translate(
                    calc(var(--transform-direction) * -50%),
                    -50%
                  );
                  display: block;
                  width: 32px;
                  min-width: 32px;
                  height: 32px;
                  border-radius: var(--radius-rounded);
                  border: 1px solid transparent;
                }
              }

              .meta {
                margin-inline-start: 10px;

                > span {
                  display: block;
                  font-family: var(--font);

                  &:first-child {
                    font-family: var(--font-alt);
                    font-weight: 600;
                    color: var(--dark-text);
                    font-size: 0.9rem;
                  }

                  &:nth-child(2) {
                    font-size: 0.85rem;
                    color: var(--light-text);
                  }

                  span {
                    display: inline-block;
                  }
                }
              }
            }
          }

          .people-wrapper {
            padding-top: 12px;

            .people-item {
              display: flex;
              align-items: center;
              margin-bottom: 16px;

              &:last-child {
                margin-bottom: 0;
              }

              .meta {
                margin-inline-start: 10px;

                > span {
                  display: block;
                  font-family: var(--font);

                  &:first-child {
                    font-family: var(--font-alt);
                    font-weight: 600;
                    color: var(--dark-text);
                    font-size: 0.9rem;
                  }

                  &:nth-child(2) {
                    font-size: 0.85rem;
                    color: var(--light-text);
                  }

                  span {
                    display: inline-block;
                  }
                }
              }
            }
          }

          .more-button {
            padding-top: 16px;

            .button {
              min-width: 180px;
              font-family: var(--font);
              text-transform: uppercase;
              font-size: 0.8rem;
              font-weight: 500;
              margin: 0 auto;
              color: var(--light-text);
            }
          }
        }
      }
    }
  }
}

.navbar-item {
  &.is-theme-toggle {
    opacity: 1;
    pointer-events: all;
  }

  .nav-link {
    position: relative;
    font-family: var(--font-alt);
    font-size: 0.9rem;
    color: var(--light-text);
    text-transform: capitalize;

    &::before {
      content: "";
      position: absolute;
      top: -4px;
      inset-inline-start: 2px;
      width: 50%;
      transform-origin: right center;
      height: 3px;
      border-radius: 50px;
      background: var(--primary);
      transform: scale(0, 1);
      transition: -webkit-transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      transition:
        transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
        -webkit-transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    // Hover state
    &:hover,
    &.is-active {
      color: var(--dark-text);

      &::before {
        transform-origin: left center;
        transform: scale(1, 1);
      }
    }

    &.active {
      &::before {
        background: var(--primary);
      }
    }
  }

  .theme-toggle {
    width: 54px;
    display: block;
    position: relative;
    cursor: pointer;
    font-size: 22px;
    user-select: none;
    transform: scale(0.9);

    &:focus-within {
      border-radius: 50px;
      outline-offset: var(--accessibility-focus-outline-offset);
      outline-width: var(--accessibility-focus-outline-width);
      outline-style: var(--accessibility-focus-outline-style);
      outline-color: var(--accessibility-focus-outline-color);
    }

    input {
      position: absolute;
      opacity: 0;
      cursor: pointer;

      &:checked ~ .toggler {
        border-color: var(--primary);

        .dark,
        .light {
          transform: translateX(calc(var(--transform-direction) * 100%))
            rotate(360deg);
        }

        .dark {
          opacity: 1 !important;
        }

        .light {
          opacity: 0 !important;
        }
      }
    }

    .toggler {
      position: relative;
      display: block;
      height: 31px;
      width: 53px;
      border: 2px solid var(--danger);
      border-radius: 100px;
      transition:
        color 0.3s,
        background-color 0.3s,
        border-color 0.3s,
        height 0.3s,
        width 0.3s;

      .dark,
      .light {
        position: absolute;
        top: 2px;
        inset-inline-start: 2px;
        height: 22px;
        width: 22px;
        border-radius: var(--radius-rounded);
        background: black;
        display: flex;
        justify-content: center;
        align-items: center;
        transform: translateX(calc(var(--transform-direction) * 0))
          rotate(calc(var(--transform-direction) * 0));
        transition: all 0.3s ease;

        svg {
          color: var(--white) !important;
          height: 14px !important;
          width: 14px !important;
          opacity: 1 !important;
        }
      }

      .light {
        background: var(--danger);
        border-color: var(--danger);
        opacity: 1;
        z-index: 1;
      }

      .dark {
        background: var(--primary);
        border-color: var(--primary);
        opacity: 0;
        z-index: 0;

        svg {
          color: var(--white) !important;
        }
      }
    }
  }

  .button {
    font-weight: 400 !important;
    height: 44px;
    min-width: 110px;
  }
}

.list-widget {
  .image-icon {
    cursor: pointer;
    height: 40px;
    width: 40px;
  }
}
</style>
