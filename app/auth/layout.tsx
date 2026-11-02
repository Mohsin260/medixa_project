import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowLeft, BadgeCheck, ShieldCheck, Truck } from 'lucide-react';
import './auth.css';

export const metadata: Metadata = {
  title: 'Account',
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <link rel="stylesheet" href="/css/montserrat.css" precedence="auth" />
      <link rel="stylesheet" href="/css/raleway.css" precedence="auth" />

      <div className="mx-auth">
        <aside className="mx-auth__aside" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="mx-auth__photo" src="/img/real-product-images/Forte/Forte-Naval-1.webp" alt="" />
          <div className="mx-auth__aside-inner">
            <Link href="/" className="mx-auth__pill" tabIndex={-1}>
              <ArrowLeft size={14} strokeWidth={2.5} />
              Back to store
            </Link>

            <div>
              <span className="mx-auth__eyebrow">Medixa · Premium Scrubs</span>
              <h2 className="mx-auth__headline">Crafted for the people who care for everyone else.</h2>
              <p className="mx-auth__lede">
                Breathable, tailored scrubs for doctors, nurses and healthcare professionals across Pakistan.
              </p>
              <ul className="mx-auth__perks">
                <li>
                  <Truck size={16} /> Nationwide delivery
                </li>
                <li>
                  <BadgeCheck size={16} /> Premium fabric
                </li>
                <li>
                  <ShieldCheck size={16} /> Secure checkout
                </li>
              </ul>
            </div>
          </div>
        </aside>

        <main className="mx-auth__main">
          <header className="mx-auth__top">
            <Link href="/" className="mx-auth__logo" aria-label="Medixa home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/logo.png" alt="Medixa" />
            </Link>
            <p className="mx-auth__help">
              <span>Need help? </span>
              <a href="mailto:support@medixa.pk">Contact support</a>
            </p>
          </header>

          <div className="mx-auth__center">
            <div className="mx-auth__card">{children}</div>
          </div>

          <footer className="mx-auth__foot">
            <span>© 2026 Medixa.pk. All rights reserved.</span>
            <span>
              <Link href="/">Privacy</Link> · <Link href="/">Terms</Link>
            </span>
          </footer>
        </main>
      </div>
    </>
  );
}
