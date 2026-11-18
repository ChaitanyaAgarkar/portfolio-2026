import type { AchievementEntry, EducationEntry } from '@/types/education';

export const EDUCATION_ENTRIES: EducationEntry[] = [
  {
    id: 'bsc-cs',
    institution: 'MIT World Peace University (MIT-WPU)',
    degree: 'Bachelor of Science in Computer Science',
    period: 'Graduated: June 2025',
    status: 'Completed',
    score: 'CGPA: 9.33 / 10',
    details:
      'Graduated 1st in cohort as Gold Medalist and University Topper across core computer science, algorithms, and software systems.',
  },
];

export const ACHIEVEMENTS: AchievementEntry[] = [
  {
    id: 'gold-medalist',
    index: '01',
    title: 'Gold Medalist & University Topper',
    subtitle: 'MIT World Peace University (MIT-WPU)',
    detail: 'Ranked 1st in B.Sc. Computer Science at MIT-WPU with CGPA 9.33/10.',
    year: '2025',
    tag: 'Academic Excellence',
  },
  {
    id: 'hackmit-wpu',
    index: '02',
    title: 'HackMIT WPU 2025 — Runner-Up',
    subtitle: 'National Collegiate Hackathon',
    detail: 'Secured Runner-Up position among 200+ competing engineering teams.',
    year: '2025',
    tag: '200+ Teams',
  },
  {
    id: 'sih-2024',
    index: '03',
    title: 'Smart India Hackathon 2024 — Finalist',
    subtitle: 'Government of India National Innovation Challenge',
    detail: 'Selected as a national finalist in Smart India Hackathon 2024.',
    year: '2024',
    tag: 'National Finalist',
  },
];

