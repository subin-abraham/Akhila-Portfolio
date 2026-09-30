'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import type {
  AppLoaderContextValue,
  AppLoaderOverlayProps,
  AppLoaderProps,
  AppLoaderProviderProps,
  AppLoaderSize,
  AppLoaderVariant,
} from '@/types/components/app-loader';

const SIZE_PX: Record<AppLoaderSize, number> = {
  sm: 18,
  md: 40,
  lg: 72,
};

const DEFAULT_GLOBAL_LABEL = 'Working…';

const AppLoaderContext = createContext<AppLoaderContextValue | null>(null);

interface LoaderMarkProps {
  size: number;
  variant: AppLoaderVariant;
}

function ClusterMark({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className="app-loader-svg"
    >
      <g className="app-loader-cube app-loader-cube-a" stroke="currentColor" strokeWidth="1.25">
        <path d="M10 22 L18 17.5 L26 22 L18 26.5 Z" />
        <path d="M10 22 L18 26.5 L18 35.5 L10 31 Z" />
        <path d="M18 26.5 L26 22 L26 31 L18 35.5 Z" />
      </g>
      <g className="app-loader-cube app-loader-cube-b" stroke="currentColor" strokeWidth="1.25">
        <path d="M22 22 L30 17.5 L38 22 L30 26.5 Z" />
        <path d="M22 22 L30 26.5 L30 35.5 L22 31 Z" />
        <path d="M30 26.5 L38 22 L38 31 L30 35.5 Z" />
      </g>
      <g className="app-loader-cube app-loader-cube-c" stroke="currentColor" strokeWidth="1.25">
        <path d="M22 13 L30 8.5 L38 13 L30 17.5 Z" />
        <path d="M22 13 L30 17.5 L30 26.5 L22 22 Z" />
        <path d="M30 17.5 L38 13 L38 22 L30 26.5 Z" />
      </g>
    </svg>
  );
}

function StackMark({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 56"
      fill="none"
      aria-hidden="true"
      className="app-loader-svg"
    >
      <g className="app-loader-cube app-loader-cube-a" stroke="currentColor" strokeWidth="1.25">
        <path d="M8 40 L20 33.5 L32 40 L20 46.5 Z" />
        <path d="M8 40 L20 46.5 L20 53 L8 46.5 Z" />
        <path d="M20 46.5 L32 40 L32 46.5 L20 53 Z" />
      </g>
      <g className="app-loader-cube app-loader-cube-b" stroke="currentColor" strokeWidth="1.25">
        <path d="M8 27 L20 20.5 L32 27 L20 33.5 Z" />
        <path d="M8 27 L20 33.5 L20 40 L8 33.5 Z" />
        <path d="M20 33.5 L32 27 L32 33.5 L20 40 Z" />
      </g>
      <g className="app-loader-cube app-loader-cube-c" stroke="currentColor" strokeWidth="1.25">
        <path d="M8 14 L20 7.5 L32 14 L20 20.5 Z" />
        <path d="M8 14 L20 20.5 L20 27 L8 20.5 Z" />
        <path d="M20 20.5 L32 14 L32 20.5 L20 27 Z" />
      </g>
    </svg>
  );
}

function AssembleMark({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 44"
      fill="none"
      aria-hidden="true"
      className="app-loader-svg app-loader-assemble"
    >
      <g stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
        <path className="app-loader-edge app-loader-edge-1" d="M20 4 L36 13 L20 22 L4 13 Z" />
        <path className="app-loader-edge app-loader-edge-2" d="M4 13 L20 22 L20 40 L4 31 Z" />
        <path className="app-loader-edge app-loader-edge-3" d="M20 22 L36 13 L36 31 L20 40 Z" />
        <path className="app-loader-edge app-loader-edge-4" d="M20 4 L20 22" />
        <path className="app-loader-edge app-loader-edge-5" d="M4 13 L4 31" />
        <path className="app-loader-edge app-loader-edge-6" d="M36 13 L36 31" />
      </g>
    </svg>
  );
}

