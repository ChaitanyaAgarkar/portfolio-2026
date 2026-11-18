import { useEffect } from 'react';
import { useActiveSection } from '@/hooks/useActiveSection';
import { Hero } from '@/components/sections/Hero';
import { MobileChapterHub } from '@/components/sections/MobileChapterHub';
import { About } from '@/components/sections/About';
import { Impact } from '@/components/sections/Impact';
import { EnterpriseShowcase } from '@/components/sections/EnterpriseShowcase';
import { Projects } from '@/components/sections/Projects';
import { Experience } from '@/components/sections/Experience';
import { Skills } from '@/components/sections/Skills';
import { CodingStats } from '@/components/sections/CodingStats';
import { Education } from '@/components/sections/Education';
import { Contact } from '@/components/sections/Contact';

export function HomePage() {
  useActiveSection(true);

  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      const target = document.getElementById(id);
      if (target) {
        window.setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 80);
      }
    }
  }, []);

  return (
    <>
      <Hero />
      <MobileChapterHub />
      <div className="hidden md:block">
        <About />
        <Impact />
        <EnterpriseShowcase />
        <Projects />
        <Experience />
        <Skills />
        <CodingStats />
        <Education />
        <Contact />
      </div>
    </>
  );
}

