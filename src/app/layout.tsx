import type { Metadata } from 'next';
import { DM_Sans, Instrument_Serif, Itim } from 'next/font/google';
import localFont from 'next/font/local';

import { AppProviders } from '@/components/AppProviders';
import { getThemeBootstrapScript } from '@/components/theme-bootstrap';
import { getSiteSettings } from '@/features/home/lib/site-settings';

import './globals.css';

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
});

const instrumentSerif = Instrument_Serif({
  variable: '--font-instrument-serif',
  subsets: ['latin'],
  weight: '400',
});

const itim = Itim({
  variable: '--font-hand',
  subsets: ['latin'],
  weight: '400',
});

const mondwest = localFont({
  src: '../fonts/PPMondwest-Regular.otf',
  variable: '--font-mondwest',
  display: 'swap',
  weight: '400',
});

export const metadata: Metadata = {
  title: 'Akhila Anns Jacob | Electronics Engineer',
  description:
    'Portfolio of Akhila Anns Jacob — electronics engineer focused on embedded systems, circuit design, and signal processing.',
};

export default async function RootLayout({ children }: LayoutProps<'/'>) {
  const siteSettings = await getSiteSettings();
  const bootstrapScript = getThemeBootstrapScript(siteSettings.defaultTheme);

  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${instrumentSerif.variable} ${itim.variable} ${mondwest.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootstrapScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <AppProviders defaultTheme={siteSettings.defaultTheme}>{children}</AppProviders>
      </body>
    </html>
  );
}
