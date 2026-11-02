'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { ArrowLeft, KeyRound, Mail, MailCheck } from 'lucide-react';
import { authClient } from '@/lib/auth/client';
import { AuthAlert, AuthField, SubmitButton } from '@/components/auth/auth-ui';

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const email = String(form.get('email')).trim();

    try {
      const { error: resetError } = await authClient.requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (resetError) {
        setError(resetError.message ?? 'Could not send reset email.');
        return;
      }
      setSentTo(email);
    } catch {
      setError('Could not send reset email. Please try again.');
    } finally {
      setPending(false);
    }
  }

  if (sentTo) {
    return (
      <>
        <div className="mx-status-icon mx-status-icon--success">
          <MailCheck size={30} />
        </div>
        <h1 className="mx-title">Check your email</h1>
        <p className="mx-subtitle">
          If an account exists for <strong>{sentTo}</strong>, a password reset link is on its way. It may take a minute
          to arrive — don&apos;t forget to check spam.
        </p>
        <div className="mx-stack">
          <Link href="/auth/sign-in" className="mx-btn">
            <span>Back to sign in</span>
          </Link>
          <button type="button" className="mx-btn mx-btn--ghost" onClick={() => setSentTo(null)}>
            <span>Use a different email</span>
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mx-status-icon">
        <KeyRound size={28} />
      </div>
      <h1 className="mx-title">Forgot your password?</h1>
      <p className="mx-subtitle">No worries. Enter the email linked to your account and we&apos;ll send you a reset link.</p>

      <form onSubmit={onSubmit} className="mx-form">
        <AuthField
          id="email"
          label="Email address"
          icon={Mail}
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          autoFocus
        />

        {error ? <AuthAlert>{error}</AuthAlert> : null}

        <SubmitButton pending={pending} pendingLabel="Sending link…">
          Send reset link
        </SubmitButton>
      </form>

      <p className="mx-switch">
        <Link href="/auth/sign-in">
          <ArrowLeft size={14} style={{ verticalAlign: '-2px', marginRight: 6 }} />
          Back to sign in
        </Link>
      </p>
    </>
  );
}
