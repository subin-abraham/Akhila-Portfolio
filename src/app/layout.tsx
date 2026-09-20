import type { Metadata } from 'next';
import { Outfit, Syne } from 'next/font/google';

import { AppProviders } from '@/components/AppProviders';

import './globals.css';

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
});

const syne = Syne({
  variable: '--font-syne',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Akhila Anns Jacob | Electronics Engineer',
  description:
    'Portfolio of Akhila Anns Jacob — electronics engineer focused on embedded systems, circuit design, and signal processing.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${syne.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
