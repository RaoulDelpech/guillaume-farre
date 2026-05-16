/**
 * Encodage texte pour streams PDF.
 *
 * Les fonts Helvetica/Helvetica-Bold du contrat utilisent
 * `/Encoding /WinAnsiEncoding` (cf. lib/pdf/sale-contract.ts). Tout texte
 * destine au stream PDF doit donc etre converti en bytes WinAnsi (CP1252)
 * avant d'etre serialise via `Buffer.from(str, 'binary')`.
 *
 * Sans cette conversion :
 *   - `€` (U+20AC, UTF-8 3 bytes) etait rendu comme 3 glyphes parasites
 *     ("20/000‹" au lieu de "20 000 €").
 *   - `°` (U+00B0) ou son escape `\260` etait silencieusement omis avec
 *     StandardEncoding (rendant "n°910/2014" en "n910/2014").
 *   - L'espace fine `U+202F` produit par Intl.NumberFormat 'fr-FR' devenait
 *     un slash visible.
 *
 * @author Lalou
 */

/**
 * Mapping des codepoints Unicode > 0xFF vers leur byte WinAnsi (CP1252).
 * Ne couvre que les caracteres susceptibles d'apparaitre dans le contrat :
 * symbole euro, ponctuation typographique, espaces speciaux.
 */
const UNICODE_TO_WINANSI: Record<string, number> = {
  '€': 0x80, // €
  '‚': 0x82, // ‚
  'ƒ': 0x83, // ƒ
  '„': 0x84, // „
  '…': 0x85, // …
  '†': 0x86, // †
  '‡': 0x87, // ‡
  'ˆ': 0x88, // ˆ
  '‰': 0x89, // ‰
  'Š': 0x8a, // Š
  '‹': 0x8b, // ‹
  'Œ': 0x8c, // Œ
  'Ž': 0x8e, // Ž
  '‘': 0x91, // ‘
  '’': 0x92, // ’
  '“': 0x93, // “
  '”': 0x94, // ”
  '•': 0x95, // •
  '–': 0x96, // –
  '—': 0x97, // —
  '˜': 0x98, // ˜
  '™': 0x99, // ™
  'š': 0x9a, // š
  '›': 0x9b, // ›
  'œ': 0x9c, // œ
  'ž': 0x9e, // ž
  'Ÿ': 0x9f, // Ÿ
  ' ': 0x20, // narrow no-break space → espace classique (rendu correct)
};

/**
 * Convertit une chaine JavaScript (UTF-16) en chaine de bytes WinAnsi
 * representee en JS comme une chaine ou chaque char est dans [0x00..0xFF].
 *
 * Apres ce passage, `Buffer.from(result, 'binary')` produit les bytes exacts
 * attendus par un stream PDF Helvetica + WinAnsiEncoding.
 *
 * Les codepoints non mappables sont remplaces par `?` plutot que d'etre
 * silencieusement omis (preferable d'avoir un glyphe visible que des
 * caracteres invisibles trompeurs).
 */
export function toWinAnsi(text: string): string {
  let out = '';
  for (let i = 0; i < text.length; i++) {
    const ch = text.charAt(i);
    const cp = text.charCodeAt(i);
    if (cp < 0x80) {
      out += ch;
      continue;
    }
    if (cp >= 0xa0 && cp <= 0xff) {
      // Latin-1 supplement: identique en WinAnsi (incluant ° = 0xB0).
      out += ch;
      continue;
    }
    const mapped = UNICODE_TO_WINANSI[ch];
    if (mapped !== undefined) {
      out += String.fromCharCode(mapped);
      continue;
    }
    out += '?';
  }
  return out;
}

// Lalou
