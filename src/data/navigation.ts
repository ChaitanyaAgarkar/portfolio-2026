export interface NavLinkItem {
  id: string;
  label: string;
  href: string;
  route: string;
  sectionId: string;
}

export const NAV_LINKS: NavLinkItem[] = [
  { id: 'home', label: 'Home', href: '/#home', route: '/', sectionId: 'home' },
  { id: 'about', label: 'About', href: '/#about', route: '/about', sectionId: 'about' },
  { id: 'work', label: 'Work', href: '/#work', route: '/work', sectionId: 'work' },
  {
    id: 'experience',
    label: 'Experience',
    href: '/#experience',
    route: '/experience',
    sectionId: 'experience',
  },
  { id: 'skills', label: 'Skills', href: '/#skills', route: '/skills', sectionId: 'skills' },
  { id: 'coding', label: 'Coding', href: '/#coding', route: '/coding', sectionId: 'coding' },
  {
    id: 'contact',
    label: 'Contact',
    href: '/#contact',
    route: '/contact',
    sectionId: 'contact',
  },
];

export const SECTION_ROUTE_MAP: Record<string, string> = {
  home: '/',
  about: '/about',
  impact: '/about',
  enterprise: '/work',
  work: '/work',
  experience: '/experience',
  education: '/experience',
  skills: '/skills',
  coding: '/coding',
  contact: '/contact',
};

export interface ChapterMeta {
  id: 'about' | 'work' | 'experience' | 'skills' | 'coding' | 'contact';
  index: string;
  route: string;
  label: string;
  title: string;
  subtitle: string;
}

export const CHAPTER_ROUTES: ChapterMeta[] = [
  {
    id: 'about',
    index: '01',
    route: '/about',
    label: 'About & Impact',
    title: 'Engineering Philosophy & Outcomes',
    subtitle: 'Product lifecycle mindset and structured architectural blueprints',
  },
  {
    id: 'work',
    index: '02',
    route: '/work',
    label: 'Work & Systems',
    title: 'Enterprise Systems & Projects',
    subtitle: 'Production gov-tech portals, SaaS platforms, and selected builds',
  },
  {
    id: 'experience',
    index: '03',
    route: '/experience',
    label: 'Experience & Edu',
    title: 'Career Timeline & Credentials',
    subtitle: 'Full-stack delivery milestones and academic foundations',
  },
  {
    id: 'skills',
    index: '04',
    route: '/skills',
    label: 'Skills & Stack',
    title: 'Technical Arsenal',
    subtitle: 'Frontend, backend, database, cloud, and automation stack',
  },
  {
    id: 'coding',
    index: '05',
    route: '/coding',
    label: 'LeetCode Stats',
    title: 'Algorithmic Telemetry',
    subtitle: 'Live LeetCode problem-solving distribution and streaks',
  },
  {
    id: 'contact',
    index: '06',
    route: '/contact',
    label: 'Contact',
    title: 'Collaboration Node',
    subtitle: 'Direct channels and engineering inquiry form',
  },
];

export interface CommandRouteItem {
  command: string;
  label: string;
  description: string;
  actionType: 'section' | 'route' | 'external';
  target: string;
}

export const COMMAND_ITEMS: CommandRouteItem[] = [
  {
    command: '/home',
    label: 'Navigate to Hero',
    description: 'Jump to the top of The Digital Dimension',
    actionType: 'section',
    target: 'home',
  },
  {
    command: '/about',
    label: 'Engineering Philosophy',
    description: 'Beyond writing code — architecture & delivery mindset',
    actionType: 'section',
    target: 'about',
  },
  {
    command: '/enterprise',
    label: 'Enterprise Systems Showcase',
    description: 'Government portals, Multi-tenant LMS, Payttend Sync, HRMS, DMS, POS',
    actionType: 'section',
    target: 'enterprise',
  },
  {
    command: '/projects',
    label: 'All Personal Projects',
    description: 'Open dedicated projects index and detailed architecture views',
    actionType: 'route',
    target: '/projects',
  },
  {
    command: '/experience',
    label: 'Professional Experience',
    description: 'Interactive career timeline across 6 engineering roles',
    actionType: 'section',
    target: 'experience',
  },
  {
    command: '/skills',
    label: 'Technical Arsenal',
    description: 'Interactive technology ecosystem and categories',
    actionType: 'section',
    target: 'skills',
  },
  {
    command: '/coding',
    label: 'LeetCode Statistics',
    description: 'Live algorithmic problem-solving telemetry',
    actionType: 'section',
    target: 'coding',
  },
  {
    command: '/contact',
    label: 'Contact & Collaborate',
    description: 'Send a message, copy email, or connect directly',
    actionType: 'section',
    target: 'contact',
  },
  {
    command: '/github',
    label: 'Open GitHub Profile',
    description: 'github.com/chaieeetanya433',
    actionType: 'external',
    target: 'https://github.com/chaieeetanya433',
  },
  {
    command: '/linkedin',
    label: 'Open LinkedIn Profile',
    description: 'linkedin.com/in/chaitanyaagarkar',
    actionType: 'external',
    target: 'https://www.linkedin.com/in/chaitanyaagarkar/',
  },
];

