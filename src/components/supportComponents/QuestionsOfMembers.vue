<script setup lang="ts">
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { useCompany } from "/@src/stores/company";

const company = useCompany();
const Loading = ref(false);
const notyf = useNotyf();
const api = useApi();

const memberQuestionsData = ref([
  {
    id: 0,
    title: "",
    type: "CheckBox",
    correctAnswer: "",
    questionFor: "",
    created_at: "",
    filledAnswer: "",
    arezCompany: 0,
    industry: 0,
  },
]);

const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: null): void;
}>();

const props = defineProps<{
  type?: String;
  memberId?: Number;
}>();

const onInputLeaveHandler = (event: Event, QueId: any, oldAnswer: any) => {
  console.log("ans", event.target.value, QueId);
  giveAnsToQuestion(event.target.value, QueId, oldAnswer);
};

const onClickTagHandler = (event: string, QueId: any, oldAnswer: any) => {
  console.log("ans", event, QueId);
  giveAnsToQuestion(event, QueId, oldAnswer);
};

const giveAnsToQuestion = async (answer: any, id: any, oldAnswer: any) => {
  try {
    let payload = {
      filledAnswer: answer,
    };
    console.log("old ans", oldAnswer);
    payload[props.type] = props.memberId;
    if (oldAnswer) {
      const response = await api.patch(
        `/v3/api/partner/member-questions/${id}/`,
        payload
      );
      notyf.success("Answer updated.");
    } else if (!oldAnswer) {
      payload.companyQuestion = id;
      const response = await api.post(
        "/v3/api/partner/member-questions/",
        payload
      );
      notyf.success("Answer marked.");
    }
    getQuestions();
  } catch (err) {
    console.log(err);
  }
};
const getQuestions = async () => {
  try {
    const response = await api.get(
      `/v3/api/partner/member-questions/${props.memberId}/questions_of_member/?member=${props.type}`
    );
    memberQuestionsData.value = response.data.map((item) => {
      const oldAnswer = item.hasOwnProperty("filledAnswer") ? true : false;
      return { ...item, oldAnswer };
    });
  } catch (err) {
    console.log(err);
  }
};

onMounted(() => {
  if (props.memberId) {
    getQuestions();
  }
});
</script>

<template>
  <VFlex
    jusitfy-content="center"
    align-content="center"
    class="is-block"
    align-items="start"
    column-gap="10px"
    row-gap="10px"
    flex-wrap="wrap"
    styl="just"
  >
    <div class="list-widget is-straight mt-1 mb-3">
      <div style="display: flex; flex-wrap: wrap">
        <div v-for="(doc, index) in memberQuestionsData" :key="doc.id" class="">
          <VBlock
            v-if="doc.type == 'CheckBox'"
            center
            lighter
            style="
              margin: 10px;
              border-radius: 8px;
              padding: 12px;
              display: flex;
              justify-content: space-between;
              width: 360px;
              margin: 6px;
              border: 1px solid rgba(110, 110, 110, 0.011);
            "
          >
            <h3
              class="is-flex"
              style="display: flex; justify-content: space-between; width: 100%"
            >
              {{ doc.title }}
            </h3>
            <div
              style="width: 100%"
              class="field space-between column is-12 is-flex cu-align-center mb-0"
            >
              <div class="field is-flex cu-align-center mb-0">
                <label>Answer :</label>
                <VTag
                  @click="
                    (e) => {
                      onClickTagHandler('true', doc.id, doc.filledAnswer);
                    }
                  "
                  :color="doc.filledAnswer ? 'primary' : 'light'"
                  rounded
                  label="Yes"
                  :outlined="doc.filledAnswer == 'false'"
                  class="mr-3 ml-3 cu-pointer"
                >
                </VTag>

                <VTag
                  @click="
                    (e) => {
                      onClickTagHandler('false', doc.id, doc.filledAnswer);
                    }
                  "
                  :color="doc.filledAnswer ? 'info' : 'light'"
                  rounded
                  label="No"
                  :outlined="doc.filledAnswer == 'true'"
                  class="mr-3 cu-pointer"
                >
                </VTag>
              </div>
              <!-- <div class="flex-end field mr-6 is-flex cu-align-center mb-0">
                                <label>Correct Answer :
                                    {{ doc.correctAnswer ? "Yes" : "No" }}</label>
                            </div> -->
            </div>
          </VBlock>
        </div>
      </div>
      <!-- <hr /> -->
      <!-- <h2 class="cus-stat-heading">( Descriptive questions)</h2> -->
      <div style="display: flex; flex-wrap: wrap">
        <div v-for="(doc, index) in memberQuestionsData" :key="doc.id">
          <VBlock
            v-if="doc.type == 'Input'"
            center
            lighter
            style="
              margin: 10px;
              border-radius: 8px;
              padding: 12px;
              width: 600px;
              margin: 8px;
              border: 1px solid rgba(110, 110, 110, 0.017);
            "
          >
            <h3
              class="is-flex mb-2"
              style="display: flex; justify-content: space-between; width: 100%"
            >
              {{ doc.title }}
            </h3>
            <div class="cu-all-input" style="width: 560px">
              <VField>
                <VControl>
                  <VTextarea
                    v-model="doc.filledAnswer"
                    @blur="
                      (e) => {
                        onInputLeaveHandler(e, doc.id, doc.oldAnswer);
                      }
                    "
                    style="
                      width: 100%;
                      border-radius: 15px !important;
                      background-color: #f5f5f5 !important;
                      border: none !important;
                      padding: 16px 20px !important;
                    "
                    class="is-primary-focus"
                    rows="2"
                    placeholder="Answer..."
                  />
                </VControl>
              </VField>
            </div>
          </VBlock>
        </div>
      </div>
    </div>
  </VFlex>
</template>
<style scoped lang="scss"></style>
