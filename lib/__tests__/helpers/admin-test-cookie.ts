/**
 * Helper de test partage : genere un cookie admin HMAC valide pour les
 * tests qui mockent next/headers cookies() et veulent simuler une session
 * admin authentifiee.
 *
 * IMPORTANT : pose MAGIC_LINK_SECRET au top-level pour que l'import de
 * `@/lib/admin-cookie` qui suit puisse acceder au secret. Les tests qui
 * importent ce helper n'ont donc pas besoin de gerer l'env eux-memes.
 *
 * Usage :
 * ```ts
 * import { validAdminCookie } from '@/lib/__tests__/helpers/admin-test-cookie';
 * mockCookiesGet.mockReturnValue(validAdminCookie());
 * ```
 *
 * @author Lalou
 */

process.env.MAGIC_LINK_SECRET =
  process.env.MAGIC_LINK_SECRET || 'test-magic-link-secret-admin-shared';

import { signAdminCookie } from '@/lib/admin-cookie';

export function validAdminCookie(): { value: string } {
  return { value: signAdminCookie().value };
}
