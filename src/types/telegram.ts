// Telegram export JSON types

export interface TelegramTextEntity {
  type: string;
  text: string;
}

export interface TelegramReaction {
  type: string;
  count: number;
  emoji: string;
}

export interface TelegramPollAnswer {
  text: string;
  voters: number;
  chosen: boolean;
}

export interface TelegramPoll {
  question: string;
  closed: boolean;
  total_voters: number;
  answers: TelegramPollAnswer[];
}

export interface TelegramMessage {
  id: number;
  type: 'message' | 'service';
  date: string;
  date_unixtime?: string;
  from?: string | null;
  from_id?: string;
  text: string | TelegramTextEntity[];
  text_entities?: TelegramTextEntity[];
  photo?: string;
  video?: string;
  file?: string;
  forwarded_from?: string;
  reply_to_message_id?: number;
  reactions?: TelegramReaction[];
  poll?: TelegramPoll;
}

export interface TelegramExport {
  name: string;
  type: string;
  id: number;
  messages: TelegramMessage[];
}

export interface ParsedMessage {
  id: number;
  author: string;
  date: Date;
  text: string;
  replyToId?: number;
  reactions?: TelegramReaction[];
  poll?: TelegramPoll;
  forwardedFrom?: string;
}

export interface ConversionSettings {
  wordLimit: number;
  includeTimestamp: boolean;
  includeAuthor: boolean;
  dateFormat: 'DD.MM.YYYY' | 'YYYY-MM-DD';
  includeReactions: boolean;
  includePolls: boolean;
  includeForwarded: boolean;
}

export interface ConversionResult {
  chatName: string;
  totalMessages: number;
  skippedMessages: number;
  filesCreated: number;
  totalWords: number;
  zipBlob: Blob;
}

export interface ProcessingProgress {
  stage: 'parsing' | 'formatting' | 'chunking' | 'zipping' | 'done';
  percent: number;
  message: string;
}
