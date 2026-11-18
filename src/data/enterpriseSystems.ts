import type { EnterpriseSystem, ImpactHighlight } from '@/types/enterprise';

export const IMPACT_HIGHLIGHTS: ImpactHighlight[] = [
  {
    id: 'approval-hierarchy',
    index: '01',
    title: 'Six-Level Government Approval Workflow',
    summary:
      'Engineered structured multi-stage state transitions, role-gated escalations, and approval-specific permissions across public-sector policy portals.',
    visualType: 'approval',
    tags: ['6-Stage Pipeline', 'RBAC Gates', 'Audit Trail'],
  },
  {
    id: 'dynamic-form-builder',
    index: '02',
    title: '60%+ Reduction in Per-Policy Form Effort',
    summary:
      'Replaced repetitive manual policy form engineering with a no-code dynamic form builder supporting conditional logic, dependent dropdowns, and bilingual CMS schemas.',
    visualType: 'dynamic-form',
    tags: ['60%+ Effort Saved', 'Conditional Logic', 'EN / MR CMS'],
  },
  {
    id: 'ai-rpa-automation',
    index: '03',
    title: '60%+ Reduction in Manual Review Overhead',
    summary:
      'Integrated AI/RPA-driven application review automation directly across approval stages, transforming manual verification bottlenecks into deterministic pipelines.',
    visualType: 'automation',
    tags: ['60%+ Overhead Reduced', 'AI + RPA', 'Stage Automation'],
  },
  {
    id: 'multi-tenant-lms',
    index: '04',
    title: 'Multi-Tenant LMS Architecture',
    summary:
      'Architected tenant-isolated learning environments serving Students, Instructors, Tenant Administrators, and Super Administrators with SSO and role-based routing.',
    visualType: 'multi-tenant',
    tags: ['4 Role Tiers', 'Tenant Isolation', 'SSO + E-Commerce'],
  },
  {
    id: 'enterprise-operations',
    index: '05',
    title: 'Enterprise Operations & Financial Pipelines',
    summary:
      'Delivered production modules across Enterprise HRMS & Payroll, Document Management Systems, POS & Inventory, Biometric Attendance Sync, and QuickBooks/Xero webhook integrations.',
    visualType: 'operations',
    tags: ['HRMS & Payroll', 'DMS', 'POS & GST', 'Payttend Sync', 'QuickBooks & Xero'],
  },
];

