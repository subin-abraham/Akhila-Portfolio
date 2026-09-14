export type SectionHighlightTarget = 'title' | 'accent';

export interface HomepageSectionContent {
  id: string;
  sectionKey: string;
  eyebrow: string;
  title: string;
  accentTitle: string | null;
  description: string;
  highlightTarget: SectionHighlightTarget;
}
