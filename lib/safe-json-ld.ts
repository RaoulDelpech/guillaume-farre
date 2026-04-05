/**
 * Sanitize JSON-LD output to prevent XSS via script tag injection.
 * Escapes closing </script> tags that could break out of the JSON-LD block.
 *
 * @author Lalou
 */
export function safeJsonLd(obj: unknown): string {
  return JSON.stringify(obj).replace(/<\/script/gi, '<\\/script');
}
