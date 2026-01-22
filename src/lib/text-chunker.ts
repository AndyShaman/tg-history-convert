import type { ParsedMessage, ConversionSettings, TelegramReaction, TelegramPoll } from '@/types/telegram';

/**
 * Formats a date according to settings
 */
function formatDate(date: Date, format: 'DD.MM.YYYY' | 'YYYY-MM-DD'): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  const dateStr = format === 'DD.MM.YYYY'
    ? `${day}.${month}.${year}`
    : `${year}-${month}-${day}`;

  return `${dateStr} ${hours}:${minutes}`;
}

/**
 * Formats reactions as emoji string
 */
function formatReactions(reactions: TelegramReaction[]): string {
  return reactions
    .map(r => `${r.emoji} ${r.count}`)
    .join(' • ');
}

/**
 * Formats poll as readable text
 */
function formatPoll(poll: TelegramPoll): string {
  const lines: string[] = [];
  lines.push(`**Poll:** ${poll.question}`);
  for (const answer of poll.answers) {
    lines.push(`• ${answer.text} — ${answer.voters} votes`);
  }
  lines.push(`Total: ${poll.total_voters} voters`);
  return lines.join('\n');
}

/**
 * Formats a single message according to settings
 */
export function formatMessage(msg: ParsedMessage, settings: ConversionSettings): string {
  const lines: string[] = [];

  // Header line: #ID Author Timestamp
  const headerParts: string[] = [];
  headerParts.push(`**#${msg.id}**`);

  if (settings.includeAuthor) {
    headerParts.push(`**${msg.author}**`);
  }

  if (settings.includeTimestamp) {
    headerParts.push(formatDate(msg.date, settings.dateFormat));
  }

  lines.push(headerParts.join(' '));

  // Reply reference (always included)
  if (msg.replyToId) {
    lines.push(`↳ reply #${msg.replyToId}`);
  }

  // Forwarded from (if enabled)
  if (settings.includeForwarded && msg.forwardedFrom) {
    lines.push(`↳ forwarded from: ${msg.forwardedFrom}`);
  }

  // Message text
  if (msg.text) {
    lines.push(msg.text);
  }

  // Poll (if enabled)
  if (settings.includePolls && msg.poll) {
    lines.push(formatPoll(msg.poll));
  }

  // Reactions (if enabled)
  if (settings.includeReactions && msg.reactions && msg.reactions.length > 0) {
    lines.push(formatReactions(msg.reactions));
  }

  return lines.join('\n') + '\n';
}

/**
 * Counts words in a string
 */
export function countWords(text: string): number {
  return text.split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Creates file header with chat name and part number
 */
function createFileHeader(chatName: string, partNumber: number, totalParts: number): string {
  return `# ${chatName}\nЧасть ${partNumber} из ${totalParts}\n\n---\n\n`;
}

/**
 * Splits messages into chunks of max wordLimit words each
 * Returns array of file contents (without headers - they're added later)
 */
export function chunkMessages(
  messages: ParsedMessage[],
  settings: ConversionSettings
): { chunks: string[]; totalWords: number } {
  const chunks: string[] = [];
  let currentChunk = '';
  let currentWordCount = 0;
  let totalWords = 0;

  for (const msg of messages) {
    const formatted = formatMessage(msg, settings);
    const msgWordCount = countWords(formatted);
    totalWords += msgWordCount;

    // If single message exceeds limit, put it in its own chunk
    if (msgWordCount > settings.wordLimit) {
      // Save current chunk if not empty
      if (currentChunk) {
        chunks.push(currentChunk);
        currentChunk = '';
        currentWordCount = 0;
      }
      // Add large message as its own chunk
      chunks.push(formatted + '\n');
      continue;
    }

    // If adding this message would exceed limit, start new chunk
    if (currentWordCount + msgWordCount > settings.wordLimit && currentChunk) {
      chunks.push(currentChunk);
      currentChunk = '';
      currentWordCount = 0;
    }

    // Add message to current chunk
    currentChunk += formatted + '\n';
    currentWordCount += msgWordCount;
  }

  // Don't forget the last chunk
  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return { chunks, totalWords };
}

/**
 * Adds headers to chunks and returns final file contents
 */
export function finalizeChunks(
  chunks: string[],
  chatName: string
): string[] {
  return chunks.map((chunk, index) =>
    createFileHeader(chatName, index + 1, chunks.length) + chunk
  );
}
