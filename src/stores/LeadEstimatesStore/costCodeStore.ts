import { acceptHMRUpdate, defineStore } from "pinia";
import { ref, computed } from "vue";
import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";

export const useCostCodeStore = defineStore("useCostCode", () => {
  const loading = ref(true);
  const notyf = useNotyf();
  const api = useApi();
  const companyProposalsList = ref([]);
  const costCodesWholeList = ref([]);

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

  return {
    loading,
    companyProposalsList,
    costCodesList,
    costCodesWholeList,
    getLeadProposals,
    getCostCodesHandler,
  } as const;
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCostCodeStore, import.meta.hot));
}
