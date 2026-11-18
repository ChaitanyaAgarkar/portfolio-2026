import { CHAPTER_ROUTES } from '@/data/navigation';
import { ASSETS_CONFIG, PROFILE, SITE_CONFIG } from '@/data/profile';
import { getProjectBySlug } from '@/data/projects';
import type { PageMetadata } from '@/types/seo';

export function buildAbsoluteUrl(path: string): string {
  const base = SITE_CONFIG.siteUrl.replace(/\/+$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return cleanPath === '/' ? `${base}/` : `${base}${cleanPath}`;
}

export function getOgImageUrl(): string {
  return buildAbsoluteUrl(ASSETS_CONFIG.ogImagePath);
}

export function getRouteMetadata(pathname: string): PageMetadata {
  const normalized = pathname !== '/' ? pathname.replace(/\/+$/, '') : '/';

  if (normalized === '/') {
    return {
      title: 'Chaitanya Agarkar | Software Developer & Full-Stack Engineer',
      description:
        'Explore the portfolio of Chaitanya Agarkar, a Software Developer in Pune specializing in React, TypeScript, Node.js, enterprise applications, scalable systems, and modern web experiences.',
      canonicalPath: '/',
      ogType: 'profile',
    };
  }

  if (normalized === '/projects') {
    return {
      title: 'Projects | Chaitanya Agarkar — Full-Stack & Systems Portfolio',
      description:
        'Explore full-stack, real-time collaborative, AI, and machine learning software projects engineered by Chaitanya Agarkar using React, Next.js, TypeScript, and Node.js.',
      canonicalPath: '/projects',
      ogType: 'website',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Projects', path: '/projects' },
      ],
    };
  }

  if (normalized.startsWith('/projects/')) {
    const slug = normalized.replace('/projects/', '');
    const project = getProjectBySlug(slug);
    if (project) {
      return {
        title: `${project.title} | ${project.category} — ${PROFILE.name}`,
        description: `${project.description} Built with ${project.stack.slice(0, 5).join(', ')}.`,
        canonicalPath: `/projects/${project.slug}`,
        ogType: 'article',
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'Projects', path: '/projects' },
          { name: project.title, path: `/projects/${project.slug}` },
        ],
      };
    }
  }

  const chapter = CHAPTER_ROUTES.find((c) => c.route === normalized);
  if (chapter) {
    return {
      title: `${chapter.title} | ${PROFILE.name}`,
      description: `${chapter.subtitle} — Portfolio of ${PROFILE.name}, Full-Stack Engineer in Pune.`,
      canonicalPath: chapter.route,
      ogType: 'website',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: chapter.label, path: chapter.route },
      ],
    };
  }

  return {
    title: 'Page Not Found | Chaitanya Agarkar',
    description: 'The requested engineering route does not exist inside The Digital Dimension.',
    canonicalPath: normalized,
    ogType: 'website',
  };
}

