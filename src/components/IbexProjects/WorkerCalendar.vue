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
    type: Boolean;
    default: false;
  };
  closeModal: {
    type: Function;
    default: () => {};
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
    type: Number;
    default: null;
  };
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
