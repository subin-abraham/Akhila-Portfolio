import type { MathChallengePublic } from '@/types/components/contact-section';

export interface LoginFormProps {
  challenge: MathChallengePublic;
}

export interface SignInState {
  error: string | null;
  email: string | null;
  challenge: MathChallengePublic | null;
}
