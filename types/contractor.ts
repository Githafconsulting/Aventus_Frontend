// Contractor Status Flow
export type ContractorStatus =
  | "draft"              // Admin is still filling form
  | "pending_signature"  // Sent to contractor, awaiting signature
  | "signed"             // Contractor signed, awaiting admin activation
  | "active"             // Account activated, can login
  | "suspended";         // Account suspended

// Signature Type
export interface SignatureData {
  type: "typed" | "drawn";
  data: string; // Name for typed, base64 image for drawn
  signedAt: Date;
}

// Complete Contractor Interface
export interface Contractor {
  id: string;

  // Status & Workflow
  status: ContractorStatus;
  contractToken?: string;
  signature?: SignatureData;
  sentDate?: Date;
  signedDate?: Date;
  activatedDate?: Date;
  tokenExpiry?: Date;

  // Personal Details
  firstName: string;
  surname: string;
  gender: "Male" | "Female";
  nationality: string;
  homeAddress: string;
  addressLine3?: string;
  addressLine4?: string;
  phone: string;
  email: string;
  dob: string;

  // Management Company
  umbrellaCompanyName?: string;
  registeredAddress?: string;
  managementAddressLine2?: string;
  managementAddressLine3?: string;
  companyVATNo?: string;
  companyName?: string;
  accountNumber?: string;
  ibanNumber?: string;
  companyRegNo?: string;

  // Placement Details
  clientName?: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  duration?: string;
  currency: string;
  clientChargeRate?: string;
  candidatePayRate?: string;
  candidateBasicSalary?: string;
  contractorCosts?: string;

  // Monthly Costs
  managementCompanyCharges?: string;
  taxes?: string;
  bankFees?: string;
  fx?: string;
  nationalisation?: string;

  // Provisions
  eosb?: string;
  vacationPay?: string;
  sickLeave?: string;
  otherProvision?: string;

  // One Time Costs
  flights?: string;
  visa?: string;
  medicalInsurance?: string;
  familyCosts?: string;
  otherOneTimeCosts?: string;

  // Additional Info
  upfrontInvoices?: string;
  securityDeposit?: string;
  laptopProvider?: string;
  otherNotes?: string;

  // Client Details
  clientOfficeAddress?: string;
  clientAddressLine2?: string;
  clientAddressLine3?: string;
  clientAddressLine4?: string;
  clientPOBox?: string;
  poRequired?: string;
  poNumber?: string;
  clientTaxNumber?: string;
  contractorPayFrequency?: string;
  clientInvoiceFrequency?: string;
  clientPaymentTerms?: string;
  invoicingPreferences?: string;
  invoiceInstructions?: string;
  supportingDocsRequired?: string;

  // Payment Details
  umbrellaOrDirect?: string;
  candidateBankDetails?: string;
  candidateAccountNumber?: string;
  candidateMobile?: string;
  currentLocation?: string;

  // Auth
  password?: string;
  temporaryPassword?: string;
  isFirstLogin?: boolean;
}

// Email Templates
export interface ContractEmail {
  to: string;
  subject: string;
  contractLink: string;
  contractorName: string;
  expiryDate: string;
}

export interface ActivationEmail {
  to: string;
  subject: string;
  contractorName: string;
  email: string;
  temporaryPassword: string;
  loginLink: string;
}
