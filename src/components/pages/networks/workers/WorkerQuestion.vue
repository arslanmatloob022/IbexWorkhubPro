<script setup lang="ts">
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { useElements } from "/@src/stores/supportElements";
import { useCompany } from "/@src/stores/company";

const company = useCompany();
const Loading = ref(false);
const notyf = useNotyf();
const api = useApi();

const workerQuestionsData = ref({
  id: 0,
  title: "",
  type: "CheckBox",
  correctAnswer: "",
  questionFor: "",
  created_at: "",
  arezCompany: 0,
  industry: 0,
});

const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: null): void;
}>();

const props = defineProps<{
  QuestionModalOpen?: boolean;
  type?: String;
  industryID?: Number;
  questionId?: Number;
}>();

const closeModalHandler = () => {
  emit("update:modalHandler", false);
};

const AddQuestion = async () => {
  try {
    const payload = {
      title: workerQuestionsData.value.title,
      type: workerQuestionsData.value.type,
      correctAnswer: workerQuestionsData.value.correctAnswer,
      questionFor: props.type,
      arezCompany: company.loggedCompany.id,
      industry: props.industryID,
    };
    if (props.questionId) {
      const resp = await api.patch(
        `/v3/api/partner/questions/${props.questionId}/`,
        payload
      );
      console.log("question", resp.data);
      notyf.success("Question updated succesfuly.");
    } else {
      const resp = await api.post("/v3/api/partner/questions/", payload);
      console.log("question", resp.data);
      notyf.success("Question added succesfuly.");
    }

    emit("update:OnSuccess", null);
  } catch (err) {
    console.log(err);
  }
};
const getQuestion = async () => {
  try {
    const response = await api.get(
      `/v3/api/partner/questions/${props.questionId}/`
    );
    workerQuestionsData.value = response.data;
  } catch (err) {
    console.log(err);
  }
};

onMounted(() => {
  if (props.questionId) {
    getQuestion();
  }
});
</script>

<template>
  <VModal
    is="form"
    :open="props.QuestionModalOpen"
    title="Question"
    actions="right"
    @submit.prevent="AddQuestion"
    @close="closeModalHandler"
  >
    <template #content>
      <div class="modal-form columns is-multiline">
        <div class="field column is-12 mb-0">
          <label>Questoin Title: *</label>
          <div class="control">
            <input
              type="text"
              name="title"
              v-model="workerQuestionsData.title"
              class="input is-primary-focus"
              placeholder="Question Title"
            />
          </div>
        </div>
        <div class="field column is-12 mb-0">
          <label>Answer type: *</label>
          <VField class="is-flex">
            <VControl raw subcontrol>
              <VRadio
                v-model="workerQuestionsData.type"
                value="CheckBox"
                label="Choice"
                color="primary"
              />
            </VControl>
            <VControl raw subcontrol>
              <VRadio
                v-model="workerQuestionsData.type"
                value="Input"
                label="Text"
                color="info"
              />
            </VControl>
          </VField>
        </div>
        <div
          v-if="workerQuestionsData.type == 'CheckBox'"
          class="field column is-12 mb-0"
        >
          <label>Correct Answer: *</label>
          <div class="control">
            <VField class="is-flex">
              <VControl raw subcontrol>
                <VRadio
                  v-model="workerQuestionsData.correctAnswer"
                  value="true"
                  label="Yes"
                  color="primary"
                />
              </VControl>
              <VControl raw subcontrol>
                <VRadio
                  v-model="workerQuestionsData.correctAnswer"
                  value="false"
                  label="NO"
                  color="info"
                />
              </VControl>
            </VField>
          </div>
        </div>
      </div>
    </template>
    <template #action>
      <VButton type="submit" color="primary" :loading="Loading" raised
        >Save</VButton
      >
    </template>
  </VModal>
</template>
<style scoped lang="scss"></style>
