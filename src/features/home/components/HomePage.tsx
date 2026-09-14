import { EducationSection } from '@/features/home/components/EducationSection';
import { HeroSection } from '@/features/home/components/HeroSection';
import { ProfessionalJourneySection } from '@/features/home/components/ProfessionalJourneySection';
import { SiteFooter } from '@/features/home/components/SiteFooter';
import { SiteHeader } from '@/features/home/components/SiteHeader';
import { TechnicalExpertiseSection } from '@/features/home/components/TechnicalExpertiseSection';
import { ToolsAndTechnologySection } from '@/features/home/components/ToolsAndTechnologySection';
import { WorkedWithSection } from '@/features/home/components/WorkedWithSection';
import type { HomePageProps } from '@/types/components/home-page';

export function HomePage({ data }: HomePageProps) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-home-bg text-white">
      <SiteHeader navLinks={data.navLinks} socialLinks={data.socialLinks} />
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 pb-8 pt-8 sm:px-8 sm:pb-10 sm:pt-10 lg:px-10 lg:pt-12">
        <main className="flex flex-col gap-14 sm:gap-16 lg:gap-20">
          <HeroSection homepage={data.homepage} />
          <WorkedWithSection items={data.workedWith} />
          <ProfessionalJourneySection
            section={data.professionalJourneySection}
            items={data.professionalJourney}
          />
          <EducationSection
            section={data.educationSection}
            items={data.education}
          />
          <TechnicalExpertiseSection
            section={data.technicalExpertiseSection}
            categories={data.technicalExpertise}
          />
          <ToolsAndTechnologySection
            section={data.toolsAndTechnologySection}
            categories={data.toolsAndTechnology}
          />
        </main>
      </div>
      <SiteFooter footer={data.footer} socialLinks={data.socialLinks} />
    </div>
  );
}
