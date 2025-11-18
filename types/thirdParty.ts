// Country Types
export type CountryType = "Saudi Arabia" | "UAE" | "Qatar";

// Business Type - determines workflow for contractors under this third party
export type ThirdPartyBusinessType =
  | "3rd_party_perm"           // Third-party permanent placements
  | "3rd_party_saudi"          // Saudi Arabia third-party contractors
  | "3rd_party_uae"            // UAE third-party contractors
  | "3rd_party_payroll";       // UAE payroll-only contractors

// Third Party Interface
export interface ThirdParty {
  id: string;

  // Country & Business Type (determines contractor onboarding workflow)
  country: CountryType;
  business_type: ThirdPartyBusinessType;

  // Company Details
  company_name: string;
  registered_address: string | null;
  company_vat_no: string | null;
  company_reg_no: string | null;

  // Contact Person
  contact_person_name: string | null;
  contact_person_email: string | null;
  contact_person_phone: string | null;

  // Banking Details
  bank_name: string | null;
  account_number: string | null;
  iban_number: string | null;
  swift_code: string | null;

  // Additional Info
  notes: string | null;
  is_active: boolean;

  // Timestamps
  created_at: string;
  updated_at: string | null;
}

// Get business type label for display
export function getThirdPartyBusinessTypeLabel(businessType: ThirdPartyBusinessType): string {
  const labels: Record<ThirdPartyBusinessType, string> = {
    "3rd_party_saudi": "Saudi Arabia Third Party",
    "3rd_party_uae": "UAE Third Party",
    "3rd_party_payroll": "UAE Payroll Provider",
    "3rd_party_perm": "Permanent Placement",
  };
  return labels[businessType];
}

// Get workflow description for business type
export function getWorkflowDescription(businessType: ThirdPartyBusinessType): string {
  const descriptions: Record<ThirdPartyBusinessType, string> = {
    "3rd_party_saudi": "Requires Quote Sheets from this third party. Contractors sign contracts managed by Aventus.",
    "3rd_party_uae": "Requires COHF (Cost of Hire Form) via DocuSign. This third party manages contractor signing.",
    "3rd_party_payroll": "Requires Schedule Form for payroll setup. Contracts created by Aventus.",
    "3rd_party_perm": "Standard permanent placement workflow. All contracts managed by Aventus.",
  };
  return descriptions[businessType];
}

// Check if business type requires specific documents
export function requiresQuoteSheets(businessType: ThirdPartyBusinessType): boolean {
  return businessType === "3rd_party_saudi";
}

export function requiresCOHF(businessType: ThirdPartyBusinessType): boolean {
  return businessType === "3rd_party_uae";
}

export function requiresScheduleForm(businessType: ThirdPartyBusinessType): boolean {
  return businessType === "3rd_party_payroll";
}
