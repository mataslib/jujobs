import {ObjectId} from 'mongodb';
import {z} from 'zod';

export const listJobsSchema = z.object({
  _id: z
    .string()
    .transform(v => new ObjectId(v))
    .optional(),
  advertiserId: z
    .string()
    .transform(v => new ObjectId(v))
    .optional(),
  fulltext: z.string().optional(),
  homeoffice: z.boolean().optional(),
  employmentType: z
    .array(
      z.union([
        z.literal('Plný úvazek'),
        z.literal('Zkrácený úvazek'),
        z.literal('Pracovní doba dle dohody'),
      ])
    )
    .nonempty()
    .optional(),
  legalType: z
    .array(
      z.union([
        z.literal('Dohoda o provedení práce'),
        z.literal('Dohoda o provedení činnosti'),
        z.literal('Pracovní smlouva'),
        z.literal('OSVČ'),
        z.literal('Stáž'),
        z.literal('Praxe'),
      ])
    )
    .nonempty()
    .optional(),
  durationType: z
    .array(
      z.union([
        z.literal('Krátkodobá'),
        z.literal('Krátkodobá s možností navázaní spolupráce'),
        z.literal('Dlouhodobá'),
      ])
    )
    .nonempty()
    .optional(),
  place: z
    .array(
      z.union([
        z.literal('Celá Česká republika'),
        z.literal('Jižní Čechy'),
        z.literal('Zahraničí'),
      ])
    )
    .nonempty()
    .optional(),
  approved: z.boolean().optional(),
  archived: z.boolean().optional(),
  page: z.number().optional(),
});

export type ListJobsInput = {
  _id?: string;
  advertiserId?: string;
  fulltext?: string;
  homeoffice?: boolean;
  employmentType?: (
    | 'Plný úvazek'
    | 'Zkrácený úvazek'
    | 'Pracovní doba dle dohody'
  )[];
  legalType?: (
    | 'Dohoda o provedení práce'
    | 'Dohoda o provedení činnosti'
    | 'Pracovní smlouva'
    | 'OSVČ'
    | 'Stáž'
    | 'Praxe'
  )[];
  durationType?: (
    | 'Krátkodobá'
    | 'Krátkodobá s možností navázaní spolupráce'
    | 'Dlouhodobá'
  )[];
  place?: ('Celá Česká republika' | 'Jižní Čechy' | 'Zahraničí')[];
  approved?: boolean;
  archived?: boolean;
};
