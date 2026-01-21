# PRD: Telegram Chat to NotebookLM Converter

## Overview

Web application for converting Telegram chat export (JSON) into text files optimized for Google NotebookLM import. The app splits large chat histories into chunks of max 3000 words each.

## Problem

Google NotebookLM has limits on source file size. Telegram chat exports are large JSON files with metadata. Users need a simple way to:
1. Clean the export (remove service messages, metadata)
2. Split into manageable chunks (max 3000 words)
3. Get plain text files ready for NotebookLM import

## Target Users

- Telegram users who want to analyze their chat history with NotebookLM
- Non-technical users (no command line, no installations)
- Mac and Windows users

## Solution

Modern web application deployed on Vercel. All file processing happens client-side in the browser (no server upload, privacy-friendly).

## Tech Stack

- **Framework**: Next.js 14+ (App Router) or plain Vite + React
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Deployment**: Vercel
- **Libraries**:
  - JSZip — for creating ZIP archives
  - File handling via native browser APIs

## Functional Requirements

### File Input
- Drag & drop zone for JSON file
- "Choose file" button as alternative
- Accept only `.json` files
- Show file name and size after selection
- Validate file structure before processing

### Processing
- Parse Telegram export JSON format
- Filter: keep only `type: "message"` entries (skip `type: "service"`)
- Extract from each message:
  - `from` (author name, handle null values)
  - `date` (formatted as `YYYY-MM-DD HH:MM`)
  - `text` (message content, handle both string and array formats)
- Skip messages with empty text
- Skip messages that contain only media without text

### Text Formatting
Each message formatted as:
```
[YYYY-MM-DD HH:MM] Author Name:
Message text here

```

### Chunking Logic
- Split into files of maximum **3000 words** each
- Count words using split by whitespace
- Never split a single message across files
- If one message exceeds 3000 words, put it in its own file
- Name files: `{chat_name}_part_001.txt`, `{chat_name}_part_002.txt`, etc.

### Output
- Generate ZIP archive containing all `.txt` files
- Auto-download ZIP when processing complete
- Show summary:
  - Chat name
  - Total messages processed
  - Messages skipped (service/empty)
  - Number of files created
  - Total words

### Settings Panel
- Word limit per file (default: 3000, range: 1000-5000)
- Include/exclude timestamps
- Include/exclude author names
- Date format selection (DD.MM.YYYY or YYYY-MM-DD)

## Non-Functional Requirements

### Performance
- Handle files up to 100MB
- Show progress bar during processing
- Use Web Workers for processing large files (non-blocking UI)
- Chunked file reading for memory efficiency

### UX
- Clean, modern design
- Russian language interface (primary users are Russian-speaking)
- Clear error messages with suggestions
- Mobile-friendly (responsive design)
- Dark mode support (optional, follows system preference)

### Browser Support
- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

## UI Design

### Main Screen
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│        Telegram → NotebookLM                        │
│        Конвертер чатов Telegram                     │
│                                                     │
│   Конвертируйте экспорт чата в файлы для           │
│   загрузки в Google NotebookLM                      │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│   ┌─────────────────────────────────────────────┐   │
│   │                                             │   │
│   │      📁                                     │   │
│   │      Перетащите файл result.json сюда      │   │
│   │      или нажмите для выбора                 │   │
│   │                                             │   │
│   │      Поддерживается экспорт из              │   │
│   │      Telegram Desktop                       │   │
│   │                                             │   │
│   └─────────────────────────────────────────────┘   │
│                                                     │
│   ┌─ Настройки ─────────────────────────────────┐   │
│   │ Слов в файле: [3000        ] ▼              │   │
│   │ ☑ Включать дату и время                    │   │
│   │ ☑ Включать имя автора                      │   │
│   └─────────────────────────────────────────────┘   │
│                                                     │
│   [ 🚀 Конвертировать ]                            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Result Screen
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│   ✅ Конвертация завершена!                        │
│                                                     │
│   ┌─────────────────────────────────────────────┐   │
│   │ Чат: GEELY Tugella (FY11) #Эксплуатация    │   │
│   │                                             │   │
│   │ 📨 Сообщений обработано: 15,234            │   │
│   │ ⏭️  Пропущено (служебные): 1,205            │   │
│   │ 📄 Создано файлов: 12                       │   │
│   │ 📝 Всего слов: 34,567                       │   │
│   └─────────────────────────────────────────────┘   │
│                                                     │
│   [ 📥 Скачать ZIP ] [ 🔄 Конвертировать другой ] │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Design Tokens
- Background: `#f8fafc` (light) / `#0f172a` (dark)
- Card: `#ffffff` / `#1e293b`
- Primary: `#2563eb` (blue-600)
- Success: `#16a34a` (green-600)
- Error: `#dc2626` (red-600)
- Border radius: `12px` for cards, `8px` for buttons
- Font: System font stack

