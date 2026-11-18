export const SITE_CONFIG = {
  siteUrl: (
    (import.meta.env.VITE_SITE_URL as string | undefined) ||
    'https://chaieeetanya.me'
  ).replace(/\/+$/, ''),
  contactEndpoint: (import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined) || '',
  leetcodeApiUrl:
    (import.meta.env.VITE_LEETCODE_API_URL as string | undefined) ||
    'https://leetcode-api-faisalshohag.vercel.app/chaitanyaagarkar',
} as const;

export const ASSETS_CONFIG = {
  ogImagePath: '/images/og-image.svg',
  faviconPath: '/favicon.svg',
  projectScreenshots: {
    chatttt: '/projects/chatttapp.webp',
    lingo: '/projects/lingoapp.jpg',
    docs: '/projects/docsapp.png',
    flightPredictor: '/projects/flightapp.jpeg',
    editumIde: '/projects/editumapp.jpeg',
  },
} as const;

export const PROFILE = {
  name: 'Chaitanya Agarkar',
  brandTag: '<Chaieeetanya/>',
  title: 'Software Developer | Full-Stack Engineer',
  heroDesignation: 'SOFTWARE DEVELOPER | FULL-STACK ENGINEER',
  heroStatement:
    'I architect and build scalable digital products, enterprise applications, and intelligent systems.',
  location: 'Pune, Maharashtra, India',
  shortLocation: 'Pune, India',
  availability: 'Open to meaningful engineering opportunities.',
  coreStackSummary: 'React | TypeScript | Node.js | System Architecture',
  email: 'chaitanyaagarkar11@gmail.com',
  phone: '+91 8855904267',
  phoneHref: 'tel:+918855904267',
  githubUrl: 'https://github.com/chaieeetanya433',
  linkedinUrl: 'https://www.linkedin.com/in/chaitanyaagarkar/',
  leetcodeUrl: 'https://leetcode.com/u/chaitanyaagarkar/',
  leetcodeUsername: 'chaitanyaagarkar',
  signature: 'DESIGNED WITH INTENT. ENGINEERED WITH PRECISION.',
} as const;

export const ABOUT_CONTENT = {
  eyebrow: '02 // ENGINEERING PHILOSOPHY',
  heading: 'BEYOND WRITING CODE.',
  paragraphs: [
    "I'm a software developer passionate about engineering products that solve real problems.",
    'From architecting enterprise SaaS platforms to building real-time applications and AI-powered workflows, I enjoy working across the entire software development lifecycle.',
    'My interests span frontend engineering, backend architecture, scalable APIs, database design, automation, and modern developer experiences.',
    "I believe great software is not just about making something work. It's about making it reliable, maintainable, scalable, and genuinely useful.",
  ],
  evolutionStages: [
    {
      step: '01',
      phase: 'IDEA',
      title: 'Problem Framing & Domain Modeling',
      description:
        'Translating operational bottlenecks, regulatory rules, and user journeys into clear system boundaries and contracts.',
    },
    {
      step: '02',
      phase: 'ARCHITECTURE',
      title: 'Resilient Systems & Data Pipelines',
      description:
        'Designing multi-tenant hierarchies, RBAC state machines, schema contracts, and event-driven integrations built for scale.',
    },
    {
      step: '03',
      phase: 'PRODUCTION SOFTWARE',
      title: 'Verified, Maintainable Delivery',
      description:
        'Shipping tested TypeScript interfaces, CI/CD pipelines, observability, and responsive UX that operates reliably in production.',
    },
  ],
} as const;