export const ENTERPRISE_SYSTEMS: EnterpriseSystem[] = [
  {
    id: 'gov-scheme-platform',
    index: '01',
    title: 'Government Scheme Management Platform',
    domain: 'GovTech / Configurable Workflow Engine',
    overview:
      'A configurable government scheme management platform with a structured six-level approval hierarchy, bilingual content publishing, and automated application triage.',
    capabilities: [
      'Six-level approval workflow',
      'Role-based access control',
      'English and Marathi CMS',
      'Scheme management',
      'Configurable application forms',
      'Conditional form logic',
      'Dependent dropdowns',
      'AI/RPA-driven application review',
      'Approval-specific permissions',
    ],
    engineeringHighlights: [
      'Reduced per-policy form deployment effort by over 60%',
      'Reduced manual review overhead by over 60%',
      'Built configurable form architecture',
      'Implemented workflow-specific permissions',
    ],
    stack: ['React', 'TypeScript', 'Dynamic Schema Engine', 'RBAC', 'AI / RPA Integration', 'REST APIs'],
    diagramType: 'gov-workflow',
    confidentialityNote:
      'Illustrative architectural simulation; proprietary agency details and interfaces are omitted.',
  },
  {
    id: 'multi-tenant-lms',
    index: '02',
    title: 'Multi-Tenant LMS',
    domain: 'Enterprise EdTech Architecture',
    overview:
      'A learning management platform supporting isolated tenant organizations, four distinct user hierarchies, media delivery, and enterprise SSO.',
    capabilities: [
      'Students',
      'Instructors',
      'Tenant administrators',
      'Super administrators',
      'Course management',
      'Video streaming',
      'E-commerce',
      'SSO',
      'Role-based routing',
      'Extensive API integration',
    ],
    engineeringHighlights: [
      'Structured role-based routing across four administrative and learner tiers',
      'Unified course authoring, video streaming, commerce, and SSO authentication flows',
      'Isolated tenant configurations within a shared platform codebase',
    ],
    stack: ['React', 'TypeScript', 'Role-Based Routing', 'SSO', 'Video Streaming', 'REST APIs'],
    diagramType: 'multi-tenant-lms',
    confidentialityNote:
      'Illustrative multi-tenant topology; internal tenant identifiers are omitted.',
  },
  {
    id: 'payttend-sync',
    index: '03',
    title: 'Payttend — Biometric Attendance Sync',
    domain: 'Desktop Agent & Offline-First Sync Pipeline',
    overview:
      'A Windows desktop synchronization agent built using Electron.js and Express.js to bridge on-premise biometric attendance databases with cloud APIs reliably.',
    capabilities: [
      'Read-only synchronization from on-premise biometric Access databases',
      'Incremental synchronization',
      'Offline SQLite queue',
      'SHA-256-based deduplication',
      'Retry and exponential backoff',
      'JWT/API-key authentication',
      'Cloud REST API integration',
    ],
    engineeringHighlights: [
      'Zero mutation on source biometric Access database via read-only extraction',
      'Deterministic SHA-256 hashing prevents duplicate punch ingestion across retries',
      'Resilient offline SQLite buffer with exponential-backoff recovery on network drops',
    ],
    stack: ['Electron', 'React', 'Express', 'Axios', 'SQLite', 'SQL.js', 'JavaScript/TypeScript'],
    diagramType: 'payttend-sync',
    confidentialityNote:
      'Illustrative telemetry pipeline; internal endpoints and schemas are omitted.',
  },
  {
    id: 'enterprise-hrms',
    index: '04',
    title: 'Enterprise HRMS / Payroll',
    domain: 'Workforce Operations & Statutory Compliance',
    overview:
      'An integrated human resource and payroll platform handling employee lifecycles, geolocation attendance verification, salary structures, and statutory workflows.',
    capabilities: [
      'Employee management',
      'Attendance',
      'Geolocation punching',
      'Payroll runs',
      'Salary structures',
      'Statutory workflows',
      'Role-based permissions',
    ],
    engineeringHighlights: [
      'Connected geolocation attendance verification directly to payroll calculation runs',
      'Built configurable salary component structures and statutory compliance steps',
      'Enforced strict RBAC isolation across HR, payroll, and employee views',
    ],
    stack: ['React', 'TypeScript', 'REST APIs', 'RBAC', 'PDF/Excel Exports', 'Geolocation APIs'],
    diagramType: 'hrms-payroll',
    confidentialityNote:
      'Illustrative entity graph; employee and payroll datasets shown are synthetic.',
  },
  {
    id: 'document-management-system',
    index: '05',
    title: 'Document Management System',
    domain: 'Enterprise Content & Version Governance',
    overview:
      'A structured document management module supporting hierarchical file exploration, immutable revision tracking, controlled sharing, and review workflows.',
    capabilities: [
      'File explorer',
      'Versioning',
      'Sharing',
      'Document workflows',
      'Access management',
    ],
    engineeringHighlights: [
      'Designed spatial folder/file explorer with multipart upload handling',
      'Implemented version lineage tracking and granular access controls',
      'Connected document lifecycles to structured review and approval workflows',
    ],
    stack: ['React', 'TypeScript', 'Multipart Uploads', 'Access Control', 'Workflow Engine'],
    diagramType: 'dms-workspace',
    confidentialityNote:
      'Illustrative spatial document model; private repository items are omitted.',
  },
  {
    id: 'pos-inventory',
    index: '06',
    title: 'POS and Inventory Management',
    domain: 'Retail Operations & Tax Compliance',
    overview:
      'A point-of-sale and stock operations suite covering register lifecycle management, GST reporting, real-time inventory synchronization, and operational workflows.',
    capabilities: [
      'Register lifecycle',
      'GST reporting',
      'Inventory',
      'Stock management',
      'Operational workflows',
    ],
    engineeringHighlights: [
      'Structured end-to-end register open, shift reconciliation, and close workflows',
      'Automated GST tax calculation summaries and exportable compliance reports',
      'Linked point-of-sale transactions directly with live stock movement ledgers',
    ],
    stack: ['React', 'TypeScript', 'REST APIs', 'GST Reporting', 'PDF/Excel Exports'],
    diagramType: 'pos-inventory',
    confidentialityNote:
      'Illustrative commerce flow; commercial figures and merchant data are omitted.',
  },
];

