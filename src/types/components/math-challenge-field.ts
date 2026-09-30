import type { MathChallengePublic } from '@/types/components/contact-section';

export interface MathChallengeFieldProps {
  idPrefix: string;
  challenge: MathChallengePublic;
  answerName?: string;
  tokenName?: string;
  hasError?: boolean;
  describedBy?: string;
  className?: string;
}
