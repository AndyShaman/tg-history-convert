'use client';

import type { ConversionResult } from '@/types/telegram';
import { downloadBlob } from '@/lib/zip-creator';
import { sanitizeChatName } from '@/lib/telegram-parser';

interface ResultCardProps {
  result: ConversionResult;
  onReset: () => void;
}

export function ResultCard({ result, onReset }: ResultCardProps) {
  const handleDownload = () => {
    const filename = `${sanitizeChatName(result.chatName)}.zip`;
    downloadBlob(result.zipBlob, filename);
  };

  const formatNumber = (n: number): string => {
    return n.toLocaleString('ru-RU');
  };

  return (
    <div className="space-y-6">
      {/* Success header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[var(--success)]/10 border border-[var(--success)]/30 flex items-center justify-center text-3xl">
          ✓
        </div>
        <h2 className="text-xl font-bold text-[var(--foreground)]">
          Конвертация завершена
        </h2>
      </div>

      {/* Chat name */}
      <div className="text-center px-4 py-3 rounded-xl bg-[var(--card)] border border-[var(--border)]">
        <p className="font-medium text-[var(--foreground)] truncate">
          {result.chatName}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="stat-item">
          <div className="text-2xl font-bold text-[var(--accent)] font-mono">
            {formatNumber(result.totalMessages)}
          </div>
          <div className="text-xs text-[var(--muted)] mt-1">сообщений</div>
        </div>

        <div className="stat-item">
          <div className="text-2xl font-bold text-[var(--foreground)] font-mono">
            {formatNumber(result.skippedMessages)}
          </div>
          <div className="text-xs text-[var(--muted)] mt-1">пропущено</div>
        </div>

        <div className="stat-item">
          <div className="text-2xl font-bold text-[var(--success)] font-mono">
            {result.filesCreated}
          </div>
          <div className="text-xs text-[var(--muted)] mt-1">файлов .md</div>
        </div>

        <div className="stat-item">
          <div className="text-2xl font-bold text-[var(--foreground)] font-mono">
            {formatNumber(result.totalWords)}
          </div>
          <div className="text-xs text-[var(--muted)] mt-1">слов</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleDownload}
          className="flex-1 btn-accent py-3 flex items-center justify-center gap-2"
        >
          <span>📥</span>
          <span>Скачать ZIP</span>
        </button>

        <button
          onClick={onReset}
          className="flex-1 btn-secondary py-3 flex items-center justify-center gap-2"
        >
          <span>↻</span>
          <span>Ещё файл</span>
        </button>
      </div>
    </div>
  );
}
