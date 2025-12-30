export interface BrowserInfo {
  name: string;
  version: string;
  os: string;
  userAgent: string;
  isModern: boolean;
}

export type CheckStatus = 'pending' | 'running' | 'success' | 'error' | 'warning';

export interface DiagnosticItem {
  id: string;
  label: string;
  status: CheckStatus;
  errorMessage?: string; // The specific message to show on failure (e.g., "Region restricted") or warning
  successMessage?: string;
}

export enum DiagnosticStage {
  INITIALIZING = 'INITIALIZING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED'
}
