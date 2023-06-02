import {ObjectId} from 'mongodb';
import {z} from 'zod';
export const subscribeToNewJobNotificationInputSchema = z.object({
  userId: z.string().transform(val => new ObjectId(val)),
  filter: z
    .object({
      fulltext: z.string().optional(),
      place: z
        .array(
          z.union([
            z.literal('Celá Česká republika'),
            z.literal('Jižní Čechy'),
            z.literal('Zahraničí'),
          ])
        )
        .optional(),
      homeoffice: z.boolean().optional(),
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
        .optional(),
      employmentType: z
        .array(
          z.union([
            z.literal('Plný úvazek'),
            z.literal('Zkrácený úvazek'),
            z.literal('Pracovní doba dle dohody'),
          ])
        )
        .optional(),
      durationType: z
        .array(
          z.union([
            z.literal('Krátkodobá'),
            z.literal('Krátkodobá s možností navázaní spolupráce'),
            z.literal('Dlouhodobá'),
          ])
        )
        .optional(),
    })
    .optional(),
});

export type SubscribeToNewJobNotificationInput = {
  userId: string;
  filter?: {
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
  };
};
