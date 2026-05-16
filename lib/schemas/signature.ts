/**
 * Schema Zod pour le body de POST /api/reservations/[id]/sign.
 *
 * @author Lalou
 */

import { z } from 'zod';

const PNG_DATA_URL_PREFIX = 'data:image/png;base64,';

export const signaturePayloadSchema = z
  .object({
    signatureImage: z
      .string()
      .min(PNG_DATA_URL_PREFIX.length + 16, 'signatureImage.tooShort')
      .max(4_000_000, 'signatureImage.tooLong')
      .refine((v) => v.startsWith(PNG_DATA_URL_PREFIX), {
        message: 'signatureImage.invalid',
      }),
    fullName: z
      .string()
      .trim()
      .min(2, 'fullName.tooShort')
      .max(100, 'fullName.tooLong'),
  })
  .strict();

export type SignaturePayload = z.infer<typeof signaturePayloadSchema>;
