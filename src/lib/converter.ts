import type { TelegramExport, ConversionSettings, ConversionResult, ProcessingProgress } from '@/types/telegram';
import { validateTelegramExport, parseTelegramMessages, countMessages } from './telegram-parser';
import { chunkMessages, finalizeChunks } from './text-chunker';
import { createZipArchive } from './zip-creator';

export type ProgressCallback = (progress: ProcessingProgress) => void;

/**
 * Main conversion function - orchestrates the entire process
 */
export async function convertTelegramExport(
  fileContent: string,
  settings: ConversionSettings,
  onProgress?: ProgressCallback
): Promise<ConversionResult> {
  // Stage 1: Parse JSON
  onProgress?.({
    stage: 'parsing',
    percent: 10,
    message: 'Разбор JSON файла...'
  });

  let data: TelegramExport;
  try {
    data = JSON.parse(fileContent);
  } catch {
    throw new Error('Файл повреждён или имеет неверный формат JSON');
  }

  // Validate structure
  if (!validateTelegramExport(data)) {
    throw new Error('Это не похоже на экспорт из Telegram. Убедитесь, что вы экспортировали чат через Telegram Desktop');
  }

  const { total, skipped } = countMessages(data);

  if (total === 0 || total === skipped) {
    throw new Error('В файле не найдено сообщений');
  }

  // Stage 2: Parse messages
  onProgress?.({
    stage: 'formatting',
    percent: 30,
    message: 'Обработка сообщений...'
  });

  const messages = parseTelegramMessages(data);

  // Stage 3: Chunk messages
  onProgress?.({
    stage: 'chunking',
    percent: 50,
    message: 'Разбивка на файлы...'
  });

  const { chunks, totalWords } = chunkMessages(messages, settings);
  const finalFiles = finalizeChunks(chunks, data.name);

  // Stage 4: Create ZIP
  onProgress?.({
    stage: 'zipping',
    percent: 70,
    message: 'Создание ZIP архива...'
  });

  const zipBlob = await createZipArchive(finalFiles, data.name);

  // Done
  onProgress?.({
    stage: 'done',
    percent: 100,
    message: 'Готово!'
  });

  return {
    chatName: data.name,
    totalMessages: total,
    skippedMessages: skipped,
    filesCreated: finalFiles.length,
    totalWords,
    zipBlob
  };
}
