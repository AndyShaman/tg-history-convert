import JSZip from 'jszip';
import { sanitizeChatName } from './telegram-parser';

/**
 * Creates a ZIP archive with all the markdown files
 */
export async function createZipArchive(
  files: string[],
  chatName: string
): Promise<Blob> {
  const zip = new JSZip();
  const sanitizedName = sanitizeChatName(chatName);

  for (let i = 0; i < files.length; i++) {
    const fileName = `${sanitizedName}_part_${String(i + 1).padStart(3, '0')}.md`;
    zip.file(fileName, files[i]);
  }

  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });

  return blob;
}

/**
 * Triggers download of a blob
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
