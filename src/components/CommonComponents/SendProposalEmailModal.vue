<script setup lang="ts">
import { useNotyf } from "/@src/composable/useNotyf";
import { useApi } from "/@src/composable/useAPI";
import { useProposalStore } from "/@src/stores/LeadEstimatesStore/proposalStore";
const props = defineProps<{
  proposalSenderModal?: boolean;
  proposalData?: any;
  columnsToShow?: any;
  selectedProposalsIds?: any;
}>();

const useProposal = useProposalStore();
const api = useApi();
const loading = ref(false);
const notyf = useNotyf();
const mailLoading = ref(false);
const messageBody = ref("");
const editor = shallowRef<any>();
const baseURL = window.origin;

const proposalLink = ref(
  `${baseURL}/proposal-view/?proposal=${props.proposalData?.id}`
);

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
  link: "",
  sendTo: useProposal.leadProposalFormData?.jobInfo?.clientInfo?.email
    ? useProposal.leadProposalFormData?.jobInfo?.clientInfo?.email
    : "N/A",
  subject: "",
  message: `<p><b>Hi ${
    useProposal.leadProposalFormData?.jobInfo?.clientInfo?.username
      ? useProposal.leadProposalFormData?.jobInfo?.clientInfo?.username
      : "N/A"
  } ${
    useProposal.leadProposalFormData?.jobInfo?.clientInfo?.last_name
      ? useProposal.leadProposalFormData?.jobInfo?.clientInfo?.last_name
      : ""
  },</b></p>
  
  <p>We hope this message finds you well.</p>
  
  <p>
    Please find attached a detailed proposal outlining the cost items associated with the services/products we will be providing. 
    We have carefully curated this proposal to ensure complete transparency and alignment with your expectations.
  </p>
  
  <p>
    You can review the full proposal, including the cost breakdown, by clicking the link below: <br />
    <a href="${
      proposalLink.value
    }" style="color: #007bff; text-decoration: none; font-weight: bold;">View Proposal</a>
  </p>

  
  <p><b>Summary of Charges:</b></p>
  <ul>
    <li><b>Total Items:</b> ${
      useProposal.leadProposalFormData.proposalAmount ?? 0
    }</li>
    <li><b>Total Amount:</b>$${
      useProposal.leadProposalFormData.proposalAmount ?? 0
    }</li>
  </ul>
  
  <p>
    If you have any questions or require further clarification, feel free to reach out to us at your earliest convenience. 
    We are here to assist you.
  </p>
  
  <p>Thank you for trusting <b>Ibex Team</b> with your project.</p>
  
  <p><b>Best Regards,</b><br />
    Ibex Team
  </p>`,
});

const sendProposalMailHandler = async () => {
  try {
    mailLoading.value = true;
    const response = await api.post(
      `/api/lead-proposal/${props.proposalData?.id}/send-proposal-template/`,
      {
        email: mailData.value.sendTo,
        subject: mailData.value.subject,
        message: mailData.value.message,
        scheduleAt: mailData.value.scheduleAt,
        link: proposalLink.value,
        column: props.columnsToShow,
      }
    );
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
        :open="props.proposalSenderModal"
        title="Send Proposal"
        size="large"
        actions="right"
        @submit.prevent="sendProposalMailHandler"
        @close="closeModalHandler"
      >
        <template #content>
          <div class="modal-form columns is-multiline">
            <!-- <div class="field column is-full">
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
            </div> -->
            <div class="column is-full">
              {{ selectedProposalsIds }}
              <div class="field">
                <label class="label">Send To </label>
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
            <!-- <div>Data{{ props.proposalData }}</div> -->

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
              <label class="label">Message</label>
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
          <VButton type="submit" color="primary" :loading="mailLoading" raised>
            <i class="feather:mail"> </i> Send Proposal</VButton
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
