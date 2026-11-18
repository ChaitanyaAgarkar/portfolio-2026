import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProjectBySlug } from '@/data/projects';
import { ProjectDetails } from '@/components/projects/ProjectDetails';
import { NotFoundPage } from './NotFoundPage';

export function ProjectDetailPage() {
  const { slug = '' } = useParams();
  const project = getProjectBySlug(slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [slug]);

  if (!project) {
    return <NotFoundPage />;
  }

  return (
    <div className="relative z-10 min-h-screen bg-[#EEEEEE]/94 backdrop-blur-xs">
      <ProjectDetails project={project} />
    </div>
  );
}

