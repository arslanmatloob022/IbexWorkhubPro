export const getStatusColor = {
  onHold: "warning",
  open: "info",
  sold: "success",
  lost: "danger",
};

export const getLeadStatusName = {
  onHold: "On Hold",
  open: "Open",
  sold: "Sold",
  lost: "Lost",
};

export const getProposalStatusColor = {
  pending: "info",
  approved: "success",
  approve: "success",
  review: "warning",
  disapprove: "danger",
};

export const getProposalStatusName = {
  pending: "Pending",
  approved: "Approved",
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
