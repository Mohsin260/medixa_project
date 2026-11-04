'use client';

import { useState, type FormEvent } from 'react';
import { CircleAlert, CircleCheck, Eye, EyeOff, KeyRound, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminFullPage } from '@/components/admin/admin-full-page';

interface ChangePasswordPageProps {
  onClose: () => void;
  onToggleSidebar?: () => void;
  onSuccess?: (message: string) => void;
}

export function ChangePasswordPage({ onClose, onToggleSidebar, onSuccess }: ChangePasswordPageProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [revokeSessions, setRevokeSessions] = useState(true);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const score = calculateStrength(newPassword);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!currentPassword) {
      setError('Please enter your current password.');
      return;
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          revokeOtherSessions: revokeSessions,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || 'Failed to change password.');
        return;
      }

      setSuccess(true);
      if (onSuccess) {
        onSuccess('Password changed successfully.');
      }
      setTimeout(() => {
        onClose();
        resetForm();
      }, 1400);
    } catch {
      setError('An error occurred. Check your network connection.');
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError(null);
    setSuccess(false);
  }

  return (
    <AdminFullPage
      title="Change Password"
      subtitle="Update your studio account password"
      icon={<KeyRound size={20} />}
      onClose={onClose}
      onToggleSidebar={onToggleSidebar}
      backLabel="Back to dashboard"
    >
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-xl space-y-4 rounded-2xl border border-[#dde5ec] bg-white p-5 shadow-[0_4px_18px_rgba(19,27,46,0.04)] sm:p-6"
      >
          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
              <CircleAlert size={16} className="mt-0.5 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-800">
              <CircleCheck size={16} className="shrink-0 text-emerald-600" />
              <span>Password updated successfully!</span>
            </div>
          )}

          {/* Current Password */}
          <div>
            <label className="block text-xs font-semibold text-[#293447] mb-1.5">Current Password</label>
            <div className="relative flex items-center">
              <Lock size={16} className="absolute left-3 text-[#99a5af]" />
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                required
                className="h-10 w-full rounded-xl border border-[#dbe4eb] bg-[#fafcfd] pl-9 pr-10 text-xs text-[#1d2739] outline-none transition focus:border-[#052263] focus:bg-white focus:ring-2 focus:ring-[#052263]/15"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-2.5 text-[#99a5af] hover:text-[#32405b]"
              >
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-xs font-semibold text-[#293447] mb-1.5">New Password</label>
            <div className="relative flex items-center">
              <Lock size={16} className="absolute left-3 text-[#99a5af]" />
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                required
                minLength={8}
                className="h-10 w-full rounded-xl border border-[#dbe4eb] bg-[#fafcfd] pl-9 pr-10 text-xs text-[#1d2739] outline-none transition focus:border-[#052263] focus:bg-white focus:ring-2 focus:ring-[#052263]/15"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-2.5 text-[#99a5af] hover:text-[#32405b]"
              >
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {/* Strength meter */}
            {newPassword && (
              <div className="mt-2 space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        step <= score
                          ? score === 1
                            ? 'bg-rose-500'
                            : score === 2
                              ? 'bg-amber-500'
                              : score === 3
                                ? 'bg-emerald-500'
                                : 'bg-emerald-600'
                          : 'bg-[#e3e7f0]'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-[10px] text-[#788a83]">
                  Strength: {['', 'Weak', 'Fair', 'Good', 'Strong'][score]}
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold text-[#293447] mb-1.5">Confirm New Password</label>
            <div className="relative flex items-center">
              <Lock size={16} className="absolute left-3 text-[#99a5af]" />
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type new password"
                required
                minLength={8}
                className="h-10 w-full rounded-xl border border-[#dbe4eb] bg-[#fafcfd] pl-9 pr-10 text-xs text-[#1d2739] outline-none transition focus:border-[#052263] focus:bg-white focus:ring-2 focus:ring-[#052263]/15"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-2.5 text-[#99a5af] hover:text-[#32405b]"
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Revoke Sessions Option */}
          <label className="flex items-center gap-2 pt-1 text-xs text-[#5f746d] cursor-pointer">
            <input
              type="checkbox"
              checked={revokeSessions}
              onChange={(e) => setRevokeSessions(e.target.checked)}
              className="size-4 rounded border-[#c7d5ce] text-[#052263] accent-[#052263]"
            />
            <span>Log out from all other active devices</span>
          </label>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#edf1f5]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={loading}
              onClick={onClose}
              className="border-[#dde5ec] text-[#556371]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={loading || success}
              className="bg-[#052263] text-white hover:bg-[#031849]"
            >
              {loading ? 'Updating…' : 'Update Password'}
            </Button>
          </div>
        </form>
    </AdminFullPage>
  );
}

function calculateStrength(val: string): number {
  if (!val) return 0;
  let score = 0;
  if (val.length >= 8) score++;
  if (/[a-z]/.test(val) && /[A-Z]/.test(val)) score++;
  if (/\d/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  return Math.max(1, score);
}

