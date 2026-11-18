import { Route, Routes } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { ProjectsPage } from '@/pages/ProjectsPage';
import { ProjectDetailPage } from '@/pages/ProjectDetailPage';
import { SectionRoutePage } from '@/pages/SectionRoutePage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<SectionRoutePage chapterId="about" />} />
      <Route path="/work" element={<SectionRoutePage chapterId="work" />} />
      <Route path="/experience" element={<SectionRoutePage chapterId="experience" />} />
      <Route path="/skills" element={<SectionRoutePage chapterId="skills" />} />
      <Route path="/coding" element={<SectionRoutePage chapterId="coding" />} />
      <Route path="/contact" element={<SectionRoutePage chapterId="contact" />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/projects/:slug" element={<ProjectDetailPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

