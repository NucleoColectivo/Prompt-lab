import type { CommunityExperimentEntry } from '../data/creativeExperiencesData';

export type ExportCardFormat = 'workshop-3x4' | 'social-4x5' | 'square-1x1';
export type ExportCardTheme = 'editorial-light' | 'gallery-dark';

export interface ExperimentCardExportOptions {
  format: ExportCardFormat;
  theme: ExportCardTheme;
  workshopLabel?: string;
  includeNotes?: boolean;
}

const FORMAT_DIMENSIONS: Record<ExportCardFormat, { width: number; height: number; label: string }> = {
  'workshop-3x4': { width: 1200, height: 1600, label: 'Ficha Taller (1200×1600)' },
  'social-4x5': { width: 1080, height: 1350, label: 'Redes 4:5 (1080×1350)' },
  'square-1x1': { width: 1080, height: 1080, label: 'Cuadrado 1:1 (1080×1080)' },
};

export function getFormatMeta(format: ExportCardFormat) {
  return FORMAT_DIMENSIONS[format];
}

function loadImageElement(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.referrerPolicy = 'no-referrer';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number
): string[] {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (!cleaned) return [];
  const words = cleaned.split(' ');
  const lines: string[] = [];
  let current = '';

  for (let i = 0; i < words.length; i++) {
    const candidate = current ? `${current} ${words[i]}` : words[i];
    if (ctx.measureText(candidate).width > maxWidth && current) {
      lines.push(current);
      current = words[i];
      if (lines.length === maxLines - 1) {
        const rest = [current, ...words.slice(i + 1)].join(' ');
        let clipped = rest;
        while (clipped.length > 3 && ctx.measureText(`${clipped}…`).width > maxWidth) {
          clipped = clipped.slice(0, -1).trimEnd();
        }
        lines.push(clipped === rest ? clipped : `${clipped}…`);
        return lines;
      }
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, maxLines);
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const imgRatio = img.naturalWidth / Math.max(1, img.naturalHeight);
  const boxRatio = w / Math.max(1, h);

  let sx = 0;
  let sy = 0;
  let sw = img.naturalWidth;
  let sh = img.naturalHeight;

  if (imgRatio > boxRatio) {
    sw = img.naturalHeight * boxRatio;
    sx = (img.naturalWidth - sw) / 2;
  } else {
    sh = img.naturalWidth / boxRatio;
    sy = (img.naturalHeight - sh) / 2;
  }

  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

export async function renderExperimentCardCanvas(
  entry: CommunityExperimentEntry,
  options: ExperimentCardExportOptions
): Promise<HTMLCanvasElement> {
  const { width, height } = FORMAT_DIMENSIONS[options.format];
  const isDark = options.theme === 'gallery-dark';
  const includeNotes = options.includeNotes !== false;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Theme tokens matching Núcleo Colectivo Visual Prompt Lab
  const colors = isDark
    ? {
        bg: '#101014',
        surface: '#17171F',
        border: '#2B2B36',
        ink: '#F4F2ED',
        muted: '#A8A59E',
        accent: '#F8C300',
        secondaryAccent: '#8C66EB',
        promptBg: '#0A0A0D',
        promptText: '#ECE9E1',
      }
    : {
        bg: '#F4F2ED',
        surface: '#FFFFFF',
        border: '#DEDAD0',
        ink: '#101014',
        muted: '#5B5B66',
        accent: '#F8C300',
        secondaryAccent: '#326BFF',
        promptBg: '#101014',
        promptText: '#F4F2ED',
      };

  const pad = Math.round(width * 0.055);
  const innerW = width - pad * 2;

  // Canvas backdrop
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, width, height);

  // Subtle architectural outer frame
  ctx.strokeStyle = colors.border;
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, pad * 0.45, pad * 0.45, width - pad * 0.9, height - pad * 0.9, 24);
  ctx.stroke();

  let cursorY = pad + 18;

  // Masthead top row
  ctx.fillStyle = colors.accent;
  ctx.fillRect(pad, cursorY - 14, 14, 14);

  ctx.font = '800 18px "Montserrat", "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = colors.ink;
  ctx.fillText('NÚCLEO COLECTIVO · VISUAL PROMPT LAB', pad + 26, cursorY - 1);

  const dateText = entry.createdAt || new Date().toISOString().slice(0, 10);
  ctx.font = '600 15px "JetBrains Mono", monospace';
  ctx.fillStyle = colors.muted;
  const dateWidth = ctx.measureText(dateText).width;
  ctx.fillText(dateText, width - pad - dateWidth, cursorY - 1);

  cursorY += 22;

  // Hairline divider
  ctx.strokeStyle = colors.border;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(pad, cursorY);
  ctx.lineTo(width - pad, cursorY);
  ctx.stroke();

  cursorY += 26;

  // Image Container (aspect adapts cleanly per format)
  const imgHeight =
    options.format === 'square-1x1'
      ? Math.round(height * 0.37)
      : options.format === 'social-4x5'
      ? Math.round(height * 0.38)
      : Math.round(height * 0.36);

  ctx.save();
  drawRoundedRect(ctx, pad, cursorY, innerW, imgHeight, 18);
  ctx.clip();

  const loadedImg = await loadImageElement(entry.image);
  if (loadedImg) {
    drawCoverImage(ctx, loadedImg, pad, cursorY, innerW, imgHeight);
  } else {
    const grad = ctx.createLinearGradient(pad, cursorY, pad + innerW, cursorY + imgHeight);
    grad.addColorStop(0, '#1C1B26');
    grad.addColorStop(1, '#2D2548');
    ctx.fillStyle = grad;
    ctx.fillRect(pad, cursorY, innerW, imgHeight);
  }

  // Soft bottom contrast scrim on image for clean category metadata
  const scrim = ctx.createLinearGradient(0, cursorY + imgHeight - 100, 0, cursorY + imgHeight);
  scrim.addColorStop(0, 'rgba(16,16,20,0)');
  scrim.addColorStop(1, 'rgba(16,16,20,0.82)');
  ctx.fillStyle = scrim;
  ctx.fillRect(pad, cursorY + imgHeight - 100, innerW, 100);

  ctx.font = '700 15px "JetBrains Mono", monospace';
  ctx.fillStyle = '#F8C300';
  ctx.fillText(
    `${entry.category.toUpperCase()}  ·  ${entry.toolUsed.toUpperCase()}`,
    pad + 22,
    cursorY + imgHeight - 22
  );
  ctx.restore();

  // Image frame border
  ctx.strokeStyle = colors.border;
  ctx.lineWidth = 1.5;
  drawRoundedRect(ctx, pad, cursorY, innerW, imgHeight, 18);
  ctx.stroke();

  cursorY += imgHeight + 34;

  // Title
  const titleSize = options.format === 'square-1x1' ? 30 : 36;
  ctx.font = `800 ${titleSize}px "Montserrat", "Plus Jakarta Sans", sans-serif`;
  ctx.fillStyle = colors.ink;
  const titleLines = wrapLines(ctx, entry.title, innerW, 2);
  for (const line of titleLines) {
    ctx.fillText(line, pad, cursorY);
    cursorY += titleSize + 10;
  }

  // Author + Workshop metadata line (unboxed, typographic separator)
  ctx.font = '600 16px "JetBrains Mono", monospace';
  ctx.fillStyle = colors.secondaryAccent;
  const metaParts = [
    entry.author || 'Creador/a Núcleo Lab',
    options.workshopLabel?.trim() || 'Galería de Experimentos',
  ];
  ctx.fillText(metaParts.join('  ·  '), pad, cursorY + 4);
  cursorY += 34;

  // Reserve footer space
  const footerHeight = 62;
  const bottomLimit = height - pad - footerHeight;
  const remainingHeight = Math.max(180, bottomLimit - cursorY);

  const notesBlockHeight =
    includeNotes && entry.notes.trim()
      ? options.format === 'square-1x1'
        ? 105
        : 155
      : 0;
  const gapBetweenBlocks = notesBlockHeight > 0 ? 18 : 0;
  const promptBoxHeight = Math.max(150, remainingHeight - notesBlockHeight - gapBetweenBlocks);

  // Prompt Box
  ctx.fillStyle = colors.promptBg;
  drawRoundedRect(ctx, pad, cursorY, innerW, promptBoxHeight, 16);
  ctx.fill();

  ctx.strokeStyle = isDark ? colors.border : '#101014';
  ctx.lineWidth = 1.5;
  drawRoundedRect(ctx, pad, cursorY, innerW, promptBoxHeight, 16);
  ctx.stroke();

  ctx.font = '700 13px "JetBrains Mono", monospace';
  ctx.fillStyle = colors.accent;
  ctx.fillText('PROMPT UTILIZADO', pad + 24, cursorY + 32);

  const promptFontSize = options.format === 'square-1x1' ? 15 : 17;
  const promptLineHeight = promptFontSize + 9;
  ctx.font = `400 ${promptFontSize}px "JetBrains Mono", monospace`;
  ctx.fillStyle = colors.promptText;
  const maxPromptLines = Math.max(3, Math.floor((promptBoxHeight - 64) / promptLineHeight));
  const promptLines = wrapLines(ctx, entry.prompt, innerW - 48, maxPromptLines);

  let py = cursorY + 62;
  for (const line of promptLines) {
    ctx.fillText(line, pad + 24, py);
    py += promptLineHeight;
  }

  cursorY += promptBoxHeight + gapBetweenBlocks;

  // Optional Process Notes Box
  if (notesBlockHeight > 0) {
    ctx.fillStyle = colors.surface;
    drawRoundedRect(ctx, pad, cursorY, innerW, notesBlockHeight, 14);
    ctx.fill();

    ctx.strokeStyle = colors.border;
    ctx.lineWidth = 1.5;
    drawRoundedRect(ctx, pad, cursorY, innerW, notesBlockHeight, 14);
    ctx.stroke();

    ctx.font = '700 13px "JetBrains Mono", monospace';
    ctx.fillStyle = colors.muted;
    ctx.fillText('NOTAS DE PROCESO Y APRENDIZAJE', pad + 22, cursorY + 30);

    const notesFontSize = options.format === 'square-1x1' ? 15 : 17;
    const notesLineHeight = notesFontSize + 8;
    ctx.font = `500 ${notesFontSize}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillStyle = colors.ink;
    const maxNoteLines = Math.max(2, Math.floor((notesBlockHeight - 54) / notesLineHeight));
    const noteLines = wrapLines(ctx, entry.notes, innerW - 44, maxNoteLines);

    let ny = cursorY + 58;
    for (const line of noteLines) {
      ctx.fillText(line, pad + 22, ny);
      ny += notesLineHeight;
    }
  }

  // Footer Provenance Strip
  const footerY = height - pad - 18;
  ctx.strokeStyle = colors.border;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pad, footerY - 26);
  ctx.lineTo(width - pad, footerY - 26);
  ctx.stroke();

  ctx.font = '600 13px "JetBrains Mono", monospace';
  ctx.fillStyle = colors.muted;
  ctx.fillText(
    'ARCHIVO CREATIVO · APRENDER HACIENDO CON IA RESPONSABLE',
    pad,
    footerY
  );

  const badgeRight = 'nucleo-colectivo · visual prompt lab';
  const badgeW = ctx.measureText(badgeRight).width;
  ctx.fillStyle = colors.ink;
  ctx.fillText(badgeRight, width - pad - badgeW, footerY);

  return canvas;
}

function sanitizeFileSlug(input: string): string {
  return (
    input
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 48) || 'experimento-nucleo'
  );
}

export function downloadCanvasAsPng(canvas: HTMLCanvasElement, title: string): void {
  const url = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = `nucleo-experimento-${sanitizeFileSlug(title)}.png`;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generates a standalone valid single-page PDF 1.4 binary embedding the rendered
 * JPEG canvas at exact proportional PDF points (zero popups, works inside iframes).
 */
export function downloadCanvasAsPdf(canvas: HTMLCanvasElement, title: string): void {
  const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.94);
  const base64 = jpegDataUrl.split(',')[1] || '';
  const binaryStr = atob(base64);
  const imgBytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    imgBytes[i] = binaryStr.charCodeAt(i);
  }

  // Fit inside A4 width (595.28 pt) preserving exact canvas aspect ratio
  const pdfWidth = 595.28;
  const pdfHeight = Number(((canvas.height / canvas.width) * pdfWidth).toFixed(2));
  const wStr = pdfWidth.toFixed(2);
  const hStr = pdfHeight.toFixed(2);

  const encoder = new TextEncoder();
  const chunks: Uint8Array[] = [];
  const offsets: number[] = [0];
  let byteLength = 0;

  const pushStr = (str: string) => {
    const bytes = encoder.encode(str);
    chunks.push(bytes);
    byteLength += bytes.length;
  };

  const pushBytes = (bytes: Uint8Array) => {
    chunks.push(bytes);
    byteLength += bytes.length;
  };

  const startObj = (objNum: number) => {
    offsets[objNum] = byteLength;
    pushStr(`${objNum} 0 obj\n`);
  };

  pushStr('%PDF-1.4\n%\xFF\xFF\xFF\xFF\n');

  // 1: Catalog
  startObj(1);
  pushStr('<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');

  // 2: Pages
  startObj(2);
  pushStr('<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');

  // 3: Page
  startObj(3);
  pushStr(
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${wStr} ${hStr}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`
  );

  // 4: Image XObject (DCTDecode JPEG)
  startObj(4);
  pushStr(
    `<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imgBytes.length} >>\nstream\n`
  );
  pushBytes(imgBytes);
  pushStr('\nendstream\nendobj\n');

  // 5: Content stream drawing image full-bleed onto the PDF page
  const contentStream = `q\n${wStr} 0 0 ${hStr} 0 0 cm\n/Im0 Do\nQ\n`;
  startObj(5);
  pushStr(`<< /Length ${contentStream.length} >>\nstream\n${contentStream}endstream\nendobj\n`);

  // Cross-reference table
  const xrefOffset = byteLength;
  pushStr('xref\n0 6\n0000000000 65535 f \n');
  for (let i = 1; i <= 5; i++) {
    const padded = String(offsets[i]).padStart(10, '0');
    pushStr(`${padded} 00000 n \n`);
  }

  pushStr(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);

  const merged = new Uint8Array(byteLength);
  let pos = 0;
  for (const chunk of chunks) {
    merged.set(chunk, pos);
    pos += chunk.length;
  }

  const blob = new Blob([merged], { type: 'application/pdf' });
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `nucleo-experimento-${sanitizeFileSlug(title)}.pdf`;
  link.href = blobUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(blobUrl), 2500);
}
