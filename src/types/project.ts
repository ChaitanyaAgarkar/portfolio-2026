export type ProjectStatus = 'ACTIVE' | 'BETA' | 'LIVE' | 'PRIVATE';

export type ProjectVisualKind =
  | 'chatttt'
  | 'lingo'
  | 'docs'
  | 'flight-predictor'
  | 'editum-ide'
  | 'ecommerce-platform';

export interface ProjectArchitectureNode {
  id: string;
  label: string;
  role: string;
}

export interface ProjectItem {
  slug: string;
  index: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  status: ProjectStatus;
  accentColor: string;
  stack: string[];
  features: string[];
  architecture: string;
  architectureNodes: ProjectArchitectureNode[];
  database: string;
  performance?: string;
  githubUrl?: string;
  liveUrl?: string;
  availabilityNote?: string;
  visualKind: ProjectVisualKind;
  screenshotPath?: string;
}