## Telegram JSON Structure

### Input File Format
```json
{
  "name": "Chat Name",
  "type": "public_supergroup",
  "id": 1234567890,
  "messages": [
    {
      "id": 1,
      "type": "service",
      "date": "2020-02-06T14:11:27",
      "action": "migrate_from_group"
    },
    {
      "id": 13,
      "type": "message",
      "date": "2020-02-14T13:36:18",
      "from": "Username",
      "from_id": "user128800239",
      "text": "Simple text message"
    },
    {
      "id": 14,
      "type": "message",
      "date": "2020-02-14T13:37:21",
      "from": "Another User",
      "text": [
        {"type": "plain", "text": "Part of message "},
        {"type": "bold", "text": "bold text "},
        {"type": "link", "text": "https://example.com"}
      ]
    },
    {
      "id": 15,
      "type": "message",
      "date": "2020-02-14T13:40:00",
      "from": "User",
      "photo": "photos/photo.jpg",
      "text": ""
    }
  ]
}
```

### Text Field Handling
The `text` field can be:
1. **String**: `"text": "Hello world"` → use as-is
2. **Array**: `"text": [{"type": "plain", "text": "Hello"}]` → concatenate all `text` values
3. **Empty**: `"text": ""` → skip message

### Edge Cases
- `from` is `null` → use "Unknown" or skip
- `text` contains only whitespace → skip
- Message has `photo`/`video`/`file` but no text → skip
- Message has `forwarded_from` → optionally include

## Output Format

### File Naming
`{sanitized_chat_name}_part_{NNN}.txt`

Example: `GEELY_Tugella_FY11_part_001.txt`

### File Content
```
[2020-02-14 13:36] Dmitriy:
Есть слухи, что в сентябре привезут в РБ.

[2020-02-14 13:37] Andrey Poluhin:
Как понять, привезут? Выпускать не будут тут?

[2020-02-14 13:43] Dmitriy:
Как и SX11, крупноузловым способом

```

### ZIP Structure
```
chat_export.zip
├── GEELY_Tugella_FY11_part_001.txt
├── GEELY_Tugella_FY11_part_002.txt
├── GEELY_Tugella_FY11_part_003.txt
└── ...
```

## Project Structure

```
/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── FileDropzone.tsx
│   │   ├── SettingsPanel.tsx
│   │   ├── ConvertButton.tsx
│   │   ├── ProgressBar.tsx
│   │   └── ResultCard.tsx
│   ├── lib/
│   │   ├── telegram-parser.ts    # Parse Telegram JSON
│   │   ├── text-chunker.ts       # Split into word-limited chunks
│   │   ├── zip-creator.ts        # Create ZIP archive
│   │   └── utils.ts              # Helper functions
│   └── types/
│       └── telegram.ts           # TypeScript types for Telegram export
├── public/
│   └── favicon.ico
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

## Error Handling

### Validation Errors
| Error | Message |
|-------|---------|
| Wrong file type | "Пожалуйста, выберите JSON файл" |
| Invalid JSON | "Файл повреждён или имеет неверный формат" |
| Not Telegram export | "Это не похоже на экспорт из Telegram. Убедитесь, что вы экспортировали чат через Telegram Desktop" |
| No messages | "В файле не найдено сообщений" |
| File too large | "Файл слишком большой. Максимальный размер: 100MB" |

### Runtime Errors
- Show user-friendly error message
- Log technical details to console
- Offer to retry or select different file

## Success Criteria

1. User can convert Telegram export in under 30 seconds (for typical 10MB file)
2. Works without any installation or technical knowledge
3. Handles large files (50MB+) without browser crash
4. Output files are correctly sized (under 3000 words each)
5. ZIP downloads automatically after processing
6. Mobile users can use the app

## Future Enhancements (Out of Scope for v1)

- [ ] WhatsApp export support
- [ ] Discord export support
- [ ] Direct upload to Google Drive
- [ ] Preview of output before download
- [ ] Batch processing multiple chats
- [ ] English language toggle
- [ ] PWA support (install as app)
