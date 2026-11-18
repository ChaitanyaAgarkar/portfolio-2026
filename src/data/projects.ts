import type { ProjectItem } from '@/types/project';

/**
 * Typed source-of-truth catalog for personal projects.
 * Optional `screenshotPath` can be wired to `/projects/<filename>` once
 * real screenshots are placed inside `public/projects/`.
 */
export const PROJECTS: ProjectItem[] = [
  {
    slug: 'chatttt',
    index: '01',
    title: 'CHATTTT',
    tagline: 'Real-Time Messaging & Admin Analytics Platform',
    description:
      'A real-time chat application with friend requests, group conversations, private messaging, and an administrative dashboard.',
    category: 'Real-Time Communication',
    status: 'ACTIVE',
    accentColor: '#2060FF',
    stack: ['React', 'Redux', 'Material UI', 'Socket.io', 'Node.js', 'MongoDB', 'Redis'],
    features: [
      'Real-time messaging using WebSockets',
      'Group and private conversations',
      'Friend request system',
      'Admin dashboard and analytics',
    ],
    architecture: 'Client-server architecture with WebSocket bridge',
    architectureNodes: [
      { id: 'client', label: 'React + Redux Client', role: 'Stateful UI & optimistic feeds' },
      { id: 'ws', label: 'Socket.io Bridge', role: 'Bi-directional event rooms' },
      { id: 'api', label: 'Node.js REST & Auth', role: 'Friendships & admin telemetry' },
      { id: 'store', label: 'MongoDB Atlas + Redis', role: 'Persistence & low-latency cache' },
    ],
    database: 'MongoDB Atlas with Redis cache layer',
    performance: '99.2% uptime and <100ms response time',
    githubUrl: 'https://github.com/chaieeetanya433/MernChatApp',
    liveUrl: 'https://chatapp-frontend-orcin.vercel.app/login',
    visualKind: 'chatttt',
  },
  {
    slug: 'lingo',
    index: '02',
    title: 'LINGO',
    tagline: 'AI-Assisted Gamified Language Learning',
    description:
      'A Duolingo-inspired language-learning platform featuring AI voices, hearts, XP systems, and secure authentication.',
    category: 'EdTech & AI Workflows',
    status: 'BETA',
    accentColor: '#E11D48',
    stack: ['Next.js 14', 'TypeScript', 'Drizzle ORM', 'NeonDB', 'Tailwind CSS', 'Clerk'],
    features: [
      'AI-powered pronunciation feedback',
      'XP and level progression',
      'Hearts-based attempt system',
      'OAuth authentication using Clerk',
    ],
    architecture: 'Edge-first architecture with AI integration',
    architectureNodes: [
      { id: 'edge', label: 'Next.js 14 App Router', role: 'Edge-cached lessons & SSR' },
      { id: 'auth', label: 'Clerk OAuth Layer', role: 'Identity & session guards' },
      { id: 'ai', label: 'AI Voice Feedback', role: 'Pronunciation & audio evaluation' },
      { id: 'db', label: 'Drizzle ORM + NeonDB', role: 'Serverless relational + vector state' },
    ],
    database: 'NeonDB serverless and vector storage',
    performance: 'Sub-2-second load time and edge caching',
    githubUrl: 'https://github.com/chaieeetanya433',
    liveUrl: 'https://lingo-chaieess-nextjs.vercel.app/',
    visualKind: 'lingo',
  },
  {
    slug: 'docs',
    index: '03',
    title: 'DOCS',
    tagline: 'Multiplayer Collaborative Document Studio',
    description:
      'A real-time collaborative document editing platform featuring commenting, templates, and organizational workspaces.',
    category: 'Collaborative SaaS',
    status: 'LIVE',
    accentColor: '#2060FF',
    stack: ['Next.js 15', 'Convex', 'Liveblocks', 'Tailwind CSS', 'TipTap'],
    features: [
      'Real-time collaborative document editing',
      'Live commenting and annotations',
      'Document templates and organization',
      'Version history tracking',
    ],
    architecture: 'Real-time collaborative architecture',
    architectureNodes: [
      { id: 'editor', label: 'TipTap Rich Editor', role: 'Structured prose & templates' },
      { id: 'collab', label: 'Liveblocks OT Sync', role: 'Live cursors & annotations' },
      { id: 'org', label: 'Workspace Guards', role: 'Organizational scopes & sharing' },
      { id: 'db', label: 'Convex Real-Time DB', role: 'Reactive document & version store' },
    ],
    database: 'Convex real-time database and document store',
    performance: 'Operational-transform collaboration and sub-50ms synchronization',
    githubUrl: 'https://github.com/chaieeetanya433',
    liveUrl: 'https://docs-project-chai.vercel.app/',
    visualKind: 'docs',
  },
  {
    slug: 'flight-predictor',
    index: '04',
    title: 'FLIGHT PREDICTOR',
    tagline: 'ML Domestic Flight Fare Estimation Engine',
    description:
      'A machine learning-powered application that predicts domestic flight prices in India using a Random Forest Regressor.',
    category: 'Applied Machine Learning',
    status: 'LIVE',
    accentColor: '#0284C7',
    stack: ['React', 'Vite', 'Tailwind CSS', 'Python', 'Flask', 'scikit-learn'],
    features: [
      '97.29% prediction accuracy as reported for the model',
      'Real-time flight fare estimation',
      'Custom data preprocessing pipeline',
      'REST API integration',
    ],
    architecture: 'Machine learning pipeline with REST API',
    architectureNodes: [
      { id: 'ui', label: 'React + Vite Client', role: 'Route, carrier & timing inputs' },
      { id: 'api', label: 'Flask REST API', role: 'Validation & inference gateway' },
      { id: 'prep', label: 'Feature Pipeline', role: 'Encoding stops, duration & schedule' },
      { id: 'ml', label: 'Random Forest Model', role: 'Persisted regressor inference' },
    ],
    database: 'CSV dataset and model persistence layer',
    performance: 'R² score of 0.9729 and sub-500ms prediction time',
    githubUrl: 'https://github.com/chaieeetanya433/flight-fare-prediction-FE',
    liveUrl: 'https://flight-fare-prediction-app.vercel.app/',
    visualKind: 'flight-predictor',
  },
  {
    slug: 'editum-ide',
    index: '05',
    title: 'EDITUM IDE',
    tagline: 'Multi-Language Cloud Code Execution SaaS',
    description:
      'A SaaS online IDE supporting ten programming languages, VSCode-inspired themes, real-time collaboration, and analytics.',
    category: 'Developer Tooling SaaS',
    status: 'BETA',
    accentColor: '#E11D48',
    stack: ['Next.js 15', 'Tailwind CSS', 'Framer Motion', 'Zustand', 'Clerk', 'Convex'],
    features: [
      'Support for ten programming languages',
      'Five customizable VSCode-inspired themes',
      'Real-time code execution and error handling',
      'Community-driven code sharing',
    ],
    architecture: 'Serverless SaaS with real-time features',
    architectureNodes: [
      { id: 'ide', label: 'Next.js 15 + Zustand', role: 'Editor state & 5 theme presets' },
      { id: 'exec', label: 'Execution Runtime', role: '10-language runner & diagnostics' },
      { id: 'auth', label: 'Clerk Auth', role: 'User sessions & workspace access' },
      { id: 'db', label: 'Convex DB', role: 'Snippets, shares & telemetry' },
    ],
    database: 'Convex DB and user session management',
    performance: 'Edge computing and sub-1-second code execution',
    githubUrl: 'https://github.com/chaieeetanya433/code-editum',
    liveUrl: 'https://code-editum.vercel.app/',
    visualKind: 'editum-ide',
  },
  {
    slug: 'ecommerce-platform',
    index: '06',
    title: 'E-COMMERCE PLATFORM',
    tagline: 'Cross-Platform Commerce, Admin & Payment Ecosystem',
    description:
      'A full-stack e-commerce platform consisting of a React Native mobile application, administrative dashboard, and REST API.',
    category: 'Full-Stack Commerce',
    status: 'PRIVATE',
    accentColor: '#6366F1',
    stack: ['React Native', 'Expo', 'Node.js', 'Express', 'Clerk', 'Stripe', 'TanStack Query', 'Inngest', 'Sentry'],
    features: [
      'Clerk authentication and RBAC',
      'Stripe payment integration',
      'Administrative dashboard',
      'Sentry observability',
      'Live analytics',
      'Inngest background jobs',
    ],
    architecture: 'Unified mobile storefront, web admin console, and REST API with async job processing',
    architectureNodes: [
      { id: 'mobile', label: 'React Native + Expo App', role: 'Customer catalog & Stripe checkout' },
      { id: 'admin', label: 'Admin Dashboard', role: 'Inventory, orders & live analytics' },
      { id: 'api', label: 'Node.js + Express API', role: 'Clerk RBAC & Stripe webhooks' },
      { id: 'ops', label: 'Inngest + Sentry', role: 'Background jobs & observability' },
    ],
    database: 'Backend persistence layer managed through Express REST services and webhook handlers',
    availabilityNote:
      'Private repository; links and runtime benchmarks are intentionally omitted rather than fabricated.',
    visualKind: 'ecommerce-platform',
  },
];

export function getProjectBySlug(slug: string): ProjectItem | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

