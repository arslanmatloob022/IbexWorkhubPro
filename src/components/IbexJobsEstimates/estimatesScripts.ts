export const getStatusColor = {
  onHold: "warning",
  open: "info",
  sold: "success",
  lost: "danger",
};

export const getProposalStatusColor = {
  pending: "info",
  approve: "success",
  review: "warning",
  disapprove: "danger",
};

export const getProposalStatusName = {
  pending: "Pending",
  approve: "Approved",
  review: "Require Review",
  disapprove: "Disapproved",
};

export const getProposalTypeColor = {
  proposal: "primary",
  change_order: "warning",
  draft: "light",
};

export const getProposalTypeName = {
  proposal: "Proposal",
  change_order: "Change Order",
  draft: "Draft",
};

export const activityTypes = [
  { value: "call", label: "Phone Call" },
  { value: "email", label: "Email" },
  { value: "followup", label: "Follow Up" },
  { value: "visit", label: "Site Visit" },
  { value: "form", label: "Website Form" },
];
