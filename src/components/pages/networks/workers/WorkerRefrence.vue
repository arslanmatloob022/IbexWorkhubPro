<script setup lang="ts">
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { CreateActivityLog } from "/@src/composable/useSupportElement";
import FullCalendar from "@fullcalendar/vue3";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";

const route = useRoute();
const notyf = useNotyf();
const api = useApi();
const addNewRef = ref(false);
const refSendMail = ref(false);
const pdfDisplayModal = ref(false);
const currentPdfPreview = ref("");
const isLoading = ref(false);
const filters = ref("");
const textArea = ref("");
const refLink = ref("");
const isRefDetail = ref(false);
const updateReference = ref(false);
const currentSelectedID = ref(0);
const UploadDocField = ref("");
const editReferenceForm = ref({});
const emailLoading = ref(false);
const filteredResources = ref([]);
const fileInput = ref<HTMLInputElement | null>(null);
const refLinkResp = ref<any>({});
const referenceRequestsToReferee = ref<any>([]);
const SweetAlertProps = ref({
  title: "",
  subtitle: "test",
  isSweetAlertOpen: false,
  btntext: "text",
});

const RequestSweetAlertProps = ref({
  title: "",
  subtitle: "test",
  isRequestSweetAlertOpen: false,
  btntext: "text",
});

const deleteRequestInfoSweetAlertProps = ref({
  title: "",
  subtitle: "test",
  isDeleteRequestInfoSweetAlertOpen: false,
  btntext: "text",
});

const sendMailSweetAlertProps = ref({
  title: "",
  subtitle: "test",
  isEmailSweetAlertOpen: false,
  btntext: "text",
});

const props = defineProps({
  id: {
    type: String,
    default: 0,
  },
  worker: {
    type: Object,
    default: {},
  },
});
export interface Refrence {
  id: number;
  refereeEmail: string;
  refereeName: string;
  refereeContact: string;
  noOfRequests: string;
  lastRequestDate: string;
  jobTitle: string;
  employedFrom: string;
  employedTo: string;
  duration: string;
  isDatesConfirmed: string;
  verbalConfirmationDate: string;
  worker: string;
  companyName: string;
  alternateProof: string;
  referenceDocument: string;
  isCompleted: string;
  status: string;
  type: string;
  created_at: string;
  refereeStatus: string;
  comment: string;
}
const editReference = ref<Refrence>({
  id: 0,
  refereeEmail: "",
  refereeName: "",
  refereeContact: "",
  jobTitle: "",
  employedFrom: "",
  employedTo: "",
  duration: "",
  companyName: "",
  worker: "",
  noOfRequests: "",
  lastRequestDate: "",
  alternateProof: "",
  referenceDocument: "",
  isDatesConfirmed: "",
  verbalConfirmationDate: "",
  isCompleted: "",
  status: "",
  type: "",
  created_at: "",
  refereeStatus: "",
  comment: "",
});
const reference = ref<Refrence>({
  id: 0,
  refereeEmail: "",
  refereeName: "",
  refereeContact: "",
  jobTitle: "",
  employedFrom: "",
  employedTo: "",
  companyName: "",
  duration: "",
  worker: "",
  noOfRequests: "",
  lastRequestDate: "",
  alternateProof: "",
  referenceDocument: "",
  isDatesConfirmed: "",
  verbalConfirmationDate: "",
  isCompleted: "",
  status: "",
  type: "",
  created_at: "",
  comment: "",
  refereeStatus: "",
});
const references: Refrence[] = [];
const referenceColumns = {
  refereeEmail: {
    label: "Person",
    grow: true,
  },

  companyName: "Company Name",
  jobTitle: "job title",
  employedFrom: "Employement Start",
  employedTo: "Employement End",
  duration: {
    label: "Duration",
    align: "end",
  },
  completed: "Completed",
  actions: {
    label: "Actions",
    align: "end",
  },
} as const;

const referenceRequestColumns = {
  Id: "Ref Id",
  reference: {
    label: "Referee",
    grow: true,
  },
  type: "Type",
  Name: "Position",
  Requested: "Requested",
  Status: "Status",
  Completed: "Completed at",
  actions: {
    label: "Actions",
    align: "end",
  },
} as const;

const employementRequestsColumns = {
  Created: "Sent At",
  Status: "Status",
};

const workerReferenceRequest = ref([
  {
    id: 0,
    reference: {
      id: 0,
      refereeName: "",
      refereeEmail: "",
      refereeContact: "",
      jobTitle: "",
      companyName: "",
      alternateProof: null,
      referenceDocument: null,
      type: "",
      refereeStatus: "",
      status: "",
      employedFrom: "",
      employedTo: "",
      created_at: "",
      updated_at: "",
      noOfRequests: 0,
      lastRequestDate: null,
      isDatesConfirmed: false,
      verbalConfirmationDate: null,
      isCompleted: false,
      worker: 0,
      comment: "",
      created_by: 0,
    },
    status: "",
    token: "",
    completedAt: null,
    created_at: "",
  },
]);
const status = ref("Pending");

const getStatusColor = ref({
  Pending: "warning",
  Approved: "primary",
  Rejected: "danger",
});

const getRefTypeColor = ref({
  Employment: "info",
  Acdamin: "primary",
  Activity: "danger",
});

const NewReferenceForm = ref({
  refereeEmail: "",
  refereeName: "",
  refereeContact: "",
  jobTitle: "",
  employedFrom: "",
  employedTo: "",
  companyName: "",
  type: "Employment",
  worker: "",
});

