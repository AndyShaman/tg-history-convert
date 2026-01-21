import type { TelegramExport, TelegramMessage, TelegramTextEntity, ParsedMessage } from '@/types/telegram';

/**
 * Validates that the file is a Telegram export
 */
export function validateTelegramExport(data: unknown): data is TelegramExport {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;

  return (
    typeof obj.name === 'string' &&
    Array.isArray(obj.messages) &&
    obj.messages.length > 0
  );
}

/**
 * Extracts text from message text field (handles both string and array formats)
 */
function extractText(text: string | TelegramTextEntity[]): string {
  if (typeof text === 'string') {
    return text;
  }

  if (Array.isArray(text)) {
    return text.map(entity => entity.text || '').join('');
  }

  return '';
}

/**
 * Parses Telegram export JSON and returns cleaned messages
 */
export function parseTelegramMessages(data: TelegramExport): ParsedMessage[] {
  const messages: ParsedMessage[] = [];

  for (const msg of data.messages) {
    // Skip service messages
    if (msg.type !== 'message') continue;

    // Extract text
    const text = extractText(msg.text).trim();

    // Skip empty messages or media-only messages
    if (!text) continue;

    // Parse date
    const date = new Date(msg.date);

    // Get author (fallback to "Аноним" if null)
    const author = msg.from || 'Аноним';

    messages.push({
      author,
      date,
      text,
    });
  }

  return messages;
}

/**
 * Counts total messages and skipped messages
 */
export function countMessages(data: TelegramExport): { total: number; skipped: number } {
  let total = 0;
  let skipped = 0;

  for (const msg of data.messages) {
    if (msg.type === 'message') {
      total++;
      const text = extractText(msg.text).trim();
      if (!text) skipped++;
    } else {
      skipped++;
    }
  }

  return { total: data.messages.length, skipped };
}

/**
 * Sanitizes chat name for use in filenames
 */
export function sanitizeChatName(name: string): string {
  return name
    .replace(/[<>:"/\\|?*#]/g, '_')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .substring(0, 50);
}
