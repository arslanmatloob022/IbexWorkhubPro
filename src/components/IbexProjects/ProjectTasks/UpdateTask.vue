<script setup lang="ts">
import { ref, computed, onMounted, toRefs } from "vue";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { convertToFormData } from "/@src/composable/useSupportElement";
import { CalendarTaskStatus } from "../../IbexJobsEstimates/estimatesScripts";
import { start } from "nprogress";
const notyf = useNotyf();
const api = useApi();
const allWorkers = ref([]);
const allSupplier = ref([]);
const loading = ref(false);
const delLoading = ref(false);
let selectWorkersSlot = ref<any>([]);
let selectSupplierSlot = ref<any>([]);
const selectedWorkers = ref([]);
const selectSupplierSlotValue = ref();
const selectSupplierSlotOptions = [
  {
    value: "javascript",
    name: "Javascript",
    icon: "/images/icons/stacks/js.svg",
  },
];

const props = withDefaults(
  defineProps<{
    isOpen?: boolean;
    taskIdSelected?: string;
    projectID?: string;
    endDate?: string;
    startDate?: string;
  }>(),
  {
    isOpen: false,
    taskIdSelected: "",
    projectID: "",
    endDate: "",
    startDate: "",
  }
);

const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: null): void;
}>();

const taskData = ref({
  title: "",
  description: "",
  startDate: "",
  endDate: "",
  status: "",
  quantity: "",
  supplier: "",
  unit: "",
  costCode: "",
  color: "",
  project: "",
  priority: "",
  internalNotes: "",
  workers: [],
});

const TaskStatus = [
  { value: "active", name: "Active" },
  { value: "pending", name: "Pending" },
  { value: "completed", name: "Completed" },
  { value: "cancelled", name: "Cancelled" },
];

