import { PROFILE } from '@/data/profile';
import type { BreadcrumbItem } from '@/types/seo';
import { buildAbsoluteUrl, getOgImageUrl } from './metadata';

export function buildPersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: PROFILE.name,
    url: buildAbsoluteUrl('/'),
    image: getOgImageUrl(),
    jobTitle: PROFILE.title,
    email: `mailto:${PROFILE.email}`,
    telephone: PROFILE.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Pune',
      addressRegion: 'Maharashtra',
      addressCountry: 'IN',
    },
    sameAs: [PROFILE.githubUrl, PROFILE.linkedinUrl, PROFILE.leetcodeUrl],
    knowsAbout: [
      'React',
      'TypeScript',
      'Node.js',
      'Next.js',
      'Full-Stack Software Engineering',
      'System Architecture',
      'PostgreSQL',
      'Microservices',
    ],
  };
}

export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: `${PROFILE.name} — The Digital Dimension`,
    url: buildAbsoluteUrl('/'),
    author: {
      '@type': 'Person',
      name: PROFILE.name,
    },
  };
}

export function buildProfilePageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: buildPersonSchema(),
    url: buildAbsoluteUrl('/'),
  };
}

export function buildBreadcrumbSchema(breadcrumbs: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: buildAbsoluteUrl(item.path),
    })),
  };
}

export function getStructuredDataForPath(
  pathname: string,
  breadcrumbs?: BreadcrumbItem[],
): Record<string, unknown>[] {
  const schemas: Record<string, unknown>[] = [buildWebSiteSchema(), buildPersonSchema()];

  if (pathname === '/') {
    schemas.push(buildProfilePageSchema());
  }

  if (breadcrumbs && breadcrumbs.length > 0) {
    schemas.push(buildBreadcrumbSchema(breadcrumbs));
  }

  return schemas;
}

