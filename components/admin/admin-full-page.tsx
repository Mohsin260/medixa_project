'use client';

import type { ReactNode } from 'react';
import { ArrowLeft, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminFullPageProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  onClose?: () => void;
  onToggleSidebar?: () => void;
  backLabel?: string;
  children: ReactNode;
}

/**
 * Full-workspace view used by every admin module form. It intentionally
 * replaces the module content instead of opening a modal dialog, so editors
 * get a real page they can scroll and use without losing context.
 */
export function AdminFullPage({
  title,
  subtitle,
  icon,
  onClose,
  onToggleSidebar,
  backLabel = 'Back',
  children,
}: AdminFullPageProps) {
  return (
    <div className="-m-5 min-h-[calc(100vh-70px)] bg-[#f6f8fa] sm:-m-8">
      <div className="sticky top-[70px] z-20 border-b border-[#e4eaf0] bg-white/95 px-4 py-3.5 backdrop-blur sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={onToggleSidebar}
              className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-[#e0e6ed] bg-[#fafcfd] text-[#61707e] transition hover:bg-[#f0f4f8] hover:text-[#131b2e]"
              aria-label="Show navigation sidebar"
              title="Show sidebar"
            >
              <Menu size={18} />
            </button>

            {icon ? (
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#e9ecf4] text-[#052263]">
                {icon}
              </div>
            ) : null}

            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold tracking-tight text-[#131b2e]">{title}</h1>
              {subtitle ? <p className="truncate text-xs text-[#7e8a96]">{subtitle}</p> : null}
            </div>
          </div>

          {onClose ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="border-[#dde5ec] text-[#556371]"
            >
              <ArrowLeft size={14} />
              {backLabel}
            </Button>
          ) : null}
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1180px] p-4 sm:p-8">{children}</div>
    </div>
  );
}
