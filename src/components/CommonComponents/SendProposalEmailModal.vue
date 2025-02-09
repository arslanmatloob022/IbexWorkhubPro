<script setup lang="ts">
import { useNotyf } from "/@src/composable/useNotyf";
import { useApi } from "/@src/composable/useAPI";
import { useProposalStore } from "/@src/stores/LeadEstimatesStore/proposalStore";
import { convertToFormData } from "/@src/composable/useSupportElement";
const props = defineProps<{
  proposalSenderModal?: boolean;
  proposalData?: any;
  columnsToShow?: any;
  selectedProposalsIds?: any;
}>();

const useProposal = useProposalStore();
const api = useApi();
const notyf = useNotyf();
const mailLoading = ref(false);
const editor = shallowRef<any>();
const baseURL = window.origin;

const porposalIds = ["HDE827BSAD1982", "ASGDG87E39HHHSAK", "SHDAUD98QW9QJD"];

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

const proposalIds = props.selectedProposalsIds.map((proposal) => proposal.id);
const proposalAmounts = props.selectedProposalsIds.map(
  (proposal) => proposal.proposalAmount
);

const amounts = proposalAmounts
  .map(
    (item, index) => `<li>Total of proposal ${index + 1}:<b> $${item} </b></li>`
  )
  .join("<br>");

const proposalLinks = proposalIds
  .map(
    (id, index) =>
      `<a href="${baseURL}/proposal-view/?proposal=${id}" style="color: #007bff; text-decoration: none; font-weight: bold;">View Proposal ${
        index + 1
      }, </a>`
  )
  .join("<br>"); // Join all links with line breaks

// console.log(proposalLinks);

const mailData = ref({
  email: useProposal.leadProposalFormData?.jobInfo?.clientInfo?.email
    ? useProposal.leadProposalFormData?.jobInfo?.clientInfo?.email
    : "N/A",
  subject: `Proposal ${useProposal.leadProposalFormData?.jobInfo?.title} `,
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
    Actions required for all proposals, and uou can review the full proposal(s), including the cost breakdown, by clicking the link below: <br />
    ${proposalLinks}
  </p>

  <p><b>Respectively proposal(s) amount are:</b></p>
  <ul>
    ${amounts}
  </ul>

  <p>
    If you have any questions or require further clarification, feel free to reach out to us at your earliest convenience.
    We are here to assist you.
  </p>

  <p>Thank you for trusting <b>Ibex Team</b> with your project.</p>

  <p><b>Best Regards,</b><br />
    Ibex Team
  </p>`,
  link: proposalLinks[0],
  // message: `${proposalLinks}`,
  columns: ["cost_code", "title", "description", "unit_cost"],
  showClient: true,
  proposal_ids: proposalIds,
});

const sendProposalMailHandler = async () => {
  try {
    mailLoading.value = true;
    // const payload = convertToFormData(mailData.value, []);
    let payload = mailData.value;
    payload.proposal_ids = JSON.stringify(mailData.value.proposal_ids);
    payload.columns = JSON.stringify(mailData.value.columns);
    const response = await api.post(
      `/api/lead-proposal/send-proposal-template/`,
      payload
    );
    notyf.success("Email sent successfully");
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
            <!-- <div class="column is-12">
              Ids:{{ proposalIds }}
              <br />
              email:{{ mailData.email }}
              <br />
              subject:{{ mailData.subject }}
              <br />
              message: {{ mailData.message }}
              <br />
              columns {{ mailData.columns }}
            </div> -->
            <div class="column is-full">
              <div class="field">
                <label class="label">Send To </label>
                <div class="control">
                  <input
                    type="email"
                    required
                    class="input"
                    placeholder="Enter Mail"
                    v-model="mailData.email"
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
