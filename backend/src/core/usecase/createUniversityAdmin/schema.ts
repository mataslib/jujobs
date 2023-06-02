import {z} from 'zod';
export const createUniversityAdminSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, `Alespoň 8 znaků`),
});

export type CreateUniversityAdminInput = {
  email: string;
  password: string;
};
