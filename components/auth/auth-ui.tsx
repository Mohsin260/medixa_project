'use client';

import { useState, type ComponentType, type InputHTMLAttributes, type ReactNode } from 'react';
import { CircleAlert, CircleCheck, Eye, EyeOff, type LucideProps } from 'lucide-react';

type FieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> & {
  id: string;
  label: string;
  icon: ComponentType<LucideProps>;
  /** Optional element rendered on the right side of the label row (e.g. "Forgot password?"). */
  aside?: ReactNode;
  /** Optional content rendered under the input (hints, strength meter). */
  footer?: ReactNode;
};

export function AuthField({ id, label, icon: Icon, aside, footer, type = 'text', className, ...rest }: FieldProps) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="mx-field">
      <div className="mx-label-row">
        <label htmlFor={id} className="mx-label">
          {label}
        </label>
        {aside}
      </div>
      <div className="mx-control">
        <Icon className="mx-control__icon" size={18} strokeWidth={1.9} aria-hidden="true" />
        <input
          id={id}
          name={rest.name ?? id}
          type={isPassword && visible ? 'text' : type}
          className={`mx-input${isPassword ? ' mx-input--with-toggle' : ''}${className ? ` ${className}` : ''}`}
          {...rest}
        />
        {isPassword ? (
          <button
            type="button"
            className="mx-toggle"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Hide password' : 'Show password'}
            aria-pressed={visible}
          >
            {visible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        ) : null}
      </div>
      {footer}
    </div>
  );
}

export function AuthAlert({ tone = 'error', children }: { tone?: 'error' | 'success'; children: ReactNode }) {
  const Icon = tone === 'error' ? CircleAlert : CircleCheck;
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={`mx-alert mx-alert--${tone}`}>
      <Icon size={18} aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}

export function SubmitButton({ pending, children, pendingLabel }: { pending: boolean; children: ReactNode; pendingLabel: string }) {
  return (
    <button type="submit" className="mx-btn" disabled={pending} aria-busy={pending}>
      {pending ? (
        <>
          <span className="mx-spinner" aria-hidden="true" />
          <span>{pendingLabel}</span>
        </>
      ) : (
        <span>{children}</span>
      )}
    </button>
  );
}

/** 0–4 score: length, mixed case, digit, symbol. */
export function passwordScore(value: string): number {
  if (!value) return 0;
  let score = 0;
  if (value.length >= 8) score++;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++;
  if (/\d/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;
  return Math.max(1, score);
}

const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong'];

export function StrengthMeter({ value }: { value: string }) {
  const score = passwordScore(value);
  return (
    <>
      <div className="mx-strength" data-score={score} aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
      <span className="mx-hint" aria-live="polite">
        {value ? `Password strength: ${STRENGTH_LABELS[score]}` : 'Use 8+ characters with a mix of letters, numbers & symbols.'}
      </span>
    </>
  );
}

/** Only allow same-origin relative redirects (blocks `//evil.com`). */
export function safeRedirect(target: string | null, fallback: string): string {
  if (!target || !target.startsWith('/') || target.startsWith('//') || target.startsWith('/\\')) return fallback;
  return target;
}

