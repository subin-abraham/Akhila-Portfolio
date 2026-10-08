'use client';

import { AppLoader } from '@/components/AppLoader';

export function SiteRouteLoader() {
  return (
    <div className="site-route-loader" role="status" aria-live="polite" aria-busy="true">
      <div className="site-route-loader-orbit" aria-hidden="true">
        <span className="site-route-loader-ring site-route-loader-ring-a" />
        <span className="site-route-loader-ring site-route-loader-ring-b" />
        <span className="site-route-loader-glow" />
      </div>
      <AppLoader
        variant="assemble"
        size="lg"
        label="Loading…"
        className="app-loader-route"
      />
    </div>
  );
}
