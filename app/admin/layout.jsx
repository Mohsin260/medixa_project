import { Analytics } from '@vercel/analytics/next';
import './admin.css';

export const metadata = {
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

export const viewport = {
  colorScheme: 'light',
  themeColor: '#f6f8f7',
  userScalable: false,
};

export default function AdminLayout({ children }) {
  return (
    <div id="admin-root">
      {children}
      {process.env.NODE_ENV === 'production' ? <Analytics /> : null}
    </div>
  );
}
