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
          <select
            value={settings.wordLimit}
            onChange={(e) => onChange({ ...settings, wordLimit: Number(e.target.value) })}
            disabled={disabled}
            className="w-full px-4 py-3 input-field disabled:opacity-50"
          >
            <option value={50000}>50 000</option>
            <option value={100000}>100 000</option>
            <option value={150000}>150 000</option>
            <option value={200000}>200 000</option>
            <option value={250000}>250 000</option>
            <option value={300000}>300 000</option>
            <option value={350000}>350 000</option>
            <option value={400000}>400 000</option>
            <option value={450000}>450 000</option>
            <option value={500000}>500 000</option>
          </select>
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
