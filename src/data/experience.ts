import type { ExperienceItem } from '@/types/experience';

/**
 * Configurable role designation for Meru Accounting.
 * Resume states "Full Stack Developer Intern", while separately supplied experience
 * notes "Full Stack Developer". Override via VITE_MERU_DESIGNATION or edit here
 * once confirmed.
 */
export const MERU_DESIGNATION_CONFIG = {
  resolvedRole:
    (import.meta.env.VITE_MERU_DESIGNATION as string | undefined)?.trim() ||
    'Full Stack Developer Intern',
  resumeRole: 'Full Stack Developer Intern',
  alternateSuppliedRole: 'Full Stack Developer',
} as const;

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'ibvl',
    index: '01',
    company: 'Imperative Business Ventures Ltd (IBVL)',
    location: 'Pune',
    role: 'Software Developer',
    duration: 'October 2025 – Present',
    type: 'Full-Time',
    summary:
      'Architecting and shipping enterprise portals, multi-tenant platforms, operational suites, and desktop synchronization agents across full-stack TypeScript and Electron environments.',
    responsibilities: [
      'Delivered government portals with a six-level RBAC approval workflow, bilingual English/Marathi CMS, and no-code dynamic form builder, cutting per-policy deployment effort by 60%+.',
      'Integrated AI/RPA-driven review automation across approval stages, reducing manual review overhead by 60%+.',
      'Developed a multi-tenant LMS with Students, Instructors, Tenant Admins, and Super-Admins, including role-based routing, course management, video streaming, e-commerce, and SSO.',
      'Built HRMS/payroll modules covering payroll runs, attendance, and geolocation punching.',
      'Built document management features including file explorer, versioning, and sharing.',
      'Developed POS modules covering register lifecycle, GST reporting, and inventory.',
      'Integrated REST APIs for authentication, pagination, search/filtering, multipart uploads, and PDF/Excel exports.',
      'Added Playwright/Vitest testing and API contract validation.',
      'Built Payttend Biometric Sync, an Electron.js Windows agent that synchronizes on-premise biometric Access databases with cloud REST APIs using incremental synchronization, exponential-backoff retries, offline SQLite queues, and JWT/API-key authentication.',
    ],
    highlights: ['60%+ form effort reduction', '60%+ review overhead reduction', '6-level RBAC workflow'],
    technologies: [
      'React',
      'TypeScript',
      'Electron.js',
      'Express.js',
      'SQLite',
      'Playwright',
      'Vitest',
      'REST APIs',
      'RBAC / SSO',
      'AI / RPA',
    ],
  },
  {
    id: 'meru-accounting',
    index: '02',
    company: 'Meru Accounting',
    role: MERU_DESIGNATION_CONFIG.resolvedRole,
    alternateRoleNote:
      'Configurable between "Full Stack Developer Intern" (resume) and "Full Stack Developer" (supplied experience notes).',
    duration: 'April 2025 – September 2025',
    type: MERU_DESIGNATION_CONFIG.resolvedRole.toLowerCase().includes('intern')
      ? 'Internship'
      : 'Full-Time',
    summary:
      'Engineered event-driven financial microservices, sub-second accounting webhook pipelines, and containerized cloud deployments.',
    responsibilities: [
      'Built RESTful microservices with Node.js, Express.js, gRPC, and Kafka for high-throughput financial pipelines.',
      'Built event-driven QuickBooks and Xero webhook integrations with sub-second synchronization.',
      'Designed PostgreSQL schemas with Prisma ORM.',
      'Containerized services with Docker and deployed them to cloud environments.',
      'Accelerated delivery by 40% using Cursor and Copilot, as reported.',
    ],
    highlights: ['Sub-second QuickBooks & Xero sync', '40% accelerated delivery'],
    technologies: [
      'Node.js',
      'Express.js',
      'gRPC',
      'Kafka',
      'PostgreSQL',
      'Prisma ORM',
      'Docker',
      'QuickBooks & Xero Webhooks',
    ],
  },
  {
    id: 'internet-folks',
    index: '03',
    company: 'Internet Folks Pvt Ltd',
    role: 'React Developer Intern',
    duration: 'September 2024 – January 2025',
    type: 'Internship',
    summary:
      'Modernized SaaS UI architecture in a Turborepo monorepo while accelerating CI/CD pipelines and strengthening Jest test coverage.',
    responsibilities: [
      'Optimized SaaS frontend using Next.js, Shadcn, and Radix UI, improving development efficiency by 30%.',
      'Maintained Turborepo monorepo for Levo CMS.',
      'Optimized CI/CD pipelines, reducing build times by 40%.',
      'Resolved UAT test cases using Jest, reducing post-deployment bugs by 35%.',
    ],
    highlights: ['30% dev efficiency gain', '40% faster CI/CD builds', '35% fewer post-deploy bugs'],
    technologies: ['Next.js', 'React', 'Shadcn UI', 'Radix UI', 'Turborepo', 'Jest', 'CI/CD'],
  },
  {
    id: 'infotech-brains',
    index: '04',
    company: 'InfoTech Brains',
    role: 'MERN Stack Developer Intern',
    duration: 'January 2024 – July 2024',
    type: 'Internship',
    summary:
      'Developed responsive full-stack MERN applications with SEO rendering optimizations and VPS production deployments.',
    responsibilities: [
      'Built responsive MERN applications.',
      'Optimized rendering for SEO, driving 20% more organic traffic.',
      'Deployed production applications to VPS.',
      'Participated in code reviews and Jira-based project management.',
    ],
    highlights: ['20% more organic traffic', 'Production VPS deployments'],
    technologies: ['MongoDB', 'Express.js', 'React', 'Node.js', 'VPS', 'SEO', 'Jira'],
  },
  {
    id: 'dev-market',
    index: '05',
    company: 'Dev Market',
    role: 'Prompt Engineer Intern',
    duration: 'June 2024 – July 2024',
    type: 'Internship',
    summary:
      'Researched, engineered, and iteratively refined structured prompts for language model integrations.',
    responsibilities: [
      'Developed effective prompts for language models.',
      'Optimized existing prompts.',
      'Collaborated cross-functionally on prompt engineering research and product improvements.',
    ],
    technologies: ['Prompt Engineering', 'LLMs', 'Cross-Functional Research'],
  },
  {
    id: 'cisco-netacad',
    index: '06',
    company: 'Cisco Netacad',
    role: 'Virtual Internship',
    duration: 'August 2024 – September 2024',
    type: 'Virtual Internship',
    summary:
      'Designed and simulated network segmentation and web access restriction architectures for hybrid institutional environments.',
    responsibilities: [
      'Designed network security solutions using Cisco Packet Tracer.',
      'Restricted web access and secured hybrid faculty-student environments.',
    ],
    technologies: ['Cisco Packet Tracer', 'Network Security', 'Access Control'],
  },
];

