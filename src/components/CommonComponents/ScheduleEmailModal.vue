<script setup lang="ts">
import { useNotyf } from "/@src/composable/useNotyf";
import { useApi } from "/@src/composable/useAPI";

const api = useApi();
const loading = ref(false);
const notyf = useNotyf();
const mailLoading = ref(false);
const contentBody = ref("");
const editor = shallowRef<any>();

const props = defineProps<{
  mailSchedulerModal?: boolean;
  subject?: string;
}>();

const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: null): void;
}>();

const closeModalHandler = () => {
  emit("update:modalHandler", false);
};

contentBody.value = `<b> Hi  <br />
Ibex Management <br />
</b>`;

const mailData = ref({
  objectId: "",
  subject: "",
  content: ``,
  mail: "",
  scheduled_at: "",
  sent_at: "",
  status: "",
  mailGroup: [],
});

const sendGenericMailHandler = async () => {
  try {
    mailLoading.value = true;
    const response = await api.post(``, {
      mail: mailData.value.mail,
      subject: mailData.value.subject,
      content: mailData.value.content,
      scheduled_at: mailData.value.scheduled_at,
    });
    notyf.success("Email sent to worker successfully");
    closeModalHandler();
  } catch (err) {
    console.log(err);
  } finally {
    mailLoading.value = false;
  }
};

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
  editor.value = await import("@ckeditor/ckeditor5-build-classic").then(
    (m) => m.default
  );
});
</script>
<template>
  <div>
    <Transition name="fade-slow">
      <VModal
        is="form"
        :open="props.mailSchedulerModal"
        title="Schedule Email"
        size="large"
        actions="right"
        @submit.prevent="sendGenericMailHandler"
        @close="closeModalHandler"
      >
        <template #content>
          <div class="modal-form columns is-multiline">
            <div class="column is-full">
              <div class="field">
                <label class="label">To </label>
                <div class="control">
                  <input
                    type="email"
                    required
                    class="input"
                    placeholder="Enter Mail"
                    v-model="mailData.mail"
                  />
                </div>
              </div>
            </div>

            <div class="column is-full">
              <div class="field">
                <label class="label">Subject </label>
                <div class="control">
                  <input
                    type="text"
                    required
                    class="input"
                    placeholder="Enter mail subject"
                    v-model="mailData.subject"
                  />
                </div>
              </div>
            </div>
            <div class="field column is-half">
              <label class="label">Schedule Mail </label>
              <ClientOnly>
                <VDatePicker v-model="mailData.scheduled_at" mode="dateTime">
                  <template #default="{ inputValue, inputEvents }">
                    <VField>
                      <VControl icon="lucide:calendar">
                        <input
                          class="input v-input"
                          type="text"
                          :value="inputValue"
                          v-on="inputEvents"
                        />
                      </VControl>
                    </VField>
                  </template>
                </VDatePicker>
              </ClientOnly>
              <!-- <input
                type="datetime"
                required
                class="input"
                placeholder="Enter mail subject"
                v-model="mailData.subject"
              /> -->
            </div>
            <div class="field column is-half">
              <VField grouped>
                <VControl>
                  <div class="file">
                    <label class="file-label">
                      <input class="file-input" type="file" name="resume" />
                      <span class="file-cta">
                        <span class="file-icon">
                          <i class="fas fa-cloud-upload-alt" />
                        </span>
                        <span class="file-label"> Choose a file… </span>
                      </span>
                    </label>
                  </div>
                </VControl>
              </VField>
            </div>
            <div class="field column is-full mt-5">
              <label class="label"> </label>
              <CKEditor
                v-if="editor"
                v-model="mailData.content"
                :editor="editor"
                :config="editorConfig"
              />
            </div>
          </div>
        </template>
        <template #action>
          <VButton
            @click="sendGenericMailHandler"
            color="primary"
            :loading="loading"
            raised
          >
            <i class="feather:mail"> </i> Schedule Mail</VButton
          >
        </template>
        <template #cancel>
          <VButton color="light" @click="closeModalHandler" raised
            >Close
          </VButton>
        </template>
      </VModal>
    </Transition>
  </div>
</template>

<style lang="scss" scoped></style>
