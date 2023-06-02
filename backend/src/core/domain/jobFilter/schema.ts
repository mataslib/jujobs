import {z} from 'zod';
import {
  DurationTypes,
  durationTypeSchema,
  EmploymentTypes,
  employmentTypeSchema,
  LegalTypes,
  legalTypeSchema,
  Places,
  placeSchema,
} from '../job/schema';

export type JobFilterData = {
  fulltext?: string;
  place?: Places[];
  homeoffice?: boolean;
  legalType?: LegalTypes[];
  employmentType?: EmploymentTypes[];
  durationType?: DurationTypes[];
};

export const createParamsSchema = z.object({
  fulltext: z.string().optional(),
  place: z.array(placeSchema).optional(),
  homeoffice: z.boolean().optional(),
  legalType: z.array(legalTypeSchema).optional(),
  employmentType: z.array(employmentTypeSchema).optional(),
  durationType: z.array(durationTypeSchema).optional(),
});
export type CreateParams = z.infer<typeof createParamsSchema>;
