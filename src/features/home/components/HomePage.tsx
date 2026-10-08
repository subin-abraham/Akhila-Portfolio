import { AboutSection } from '@/features/home/components/AboutSection';
import { ContactSection } from '@/features/home/components/ContactSection';
import { EducationSection } from '@/features/home/components/EducationSection';
import { HeroSection } from '@/features/home/components/HeroSection';
import { ProfessionalJourneySection } from '@/features/home/components/ProfessionalJourneySection';
import { ScrollNav } from '@/features/home/components/ScrollNav';
import { TechnicalExpertiseSection } from '@/features/home/components/TechnicalExpertiseSection';
import { ToolsAndTechnologySection } from '@/features/home/components/ToolsAndTechnologySection';
import { WorkedWithSection } from '@/features/home/components/WorkedWithSection';
import { createMathChallenge } from '@/features/home/lib/contact-math-challenge';
import type { HomePageProps } from '@/types/components/home-page';

export function HomePage({ data }: HomePageProps) {
  const contactChallenge = createMathChallenge();

  return (
    <>
      <ScrollNav />
      <HeroSection homepage={data.homepage} />
      <div className="home-sections">
        <WorkedWithSection items={data.workedWith} />
        <AboutSection intro={data.homepage.intro} />
        <div className="home-bento-stack">
          <EducationSection
            section={data.educationSection}
            items={data.education}
          />
          <ProfessionalJourneySection
            section={data.professionalJourneySection}
            items={data.professionalJourney}
          />
        </div>
        <TechnicalExpertiseSection
          section={data.technicalExpertiseSection}
          categories={data.technicalExpertise}
        />
        <ToolsAndTechnologySection
          section={data.toolsAndTechnologySection}
          categories={data.toolsAndTechnology}
        />
        <ContactSection
          section={data.contactSection}
          challenge={contactChallenge}
        />
      </div>
    </>
  );
}
