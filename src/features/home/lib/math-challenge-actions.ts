'use server';

import { createMathChallenge } from '@/features/home/lib/contact-math-challenge';
import type { MathChallengePublic } from '@/types/components/contact-section';

export async function refreshMathChallenge(): Promise<MathChallengePublic> {
  return createMathChallenge();
}
