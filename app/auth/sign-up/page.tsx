'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Lock, Mail, MailCheck, User } from 'lucide-react';
import { authClient } from '@/lib/auth/client';
import { AuthAlert, AuthField, StrengthMeter, SubmitButton } from '@/components/auth/auth-ui';

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [password, setPassword] = useState('');
  const [verifyEmail, setVerifyEmail] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = new FormData(event.currentTarget);
    const firstName = String(form.get('firstName')).trim();
    const lastName = String(form.get('lastName')).trim();
    const email = String(form.get('email')).trim();
    const confirm = String(form.get('confirm'));

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (form.get('terms') !== 'on') {
      setError('Please accept the terms to continue.');
      return;
    }

    setPending(true);
    try {
      const { data, error: signUpError } = await authClient.signUp.email({
        email,
        password,
        name: `${firstName} ${lastName}`.trim(),
      });
      if (signUpError) {
        setError(
          signUpError.code === 'USER_ALREADY_EXISTS' || signUpError.status === 422
            ? 'An account with this email already exists. Try signing in instead.'
            : (signUpError.message ?? 'Could not create your account.'),
        );
        return;
      }
      // When "Verify email at signup" is on, no session token is issued.
      if (!data?.token) {
        setVerifyEmail(email);
        return;
      }
      router.push('/');
      router.refresh();
    } catch {
      setError('Something went wrong. Check your connection and try again.');
    } finally {
      setPending(false);
    }
  }

  if (verifyEmail) {
    return (
      <>
        <div className="mx-status-icon mx-status-icon--success">
          <MailCheck size={30} />
        </div>
        <h1 className="mx-title">Check your inbox</h1>
        <p className="mx-subtitle">
          We sent a verification link to <strong>{verifyEmail}</strong>. Open it to activate your account.
        </p>
        <Link href="/auth/sign-in" className="mx-btn">
          <span>Continue to sign in</span>
        </Link>
      </>
    );
  }

  return (
    <>
      <h1 className="mx-title">Create your account</h1>
      <p className="mx-subtitle">Join Medixa for faster checkout, order tracking and member-only offers.</p>

      <form onSubmit={onSubmit} className="mx-form">
        <div className="mx-row-2">
          <AuthField
            id="firstName"
            label="First name"
            icon={User}
            required
            autoComplete="given-name"
            placeholder="Ayesha"
            autoFocus
          />
          <AuthField id="lastName" label="Last name" icon={User} autoComplete="family-name" placeholder="Khan" />
        </div>

        <AuthField
          id="email"
          label="Email address"
          icon={Mail}
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
        />

        <AuthField
          id="password"
          label="Password"
          icon={Lock}
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          footer={<StrengthMeter value={password} />}
        />

        <AuthField
          id="confirm"
          label="Confirm password"
          icon={Lock}
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="Repeat your password"
        />

        <label className="mx-check">
          <input type="checkbox" name="terms" required />
          <span>
            I agree to Medixa&apos;s <Link href="/">Terms of Service</Link> and <Link href="/">Privacy Policy</Link>.
          </span>
        </label>

        {error ? <AuthAlert>{error}</AuthAlert> : null}

        <SubmitButton pending={pending} pendingLabel="Creating account…">
          Create account
        </SubmitButton>
      </form>

      <p className="mx-switch">
        Already have an account? <Link href="/auth/sign-in">Sign in</Link>
      </p>
    </>
  );
}
