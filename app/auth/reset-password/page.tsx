'use client';

import Link from 'next/link';
import { useEffect, useState, type FormEvent } from 'react';
import { CircleX, Lock, ShieldCheck } from 'lucide-react';
import { authClient } from '@/lib/auth/client';
import { AuthAlert, AuthField, StrengthMeter, SubmitButton } from '@/components/auth/auth-ui';

export default function ResetPasswordPage() {
  const [token, setToken] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    queueMicrotask(() => {
      setToken(params.get('token'));
      if (params.get('error')) setError('This reset link is invalid or has expired.');
      setChecked(true);
    });
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) {
      setError('Missing or invalid reset token.');
      return;
    }
    const confirm = String(new FormData(event.currentTarget).get('confirm'));
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setPending(true);
    setError(null);
    try {
      const { error: resetError } = await authClient.resetPassword({ token, newPassword: password });
      if (resetError) {
        setError(resetError.message ?? 'Could not reset password.');
        return;
      }
      setDone(true);
    } catch {
      setError('Could not reset password. Please try again.');
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <>
        <div className="mx-status-icon mx-status-icon--success">
          <ShieldCheck size={30} />
        </div>
        <h1 className="mx-title">Password updated</h1>
        <p className="mx-subtitle">Your password has been changed. Sign in with your new password to continue.</p>
        <Link href="/auth/sign-in" className="mx-btn">
          <span>Go to sign in</span>
        </Link>
      </>
    );
  }

  if (checked && !token) {
    return (
      <>
        <div className="mx-status-icon">
          <CircleX size={30} />
        </div>
        <h1 className="mx-title">Link invalid or expired</h1>
        <p className="mx-subtitle">This reset link is missing a token or is no longer valid. Request a fresh one below.</p>
        <Link href="/auth/forgot-password" className="mx-btn">
          <span>Request new link</span>
        </Link>
      </>
    );
  }

  return (
    <>
      <h1 className="mx-title">Set a new password</h1>
      <p className="mx-subtitle">Choose a strong password you haven&apos;t used before.</p>

      <form onSubmit={onSubmit} className="mx-form">
        <AuthField
          id="password"
          label="New password"
          icon={Lock}
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="Create a new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          footer={<StrengthMeter value={password} />}
          autoFocus
        />

        <AuthField
          id="confirm"
          label="Confirm new password"
          icon={Lock}
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="Repeat your new password"
        />

        {error ? <AuthAlert>{error}</AuthAlert> : null}

        <SubmitButton pending={pending} pendingLabel="Updating…">
          Update password
        </SubmitButton>
      </form>

      <p className="mx-switch">
        Remembered it? <Link href="/auth/sign-in">Sign in</Link>
      </p>
    </>
  );
}
