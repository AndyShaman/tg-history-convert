// Telegram export JSON types

export interface TelegramTextEntity {
  type: string;
  text: string;
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
}

export interface TelegramExport {
  name: string;
  type: string;
  id: number;
  messages: TelegramMessage[];
}

export interface ParsedMessage {
  author: string;
  date: Date;
  text: string;
}

export interface ConversionSettings {
  wordLimit: number;
  includeTimestamp: boolean;
  includeAuthor: boolean;
  dateFormat: 'DD.MM.YYYY' | 'YYYY-MM-DD';
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
