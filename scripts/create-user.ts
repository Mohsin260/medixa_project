/**
 * Create a Medixa user in Neon Managed Auth (Better Auth).
 *
 * Usage:
 *   npm run auth:create-user -- --email admin@medixa.pk --password "S3cure!Pass" --name "Medixa Admin"
 *
 * Reads NEON_AUTH_BASE_URL from .env. Uses the same public sign-up endpoint as /auth/sign-up.
 */
import 'dotenv/config';

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : undefined;
}

async function main() {
  const baseUrl = process.env.NEON_AUTH_BASE_URL;
  if (!baseUrl) throw new Error('NEON_AUTH_BASE_URL is not set in .env');

  const email = arg('email');
  const password = arg('password');
  const name = arg('name') ?? email?.split('@')[0] ?? 'Medixa User';
  const origin = arg('origin') ?? 'http://localhost:3000';

  if (!email || !password) {
    throw new Error('Usage: --email <email> --password <password> [--name <name>] [--origin <url>]');
  }
  if (password.length < 8) throw new Error('Password must be at least 8 characters');

  const res = await fetch(`${baseUrl.replace(/\/$/, '')}/sign-up/email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: origin },
    body: JSON.stringify({ email, password, name }),
  });

  const body = (await res.json().catch(() => ({}))) as {
    user?: { id: string; email: string; emailVerified: boolean };
    token?: string | null;
    code?: string;
    message?: string;
  };

  if (!res.ok) {
    throw new Error(`Sign-up failed (${res.status}): ${body.code ?? ''} ${body.message ?? ''}`.trim());
  }

  console.log('✔ User created');
  console.log(`  id:             ${body.user?.id}`);
  console.log(`  email:          ${body.user?.email}`);
  console.log(`  email verified: ${body.user?.emailVerified}`);
  if (!body.token) console.log('  Note: email verification is required before this user can sign in.');
}

main().catch((err) => {
  console.error('✖', err instanceof Error ? err.message : err);
  process.exit(1);
});

