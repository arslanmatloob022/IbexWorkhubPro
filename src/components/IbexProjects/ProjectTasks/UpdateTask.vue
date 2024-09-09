<script setup lang="ts">
import { ref, computed, onMounted, toRefs } from "vue";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { convertToFormData } from "/@src/composable/useSupportElement";

const notyf = useNotyf();
const api = useApi();
const allWorkers = ref([]);
const loading = ref(false);
const selectedWorkers = ref([]);

const props = defineProps<{
  isOpen: {
    type: boolean;
    default: undefined;
  };
  taskId: {
    type: Number;
    default: null;
  };
  projectID: {
    type: Number;
    default: null;
  };
  startDate: {
    type: String;
    default: null;
  };
}>();

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
  unit: "",
  costCode: "",
  color: "",
  project: "",
  workers: [],
});

const Taskstatus = [
  { value: "active", name: "Active" },
  { value: "pending", name: "Pending" },
  { value: "completed", name: "Completed" },
  { value: "cancelled", name: "Cancelled" },
];

const modalTitle = computed(() => (props.taskId ? "Edit Task" : "Add Task"));

const removeWorker = (index: any) => {
  selectedWorkers.value.splice(index, 1);
};

const fetchTaskData = async () => {
  try {
    loading.value = true;
    const response = await api.get(`/api/task/${props.taskId}`);
    taskData.value = response.data;
    selectedWorkers.value = response.data.workers;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const editTaskHandler = async () => {
  try {
    loading.value = true;
    let workerIDs = selectedWorkers.value.map((item) => item.id);
    taskData.value.workers = workerIDs;
    let formData = convertToFormData(taskData.value, []);

    if (props.projectID) {
      // store.state.isScheduleMode
      formData.append("schedule_mode", false);
      formData.append("project", props.projectID);
      await api.post(`/api/task/`, formData);
      notyf.success("Task added successfully");
    } else {
      // store.state.isScheduleMode
      formData.append("schedule_mode", false);
      await api.patch(`/api/task/${taskData.value.id}/`, formData);
      notyf.success("Task updated successfully");
    }
    closeModalHandler();
    emit("update:OnSuccess", null);
  } catch (err) {
    notyf.error("Something went wrong");
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const deleteTask = async () => {
  try {
    loading.value = true;
    const response = await api.delete(`/api/task/${props.taskId}/`);
    console.log(response);
    notyf.error("Task deleted successfully");
    closeModalHandler();
    emit("update:OnSuccess", null);
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const getWorkershandler = async () => {
  try {
    loading.value = true;
    const response = await api.get("/api/users/by-role-option/worker/", {});
    allWorkers.value = response.data;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const closeModalHandler = () => {
  emit("update:modalHandler", false);
  console.log("modal closed");
};

onMounted(() => {
  if (props.taskId) {
    fetchTaskData();
  }
  getWorkershandler();

  if (props.startDate) {
    taskData.value.startDate = props.startDate;
  }
});
</script>

<template>
  <VModal
    is="form"
    :open="props.isOpen"
    :title="props.taskId ? 'Update Task' : 'Add New Task'"
    size="big"
    actions="right"
    @submit.prevent="editTaskHandler"
    @close="closeModalHandler"
  >
    <template #content>
      <div class="modal-form columns cu-all-input is-multiline">
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
                  v-for="task in Taskstatus"
                  :key="task.value"
                  :value="task.value"
                  >{{ task.value }}
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

        <!-- phone number -->
        <div class="field column is-6 mb-0">
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
        <div class="field column is-6 mb-0">
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
        <div class="field column is-6 mb-0">
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

        <div class="field column is-6 mb-0">
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

        <!-- external id -->
        <div class="field column is-6 mb-0">
          <VField>
            <VLabel>Color</VLabel>
            <VControl>
              <VInput
                type="color"
                :placeholder="loading ? 'Loading...' : 'End date'"
                v-model="taskData.color"
              />
            </VControl>
          </VField>
        </div>

        <div class="field column is-6 mb-0">
          <label>Select workers * </label>
          <VField>
            <VControl>
              <VSelect
                v-model="selectedWorkers"
                multiple
                required
                name="status"
                class="is-rounded"
              >
                <VOption
                  v-for="worker in allWorkers"
                  :key="worker.id"
                  :value="worker"
                  >{{ worker.username }}
                </VOption>
              </VSelect>
            </VControl>
          </VField>
          <!-- <VField v-slot="{ id }">
            <VLabel>Method</VLabel>
            <VControl>
              <Multiselect
                v-model="selectedWorkers"
                :attrs="{ id }"
                :options="[
                  'LVL 1 Security warehouse',
                  'LVL 2 Security warehouse',
                  'LVL 3 Security warehouse',
                ]"
                placeholder="Select a storage"
              />
            </VControl>
          </VField> -->
        </div>
        <div class="field column is-6 mb-0">
          <div class="flex-grid fullWidth">
            <VTags
              v-for="(worker, index) in selectedWorkers"
              :key="index"
              addons
            >
              <VTag :label="worker.username" color="primary" />
              <VTag @click="removeWorker(index)" remove />
            </VTags>
          </div>
        </div>

        <!-- address -->
        <div class="field column is-12 mb-0">
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
        <div class="field column is-6 mb-0"></div>
      </div>
    </template>
    <template #action>
      <VButton @click="deleteTask" class="is-left" color="danger" raised
        >Delete</VButton
      >
      <VButton type="submit" color="primary" raised>Save</VButton>
    </template>
  </VModal>
</template>