const clearFields = () => {
  NewReferenceForm.value = {
    refereeEmail: "",
    refereeName: "",
    refereeContact: "",
    jobTitle: "",
    employedFrom: "",
    employedTo: "",
    companyName: "",
    type: "Employment",
    worker: "",
  };
};
const editReferanceHandler = async () => {
  console.log("edit form submit");
  try {
    isLoading.value = true;
    const reponse = await api.patch(
      `/v3/api/worker/reference/${editReference.value.id}/`,
      editReferenceForm.value
    );
    updateReference.value = false;
    notyf.success("Reference Updated");
    CreateActivityLog({
      message: `edited <b>Employment Reference</b>`,
      objectId: route.params.id,
      method: "patch",
    });
    isLoading.value = false;
    getEmployeeReferences();
  } catch {
    isLoading.value = false;
  }
};
const getReferenceById = async (id: any) => {
  try {
    const response = await api.get(`/v3/api/worker/reference/${id}/`);
    reference.value = response.data;
    console.log("reference updated", reference.value);
  } catch {}
};
const openEditModal = (item: any) => {
  console.log(item);
  editReference.value = item;
  updateReference.value = true;
};
const triggerFileInput = (field: any): void => {
  UploadDocField.value = field;
  if (fileInput.value) {
    fileInput.value.click();
  }
};
const handleFileChange = async (event: Event) => {
  // Handle the file change event here
  const input = event.target as HTMLInputElement;
  const selectedFile = input.files?.[0];
  await updateParams(reference.value.id, {
    [UploadDocField.value]: selectedFile,
  });
  getReferenceById(reference.value.id);
};
const updateParams = async (id: any, params: any) => {
  console.log(params);
  const reponse = await api.patch(`/v3/api/worker/reference/${id}/`, params);
  getEmployeeReferences();

  notyf.success("Reference updated");
};
const sendEmail = async (mail: any) => {
  try {
    emailLoading.value = true;
    const resp = await api.post(
      `/v3/api/worker/reference/${refLinkResp.value.id}/send-reference-mail/`,
      { email: mail }
    );
    CreateActivityLog({
      message: `sent <b>Employment Reference</b> by email`,
      objectId: route.params.id,
      method: "patch",
    });
    notyf.success("Email sent succesfully");
    refSendMail.value = false;
  } catch (error) {
    notyf.error("Error while sending email");
    refSendMail.value = false;
  } finally {
    emailLoading.value = false;
  }
};
// const CreateLinkHandler = async () => {
// 	try {
// 		refSendMail.value = true
// 		const reponse = await api.post('/v3/api/worker/reference/create-reference-link/', { worker: props.id })
// 		console.log(reponse.data);
// 		refLink.value = `http://localhost:3000/add-reference/${reponse.data}`
// 		textArea.value = `Hello ${props.worker.firstName} ${props.worker.lastName} ,
// To continue the security shifts, you need to provide the employement information:
// ${refLink.value}
// Thank you,
// Arez`
// 	} catch {

// 	}
// }

const CreateLinkHandler = async () => {
  try {
    refSendMail.value = true;
    const baseURL = window.location.origin;
    const response = await api.post(
      "/v3/api/worker/reference/create-reference-link/",
      { worker: props.id }
    );
    refLinkResp.value = response.data;
    refLink.value = `${baseURL}/add-reference/${response.data.token}`;
    getReferenceRequestToReferee();
  } catch (error) {
    console.error(error);
  }
};

const inputChangeHandler = (event: any) => {
  NewReferenceForm.value = {
    ...NewReferenceForm.value,
    [event.target.name]: event.target.value,
  };
};
const editChangeHandler = (event: any) => {
  console.log(editReferenceForm.value);
  editReferenceForm.value = {
    ...editReferenceForm.value,
    [event.target.name]: event.target.value,
  };
};
const addEmployeeRef = async () => {
  console.log(NewReferenceForm.value);
  NewReferenceForm.value = { ...NewReferenceForm.value, worker: props.id };
  try {
    isLoading.value = true;
    const reponse = await api.post(
      "/v3/api/worker/reference/",
      NewReferenceForm.value
    );
    notyf.success("New reference added");
    CreateActivityLog({
      message: `added a new <b>Reference</b>`,
      objectId: route.params.id,
      method: "patch",
    });
    isLoading.value = false;
    addNewRef.value = false;
    getEmployeeReferences();
    clearFields();
  } catch {
    isLoading.value = false;
    notyf.error("Error accured");
  }
};

const copyToClipBoard = (value: any) => {
  navigator.clipboard.writeText(value);
  notyf.success("Link copied");
  CreateActivityLog({
    message: `shared <b>Employment Reference</b> through link`,
    objectId: route.params.id,
    method: "patch",
  });
};

const getEmployeeReferences = async () => {
  const response = await api.get(
    `/v3/api/worker/reference/worker-references/${props.id}/`
  );
  references.length = 0;
  filteredResources.value = response.data;
  console.log("resources", filteredResources.value);
  references.push(...(response.data as Refrence[]));
  filters.value = "fa";
  filters.value = "";

  renderCalender();
};

const OpenDeleteSweetAlert = (id: any) => {
  currentSelectedID.value = id;
  SweetAlertProps.value = {
    title: "Are you sure?",
    subtitle: "You will not be able to recover this reference!",
    btntext: "Yes, Delete it",
    isSweetAlertOpen: true,
  };
};

const OpenRequestDeleteSweetAlert = (id: any) => {
  currentSelectedID.value = id;
  RequestSweetAlertProps.value = {
    title: "Are you sure?",
    subtitle: "You want to delete this Request permanentaly ?",
    btntext: "Yes, Delete it",
    isRequestSweetAlertOpen: true,
  };
  getReferenceRequestToReferee();
};

const OpenRequestInfoDeleteSweetAlert = (id: any) => {
  currentSelectedID.value = id;
  deleteRequestInfoSweetAlertProps.value = {
    title: "Are you sure?",
    subtitle: "You want to delete this referee request record permanentaly ?",
    btntext: "Yes, Delete",
    isDeleteRequestInfoSweetAlertOpen: true,
  };
  getReferenceRequestToReferee();
};

const OpenSendRefMailSweetAlert = (id: any) => {
  currentSelectedID.value = id;
  sendMailSweetAlertProps.value = {
    title: "Sending mail?",
    subtitle: "An automated generated email will be sent to the referee",
    btntext: "Yes, Send",
    isEmailSweetAlertOpen: true,
  };
  getReferenceRequestToReferee();
};

const sendRefernceEmailToReferee = async () => {
  try {
    isLoading.value = true;
    sendMailSweetAlertProps.value.isEmailSweetAlertOpen = false;
    const response = await api.post(`v3/api/worker/reference_requests/`, {
      reference: currentSelectedID.value,
    });
    notyf.success("Mail sent succesfuly");
    console.log(response);
    getWorkerReferenceRequest();
    getEmployeeReferences();
    getReferenceRequestToReferee();
  } catch (err) {
    console.log(err);
    isLoading.value = false;
  } finally {
    isLoading.value = false;
  }
};