const fetchTaskData = async () => {
  try {
    loading.value = true;
    const response = await api.get(
      `/api/task/${props.taskIdSelected ? props.taskIdSelected : ""}/`
    );
    taskData.value = response.data;
    selectWorkersSlot.value = response.data.workers.map(
      (worker: any) => worker.id
    );
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

watch(selectWorkersSlot.value, () => {
  console.log("data type", selectWorkersSlot);
});

const editTaskHandler = async () => {
  try {
    loading.value = true;
    taskData.value.workers = selectWorkersSlot.value;
    let formData = convertToFormData(taskData.value, ["workers"]);
    if (!props.taskIdSelected) {
      formData.append("schedule_mode", "false");
      formData.append("project", `${props.projectID}`);
      await api.post(`/api/task/`, formData);
      emit("update:OnSuccess", null);
      notyf.success("Task added successfully");
    } else {
      formData.append("schedule_mode", "false");
      await api.patch(`/api/task/${taskData.value.id}/`, formData);
      notyf.success("Task updated successfully");
      emit("update:OnSuccess", null);
    }
    closeModalHandler();
  } catch (err) {
    console.log(err);
    // notyf.error("Something went wrong");
  } finally {
    loading.value = false;
  }
};

const deleteTask = async () => {
  try {
    delLoading.value = true;
    const response = await api.delete(`/api/task/${props.taskIdSelected}/`);
    console.log(response);
    notyf.error("Task deleted successfully");
    closeModalHandler();
    emit("update:OnSuccess", null);
  } catch (err) {
    console.log(err);
  } finally {
    delLoading.value = false;
  }
};

const getWorkershandler = async () => {
  try {
    loading.value = true;
    const response = await api.get("/api/users/by-role-option/worker/", {});
    allWorkers.value = response.data.map((worker) => {
      return {
        value: worker.id,
        label: worker.username,
      };
    });
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const getSubContractorHandler = async () => {
  try {
    loading.value = true;
    const response = await api.get("/api/users/by-role-option/supplier/", {});
    allSupplier.value = response.data.map((supplier) => {
      return {
        value: supplier.id,
        label: supplier.username,
      };
    });
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const conflictsMappedTasks = ref({
  found_tasks: false,
  map: [
    {
      month: "April 2025",
      found_task: false,
      dates: [
        {
          date: "2025-04-15",
          count: 0,
          tasks: [],
        },
      ],
    },
  ],
});

const openConflictModal = ref(false);

const getWorkerConflictedTaskDate = async () => {
  try {
    const resp = await api.get(
      `/api/task/worker-wise-date-map/${selectWorkersSlot.value}/?start_date=${taskData.value.startDate}&end_date=${taskData.value.endDate}`
    );
    conflictsMappedTasks.value = resp.data;
  } catch (err) {
    console.log(err);
  }
};

const isInitialized = ref(false);

watch(
  () => selectWorkersSlot.value,
  () => {
    if (!isInitialized.value) {
      isInitialized.value = true;
      return;
    }
    getWorkerConflictedTaskDate();
  }
);

const Loading = ref(false);
const costCodesWholeList = ref([]);
const costCodesList = ref([]);
const getCostCodesHandler = async () => {
  try {
    Loading.value = true;
    const response = await api.get(`/api/cost-code/`);
    costCodesWholeList.value = response.data;
    costCodesList.value = response.data.map((item: any) => {
      return {
        value: item.id,
        label: item.name,
        labour_cost: item.labour_cost,
        unit_cost: item.unit_cost ?? 0.0,
        worker_cost: item.worker_cost ?? 0.0,
        unit: item.unit ?? "--",
      };
    });
  } catch (err) {
    console.log(err);
  } finally {
    Loading.value = false;
  }
};

const closeModalHandler = () => {
  emit("update:modalHandler", false);
  console.log("modal closed");
};

onMounted(() => {
  if (props.taskIdSelected) {
    fetchTaskData();
  }
  getCostCodesHandler();
  getWorkershandler();
  getSubContractorHandler();
  if (props.startDate) {
    taskData.value.startDate = props.startDate;
    taskData.value.endDate = props.endDate;
  }
});
</script>

<template>
  <VModal
    is="form"
    :open="props.isOpen"
    :title="props.taskIdSelected ? 'Update Task' : 'Add Task'"
    size="big"
    actions="right"
    @submit.prevent="editTaskHandler"
    @close="closeModalHandler"
  >
    <template #content>
      <div class="modal-form columns is-multiline">
        <div class="field column is-6 mb-0">
          <VField>
            <VLabel>Title: *</VLabel>
            <VControl>
              <VInput
                required
                v-model="taskData.title"
                type="text"
                :placeholder="loading ? 'Loading...' : 'Title'"
              />
            </VControl>
          </VField>
        </div>

        <!-- supplier -->
        <div class="field column is-6 mb-0">
          <label>Status </label>
          <VField>
            <VControl>
              <VSelect
                v-model="taskData.status"
                name="status"
                class="is-rounded"
              >
                <VOption value="">Select Status</VOption>
                <VOption
                  v-for="task in CalendarTaskStatus"
                  :key="task.value"
                  :value="task.value"
                  >{{ task.name }}
                </VOption>
              </VSelect>
            </VControl>
          </VField>
        </div>

        <!-- email -->
        <div class="field column is-6 mb-0">
          <VField>
            <VLabel>Cost Code: *</VLabel>
            <VControl>
              <VInput
                required
                type="text"
                :placeholder="loading ? 'Loading...' : 'Cost code'"
                v-model="taskData.costCode"
              />
            </VControl>
          </VField>
        </div>

        <div class="field column is-6">
          <label>New Cost Code List *</label>
          <VField v-slot="{ id }">
            <VControl>
              <Multiselect
                required
                v-model="taskData.costCode"
                :attrs="{ id }"
                :searchable="true"
                :options="costCodesList"
                placeholder="Select a cost code"
              />
            </VControl>
          </VField>
        </div>

        <!-- phone number -->
        <div class="field column is-3 mb-0">
          <VField>
            <VLabel>Quantity</VLabel>
            <VControl>
              <VInput
                type="text"
                :placeholder="loading ? 'Loading...' : 'Quantity'"
                v-model="taskData.quantity"
              />
            </VControl>
          </VField>
        </div>

        <!-- post code -->
        <div class="field column is-3 mb-0">
          <VField>
            <VLabel>Unit</VLabel>
            <VControl>
              <VInput
                type="text"
                :placeholder="loading ? 'Loading...' : 'Unit'"
                v-model="taskData.unit"
              />
            </VControl>
          </VField>
        </div>

        <!-- lin manger -->
        <div class="field column is-3 mb-0">
          <VField>
            <VLabel>Start Date</VLabel>
            <VControl>
              <VInput
                type="date"
                :placeholder="loading ? 'Loading...' : 'Start date'"
                v-model="taskData.startDate"
              />
            </VControl>
          </VField>
        </div>

        <div class="field column is-3 mb-0">
          <VField>
            <VLabel>End Date</VLabel>
            <VControl>
              <VInput
                type="date"
                :placeholder="loading ? 'Loading...' : 'End date'"
                v-model="taskData.endDate"
              />
            </VControl>
          </VField>
        </div>
        <div class="field column is-6 mb-0">
          <label>Select workers * </label>
          <span
            @click="openConflictModal = true"
            v-if="conflictsMappedTasks.found_tasks"
            class="warning-text cu-pointer"
          >
            Found Tasks Conflicts
            <i class="fas fa-exclamation-triangle ml-2" aria-hidden="true"></i>
          </span>
          <VField v-slot="{ id }">
            <VControl>
              <Multiselect
                v-model="selectWorkersSlot"
                :attrs="{ id }"
                mode="tags"
                :searchable="true"
                :create-tag="true"
                :options="allWorkers"
                placeholder="Add workers"
              />
            </VControl>
          </VField>
        </div>
        <div class="field column is-6 mb-0">
          <label>Select Subcontractor * </label>
          <VField v-slot="{ id }">
            <VControl>
              <Multiselect
                v-model="taskData.supplier"
                :required="selectWorkersSlot ? false : true"
                :attrs="{ id }"
                :searchable="true"
                :create-tag="true"
                :options="allSupplier"
                placeholder="Add sub-contractor"
              />
            </VControl>
          </VField>
        </div>

        <!-- address -->
        <div class="field column is-6 mb-0">
          <VField>
            <VLabel>Description</VLabel>
            <VControl>
              <VTextarea
                type="text"
                rows="3"
                :placeholder="loading ? 'Loading...' : 'Description'"
                v-model="taskData.description"
              />
            </VControl>
          </VField>
        </div>

        <!-- Industry -->
        <div class="field column is-6 mb-0">
          <VField>
            <VLabel>Internal Notes</VLabel>
            <VControl>
              <VTextarea
                type="text"
                rows="3"
                :placeholder="loading ? 'Loading...' : 'Internal notes'"
                v-model="taskData.internalNotes"
              />
            </VControl>
          </VField>
        </div>
        <WorkerTasksConflicts
          v-if="openConflictModal"
          :conflicts-detail-modal="openConflictModal"
          :conflict-data="conflictsMappedTasks"
          :startDate="taskData.startDate"
          :endDate="taskData.endDate"
          @update:modal-handler="openConflictModal = false"
        />
      </div>
    </template>
    <template #action>
      <VButton
        v-if="props.taskIdSelected"
        @click="deleteTask"
        class="is-left"
        color="danger"
        :loading="delLoading"
        raised
        >Delete</VButton
      >
      <VButton type="submit" :loading="loading" color="primary" raised>{{
        props.taskIdSelected ? "Update Task" : "Add Task"
      }}</VButton>
    </template>
  </VModal>
</template>
