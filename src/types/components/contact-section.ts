import type { HomepageSectionContent } from '@/types/home/homepage-section';

export interface MathChallengePublic {
  token: string;
  imageDataUrl: string;
}

export interface ContactFormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactSectionProps {
  section: HomepageSectionContent;
  challenge: MathChallengePublic;
}

export interface ContactFormState {
  error: string | null;
  success: string | null;
  challenge: MathChallengePublic | null;
  values: ContactFormValues | null;
}

export interface ContactToastItem {
  id: string;
  message: string;
  variant: 'success' | 'error';
}
