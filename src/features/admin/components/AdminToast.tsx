'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import type {
  AdminToastContextValue,
  AdminToastItem,
  AdminToastProviderProps,
  AdminToastVariant,
  AdminToastViewportProps,
} from '@/types/components/admin-toast';

const TOAST_DURATION_MS = 4000;
const MAX_VISIBLE_TOASTS = 3;

const AdminToastContext = createContext<AdminToastContextValue | null>(null);

function ToastIcon({ variant }: { variant: AdminToastVariant }) {
  if (variant === 'success') {
    return (
      <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5 shrink-0" fill="none">
        <circle cx="10" cy="10" r="8.25" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M6.5 10.2 8.8 12.5 13.5 7.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5 shrink-0" fill="none">
      <circle cx="10" cy="10" r="8.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 6.5v4.5M10 13.5h.01"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function AdminToastViewport({ toasts, onDismiss }: AdminToastViewportProps) {
  return (
    <div
      aria-live="polite"
      aria-relevant="additions text"
      className="pointer-events-none fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-2 px-4"
    >
      {toasts.map((toast) => {
        const isError = toast.variant === 'error';

        return (
          <div
            key={toast.id}
            role={isError ? 'alert' : 'status'}
            className={`pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-md transition ${
              isError
                ? 'border-red-400/30 bg-[#1a1212]/95 text-red-200'
                : 'border-home-accent/30 bg-[#141914]/95 text-home-accent'
            }`}
          >
            <span className={isError ? 'text-red-300' : 'text-home-accent'}>
              <ToastIcon variant={toast.variant} />
            </span>
            <p className="flex-1 pt-0.5 text-sm font-medium text-white">{toast.message}</p>
            <button
              id={`admin-toast-dismiss-${toast.id}`}
              type="button"
              title="Dismiss notification"
              aria-label="Dismiss notification"
              onClick={() => onDismiss(toast.id)}
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-home-muted transition hover:bg-white/5 hover:text-white"
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
          </div>
        );
      })}
    </div>
  );
}

export function AdminToastProvider({ children }: AdminToastProviderProps) {
  const [toasts, setToasts] = useState<AdminToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(
    (message: string, variant: AdminToastVariant) => {
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
    <AdminToastContext.Provider value={value}>
      {children}
      <AdminToastViewport toasts={toasts} onDismiss={dismiss} />
    </AdminToastContext.Provider>
  );
}

export function useAdminToast(): AdminToastContextValue {
  const context = useContext(AdminToastContext);

  if (!context) {
    throw new Error('useAdminToast must be used within AdminToastProvider');
  }

  return context;
}