const deleteReferenceHandler = async () => {
  console.log(currentSelectedID.value);
  SweetAlertProps.value.isSweetAlertOpen = false;
  const response = await api.delete(
    `v3/api/worker/reference/${currentSelectedID.value}`
  );
  notyf.success("Reference deleted successfully");
  currentSelectedID.value = 0;
  isRefDetail.value = false;
  getEmployeeReferences();
};

const deleteRequestHandler = async () => {
  console.log(currentSelectedID.value);
  RequestSweetAlertProps.value.isRequestSweetAlertOpen = false;
  const response = await api.delete(
    `/v3/api/worker/reference_requests/${currentSelectedID.value}/`
  );
  notyf.error("Request deleted successfully");
  currentSelectedID.value = 0;
  isRefDetail.value = false;
  getWorkerReferenceRequest();
  getReferenceRequestToReferee();
};

const deleteRequestInfoHandler = async () => {
  console.log(currentSelectedID.value);
  deleteRequestInfoSweetAlertProps.value.isDeleteRequestInfoSweetAlertOpen =
    false;
  const response = await api.delete(
    `v3/api/worker/reference_tokens/${currentSelectedID.value}/`
  );
  notyf.error("Request record deleted successfully");
  currentSelectedID.value = 0;
  isRefDetail.value = false;
  getWorkerReferenceRequest();
  getReferenceRequestToReferee();
};

const calculateDuration = (from: any, to: any) => {
  const startDateString = from;
  const endDateString = to;

  if (startDateString && endDateString) {
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);

    const diffInMilliseconds = endDate.getTime() - startDate.getTime();

    const months = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24 * 30));
    const years = Math.floor(months / 12);
    const totalMonths = months % 12;
    const days = Math.floor(years % 365);

    return `${years}Yr - ${totalMonths}Mo - ${days}Dy`;
  } else {
    return "N/A";
  }
};

// employedFrom
// employedTo

const filteredData = computed(() => {
  if (!filters.value) {
    return references;
  } else {
    const filterRe = new RegExp(filters.value, "i");
    return references.filter((item) => {
      return (
        item.refereeName.match(filterRe) || item.refereeEmail.match(filterRe)
      );
    });
  }
});

const approvedReferenceCount = computed(() => {
  return filteredResources.value.filter(
    (resource) => resource.status == "Approved"
  ).length;
});

const currentDate = new Date();
currentDate.setFullYear(currentDate.getFullYear() - 5);
const formattedDate = currentDate.toISOString().slice(0, 10);
const currentYear = currentDate.getFullYear();
const startYear = currentYear - 5;
const calendarOptions = ref<any>({
  plugins: [resourceTimelinePlugin],
  schedulerLicenseKey: "0965592368-fcs-1694657447",
  initialView: "resourceTimeline5Year",
  height: "auto",
  resourceAreaWidth: "10%",
  selectable: true,
  now: formattedDate,
  headerToolbar: {
    left: "",
    center: "",
    right: "",
  },
  droppable: true,
  editable: true,
  views: {
    resourceTimeline5Year: {
      type: "resourceTimeline",
      duration: { years: 6 },
      slotDuration: { months: 2 },
      slotWidth: 10,
    },
  },
  resourceAreaHeaderContent: "Companies",
  eventClick: (info) => {
    // Using arrow function
    console.log("event", info.event.id);
    console.log("clicked");
    const element = document.getElementById(`ref-${info.event.id}`);

    // Scroll to the element's position
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  },
});

const evenColors = {
  Pending: "#FAAD42",
  Approved: "#05D69E",
  Rejected: "#E62864",
};
const renderCalender = () => {
  console.log("references", references);
  const events = references.map((reference, index) => ({
    id: reference.id,
    resourceId: reference.id,
    start: reference.employedFrom,
    end: reference.employedTo,
    title: reference.companyName,
    jobTitle: reference.jobTitle,
    status: reference.status,
    color: evenColors[reference.status],
  }));

  const resources = references.map((reference, index) => ({
    id: reference.id,
    title: reference.companyName,
    jobTitle: reference.jobTitle,
    status: reference.status,
    color: evenColors[reference.status],
  }));
  calendarOptions.value.resources = resources;
  console.log("options", calendarOptions.value);
  calendarOptions.value.events = events;
};

const getWorkerReferenceRequest = async () => {
  try {
    const resp = await api.get(
      `/v3/api/worker/reference_requests/${props.id}/worker/`
    );
    workerReferenceRequest.value = resp.data;
    console.log("requests", workerReferenceRequest.value);
  } catch (err) {
    console.log(err);
  }
};

const getReferenceRequestToReferee = async () => {
  try {
    const resp = await api.get(
      `/v3/api/worker/reference/worker-reference-requests/${props.id}/`
    );
    referenceRequestsToReferee.value = resp.data;
  } catch (err) {
    console.log(err);
  }
};

onMounted(async () => {
  getWorkerReferenceRequest();
  await getEmployeeReferences();

  getReferenceRequestToReferee();
  console.log("no", approvedReferenceCount);
});
</script>

