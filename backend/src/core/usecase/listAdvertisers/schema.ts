import {ObjectId} from 'mongodb';
import {z} from 'zod';

export const listAdvertisersSchema = z.object({
  _id: z
    .string()
    .transform(v => new ObjectId(v))
    .optional(),
  fulltext: z.string().optional(),
  page: z.number().optional(),
});

export type ListAdvertisersInput = {
  fulltext?: string;
  _id?: string;
};
