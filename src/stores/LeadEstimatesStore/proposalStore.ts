import { acceptHMRUpdate, defineStore } from "pinia";
import { ref, computed } from "vue";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";

export interface costItem {
  title: string;
  description: string;
  quantity: number;
  unit: number;
  unitCost: number;
  markup: number;
  clientPrice: number;
  costCode: string;
  costType: string;
  builderCost: string;
  margin: number;
  profit: number;
  internalNotes: string;
}

export interface leadProposalData {
  title: string;
  approval_deadline: string;
  approvalDeadline: string;
  internalNotes: string;
  introductoryText: string;
  closingText: string;
  attachments: [];
  paymentStatus: string;
  worksheetItems: costItem[];
  type: string;
}

export const useProposalStore = defineStore("useProposal", () => {
  const loading = ref(true);
  const notyf = useNotyf();
  const api = useApi();
  const proposalId = ref("");
  const leadId = ref("");
  const companyProposalsList = ref([]);
  const leadProposalsList = ref([]);
  const leadProposalFormData = ref<leadProposalData>({
    title: "",
    approval_deadline: "",
    attachments: [],
    approvalDeadline: "",
    internalNotes: "",
    introductoryText: "",
    closingText: "",
    paymentStatus: "",
    worksheetItems: [],
    type: "proposal",
  });

  const proposalCostItems = ref([
    {
      title: "",
      description: "",
      quantity: 0,
      unit: 0,
      unitCost: 0,
      markup: 0,
      clientPrice: 0,
      costCode: "",
      costType: "",
      builderCost: "",
      margin: 0,
      profit: 0,
      internalNotes: "",
    },
  ]);

  const getCompanyProposals = async () => {
    try {
      loading.value = true;
      const response = await api.get(`/api/lead-proposal/`);
      companyProposalsList.value = response.data;
    } catch (error: any) {
      notyf.error(` ${error}, Lead`);
    } finally {
      loading.value = false;
    }
  };

  const getLeadProposals = async (leadId: any) => {
    try {
      leadId.value = leadId;
      loading.value = true;
      const response = await api.get(
        `/api/lead-proposal/by-job/${leadId.value}/`
      );
      leadProposalsList.value = response.data;
    } catch (error: any) {
      notyf.error(` ${error}, Lead`);
    } finally {
      loading.value = false;
    }
  };

  async function getProposalCostItems(proposal: any) {
    try {
      proposalId.value = proposal;
      const resp = await api.get(`/api/cost/by-proposal/${proposal}/`);
      proposalCostItems.value = resp.data;
    } catch (err) {
      console.log(err);
    }
  }

  function clearProposalId() {
    proposalId.value = "";
    proposalCostItems.value = [];
  }

  return {
    loading,
    proposalCostItems,
    leadProposalFormData,
    companyProposalsList,
    leadProposalsList,
    getLeadProposals,
    getCompanyProposals,
    getProposalCostItems,
    clearProposalId,
  } as const;
});

// Enable hot module replacement
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProposalStore, import.meta.hot));
}
