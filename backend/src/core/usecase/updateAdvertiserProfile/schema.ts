import {ObjectId} from 'mongodb';
import {z} from 'zod';
import {base64ImageRegex} from '../../shared/zod';

export const updateAdvertiserProfileInputSchema = z.object({
  advertiserId: z.string().transform(val => new ObjectId(val)),
  name: z.string().min(1, `povinné`).optional(),
  about: z.string().nullish().optional(),
  web: z.string().url().nullish().optional(),
  logo: z
    .string()
    .regex(base64ImageRegex(), 'není base64 zakódovaný obrázek')
    .nullish()
    .optional(),
});

export type UpdateAdvertiserProfileInput = {
  advertiserId: string;
  name?: string;
  about?: string | null;
  web?: string | null;
  logo?: string | null;
};
