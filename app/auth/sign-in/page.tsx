'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Lock, Mail } from 'lucide-react';
import { authClient } from '@/lib/auth/client';
import { AuthAlert, AuthField, SubmitButton, safeRedirect } from '@/components/auth/auth-ui';

export default function SignInPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('error') === 'unauthorized') {
        return 'Access restricted: Medixa team privileges are required to access the Admin Studio. Please sign in with an administrator or shop manager account.';
      }
    }
    return null;
  });
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const email = String(form.get('email')).trim();
    const password = String(form.get('password'));
    const rememberMe = form.get('remember') === 'on';

    try {
      const { error: signInError } = await authClient.signIn.email({ email, password, rememberMe });
      if (signInError) {
        setError(
          signInError.status === 401 || signInError.code === 'INVALID_EMAIL_OR_PASSWORD'
            ? 'Incorrect email or password. Please try again.'
            : signInError.status === 403
              ? 'Please verify your email address before signing in.'
              : (signInError.message ?? 'Could not sign you in.'),
        );
        return;
      }
      const redirectTo = new URLSearchParams(window.location.search).get('redirectTo');
      let destination = safeRedirect(redirectTo, '/');

      // Medixa team members should land in the admin studio by default instead
      // of being sent back to the storefront home page.
      if (destination === '/') {
        try {
          const meRes = await fetch('/api/user/me', { cache: 'no-store' });
          const me = (await meRes.json().catch(() => null)) as { user?: { role?: string } } | null;
          const role = String(me?.user?.role || '').toUpperCase();
          if (role === 'ADMIN' || role === 'EDITOR') destination = '/admin';
        } catch {
          // Fall back to the storefront if the role lookup fails.
        }
      }

      router.push(destination);
      router.refresh();
    } catch {
      setError('Something went wrong. Check your connection and try again.');
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <h1 className="mx-title">Welcome back</h1>
      <p className="mx-subtitle">Sign in to your Medixa account to manage orders, track deliveries and more.</p>

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

        <AuthField
          id="password"
          label="Password"
          icon={Lock}
          type="password"
          required
          autoComplete="current-password"
          placeholder="Enter your password"
          aside={
            <Link href="/auth/forgot-password" className="mx-link">
              Forgot password?
            </Link>
          }
        />

        <label className="mx-check">
          <input type="checkbox" name="remember" defaultChecked />
          Keep me signed in on this device
        </label>

        {error ? <AuthAlert>{error}</AuthAlert> : null}

        <SubmitButton pending={pending} pendingLabel="Signing in…">
          Sign in
        </SubmitButton>
      </form>

      <p className="mx-switch">
        New to Medixa? <Link href="/auth/sign-up">Create an account</Link>
      </p>
    </>
  );
}
