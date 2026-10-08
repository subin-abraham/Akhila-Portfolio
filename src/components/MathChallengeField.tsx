'use client';

import Image from 'next/image';
import { useId, useState, useTransition } from 'react';

import { refreshMathChallenge } from '@/features/home/lib/math-challenge-actions';
import type { MathChallengeFieldProps } from '@/types/components/math-challenge-field';

export function MathChallengeField({
  idPrefix,
  challenge,
  answerName = 'challengeAnswer',
  tokenName = 'challengeToken',
  hasError = false,
  describedBy,
  className,
}: MathChallengeFieldProps) {
  const [activeChallenge, setActiveChallenge] = useState(challenge);
  const [isRefreshing, startRefresh] = useTransition();
  const hintId = useId();
  const imageId = `${idPrefix}-challenge-image`;
  const answerId = `${idPrefix}-challenge-answer`;
  const refreshId = `${idPrefix}-challenge-refresh`;
  const answerDescribedBy = [describedBy, hintId].filter(Boolean).join(' ') || undefined;

  function handleRefresh() {
    startRefresh(async () => {
      const nextChallenge = await refreshMathChallenge();
      setActiveChallenge(nextChallenge);
    });
  }

  return (
    <div className={className ?? 'flex flex-col gap-1.5'}>
      <p className="text-sm font-medium text-home-heading">Security check</p>

      <div className="flex items-center gap-2">
        <Image
          id={imageId}
          src={activeChallenge.imageDataUrl}
          alt="Math challenge image"
          width={168}
          height={44}
          unoptimized
          draggable={false}
          className="h-11 w-[168px] select-none object-contain"
        />
        <button
          id={refreshId}
          type="button"
          title="Refresh math challenge"
          aria-label="Refresh math challenge"
          aria-controls={imageId}
          disabled={isRefreshing}
          onClick={handleRefresh}
          className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-home-input-border bg-home-input text-home-muted transition hover:border-home-accent/40 hover:text-home-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-home-accent disabled:cursor-not-allowed disabled:opacity-60"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12a9 9 0 1 1-2.6-6.4" />
            <path d="M21 3v6h-6" />
          </svg>
        </button>
      </div>

      <input type="hidden" name={tokenName} value={activeChallenge.token} />

      <label htmlFor={answerId} className="text-sm font-medium text-home-heading">
        Your answer
      </label>
      <input
        key={activeChallenge.token}
        id={answerId}
        name={answerName}
        type="text"
        inputMode="numeric"
        required
        autoComplete="off"
        defaultValue=""
        aria-invalid={hasError}
        aria-describedby={answerDescribedBy}
        className="rounded-lg border border-home-input-border bg-home-input px-4 py-3 text-sm text-home-heading outline-none transition placeholder:text-home-muted focus:border-home-accent/50"
        placeholder="Result shown above"
      />
      <p id={hintId} className="sr-only">
        Enter the result of the math challenge shown in the image. Use the refresh
        button to get a new challenge.
      </p>
    </div>
  );
}
