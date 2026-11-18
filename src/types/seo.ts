export interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface PageMetadata {
  title: string;
  description: string;
  canonicalPath: string;
  ogType?: 'website' | 'profile' | 'article';
  breadcrumbs?: BreadcrumbItem[];
}

