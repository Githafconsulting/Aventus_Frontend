import { BusinessType } from "@/types/contractor";

export interface WorkflowStep {
  id: string;
  label: string;
  description: string;
  role: string; // Who performs this step
  order: number;
}

// Define all possible workflow steps
export const WORKFLOW_STEPS = {
  CONTRACTOR_DETAILS: {
    id: "contractor_details",
    label: "Contractor Details",
    description: "Collect contractor personal information and documents",
    role: "Consultant",
    order: 1,
  },
  QUOTE_SHEETS: {
    id: "quote_sheets",
    label: "Quote Sheets",
    description: "Request and receive quote sheets from Saudi 3rd Party",
    role: "Consultant / Saudi 3rd Party",
    order: 2,
  },
  CDS_CS: {
    id: "cds_cs",
    label: "CDS & Costing Sheet",
    description: "Create Client Deal Sheet and Costing Sheet",
    role: "Consultant",
    order: 3,
  },
  WORK_ORDER: {
    id: "work_order",
    label: "Work Order",
    description: "Create and send work order to client",
    role: "Consultant / Manager",
    order: 4,
  },
  PROPOSAL: {
    id: "proposal",
    label: "Proposal",
    description: "Create and send proposal to enterprise client",
    role: "Consultant / Manager",
    order: 5,
  },
  COHF: {
    id: "cohf",
    label: "COHF (Cost of Hire Form)",
    description: "Complete and DocuSign COHF with UAE 3rd Party",
    role: "Ops / UAE 3rd Party",
    order: 6,
  },
  CONTRACT_SAUDI: {
    id: "contract_saudi",
    label: "Contract (Saudi Flow)",
    description: "Saudi 3rd Party provides CC, AV handles contractor signing",
    role: "Ops / Manager",
    order: 7,
  },
  CONTRACT_UAE: {
    id: "contract_uae",
    label: "Contract (UAE Flow)",
    description: "UAE 3rd Party handles contractor signing and returns signed CC",
    role: "UAE 3rd Party",
    order: 8,
  },
  CONTRACT_AV: {
    id: "contract_av",
    label: "Contract (AV Flow)",
    description: "AV creates and manages consultant contract signing",
    role: "Ops / Manager",
    order: 9,
  },
  SCHEDULE_FORM: {
    id: "schedule_form",
    label: "Schedule Form",
    description: "Complete and send schedule form to payroll provider",
    role: "Ops",
    order: 10,
  },
  FINALIZE: {
    id: "finalize",
    label: "Finalize & Activate",
    description: "System saves contract and activates contractor account",
    role: "System",
    order: 11,
  },
};

// Map business types to their applicable workflow steps
export const WORKFLOW_CONFIG: Record<BusinessType, WorkflowStep[]> = {
  "3rd_party_saudi": [
    WORKFLOW_STEPS.CONTRACTOR_DETAILS,
    WORKFLOW_STEPS.QUOTE_SHEETS,      // SAUDI ONLY
    WORKFLOW_STEPS.CDS_CS,
    WORKFLOW_STEPS.WORK_ORDER,
    WORKFLOW_STEPS.CONTRACT_SAUDI,    // SAUDI SPECIFIC FLOW
    WORKFLOW_STEPS.FINALIZE,
  ],
  "3rd_party_uae": [
    WORKFLOW_STEPS.CONTRACTOR_DETAILS,
    WORKFLOW_STEPS.CDS_CS,
    WORKFLOW_STEPS.WORK_ORDER,
    WORKFLOW_STEPS.COHF,              // UAE ONLY
    WORKFLOW_STEPS.CONTRACT_UAE,      // UAE SPECIFIC FLOW
    WORKFLOW_STEPS.FINALIZE,
  ],
  "3rd_party_payroll": [
    WORKFLOW_STEPS.CONTRACTOR_DETAILS,
    WORKFLOW_STEPS.CDS_CS,
    WORKFLOW_STEPS.WORK_ORDER,
    WORKFLOW_STEPS.CONTRACT_AV,       // AV handles contract
    WORKFLOW_STEPS.SCHEDULE_FORM,     // PAYROLL ONLY
    WORKFLOW_STEPS.FINALIZE,
  ],
  "av_remote_freelancer": [
    WORKFLOW_STEPS.CONTRACTOR_DETAILS,
    WORKFLOW_STEPS.CDS_CS,
    WORKFLOW_STEPS.WORK_ORDER,
    WORKFLOW_STEPS.CONTRACT_AV,       // AV handles contract
    WORKFLOW_STEPS.FINALIZE,
  ],
  "av_remote_wps": [
    WORKFLOW_STEPS.CONTRACTOR_DETAILS,
    WORKFLOW_STEPS.CDS_CS,
    WORKFLOW_STEPS.WORK_ORDER,
    WORKFLOW_STEPS.CONTRACT_AV,       // AV handles contract
    WORKFLOW_STEPS.FINALIZE,
  ],
  "enterprise_client": [
    WORKFLOW_STEPS.CONTRACTOR_DETAILS,
    WORKFLOW_STEPS.CDS_CS,
    WORKFLOW_STEPS.PROPOSAL,          // ENTERPRISE ONLY - instead of Work Order
    WORKFLOW_STEPS.CONTRACT_AV,
    WORKFLOW_STEPS.FINALIZE,
  ],
  "3rd_party_perm": [
    WORKFLOW_STEPS.CONTRACTOR_DETAILS,
    WORKFLOW_STEPS.CDS_CS,
    WORKFLOW_STEPS.WORK_ORDER,
    WORKFLOW_STEPS.CONTRACT_AV,
    WORKFLOW_STEPS.FINALIZE,
  ],
};

// Helper function to get workflow steps for a business type
export function getWorkflowSteps(businessType: BusinessType): WorkflowStep[] {
  return WORKFLOW_CONFIG[businessType] || [];
}

// Helper to check if a specific step is applicable
export function isStepApplicable(
  businessType: BusinessType,
  stepId: string
): boolean {
  const steps = getWorkflowSteps(businessType);
  return steps.some((step) => step.id === stepId);
}

// Get business type label for display
export function getBusinessTypeLabel(businessType: BusinessType): string {
  const labels: Record<BusinessType, string> = {
    "3rd_party_saudi": "3rd Party - Saudi Arabia",
    "3rd_party_uae": "3rd Party - UAE",
    "3rd_party_payroll": "3rd Party - Payroll (UAE)",
    "av_remote_freelancer": "Aventus Remote - Freelancer",
    "av_remote_wps": "Aventus Remote - WPS",
    "enterprise_client": "Enterprise Client (PWC, Deloitte, etc.)",
    "3rd_party_perm": "3rd Party - Permanent",
  };
  return labels[businessType];
}
