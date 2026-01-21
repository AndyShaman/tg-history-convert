'use client';

import { useCallback, useState } from 'react';

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export function FileDropzone({ onFileSelect, disabled }: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.json')) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect, disabled]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`dropzone p-8 text-center ${isDragging ? 'dragging' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <input
        type="file"
        accept=".json"
        onChange={handleFileInput}
        disabled={disabled}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />

      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-3xl">
          {selectedFile ? '✓' : '📁'}
        </div>

        {selectedFile ? (
          <div className="space-y-1">
            <p className="font-semibold text-[var(--foreground)]">
              {selectedFile.name}
            </p>
            <p className="text-sm text-[var(--muted)] font-mono">
              {formatFileSize(selectedFile.size)}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <p className="text-[var(--foreground)]">
                Перетащите <span className="code-tag">result.json</span> сюда
              </p>
              <p className="text-sm text-[var(--muted)]">
                или нажмите для выбора файла
              </p>
            </div>
            <p className="text-xs text-[var(--muted)] opacity-60">
              Telegram Desktop → Экспорт чата → JSON
            </p>
          </>
        )}
      </div>
    </div>
  );
}
