export interface ExperienceItem {
  id: string;
  index: string;
  company: string;
  location?: string;
  role: string;
  alternateRoleNote?: string;
  duration: string;
  type: 'Full-Time' | 'Internship' | 'Virtual Internship';
  summary: string;
  responsibilities: string[];
  technologies: string[];
  highlights?: string[];
}

