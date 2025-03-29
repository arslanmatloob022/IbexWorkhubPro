import { acceptHMRUpdate, defineStore } from "pinia";
import { ref, computed } from "vue";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
import { selectedColumnsToShow } from "/@src/components/CommonComponents/CostItemComponents/costItems";

export const useCostCodeStore = defineStore("useCostCode", () => {
  const loading = ref(true);
  const notyf = useNotyf();
  const api = useApi();
  const proposalId = ref("");
  const leadId = ref("");
  const companyProposalsList = ref([]);
  const costCodesList = ref([
    {
      value: "",
      label: "",
      labour_cost: "",
      unit_cost: 0.0,
      worker_cost: 0.0,
      unit: "--",
    },
  ]);
  const costCodesWholeList = ref([]);

  const getCostCodesHandler = async () => {
    try {
      loading.value = true;
      const response = await api.get(`/api/cost-code/`);
      costCodesWholeList.value = response.data;
      costCodesList.value = response.data.map((item: any) => {
        return {
          value: item.id,
          label: item.name,
          labour_cost: item.labour_cost,
          unit_cost: item.unit_cost ?? 0.0,
          worker_cost: item.worker_cost ?? 0.0,
          unit: item.unit ?? "--",
        };
      });
    } catch (err) {
      console.log(err);
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
      costCodesList.value = response.data;
    } catch (error: any) {
      notyf.error(` ${error}, Lead`);
    } finally {
      loading.value = false;
    }
  };

  const getProposalDetail = async (id: any) => {
    try {
      const response = await api.get(`/api/lead-proposal/${id}/detail/`);
      //   leadProposalFormData.value = response.data;
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
      //   proposalCostItems.value = resp.data;
    } catch (err) {
      console.log(err);
    }
  }

  function clearProposalId() {
    proposalId.value = "";
    // proposalCostItems.value = [];
  }

  return {
    loading,
    // proposalCostItems,
    // leadProposalFormData,
    companyProposalsList,
    costCodesList,
    costCodesWholeList,
    getLeadProposals,
    getProposalDetail,
    getCostCodesHandler,
    // getCompanyProposals,
    getProposalCostItems,
    clearProposalId,
  } as const;
});

// Enable hot module replacement
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCostCodeStore, import.meta.hot));
}
