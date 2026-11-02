import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import Providers from './providers';

export const metadata: Metadata = {
  title: {
    default: 'Medixa — Premium Medical Scrubs in Pakistan',
    template: '%s | Medixa',
  },
  description:
    'Medixa — premium medical scrub suits for doctors, nurses, and healthcare professionals in Pakistan. Shop male, female, and unisex scrubs with nationwide delivery.',
  metadataBase: new URL('https://medixa.pk'),
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  interactiveWidget: 'resizes-content',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body data-spy="scroll" data-target="#scroll-menu" data-offset="100">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
