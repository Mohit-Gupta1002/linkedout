import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import Navigation from '@/components/Navigation';
import OnboardingModal from '@/components/OnboardingModal';

export const metadata: Metadata = {
  title: 'LinkedOut — Your work. Your people. Your real story.',
  description: 'The professional social network combining career credibility, visual stories, domain communities, and transparent workplace intelligence.',
  keywords: ['professional network', 'career', 'stories', 'communities', 'workplace intelligence', 'tech jobs india'],
  openGraph: {
    title: 'LinkedOut — Your work. Your people. Your real story.',
    description: 'A modern professional network combining LinkedIn trust, Instagram visual storytelling, Discord communities, and transparent workplace insights.',
    type: 'website',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      </head>
      <body>
        <Suspense fallback={<div style={{ height: '64px', background: 'var(--surface-card)' }} />}>
          <Navigation />
        </Suspense>
        <Suspense fallback={null}>
          <OnboardingModal />
        </Suspense>
        <Suspense fallback={<div className="app-container" style={{ padding: '2rem 1rem' }}>Loading...</div>}>
          <main>{children}</main>
        </Suspense>
      </body>
    </html>
  );
}
