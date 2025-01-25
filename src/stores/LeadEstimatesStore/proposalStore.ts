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
  id: string;
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
    id: "",
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

  interface ProposalCostItem {
    id: string;
    index: number;
    title: string;
    description: string;
    type: string;
    quantity: number;
    unit: string;
    unit_cost: string;
    markup: string;
    total_price: string;
    cost_code: string;
    cost_type: string;
    builder_cost: string;
    margin: string;
    profit: string;
    internal_notes: string;
    mark_as: string;
    state: string;
    group_amount: string;
    status: string | null;
    created_at: string;
    proposal: string;
  }
  const proposalCostItems = ref<ProposalCostItem[]>([
    {
      id: "",
      index: 0,
      title: "",
      description: "",
      type: "",
      quantity: 0,
      unit: "",
      unit_cost: "",
      markup: "",
      total_price: "",
      cost_code: "",
      cost_type: "",
      builder_cost: "",
      margin: "",
      profit: "",
      internal_notes: "",
      mark_as: "",
      state: "",
      group_amount: "",
      status: null,
      created_at: "",
      proposal: "",
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
