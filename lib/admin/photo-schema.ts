/**
 * Schema zod pour valider un PhotoMetadata avant persistance.
 *
 * Correspond a l'interface PhotoMetadata de ./photo-manager.ts.
 * Utilise le mode par defaut de zod ("strip") : les champs inconnus sont
 * supprimes silencieusement, ce qui protege contre le prototype pollution
 * (`__proto__`, `constructor`) et les corruptions de schema sans casser
 * des ajouts futurs de champs cote admin front.
 *
 * @author Lalou
 * @date 2026-04-17
 */

import { z } from 'zod';

const LimitedEditionSchema = z.object({
  total: z.number(),
  sold: z.number(),
  available: z.number(),
  closed: z.boolean(),
});

const LimitedEditionGrandSchema = z.object({
  total: z.literal(9),
  sold: z.number(),
  available: z.number(),
  closed: z.boolean(),
});

const LimitedEditionPetitSchema = z.object({
  total: z.literal(99),
  sold: z.number(),
  available: z.number(),
  closed: z.boolean(),
});

const CanvasDetailsSchema = z.object({
  dimensions: z.string(),
  technique: z.string(),
  price: z.number(),
  weight: z.string().optional(),
});

const PricesSchema = z.object({
  unlimited: z
    .object({
      a4: z.number(),
      a3: z.number(),
      a2: z.number(),
    })
    .optional(),
  limited: z
    .object({
      a3: z.number(),
      a2: z.number(),
      a1: z.number(),
    })
    .optional(),
  xxl: z.number().optional(),
  monumental: z.number().optional(),
});

const EditionEntrySchema = z.object({
  total: z.number(),
  sold: z.number(),
  available: z.number(),
  numberingStart: z.number(),
  numberingEnd: z.number(),
});

const EditionSchema = z.object({
  type: z.enum(['limited', 'open']),
  count: z.number().optional(),
});

export const PhotoMetadataSchema = z.object({
  filename: z.string().min(1),
  path: z.string().min(1),

  title: z.string().optional(),
  year: z.number().optional(),
  seriesName: z.string().optional(),

  locations: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),

  categories: z.array(z.enum(['unlimited', 'limited', 'xxl', 'monumental'])),

  description: z.string().optional(),
  aiGenerated: z.boolean().optional(),

  material: z.enum(['semi-glossy', 'aluminum']).optional(),
  orientation: z.enum(['vertical', 'horizontal', 'auto']).optional(),
  aiDetectedOrientation: z.enum(['vertical', 'horizontal']).optional(),

  status: z.enum(['trash', 'to-sort']).nullable(),

  visible: z.boolean(),
  forSale: z.boolean(),

  accessLevel: z.enum(['public', 'early', 'vip']).optional(),
  productType: z.enum(['photo', 'canvas']).optional(),

  canvasDetails: CanvasDetailsSchema.optional(),

  photoCategory: z.enum(['empreinte', 'projection', 'atelier']).optional(),
  collection: z.string().optional(),
  publishDate: z.string().optional(),

  priceSigned: z.number().optional(),
  priceUnsigned: z.number().optional(),

  category: z.string().optional(),

  limitedEdition: LimitedEditionSchema.optional(),
  limitedEditionGrand: LimitedEditionGrandSchema.optional(),
  limitedEditionPetit: LimitedEditionPetitSchema.optional(),

  prices: PricesSchema.optional(),

  editions: z.record(z.string(), EditionEntrySchema).optional(),

  isNumberedSeries: z.boolean().optional(),
  price: z.number().optional(),
  edition: EditionSchema.optional(),
});

export const PhotoMetadataArraySchema = z.array(PhotoMetadataSchema);

// Limite taille body pour POST /api/admin/photos (protection DoS).
// 5 MB en chars ASCII. En UTF-8 multi-byte ca peut etre un peu plus en
// octets reels, mais ca reste largement suffisant pour un catalogue photo
// raisonnable.
export const MAX_POST_BODY_CHARS = 5 * 1024 * 1024;
