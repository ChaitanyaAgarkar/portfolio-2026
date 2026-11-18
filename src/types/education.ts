export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  period: string;
  status: 'Completed' | 'Upcoming / Enrolled';
  score?: string;
  affiliation?: string;
  details: string;
}

export interface AchievementEntry {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  detail: string;
  year: string;
  tag: string;
}

