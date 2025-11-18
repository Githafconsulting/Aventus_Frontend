/**
 * API Configuration
 *
 * Automatically detects which API URL to use:
 * - Use 'localhost:8000' when accessing frontend from http://localhost:3000
 * - Use network IP when accessing from http://192.168.1.232:3000
 */

// Automatically detect which API URL to use based on window location
export const getApiUrl = (): string => {
  if (typeof window === 'undefined') {
    // Server-side rendering - use localhost
    return 'http://localhost:8000';
  }

  // Check if we're accessing via network IP
  const hostname = window.location.hostname;

  console.log('[API Config] Detected hostname:', hostname);

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    console.log('[API Config] Using localhost backend');
    return 'http://localhost:8000';
  } else {
    console.log('[API Config] Using network IP backend:', `http://${hostname}:8000`);
    // Use the same hostname as the frontend (network IP)
    return `http://${hostname}:8000`;
  }
};

// API endpoint builders - these call getApiUrl() dynamically at runtime
export const API_ENDPOINTS = {
  // Auth
  get login() { return `${getApiUrl()}/api/v1/auth/login`; },

  // Contractors
  get contractors() { return `${getApiUrl()}/api/v1/contractors/`; },
  get contractorsInitial() { return `${getApiUrl()}/api/v1/contractors/initial`; },
  contractorById: (id: string) => `${getApiUrl()}/api/v1/contractors/${id}`,
  contractorSignedContract: (id: string) => `${getApiUrl()}/api/v1/contractors/${id}/signed-contract`,
  contractorActivate: (id: string) => `${getApiUrl()}/api/v1/contractors/${id}/activate`,
  contractorCostingSheet: (id: string) => `${getApiUrl()}/api/v1/contractors/${id}/costing-sheet`,
  contractorReview: (id: string) => `${getApiUrl()}/api/v1/contractors/${id}/approve`,
  contractorDocuments: (id: string) => `${getApiUrl()}/api/v1/contractors/${id}/documents`,

  // Document upload
  uploadDocuments: (token: string) => `${getApiUrl()}/api/v1/contractors/upload-documents/${token}`,
  contractorByDocumentToken: (token: string) => `${getApiUrl()}/api/v1/contractors/document-token/${token}`,

  // Contract signing
  contractByToken: (token: string) => `${getApiUrl()}/api/v1/contractors/token/${token}`,
  contractPdf: (token: string) => `${getApiUrl()}/api/v1/contractors/token/${token}/pdf`,
  signContract: (token: string) => `${getApiUrl()}/api/v1/contractors/sign/${token}`,

  // Admins
  get admins() { return `${getApiUrl()}/api/v1/auth/admins`; },

  // Third Parties
  get thirdParties() { return `${getApiUrl()}/api/v1/third-parties/`; },
  thirdPartyById: (id: string) => `${getApiUrl()}/api/v1/third-parties/${id}`,

  // Clients
  get clients() { return `${getApiUrl()}/api/v1/clients/`; },
  clientById: (id: string) => `${getApiUrl()}/api/v1/clients/${id}`,
  clientUploadDocument: (id: string) => `${getApiUrl()}/api/v1/clients/${id}/upload-document`,
  clientDeleteDocument: (id: string, index: number) => `${getApiUrl()}/api/v1/clients/${id}/documents/${index}`,

  // Signature
  get superadminSignature() { return `${getApiUrl()}/api/v1/contractors/superadmin/signature`; },
};
