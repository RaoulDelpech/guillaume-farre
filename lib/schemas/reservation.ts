/**
 * Schemas Zod partages front/back pour les reservations VIP.
 *
 * On garde une seule source de verite pour la forme du body et les
 * messages d'erreur visibles cote client. Les schemas sont volontairement
 * stricts (`strict()`) pour rejeter les champs non prevus a l'admission
 * cote API, ce qui evite que des champs leakes de tests/extensions
 * ne se retrouvent dans `data/reservations.json`.
 *
 * @author Lalou
 */

import { z } from 'zod';

export const COUNTRY_DEFAULT = 'FR';
export const MESSAGE_MAX_LENGTH = 500;

export const reservationAddressSchema = z
  .object({
    line1: z.string().trim().min(1, 'address.line1.required').max(100, 'address.line1.tooLong'),
    line2: z.string().trim().max(100, 'address.line2.tooLong').optional(),
    city: z.string().trim().min(1, 'address.city.required').max(50, 'address.city.tooLong'),
    postalCode: z
      .string()
      .trim()
      .min(2, 'address.postalCode.required')
      .max(20, 'address.postalCode.tooLong'),
    country: z
      .string()
      .trim()
      .length(2, 'address.country.invalid')
      .transform((v) => v.toUpperCase())
      .default(COUNTRY_DEFAULT),
  })
  .strict();

const baseReservationSchema = z
  .object({
    canvasId: z.union([z.number().int().positive(), z.string().min(1)]),
    firstName: z
      .string()
      .trim()
      .min(2, 'firstName.tooShort')
      .max(50, 'firstName.tooLong'),
    lastName: z
      .string()
      .trim()
      .min(2, 'lastName.tooShort')
      .max(50, 'lastName.tooLong'),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email('email.invalid')
      .max(200, 'email.tooLong'),
    phone: z
      .string()
      .trim()
      .min(10, 'phone.tooShort')
      .max(20, 'phone.tooLong'),
    address: reservationAddressSchema,
    message: z
      .string()
      .trim()
      .max(MESSAGE_MAX_LENGTH, 'message.tooLong')
      .optional()
      .or(z.literal('')),
    buyerType: z.enum(['particulier', 'professionnel']),
    siret: z
      .string()
      .trim()
      .regex(/^\d{14}$/, 'siret.invalid')
      .optional(),
    companyName: z
      .string()
      .trim()
      .min(1, 'companyName.required')
      .max(100, 'companyName.tooLong')
      .optional(),
  })
  .strict();

export const reservationBodySchema = baseReservationSchema.superRefine((data, ctx) => {
  if (data.buyerType === 'professionnel') {
    if (!data.siret) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['siret'],
        message: 'siret.required',
      });
    }
    if (!data.companyName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['companyName'],
        message: 'companyName.required',
      });
    }
  }
});

export type ReservationBody = z.infer<typeof reservationBodySchema>;
export type ReservationAddress = z.infer<typeof reservationAddressSchema>;
