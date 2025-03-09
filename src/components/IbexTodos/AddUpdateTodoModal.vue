<script setup lang="ts">
import axios from "axios";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { convertToFormData } from "/@src/composable/useSupportElement";
import { useUserSession } from "/@src/stores/userSession";
import { getAddressComponents } from "/@src/composable/useSupportElement";
const fileInput = ref<HTMLInputElement | null>(null);
const userSession = useUserSession();
const notyf = useNotyf();
const api = useApi();
const isLoading = ref(false);

const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: null): void;
}>();

const props = defineProps<{
  openTodoModal?: boolean;
  todoId?: string;
  project?: string;
  task?: string;
  assigned_to?: string;
}>();

const closeModalHandler = () => {
  emit("update:modalHandler", false);
};
const updateOnSuccessHandler = () => {
  emit("update:OnSuccess", null);
};
const companyUsersOptions = ref([
  {
    value: "",
    name: "",
    image: "",
  },
]);

interface TodoDataModel {
  assigned_to: string[];
  project: string;
  task: string;
  title: string;
  description: string;
  color: string;
  file: null | File | string;
  is_completed: boolean;
  time_to_complete: string;
  created_by: string;
  date: string;
  time: string;
}

const todoFormData = ref<TodoDataModel>({
  assigned_to: [],
  project: props.project ? props.project : "",
  task: props.task ? props.task : "",
  title: "",
  description: "",
  color: "",
  file: "",
  date: "",
  time: "",
  is_completed: false,
  time_to_complete: "",
  created_by: userSession.user.id,
});

const addUpdateTodoHandler = async () => {
  try {
    isLoading.value = true;
    const formDataAPI = convertToFormData(todoFormData.value, ["file"]);
    if (props.todoId) {
      const response = await api.patch(
        `/api/todo/${props.todoId}/`,
        formDataAPI
      );
      notyf.success("Todo updated successfully");
    } else {
      const response = await api.post("/api/todo/", formDataAPI);
      notyf.success("Todo added successfully");
    }
    updateOnSuccessHandler();
    closeModalHandler();
  } catch (error: any) {
    notyf.error(` ${error}, Todo`);
  } finally {
    isLoading.value = false;
  }
};

const getTodoHandler = async () => {
  try {
    isLoading.value = true;
    const response = await api.get(`/api/activity/${props.todoId}/`);
    todoFormData.value = response.data;
  } catch (error: any) {
    notyf.error(` ${error}, Get Todo`);
  } finally {
    isLoading.value = false;
  }
};

const getAllUsersHandler = async () => {
  try {
    isLoading.value = true;
    const response = await api.get("/api/users/");
    companyUsersOptions.value = response.data.map((user: any) => {
      return {
        value: user.id,
        name: `${user.username ?? "N/A"} ${user.last_name ?? ""}`,
        icon: user.avatar,
      };
    });
  } catch (error: any) {
    notyf.error(`something get wrong`);
  } finally {
    isLoading.value = false;
  }
};
const fileName = ref("");
const fileSize = ref(0);

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const selectedFile = input.files?.[0];
  input.value = "";
  if (selectedFile) {
    todoFormData.value.file = selectedFile;
    fileName.value = selectedFile.name;
    fileSize.value = selectedFile.size;
  }
};

onMounted(() => {
  getAllUsersHandler();
  if (props.todoId) {
    getTodoHandler();
  }
});
</script>

<template>
  <VModal
    is="form"
    :open="props.openTodoModal"
    title="Todo"
    size="large"
    actions="right"
    @submit.prevent="addUpdateTodoHandler"
    @close="closeModalHandler"
  >
    <template #content>
      <div class="modal-form columns is-multiline">
        <div class="column is-12">
          <VCard class="columns is-multiline">
            <div class="field column is-12 mb-0">
              <label>Title *</label>
              <div class="control">
                <input
                  type="text"
                  name="title"
                  v-model="todoFormData.title"
                  required
                  class="input is-primary-focus is-primary-focus"
                  placeholder="Todo Title"
                />
              </div>
            </div>

            <!-- Date -->
            <div class="field column is-6 mb-0">
              <label>Completion Date </label>
              <input
                type="date"
                name="date"
                v-model="todoFormData.date"
                required
                class="input is-primary-focus is-primary-focus"
                placeholder="Completion Date"
              />
            </div>

            <div class="field column is-6 mb-0">
              <label>Time </label>
              <input
                type="time"
                name="date"
                v-model="todoFormData.time"
                class="input is-primary-focus is-primary-focus"
                placeholder="Todo Time"
              />
            </div>
            <div class="field column is-6 mb-0">
              <label>Color </label>
              <VField>
                <VControl>
                  <VInput
                    v-model="todoFormData.color"
                    list="colors-list"
                    type="color"
                    placeholder="Pick a color"
                  />
                  <datalist id="colors-list">
                    <option value="#84cc16" />
                    <option value="#22c55e" />
                    <option value="#0ea5e9" />
                    <option value="#6366f1" />
                    <option value="#8b5cf6" />
                    <option value="#d946ef" />
                    <option value="#f43f5e" />
                    <option value="#facc15" />
                    <option value="#fb923c" />
                    <option value="#9ca3af" />
                  </datalist>
                </VControl>
              </VField>
            </div>
            <div class="field column is-6 mb-0">
              <!-- <input
                ref="fileInput"
                type="file"
                style="display: none"
                @change="handleFileChange"
                accept="image/*,application/pdf"
              /> -->
              <label>Attachment </label>
              <VField grouped>
                <VControl>
                  <div class="file">
                    <label class="file-label">
                      <input
                        @change="handleFileChange"
                        class="file-input"
                        type="file"
                        name="resume"
                      />
                      <span class="file-cta">
                        <span class="file-icon">
                          <i class="fas fa-cloud-upload-alt" />
                        </span>
                        <span class="file-label">
                          {{ fileName ? fileName : "Choose a file…" }}
                        </span>
                      </span>
                    </label>
                  </div>
                </VControl>
              </VField>
            </div>

            <div class="field column is-12 mb-0">
              <label>Assignees * </label>
              <VField v-slot="{ id }">
                <VControl>
                  <Multiselect
                    required
                    v-model="todoFormData.assigned_to"
                    :attrs="{ id }"
                    mode="tags"
                    placeholder="Select a user"
                    track-by="name"
                    label="name"
                    :search="true"
                    :searchable="true"
                    :options="companyUsersOptions"
                    :max-height="145"
                  >
                    <template #tag="{ option, remove, disabled }">
                      <div class="multiselect-tag is-user">
                        <img :src="option.image" alt="" />
                        {{ option.name }}
                        <i
                          v-if="!disabled"
                          role="button"
                          tabindex="0"
                          @click.prevent
                          @mousedown.prevent.stop="remove(option)"
                        />
                      </div>
                    </template>
                  </Multiselect>
                </VControl>
              </VField>
            </div>
          </VCard>

          <VCard class="columns is-multiline mt-3">
            <!-- <div class="column is-12">
              <h3 class="title is-6 mb-2">Location</h3>
            </div> -->
            <div class="field column is-12 mb-0">
              <label>Description </label>
              <VField>
                <VControl>
                  <VTextarea
                    v-model="todoFormData.description"
                    rows="3"
                    placeholder="Enter description..."
                  />
                </VControl>
              </VField>
            </div>
          </VCard>
        </div>
      </div>
    </template>
    <template #action>
      <VButton :loading="isLoading" type="submit" color="primary" raised
        >{{ props.todoId ? "Update" : "Create" }}
      </VButton>
    </template>
  </VModal>
</template>
