'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CircleX, LoaderCircle, ShieldCheck } from 'lucide-react';
import { authClient } from '@/lib/auth/client';

type Status = 'working' | 'success' | 'error';

const COPY: Record<Status, { title: string; body: string }> = {
  working: { title: 'Verifying your email', body: 'Hang tight — this only takes a moment.' },
  success: { title: 'Email verified', body: 'Your account is active. You can now sign in and start shopping.' },
  error: { title: 'Verification failed', body: 'This link is invalid or has expired.' },
};

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<Status>('working');
  const [detail, setDetail] = useState<string | null>(null);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token') ?? '';
    if (!token) {
      queueMicrotask(() => {
        setStatus('error');
        setDetail('Missing verification token.');
      });
      return;
    }

    authClient
      .verifyEmail({ query: { token } })
      .then(({ error }) => {
        if (error) {
          setStatus('error');
          setDetail(error.message ?? null);
          return;
        }
        setStatus('success');
      })
      .catch(() => {
        setStatus('error');
        setDetail('Please try again.');
      });
  }, []);

  const Icon = status === 'success' ? ShieldCheck : status === 'error' ? CircleX : LoaderCircle;

  return (
    <div aria-live="polite">
      <div className={`mx-status-icon mx-status-icon--${status === 'error' ? 'error' : status}`}>
        <Icon size={30} className={status === 'working' ? 'mx-spin' : undefined} />
      </div>
      <h1 className="mx-title">{COPY[status].title}</h1>
      <p className="mx-subtitle">
        {COPY[status].body}
        {status === 'error' && detail ? ` ${detail}` : null}
      </p>
      {status !== 'working' ? (
        <Link href={status === 'success' ? '/auth/sign-in' : '/'} className="mx-btn">
          <span>{status === 'success' ? 'Continue to sign in' : 'Back to store'}</span>
        </Link>
      ) : null}
    </div>
  );
}
