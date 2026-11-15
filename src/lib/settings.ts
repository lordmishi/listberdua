// Site settings written from the dashboard (src/data/pengaturan.json). The file is optional.
const files = import.meta.glob('../data/pengaturan.json', { eager: true, import: 'default' });
const raw = (Object.values(files)[0] ?? {}) as { whatsapp?: string };

// Stored as international digits without "+", e.g. 6281234567890.
export const whatsappNumber = /^62\d{8,13}$/.test(raw.whatsapp ?? '') ? raw.whatsapp! : null;

export function whatsappLink(text: string): string | null {
  return whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}` : null;
}

export const settingsRaw = raw;
