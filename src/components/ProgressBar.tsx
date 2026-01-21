'use client';

import type { ProcessingProgress } from '@/types/telegram';

interface ProgressBarProps {
  progress: ProcessingProgress;
}

export function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm text-[var(--foreground)]">{progress.message}</span>
        <span className="text-sm font-mono text-[var(--accent)]">{progress.percent}%</span>
      </div>
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${progress.percent}%` }}
        />
      </div>
    </div>
  );
}
