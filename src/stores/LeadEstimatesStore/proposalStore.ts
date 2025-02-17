import { acceptHMRUpdate, defineStore } from "pinia";
import { ref, computed } from "vue";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { selectedColumnsToShow } from "/@src/components/CommonComponents/CostItemComponents/costItems";

export const useProposalStore = defineStore("useProposal", () => {
  const loading = ref(true);
  const notyf = useNotyf();
  const api = useApi();
  const proposalId = ref("");
  const leadId = ref("");
  const companyProposalsList = ref([]);
  const leadProposalsList = ref([]);
  interface costItem {
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

  interface SalesPerson {
    id: string;
    username: string;
    last_name: string | null;
    email: string;
    role: string;
    avatar: string | null;
  }

  interface ClientInfo {
    id: string;
    username: string;
    last_name: string | null;
    email: string;
    role: string;
    avatar: string | null;
  }

  interface Manager {
    id: string;
    username: string;
    last_name: string | null;
    email: string;
    role: string;
    avatar: string | null;
  }

  interface JobInfo {
    id: string;
    sales_people_info: SalesPerson[];
    clientInfo: ClientInfo;
    created_by_info: SalesPerson;
    managers_list: Manager[];
    title: string;
    address: string;
    current_state: string;
    city: string;
    state: string;
    status: string;
    zip_code: string;
    confidence: string;
    sale_date: string;
    tags: string[];
    estimated_from: string;
    estimated_to: string;
    sources: string;
    project_type: string;
    notes: string;
    attach_mail: string;
    latitude: number;
    longitude: number;
    created_at: string;
    updated_at: string;
    created_by: string;
    client: string;
    contractor: string | null;
    sales_people: string[];
    managers: string[];
  }

  interface ProposalData {
    id: string;
    jobInfo: JobInfo;
    proposalAmount: number;
    title: string;
    approval_deadline: string;
    internal_notes: string;
    introductory_text: string;
    closing_text: string;
    payment_status: string;
    type: string;
    status: string;
    columns_to_show: string[];
    created_at: string;
    updated_at: string;
    job: string;
  }
  const leadProposalFormData = ref<ProposalData>({
    id: "",
    jobInfo: {
      id: "",
      sales_people_info: [],
      clientInfo: {
        id: "",
        username: "",
        last_name: null,
        email: "",
        role: "",
        avatar: null,
      },
      created_by_info: {
        id: "",
        username: "",
        last_name: null,
        email: "",
        role: "",
        avatar: null,
      },
      managers_list: [],
      title: "",
      address: "",
      current_state: "",
      city: "",
      state: "",
      status: "",
      zip_code: "",
      confidence: "",
      sale_date: "",
      tags: [],
      estimated_from: "",
      estimated_to: "",
      sources: "",
      project_type: "",
      notes: "",
      attach_mail: "",
      latitude: 0,
      longitude: 0,
      created_at: "",
      updated_at: "",
      created_by: "",
      client: "",
      contractor: null,
      sales_people: [],
      managers: [],
    },
    proposalAmount: 0,
    title: "",
    approval_deadline: "",
    internal_notes: "",
    introductory_text: "",
    closing_text: "",
    payment_status: "",
    type: "",
    status: "",
    columns_to_show: [],
    created_at: "",
    updated_at: "",
    job: "",
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

  const getProposalDetail = async (id: any) => {
    try {
      const response = await api.get(`/api/lead-proposal/${id}/detail/`);
      leadProposalFormData.value = response.data;
      selectedColumnsToShow.value = response.data.columns_to_show;
    } catch (err) {
      console.log(err);
    } finally {
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
    getProposalDetail,
    getCompanyProposals,
    getProposalCostItems,
    clearProposalId,
  } as const;
});

// Enable hot module replacement
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProposalStore, import.meta.hot));
}
