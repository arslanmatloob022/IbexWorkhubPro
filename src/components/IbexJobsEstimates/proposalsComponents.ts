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

export const downloadProposalPdf = async (proposal: any) => {
  try {
    const response = await api.get(
      `/api/lead-proposal/${proposal.id}/download/`,
      {
        responseType: "blob",
      }
    );
    const blob = new Blob([response.data], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Proposal-${proposal.title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error("Error downloading PDF:", error);
  }
};

export const printPDF = async (proposalId: any) => {
  try {
    const response = await api.get(
      `/api/lead-proposal/${proposalId}/download/`,
      {
        responseType: "blob", // Ensure response is a binary PDF
      }
    );

    const blob = new Blob([response.data], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(blob);

    // Create an invisible iframe
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = fileURL;
    document.body.appendChild(iframe);

    iframe.onload = () => {
      iframe.contentWindow?.print();
      document.body.removeChild(iframe); // Cleanup
    };
  } catch (error) {
    console.error("Error printing PDF:", error);
  }
};
