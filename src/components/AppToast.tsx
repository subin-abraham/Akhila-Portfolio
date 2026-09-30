'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import type {
  AppToastContextValue,
  AppToastItem,
  AppToastProviderProps,
  AppToastVariant,
  ToastBannerProps,
} from '@/types/components/app-toast';

const TOAST_DURATION_MS = 4500;
const MAX_VISIBLE_TOASTS = 3;

const AppToastContext = createContext<AppToastContextValue | null>(null);

export function ToastBanner({ id, message, variant, onDismiss }: ToastBannerProps) {
  const isError = variant === 'error';
  const surfaceClassName = isError
    ? 'border-red-400/70 bg-red-500 text-white shadow-[0_12px_40px_rgb(239_68_68/0.45)]'
    : 'border-home-accent bg-home-accent text-home-ink shadow-[0_12px_40px_rgb(182_243_75/0.45)]';

  return (
    <div
      id={id}
      role={isError ? 'alert' : 'status'}
      className={`app-toast pointer-events-auto flex w-full max-w-lg items-center gap-3 rounded-2xl border-2 px-5 py-4 ${surfaceClassName}`}
    >
      <span
        aria-hidden="true"
        className={`inline-flex size-9 shrink-0 items-center justify-center rounded-full text-lg font-bold ${
          isError ? 'bg-white/20 text-white' : 'bg-home-ink/15 text-home-ink'
        }`}
      >
        {isError ? '!' : '✓'}
      </span>
      <p
        className={`flex-1 text-sm font-semibold sm:text-base ${
          isError ? 'text-white' : 'text-home-ink'
        }`}
      >
        {message}
      </p>
      {onDismiss ? (
        <button
          id={id ? `${id}-dismiss` : undefined}
          type="button"
          title="Dismiss notification"
          aria-label="Dismiss notification"
          onClick={onDismiss}
          className={`inline-flex size-8 shrink-0 items-center justify-center rounded-lg transition ${
            isError
              ? 'text-white/80 hover:bg-white/15 hover:text-white'
              : 'text-home-ink/70 hover:bg-home-ink/10 hover:text-home-ink'
          }`}
        >
          <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="none">
            <path
              d="M5 5l10 10M15 5 5 15"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
        </button>
      ) : null}
    </div>
  );
}

function AppToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: AppToastItem[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div
      aria-live="polite"
      aria-relevant="additions text"
      className="pointer-events-none fixed inset-x-0 top-24 z-[100] flex flex-col items-center gap-2 px-4 sm:top-28"
    >
      {toasts.map((toast) => (
        <ToastBanner
          key={toast.id}
          id={`app-toast-${toast.id}`}
          message={toast.message}
          variant={toast.variant}
          onDismiss={() => onDismiss(toast.id)}
        />
      ))}
    </div>
  );
}

export function AppToastProvider({ children }: AppToastProviderProps) {
  const [toasts, setToasts] = useState<AppToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(
    (message: string, variant: AppToastVariant) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      setToasts((current) => {
        const next = [...current, { id, message, variant }];
        return next.slice(-MAX_VISIBLE_TOASTS);
      });

      window.setTimeout(() => {
        dismiss(id);
      }, TOAST_DURATION_MS);
    },
    [dismiss],
  );

  const success = useCallback(
    (message: string) => {
      push(message, 'success');
    },
    [push],
  );

  const error = useCallback(
    (message: string) => {
      push(message, 'error');
    },
    [push],
  );

  const value = useMemo(
    () => ({
      push,
      success,
      error,
      dismiss,
    }),
    [push, success, error, dismiss],
  );

  return (
    <AppToastContext.Provider value={value}>
      {children}
      <AppToastViewport toasts={toasts} onDismiss={dismiss} />
    </AppToastContext.Provider>
  );
}

export function useAppToast(): AppToastContextValue {
  const context = useContext(AppToastContext);

  if (!context) {
    throw new Error('useAppToast must be used within AppToastProvider');
  }

  return context;
}
