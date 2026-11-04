import { Analytics } from '@vercel/analytics/next';
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { requireStaff } from '@/lib/auth/require-admin';
import './admin.css';

export const instant = false;

export const metadata: Metadata = {
  title: 'Medixa Admin Studio',
  description: 'Centralized product, blog, media, and user management for medixa.pk.',
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
};

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f6f8fa',
  userScalable: false,
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const authCheck = await requireStaff();

  if (!authCheck.authorized) {
    if (authCheck.status === 401) {
      redirect('/auth/sign-in?redirectTo=/admin');
    }
    // If signed in but not a Medixa team member (e.g. regular customer)
    redirect('/auth/sign-in?error=unauthorized');
  }

  return (
    <div id="admin-root">
      {children}
      {process.env.NODE_ENV === 'production' ? <Analytics /> : null}
    </div>
  );
}
