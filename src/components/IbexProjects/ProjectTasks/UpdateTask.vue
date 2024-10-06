<script setup lang="ts">
import { ref, computed, onMounted, toRefs } from "vue";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { convertToFormData } from "/@src/composable/useSupportElement";

const notyf = useNotyf();
const api = useApi();
const allWorkers = ref([]);
const loading = ref(false);
let selectWorkersSlot = ref<any>([]);
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
  unit: "",
  costCode: "",
  color: "",
  project: "",
  priority: "",
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
      `/api/task/${props.taskIdSelected ? props.taskIdSelected : ""}`
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
    notyf.error("Something went wrong");
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const deleteTask = async () => {
  try {
    loading.value = true;
    const response = await api.delete(`/api/task/${props.taskIdSelected}/`);
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

const closeModalHandler = () => {
  emit("update:modalHandler", false);
  console.log("modal closed");
};

onMounted(() => {
  if (props.taskIdSelected) {
    fetchTaskData();
  }
  getWorkershandler();

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
                  v-for="task in TaskStatus"
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

        <!-- external id -->
        <div class="field column is-6 mb-0">
          <VField>
            <VLabel>Priority</VLabel>
            <VControl>
              <VSelect v-model="taskData.priority">
                <VOption value=""> Select priority level </VOption>
                <VOption value="Low"> Low </VOption>
                <VOption value="Medium"> Medium </VOption>
                <VOption value="High"> High </VOption>
              </VSelect>
            </VControl>
          </VField>
        </div>

        <div class="field column is-6 mb-0">
          <label>Select workers * </label>
          <VField v-slot="{ id }">
            <VControl>
              <Multiselect
                v-model="selectWorkersSlot"
                required
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
      </div>
    </template>
    <template #action>
      <VButton
        v-if="props.taskIdSelected"
        @click="deleteTask"
        class="is-left"
        color="danger"
        raised
        >Delete</VButton
      >
      <VButton type="submit" color="primary" raised>{{
        props.taskIdSelected ? "Update Task" : "Add Task"
      }}</VButton>
    </template>
  </VModal>
</template>
