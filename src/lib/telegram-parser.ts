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
 * Transliterate Cyrillic to Latin
 */
function transliterate(text: string): string {
  const map: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '',
    'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
    'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo',
    'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M',
    'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
    'Ф': 'F', 'Х': 'H', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sch', 'Ъ': '',
    'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya'
  };
  return text.split('').map(char => map[char] || char).join('');
}

/**
 * Sanitizes chat name for use in filenames
 */
export function sanitizeChatName(name: string): string {
  return transliterate(name)
    .replace(/[<>:"/\\|?*#]/g, '_')
    .replace(/[^\x00-\x7F]/g, '') // Remove any remaining non-ASCII
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .substring(0, 50);
}
