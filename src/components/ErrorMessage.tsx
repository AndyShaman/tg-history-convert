'use client';

interface ErrorMessageProps {
  message: string;
  onDismiss: () => void;
}

export function ErrorMessage({ message, onDismiss }: ErrorMessageProps) {
  return (
    <div className="error-box p-4 flex items-start gap-3">
      <span className="text-xl">⚠️</span>
      <p className="flex-1 text-[var(--error)] text-sm">{message}</p>
      <button
        onClick={onDismiss}
        className="text-[var(--error)] hover:text-[var(--foreground)] transition-colors text-lg leading-none"
      >
        ×
      </button>
    </div>
  );
}
