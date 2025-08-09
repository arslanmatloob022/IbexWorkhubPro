import { useApi } from "/@src/composable/useAPI";
import { useNotyf } from "/@src/composable/useNotyf";
const api = useApi();
const notyf = useNotyf();
export const fileLoading = ref(0);
export const createProposalTasks = async (startDate: any, proposalId: any) => {
  try {
    fileLoading.value = 2;
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
  } finally {
    fileLoading.value = 0;
  }
};

export const downloadProposalPdf = async (proposal: any, columns: any = []) => {
  try {
    fileLoading.value = 3;
    let formattedColumns = [];

    const response = await api.get(
      `/api/lead-proposal/${
        proposal.id
      }/download/?columns_to_show=${JSON.stringify(columns)}`,
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
  } finally {
    fileLoading.value = 0;
  }
};

export const printPDF = async (proposalId: any, columns: any = []) => {
  try {
    fileLoading.value = 1;

    // Fetch the PDF as a blob
    const response = await api.get(
      `/api/lead-proposal/${proposalId}/download/?columns_to_show=${JSON.stringify(
        columns
      )}`,
      {
        responseType: "blob", // Ensure response is a binary PDF
      }
    );

    // Create a Blob from the response data
    const blob = new Blob([response.data], { type: "application/pdf" });

    // Create a URL for the Blob
    const fileURL = URL.createObjectURL(blob);

    // Open the PDF in a new tab
    const newWindow = window.open(fileURL, "_blank");

    if (newWindow) {
      // Wait for the new window to load
      newWindow.onload = () => {
        try {
          // Trigger the print dialog
          newWindow.print();
        } catch (error) {
          console.error("Error triggering print:", error);
        } finally {
          // Clean up the URL object
          URL.revokeObjectURL(fileURL);
        }
      };
    } else {
      console.error("Failed to open PDF in a new window.");
    }
  } catch (error) {
    console.error("Error printing PDF:", error);
  } finally {
    fileLoading.value = 0; // Hide loading state
  }
};
