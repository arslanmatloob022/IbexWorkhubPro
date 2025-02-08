import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
const api = useApi();
const notyf = useNotyf();
export const createProposalTasks = async (startDate: any, proposalId: any) => {
  try {
    const resp = await api.post(`/api/lead-proposal/create-tasks/`, {
      start: startDate,
      proposal: proposalId,
    });
    notyf.success(
      "Tasks of this proposal are created in calendar successfully."
    );
  } catch (err) {
    console.log(err);
    notyf.error("Something went wrong, please review the cost codes");
  }
};
