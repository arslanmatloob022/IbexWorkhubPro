<script setup lang="ts">
import { useNotyf } from "/@src/composable/useNotyf";
import { useApi } from "/@src/composable/useAPI";

const api = useApi();
const loading = ref(false);
const notyf = useNotyf();
const mailLoading = ref(false);
const messageBody = ref("");
const editor = shallowRef<any>();

const props = defineProps<{
  mailSenderModal?: boolean;
  subject?: string;
}>();

const emit = defineEmits<{
  (e: "update:modalHandler", value: boolean): void;
  (e: "update:OnSuccess", value: null): void;
}>();

const closeModalHandler = () => {
  emit("update:modalHandler", false);
};

messageBody.value = `<b> Hi  <br />
Ibex Management <br />
</b>`;

const mailData = ref({
  scheduleAt: "",
  sendToGroup: [],
  sendTo: "",
  subject: "",
  message: `<b>Hi  <br />
  Here you can enter your message that you want to deliver your recipient.

  <br />
  <br />
  Best Regards:
  <br />

Ibex Team <br />
</b>`,
});

const sendGenericMailHandler = async () => {
  try {
    mailLoading.value = true;
    const response = await api.post(``, {
      sendTo: mailData.value.sendTo,
      subject: mailData.value.subject,
      message: mailData.value.message,
      scheduleAt: mailData.value.scheduleAt,
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
        :open="props.mailSenderModal"
        title="Schedule Email"
        size="large"
        actions="right"
        @submit.prevent="sendGenericMailHandler"
        @close="closeModalHandler"
      >
        <template #content>
          <div class="modal-form columns is-multiline">
            <div class="field column is-full">
              <label class="label">Schedule Mail </label>
              <ClientOnly>
                <VDatePicker v-model="mailData.scheduleAt" mode="dateTime">
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
            </div>
            <div class="column is-full">
              <div class="field">
                <label class="label">To </label>
                <div class="control">
                  <input
                    type="email"
                    required
                    class="input"
                    placeholder="Enter Mail"
                    v-model="mailData.sendTo"
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
            <div class="field column is-full mt-5">
              <label class="label"> </label>
              <CKEditor
                v-if="editor"
                v-model="mailData.message"
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