function LoaderMark({ size, variant }: LoaderMarkProps) {
  if (variant === 'stack') {
    return <StackMark size={size} />;
  }
  if (variant === 'assemble') {
    return <AssembleMark size={size} />;
  }
  return <ClusterMark size={size} />;
}

export function AppLoader({
  variant = 'cluster',
  size = 'sm',
  label,
  className = '',
}: AppLoaderProps) {
  const px = SIZE_PX[size];
  const isStatus = Boolean(label);
  const rootClassName = ['app-loader', `app-loader-${size}`, className]
    .filter(Boolean)
    .join(' ');

  return (
    <span
      role={isStatus ? 'status' : undefined}
      aria-live={isStatus ? 'polite' : undefined}
      aria-hidden={isStatus ? undefined : true}
      className={rootClassName}
    >
      <LoaderMark size={px} variant={variant} />
      {label ? <span className="app-loader-label">{label}</span> : null}
    </span>
  );
}

export function AppLoaderOverlay({
  label = DEFAULT_GLOBAL_LABEL,
  variant = 'stack',
  className = '',
}: AppLoaderOverlayProps) {
  const rootClassName = [
    'absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 rounded-[inherit] bg-home-bg/75 text-home-accent backdrop-blur-[2px]',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClassName} aria-busy="true">
      <AppLoader variant={variant} size="md" label={label} />
    </div>
  );
}

function AppLoaderGlobalViewport({
  label,
  variant,
}: {
  label: string;
  variant: AppLoaderVariant;
}) {
  return (
    <div
      className="pointer-events-auto fixed inset-0 z-[110] flex items-center justify-center bg-home-bg/70 text-home-accent backdrop-blur-[2px]"
      aria-busy="true"
    >
      <AppLoader
        variant={variant}
        size="lg"
        label={label}
        className="app-loader-global"
      />
    </div>
  );
}

export function AppLoaderProvider({
  children,
  variant = 'stack',
}: AppLoaderProviderProps) {
  const [pendingCount, setPendingCount] = useState(0);
  const [label, setLabel] = useState(DEFAULT_GLOBAL_LABEL);
  const labelStackRef = useRef<string[]>([]);

  const start = useCallback((nextLabel = DEFAULT_GLOBAL_LABEL) => {
    labelStackRef.current.push(nextLabel);
    setLabel(nextLabel);
    setPendingCount((count) => count + 1);
  }, []);

  const stop = useCallback(() => {
    labelStackRef.current.pop();
    const previous = labelStackRef.current[labelStackRef.current.length - 1];
    setLabel(previous ?? DEFAULT_GLOBAL_LABEL);
    setPendingCount((count) => Math.max(0, count - 1));
  }, []);

  const value = useMemo(
    () => ({
      isLoading: pendingCount > 0,
      label,
      start,
      stop,
    }),
    [pendingCount, label, start, stop],
  );

  return (
    <AppLoaderContext.Provider value={value}>
      {children}
      {pendingCount > 0 ? (
        <AppLoaderGlobalViewport label={label} variant={variant} />
      ) : null}
    </AppLoaderContext.Provider>
  );
}

export function useAppLoader(): AppLoaderContextValue {
  const context = useContext(AppLoaderContext);

  if (!context) {
    throw new Error('useAppLoader must be used within AppLoaderProvider');
  }

  return context;
}

export function useTrackPending(isPending: boolean, label = DEFAULT_GLOBAL_LABEL) {
  const context = useContext(AppLoaderContext);
  const wasPendingRef = useRef(false);
  const start = context?.start;
  const stop = context?.stop;

  useEffect(() => {
    if (!start || !stop) {
      return;
    }

    if (isPending && !wasPendingRef.current) {
      wasPendingRef.current = true;
      start(label);
      return;
    }

    if (!isPending && wasPendingRef.current) {
      wasPendingRef.current = false;
      stop();
    }
  }, [isPending, label, start, stop]);

  useEffect(() => {
    return () => {
      if (wasPendingRef.current && stop) {
        wasPendingRef.current = false;
        stop();
      }
    };
  }, [stop]);
}