<template>
  <div>
    <input
      ref="fileInput"
      type="file"
      style="display: none"
      @change="handleFileChange"
      accept="image/*,application/pdf"
    />
    <div class="tab-content is-active" v-show="!isRefDetail">
      <div
        class="section-title mt-0"
        style="display: flex; justify-content: space-between"
      ></div>
      <div class="columns is-multiline">
        <div class="column is-7 is-flex  space-between">
          <h6
            style="white-space: nowrap"
            class="cus-main-heading mr-3 ml-1 mt-5"
          >
            Approval Requests
          </h6>
		  <div class="cu-align-center">
			  <VProgress
			  class="mb-1"
			  style="height: 18px; width: 300px"
			  :value="
              approvedReferenceCount
			  ? (approvedReferenceCount / filteredData.length) * 100
			  : 0
			  "
			  />
			  <p
			  v-if="approvedReferenceCount"
			  style="font-weight: 600; color: var(--primary); margin-left:8px"
			>
			  {{
				(
				  (approvedReferenceCount / filteredData.length) *
				  100
				).toFixed(2)
			  }}%
			</p>
			</div>
        </div>
        <div class="column is-5 mt-4">
          <div class="list-flex-toolbar is-reversed">
            <div class="buttons">
              <VButton
                color="info"
                @click="CreateLinkHandler()"
                icon="fas fa-link"
                elevated
              >
                Reference link
              </VButton>
              <VButton
                color="primary"
                @click="
                  () => {
                    addNewRef = !addNewRef;
                  }
                "
                icon="fas fa-plus"
                elevated
              >
                Reference
              </VButton>
              <VControl icon="feather:search">
                <input
                  v-model="filters"
                  class="input custom-text-filter"
                  placeholder="Search..."
                />
              </VControl>
            </div>
          </div>
        </div>
        <div class="column is-12">

          <VFlexTable
            class="mb-4"
            v-if="filteredData.length"
            :data="workerReferenceRequest"
            :columns="referenceRequestColumns"
            rounded
          >
            <template #body>
              <TransitionGroup name="list" tag="div" class="flex-list-inner">
                <!-- Table item -->
                <div
                  v-for="(item, index) in workerReferenceRequest"
                  :key="index"
                  class="flex-table-item"
                  style="cursor: pointer"
                >
                  <VFlexTableCell :column="{ grow: false }">
                    <div>
                        <span
                          class="light-text item-meta"
                          style="font-weight: 500"
                          >REF-9876{{ item.reference.id }}</span
                        >
                    </div>
                  </VFlexTableCell>
                  <VFlexTableCell :column="{ media: true, grow: true }">
                    <div>
                      <span class="item-name dark-inverted">{{
                        item.reference.refereeName
                      }}</span>
                      <span class="item-meta">
                        <span>{{ item.reference.refereeEmail }}</span>
                      </span>
                    </div>
                  </VFlexTableCell>
                  <VFlexTableCell>
                    <div>
                        <span class=" light-text item-meta">{{ item.reference.type }}</span>
                    </div>
                  </VFlexTableCell>
                  <VFlexTableCell>
                    <span class="light-text item-meta">
                      {{ item.reference.jobTitle }}</span
                    >
                  </VFlexTableCell>
                  <VFlexTableCell>
                    <VTag color="light">
                      {{ item.created_at.slice(0, 10) }}
                    </VTag>
                  </VFlexTableCell>
                  <VFlexTableCell>
                    <VTag :color="getStatusColor[item.status]">
                      {{ item.status }}
                    </VTag>
                  </VFlexTableCell>
                  <VFlexTableCell :column="{ align: 'start' }">
                    <VTag color="light">
                      {{
                        item.completedAt
                          ? item.completedAt.slice(0, 10)
                          : "-- -- ----"
                      }}
                    </VTag>
                  </VFlexTableCell>
                  <VFlexTableCell :column="{ align: 'end' }">
                    <i
                      @click="OpenRequestDeleteSweetAlert(item.id)"
                      class="fas fa-trash-alt cu-pointer cus-del-icon"
                      aria-hidden="true"
                    ></i>
                  </VFlexTableCell>
                </div>
              </TransitionGroup>
            </template>
          </VFlexTable>
          <VTag color="warning" class="mb-2 ml-5" v-else
            >No Request sent to the Referee yet</VTag
          >
        </div>
        
      </div>

      <h6
        style="
          font-weight: 500;
          font-size: 20px;
          text-align: left;
          margin-bottom: 6px;
          padding-left: 2px;
        "
      >
        Timeline
      </h6>

      <FullCalendar :options="calendarOptions">
        <template v-slot:eventContent="arg">
          <div class="p-2" style="">
            <p
              style="
                font-weight: 600;
                margin-bottom: 0px;
                padding-left: 10px;
                color: white;
              "
            >
              <VTag light color="info" class="mr-5">
                <span class="item-name dark-inverted" style="font-weight: 500"
                  >REF-9876{{ arg.event.id }}</span
                >
              </VTag>
              {{ arg.event.extendedProps.jobTitle }} --
              {{ arg.event.extendedProps.status }}
            </p>
          </div>
        </template>
      </FullCalendar>

      <hr />
	  <div class="columns is-multiline">
		<div class="column is-8">
			<div class="is-flex space-between mb-4">
				<h6 class="cus-main-heading ml-1 mb-2">Employment References</h6>
			  </div>
			  <div v-for="(item, index) in filteredData"
			  :key="index"
			  style="background-color: #fff; border-radius: 16px"
			  class="p-6 mb-4"
			  :id="`ref-${item.id}`"
			>
			  <div class="is-flex">
				<div>
				  <p class="dark-text light-weight mb-1">REF-9876{{ item.id }}</p>
				  <div class="is-flex cu-align-center">
					<h1 style="font-weight: 500; font-size: 17px; color: #000">
					  {{ item.companyName }}
					</h1>
					<h3
					  style="
						margin-left: 6px;
						white-space: nowrap;
						font-weight: 500;
						font-size: 12px;
						color: #666;
					  "
					>
					  (Mail sent: {{ item.mails_sent }} time)
					</h3>
				  </div>
				</div>
				<div
				  style="
					display: flex;
					width: 100%;
					gap: 16px;
					justify-content: flex-end;
					cursor: pointer;
				  "
				>
				  <VIconWrap
					icon="feather:edit-2"
					@click="openEditModal(item)"
					color="info"
				  />
	  
				  <VIconWrap
					@click="OpenDeleteSweetAlert(item.id)"
					icon="feather:trash"
					color="danger"
				  />
				</div>
			  </div>
			  <div class="row mt-4">
				<div class="columns is multiline">
				  <div class="column is-2">
					<P style="font-size: 15px; font-weight: 400; color: #898989"
					  >Type</P
					>
					<p class="light-dark weighted">
					  {{ item.type }}
					</p>
				  </div>
				  <div class="column is-2">
					<P style="font-size: 15px; font-weight: 400; color: #898989"
					  >Company</P
					>
					<p class="light-dark weighted">
					  {{ item.companyName ? item.companyName : 'Not Mentioned'  }}
					</p>
				  </div>
				  <div class="column is-2">
					<P style="font-size: 15px; font-weight: 400; color: #898989"
					  >Requested At</P
					>
					<p class="light-dark weighted">
					  {{ item.created_at ? item.created_at.slice(0, 10) : '-- -- ----'  }}
					</p>
				  </div>
				 
				  <div class="column is-2">
					<P style="font-size: 15px; font-weight: 400; color: #898989"
					  >Status</P
					>
					<p
					  :style="{
						color: `var(--${getStatusColor[item.status]})`
					  }"
					  class="light-dark weighted"
					>
					  {{ item.status }}
					</p>
				  </div>
				</div>
				<hr />
				<div class="columns is multiline">
				  <div class="column is-2">
					<P style="font-size: 15px; font-weight: 400; color: #898989"
					  >Start Date</P
					>
					<p class="light-dark weighted">
					  {{ item.employedFrom }}
					</p>
				  </div>
				  <div class="column is-2">
					<P style="font-size: 15px; font-weight: 400; color: #898989"
					  >End Date</P
					>
					<p class="light-dark weighted">
					  {{ item.employedTo }}
					</p>
				  </div>
				  <div class="column is-2">
					<P style="font-size: 15px; font-weight: 400; color: #898989"
					  >Position</P
					>
					<p class="light-dark weighted">
					  {{ item.jobTitle }}
					</p>
				  </div>
				  <div class="column is-2">
					<P style="font-size: 15px; font-weight: 400; color: #898989"
					  >Verification</P
					>
					<p class="light-dark weighted">
					  <a
						style="color: var(--primary); text-decoration: underline"
						@click="OpenSendRefMailSweetAlert(item.id)"
						class="cu-pointer"
					  >
						Send email
					  </a>
					</p>
				  </div>
				  <div class="column is-2">
					<P style="font-size: 15px; font-weight: 400; color: #898989"
					  >Contact status</P
					>
					<p
					  :style="{
						color:
						  item.refereeStatus == 'Contacted'
							? 'var(--primary)'
							: 'var(--info)',
					  }"
					  class="light-dark weighted"
					>
					  {{ item.refereeStatus }}
					</p>
				  </div>
				</div>
	  
				<div class="columns is multiline">
				  <div class="column is-12">
					<P style="font-size: 15px; font-weight: 400; color: #898989"
					  >Comment:</P
					>
					<p v-if="item.comment" class="light-dark light-weight" style="">
					  {{ item.comment }}
					</p>
					<VTag v-if="!item.comment">No comments added yet</VTag>
				  </div>
				</div>
			  </div>
			</div>
		</div>
	
		<div class="column is-4 mt-6">
			<div class="profile-card is-relative mt-0">
			  <div class="profile-card-section no-padding">
				<div class="section-title">
				  <h5 style="font-weight: 500; color: #444">
					Reference Requests To Employee
				  </h5>
				</div>
				<div class="section-content no-padding">
				  <div
					v-for="item in referenceRequestsToReferee"
					:key="item.id"
					style="display: flex; align-items: center"
					class="mb-2"
				  >
					<i
					  class="fas fa-circle"
					  style="color: var(--info); font-size: 10px"
					  aria-hidden="true"
					></i>
					<p class="ml-6" style="font-weight: 500">
					  {{ item.created_at.slice(0, 10) }}
					</p>
					<p class="ml-6" style="font-weight: 500">
					  {{ item.created_at.slice(11, 16) }}
					</p>
					<div style="width: 80px">
					  <VTag
						class="ml-6"
						:color="item.status == 'Pending' ? 'light' : 'purple'"
					  >
						{{ item.status }}
					  </VTag>
					</div>
					<i
					  class="fas fa-trash-alt ml-6 cu-pointer cus-del-icon"
					  @click="OpenRequestInfoDeleteSweetAlert(item.id)"
					  style=""
					  aria-hidden="true"
					></i>
				  </div>
				  <VTag
					v-if="referenceRequestsToReferee.length == 0"
					color="warning"
					class="mb-5 ml-5"
				  >
					No Request sent to the Referee yet</VTag
				  >
				</div>
			  </div>
			</div>
		  </div>
	</div>
      
      

      <VPlaceholderPage
        v-if="filteredData.length == 0"
        title="No Reference is added for this employee."
        subtitle="Too bad. Looks like we couldn't find any matching results for the
						search terms you've entered. Please try different search terms or
						criteria."
        larger
      >
        <template #image>
          <img
            class="light-image"
            src="/@src/assets/illustrations/placeholders/search-4.svg"
            alt=""
          />
          <img
            class="dark-image"
            src="/@src/assets/illustrations/placeholders/search-4-dark.svg"
            alt=""
          />
        </template>
      </VPlaceholderPage>
    </div>

    <section v-show="isRefDetail" class="tab-content is-active">
      <div
        class="is-flex is-align-items-center is-justify-content-space-between"
      >
        <div class="is-flex is-align-items-center">
          <i
            class="fas fa-arrow-left"
            aria-hidden="true"
            @click="isRefDetail = false"
            style="cursor: pointer"
          ></i>
          <p class="title is-6 is-narrow toc-ignore ml-3">
            Employement Reference Details
          </p>
        </div>
        <div class="is-flex is-justify-content-space-between">
          <VButton
            class="ml-3 mr-3"
            color="info"
            icon="fas fa-edit"
            @click="openEditModal(item)"
          >
            Edit
          </VButton>
          <VButton
            color="danger"
            icon="fas fa-trash-alt"
            @click="OpenDeleteSweetAlert(reference.id)"
          >
            Delete
          </VButton>
        </div>
      </div>
      <hr />

      <div class="columns is-raised s-card">
        <div class="column is-2">
          <div class="content">
            <ol class="" style="list-style-type: none; font-weight: bold">
              <li>Referee Name:</li>
              <li>Rferee Contact:</li>
              <li>Job Title:</li>
              <li>Employed From:</li>
              <li>Is Date Confirmed?:</li>
            </ol>
          </div>
        </div>
        <div class="column is-2">
          <div class="content mb-4">
            <ol style="list-style-type: none">
              <li>
                {{ reference.refereeName ? reference.refereeName : "--" }}
              </li>
              <li>
                {{ reference.refereeContact ? reference.refereeContact : "--" }}
              </li>
              <li>{{ reference.jobTitle ? reference.jobTitle : "--" }}</li>
              <li>
                {{ reference.employedFrom ? reference.employedFrom : "--" }}
              </li>
              <li v-if="reference.isDatesConfirmed">
                <VTag
                  color="primary"
                  icon="fas fa-question-circle"
                  label="Confirmed"
                  rounded
                  elevated
                />
              </li>
              <li v-else>
                <VTag
                  color="danger"
                  icon="fas fa-question-circle"
                  label="not Confirmed"
                  rounded
                  elevated
                />
              </li>
            </ol>
          </div>
        </div>

        <div class="column is-2">
          <div class="content">
            <ol style="list-style-type: none; font-weight: bold">
              <li>Referee Email:</li>
              <li>No of Requests:</li>
              <li>Alternate Proof:</li>
              <li>Employed To:</li>
              <li>Verbal Confirmation</li>
            </ol>
          </div>
        </div>

        <div class="column is-2">
          <div class="content">
            <ol style="list-style-type: none">
              <li style="width: 100%; word-wrap: break-word">
                {{ reference.refereeEmail ? reference.refereeEmail : "--" }}
              </li>
              <li>
                {{ reference.noOfRequests ? reference.noOfRequests : "--" }}
              </li>
              <li>
                <div class="is-flex is-align-items-center">
                  <div v-if="reference.alternateProof">
                    <i
                      v-if="reference.alternateProof.includes('.pdf')"
                      @click="
                        () => {
                          pdfDisplayModal = true;
                          currentPdfPreview = reference.alternateProof;
                        }
                      "
                      class="fas fa-file-pdf mr-5"
                      aria-hidden="true"
                      style="
                        cursor: pointer;
                        color: var(--primary);
                        font-size: 20px;
                      "
                    ></i>
                    <i
                      v-else
                      class="fas fa-file-pdf mr-5"
                      aria-hidden="true"
                      @click="
                        () => {
                          pdfDisplayModal = true;
                          currentPdfPreview = reference.alternateProof;
                        }
                      "
                      style="
                        cursor: pointer;
                        color: var(--pink);
                        font-size: 20px;
                      "
                    ></i>
                  </div>
                  <VIconBox
                    size="small"
                    color="info"
                    style="cursor: pointer"
                    rounded
                    @click="() => triggerFileInput('alternateProof')"
                  >
                    <i
                      class="iconify"
                      data-icon="feather:upload-cloud"
                      aria-hidden="true"
                    ></i>
                  </VIconBox>
                </div>
              </li>
              <li>{{ reference.employedTo ? reference.employedTo : "--" }}</li>
              <li>
                {{
                  reference.verbalConfirmationDate
                    ? reference.verbalConfirmationDate
                    : "--"
                }}
              </li>
            </ol>
          </div>
        </div>

        <div class="column is-2">
          <div class="content">
            <ol style="list-style-type: none; font-weight: bold">
              <li>Company Name:</li>
              <li>Last Request Date:</li>
              <li>Reference Documnet:</li>
              <li>Months/Years:</li>
              <li>Employee Name:</li>
            </ol>
          </div>
        </div>
        <div class="column is-2">
          <div class="content">
            <ol style="list-style-type: none">
              <li>
                {{ reference.companyName ? reference.companyName : "--" }}
              </li>
              <li>
                {{
                  reference.lastRequestDate ? reference.lastRequestDate : "--"
                }}
              </li>
              <li>
                <div class="is-flex is-align-items-center">
                  <div v-if="reference.referenceDocument">
                    <i
                      v-if="reference.referenceDocument.includes('.pdf')"
                      @click="
                        () => {
                          pdfDisplayModal = true;
                          currentPdfPreview = reference.referenceDocument;
                        }
                      "
                      class="fas fa-file-pdf mr-5"
                      aria-hidden="true"
                      style="
                        cursor: pointer;
                        color: var(--primary);
                        font-size: 20px;
                      "
                    ></i>
                    <i
                      v-else
                      class="fas fa-file-image mr-5"
                      aria-hidden="true"
                      @click="
                        () => {
                          pdfDisplayModal = true;
                          currentPdfPreview = reference.referenceDocument;
                        }
                      "
                      style="
                        cursor: pointer;
                        color: var(--primary);
                        font-size: 20px;
                      "
                    ></i>
                  </div>
                  <VIconBox
                    size="small"
                    color="info"
                    style="cursor: pointer"
                    rounded
                    @click="() => triggerFileInput('referenceDocument')"
                  >
                    <i
                      class="iconify"
                      data-icon="feather:upload-cloud"
                      aria-hidden="true"
                    ></i>
                  </VIconBox>
                </div>
              </li>
              <li>
                {{
                  calculateDuration(
                    reference.employedFrom,
                    reference.employedTo
                  )
                }}
              </li>
              <li>{{ props.worker.firstName }}</li>
            </ol>
          </div>
        </div>
      </div>
    </section>

    <!--Edit reference and send mail modal-->
    <VModal
      is="form"
      :open="updateReference"
      title="Update Employment Reference"
      size="big"
      actions="right"
      @submit.prevent="editReferanceHandler()"
      @close="updateReference = false"
    >
      <template #content>
        <div class="modal-form">
          <div class="columns">
            <div class="column is-half">
              <div class="field">
                <label class="label">Employement Type</label>
                <div class="control">
                  <VField v-slot="{ id }" class="is-image-select">
                    <VControl>
                      <Multiselect
                        v-model="editReference.type"
                        :attrs="{ id }"
                        placeholder="Select a type"
                        autocomplete="type"
                        label="name"
                        :options="[
                          {
                            value: 'Employment',
                            name: 'Employement',
                          },
                          {
                            value: 'Acdamin',
                            name: 'Academia',
                          },
                          {
                            value: 'Activity',
                            name: 'Activity',
                          },
                        ]"
                      >
                        <template #singlelabel="{ value }">
                          <div class="multiselect-single-label">
                            <span class="select-label-text">
                              {{ value.name }}
                            </span>
                          </div>
                        </template>

                        <template #option="{ option }">
                          <span class="select-label-text">
                            {{ option.name }}
                          </span>
                        </template>
                      </Multiselect>
                    </VControl>
                  </VField>
                </div>
              </div>
            </div>
            <div class="column is-half">
              <div class="field">
                <label class="label">Referee Name *</label>
                <div class="control">
                  <input
                    type="text"
                    name="refereeName"
                    required
                    class="input"
                    @change="(e) => editChangeHandler(e)"
                    placeholder="Referee Name"
                    v-model="editReference.refereeName"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="columns">
            <div class="column is-half">
              <div class="field">
                <label class="label">Referee Phone </label>
                <div class="control">
                  <input
                    type="tel"
                    name="refereeContact"
                    class="input"
                    @change="(e) => editChangeHandler(e)"
                    placeholder="Referee Phone"
                    v-model="editReference.refereeContact"
                  />
                </div>
              </div>
            </div>
            <div class="column is-half">
              <div class="field">
                <label class="label">Referee Email *</label>
                <div class="control">
                  <input
                    type="email"
                    name="refereeEmail"
                    required
                    class="input"
                    @change="(e) => editChangeHandler(e)"
                    placeholder="Referee Email"
                    v-model="editReference.refereeEmail"
                  />
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div class="columns">
            <div class="column is-half">
              <div class="field">
                <label class="label">Company *</label>
                <div class="control">
                  <input
                    type="text"
                    name="companyName"
                    class="input"
                    required
                    placeholder="Company"
                    v-model="editReference.companyName"
                    @change="(e) => editChangeHandler(e)"
                  />
                </div>
              </div>
            </div>
            <div class="column is-half">
              <div class="field">
                <label class="label">Job Title *</label>
                <div class="control">
                  <input
                    type="text"
                    name="jobTitle"
                    required
                    class="input"
                    @change="(e) => editChangeHandler(e)"
                    placeholder="Job Title "
                    v-model="editReference.jobTitle"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="columns">
            <div class="column is-half">
              <div class="field">
                <label class="label">Employment Start Date *</label>
                <div class="control">
                  <input
                    type="date"
                    name="employedFrom"
                    required
                    class="input"
                    @change="(e) => editChangeHandler(e)"
                    placeholder="Referee email"
                    v-model="editReference.employedFrom"
                  />
                </div>
              </div>
            </div>
            <div class="column is-half">
              <div class="field">
                <label class="label">Employment End Date *</label>
                <div class="control">
                  <input
                    type="date"
                    name="employedTo"
                    required
                    class="input"
                    @change="(e) => editChangeHandler(e)"
                    placeholder="Referee email"
                    v-model="editReference.employedTo"
                  />
                </div>
              </div>
            </div>
          </div>
          <!-- <div class="columns">
						<div class="column is-half">
							<div class="field">
								<label class="label">Verbal Confirmation Date *</label>
								<div class="control">
									<input type="date" name="verbalConfirmationDate" class="input"
										placeholder="Employee name" @change="(e) => editChangeHandler(e)"
										v-model="editReference.verbalConfirmationDate" />
								</div>
							</div>
						</div>
						<div class="column is-half">
							<div class="field">
								<label class="label">Is date confirmed *</label>
								<div class="control">
									<VRadio :value="true" label="Yes" name="isDatesConfirmed" color="primary"
										@change="(e) => editChangeHandler(e)"
										v-model="editReference.isDatesConfirmed" />
									<VRadio :value="false" label="No" name="isDatesConfirmed" color="primary"
										@change="(e) => editChangeHandler(e)"
										v-model="editReference.isDatesConfirmed" />
								</div>
							</div>
						</div>
					</div> -->
        </div>
      </template>

      <template #action>
        <VButton type="submit" color="primary" :loading="isLoading" raised
          >Update</VButton
        >
      </template>
    </VModal>

    <!--add reference form modal-->
    <VModal
      is="form"
      :open="addNewRef"
      title="Add Employement Reference"
      size="big"
      actions="right"
      @submit.prevent="addEmployeeRef"
      @close="addNewRef = false"
    >
      <template #content>
        <div class="modal-form">
          <div class="columns">
            <div class="column is-half">
              <div class="field">
                <label class="label">Employement Type</label>
                <div class="control">
                  <VField v-slot="{ id }" class="is-image-select">
                    <VControl>
                      <Multiselect
                        v-model="NewReferenceForm.type"
                        :attrs="{ id }"
                        placeholder="Select a type"
                        autocomplete="type"
                        label="name"
                        :options="[
                          {
                            value: 'Employment',
                            name: 'Employement',
                          },
                          {
                            value: 'Acdamin',
                            name: 'Academia',
                          },
                          {
                            value: 'Activity',
                            name: 'Activity',
                          },
                        ]"
                      >
                        <template #singlelabel="{ value }">
                          <div class="multiselect-single-label">
                            <span class="select-label-text">
                              {{ value.name }}
                            </span>
                          </div>
                        </template>

                        <template #option="{ option }">
                          <span class="select-label-text">
                            {{ option.name }}
                          </span>
                        </template>
                      </Multiselect>
                    </VControl>
                  </VField>
                </div>
              </div>
            </div>
            <div class="column is-half">
              <div class="field">
                <label class="label">Job Title </label>
                <div class="control">
                  <input
                    type="text"
                    name="jobTitle"
                    @change="(e) => inputChangeHandler(e)"
                    class="input"
                    placeholder="Job title"
                    v-model="NewReferenceForm.jobTitle"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="columns">
            <div class="column is-half">
              <div class="field">
                <label class="label">Employement Start Date *</label>
                <div class="control">
                  <input
                    type="date"
                    name="employedFrom"
                    required
                    @change="(e) => inputChangeHandler(e)"
                    class="input"
                    placeholder="Start date"
                    v-model="NewReferenceForm.employedFrom"
                  />
                </div>
              </div>
            </div>
            <div class="column is-half">
              <div class="field">
                <label class="label">Employement End Date *</label>
                <div class="control">
                  <input
                    type="date"
                    name="employedTo"
                    required
                    @change="(e) => inputChangeHandler(e)"
                    class="input"
                    placeholder="End date"
                    v-model="NewReferenceForm.employedTo"
                  />
                </div>
              </div>
            </div>
          </div>

          <hr />
          <span style="font-weight: bold; line-height: 3"
            >Referee Information</span
          >

          <div class="columns">
            <div class="column is-half">
              <div class="field">
                <label class="label">Referee Name </label>
                <div class="control">
                  <input
                    type="text"
                    name="refereeName"
                    @change="(e) => inputChangeHandler(e)"
                    class="input"
                    placeholder="Referee name"
                    v-model="NewReferenceForm.refereeName"
                  />
                </div>
              </div>
            </div>
            <div class="column is-half">
              <div class="field">
                <label class="label">Referee Email *</label>
                <div class="control">
                  <input
                    type="email"
                    name="refereeEmail"
                    required
                    @change="(e) => inputChangeHandler(e)"
                    class="input"
                    placeholder="Referee email"
                    v-model="NewReferenceForm.refereeEmail"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="columns">
            <div class="column is-half">
              <div class="field">
                <label class="label">Company </label>
                <div class="control">
                  <input
                    type="text"
                    name="companyName"
                    @change="(e) => inputChangeHandler(e)"
                    class="input"
                    placeholder="Company"
                    v-model="NewReferenceForm.companyName"
                  />
                </div>
              </div>
            </div>
            <div class="column is-half">
              <div class="field">
                <label class="label">Referee Phone </label>
                <div class="control">
                  <input
                    type="tel"
                    name="refereeContact"
                    @change="(e) => inputChangeHandler(e)"
                    class="input"
                    placeholder="Referee phone"
                    v-model="NewReferenceForm.refereeContact"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- <span style="font-weight: bold"><i class="fas fa-times" style="color: red"></i>&nbsp;Signed
						declaration form not attached.</span> -->
        </div>
      </template>

      <template #action>
        <div class="d-flex justify-center">
          <VButton
            type="submit"
            icon="fas fa-plus"
            :loading="isLoading"
            color="primary"
            raised
          >
            Create Reference
          </VButton>
          <!-- <VButton icon="fas fa-envelope" color="info" raised @click="refSendMail = true">Create
						reference and send email</VButton> -->
        </div>
      </template>

      <template #cancel>
        <VButton style="display: none">Close</VButton>
      </template>
    </VModal>

    <!--pdf display modal-->

    <VModal
      title="PDF File"
      :open="pdfDisplayModal"
      size="big"
      actions="right"
      @close="pdfDisplayModal = false"
    >
      <template #content>
        <div class="modal-form">
          <iframe
            v-if="currentPdfPreview.includes('.pdf')"
            :src="currentPdfPreview"
            style="width: 100%; height: 800px; border: none"
          >
            Oops! an error has occurred.
          </iframe>
          <img v-else :src="currentPdfPreview" alt="" />
        </div>
      </template>

      <template #action>
        <!-- <VButton type="submit" color="primary" raised>Publish</VButton> -->
      </template>

      <template #cancel>
        <VButton rounded @click="pdfDisplayModal = false"> Close </VButton>
      </template>
    </VModal>

    <!--Create reference and send mail modal-->
    <VModal
      title="Reference link"
      size="small"
      :open="refSendMail"
      actions="right"
      @close="refSendMail = false"
    >
      <template #content>
        <div class="content rounded px-5">
          <!-- <VField>
						<VControl>
							<VTextarea v-model="textArea" rows="8" placeholder="A longer message..."></VTextarea>
						</VControl>
					</VField> -->
          <div class="field mb-6">
            <label class="label">Link :</label>
            <VField addons>
              <VControl expanded>
                <VInput
                  v-model="refLink"
                  type="text"
                  class="input"
                  :placeholder="Loading ? 'Loading...' : 'Invitation Link'"
                />
              </VControl>
              <VControl>
                <VButton
                  icon="fas fa-copy"
                  @click="copyToClipBoard(refLink)"
                  color="info"
                >
                  Copy
                </VButton>
              </VControl>
            </VField>
          </div>
          <div class="field">
            <label class="label">Email</label>
            <VField addons>
              <VControl expanded>
                <VInput
                  v-model="props.worker.emailAddress"
                  type="email"
                  name="employedFrom"
                  class="input"
                  placeholder="Email address"
                />
              </VControl>
              <VControl>
                <VButton
                  icon="fas fa-envelope"
                  @click="sendEmail(props.worker.emailAddress)"
                  color="primary"
                >
                  Send
                </VButton>
              </VControl>
            </VField>
            <!-- <div class="control">
							<input type="email" name="employedFrom" readonly v-model="props.worker.emailAddress" required
								class="input" placeholder="Email address" />
						</div> -->
          </div>
        </div>
      </template>

      <template #action>
        <VButton
          @click="sendEmail(props.worker.emailAddress)"
          color="primary"
          style="display: none"
          raised
          icon="fas fa-envelope"
          >Send
        </VButton>
      </template>

      <template #cancel>
        <VButton @click="refSendMail = false" style="display: none"
          >Close</VButton
        >
      </template>
    </VModal>
  </div>

  <SweetAlert
    v-if="SweetAlertProps.isSweetAlertOpen"
    :isSweetAlertOpen="SweetAlertProps.isSweetAlertOpen"
    :title="SweetAlertProps.title"
    :subtitle="SweetAlertProps.subtitle"
    :btntext="SweetAlertProps.btntext"
    :onConfirm="deleteReferenceHandler"
    :onCancel="() => (SweetAlertProps.isSweetAlertOpen = false)"
  />

  <SweetAlert
    v-if="RequestSweetAlertProps.isRequestSweetAlertOpen"
    :isRequestSweetAlertOpen="RequestSweetAlertProps.isRequestSweetAlertOpen"
    :title="RequestSweetAlertProps.title"
    :subtitle="RequestSweetAlertProps.subtitle"
    :btntext="RequestSweetAlertProps.btntext"
    :onConfirm="deleteRequestHandler"
    :onCancel="() => (RequestSweetAlertProps.isRequestSweetAlertOpen = false)"
  />

  <SweetAlert
    v-if="deleteRequestInfoSweetAlertProps.isDeleteRequestInfoSweetAlertOpen"
    :isDeleteRequestInfoSweetAlertOpen="
      deleteRequestInfoSweetAlertProps.isDeleteRequestInfoSweetAlertOpen
    "
    :title="deleteRequestInfoSweetAlertProps.title"
    :subtitle="deleteRequestInfoSweetAlertProps.subtitle"
    :btntext="deleteRequestInfoSweetAlertProps.btntext"
    :onConfirm="deleteRequestInfoHandler"
    :onCancel="
      () =>
        (deleteRequestInfoSweetAlertProps.isDeleteRequestInfoSweetAlertOpen = false)
    "
  />

  <SweetAlert
    v-if="sendMailSweetAlertProps.isEmailSweetAlertOpen"
    :isEmailSweetAlertOpen="sendMailSweetAlertProps.isEmailSweetAlertOpen"
    :title="sendMailSweetAlertProps.title"
    :subtitle="sendMailSweetAlertProps.subtitle"
    :btntext="sendMailSweetAlertProps.btntext"
    :onConfirm="sendRefernceEmailToReferee"
    :onCancel="() => (sendMailSweetAlertProps.isEmailSweetAlertOpen = false)"
  />
</template>

<style scoped lang="scss">
@import "/@src/scss/abstracts/all";
@import "/@src/scss/components/profile-stats";
.cus-del-icon {
  color: #989898;
  transition: all 0.1s ease-in-out;

  &:hover {
    color: var(--danger);
    transform: scale(1.06);
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
</style>
