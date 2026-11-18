export type EnterpriseDiagramType =
  | 'gov-workflow'
  | 'multi-tenant-lms'
  | 'payttend-sync'
  | 'hrms-payroll'
  | 'dms-workspace'
  | 'pos-inventory';

export interface EnterpriseSystem {
  id: string;
  index: string;
  title: string;
  domain: string;
  overview: string;
  capabilities: string[];
  engineeringHighlights: string[];
  stack: string[];
  diagramType: EnterpriseDiagramType;
  confidentialityNote: string;
}

export interface ImpactHighlight {
  id: string;
  index: string;
  title: string;
  summary: string;
  visualType: 'approval' | 'dynamic-form' | 'automation' | 'multi-tenant' | 'operations';
  tags: string[];
}

