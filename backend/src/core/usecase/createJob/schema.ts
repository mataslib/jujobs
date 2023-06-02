import {addMonths, startOfDay} from 'date-fns';
import {ObjectId} from 'mongodb';
import {ArrayAtLeastOne} from 'shared/src/typeUtils';
import {z} from 'zod';

export const createJobInputSchema = z.object({
  advertiserId: z.string().transform(val => new ObjectId(val)),
  // Job
  title: z.string().min(1, `povinné`),
  scope: z.string().min(1, `povinné`),
  text: z.string().min(1, `povinné`),
  requirements: z.string().min(1, `povinné`),
  benefits: z.string().min(1, `povinné`),
  salary: z.string().optional(),
  place: z.union([
    z.literal('Celá Česká republika'),
    z.literal('Jižní Čechy'),
    z.literal('Zahraničí'),
  ]),
  specificPlace: z.string().min(1, `povinné`),
  startDate: z.string().min(1, `povinné`),
  deadlineAt: z.coerce
    .date()
    .max(
      addMonths(new Date(), 3),
      `Může být nastaven maximálně 3 měsíce v budoucnu`
    )
    .min(startOfDay(new Date()), 'Nelze nastavit v minulosti'),
  other: z.string().optional(),
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
    .nonempty('povinné'),
  durationType: z
    .array(
      z.union([
        z.literal('Krátkodobá'),
        z.literal('Krátkodobá s možností navázaní spolupráce'),
        z.literal('Dlouhodobá'),
      ])
    )
    .nonempty('povinné'),
  employmentType: z
    .array(
      z.union([
        z.literal('Plný úvazek'),
        z.literal('Zkrácený úvazek'),
        z.literal('Pracovní doba dle dohody'),
      ])
    )
    .nonempty('povinné'),
  fieldTypes: z
    .array(
      z.union([
        z.literal('Administrativa'),
        z.literal('Doprava'),
        z.literal('Finance'),
        z.literal('Informační technologie'),
        z.literal('Kultura a sport'),
        z.literal('Management'),
        z.literal('Obchod a cestovní ruch'),
        z.literal('Obrana a ochrana'),
        z.literal('Právo'),
        z.literal('Služby'),
        z.literal('Stavebnictví'),
        z.literal('Věda a výzkum'),
        z.literal('Výchova a vzdělávání'),
        z.literal('Výroba a provoz'),
        z.literal('Zdravotnictví'),
        z.literal('Zemědělství a lesnictví'),
        z.literal('Jiné'),
      ])
    )
    .nonempty('povinné'),
  facultyTypes: z
    .array(
      z.union([
        z.literal('Ekonomická'),
        z.literal('Přírodovědecká'),
        z.literal('Pedagogická'),
        z.literal('Teologická'),
        z.literal('Rybářství a ochrany vod'),
        z.literal('Zemědělská a technologická'),
        z.literal('Filozofická'),
        z.literal('Zdravotně sociální'),
      ])
    )
    .optional(),
  homeoffice: z.boolean(),
  replyToEmail: z.string().min(1, `povinné`).email(),
});

export type CreateJobInput = {
  advertiserId: string;
  // Job
  title: string;
  scope: string;
  text: string;
  requirements: string;
  benefits: string;
  salary?: string | undefined;
  place: 'Celá Česká republika' | 'Jižní Čechy' | 'Zahraničí';
  specificPlace: string;
  startDate: string;
  deadlineAt: string | Date;
  other?: string | undefined;
  legalType: ArrayAtLeastOne<
    | 'Dohoda o provedení práce'
    | 'Dohoda o provedení činnosti'
    | 'Pracovní smlouva'
    | 'OSVČ'
    | 'Stáž'
    | 'Praxe'
  >;
  durationType: ArrayAtLeastOne<
    'Krátkodobá' | 'Krátkodobá s možností navázaní spolupráce' | 'Dlouhodobá'
  >;
  employmentType: ArrayAtLeastOne<
    'Plný úvazek' | 'Zkrácený úvazek' | 'Pracovní doba dle dohody'
  >;
  fieldTypes: ArrayAtLeastOne<
    | 'Administrativa'
    | 'Doprava'
    | 'Finance'
    | 'Informační technologie'
    | 'Kultura a sport'
    | 'Management'
    | 'Obchod a cestovní ruch'
    | 'Obrana a ochrana'
    | 'Právo'
    | 'Služby'
    | 'Stavebnictví'
    | 'Věda a výzkum'
    | 'Výchova a vzdělávání'
    | 'Výroba a provoz'
    | 'Zdravotnictví'
    | 'Zemědělství a lesnictví'
    | 'Jiné'
  >;
  facultyTypes?:
    | (
        | 'Ekonomická'
        | 'Přírodovědecká'
        | 'Pedagogická'
        | 'Teologická'
        | 'Rybářství a ochrany vod'
        | 'Zemědělská a technologická'
        | 'Filozofická'
        | 'Zdravotně sociální'
      )[]
    | undefined;
  homeoffice: boolean;
  replyToEmail: string;
};
