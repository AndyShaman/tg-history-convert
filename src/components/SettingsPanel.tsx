'use client';

import type { ConversionSettings } from '@/types/telegram';

interface SettingsPanelProps {
  settings: ConversionSettings;
  onChange: (settings: ConversionSettings) => void;
  disabled?: boolean;
}

export function SettingsPanel({ settings, onChange, disabled }: SettingsPanelProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
        <span>⚙️</span>
        <span>Настройки</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Word limit */}
        <div className="space-y-2">
          <label className="block text-sm text-[var(--muted)]">
            Слов в файле
          </label>
          <input
            type="number"
            min={1000}
            max={5000}
            step={500}
            value={settings.wordLimit}
            onChange={(e) => onChange({ ...settings, wordLimit: Number(e.target.value) })}
            disabled={disabled}
            className="w-full px-4 py-3 input-field disabled:opacity-50"
          />
        </div>

        {/* Date format */}
        <div className="space-y-2">
          <label className="block text-sm text-[var(--muted)]">
            Формат даты
          </label>
          <select
            value={settings.dateFormat}
            onChange={(e) => onChange({ ...settings, dateFormat: e.target.value as ConversionSettings['dateFormat'] })}
            disabled={disabled}
            className="w-full px-4 py-3 input-field disabled:opacity-50"
          >
            <option value="DD.MM.YYYY">14.02.2020</option>
            <option value="YYYY-MM-DD">2020-02-14</option>
          </select>
        </div>
      </div>

      {/* Checkboxes */}
      <div className="flex flex-wrap gap-6 pt-2">
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={settings.includeTimestamp}
            onChange={(e) => onChange({ ...settings, includeTimestamp: e.target.checked })}
            disabled={disabled}
            className="checkbox-custom"
          />
          <span className="text-sm text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
            Дата и время
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={settings.includeAuthor}
            onChange={(e) => onChange({ ...settings, includeAuthor: e.target.checked })}
            disabled={disabled}
            className="checkbox-custom"
          />
          <span className="text-sm text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
            Имя автора
          </span>
        </label>
      </div>
    </div>
  );
}
